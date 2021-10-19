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
import NetMsgID from "../netMsg/NetMsgID";
import { dataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyCardProxy {


    public data = null;
    static infoUpdate: string = 'BuyCardProxy_infoUpdate';
    isSending = false;

    public ctor() {

        NetNode.subscribe('drawCard.info', this.buyBack, this);
    }

    public clearData() {
        this.data = null;
    }

    buyBack(serverData) {
        this.data = serverData;
        EventMgr.raiseEvent(BuyCardProxy.infoUpdate);
    }


    public sendDrawCmd(number, target = null, call = null) {
        netManager.sendCmd(NetMsgID.NetMsgID_Draw_Card, {
            count: number
        }, {
            target: target,
            callback: call
        });
    }
}
