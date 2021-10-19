// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import { utils } from "../../../util/Utils";
import { dataManager } from "../../data/DataManager";
import IconItem from "../uiComponent/common/IconItem";

import RenderList from "../uiComponent/common/RenderList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemInfoVIew extends UIView {

    @property(IconItem)
    iconItem: IconItem = null;

    @property(RenderList)
    scrollViewList: RenderList = null;

    private _data = null;

    init() {
        this.initUI();
    }
    initUI() {
        this.iconItem.data = this._data;
    }


    onOpen(fromUI: number, args): void {
        this._data = dataManager.bagProxy.getItem(args.ID);
        this.initUI();
    }

    onDestroy() {

    }
    onClickCloseBtn() {
        this.closeSelf();
    }

    onClickSellBtn() {
        utils.showItemSell(this._data.id);
    }

    onClickUseBtn() {
        utils.showItemUse(this._data.id);
    }

}
