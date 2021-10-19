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
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import ClothTagController from "../uiComponent/clothView/ClothTagController";
import { utils } from "../../../util/Utils";
import ClothStoreCopyItem from "../uiComponent/clothView/ClothStoreCopyItem";
import ClothDecomposeCopyItem from "../uiComponent/clothView/ClothDecomposeCopyItem";
import MultiLabel from "../../../util/MultiLabel";
import { UIID } from "../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothDecomposeView extends UIView {

    public static instance: ClothDecomposeView = null;

    @property(ClothCopyItemController)
    clothCopyItemController: ClothCopyItemController = null;


    @property(ClothTagController)
    clothTagController: ClothTagController = null;

    @property(cc.Node)
    node_decompose: cc.Node = null;

    @property(MultiLabel)
    lb_tips: MultiLabel = null;

    @property(MultiLabel)
    lb_switch: MultiLabel = null;

    private count = 0;
    clotheData: any[];

    init() {
        ClothDecomposeView.instance = this;
        this.clothCopyItemController.init(this.onClickClothItem);
        this.clothTagController.initClothTypes(this.onClickTagItem);
        this.lb_tips.string = dataManager.GetTextById(118);
        this.lb_switch.string = dataManager.GetTextById(119);

        this.clotheData = dataManager.clotheProxy.bagData;
    }
    onClickClothItem(node, data) {
        node.getComponent(ClothDecomposeCopyItem).clickUpdate(true);
        ClothDecomposeView.instance.count++;
        if (ClothDecomposeView.instance.count > 0) {

            ClothDecomposeView.instance.lb_tips.string = dataManager.GetTextById(121) + ClothDecomposeView.instance.count;
            ClothDecomposeView.instance.node_decompose.active = true;
        }
    }
    onClickTagItem(data) {
        ClothDecomposeView.instance.clothCopyItemController.updateAllItems(this.clotheData[data.id][0]);
    }
    onDestroy() {

        ClothDecomposeView.instance = null;
    }

    onClickCloseBtn() {
        this.closeSelf();
    }
    onClickDecomposeBtn() {
        uiManager.open(UIID.UIDropItem)
    }
    onClickSwitchBtn() {

    }
}
