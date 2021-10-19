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

const { ccclass, property } = cc._decorator;

@ccclass
export default class TipsView extends UIView {

    public static instance: TipsView = null;

    @property({ type: cc.Prefab })
    tipPrefab: cc.Prefab = null;

    private tipPool: NodePool = null;
    init() {
        TipsView.instance = this;
        this.tipPool = new NodePool();
        this.tipPool.init(this.tipPrefab);
        this.tipPool.setWaterMark(5);
    }

    onOpen() {
    }

    public showTip(message: string) {
        var self = this;
        let TipNode = this.tipPool.getNode();
        TipNode.parent = this.node;
        TipNode.zIndex = this.node.zIndex + 1;
        let tip = TipNode.getComponent(TipsItem);
        tip.playTip(message, () => {
            self.tipPool.freeNode(TipNode);
        });
    }

    onClose() {
        this.tipPool.destory();
    }
    onDestroy() {
        TipsView.instance = null;
    }


    // update (dt) {}
}
