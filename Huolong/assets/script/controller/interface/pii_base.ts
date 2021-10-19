import { GameType, PlayerType } from "../../core/enumerator";

/**
 * 游戏玩家处理器(PlayerItem)对玩家外壳(PlayerVector)的接口
 * 游戏玩家处理器(PlayerItem)里存放的是玩家处理游戏事件的实际逻辑，包括本地用户操作反馈、网络用户的协议处理，以及AI用户的策略处理
 */
export default interface PII_Base {
    onDispose(): void
    getType(): PlayerType
    getGameType(): GameType
}