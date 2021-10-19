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
import MultiLabel from "../../../util/MultiLabel";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import UrlLoad from "../uiComponent/common/UrlLoad";
import SysDef from "../../../util/SysDef";
import { utils } from "../../../util/Utils";
import { dataManager } from "../../data/DataManager";
import { EventMgr } from "../../../base/common/EventManager";
import BuyCardProxy from "../../data/BuyCardProxy";
import RetinueItem from "../uiComponent/retinueView/RetinueItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyCardView extends UIView {

    @property(MultiLabel)
    lblLeftCount: MultiLabel = null;

    @property(cc.Node)
    nodeButton: cc.Node = null;

    @property(cc.Node)
    nodeOne: cc.Node = null;


    @property(RetinueItem)
    retinueItem: RetinueItem = null;

    @property(cc.Node)
    nodeSoul: cc.Node = null;

    @property(MultiLabel)
    lblSoulNum: MultiLabel = null;
    isSending = false;//异步加载场景，这里加个值控制发送指令

    init() {

        this.nodeButton.active = true;
        this.nodeOne.active = false;
        EventMgr.addEventListener(BuyCardProxy.infoUpdate, this.showResult, this);

        //获取剩余次数
        dataManager.buyCardProxy.sendDrawCmd(0);
    }


    onOpen() {
    }

    onClose() {

    }

    onDisable() {
        this.isSending = false;
    }

    onDestroy() {
        EventMgr.removeEventListener(BuyCardProxy.infoUpdate, this.showResult, this);
    }

    showResult() {
        let data = dataManager.buyCardProxy.data;
        if (data.hero && data.hero.length === 1) {


            this.nodeButton.active = false;
            this.nodeOne.active = true;

            let heroData = data.hero[0];

            this.retinueItem.data = dataManager.retinueProxy.getDataByID(heroData.id);

            this.nodeSoul.active = heroData.count > 0;
            if (heroData.count > 0) {
                this.lblSoulNum.string = heroData.count + '';
            }
        } else if (data.hero && data.hero.length > 1) {
            //10
            this.isSending = true;
            uiManager.open(UIID.UIBuyCardTenView);
        }

        this.lblLeftCount.string = data.count;

    }

    onClickBuyOne() {
        dataManager.buyCardProxy.sendDrawCmd(1);
    }

    onClickBuyTen() {

        if (!this.isSending) {
            dataManager.buyCardProxy.sendDrawCmd(10);
        }

    }

    onClickOK() {
        this.nodeButton.active = true;
        this.nodeOne.active = false;
    }

    onClickClose() {

        this.closeSelf();
        uiManager.open(UIID.UIMain, 1);

    }

    onClickPreview() {

        uiManager.open(UIID.UIRetinuePreview);

    }


    // update (dt) {}
}
