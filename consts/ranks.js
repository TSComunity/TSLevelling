const path = require('node:path')

const ranks = [
    {
        rank: 'bronze',
        color: '#a06262',
        banner: {
            url: path.join(__dirname, '../assets/banners/bronze.webp'),
            alt: 'Bronze Rank Banner'
        },
        roles: [
            { id: '1113898817469820928', name: 'Bronce I', emoji: '<:bronze_I:1452277446278643844>' },
            { id: '1113899141731459152', name: 'Bronce II', emoji: '<:bronze_II:1452277444190146753>' },
            { id: '1113899425572589720', name: 'Bronce III', emoji: '<:bronze_III:1452277442357231636>' }
        ]
    },
    {
        rank: 'silver',
        color: '#979c9f',
        banner: {
            url: path.join(__dirname, '../assets/banners/silver.webp'),
            alt: 'Silver Rank Banner'
        },
        roles: [
            { id: '1113900292283584512', name: 'Plata I', emoji: '<:silver_I:1452277440218140762>' },
            { id: '1113900721222451290', name: 'Plata II', emoji: '<:silver_II:1452277437953081495>' },
            { id: '1113900816957440100', name: 'Plata III', emoji: '<:silver_III:1452277436061450463>' }
        ]
    },
    {
        rank: 'gold',
        color: '#f1c40f',
        banner: {
            url: path.join(__dirname, '../assets/banners/gold.webp'),
            alt: 'Gold Rank Banner'
        },
        roles: [
            { id: '1113900841338929152', name: 'Oro I', emoji: '<:gold_I:1452277434350047344>' },
            { id: '1113901589716017192', name: 'Oro II', emoji: '<:gold_II:1452277432059957470>' },
            { id: '1113901644221001828', name: 'Oro III', emoji: '<:gold_III:1452277429661077698>' }
        ]
    },
    {
        rank: 'diamond',
        color: '#3498db',
        banner: {
            url: path.join(__dirname, '../assets/banners/diamond.webp'),
            alt: 'Diamond Rank Banner'
        },
        roles: [
            { id: '1113901773611077712', name: 'Diamante I', emoji: '<:diamond_I:1452277427161010349>' },
            { id: '1113901944910643320', name: 'Diamante II', emoji: '<:diamond_II:1452277425278025789>' },
            { id: '1113902025982365716', name: 'Diamante III', emoji: '<:diamond_III:1452277423482736835>' }
        ]
    },
    {
        rank: 'mythic',
        color: '#9b59b6',
        banner: {
            url: path.join(__dirname, '../assets/banners/mythic.webp'),
            alt: 'Mythic Rank Banner'
        },
        roles: [
            { id: '1113902078000107620', name: 'Mítico I', emoji: '<:mythic_I:1452277420114710559>' },
            { id: '1113902285068718080', name: 'Mítico II', emoji: '<:mythic_II:1452277418290315324>' },
            { id: '1113902336352473140', name: 'Mítico III', emoji: '<:mythic_III:1452277416272724072>' }
        ]
    },
    {
        rank: 'legendary',
        color: '#e74c3c',
        banner: {
            url: path.join(__dirname, '../assets/banners/legendary.webp'),
            alt: 'Legendary Rank Banner'
        },
        roles: [
            { id: '1113902413963853966', name: 'Legendario I', emoji: '<:legendary_I:1452277414053806303>' },
            { id: '1113902686966911047', name: 'Legendario II', emoji: '<:legendary_II:1452277411742875728>' },
            { id: '1113902725390930011', name: 'Legendario III', emoji: '<:legendary_III:1452277409826214023>' }
        ]
    },
    {
        rank: 'masters',
        color: '#f1c40f',
        banner: {
            url: path.join(__dirname, '../assets/banners/masters.webp'),
            alt: 'Masters Rank Banner'
        },
        roles: [
            { id: '1168639778405752872', name: 'Maestro I', emoji: '<:masters_I:1452277407460622396>' },
            { id: '1168640076465590452', name: 'Maestro II', emoji: '<:masters_II:1452277405174726686>' },
            { id: '1168640303092216018', name: 'Maestro III', emoji: '<:masters_III:1452277403505266708>' }
        ]
    },
    {
        rank: 'pro',
        color: '#008f39',
        banner: {
            url: path.join(__dirname, '../assets/banners/pro.webp'),
            alt: 'Pro Rank Banner'
        },
        roles: [
            { id: '1452270889226866801', name: 'Pro', emoji: '<:pro:1452277401177292860>' }
        ]
    }
]

module.exports = ranks