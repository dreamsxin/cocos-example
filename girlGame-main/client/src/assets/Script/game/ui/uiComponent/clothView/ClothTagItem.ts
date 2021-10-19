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
export default class ClothTagItem extends RenderListItem {

    @property(UrlLoad)
    spr_icon: UrlLoad = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(cc.Node)
    nodeMask: cc.Node = null;

    // onLoad () {}
    private callback = null;

    showData() {
        this.lb_name.string = dataManager.GetTextById(this.data.name_id);
        //this.callback = callback;
    }

    public set select(t: boolean) {
        this.nodeMask.active = t;
    }

    onClickToggle() {
        this.callback(this.data);
    }

    // update (dt) {}
}
