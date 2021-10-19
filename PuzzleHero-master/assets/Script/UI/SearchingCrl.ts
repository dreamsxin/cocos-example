import UICrl from "../Lib/UI/UICrl";
import GameMenuUI from "./GameMenuUI";

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
export default class SearchingCrl extends UICrl {

    onClose: Function;

    @property(cc.Label)
    secLabel: cc.Label = null

    secDown: number

    onEnable() {
        this.secDown = 0
        this.updateSecLabel()
        this.schedule(this.updateSecLabel.bind(this), 1)
    }
    onDisable() {
        this.unscheduleAllCallbacks()
    }

    updateSecLabel() {
        this.secLabel.string = this.secDown.toString()
        this.secDown++
        // if (this.secDown > GameMenuUI.Share.matchTime) {
        //     this.secDown = 1
        // }

    }

    handMakeClose() {
        super.close()
        if (this.onClose != null) {
            this.onClose()
        }
    }

}
