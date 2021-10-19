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
import UrlLoad from "../../uiComponent/common/UrlLoad";
import RenderListItem from "../common/RenderListItem";
import { retinueProxy } from "../../../data/RetinueProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueStutusItem extends RenderListItem {

    @property(MultiLabel)
    lblText: MultiLabel = null;

    @property(UrlLoad)
    iconUrl: UrlLoad = null;

    showData() {
        if (!this._data) {
            return;
        }
        this.lblText.string = dataManager.retinueProxy.getStatusText(this._data.propertiesid) + ':' + this._data.num;
    }

    onDestroy() {

    }
}
