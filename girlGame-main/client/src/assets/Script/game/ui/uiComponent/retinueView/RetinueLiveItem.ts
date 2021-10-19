// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import RenderListItem from "../common/RenderListItem";
import UrlLoad from "../common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueLiveItem extends RenderListItem {

    @property(MultiLabel)
    lblDec: MultiLabel = null;

    @property(MultiLabel)
    lblName: MultiLabel = null;

    @property(UrlLoad)
    spUrl: UrlLoad = null;

    showData() {
        if (!this._data) {
            return;
        }
        this.lblDec.string = dataManager.retinueProxy.getLiveDecText(this._data.here_occupation);
        this.lblName.string = dataManager.retinueProxy.getLiveNameText(this._data.here_occupation);
    }

    onDestroy() {

    }
}
