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
import IconItem from "../uiComponent/common/IconItem";
import { dataManager } from "../../data/DataManager";
import { utils } from "../../../util/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkshopDescView extends UIView {



    @property(IconItem)
    iconItem: IconItem = null;

    @property(MultiLabel)
    lblDec: MultiLabel = null;

    @property(MultiLabel)
    lblTitle: MultiLabel = null;
    data: any;

    init() {

    }

    onOpen(uid, data) {
        if (!data) {
            return;
        }
        this.data = data;
        let cfg = dataManager.workshopProxy.getCfgByWorkId(data.type);
        this.lblDec.string = dataManager.GetTextById(424, cfg[2], cfg[1], dataManager.GetTextById(417));

        this.lblTitle.string = dataManager.GetTextById(146 + data.type - 1);
        this.iconItem.data = dataManager.bagProxy.getItem(data.id);

    }

    onClickAccBtn() {
        let config = dataManager.allDatas.config;
        let str = dataManager.bagProxy.getItemName(1)
            + dataManager.GetTextById(432);

        utils.showUseConfirmView(1, config.porduce_diamond, str, this.sendAcc.bind(this));
    }

    sendAcc() {
        dataManager.workshopProxy.sendAccCmd(this.data.type);
        this.closeSelf();
    }

    onClickCloseBtn() {
        this.closeSelf();
    }
    onClose() {
    }
    onDestroy() {

    }
    // update (dt) {}
}
