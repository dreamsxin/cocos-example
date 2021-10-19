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
import ClothStoreCopyItem from "../uiComponent/clothView/ClothStoreCopyItem";
import { resLoader } from "../../../base/res/ResLoader";
import SysDef from "../../../util/SysDef";
import { utils } from "../../../util/Utils";
import { UIID } from "../UIConfig";
import RenderList from "../uiComponent/common/RenderList";
import MultiLabel from "../../../util/MultiLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothArmoireView extends UIView {

    public static instance: ClothArmoireView = null;

    @property(ClothCopyItemController)
    clothCopyItemController: ClothCopyItemController = null;


    @property(RenderList)
    typeList: RenderList = null;

    @property(RenderList)
    clotheList: RenderList = null;

    @property(MultiLabel)
    lblTitle: MultiLabel = null;

    @property(MultiLabel)
    lblSingle: MultiLabel = null;

    @property(MultiLabel)
    lblTotal: MultiLabel = null;

    @property(cc.ProgressBar)
    barSingle: cc.ProgressBar = null;

    @property(cc.ProgressBar)
    barTotal: cc.ProgressBar = null;

    private lastCheckedNode = null;
    clotheData: any;


    init() {
        ClothArmoireView.instance = this;

        let datas = dataManager.clotheProxy.getClotheFirstType();
        this.typeList.data = datas;
        this.typeList.selectHandle = this.onClickTagItem.bind(this);

        if (!this.typeList.selectData) {
            this.typeList.selectData = this.typeList.data[0];
        }

    }

    onClickTypeBtn(btn: cc.Button, data: any) {
        this.onClickTagItem(data);
    }

    onClickTagItem(data) {
        ClothArmoireView.instance.lastCheckedNode = null;
        this.clotheData = dataManager.clotheProxy.bagData;

        let datas = this.clotheData[data.id - 1];

        let arr = [];
        datas.forEach(element => {
            element.forEach(element2 => {
                arr.push({ id: element2 });
            });
        });

        this.clotheList.data = arr;

        this.lblTitle.string = dataManager.GetTextById(data.name_id);

        let len = this.clotheList.data.length;
        let single = 0;
        for (let i = 0; i < len; i++) {
            if (dataManager.clotheProxy.getClotheNum(this.clotheList.data[i].id) > 0) {
                single++;
            }
        }

        this.lblSingle.string = single + '/' + len;
        this.barSingle.progress = single / len;

        let total = 0;
        let has = 0;

        this.clotheData.forEach(data => {
            data.forEach(element => {
                element.forEach(element2 => {
                    if (dataManager.clotheProxy.getClotheNum(element2) > 0) {
                        has++;
                    }
                    total++;
                });
            });
        });

        this.lblTotal.string = has + '/' + total;
        this.barTotal.progress = has / total;
    }

    onDestroy() {

        ClothArmoireView.instance = null;
    }
    onClickCloseBtn() {
        this.closeSelf();
    }
    onClickDecomposeBtn() {

        utils.showTips(dataManager.GetTextById(397));
        //uiManager.open(UIID.UIClothDecompose);
    }
    onClickSearchBtns() {

        utils.showTips(dataManager.GetTextById(397));
        //uiManager.open(UIID.UISearch);
    }

}
