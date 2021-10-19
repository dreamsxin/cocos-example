// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClothCopyItem from "../clothView/ClothCopyItem";
import MultiLabel from "../../../../util/MultiLabel";
import RenderListItem from "../common/RenderListItem";
import ClothMainCopyItem from "../clothView/ClothMainCopyItem";
import { dataManager } from "../../../data/DataManager";
import ClothView from "../../uiView/ClothView";
import { EventMgr } from "../../../../base/common/EventManager";
import ClotheProxy from "../../../data/ClotheProxy";
import { uiManager } from "../../../../base/ui/UIManager";
import { UIID } from "../../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothScoreCopyItem extends ClothMainCopyItem {


    @property(MultiLabel)
    lb_have_num: MultiLabel = null;

    @property(cc.Button)
    btnWear: cc.Button = null;

    @property(cc.Button)
    btnWeared: cc.Button = null;

    @property(cc.Button)
    btnInfo: cc.Button = null;




    start() {

    }

    updateInfo() {
        super.updateInfo();

        this.btnWear.node.active = false;
        this.btnInfo.node.active = false;
        this.btnWeared.node.active = false;

        if (dataManager.clotheProxy.bOwn(this.data)) {

            if (dataManager.clotheProxy.bWearing(this.data, ClothView.instance.node_spine.data)) {
                this.btnWeared.node.active = true;
            } else {

                this.btnWear.node.active = true;
            }

            this.lb_have_num.string = dataManager.GetTextById(157) + dataManager.clotheProxy.getClotheNum(this.data);

        } else {

            this.btnInfo.node.active = true;
            this.lb_have_num.string = dataManager.GetTextById(157) + dataManager.clotheProxy.getClotheNum(this.data);
        }


    }

    onClickBtn() {

        ClothView.instance.updateClotheData(this.data);

        EventMgr.raiseEvent(ClotheProxy.clothesWear);
    }

    onClickInfoBtn() {

        uiManager.open(UIID.UIClothDetails, this.data);

    }
}
