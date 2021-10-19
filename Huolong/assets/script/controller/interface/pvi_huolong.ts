import { PlayerSeatPosition, PlayerType } from "../../core/enumerator";
import { Huolong_GameEvent, Huolong_GameEventResponse, Huolong_PlayerEvent, Huolong_PlayerEventResult } from "../../core/enumerator_huolong";
import CI_Huolong from "./ci_huolong";
import PVI_Base from "./pvi_base";

/**
 * 攉龙玩家外壳(PlayerVector)对攉龙玩法控制器(Controller)的接口
 */
export default interface PVI_Huolong extends PVI_Base {

    // 获取属性

    /**
     * 设置裁判控制器，用于通知事件
     * @param controller 裁判
     */
    setController(controller: CI_Huolong): void

    /**
     * 设定玩家座次方位
     * @param seat 座次
     */
    setSeat(seat: PlayerSeatPosition): void

    /**
     * 裁判用，向该玩家通知事件
     * @param event 事件类型
     * @param data 事件数据
     */
    pushEvent(event: Huolong_GameEvent, data: any): void

    /**
     * 裁判用，反馈玩家操作结果
     * @param event 玩家操作类型
     * @param data 玩家操作结果
     */
    responseOperate(event: Huolong_PlayerEvent, result: Huolong_PlayerEventResult): void

}