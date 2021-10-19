// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";
import ClothCopyItem from "../clothView/ClothCopyItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StyleCopyItem extends ClothCopyItem {

    updateInfo() {
        // this.lb_name.string = dataManager.GetTextById(dataManager.getAccessorieData()[this.data].name);
        this.lb_name.string = this.data.clothId;

    }
    clickUpdate(st) {
    }
    onClickBtn() {

    }

}
