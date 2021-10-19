// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueUpLabelItem extends RenderListItem {

    @property({ type: [cc.Sprite] })
    sprIcons: cc.Sprite[] = [];

    @property(cc.Sprite)
    sprArrow: cc.Sprite = null;

    @property(MultiLabel)
    lblCur: MultiLabel = null;

    @property(MultiLabel)
    lblNext: MultiLabel = null;

    @property(MultiLabel)
    lblAdd: MultiLabel = null;

    showData() {
        if (!this._data) {
            return;
        }
        let data = this._data;

        this.lblCur.string = dataManager.getRetinueStatus(data.index) + ':' + data.cur + '';
        this.lblNext.string = dataManager.getRetinueStatus(data.index) + ':' + data.next + '';
        this.lblAdd.string = '+' + (data.next - data.cur) + ')';
    }

    onDestroy() {

    }
}
