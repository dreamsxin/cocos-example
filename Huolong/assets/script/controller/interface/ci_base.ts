import { CharacterInfo } from "../../core/characterInfo";
import { GameType } from "../../core/enumerator";

/**
 * 游戏玩法控制器(Controller)的接口
 * 游戏玩法控制器(Controller)里存放的是游戏玩法规则处理以及流程控制的逻辑
 */
export default interface CI_Base {
    getGameType(): GameType
    setPlayer(seatIndex: number, player: any): void
    startGame(): void
    onDispose(): void

    getOtherInfo(seat: number): CharacterInfo
    getAllPlayersInfo(): CharacterInfo[]
}