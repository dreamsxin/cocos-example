module.exports = [
    {
        name: "mainrole_level",
        minetype: "xls",
        type: "object",
        primary_key: "id"
    },
    {
        name: "item",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "hero_info",
        minetype: "xls",
        type: "object",
        primary_key: "id",
        indexs: ["initial_star"]
    },
    {
        name: "hero_properties",
        minetype: "xls",
        type: "object",
        primary_key: "id",
        indexs: ["name_id"]
    },
    {
        name: "hero_levelexp",
        minetype: "xls",
        type: "object",
        primary_key: "id"
    },
    {
        name: "hero_step",
        minetype: "xls",
        type: "object",
        primary_key: "id",
        indexs: ["role_id"]
    },
    {
        name: "hero_evolution",
        minetype: "xls",
        type: "object",
        primary_key: "id",
        indexs: ["hero_id"]
    },
    {
        name: "skill_data",
        minetype: "xls",
        type: "object",
        primary_key: "id",
        indexs: ["name"]
    },
    {
        name: "skill_effect",
        minetype: "xls",
        type: "object",
        primary_key: "id"
    },
    {
        name: "section",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "pve_battle",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "npc_info",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "drop_packet",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "accessorie",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "accessorie_task",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "chapter",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "gacha",
        minetype: "xlsx",
        type: "object",
        primary_key: "id"
    },
    {
        name: "business",
        minetype: "xlsx",
        type: "object",
        primary_key: "level"
    },
    {
        name: "order_task",
        minetype: "xlsx",
        type: "object",
        primary_key: "id",
        indexs: ["level"]
    }
]