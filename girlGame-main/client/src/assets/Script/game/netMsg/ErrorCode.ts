export class ErrorCode {
    //  成功，一般不使用
    public static SUCCESS: number = 0;
    public static ERR_CLI_PARAMS_ILLEGAL: number = 10001;
    public static ERR_PLAYER_SIGNIN_TOKEN_VERIFY_FAILURE: number = 20001;
    public static ERR_PLAYER_NON_EXISTENT: number = 20002;
    public static ERR_PLAYER_EXISTS: number = 20003;
    public static ERR_PLAYER_NAME_REPEAT: number = 20004;
    public static ERR_PLAYER_CREAT_FAILURE: number = 20005;

    public static ERR_PLAYER_DIAMOND_NOT_ENOUGH = 20006;// { code: 20006, message: "玩家元宝不足" },
    public static ERR_PLAYER_SILVER_NOT_ENOUGH = 20007;//: { code: 20007, message: "玩家银两不足" },
    public static ERR_PLAYER_GOLD_NOT_ENOUGH = 20008;//: { code: 20008, message: "玩家铜钱不足" },

    // 随从错误码
    public static ERR_HERO_NON_EXISTENT = 20101;//: { code: 20101, message: "随从不存在" },
    public static ERR_HERO_LEVEL_IS_MAXIMUM = 20102;//: { code: 20102, message: "随从等级已达最大" },
    public static ERR_HERO_STEP_IS_MAXIMUM = 20103;//: { code: 20103, message: "随从突破已达上限" },
    public static ERR_HERO_STEP_LEVEL_LIMITED = 20104;//: { code: 20104, message: "随从等级不足" },
    public static ERR_HERO_EVOLUTION_IS_MAXIMUM = 20105;//: { code: 20105, message: "随从升星已达上限" },
    public static ERR_HERO_EVOLUTION_STEP_LEVEL_LIMITED = 20106;//: { code: 20106, message: "随从突破等级不足" },

    // 道具错误码
    public static ERR_ITEM_NOT_ENOUGH = 20201;//: { code: 20201, message: "道具不足" },

}