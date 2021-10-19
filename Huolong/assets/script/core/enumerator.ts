export enum WechatFailedReason {
    successful,
    notInWechatPlatform,
    noLoginData,
    userRefusedAccess,
    accessGotFailure,
    loginFailed,
}

export enum SystemEventType {
    onMyInfoChanged,
    onPlayerInfoChanged,
    onSystemSettingChanged,
    onPlayerExitGame,
    onPlayerOffline,
}

export enum Gender {
    unknown,
    male,
    female,
    other
}


export enum ImageType {
    unknown,
    innerId,
    innerResource,
    imageUrl,
}

// 玩法
export enum GameType {
    none,
    huolong,        // 攉龙
    chudadi,        // 锄大地
    doudizhu,       // 斗地主
    zhuohongsan,    // 捉红三
    paodekuai,      // 跑得快
    gongzhu,        // 拱猪
}

// 扑克牌花色
export enum CardColor {
    spades, // 黑桃
    heart, // 红桃
    cube, // 草花
    diamond, // 方片
    joker, //王牌
}

// 扑克牌洗牌方式
export enum CardRandomWay {
    allRandom,  // 全随机, 正常洗牌模式
    allRanked,     // 按照初始序列排序, 通常用于 debug
    partRanked, // 一部分牌指定
}

// 玩家类型
export enum PlayerType {
    host,
    network,
    ai,
}

// 玩家位置绝对方位
export enum PlayerSeatPosition {
    north,
    west,
    south,
    east,
    unknown,
}

// 玩家位置相对方位
export enum PlayerSeatRelation {
    self,
    next,
    across,
    back,
    unknown,
}