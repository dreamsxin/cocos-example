// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClothCopyItem from "./ClothCopyItem";
import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothDecomposeCopyItem extends ClothCopyItem {


    @property(MultiLabel)
    lb_num: MultiLabel = null;


    // onLoad () {}

    start() {

    }
    updateInfo() {
        // this.lb_name.string = dataManager.GetTextById(dataManager.getAccessorieData()[this.data].name);
        this.lb_name.string = this.data.clothId;
        this.isChecked = false;
        this.node_checked.active = this.isChecked;
        var self = this;
        self.spr_icon.url = SysDef.dress_iconUrl + dataManager.getAccessorieData()[this.data].icon;

    }
    clickUpdate(st) {
        this.isChecked = st;
        this.node_checked.active = this.isChecked;
    }
}
