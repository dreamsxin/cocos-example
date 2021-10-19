// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import RenderListItem from "../common/RenderListItem";
import RetinueItem from "../retinueView/RetinueItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyCardItem extends RenderListItem {

    @property(RetinueItem)
    retinueItem: RetinueItem = null;

    @property(MultiLabel)
    lbNum: MultiLabel = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    showData() {
        this.retinueItem.data = dataManager.retinueProxy.getDataByID(this.data.id);
        this.lbNum.string = 'x' + this.data.count + '';
        this.lbNum.node.parent.active = this.data.count != 0;
    }

    start() {

    }

    // update (dt) {}
}
