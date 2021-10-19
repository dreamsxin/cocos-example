import UICrl from "../Lib/UI/UICrl";
import GameLogicCrl from "../Crl/GameLogicCrl";
import StaticData from "../StaticData";
import UIMgr from "../Lib/UI/UIMgr";
import GameMenuUI from "./GameMenuUI";
import WXApi from "../Lib/WXApi";
import Logger from "../LoggerCrl";

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
export default class TeachBaseCrl extends UICrl {


    pageNode: cc.Node[] = []

    curPage: number = 0

    // onLoad() {

    // }

    onEnable() {
        cc.log("play base teach")
        this.pageNode = this.node.children
        //this.node.children[1].active = StaticData.Teached
        StaticData.Teached = false
    }

    showPage() {
        if (this.curPage == this.pageNode.length - 1 && !StaticData.GameOver) {
            StaticData.Teaching = false
            StaticData.AILimit = true
            return
        }
        cc.log("show page :", this.curPage)
        this.node.active = true
        return new Promise((resolve, reject) => {
            this.pageNode.forEach(p => p.active = false)
            if (this.curPage > this.pageNode.length - 1) {
                cc.log("teach done")
                this.hidePage()
                resolve()
                this.closeTeaching()
                this.curPage = 0
            }

            this.pageNode[this.curPage].active = true

            let typeobj = this.pageNode[this.curPage].getChildByName("Continue")

            if (typeobj != null && typeobj.active) {
                this.pageNode[this.curPage].getChildByName("Touch").on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                    this.hidePage()
                    this.curPage++
                    await this.showPage()
                    resolve()
                    return
                })
            } else if (this.pageNode[this.curPage].getChildByName("Speak") != null) {
                this.scheduleOnce(() => {
                    this.hidePage()
                    this.curPage++
                    resolve()
                    return
                }, 4)
            } else if (this.pageNode[this.curPage].getChildByName("Auto") != null) {
                this.scheduleOnce(async () => {
                    this.hidePage()
                    this.curPage++
                    await this.showPage()
                    resolve()
                    return
                }, 4)
            } else {
                this.curPage++
                resolve()
            }
        })
    }

    hidePage() {
        this.node.active = false
        this.pageNode.forEach(p => p.active = false)
    }

    closeTeaching() {
        StaticData.AILimit = false
        StaticData.Teaching = false
        StaticData.GameStart = false
        cc.director.loadScene("GameMenu", async () => {
            Logger.recordTS(32)
            if (!GameLogicCrl.Share.isWin) Logger.recordTS(33)
            //增加数据库的引导步数
            if (GameLogicCrl.Share.isWin) {
                await WXApi.HttpPost('/fangkuaiWx/setUserStep', { type: 0 })
            }
            StaticData.isWin = GameLogicCrl.Share.isWin
            let c: GameMenuUI = await UIMgr.Share.showUI("MainUI") as GameMenuUI
            c.checkIsGuide()
            c.showFirstUI()
            this.close(true)
        })
    }

    isTeachEnd() {
        if (this.curPage > this.pageNode.length - 1) {
            cc.log("teach done")
            this.hidePage()
            this.closeTeaching()
            return true
        }
        return false
    }



}
