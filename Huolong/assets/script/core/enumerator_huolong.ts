// 单局游戏阶段状态
export enum Huolong_GameState {
    gaming, // 游戏进行
    idle,   // 局间等待
}

// 单局游戏阶段状态
export enum Huolong_MatchState {
    idle,   // 局间等待
    waitingResponse, // 等待玩家回复，只有在这种状态下，回复才是有效的
    givingCards,    // 发牌
    givingLastCards,    // 发底牌
    rounding,   // 出牌
}

// 由裁判向玩家下发的通知事件, 用于通知玩家当前游戏状态以及下一步操作
export enum Huolong_GameEvent {
    startGame,      // 游戏开始, 不需要返回
    startMatch,     // 下一局开始, 要求返回 matchReady, 收到所有玩家 matchReady 之后开始新一局
    giveCard,       // 发牌阶段, 发一张牌, 不需要返回
    giveAllCards,   // 发牌阶段, 一次性发出（剩下的）全部牌, 如果不需要等待 showStar 操作, 将会使用此逻辑发牌, 不需要返回
    gaveCardsOver,  // 发牌阶段完毕, 要求返回 cardsGot
    playerShowedStar,   //有玩家亮王牌时通知, 不需要返回
    matchAborted_nobodyShown,    // 首局发牌完毕无人亮王，本局重新开始。需要返回 matchAborted_nobodyShown_confirm
    sendLastCards,  // 发底牌通知, 不需要返回, 但此后需要每个玩家发送 throwLastCards 才能继续
    threwLastCards, // 庄家埋底牌完毕, 此事件中将包含：底牌最终内容, 自己埋入底牌的手牌, 摘星返还的手牌, 非摘星情况下非庄家玩家看不到底牌内容, 要求返回 lastCardsConfirm, 所有玩家 lastCardsConfirm 之后才会进行下一回合
    askForThrow,    // 要求玩家出牌, 事件中包含限定的牌型和花色, 除非没有符合要求的花色, 否则不按要求出牌将返回失败, 不需要直接返回, 但需要该玩家发送 throwCard 才能继续
    playerThrew,    // 有玩家出了牌, 不需要返回
    roundReport,    // 一回合出牌结束, 通报本回合结果, 要求返回 roundConfirm, 所有玩家 roundConfirm 之后才会进行下一回合
    matchReport,    // 一局结束, 通报本局结果, 要求返回 matchConfirm
    gameReport,     // 游戏结束, 不需要返回
    playerInfoChanged,  // 玩家信息变更时发送, 不需要返回
}

// 裁判发送的一些通知所需要的回执, 这种回执没有数据内容, 有数据内容的应当设计为 PlayerEvent
export enum Huolong_GameEventResponse {
    matchReady,
    cardsGot,
    matchAborted_nobodyShown_confirm,
    lastCardsConfirm,
    roundConfirm,
    matchConfirm,
}

// 玩家操作事件, 用于向裁判发送执行操作, 每一个玩家操作都会收到一个回执, 以得知操作是否成功
export enum Huolong_PlayerEvent {
    showStar,   // 首局亮王牌操作, 必须在收到 gaveCardsOver 之前, 之后的无效
    throwLastCard,  // 埋底牌或摘星操作, 发完牌后每个玩家都必须发送, 非庄家玩家不摘星的需要发送无牌操作
    throwCard,  // 出牌
}

export enum Huolong_PlayerEventResult {
    success,

    cannotPushEvent,        // 此时不能受理任何操作事件

    starCannotShow,         // 此时不能亮王
    starCardsNotEnough,     // 你所要亮的大王牌数量不达要求
    starCardsYouDonnotHave, // 你没有你所声称的那么多大王牌

    lastCardsCannotThrow,   // 此时不能埋底
    lastCardsRepeated,      // 埋底牌数组里出现重复牌
    lastCardsNumberWrong,   // 庄家埋底数量错误
    lastCardsTypeError,     // 非庄家玩家不能埋除大王以外的牌
    lastCardsYouDonnotHave, // 你没有你所声称要埋底的牌

    threwCardsUnavailable,  // 不是出牌时机
    threwCardsRepeated,     // 打出的牌数组里出现重复牌
    threwCardsTypeWrong,    // 首家出牌牌型不符合要求（多张牌不同）
    threwCardsNumberWrong,  // 出牌数量不符合要求
    threwCardsColorWrong,   // 出牌花色不符合要求
    threwCardsYouDonnotHave,// 你没有你所声称要打出的牌

    cannotResolve,          // 未知的玩家操作命令
}

export enum Huolong_MainColorGetWay {
    allRandom,
    firstMatchShowStar,
    firstMatchShowMain,
    everyMatchShowStar,
    everyMatchShowMain,
    everyMatchRandom,
    randomMainPlayerWithColorSpade,
    randomMainPlayerWithColorHeart,
    randomMainPlayerWithColorCube,
    randomMainPlayerWithColorDiamond,
}