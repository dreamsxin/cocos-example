import { Huolong_MainColorGetWay } from "./enumerator_huolong"

export default class HuolongGameSetting {
    playerNum: number   // 玩家数量，4，6，8，9，10，12
    campNum: number     // 阵营数量，2，3，4
    groupNum: number    // 扑克牌副数，2-12
    lastCardsNum: number    // 底牌数量
    startLevel: number  // 初始等级，1-13
    endLevel: number    // 胜利等级，1-13
    thresholdsLevels: number[]      // 门槛等级，升级时不能跨越这些等级，必须依次在这些等级坐庄获胜
    jokerAfterEndLevel: boolean     // 是否需要打王才能胜利。打王时只有王牌和常主为主牌，且摘星无效
    isLastConstantMain: boolean    // 最后一级之后的一级牌是否为常主，只有此级不打时才有效，例如等级范围是3-A，则2对此项生效，此项为true则2为常主
    mainColorGetWay: Huolong_MainColorGetWay    // 确定主花色和首庄的方式
    lastCardsScoreDouble: boolean   // 底牌得分是否翻倍
    fullScore: number               // 满分
    fullScoreGotMain: boolean       // 闲家满分是否能夺庄
    lastCardsGotMain: boolean       // 闲家抠底是否能夺庄，如果 fullScoreGotMain 与 lastCardsGotMain 皆为 false，则需要满分+抠底才能夺庄
    noHalfScroreAddUpgrade: number  // 闲家得分不过半，庄家的多升级数，为0则不多升
    noScoreAddUpgrade: number       // 闲家得分为0，庄家的多升级数，为0则不多升
    joker1AddUpgrade: number        // 摘星大王加升级数
    joker2AddUpgrade: number        // 摘星小王加升级数
    haveJokerBaseUpgrade: number    // 摘星算总升级数基数
    noJokerBaseUpgrade: number      // 未摘星抠底算总升级数基数
    noLastCardsBaseUpgrade: number  // 未抠底算总升级数基数
    downgradeByJoker1: boolean      // 大王抠底能否打掉级
    downgradeByJoker2: boolean      // 小王抠底能否打掉级
    downgradeByMainCP: boolean      // 主花色主点抠底能否打掉级
    downgradeByUnMainCP: boolean    // 非主花色主点抠底能否打掉级
    downgradeByMain2: boolean       // 主2抠底能否打掉级
    downgradeByUnMain2: boolean     // 非主2抠底能否打掉级
    recordThisMatch: boolean        // 对对局数据进行记录以供复盘重播
    firstRoundGiveCardsDelay: number // 首局发牌间隔
    aroundOverDelay: number         // (View/本地用户使用)回合结束延迟
}