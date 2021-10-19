import { GameType } from "../../core/enumerator";

/**
 * 本地游戏界面(View)的对外接口
 * 本地游戏界面(View)主要由全局控制器(GameMain)进行记录，以便在生成和释放时进行处理。
 * 本地游戏界面(View)通过扮演玩家(PlayerItem)来获取游戏数据，而不是直接由外部调用来得到数据
 * 本地游戏界面(View)不与玩法控制器(Controller)产生直接交互，流程控制通过通知全局控制器(GameMain)来实现
 */
export default interface VI_Base {
    getGameType(): GameType
}
