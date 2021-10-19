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
import WorkshopCopyItem from "../uiComponent/workshopView/WorkshopCopyItem";
import { dataManager } from "../../data/DataManager";
import { EventMgr } from "../../../base/common/EventManager";
import WorkshopProxy from "../../data/WorkshopProxy";
import SysDef from "../../../util/SysDef";
import { ResourceType } from "../../data/PlayerProxy";
import FlyItem from "../uiComponent/workshopView/FlyItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkshopView extends UIView {


    @property(FlyItem)
    flyItem: FlyItem = null;

    @property(cc.Node)
    nodeBag: cc.Node = null;

    @property(cc.Node)
    node_upgrade: cc.Node = null;

    @property(cc.Node)
    nodeOrder: cc.Node = null;

    @property(cc.Node)
    node_copy_item: cc.Node = null;

    private workList = [];
    private positionList = [cc.v3(-40, -270), cc.v3(-210, -50), cc.v3(90, 220), cc.v3(-80, 390)]
    flyPool: NodePool;
    init() {



        EventMgr.addEventListener(WorkshopProxy.rewardUpdate, this.updateRewardUI, this);
        EventMgr.addEventListener(WorkshopProxy.infoUpdate, this.updateUI, this);
        EventMgr.addEventListener(WorkshopProxy.orderUpdate, this.updateOrderUI, this);

        this.initUI();

        this.flyPool = new NodePool;
        this.flyPool.init(this.flyItem.node);

        dataManager.workshopProxy.sendInfoCmd();
    }

    onDestroy() {
        EventMgr.removeEventListener(WorkshopProxy.rewardUpdate, this.updateRewardUI, this);
        EventMgr.removeEventListener(WorkshopProxy.infoUpdate, this.updateUI, this);
        EventMgr.removeEventListener(WorkshopProxy.orderUpdate, this.updateOrderUI, this);

        this.flyPool.destory();
    }

    initUI() {
        this.workList.splice(0);
        for (let pos in this.positionList) {
            var node = cc.instantiate(this.node_copy_item);
            node.parent = this.node_copy_item.parent;
            node.position = this.positionList[pos];
            node.opacity = 0;
            this.workList.push(node);
        }
        this.node_copy_item.active = false;
    }

    updateUI() {
        this.workList.forEach((element, id) => {
            element.opacity = 255;
            element.getComponent(WorkshopCopyItem).data = dataManager.workshopProxy.workshopData.data[id];
        })

        let data = dataManager.workshopProxy.workshopData;
        let cfg = dataManager.workshopProxy.allDatas[data.level];

        this.node_upgrade.active = true;
        for (let i = 0; i < cfg.material_id.length; i++) {
            if (cfg.material_num[i] > dataManager.bagProxy.getItem(cfg.material_id[i]).count) {
                this.node_upgrade.active = false;
                break;
            }
        }


    }

    updateRewardUI() {
        //领取道具
        let reward = dataManager.workshopProxy.workshopRewardData;

        let flyItem = this.flyPool.getNode();
        flyItem.active = true;
        flyItem.parent = this.node;
        flyItem.getComponent('FlyItem').data = {
            startPos: this.positionList[reward.type - 1],
            endPos: this.nodeBag.position,
            reward: reward,
            nodePool: this.flyPool
        }

    }

    updateOrderUI() {
        this.nodeOrder.active = false;
        let orders = dataManager.workshopProxy.orderData;
        for (let i = 0; orders.data && i < orders.data.length; i++) {
            if (orders.data[i].status === 0) {
                this.nodeOrder.active = true;
                break;
            }
        }
    }

    onOpen() {



    }

    onClickBagBtn() {

        uiManager.open(UIID.UIWorkshopBag);
    }

    onClickCounterUpgradeBtn() {

        uiManager.open(UIID.UIWorkshopUpgrade);
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

    // update (dt) {}
}
