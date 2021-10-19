// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClothCopyItem from "./ClothCopyItem";
import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DropCopyItem extends ClothCopyItem {


    @property(MultiLabel)
    lb_num: MultiLabel = null;


    // onLoad () {}

    start() {

    }
    updateInfo() {
        // this.lb_name.string = dataManager.GetTextById(dataManager.getAccessorieData()[this.data].name);
        this.lb_name.string = this.data.clothId;

    }
    clickUpdate(st) {
    }
}
