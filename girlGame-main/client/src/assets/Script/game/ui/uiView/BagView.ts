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

const { ccclass, property } = cc._decorator;

@ccclass
export default class BagView extends UIView {


    //随从界面 need fix

    @property(cc.Node)
    nodeSpace: cc.Node = null;

    @property(MultiLabel)
    lblSpace: MultiLabel = null;

    @property(RenderList)
    retinueOwnList: RenderList = null;

    @property(RenderList)
    retinueShopList: RenderList = null;

    @property(cc.Node)
    nodeShopTip: cc.Node = null;

    @property(RenderList)
    itemList: RenderList = null;


    @property([cc.Node])
    nodeScrolls: cc.Node[] = [];

    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;

    private index = -1;
    fromUI: number;

    init() {

    }

    onEnable() {

    }

    onOpen(fromUI: number, args) {

        this.fromUI = UIID.UIMain;

        if (args && args.index) {
            this.openIndex(args.index);
        } else {
            this.openIndex(ItemType.Item);
            this.fromUI = fromUI;
        }


    }

    openIndex(type: ItemType) {
        switch (type) {
            case ItemType.Item:
                this.index = 0;
                break;
            case ItemType.Equipment:
                this.index = 1;
                break;
            case ItemType.Retinue:
                this.index = 2;
                break;
            case ItemType.Soul:
                this.index = 3;
                break;
            case ItemType.Jewel:
                this.index = 4;
                break;
            case ItemType.RetinueStuff:
                this.index = 5;
                break;
            default:
                this.index = 0;

        }

        this.toggleContainer.toggleItems[this.index].check();

        this.updateInfoUI();
    }

    toggleRenderList(toggle: cc.Toggle) {

        let index = toggle.node.parent.children.indexOf(toggle.node);
        if (this.index === index) {
            return;
        }

        this.index = index;
        this.updateInfoUI();
    }

    updateInfoUI() {

        let type = ItemType.Retinue;
        switch (this.index) {
            case 0:
                type = ItemType.Item;
                break;
            case 1:
                type = ItemType.Equipment;
                break;
            case 2:
                type = ItemType.Retinue;
                break;
            case 3:
                type = ItemType.Soul;
                break;
            case 4:
                type = ItemType.Jewel;
                break;
            case 5:
                type = ItemType.RetinueStuff;
                break;
            default:
                type = ItemType.Item;

        }

        this.nodeScrolls[0].active = type != ItemType.Retinue;
        this.nodeScrolls[1].active = type == ItemType.Retinue;


        let len = 0;
        let maxSpace = 70;


        switch (type) {
            case ItemType.Retinue:
                this.retinueOwnList.data = dataManager.retinueProxy.getUnLockData();
                this.retinueShopList.data = dataManager.retinueProxy.getShopData();
                this.nodeShopTip.active = this.retinueShopList.data && this.retinueShopList.data.length > 0;
                break;
            default:
                this.itemList.data = dataManager.bagProxy.getAllItemsByType(type);
        }

        this.nodeSpace.active = type === ItemType.Equipment;
        this.lblSpace.string = dataManager.GetTextById(342) + ':  ' + len + '/' + maxSpace;
    }

    onDestroy() {

    }

    onClickCloseBtn() {
        this.closeSelf();
        if (this.fromUI == UIID.UIMain) {

            uiManager.open(UIID.UIMain, 1);
        } else {

            uiManager.open(this.fromUI);
        }
    }

    onClickVIPBtn() {
        uiManager.open(UIID.UIBagVIPView);
    }


    onClickInBag(btn, data) {

        uiManager.open(UIID.UIRetinue, { retinue: data, allRetinue: this.retinueOwnList.data });

    }


}
