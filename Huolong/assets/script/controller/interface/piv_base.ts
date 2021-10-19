import { CharacterInfo } from "../../core/characterInfo";
import { GameType, PlayerSeatPosition } from "../../core/enumerator";

/**
 * 玩家外壳(PlayerVector)对玩家处理器(PlayerItem)的接口
 * 玩家外壳(PlayerVector)是用于连接控制器(Controller)和玩家处理器(PlayerItem)之间的中转，负责处理与玩家类型无关的逻辑，例如消息发送、玩家流程控制
 */
export default interface PIV_Base {
    getGameType(): GameType
    getMySeat(): PlayerSeatPosition
    getInfo(): CharacterInfo
    getOtherInfo(seat: number): CharacterInfo
    getAllPlayersInfo(): CharacterInfo[]
}