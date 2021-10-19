import UICrl from "../Lib/UI/UICrl";
import GameLogicCrl from "../Crl/GameLogicCrl";

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
export default class TeachCrl extends UICrl {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    teachPage: cc.Node[] = []

    curPage: number = 0

    onLoad() {
        this.teachPage = this.node.children
    }

    start() {
        GameLogicCrl.Share.gameSceneUI.roundLogo.forEach(logo => { logo.active = false })
        this.showPage(0)
    }


    showPage(page) {
        GameLogicCrl.Share.territoryCrl["turStep"] = page
        this.curPage = page
        cc.log("page to :", page)
        this.teachPage.forEach(p => {
            p.active = false
        })
        this.teachPage[page].active = true
        this.handlePage(this.curPage)
    }

    handlePage(page) {
        switch (page) {
            case 0:
                this.teachPage[page].getComponent(cc.Animation).on("finished", () => {
                    cc.log(page, "anim finlish")
                    this.teachPage[page].on(cc.Node.EventType.TOUCH_END.toString(), () => this.showPage(1))
                })
                break;
            case 1:
                this.teachPage[page].getComponent(cc.Animation).on("finished", () => {
                    cc.log(page, "anim finlish")
                    this.teachPage[page].on(cc.Node.EventType.TOUCH_END.toString(), () => {
                        GameLogicCrl.Share.handleRoundEnd()
                        this.showPage(2)
                    })
                })
                break
            case 2:
                GameLogicCrl.Share.territoryCrl["turStep"] = 3
                break
            default:
                break;
        }
    }

    showPageAwait(page) {
        return new Promise((resolve, ererr) => {
            this.teachPage.forEach(p => {
                p.active = false
            })
            GameLogicCrl.Share.territoryCrl["turStep"] = page
            this.teachPage[page].active = true
            this.teachPage[page].getComponent(cc.Animation).on("finished", () => {
                this.teachPage[page].on(cc.Node.EventType.TOUCH_END.toString(), () => {
                    resolve()
                })

            })
        })
    }



    hideAll() {
        this.teachPage.forEach(p => {
            p.active = false
        })
    }


    // update (dt) {}
}
