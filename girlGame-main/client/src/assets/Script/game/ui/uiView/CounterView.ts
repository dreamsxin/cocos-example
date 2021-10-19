// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import TipsItem from "../uiComponent/common/TipsItem";
import { NodePool } from "../../../base/res/NodePool";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkshopView extends UIView {



    @property(cc.Node)
    node_upgrade: cc.Node = null;

    @property(cc.Node)
    node_copy_item: cc.Node = null;

    private counterList = [];
    private positionList = [cc.v2(-40, -270), cc.v2(-227, -57), cc.v2(114, 190), cc.v2(-86, 365)]
    init() {

        this.initUI();
    }

    initUI() {
        this.counterList.splice(0);
        for (var pos in this.positionList) {
            var node = cc.instantiate(this.node_copy_item);
            node.parent = this.node_copy_item.parent;
            node.position = this.positionList[pos];
            node.getComponent(WorkshopCopyItem).updateInfo(null);
            this.counterList.push(node);
        }
    }
    onOpen() {



    }
    onClickCounterUpgradeBtn() {

        uiManager.open(UIID.UICounterUpgrade);
    }
    onClickOrderBtn() {
        uiManager.open(UIID.UIOrder);

    }
    onClickCloseBtn() {
        this.closeSelf();
        uiManager.open(UIID.UIMain);
    }
    onClose() {
    }
    onDestroy() {

    }
    // update (dt) {}
}
