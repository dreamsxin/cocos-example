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
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import { utils } from "../../../util/Utils";
import UrlLoad from "../uiComponent/common/UrlLoad";
import IconItem from "../uiComponent/common/IconItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AlertView extends UIView {

    @property(MultiLabel)
    lblTitle: MultiLabel = null;
    @property(MultiLabel)
    lblContent: MultiLabel = null;

    @property(MultiLabel)
    lblOK: MultiLabel = null;
    @property(MultiLabel)
    lblCancel: MultiLabel = null;

    @property(IconItem)
    iconItem: IconItem = null;
    args: any = null;

    init() {

    }

    onEnable() {

    }

    onOpen(fromUI: number, args) {

        this.args = args;
        this.updateInfoUI();

    }

    updateInfoUI() {
        if (!this.args) {
            return;
        }
        this.lblContent.string = this.args.content;
        this.lblTitle.string = this.args.lblTitle ? this.args.lblTitle : dataManager.GetTextById(426);
        this.lblOK.string = this.args.lblOK ? this.args.lblOK : dataManager.GetTextById(229);
        this.lblCancel.string = this.args.lblCancel ? this.args.lblCancel : dataManager.GetTextById(230);

        this.iconItem.node.active = this.args.itemID > 0;
        this.iconItem.data = dataManager.bagProxy.getItem(this.args.itemID);
    }

    onDestroy() {

    }

    onClickOKBtn() {
        if (this.args.call) {
            this.args.call();
        }
        this.closeSelf();
    }

    onClickCloseBtn() {
        this.closeSelf();
    }
}
