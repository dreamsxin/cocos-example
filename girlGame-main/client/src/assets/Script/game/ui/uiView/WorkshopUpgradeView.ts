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
import { EventMgr } from "../../../base/common/EventManager";
import WorkshopProxy from "../../data/WorkshopProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkshopUpgradeView extends UIView {



    @property(MultiLabel)
    lb_level: MultiLabel = null;
    @property(MultiLabel)
    lb_all_level: MultiLabel = null;
    @property(MultiLabel)
    lb_order_level: MultiLabel = null;
    @property(MultiLabel)
    lb_order_num: MultiLabel = null;
    @property(RenderList)
    node_res_item: RenderList = null;

    @property(MultiLabel)
    lblTip: MultiLabel = null;

    init() {

        EventMgr.addEventListener(WorkshopProxy.infoUpdate, this.updateInfo, this);

        this.updateInfo();
    }

    onDestroy() {
        EventMgr.removeEventListener(WorkshopProxy.infoUpdate, this.updateInfo, this);
    }

    updateInfo() {
        let data = dataManager.workshopProxy.workshopData;
        let cfg = dataManager.workshopProxy.allDatas[data.level];

        this.lb_level.string = data.level + '';
        this.lb_all_level.string = dataManager.GetTextById(238) + data.level;
        this.lb_order_level.string = dataManager.GetTextById(238) + cfg.order_level;
        this.lb_order_num.string = dataManager.allDatas.config.daily_order_number;

        if (dataManager.playerProxy.data.career_lv < cfg.rank_id) {
            this.lblTip.string = dataManager.GetTextById(430, cfg.rank_id);
        }

        let items = [];
        for (let i = 0; i < cfg.material_id.length; i++) {
            items.push({
                id: cfg.material_id[i],
                count: cfg.material_num[i],
            });
        }

        this.node_res_item.data = items;




    }

    onOpen() {


    }
    onClickCloseBtn() {
        this.closeSelf();
    }
    onClickUpgradeBtn() {
        dataManager.workshopProxy.sendLevelupCmd();
    }
    onClose() {
    }

    // update (dt) {}
}
