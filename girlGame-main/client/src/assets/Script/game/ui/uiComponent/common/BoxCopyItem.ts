// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import RenderListItem from "../common/RenderListItem";
import { BoxStatus } from "../../../../util/Utils";
import { shaderUtils } from "../../../../util/ShaderUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxCopyItem extends RenderListItem {


    @property(cc.Button)
    btnSelf: cc.Button = null;
    @property(cc.Node)
    nodeNormal: cc.Node = null;

    @property(cc.Node)
    nodeOpened: cc.Node = null;

    showData() {
        this.nodeNormal.active = false;
        this.nodeOpened.active = false;

        switch (this.data.status) {
            case BoxStatus.Default:
                this.nodeNormal.active = true;
                shaderUtils.setNodeGray(this.node);
                this.btnSelf.interactable = true;
                break;
            case BoxStatus.CanOpen:
                shaderUtils.setNodeNormal(this.node);
                this.nodeNormal.active = true;
                this.btnSelf.interactable = true;
                break;
            case BoxStatus.Opened:
                shaderUtils.setNodeNormal(this.node);
                this.nodeOpened.active = true;
                this.btnSelf.interactable = false;
                break;
        }
    }

    onClickBox() {

    }
}
