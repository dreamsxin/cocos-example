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
import MultiLabel from "../../../util/MultiLabel";
import { dataManager } from "../../data/DataManager";
import RenderList from "../uiComponent/common/RenderList";
import { utils } from "../../../util/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OrderDescView extends UIView {

    public static instance: OrderDescView = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(MultiLabel)
    lb_desc: MultiLabel = null;


    @property(RenderList)
    listReward: RenderList = null;

    @property(RenderList)
    listRes: RenderList = null;
    data: any;
    isOK: boolean;



    init() {
        OrderDescView.instance = this;
    }

    updateUI() {

        let order = dataManager.allDatas.order_task[this.data.id];

        this.lb_name.string = dataManager.GetTextById(order.name_id);
        this.lb_desc.string = dataManager.GetTextById(order.task_desc);

        this.listReward.data = this.data.rwd;


        this.isOK = true;

        let items = [];
        for (let i = 0; i < order.require_id.length; i++) {
            items.push({
                id: order.require_id[i],
                need: order.require_num[i]

            });
            if (order.require_num[i] > dataManager.bagProxy.getItem(order.require_id[i]).count) {
                this.isOK = false;
            }
        }

        this.listRes.data = items;

    }

    onOpen(uid, arg) {
        this.data = arg;
        this.updateUI();
    }
    onClickCloseBtn() {
        this.closeSelf();
    }
    onClickFinishBtn() {
        if (this.isOK) {
            dataManager.workshopProxy.sendOrderGetCmd(this.data.id);
            this.closeSelf();
        } else {
            utils.showTips(dataManager.GetTextById(429));
        }
    }
    onClose() {
    }
    onDestroy() {
        OrderDescView.instance = null;
    }
    // update (dt) {}
}
