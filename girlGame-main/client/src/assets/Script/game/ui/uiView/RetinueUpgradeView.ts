// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import UrlLoad from "../uiComponent/common/UrlLoad";
import RetinueStars from "../uiComponent/retinueView/RetinueStars";
import { dataManager } from "../../data/DataManager";
import SysDef from "../../../util/SysDef";



import RenderList from "../uiComponent/common/RenderList";
import { UIID } from "../UIConfig";
import { EventMgr } from "../../../base/common/EventManager";
import RetinueProxy from "../../data/RetinueProxy";
import { ResourceType } from "../../data/PlayerProxy";
import BagProxy, { bagProxy, ItemType } from "../../data/BagProxy";
import RedDot from "../uiComponent/common/RedDot";


const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueUpgradeView extends UIView {

    @property(cc.Node)
    node_effect_lv_up: cc.Node = null;

    @property(cc.Node)
    node_lb_lv_up: cc.Node = null;

    @property(cc.Node)
    node_lb_tp_up: cc.Node = null;

    @property(cc.Node)
    node_lb_sx_up: cc.Node = null;
    @property(MultiLabel)
    lblTitle: MultiLabel = null;

    @property(MultiLabel)
    lblName: MultiLabel = null;

    @property(MultiLabel)
    lblStep: MultiLabel = null;

    @property(MultiLabel)
    lblLv: MultiLabel = null;

    @property(MultiLabel)
    lblExp: MultiLabel = null;

    @property(UrlLoad)
    nodeSpine: UrlLoad = null;

    @property(RetinueStars)
    stars: RetinueStars = null;

    @property(cc.ProgressBar)
    barExp: cc.ProgressBar = null;


    @property(RenderList)
    labelList: RenderList = null;

    @property(RenderList)
    itemList: RenderList = null;


    @property(cc.Node)
    nodeExp: cc.Node = null;

    @property(cc.Node)
    nodeUpBtns: cc.Node = null;

    @property(cc.Node)
    nodeBreakBtns: cc.Node = null;

    @property(cc.Node)
    nodeStarBtns: cc.Node = null;


    @property(MultiLabel)
    lblBreakCost: MultiLabel = null;

    @property(MultiLabel)
    lblBreakNeedLevel: MultiLabel = null;

    @property(MultiLabel)
    lblStarNeedLevel: MultiLabel = null;

    private data = null;
    private index = null;
    allDatas: any;

    init(args: { retinue: any; allDatas: any; UIid: number }): void {



        if (!args || !args.allDatas) {
            return;
        }
        this.data = args.retinue;
        this.allDatas = args.allDatas;
        this.index = args.allDatas.indexOf(args.retinue);

        if (this.index < 0) {
            console.error('retinue no pos');
            return;
        }
        this.UIid = args.UIid;

        switch (this.UIid) {
            case UIID.UIRetinueUpgrade:
                this.lblTitle.string = dataManager.GetTextById(206);
                break;
            case UIID.UIRetinueBreak:
                this.lblTitle.string = dataManager.GetTextById(207);
                break;
            case UIID.UIRetinueStar:
                this.lblTitle.string = dataManager.GetTextById(208);
                break;
        }

    }

    onDestroy() {
        EventMgr.removeEventListener(RetinueProxy.infoUpdate, this.updateLeveUp, this);
        EventMgr.removeEventListener(BagProxy.infoUpdate, this.updateItems, this);
    }

    onLoad() {
        this.updateUI();
        EventMgr.addEventListener(RetinueProxy.infoUpdate, this.updateLeveUp, this);
        EventMgr.addEventListener(BagProxy.infoUpdate, this.updateItems, this);
    }

    updateCommon() {
        let data = this.data;

        this.lblName.string = dataManager.GetTextById(data.name_id);
        this.lblStep.string = data.step > 0 ? '+ ' + data.step : '';
        this.lblLv.string = data.level;
        this.stars.star = dataManager.retinueProxy.getShowStarNum(data.star);

        let spineUrl = SysDef.getRetinuePaintingUrl(data.hero_pic);
        if (spineUrl) {
            this.nodeSpine.animation = "idle";
            this.nodeSpine.url = spineUrl;
        }
    }

    updateItems() {
        let data = this.data;
        let dataCur = null;
        switch (this.UIid) {
            case UIID.UIRetinueUpgrade:

                this.itemList.data = dataManager.bagProxy.getAllItemsByType(ItemType.Item, 1, true);

                break;
            case UIID.UIRetinueBreak:

                dataCur = dataManager.retinueProxy.getBreakStatus(data.id, data.step);
                //进阶消耗物品ID	消耗的物品数
                //costitemid	costitemnum
                let k = [];
                for (let i = 0; i < dataCur.costitemid.length; i++) {
                    let itemId = dataCur.costitemid[i];
                    let itemNum = dataCur.costitemnum[i];
                    if (itemId <= ResourceType.Exp) {
                        continue;
                    }
                    let itemData = dataManager.bagProxy.getItem(itemId);
                    itemData.need = itemNum;
                    k.push(itemData);
                }

                this.itemList.data = k;


                let index = dataCur.costitemid.indexOf(ResourceType.Silver);

                this.lblBreakCost.string = dataCur.costitemnum[index] + '';

                let silverData = dataManager.bagProxy.getItem(ResourceType.Silver);

                this.lblBreakCost.node.color = dataCur.costitemnum[index] > silverData.num ? cc.color(163, 77, 77, 255) : cc.color(100, 83, 50, 255);

                break;
            case UIID.UIRetinueStar:

                dataCur = dataManager.retinueProxy.getStarStatus(data.id, data.star);
                //debris_num
                let itemData = dataManager.bagProxy.getItem(data.hero_debris_id);
                itemData.need = dataCur.debris_num;
                this.itemList.data = [itemData];



                break;
        }
    }

    updateLeveUp() {

        this.updateUI();
        this.node_effect_lv_up.active = true;
        this.node_effect_lv_up.getComponent(sp.Skeleton).setAnimation(0, "animation", false);
        var node_up = null;
        switch (this.UIid) {
            case UIID.UIRetinueUpgrade:
                node_up = this.node_lb_lv_up;
                break;
            case UIID.UIRetinueBreak:

                node_up = this.node_lb_tp_up;

                break;
            case UIID.UIRetinueStar:

                node_up = this.node_lb_sx_up;
                break;
        }


        node_up.active = true;
        node_up.opacity = 255;
        node_up.y = 150;

        node_up.stopAllActions();
        var move = cc.moveTo(0.5, 0, 250);
        var faout = cc.fadeOut(0.5);
        var seq = cc.sequence(move, faout);
        node_up.runAction(seq);
    }
    updateUI() {

        this.updateCommon();

        let data = this.data;

        this.nodeExp.active = false;
        this.nodeUpBtns.active = false;
        this.nodeBreakBtns.active = false;
        this.nodeStarBtns.active = false;


        let dataCur = null;
        let dataNext = null;

        let statusChanges = [0, 0, 0, 0, 0, 0, 0, 0];

        switch (this.UIid) {
            case UIID.UIRetinueUpgrade:
                this.nodeExp.active = true;
                this.nodeUpBtns.active = true;
                this.lblTitle.string = dataManager.GetTextById(206);

                let needExp = dataManager.allDatas.hero_levelexp[data.level];

                this.barExp.progress = data.exp / needExp.exp;
                this.lblExp.string = data.exp + '/' + needExp.exp;

                dataCur = dataManager.retinueProxy.getStatus(data.id, data.level);
                dataNext = dataManager.retinueProxy.getStatus(data.id, data.level + 1);
                for (let i = 0; i < 8; i++) {
                    statusChanges[i] = dataNext.properties[i] - dataCur.properties[i];
                }

                break;
            case UIID.UIRetinueBreak:
                this.nodeBreakBtns.active = true;
                this.lblTitle.string = dataManager.GetTextById(216);

                dataCur = dataManager.retinueProxy.getBreakStatus(data.id, data.step);
                for (let i = 0; i < 8; i++) {
                    statusChanges[i] = dataCur.properties[i];
                }

                this.lblBreakNeedLevel.node.active = data.level < dataCur.need_level;
                this.lblBreakNeedLevel.string = dataCur.need_level ? dataManager.GetTextById(215) + ' ' + dataCur.need_level : '';


                break;
            case UIID.UIRetinueStar:
                this.nodeStarBtns.active = true;
                this.lblTitle.string = dataManager.GetTextById(212);

                dataCur = dataManager.retinueProxy.getStarStatus(data.id, data.star);
                for (let i = 0; i < 8; i++) {
                    statusChanges[i] = dataCur.properties[i];
                }

                this.lblStarNeedLevel.node.active = data.step < dataCur.need_step;
                this.lblStarNeedLevel.string = dataCur.need_step ? dataManager.GetTextById(358) + ' ' + dataCur.need_step : '';

                break;
        }



        if (dataCur) {

            if (!dataNext) {
                dataNext = dataCur;
            }

            let statusArr = [];
            let len = dataCur.properties.length;
            for (let i = 0; i < len; i++) {
                let satatus = { index: i, cur: data.status[i], next: data.status[i] + statusChanges[i] };
                statusArr.push(satatus);
            }

            this.labelList.data = statusArr;



        } else {
            //this.labelList.list = null;
            //this.itemList.list = null;
        }

        this.updateItems();
    }

    updateRedDot() {
        if (!this.data) {
            //没有随从
            RedDot.change('retinueUp', false);
            RedDot.change('retinueAwake', false);
            RedDot.change('retinueStar', false);
            RedDot.change('retinueBreak', false);
        } else {
            RedDot.change('retinueUp', dataManager.retinueProxy.ableToLevelUp(this.data));
            RedDot.change('retinueBreak', dataManager.retinueProxy.ableToBreak(this.data));
            RedDot.change('retinueStar', dataManager.retinueProxy.ableToStarAdd(this.data));
        }
    }



    onClickLeft() {
        this.index--;

        this.index = this.index >= 0 ? this.index : this.allDatas.length - 1;

        this.data = this.allDatas[this.index];
        this.updateUI();
        this.updateRedDot();
    }

    onClickRight() {
        this.index++;

        this.index = this.index <= this.allDatas.length - 1 ? this.index : 0;

        this.data = this.allDatas[this.index];
        this.updateUI();
        this.updateRedDot();
    }

    onClickCmdBtn() {
        switch (this.UIid) {
            case UIID.UIRetinueUpgrade:
                dataManager.retinueProxy.sendUpCmd(this.data.id, 0);
                break;
            case UIID.UIRetinueBreak:
                dataManager.retinueProxy.sendBreakCmd(this.data.id);
                break;
            case UIID.UIRetinueStar:
                dataManager.retinueProxy.sendStarCmd(this.data.id);
                break;
        }
    }

    onClickUpOneKeyBtn() {
        dataManager.retinueProxy.sendUpCmd(this.data.id, 1);
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

}
