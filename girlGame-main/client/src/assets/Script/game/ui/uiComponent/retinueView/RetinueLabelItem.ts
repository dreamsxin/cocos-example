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
export default class RetinueLabelItem extends RenderListItem {

    @property(MultiLabel)
    lblDec: MultiLabel = null;

    @property(MultiLabel)
    lblStatus: MultiLabel = null;

    showData() {
        if (!this._data) {
            return;
        }
        this.lblDec.string = this._data.str;
    }

    onDestroy() {

    }
}
