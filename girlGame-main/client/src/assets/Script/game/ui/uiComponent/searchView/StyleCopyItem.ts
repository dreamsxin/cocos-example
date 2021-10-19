// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { resLoader } from "../../../../base/res/ResLoader";
import MultiLabel from "../../../../util/MultiLabel";
import SysDef from "../../../../util/SysDef";
import { dataManager } from "../../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StyleCopyItem extends cc.Component {

    @property(cc.Node)
    node_check: cc.Node = null;
    @property(cc.Sprite)
    spr_icon: cc.Sprite = null;

    @property(cc.Node)
    nodeMain: cc.Node = null;

    @property(MultiLabel)
    lblQuality: MultiLabel = null;

    private callBack = null;
    public data = null;
    public isChecked = false;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClickHandle, this)
    }

    initData(data, callback) {

        this.callBack = callback;
        var self = this;
        self.data = data;
        resLoader.loadRes(SysDef.styleUrl + data.icon, cc.Texture2D, (err, res) => {
            self.spr_icon.spriteFrame = new cc.SpriteFrame(res);
        })
    }

    updateInfo(id, num, bMain) {
        var self = this;
        resLoader.loadRes(SysDef.styleUrl + dataManager.getAccessorieStyleData()[id].icon, cc.Texture2D, (err, res) => {
            self.spr_icon.spriteFrame = new cc.SpriteFrame(res);
        });

        if (this.nodeMain) this.nodeMain.active = bMain;
        if (this.lblQuality) this.lblQuality.string = dataManager.clotheProxy.getClothStyleLvStr(num);
    }

    updateCheckState(st) {
        if (this.node_check)
            this.node_check.active = st;
        this.isChecked = st;
    }

    onClickHandle() {
        if (this.callBack)
            this.callBack(this.node);
    }
}
