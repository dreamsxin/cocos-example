import TerritoryCrl from "./TerritoryCrl";
import GameLogicCrl from "./GameLogicCrl";
import NetProecssCrl from "./Net/NetProcessCrl";
import ResultUICrl from "../UI/ResultUICrl";
import UIMgr from "../Lib/UI/UIMgr";
import StaticData from "../StaticData";
import NetCmd from "./Net/NetCmd";
import BlockCrl from "./BlockCrl";
import WXApi from "../Lib/WXApi";
import ResultAUI from "../UI/ResultAUI";

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
export default class TerritoryPVPCrl extends TerritoryCrl {

    curMxSel: any[] = []

    timeout: number = 20

    isTimeout: boolean = false

    gameEnd: boolean = false

    startListenSync() {
        this.isTimeout = false
        this.gameEnd = false
        NetProecssCrl.Share.handleOnClose(() => {
            //WXApi.tipsDialog("断开链接")
            this.scheduleOnce(async () => {
                this.gameEnd = true
                StaticData.GameOver = true
                GameLogicCrl.Share.isWin = false
                this.unschedule(this.handleCDTimeout)
                this.handleRoundEnd()
            })
        })

        NetProecssCrl.Share.handleSyncGameData((data) => {
            if (this.gameEnd) {
                return
            }
            if (data.data != null && data.data.cmd == NetCmd.SyncGameEnd) {
                this.gameEnd = true
                return
            }
            if (data.data != null && data.state == 0) {
                WXApi.tipsDialog("对手弃权")
                StaticData.GameOver = true
                GameLogicCrl.Share.isWin = true
                this.unschedule(this.handleCDTimeout)
                this.handleRoundEnd()
                this.gameEnd = true
                return
            }
            if (data.data != null && data.data.cmd == NetCmd.SyncSelectPos && !this.gameEnd) {
                this.handleNetSelBlockRefrash(data.data.ps)
            }
            if (data.data != null && data.data.cmd == NetCmd.SyncTouchRelease && !this.gameEnd) {
                cc.log([].concat(data.data.ps))
                this.handleNetRelBlock(data.data.ps)
            }
            if (data.data != null && data.data.cmd == NetCmd.SyncTimeout && !this.gameEnd) {
                GameLogicCrl.Share.blockMats.forEach(b => {
                    b.showSelect(false)
                })
                this.releaseSelect()
                this.handleRoundEnd()
            }


        })
    }


    handleNetSelBlockRefrash(ps: any[]) {
        let vecs: cc.Vec2[] = []
        ps.forEach(p => {
            p.y = Math.abs(p.y - 9)
            vecs.push(cc.v2(p.x, p.y))
        })
        GameLogicCrl.Share.blockMats.forEach(b => {
            b.showSelect(false)
        })
        GameLogicCrl.Share.blockMats.forEach(b => {
            for (let i = 0; i < vecs.length; i++) {
                if (b.mxtPos.equals(vecs[i])) {
                    b.showSelect()
                }
            }
        })
    }

    handleNetRelBlock(ps: any[]) {
        let vecs: cc.Vec2[] = []
        ps.forEach(p => {
            p.y = Math.abs(p.y - 9)
            vecs.push(cc.v2(p.x, p.y))
        })
        this.preLinkList.length = 0
        let blocks = GameLogicCrl.Share.blockMats
        vecs.forEach(v => {
            for (let i = 0; i < blocks.length; i++) {
                if (v.equals(blocks[i].mxtPos)) {
                    this.preLinkList.push(blocks[i])
                }
            }
        })
        this.handleGameCoreProcess(true)
    }



    handleCheckTouch(p: cc.Vec2) {
        super.handleCheckTouch(p)
        let mxsel: any[] = []
        let check = false


        this.preLinkList.forEach(b => {
            mxsel.push({ x: b.mxtPos.x, y: b.mxtPos.y })
        })
        if (mxsel.length != this.curMxSel.length) {
            check = true
        }

        if (check) {
            let senddata = { ps: mxsel, cmd: NetCmd.SyncSelectPos }
            NetProecssCrl.Share.doSendSycnInfo(senddata)
            this.curMxSel = JSON.parse(JSON.stringify(mxsel))
        }
    }

    handleCheckTouchEnd(isEnemy: boolean = false) {
        if (this.isTimeout) {
            this.releaseSelect()
            return
        }
        let mxsel: any[] = []
        this.preLinkList.forEach(b => {
            mxsel.push({ x: b.mxtPos.x, y: b.mxtPos.y })
        })
        let senddata = { ps: mxsel, cmd: NetCmd.SyncTouchRelease }
        cc.log("touchend send ", mxsel)
        NetProecssCrl.Share.doSendSycnInfo(senddata)
        if (mxsel.length > 2) {
            GameLogicCrl.Share.gameSceneUI.timeoutBell.active = false
            this.unschedule(this.handleCDTimeout)
        }
        this.handleGameCoreProcess(isEnemy)
    }


    genAllBlocks() {
        return new Promise(async (resolve, reerr) => {

            let blocks = await GameLogicCrl.Share.genStartBlocks()
            let anblocks = await GameLogicCrl.Share.genStartBlocks()

            GameLogicCrl.Share.blockMats = blocks.concat(anblocks)
            for (let i = 0; i < anblocks.length; i++) {
                anblocks[i].node.y += 450
                anblocks[i].mxtPos.y += 5
                //enenmyblock[i].updateMpPos()
            }

            if (!NetProecssCrl.Share.isMaster) {
                GameLogicCrl.Share.blockMats.forEach(b => {
                    b.mxtPos.y = Math.abs(b.mxtPos.y - 9)
                    b.node.position = GameLogicCrl.Share.tranMxpToPos(b.mxtPos)
                })
            }
            resolve()
            this.startListenSync()
        })
    }

    handleCDTimeout() {
        this.timeout--
        if (this.timeout == 0 && GameLogicCrl.Share.roundPlayer == 0) {
            GameLogicCrl.Share.gameSceneUI.timeoutBell.active = false
            this.releaseSelect()
            this.hideAtkCount()
            this.isTimeout = true
            let senddata = { cmd: NetCmd.SyncTimeout }
            NetProecssCrl.Share.doSendSycnInfo(senddata)
            this.handleRoundEnd()
            cc.log("is timeout:", this.timeout)

        } else if (this.timeout > 0) {
            GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponentInChildren(cc.Label).string = this.timeout.toFixed()
        }
    }


    async handleRoundEnd() {
        return new Promise(async (resolve, reerr) => {

            this.unschedule(this.handleCDTimeout)
            if (StaticData.IsGiveUp) {
                StaticData.IsGiveUp = false
                resolve()
                return
            }
            if (StaticData.GameOver) {
                this.releaseSelect()
                if (this.exitProcess) {
                    this.exitProcess()
                }
                let senddata = { cmd: NetCmd.SyncGameEnd }
                if (!StaticData.IsGiveUp)
                    NetProecssCrl.Share.doSendSycnInfo(senddata)
                if (!StaticData.startFromArena && !StaticData.startFromShareGame) {
                    let rs = (await UIMgr.Share.showUI("ResultUI")) as ResultUICrl
                    rs.showResult(GameLogicCrl.Share.isWin, GameLogicCrl.Share.playerData)
                } else {
                    let rs = (await UIMgr.Share.showUI("ResultAUI")) as ResultAUI
                    rs.showResult(GameLogicCrl.Share.isWin, GameLogicCrl.Share.playerData)
                }

                resolve()
                NetProecssCrl.Share.doClose()
                return
            }

            GameLogicCrl.Share.gameSceneUI.updateRoundCount(++GameLogicCrl.Share.roundCount, GameLogicCrl.Share.roundPlayer)
            switch (GameLogicCrl.Share.roundPlayer) {
                case 0:
                    GameLogicCrl.Share.roundPlayer = 1
                    await this.handleDiePath()
                    //GameLogicCrl.Share.asycRandom(0, 10) > 7 ? await this.genAtypeBlock() : ""
                    GameLogicCrl.Share.playerOpt.canOpt = false

                    GameLogicCrl.Share.gameSceneUI.timeoutBell.active = true
                    this.timeout = 20
                    //this.isTimeout = false
                    GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponentInChildren(cc.Label).string = this.timeout.toFixed()
                    GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponent(cc.Animation).play()
                    this.schedule(this.handleCDTimeout, 1, 20);
                    break;
                case 1:
                    GameLogicCrl.Share.roundPlayer = 0
                    await this.handleDiePath()
                    //GameLogicCrl.Share.asycRandom(0, 10) > 7 ? await this.genAtypeBlock() : ""
                    GameLogicCrl.Share.playerOpt.canOpt = true
                    GameLogicCrl.Share.gameSceneUI.timeoutBell.active = true
                    this.timeout = 20
                    this.isTimeout = false
                    GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponentInChildren(cc.Label).string = this.timeout.toFixed()
                    GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponent(cc.Animation).play()
                    this.schedule(this.handleCDTimeout, 1, 20);
                default:
                    break;
            }
            let sidx = 0
            GameLogicCrl.Share.playerData.forEach(p => {
                if (p.shield > 0) {
                    p.shield--
                }
                if (p.shield < 1) {
                    GameLogicCrl.Share.gameSceneUI.showGetSkill(3, sidx)
                }
                sidx++
            })
            resolve()
        })

    }



}
