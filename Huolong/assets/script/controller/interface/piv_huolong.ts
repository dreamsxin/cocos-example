import { CardColor, PlayerSeatPosition } from "../../core/enumerator";
import { Huolong_GameEvent, Huolong_GameEventResponse, Huolong_PlayerEvent, Huolong_PlayerEventResult } from "../../core/enumerator_huolong";
import HuolongGameSetting from "../../core/huolong_gameSetting";
import PIV_Base from "./piv_base";

/**
 * 攉龙玩家外壳(PlayerVector)对攉龙玩家处理器(PlayerItem)的接口
 */
export default interface PIV_Huolong extends PIV_Base {
    responseEvent(event: Huolong_GameEventResponse): void
    callOperate(event: Huolong_PlayerEvent, data: any): void
    getMainPlayer(): PlayerSeatPosition
    getMainColor(): CardColor
    getMainPoint(): number
    getGameSetting(): HuolongGameSetting
    getShowedCardsNum(): number
    getLoserPoint(): number
    getMatchIndex(): number
    getRoundIndex(): number
    getLeadPlayer(): number
    getNowScore(): number
}