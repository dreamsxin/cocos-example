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
import RetinueItem from "./RetinueItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueBattleItem extends RenderListItem {

    @property(RetinueItem)
    retinueItem: RetinueItem = null;

    @property(MultiLabel)
    lblLock: MultiLabel = null;

    @property(cc.Node)
    nodeAdd: cc.Node = null;

    @property(cc.Node)
    nodeLock: cc.Node = null;

    @property(cc.Node)
    nodeSelect: cc.Node = null;

    showData() {
        if (!this._data) {
            return;
        }
        this.retinueItem.data = this._data.retinueData;
        this.nodeAdd.active = !this._data.retinueData && this._data.lockLevel <= dataManager.playerProxy.data.level;
        this.nodeLock.active = !this._data.retinueData && !this.nodeAdd.active;
        this.lblLock.string = dataManager.GetTextById(407, this._data.lockLevel);
        this.node.getComponent(cc.Button).interactable = !this.nodeLock.active;
    }

    public set select(chosed: Boolean) {
        if (this.nodeSelect) this.nodeSelect.opacity = chosed ? 255 : 0;
    }

    onDestroy() {

    }
}
