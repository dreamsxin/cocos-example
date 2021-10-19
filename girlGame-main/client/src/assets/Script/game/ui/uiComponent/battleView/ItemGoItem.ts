// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemGoItem extends RenderListItem {

    @property(MultiLabel)
    lbTitle: MultiLabel = null;

    @property(MultiLabel)
    lbDec: MultiLabel = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    updateInfo(id) {

    }

    start() {

    }

    // update (dt) {}
}
