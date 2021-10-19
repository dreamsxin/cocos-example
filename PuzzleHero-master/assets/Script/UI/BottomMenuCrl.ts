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
export default class BottomMenuCrl extends cc.Component {

    bottomMenu: cc.Node = null

    bottomMenuSel: cc.Node = null

    bottomBtns: cc.Node[] = []

    bottomBtnsBg: cc.Node[] = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    menuCB: (number: number, ins?: boolean) => void

    onLoad() {
        this.bottomMenu = this.node
        this.bottomMenuSel = this.bottomMenu.getChildByName("highlight")
        this.bottomBtns = [].concat(this.bottomMenu.getChildByName("menu").children)
        this.bottomBtnsBg = this.bottomMenu.getChildByName("menuBG").children
    }



    handleMenuCB(event, idx) {
        this.selectBottomIdx(idx)
    }

    selectBottomIdx(idx, ins: boolean = false) {
        switch (idx) {
            case 0:
                Logger.record(15)
                break;
            case 1:
                Logger.record(14)
                break;
            case 2:
                Logger.record(13)
                break;
            case 3:
                Logger.record(16)
                break;
            default:
                break;
        }

        if (idx == 2) {

            WXApi.HideAuthorizeBtn(true)
        } else {
            WXApi.HideAuthorizeBtn(false)
        }
        let bid = Number(idx)
        let btns = this.bottomBtns
        let btnsbg = this.bottomBtnsBg
        this.bottomMenuSel.stopAllActions()
        this.unscheduleAllCallbacks()
        this.setButtonUse(false)
        for (let i = 0; i < btns.length; i++) {
            btns[i].stopAllActions()
            if (i != bid) {
                btns[i].width = 108
                let act1 = cc.scaleTo(0.2, 0.8)
                let act11 = cc.moveTo(0.2, cc.v2(0, 0))
                btns[i].getChildByName("icon").runAction(cc.spawn(act1, act11))
                btns[i].getChildByName("active").active = false
                btnsbg[i].width = 108
            } else if (btns[i].width < 208 && i == bid) {
                btns[i].width = 208
                let act1 = cc.scaleTo(0.2, 1)
                let act11 = cc.moveTo(0.2, cc.v2(0, 20))
                btns[i].getChildByName("icon").runAction(cc.spawn(act1, act11))
                btns[i].getChildByName("active").active = true
                btnsbg[i].width = 208
                this.scheduleOnce(() => {
                    let p = btns[i].convertToWorldSpaceAR(cc.Vec2.ZERO)
                    p = this.bottomMenuSel.parent.convertToNodeSpaceAR(p)
                    if (ins == true) {
                        this.bottomMenuSel.position = p
                        this.setButtonUse(true)
                    } else {
                        let act1 = cc.moveTo(0.2, p).easing(cc.easeIn(1))
                        let act2 = cc.callFunc(() => {
                            this.setButtonUse(true)
                        })
                        this.bottomMenuSel.runAction(cc.sequence(act1, act2))

                    }
                }, 0.01)
            } else if (btns[i].width >= 208 && i == bid) {
                this.setButtonUse(true)
            }
        }
        if (this.menuCB != null) {
            this.menuCB(idx, ins)

        }
    }

    setButtonUse(v: boolean) {
        this.bottomBtns.forEach(b => {
            b.getComponent(cc.Button).interactable = v
        })

    }

    // update (dt) {}
}
