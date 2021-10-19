// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { NodePool } from "../../../base/res/NodePool";
import { UIView } from "../../../base/ui/UIView";
import { executeAsync } from "../../../util/ExecuteAsync";
import MultiLabel from "../../../util/MultiLabel";
import { dataManager } from "../../data/DataManager";
import BattleRetinueItem from "../uiComponent/battleView/BattleRetinueItem";
import RenderListItem from "../uiComponent/common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleView extends UIView {



    @property(RenderListItem)
    battleRetinueItem: RenderListItem = null;

    @property(cc.Node)
    retinueNode: cc.Node = null;

    @property(cc.Node)
    posNode: cc.Node = null;


    @property(MultiLabel)
    lblPower: MultiLabel = null;


    private nodePool: NodePool = null;

    private selfItems: cc.Node[] = [];

    sectionData: any;
    posSelf: any;
    flyIndex: number;
    moveIndex: number;
    bChange: boolean;


    init() {

        let delta = -220;
        let startY = 350;

        this.posSelf = [];
        this.posSelf[0] = new cc.Vec3(150, startY);
        this.posSelf[1] = new cc.Vec3(150, startY + delta);
        this.posSelf[2] = new cc.Vec3(150, startY + delta * 2);
        this.posSelf[3] = new cc.Vec3(-150, startY - 200);
        this.posSelf[4] = new cc.Vec3(-150, startY - 200 + delta);
        this.posSelf[5] = new cc.Vec3(-150, startY - 200 + delta * 2);


        this.nodePool = new NodePool();
        this.nodePool.init(this.battleRetinueItem.node);

        this.posNode.active = false;

        for (let i = 0; i < 6; i++) {
            let node = cc.instantiate(this.posNode);
            node.parent = this.retinueNode;
            node.position = this.posSelf[i];
            node.y -= 120;
            node.active = true;
        }

        this.initBattleItems();

        this.bChange = false;


    }

    onDestroy() {

        this.nodePool.destory();
    }

    initBattleItems() {
        this.initRetinueItems();

    }

    initRetinueItems() {

        let selfData = dataManager.retinueProxy.getBattleData();

        let power = 0;
        selfData.forEach(element => {
            power += element.power;
        })
        this.lblPower.string = power + '';

        executeAsync.setCallBack(this, this.initSelfItem.bind(this), null);
        executeAsync.createAllItems(selfData);
    }

    initSelfItem(data) {

        let posSelf = this.posSelf;
        let i = data.pos - 1;
        if (data && data.pos > 0) {
            let node = this.nodePool.getNode();
            let com = node.getComponent('RetinueItem');
            if (!com) {
                this.selfItems[i] = null;
                return;
            }
            com.data = data;
            node.parent = this.retinueNode;
            node.active = true;
            node.position = posSelf[i];
            this.selfItems[i] = node;
            node.zIndex = i;



            node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this)
            //监听
            node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
            //this.node.on(cc.Node.EventType.TOUCH_MOVE,this.on_touch_move,this);
            //触摸抬起
            node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
            node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_cancel, this);

        } else {
            this.selfItems[i] = null;
        }

    }
    on_touch_cancel(touchevent) {
        this.on_touch_end(touchevent);
    }
    on_touch_end(touchevent) {
        if (this.battleRetinueItem.data) {
            var delta = touchevent.getDelta();

            this.battleRetinueItem.node.x += delta.x;
            this.battleRetinueItem.node.y += delta.y;

            this.drop();
        }
    }
    on_touch_move(touchevent) {
        if (this.battleRetinueItem.data) {
            var delta = touchevent.getDelta();

            this.battleRetinueItem.node.x += delta.x;
            this.battleRetinueItem.node.y += delta.y;
        }
    }
    on_touch_start(touchevent) {
        let node = touchevent.currentTarget;
        if (!this.battleRetinueItem.data) {
            this.battleRetinueItem.data = node.getComponent('RetinueItem').data;
            node.opacity = 0;
            this.battleRetinueItem.node.parent = node.parent;
            this.battleRetinueItem.node.position = node.position;
            this.battleRetinueItem.node.opacity = 200;
            this.battleRetinueItem.node.zIndex = 10;

            this.moveIndex = this.selfItems.indexOf(node);
            return true;
        }

        return false;
    }

    drop() {

        let flyNode = this.battleRetinueItem.node;
        let retinueItem = flyNode.getComponent('RetinueItem');

        let moveIndex = this.moveIndex;
        let endIndex = -1;

        for (let i = 0; i < 6; i++) {
            if (i != moveIndex && Math.abs(flyNode.x - this.posSelf[i].x) < 110 && Math.abs(flyNode.y - this.posSelf[i].y) < 150) {
                endIndex = i;
                break;
            }
        }

        this.battleRetinueItem.data = null;

        if (endIndex == -1) {
            this.selfItems[moveIndex].position = flyNode.position;
            this.selfItems[moveIndex].opacity = 255;
            this.selfItems[moveIndex].stopAllActions();
            this.selfItems[moveIndex].runAction(cc.moveTo(0.2, this.posSelf[moveIndex]));
        } else {

            let moveItem = this.selfItems[moveIndex];
            let end = this.selfItems[endIndex];

            this.selfItems[moveIndex].position = flyNode.position;
            this.selfItems[moveIndex].opacity = 255;
            this.selfItems[moveIndex].runAction(cc.moveTo(0.2, this.posSelf[endIndex]));


            if (this.selfItems[endIndex]) {
                this.selfItems[endIndex].opacity = 255;
                this.selfItems[endIndex].stopAllActions();
                this.selfItems[endIndex].runAction(cc.moveTo(0.2, this.posSelf[moveIndex]));
            }


            this.selfItems[moveIndex] = end;
            if (this.selfItems[moveIndex]) {
                this.selfItems[moveIndex].zIndex = moveIndex;
            }

            this.selfItems[endIndex] = moveItem;
            if (this.selfItems[endIndex]) {
                this.selfItems[endIndex].zIndex = endIndex;
            }

            this.bChange = true;
        }
    }

    onClickCloseBtn() {
        if (this.bChange) {
            let req = {
                embattle: []
            };
            for (let i = 0; i < 6; i++) {
                if (this.selfItems[i]) {
                    let data = this.selfItems[i].getComponent('RetinueItem').data;
                    req.embattle.push({
                        id: data.id,
                        pos: i + 1,
                    })
                }
            }
            dataManager.retinueProxy.sendUpdateBattlePos(req);
        }
        this.closeSelf();
    }

}
