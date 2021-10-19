module.exports = {
    ERR_CLI_PARAMS_ILLEGAL: { code: 10001, message: "客户端参数错误" },
    ERR_SERV_INTERNAL_ILLEGAL: { code: 10002, message: "服务器内部错误" },
    // 玩家错误码
    ERR_PLAYER_SIGNIN_TOKEN_VERIFY_FAILURE: { code: 20001, message: "玩家登陆token已失效" },
    ERR_PLAYER_NON_EXISTENT: { code: 20002, message: "玩家不存在" },
    ERR_PLAYER_EXISTS: { code: 20003, message: "玩家已存在" },
    ERR_PLAYER_NAME_REPEAT: { code: 20004, message: "玩家名称重复" },
    ERR_PLAYER_CREAT_FAILURE: { code: 20005, message: "玩家创角失败" },
    ERR_PLAYER_DIAMOND_NOT_ENOUGH: { code: 20006, message: "玩家元宝不足" },
    ERR_PLAYER_SILVER_NOT_ENOUGH: { code: 20007, message: "玩家银两不足" },
    ERR_PLAYER_GOLD_NOT_ENOUGH: { code: 20008, message: "玩家铜钱不足" },
    ERR_PLAYER_VITALITY_NOT_ENOUGH: { code: 20009, message: "玩家体力不足" },
    ERR_PLAYER_CLOTHING_FACE_NOT_UNLOAD: { code: 20010, message: "玩家妆容无法卸下" },
    ERR_PLAYER_CLOTHING_DRESS_NOT_FULL: { code: 20011, message: "玩家上下装需同时穿" },

    // 随从错误码
    ERR_HERO_NON_EXISTENT: { code: 20101, message: "随从不存在" },
    ERR_HERO_LEVEL_IS_MAXIMUM: { code: 20102, message: "随从等级已达最大" },
    ERR_HERO_STEP_IS_MAXIMUM: { code: 20103, message: "随从突破已达上限" },
    ERR_HERO_STEP_LEVEL_LIMITED: { code: 20104, message: "随从等级不足" },
    ERR_HERO_EVOLUTION_IS_MAXIMUM: { code: 20105, message: "随从升星已达上限" },
    ERR_HERO_EVOLUTION_STEP_LEVEL_LIMITED: { code: 20106, message: "随从突破等级不足" },
    ERR_HERO_EMBATTLE_REAL_IN_POSITION: { code: 20107, message: "随从已在布阵位置上" },

    // 道具错误码
    ERR_ITEM_NOT_ENOUGH: { code: 20201, message: "道具不足" },

    // 副本错误码
    ERR_QUEST_LOCKED: { code: 20301, message: "副本未解锁" },
    ERR_QUEST_REAL_UNLOCKED: { code: 20302, message: "副本已解锁" },
    ERR_QUEST_NOT_STORY: { code: 20303, message: "副本非剧情副本" },
    ERR_QUEST_CONDITION_LEVEL_NOT_MEET_CONDITION: { code: 20304, message: "副本玩家等级不满足条件" },
    ERR_QUEST_CONDITION_INTIMACY_NOT_MEET_CONDITION: { code: 20305, message: "副本玩家亲密不满足条件" },
    ERR_QUEST_CONDITION_UNLOCK_NOT_MEET_CONDITION: { code: 20306, message: "副本玩家通过章节不满足条件" },
    ERR_QUEST_CONDITION_POWER_NOT_MEET_CONDITION: { code: 20307, message: "副本玩家战力不满足条件" },
    ERR_QUEST_NOT_FIGHT: { code: 20308, message: "副本非战斗副本" },
    ERR_QUEST_NOT_CLOTHING: { code: 20309, message: "副本非配装副本" },
    ERR_QUEST_STAR_AWARD_GETED: { code: 20310, message: "星级宝箱已领取" },
    ERR_QUEST_STAR_AWARD_NEED_STAR_LIMITED: { code: 20311, message: "星级宝箱条件未达到要求" },
    ERR_QUEST_BATTLE_NOT_EMBATTLE: { code: 20312, message: "副本战斗未布阵" },

    // 模拟经营
    ERR_SIMULATION_WAREHOUSE_FULL: { code: 20401, message: "仓库已满" },
    ERR_SIMULATION_PRODUCT_NON_EXISTENT: { code: 20402, message: "还未生产出产物" },
    ERR_SIMULATION_PRODUCT_IS_FULL: { code: 20403, message: "产物已满" },
    ERR_SIMULATION_CAREER_LIMITED: { code: 20404, message: "升级官阶未达到要求" },
    ERR_SIMULATION_ORDER_REFRESH_COUNT_NOT_ENOUGH: { code: 20405, message: "订单无刷新次数" },
    ERR_SIMULATION_ORDER_GETED: { code: 20406, message: "订单已领取" },
    ERR_SIMULATION_WAREHOUSE_LV_MAX: { code: 20407, message: "仓库等级已达最大" },
}