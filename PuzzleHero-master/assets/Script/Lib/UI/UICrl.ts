import UIMgr from "./UIMgr";
import WXApi from "../WXApi";

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
export default class UICrl extends cc.Component {


    onLoad() {
        if (UIMgr.Share.uiList.indexOf(this) < 0) {
            UIMgr.Share.uiList.push(this)
        }
    }

    start() {
       
    }

    close(clean: boolean = false) {
        this.node.active = false
        if (clean) {
            let idx = UIMgr.Share.uiList.indexOf(this)
            UIMgr.Share.uiList.splice(idx, 1)
            this.node.removeFromParent()
        }
    }

    devAlert(event, astr) {
        if (astr) {
            WXApi.OpenAlert(astr)
        } else {
            WXApi.OpenAlert("开发中，请稍后")
        }
    }
}
