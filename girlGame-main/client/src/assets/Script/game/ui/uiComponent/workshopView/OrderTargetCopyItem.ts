// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import IconItem from "../common/IconItem";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OrderTargetCopyItem extends RenderListItem {

    @property(cc.RichText)
    lb_current: cc.RichText = null;

    @property(cc.Node)
    node_get: cc.Node = null;

    @property(IconItem)
    node_res_item: IconItem = null;

    showData() {
        let count = dataManager.bagProxy.getItem(this.data.id).count;
        this.node_get.active = count >= this.data.need;
        this.node_res_item.data = dataManager.bagProxy.getItem(this.data.id);

        let start = '';
        let red = '<color=#FF8C9E>';
        let black = '<color=#645332>';
        let end = '</c>';

        start = this.node_get.active ? black : red;

        this.lb_current.string = '（' + start + count + end + '/' + this.data.need + '）';
    }
}
