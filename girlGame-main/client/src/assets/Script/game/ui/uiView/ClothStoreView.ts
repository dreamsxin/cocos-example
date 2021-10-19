// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import { uiManager } from "../../../base/ui/UIManager";
import { dataManager } from "../../data/DataManager";
import StyleCopyItem from "../uiComponent/searchView/StyleCopyItem";
import TagCopyItem from "../uiComponent/searchView/TagCopyItem";
import ClothChoosetypeItem from "../uiComponent/clothView/ClothChoosetypeItem";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import ClothTagController from "../uiComponent/clothView/ClothTagController";
import { utils } from "../../../util/Utils";
import ToggleCopyItem from "../uiComponent/clothView/ToggleCopyItem";
import ClothStoreCopyItem from "../uiComponent/clothView/ClothStoreCopyItem";
import MultiLabel from "../../../util/MultiLabel";
import { resLoader } from "../../../base/res/ResLoader";
import SysDef from "../../../util/SysDef";
import { UIID } from "../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothStoreView extends UIView {

    public static instance: ClothStoreView = null;

    @property(ClothCopyItemController)
    clothCopyItemController: ClothCopyItemController = null;


    @property(ClothTagController)
    clothTagController: ClothTagController = null;

    @property(cc.Node)
    node_tag: cc.Node = null;

    @property(cc.Node)
    node_star: cc.Node = null;

    @property(cc.Sprite)
    spr_icon: cc.Sprite = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(MultiLabel)
    lb_desc: MultiLabel = null;

    @property(MultiLabel)
    lb_have: MultiLabel = null;


    private lastCheckedNode = null;


    private starList = [];
    private tagList = [];
    private data = null;


    init() {
        ClothStoreView.instance = this;
        this.initUI();
    }
    initUI() {
        this.clothCopyItemController.init(this.onClickClothItem, true);
        this.clothTagController.initClothTypes(this.onClickTagItem);
    }


    onDestroy() {

        ClothStoreView.instance = null;
    }
    onClickCloseBtn() {
        this.closeSelf();
    }
    onClickClothItem(node, data) {
        if (ClothStoreView.instance.lastCheckedNode != null) {
            ClothStoreView.instance.lastCheckedNode.getComponent(ClothStoreCopyItem).clickUpdate(false);
        }
        node.getComponent(ClothStoreCopyItem).clickUpdate(true);
        ClothStoreView.instance.lastCheckedNode = node;
        ClothStoreView.instance.showCurrentData(data);
    }
    showCurrentData(data) {
        ClothStoreView.instance.data = data;
        ClothStoreView.instance.resetTags();
        ClothStoreView.instance.initStars(data);
        ClothStoreView.instance.initTags(data);
        ClothStoreView.instance.lb_name.string = data.clothId;
        ClothStoreView.instance.lb_have.string = dataManager.GetTextById(111) + 1;

    }
    initStars(data) {
        for (var i = 0; i < 5; i++) {
            var item = cc.instantiate(ClothStoreView.instance.node_star);
            item.parent = ClothStoreView.instance.node_star.parent;
            item.x = ClothStoreView.instance.node_star.x + 25 * i;
            item.y = ClothStoreView.instance.node_star.y;
            if (i < dataManager.getAccessorieData()[data.clothId].quality)
                item.active = true;
            ClothStoreView.instance.starList.push(item);
        }
    }
    initTags(data) {
        for (var i = 0; i < dataManager.getAccessorieData()[data.clothId].style_id.length; i++) {
            var item = cc.instantiate(ClothStoreView.instance.node_tag);
            item.parent = ClothStoreView.instance.node_tag.parent;
            item.x = ClothStoreView.instance.node_tag.x;
            item.y = ClothStoreView.instance.node_tag.y - 25 * i;
            item.active = true;
            resLoader.loadRes(SysDef.styleUrl + dataManager.getAccessorieStyleData()[dataManager.getAccessorieData()[data.clothId].style_id[i]].icon, cc.Texture2D, (err, res) => {
                item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            })
            ClothStoreView.instance.tagList.push(item);
        }
    }
    resetTags() {
        for (var i = 0; i < ClothStoreView.instance.starList.length; i++) {
            ClothStoreView.instance.starList[i].destroy();
        }
        ClothStoreView.instance.starList.splice(0);
        for (var i = 0; i < ClothStoreView.instance.tagList.length; i++) {
            ClothStoreView.instance.tagList[i].destroy();
        }
        ClothStoreView.instance.tagList.splice(0);
    }
    onClickTagItem(data) {
        ClothStoreView.instance.lastCheckedNode = null;
        ClothStoreView.instance.clothCopyItemController.updateAllItems(dataManager.clotheProxy.bagData[data.id][0]);
    }

    onClickBuyBtn() {
        uiManager.open(UIID.UIClothBuy, this.data);
    }
    onClickSearchBtn() {

        uiManager.open(UIID.UISearch);
    }
}
