import { CardColor, PlayerSeatPosition } from "../../core/enumerator";
import { Huolong_GameEventResponse, Huolong_PlayerEvent } from "../../core/enumerator_huolong";
import HuolongGameSetting from "../../core/huolong_gameSetting";
import CI_Base from "./ci_base";

/**
 * 攉龙玩法(Controller)的对外接口
 */
export default interface CI_Huolong extends CI_Base {
    getGameSetting(): HuolongGameSetting
    getShowedCardsNum(): number
    getMainColor(): CardColor
    getMainPoint(): number
    getLoserPoint(): number
    getMainPlayer(): PlayerSeatPosition
    getNowScore(): number
    getMatchIndex(): number
    getRoundIndex(): number
    getLeadPlayer(): number
    responseEvent(seat: PlayerSeatPosition, event: Huolong_GameEventResponse): boolean
    playerOperate(seat: PlayerSeatPosition, event: Huolong_PlayerEvent, data: any): boolean
}