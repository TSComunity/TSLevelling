const { AttachmentBuilder, ContainerBuilder, TextDisplayBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, ThumbnailBuilder, SectionBuilder, SeparatorBuilder, MessageFlags } = require('discord.js')
const multiplierModes = require("../../json/multiplier_modes.json")
const ranks = require("../../consts/ranks.js")
const path = require("path")

module.exports = {
  metadata: {
    name: "rank",
    description: "View your current XP, level, and cooldown.",
    args: [
      { type: "user", name: "member", description: "Which member to view", required: false },
      { type: "bool", name: "hidden", description: "Hides the reply so only you can see it", required: false }
    ]
  },

  async run(client, int, tools) {
    // fetch member
    let member = int.member
    let foundUser = int.options.get("user") || int.options.get("member")
    if (foundUser) member = foundUser.member
    if (!member) return tools.warn("That member couldn't be found!")

    // fetch server xp settings
    let db = await tools.fetchSettings(member.id)
    if (!db) return tools.warn("*noData")
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")

    let currentXP = db.users[member.id]
    if (db.settings.rankCard.disabled) return tools.warn("Rank cards are disabled in this server!")
    if (!currentXP || !currentXP.xp) return tools.noXPYet(foundUser ? foundUser.user : int.user)

    let xp = currentXP.xp
    let levelData = tools.getLevel(xp, db.settings, true)
    let totalMsgs = tools.commafy(tools.commafy(tools.getMessages(currentXP)))
    let monthlyMsgs = tools.commafy(tools.commafy(tools.getMonthlyMessages(currentXP)))
    let maxLevel = levelData.level >= db.settings.maxLevel

    const levelRoles = tools.getRolesForLevel(levelData.level, db.settings.rewards)
    const levelRole = levelRoles[0] || null
    const levelRoleId = levelRole?.id
    const rank = ranks.find(r => r.roles.some(role => role.id === levelRoleId)) || null
    const role = rank.roles.find(r => r.id === levelRoleId) || null

    let remaining = levelData.xpRequired - xp
    let levelPercent = maxLevel ? 100 : (xp - levelData.previousLevel) / (levelData.xpRequired - levelData.previousLevel) * 100

    let multiplierData = tools.getMultiplier(member, db.settings)
    let multiplier = multiplierData.multiplier

    let barSize = 21 // 33
    let barRepeat = Math.round(levelPercent / (100 / barSize))
    let progressBar = `${"<:star_drop:1467144088779489311>".repeat(barRepeat)}${"<:star_drop_ghost:1467145846973010185>".repeat(barSize - barRepeat)} (${!maxLevel ? Number(levelPercent.toFixed(2)) + "%" : "MAX"})`

    let estimatedMin = Math.ceil(remaining / (db.settings.gain.min * (multiplier || multiplierData.role)))
    let estimatedMax = Math.ceil(remaining / (db.settings.gain.max * (multiplier || multiplierData.role)))
    let estimatedRange = (estimatedMax === estimatedMin) ? `${tools.commafy(estimatedMax)} ${tools.extraS("mensaje", estimatedMax)}` : `${tools.commafy(estimatedMax)}-${tools.commafy(estimatedMin)} mensajes`

    let nextLevelXP = `${tools.commafy(remaining)} XP para subir`

    let memberAvatar = member.displayAvatarURL()
    let foundCooldown = currentXP.cooldown || 0
    let cooldown = foundCooldown > Date.now() ? tools.timestamp(foundCooldown - Date.now()) : "Sin Cooldown!"

    function formatMessagesLine(total, monthly) {
      const icon = "**<:messages:1467163578699354235>** "
      const maxLength = "67.893 msgs (12.032 mes)".length

      // Nivel 1: texto completo
      let text = `**${total} mensajes** (${monthly} este mes)`
      if (text.length <= maxLength) return icon + text

      // Nivel 2: compactar "mensajes"
      text = `**${total} msgs** (${monthly} este mes)`
      if (text.length <= maxLength) return icon + text

      // Nivel 3: quitar "este"
      text = `**${total} msgs** (${monthly} mes)`
      return icon + text
    }

    // Crear attachment del banner
    const bannerPath = path.join(__dirname, "../../assets/banners/", rank.banner.url)
    const bannerAttachment = new AttachmentBuilder(bannerPath, { name: rank.banner.url })

    let container = new ContainerBuilder()
      .setAccentColor(parseInt(rank?.color?.replace('#', ''), 16) || 3447003)
      .addMediaGalleryComponents([
        new MediaGalleryBuilder()
          .setId(1)
          .addItems([
            new MediaGalleryItemBuilder()
              .setURL(`attachment://${rank.banner.url}`)
              .setDescription(rank.banner.alt)
          ])
      ])
      .addSeparatorComponents(new SeparatorBuilder())
      .addSectionComponents(new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent([
            `## ${role.emoji} <@&${role.id}>`,
            `**<:XP:1452305794136543263>** **Nivel ${levelData.level}** (${tools.commafy(xp)} XP)`,
            `**<:messages:1467163578699354235>** **${totalMsgs} ${totalMsgs > 0 ? 'msgs' : 'msg'}** (${monthlyMsgs} mes)`,
            `**<:next_level:1452305752390766633>** ${nextLevelXP}`,
            `**<:cooldown:1452305790495887515>** ${cooldown}`
          ].join('\n'))
        )
        .setThumbnailAccessory(new ThumbnailBuilder({ media: { url: memberAvatar } }))
      )

    let hideMult = db.settings.hideMultipliers
    let multRoles = multiplierData.roleList
    let multiplierInfo = []

    if ((!hideMult || multiplierData.role === 0) && multRoles.length) {
      for (const role of multRoles) {
        const xpStr =
          multiplierData.role > 0
            ? `${multiplierData.role}x XP`
            : "No se puede ganar XP!"

        const roleStr =
          int.guild.id != role.id
            ? `- <@&${role.id}> - ${xpStr}`
            : `- Everyone - ${xpStr}`

        multiplierInfo.push(roleStr)
      }
    }

    const multChannels = multiplierData.channelList
    if (
      (!hideMult || multiplierData.channel === 0) &&
      multChannels.length &&
      multiplierData.role > 0 &&
      (multiplierData.role != 1 || multiplierData.channel != 1)
    ) {
      for (const channel of multChannels) {
        const chXPStr =
          channel.boost > 0
            ? `${multiplierData.channel}x XP`
            : "No se puede ganar XP!"

        multiplierInfo.push(`- <#${channel.id}> - ${chXPStr}`)
      }

      if (multRoles.length) {
        multiplierInfo.push(
          `- **${multiplierData.channel}x XP** (${multiplierModes.channelStacking[multiplierData.channelStacking].toLowerCase()})`
        )
      }
    }

    if (multiplierInfo.length) {
        container.addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**<:buffies:1452368720608366653> Buffies:**\n${multiplierInfo.join("\n")}`))
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(progressBar))
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${estimatedRange} para el siguiente nivel`))
    } else {
        // Siempre mostrar la barra de progreso aunque no haya buffies ni problemas de sincronización
        container.addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(progressBar))
            .addSeparatorComponents(new SeparatorBuilder())
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${estimatedRange} para el siguiente nivel`))

        // Y solo mostrar el warning si corresponde
        if (!db.settings.rewardSyncing.noManual && !db.settings.rewardSyncing.noWarning) {
            let syncCheck = tools.checkLevelRoles(int.guild.roles.cache, member.roles.cache, levelData.level, db.settings.rewards);
            if (syncCheck.incorrect.length || syncCheck.missing.length) {
                container.addSeparatorComponents(new SeparatorBuilder())
                    .addTextDisplayComponents(new TextDisplayBuilder().setContent(`**⚠ Nota:** ¡Tus roles de nivel no están sincronizados correctamente! Escribe ${tools.commandTag("sync")} para solucionarlo.`))
            }
        }
    }

    let isHidden = db.settings.rankCard.ephemeral || !!int.options.get("hidden")?.value

    return int.reply({ 
      components: [container], 
      files: [bannerAttachment], 
      flags: MessageFlags.IsComponentsV2, 
      allowedMentions: { parse: [] }, 
      ephemeral: isHidden 
    })
  }
}