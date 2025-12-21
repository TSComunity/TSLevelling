const multiplierModes = require("../../json/multiplier_modes.json")
const {
  ContainerBuilder,
  TextDisplayBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  ThumbnailBuilder,
  SectionBuilder,
  SeparatorBuilder,
  MessageFlags
} = require('discord.js')
const ranks = require("../../consts/ranks.js")

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
    let foundUser = int.options.get("user") || int.options.get("member") // option is "user" if from context menu
    if (foundUser) member = foundUser.member
    if (!member) return tools.warn("That member couldn't be found!")

    // fetch server xp settings
    let db = await tools.fetchSettings(member.id)
    if (!db) return tools.warn("*noData")
    else if (!db.settings.enabled) return tools.warn("*xpDisabled")

    let currentXP = db.users[member.id]

    if (db.settings.rankCard.disabled) return tools.warn("Rank cards are disabled in this server!")
    
    // if user has no xp, stop here
    if (!currentXP || !currentXP.xp) return tools.noXPYet(foundUser ? foundUser.user : int.user)

    let xp = currentXP.xp

    let levelData = tools.getLevel(xp, db.settings, true)       // get user's level
    let maxLevel = levelData.level >= db.settings.maxLevel      // check if level is maxxed

    const levelRoles = tools.getRolesForLevel(
    levelData.level,
    db.settings.rewards
    )

    const levelRole = levelRoles[0] || null
    const levelRoleId = levelRole?.id
    const rank = ranks.find(r => r.roles.some(role => role.id === levelRoleId)) || null
    const role = rank.roles.find(r => r.id === levelRoleId) || null

    let remaining = levelData.xpRequired - xp
    let levelPercent = maxLevel ? 100 : (xp - levelData.previousLevel) / (levelData.xpRequired - levelData.previousLevel) * 100

    let multiplierData = tools.getMultiplier(member, db.settings)
    let multiplier = multiplierData.multiplier

    let barSize = 33    // how many characters the xp bar is
    let barRepeat = Math.round(levelPercent / (100 / barSize)) // .round() so bar can sometimes display as completely full and completely empty
    let progressBar = `${"▓".repeat(barRepeat)}${"░".repeat(barSize - barRepeat)} (${!maxLevel ? Number(levelPercent.toFixed(2)) + "%" : "MAX"})`

    let estimatedMin = Math.ceil(remaining / (db.settings.gain.min * (multiplier || multiplierData.role)))
    let estimatedMax = Math.ceil(remaining / (db.settings.gain.max * (multiplier || multiplierData.role)))

    // estimated number of messages to level up
    let estimatedRange = (estimatedMax == estimatedMin) ? `${tools.commafy(estimatedMax)} ${tools.extraS("mensaje", estimatedMax)}` : `${tools.commafy(estimatedMax)}-${tools.commafy(estimatedMin)} mensajes`

    // xp required to level up
    let nextLevelXP = (db.settings.rankCard.relativeLevel ? `${tools.commafy(xp - levelData.previousLevel)}/${tools.commafy(levelData.xpRequired - levelData.previousLevel)}` : `${tools.commafy(levelData.xpRequired)}`) + ` (${tools.commafy(remaining)} more)`

    let cardCol = db.settings.rankCard.embedColor
    if (cardCol == -1) cardCol = null

    let memberAvatar = member.displayAvatarURL()
    let foundCooldown = currentXP.cooldown || 0
    let cooldown = foundCooldown > Date.now() ? tools.timestamp(foundCooldown - Date.now()) : "Sin Cooldown!"

    let container = new ContainerBuilder()
        .setAccentColor(parseInt(rank?.color?.replace('#', ''), 16) || 3447003)
        .addMediaGalleryComponents([
            new MediaGalleryBuilder()
                .setId(0)
                .addItems([
                    new MediaGalleryItemBuilder()
                        .setURL(rank?.banner?.url)
                        .setDescription(rank?.banner?.alt)
                ])
        ])
        .addSeparatorComponents(new SeparatorBuilder())
        .addSectionComponents(new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent([
                    `## ${role.emoji} <@&${role.id}>`,
                    `### <:XP:1452305794136543263> XP`,
                    `${tools.commafy(xp)} (lvl ${levelData.level})`,
                    `### <:next_level:1452305794136543263> Siguiente Nivel`,
                    `${nextLevelXP}`,
                    `### <:cooldown:1452305790495887515> Cooldown`
                    `${cooldown}`,
                    `${progressBar}`,
                    `${estimatedRange} para el siguiente nivel`
                ].join('\n'))
            )
            .addTextDisplayComponents(
                new ThumbnailBuilder({ media: { url: memberAvatar } })
            )
        )

    let hideMult = db.settings.hideMultipliers

    let multRoles = multiplierData.roleList
    let multiplierInfo = []
    if ((!hideMult || multiplierData.role == 0) && multRoles.length) {
        let xpStr = multiplierData.role > 0 ? `${multiplierData.role}x XP` : "No se puede ganar XP!"
        let roleMultiplierStr = multRoles.length == 1 ? `${int.guild.id != multRoles[0].id ? `<@&${multRoles[0].id}>` : "Everyone"} - ${xpStr}` : `**${multRoles.length} roles** - ${xpStr}`
        multiplierInfo.push(roleMultiplierStr)
    }

    let multChannels = multiplierData.channelList
    if ((!hideMult || multiplierData.channel == 0) && multChannels.length && multiplierData.role > 0 && (multiplierData.role != 1 || multiplierData.channel != 1)) {
        let chXPStr = multChannels[0].boost > 0 ? `${multiplierData.channel}x XP` : "No se puede ganar XP!"
        let chMultiplierStr = `<#${multChannels[0].id}> - ${chXPStr}` // leaving room for multiple channels, via categories or vcs or something
        multiplierInfo.push(chMultiplierStr)
        if (multRoles.length) multiplierInfo.push(`**{multiplier}x XP** (${multiplierModes.channelStacking[multiplierData.channelStacking].toLowerCase()})`)
    }

    if (multiplierInfo.length) container.addFields([{ name: "<:buffies:1452368720608366653> Buffies", value: multiplierInfo.join("\n") }])

    else if (!db.settings.rewardSyncing.noManual && !db.settings.rewardSyncing.noWarning) {
        let syncCheck = tools.checkLevelRoles(int.guild.roles.cache, member.roles.cache, levelData.level, db.settings.rewards)
        if (syncCheck.incorrect.length || syncCheck.missing.length) container.addFields([{ name: "⚠ Nota", value: `¡Tus roles de nivel no están sincronizados correctamente! Escribe ${tools.commandTag("sync")} para solucionarlo.` }])
    }

    let isHidden = db.settings.rankCard.ephemeral || !!int.options.get("hidden")?.value
    return int.reply({components: container, flags: MessageFlags.IsComponentsV2, allowedMentions: { parse: [] }, ephemeral: isHidden})

}}