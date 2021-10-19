// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { dataManager } from "../../data/DataManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BagVIPView extends UIView {


    @property(MultiLabel)
    lblCurVIP: MultiLabel = null;

    @property(MultiLabel)
    lblNextVIP1: MultiLabel = null;

    @property(MultiLabel)
    lblNextVIP2: MultiLabel = null;

    @property(MultiLabel)
    lblCurNum: MultiLabel = null;

    @property(MultiLabel)
    lblNextNum: MultiLabel = null;

    @property(MultiLabel)
    lblUseNum: MultiLabel = null;


    init() {

        this.lblCurVIP.string = dataManager.GetTextById(341) + 1;
        this.lblNextVIP1.string = dataManager.GetTextById(341) + 2;
        this.lblNextVIP2.string = dataManager.GetTextById(341) + 2;
    }

    initUI() {


    }

    onOpen() {


    }

    onClickRechargeBtn() {
    }
    onClickCloseBtn() {
        this.closeSelf();
    }
    onClose() {
    }
    onDestroy() {

    }
    // update (dt) {}
}
