// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import View = cc.View;
import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { NodePool } from "../../../base/res/NodePool";
import { dataManager } from "../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfirmView extends UIView {

    public static instance: ConfirmView = null;
    @property(cc.RichText)
    lb_tips: cc.RichText = null;

    @property(MultiLabel)
    lb_confirm: MultiLabel = null;

    @property(MultiLabel)
    lb_cancel: MultiLabel = null;


    private confirmFunc: Function;
    private cancelFunc: Function;

    // LIFE-CYCLE CALLBACKS:
    init() {
        ConfirmView.instance = this;
    }
    // onLoad () {}
    onOpen(id, data) {
        this.initData(data);
    }

    initData(data) {
        if (!data) {
            return;
        }

        this.confirmFunc = data.okCall;
        this.cancelFunc = data.cancelCall;

        if (data.lblOK) this.lb_confirm.string = data.lblOK;
        if (data.lblCancel) this.lb_cancel.string = data.lblCancel;

        if (data.itemID === 0) {
            this.lb_tips.string = data.content;
        } else {
            let item = dataManager.bagProxy.getItem(data.itemID);
            let icon = item.icon ? item.icon : item.id;
            this.lb_tips.string = dataManager.GetTextById(433) + '<img src=\'' + icon + '\'/>' + data.itemNum + ',' + data.content;
        }
    }

    onClickCancelBtn() {
        if (this.cancelFunc != null)
            this.cancelFunc();
        this.closeSelf();
    }

    onClickConfirmBtn() {

        if (this.confirmFunc != null)
            this.confirmFunc();
        this.closeSelf();
    }
    onClickCloseBtn() {
        this.closeSelf();
    }
    onDestroy() {
        ConfirmView.instance = null;
    }
    // update (dt) {}
}
