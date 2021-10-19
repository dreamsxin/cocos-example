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
import UrlLoad from "../common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothArmoireCopyItem extends ClothCopyItem {

    @property(cc.Node)
    node_mask: cc.Node = null;

    @property(MultiLabel)
    lb_num: MultiLabel = null;

    @property(MultiLabel)
    lb_lock: MultiLabel = null;


    // onLoad () {}

    start() {

    }


    initTags() {
        if (this.node_tag == null)
            return;
        for (var i = 0; i < dataManager.getAccessorieData()[this.data].main_style_id.length; i++) {
            var item = cc.instantiate(this.node_tag);
            item.parent = this.node_tag.parent;
            item.x = this.node_tag.x;
            item.y = this.node_tag.y - 25 * i;
            item.active = true;
            let id = dataManager.getAccessorieData()[this.data].main_style_id[i];
            item.getComponent(UrlLoad).url = SysDef.styleUrl + dataManager.getAccessorieStyleData()[id].icon;
            this.tagList.push(item);
        }
    }

    showData() {
        this._data = this._data.id;
        super.showData();

        let clothe = dataManager.clotheProxy.getClothData(this.data);

        this.lb_name.string = dataManager.GetTextById(clothe.name_id);
        this.node_mask.active = false;
        this.spr_icon.url = SysDef.dress_iconUrl + dataManager.getAccessorieData()[this.data].icon;

        this.lb_num.string = dataManager.GetTextById(113) + ':' + dataManager.clotheProxy.getClotheNum(this.data);
    }
    clickUpdate(st) {
    }
    onClickAccessBtn() {

    }

}
