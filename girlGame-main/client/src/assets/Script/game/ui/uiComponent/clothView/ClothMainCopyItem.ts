// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClothCopyItem from "./ClothCopyItem";
import { dataManager } from "../../../data/DataManager";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothMainCopyItem extends ClothCopyItem {

    initTags() {
        if (this.node_tag == null)
            return;
        for (var i = 0; i < dataManager.getAccessorieData()[this.data].main_style_id.length; i++) {
            var item = cc.instantiate(this.node_tag);
            item.parent = this.node_tag.parent;
            item.x = this.node_tag.x;
            item.y = this.node_tag.y - 25 * i;
            item.active = true;
            resLoader.loadRes(SysDef.styleUrl + dataManager.getAccessorieStyleData()[dataManager.getAccessorieData()[this.data].main_style_id[i]].icon, cc.Texture2D, (err, res) => {
                item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            })
            this.tagList.push(item);
        }
    }

    updateInfo() {
        this.node.x = 0;
        let data = dataManager.getAccessorieData()[this.data];
        this.lb_name.string = dataManager.GetTextById(data.name_id);
        // this.lb_name.string = this.data.clothId;
        var self = this;
        self.spr_icon.url = SysDef.dress_iconUrl + data.icon;

    }

    setChecked(isChecked) {
        let toggle = this.node.getComponent(cc.Toggle);
        if (toggle) {
            toggle.isChecked = isChecked;
        }

        this.node_checked.active = isChecked;

    }
    clickUpdate() {

        let toggleContainer = this.node.parent.getComponent(cc.ToggleContainer);
        if (toggleContainer && toggleContainer.toggleItems) {
            for (let toggle of toggleContainer.toggleItems) {
                if (toggle.isChecked) {
                    return;
                }
            }
        }

        //没有toggle被选择
        let data = dataManager.getAccessorieData()[this.data];
        if (data.first_type == 2) {
            //妆容不能为空
            let toggle = this.node.getComponent(cc.Toggle);
            if (toggle) {
                toggle.check();
            }
        }
        //this.isChecked = !this.isChecked;
        //this.node_checked.active = this.isChecked;
        //this.data.isChecked = this.isChecked;
    }
}

