// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import UrlLoad from "../../uiComponent/common/UrlLoad";
import { uiManager } from "../../../../base/ui/UIManager";
import { UIID } from "../../UIConfig";
import RenderListItem from "./RenderListItem";
import SysDef from "../../../../util/SysDef";
import { dataManager } from "../../../data/DataManager";
import { utils } from "../../../../util/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class IconItem extends RenderListItem {



    @property(UrlLoad)
    sprIcon: UrlLoad = null;

    @property(UrlLoad)
    sprBg: UrlLoad = null;

    @property(MultiLabel)
    lbName: MultiLabel = null;

    @property(MultiLabel)
    lbDec: MultiLabel = null;

    @property(MultiLabel)
    lbNum: MultiLabel = null;

    @property(MultiLabel)
    lbNeed: MultiLabel = null;

    //斜杠
    @property(MultiLabel)
    lbSign: MultiLabel = null;

    @property(cc.Node)
    nodeAdd: cc.Node = null;

    showData() {

        if (this.lbNum) {
            this.lbNum.string = this._data.count;
        }

        if (!this._data.type) {
            //如果没有type值,是奖励数据，需要自己获取其他属性
            this._data = dataManager.bagProxy.getItem(this._data.id);
        }

        if (this.sprBg) {
            this.sprBg.url = SysDef.getItemBg(this._data.quality ? this._data.quality : 1);
        }
        if (this.sprIcon) {
            this.sprIcon.url = dataManager.bagProxy.getItemIcon(this._data);
        }
        if (this.lbName) this.lbName.string = dataManager.GetTextById(this._data.name_id);

        if (this.lbNeed && this._data.need != undefined) {
            this.lbNeed.string = this._data.need + '';
            this.lbNeed.node.active = true;
            if (this.lbSign) {
                this.lbSign.string = '/';
                this.lbSign.node.active = true;
            }
            if (this.lbNum) {
                if (this._data.need > this._data.count) {
                    this.lbNum.node.color = cc.color(255, 40, 30);
                } else {
                    this.lbNum.node.color = cc.Color.WHITE;
                }
            }
        } else {
            if (this.lbSign) this.lbSign.node.active = false;
            if (this.lbNeed) this.lbNeed.node.active = false;
        }
        if (this.lbDec) this.lbDec.string = dataManager.GetTextById(this._data.describe_id);
        if (this.nodeAdd) {

            this.nodeAdd.active = this.data.count == 0;


            if (this.data.need && this.data.need > this.data.count) {
                this.nodeAdd.active = true;
            } else if (this.data.need) {
                this.nodeAdd.active = false;
            }

        }
    }

    public set select(t: Boolean) {

    }

    showInfoView() {
        utils.showItemInfo(this._data.id);
    }
    // update (dt) {}
}
