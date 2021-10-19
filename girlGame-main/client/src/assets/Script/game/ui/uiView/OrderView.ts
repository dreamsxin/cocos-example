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
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import MultiLabel from "../../../util/MultiLabel";
import IconItem from "../uiComponent/common/IconItem";
import RenderList from "../uiComponent/common/RenderList";
import { EventMgr } from "../../../base/common/EventManager";
import WorkshopProxy from "../../data/WorkshopProxy";
import { dataManager } from "../../data/DataManager";
import { utils } from "../../../util/Utils";
import { uiUtils } from "../../../util/UIUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OrderView extends UIView {
    @property(MultiLabel)
    lblRefresh: MultiLabel = null;

    @property(MultiLabel)
    lblRefreshTime: MultiLabel = null;

    @property(IconItem)
    itemCost: IconItem = null;

    @property(RenderList)
    listItems: RenderList = null;
    orderData: any;

    init() {

        EventMgr.addEventListener(WorkshopProxy.orderUpdate, this.updateUI, this);

    }

    onDestroy() {
        EventMgr.removeEventListener(WorkshopProxy.orderUpdate, this.updateUI, this);
    }

    updateUI() {
        let config = dataManager.allDatas.config;
        let orderData = dataManager.workshopProxy.orderData;

        this.itemCost.node.active = false;

        if (orderData.refresh_free_count > 0) {
            this.lblRefresh.string = dataManager.GetTextById(428) + orderData.refresh_free_count;
        } else {
            this.lblRefresh.string = dataManager.GetTextById(140) + orderData.refresh_count;

            if (orderData.refresh_count > 0) {
                this.itemCost.data = {
                    id: 1,
                    count: config.refresh_diamond_num[config.refresh_diamond_num.length - orderData.refresh_count]
                };
                this.itemCost.node.active = true;
            }
        }

        uiUtils.countDown(Math.floor(orderData.refresh_etime / 1000), this.lblRefreshTime, this.sendInfo.bind(this), 142, 0, 0);

        this.listItems.data = orderData.data;
    }

    sendInfo() {
        //从新获取所有信息
        dataManager.workshopProxy.sendInfoCmd();
    }

    onOpen() {
        this.updateUI();
    }

    sendRefresh() {
        dataManager.workshopProxy.sendRefreshCmd();
    }

    onClickOrderItem() {
        uiManager.open(UIID.UIOrderDesc);
    }

    onClickRefreshBtn() {
        let orderData = dataManager.workshopProxy.orderData;
        let config = dataManager.allDatas.config;

        if (orderData.refresh_free_count > 0) {
            utils.showConfirmView(dataManager.GetTextById(431, dataManager.GetTextById(141)), this.sendRefresh.bind(this));
        } else {
            utils.showUseConfirmView(1, config.refresh_diamond_num[config.refresh_diamond_num.length - orderData.refresh_count], dataManager.GetTextById(141), this.sendRefresh.bind(this));
        }

    }

    onClickCloseBtn() {
        this.closeSelf();
    }




    // update (dt) {}
}
