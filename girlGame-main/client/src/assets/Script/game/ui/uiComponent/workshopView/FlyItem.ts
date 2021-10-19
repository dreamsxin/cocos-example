// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { utils } from "../../../../util/Utils";
import { dataManager } from "../../../data/DataManager";
import IconItem from "../common/IconItem";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyItem extends RenderListItem {

    @property(IconItem)
    iconItem: IconItem = null;

    showData() {

        let speed = 500;
        this.iconItem.data = this.data.reward;
        this.node.stopAllActions();

        this.node.position = this.data.startPos;
        this.node.opacity = 255;

        let des = utils.getDistance(this.data.startPos, this.data.endPos);
        let time = des / speed;


        this.iconItem.node.scale = 1;
        this.iconItem.node.stopAllActions();

        let moveTo = cc.moveTo(time, this.data.endPos.x, this.data.endPos.y);
        this.node.runAction(cc.sequence(moveTo, cc.callFunc(this.runScale, this)));
    }

    runScale() {
        this.iconItem.node.runAction(cc.sequence(cc.scaleTo(0.2, 2), cc.scaleTo(1, 0), cc.callFunc(this.moveOut, this)));
    }

    moveOut() {
        this.data.nodePool.freeNode(this.node);
    }
}
