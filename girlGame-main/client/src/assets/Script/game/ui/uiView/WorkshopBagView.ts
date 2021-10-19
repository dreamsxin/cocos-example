// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import RenderList from "../uiComponent/common/RenderList";
import { dataManager } from "../../data/DataManager";
import { ItemType } from "../../data/BagProxy";
import { utils } from "../../../util/Utils";
import WorkshopProxy from "../../data/WorkshopProxy";
import { EventMgr } from "../../../base/common/EventManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkshopBagView extends UIView {

    @property(MultiLabel)
    lblSpace: MultiLabel = null;
    @property(cc.Node)
    nodeShopTip: cc.Node = null;

    @property(RenderList)
    itemList: RenderList = null;

    @property(cc.Node)
    nodeAdd: cc.Node = null;

    private index = -1;
    fromUI: number;

    init() {
        EventMgr.addEventListener(WorkshopProxy.houseUpdate, this.updateInfoUI, this);
    }
    onDestroy() {
        EventMgr.removeEventListener(WorkshopProxy.houseUpdate, this.updateInfoUI, this);
    }

    onEnable() {
        this.updateInfoUI();
    }

    updateInfoUI() {

        let type = ItemType.Workshop;
        let houseData = dataManager.workshopProxy.houseData;
        let level = houseData.level;
        let maxSpace = dataManager.allDatas.config.store_upper_limit[0];
        for (let i = 0; i < level - 1; i++) {
            maxSpace += dataManager.allDatas.config.store_add[i];
        }

        this.itemList.data = dataManager.bagProxy.getAllItemsByType(type);

        this.lblSpace.string = dataManager.GetTextById(342) + ':  ' + maxSpace;

        this.nodeAdd.active = houseData.level < dataManager.allDatas.config.store_add.length;
    }

    sendLevelup() {
        dataManager.workshopProxy.sendLevelupBagCmd();
    }

    onClickBuyBtn() {
        let config = dataManager.allDatas.config;
        let index = dataManager.workshopProxy.houseData.level - 1;
        let str = dataManager.GetTextById(337) + config.store_add[index];
        utils.showUseConfirmView(1, config.store_upgrade_need_diamond[index], str, this.sendLevelup.bind(this));
    }

    onClickCloseBtn() {
        this.closeSelf();
    }
}
