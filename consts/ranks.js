const path = require('node:path')

const ranks = [
    {
        rank: 'bronze',
        color: '#a06262',
        banner: path.join(__dirname, '../assets/banners/bronze.webp'),
        roles: [
            {
                role_id: '1113898817469820928',
                emoji: '<:bronze_I:1452277446278643844>',
            },
            {
                role_id: '1113899141731459152',
                emoji: '<:bronze_II:1452277444190146753>',
            },
            {
                role_id: '1113899425572589720',
                emoji: '<:bronze_III:1452277442357231636>',
            }
        ]
    },
    {
        rank: 'silver',
        color: '#979c9f',
        banner: path.join(__dirname, '../assets/banners/silver.webp'),
        roles: [
            {
                role_id: '1113900292283584512',
                emoji: '<:silver_I:1452277440218140762>',
            },
            {
                role_id: '1113900721222451290',
                emoji: '<:silver_II:1452277437953081495>',
            },
            {
                role_id: '1113900816957440100',
                emoji: '<:silver_III:1452277436061450463>',
            }
        ]
    },
    {
        rank: 'gold',
        color: '#f1c40f',
        banner: path.join(__dirname, '../assets/banners/gold.webp'),
        roles: [
            {
                role_id: '1113900841338929152',
                emoji: '<:gold_I:1452277434350047344>',
            },
            {
                role_id: '1113901589716017192',
                emoji: '<:gold_II:1452277432059957470>',
            },
            {
                role_id: '1113901644221001828',
                emoji: '<:gold_III:1452277429661077698>',
            }
        ]
    },
    {
        rank: 'diamond',
        color: '#3498db',
        banner: path.join(__dirname, '../assets/banners/diamond.webp'),
        roles: [
            {
                role_id: '1113901773611077712',
                emoji: '<:diamond_I:1452277427161010349>',
            },
            {
                role_id: '1113901944910643320',
                emoji: '<:diamond_II:1452277425278025789>',
            },
            {
                role_id: '1113902025982365716',
                emoji: '<:diamond_III:1452277423482736835>',
            }
        ]
    },
    {
        rank: 'mythic',
        color: '#9b59b6',
        banner: path.join(__dirname, '../assets/banners/mythic.webp'),
        roles: [
            {
                role_id: '1113902078000107620',
                emoji: '<:mythic_I:1452277420114710559>',
            },
            {
                role_id: '1113902285068718080',
                emoji: '<:mythic_II:1452277418290315324>',
            },
            {
                role_id: '1113902336352473140',
                emoji: '<:mythic_III:1452277416272724072>',
            }
        ]
    },
    {
        rank: 'legendary',
        color: '#e74c3c',
        banner: path.join(__dirname, '../assets/banners/legendary.webp'),
        roles: [
            {
                role_id: '1113902413963853966',
                emoji: '<:legendary_I:1452277414053806303>',
            },
            {
                role_id: '1113902686966911047',
                emoji: '<:legendary_II:1452277411742875728>',
            },
            {
                role_id: '1113902725390930011',
                emoji: '<:legendary_III:1452277409826214023>',
            }
        ]
    },
    {
        rank: 'masters',
        color: '#f1c40f',
        banner: path.join(__dirname, '../assets/banners/masters.webp'),
        roles: [
            {
                role_id: '1168639778405752872',
                emoji: '<:masters_I:1452277407460622396>',
            },
            {
                role_id: '1168640076465590452',
                emoji: '<:masters_II:1452277405174726686>',
            },
            {
                role_id: '1168640303092216018',
                emoji: '<:masters_III:1452277403505266708>',
            }
        ]
    },
    {
        rank: 'pro',
        color: '#008f39',
        banner: path.join(__dirname, '../assets/banners/pro.webp'),
        roles: [
            {
                role_id: '1452270889226866801',
                emoji: '<:pro:1452277401177292860>',
            },
        ]
    }
]

module.exports = ranks