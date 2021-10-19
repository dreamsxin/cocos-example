// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import ClothCopyItem from "../clothView/ClothCopyItem";
import ChooseItem from "../clothView/ChooseItem";
import ScrollViewPlusItem from "../common/ScrollViewPlusItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChapterRecallTextItem extends ScrollViewPlusItem {



    @property(cc.RichText)
    lblText: cc.RichText = null;

    onLoad() {

    }

    updatePos(xOffsetPercent, yOffsetPercent) {

    }

    clickUpdate(st) {
        // this.isChecked = st;
        // this.node_checked.active = this.isChecked;
    }
}
