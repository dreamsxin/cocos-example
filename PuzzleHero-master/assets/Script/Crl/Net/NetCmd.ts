// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NetCmd {
    public static SyncUserReady: string = 'SyncUserReady'

    public static SyncExitShareGame: string = 'SyncExitShareGame'

    public static SyncUserInfo: string = "SyncUserInfo"

    public static SyncSeedAround: string = "SyncSeedAround"

    public static SyncSalveSeedDone: String = "SyncSalveSD"

    public static SyncSelectPos: string = "SSP"

    public static SyncTouchRelease: string = "STRE"

    public static SyncTimeout: string = "STT"

    public static SyncGameEnd: string = "SREND"

}
