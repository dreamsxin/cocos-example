// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { utils } from "../../../util/Utils";
import { dataManager } from "../../data/DataManager";
import IconItem from "../uiComponent/common/IconItem";
import SelectMax from "../uiComponent/common/SelectMax";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemUseView extends UIView {

    @property(SelectMax)
    selectMax: SelectMax = null;


    @property(MultiLabel)
    lblMoney: MultiLabel = null;

    @property(IconItem)
    iconItem: IconItem = null;
    private _data: any;


    init() {

        this.initUI();
    }
    initUI() {
        this.iconItem.data = this._data;
        this.selectMax.setStatus(0, 10, 1, 1, this.updateMoney.bind(this));
        this.updateMoney();
    }

    onDestroy() {


    }

    onOpen(fromUI: number, args): void {
        this._data = dataManager.bagProxy.getItem(args.ID);
        this.initUI();
    }

    updateMoney() {
        this.lblMoney.string = this.selectMax.getCount() * 10 + '';
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

    onClickOkBtn() {
        utils.showTips(dataManager.GetTextById(397));
    }

}
