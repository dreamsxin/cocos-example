// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventMgr } from "../../base/common/EventManager";
import { netManager } from "../../base/network/NetManager";
import { NetNode } from "../../base/network/NetNode";
import { uiManager } from "../../base/ui/UIManager";
import NetMsgID from "../netMsg/NetMsgID";
import { UIID } from "../ui/UIConfig";
import { dataManager } from "./DataManager";


const { ccclass } = cc._decorator;

@ccclass
export default class WorkshopProxy {

    allDatas: any;
    workshopData: any;
    orderData: any;
    houseData: any;
    static infoUpdate: string = 'WorkshopProxy_infoUpdate';
    static rewardUpdate: string = 'WorkshopProxy_rewardUpdate';
    static orderUpdate: string = 'WorkshopProxy_orderUpdate';
    static houseUpdate: string = 'WorkshopProxy_houseUpdate';
    workshopRewardData: any;

    ctor() {

        NetNode.subscribe('work.info', this.workshopInfo, this);
        NetNode.subscribe('work.reward', this.workshopReward, this);
        NetNode.subscribe('order.info', this.orderInfo, this);
        NetNode.subscribe('warehouse.info', this.warehouseInfo, this);

        this.allDatas = dataManager.allDatas.business;
    }

    clearData() {

    }

    workshopInfo(serverData) {
        if (!serverData) {
            return;
        }


        this.workshopData = serverData;

        EventMgr.raiseEvent(WorkshopProxy.infoUpdate);
    }

    workshopReward(serverData) {
        if (!serverData) {
            return;
        }


        this.workshopRewardData = serverData;

        EventMgr.raiseEvent(WorkshopProxy.rewardUpdate);
    }

    orderInfo(serverData) {
        if (!serverData) {
            return;
        }
        this.orderData = serverData;
        if (this.orderData.data) {
            this.orderData.data.sort((a, b) => {
                return a.status - b.status;
            })
        }
        dataManager.systemProxy.floatReward();
        EventMgr.raiseEvent(WorkshopProxy.orderUpdate);
    }

    warehouseInfo(serverData) {
        if (!serverData) {
            return;
        }
        this.houseData = serverData;
        dataManager.bagProxy.onItemList(serverData.data);


        EventMgr.raiseEvent(WorkshopProxy.houseUpdate);
    }

    getTypeStr(workShopType) {
        let str = '';
        switch (workShopType) {
            case 1:
                str = 'loom';
                break;
            case 2:
                str = 'dyer';
                break;
            case 3:
                str = 'sklkworm';
                break;
            case 4:
                str = 'lathe';
                break;
        }

        return str;
    }

    getMaxCount(workShopType) {
        let str = this.getTypeStr(workShopType);
        return this.allDatas[this.workshopData.level][str][3];
    }

    getItemByWorkId(id) {
        let str = this.getTypeStr(id);
        let itemId = this.allDatas[this.workshopData.level][str][0];
        return dataManager.bagProxy.getItem(itemId);
    }

    getCfgByWorkId(id) {
        let str = this.getTypeStr(id);
        return this.allDatas[this.workshopData.level][str];
    }

    /**描述：生产列表*/
    sendInfoCmd() {
        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_Info, null);
    }
    /**描述：收取产物*/
    sendCollectCmd(type: number) {
        let req = {
            type: type
        };
        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_collect, req);
    }
    /**描述：加速生产*/
    sendAccCmd(type: number) {
        let req = {
            type: type
        };
        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_acc, req);
    }
    /**描述：升级柜台*/
    sendLevelupCmd() {

        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_levelup, null);
    }
    /**描述：刷新订单（免费刷新、付费刷新）*/
    sendRefreshCmd() {
        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_refresh, null);
    }
    /**描述：领取订单报酬*/
    sendOrderGetCmd(orderId: number) {
        let req = {
            orderId: orderId
        };
        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_task_get, req);
    }
    /**描述：升级仓库*/
    sendLevelupBagCmd() {
        netManager.sendCmd(NetMsgID.NetMsgID_Workshop_bag_levelup, null);
    }
}
