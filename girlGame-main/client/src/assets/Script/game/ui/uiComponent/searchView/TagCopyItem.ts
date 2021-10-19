// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { resLoader } from "../../../../base/res/ResLoader";
import { dataManager } from "../../../data/DataManager";
import SysDef from "../../../../util/SysDef";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TagCopyItem extends cc.Component {

    @property(cc.Node)
    node_check: cc.Node = null;

    @property(cc.Sprite)
    spr_bg: cc.Sprite = null;


    @property(MultiLabel)
    lb_name: MultiLabel = null;

    private callBack = null;
    private data = null;
    public isChecked = false;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickHandle, this)
    }

    initData(data, callback) {

        this.callBack = callback;
        let self = this;
        self.data = data;
        resLoader.loadRes(SysDef.styleUrl + dataManager.getConfigData().cloth_tag_bg[data.type - 1], cc.Texture2D, (err, res) => {
            self.spr_bg.spriteFrame = new cc.SpriteFrame(res);
        })
        this.lb_name.string = dataManager.GetTextById(data.name_id);
    }

    updateInfo(id) {
        let self = this;
        let type = dataManager.getAccessorieTagData()[id].type;
        resLoader.loadRes(SysDef.styleUrl + dataManager.getConfigData().cloth_tag_bg[type - 1], cc.Texture2D, (err, res) => {
            self.spr_bg.spriteFrame = new cc.SpriteFrame(res);
        })
        this.lb_name.string = dataManager.GetTextById(dataManager.getAccessorieTagData()[id].name_id);
    }


    updateCheckState(st) {
        this.node_check.active = st;
        this.isChecked = st;
    }
    onClickHandle() {
        this.callBack(this.node);
    }
}
