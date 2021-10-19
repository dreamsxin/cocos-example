// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import IconItem from "../common/IconItem";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";
import RenderList from "../common/RenderList";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueUpItem extends RenderListItem {

    @property(MultiLabel)
    lblText: MultiLabel = null;


    showData() {
        if (!this._data) {
            return;
        }
        let data = this._data;
        this.lblText.string = data.str;
    }

    private _loadAndShowPic() {
    }
    onDestroy() {

    }
}
