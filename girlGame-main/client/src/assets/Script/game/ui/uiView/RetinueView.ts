// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import SysDef from "../../../util/SysDef";
import { dataManager } from "../../data/DataManager";
import MultiLabel from "../../../util/MultiLabel";
import UrlLoad from "../uiComponent/common/UrlLoad";
import RetinueStars from "../uiComponent/retinueView/RetinueStars";
import { EventMgr } from "../../../base/common/EventManager";
import RedDot from "../uiComponent/common/RedDot";
import RenderList from "../uiComponent/common/RenderList";
import RetinueProxy from "../../data/RetinueProxy";
import { ItemType } from "../../data/BagProxy";
import { utils } from "../../../util/Utils";
import MainBottomMenu from "../uiComponent/mianView/MainBottomMenu";


const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueView extends UIView {


    @property(UrlLoad)
    nodeSpine: UrlLoad = null;

    @property(UrlLoad)
    spJob: UrlLoad = null;

    @property(MultiLabel)
    lblName: MultiLabel = null;

    @property(MultiLabel)
    lblStep: MultiLabel = null;

    @property(MultiLabel)
    lblPower: MultiLabel = null;

    @property(RetinueStars)
    stars: RetinueStars = null;

    @property(UrlLoad)
    typeSprite: UrlLoad = null;

    @property(RenderList)
    retinueList: RenderList = null;

    @property(cc.Node)
    nodeTop: cc.Node = null;


    @property(cc.Node)
    nodeToBag: cc.Node = null;

    @property(cc.Node)
    nodeBattleBtn1: cc.Node = null;

    @property(cc.Node)
    nodeBattleBtn2: cc.Node = null;


    @property(MainBottomMenu)
    node_menu: MainBottomMenu = null;

    private retinueData = null;
    private curIndex = 0;
    allRetinueData: any;

    init() {


        EventMgr.addEventListener(RetinueProxy.infoUpdate, this.updateUI, this);


    }

    onDestroy() {



        EventMgr.removeEventListener(RetinueProxy.infoUpdate, this.updateUI, this);
    }

    onOpen(fromUI: number, args): void {
        this.node_menu.checkStatus(1);
        this.nodeToBag.active = false;

        if (args) {
            this.nodeToBag.active = true;
            this.allRetinueData = args.allRetinue;
            this.retinueData = args.retinue;

            this.updateSpine();
            this.updateInfoUI();

            if (this.retinueData) {
                this.onClickStar();
            }
            this.nodeBattleBtn1.active = false;
            this.nodeBattleBtn2.active = false;

            this.nodeTop.active = false;

        } else {
            this.initBattleUI();
        }
    }

    onTop() {
        this.updateRedDot();
        //当前选择框不在随从上，回到先前选择的随从上
        if (this.retinueList.data && this.retinueList.data[this.curIndex] && !this.retinueList.data[this.curIndex].retinueData) {
            for (let i = 0; i < this.retinueList.data.length; i++) {
                if (this.retinueList.data[i].retinueData === this.retinueData) {
                    this.retinueList.selectData = this.retinueList.data[i];
                    break;
                }
            }

            this.updateUI();
        }
    }

    /**
     * 刷新阵容头像按钮
     */
    updateListData() {

        let allData = [];
        let index = 0;
        for (let i = 0; i < 6; i++) {
            if (dataManager.retinueProxy.getDataByPos(i + 1)) {
                allData.push({
                    retinueData: dataManager.retinueProxy.getDataByPos(i + 1),
                    index: index,
                    lockLevel: dataManager.allDatas.config.position_unlock[index]
                });
                index++;
            }
        }

        for (let i = 0; i < 6; i++) {
            if (!dataManager.retinueProxy.getDataByPos(i + 1)) {
                allData.push({
                    retinueData: null,
                    index: index,
                    lockLevel: dataManager.allDatas.config.position_unlock[index]
                });
                index++;
            }
        }

        this.retinueList.data = allData;

        this.allRetinueData = [];
        for (let data of allData) {
            if (data.retinueData) {
                this.allRetinueData.push(data.retinueData);
            }
        }




    }

    initBattleUI() {

        this.updateListData();

        for (let data of this.retinueList.data) {
            if (data.retinueData) {
                this.changeSelfData(data);
                break;
            }
        }

        if (!this.retinueList.selectData) {
            this.retinueList.selectData = this.retinueList.data[this.curIndex];
        }

        this.nodeBattleBtn1.active = true;
        this.nodeBattleBtn2.active = true;

        this.updateSpine();
        this.updateInfoUI();
    }

    updateUI() {
        if (this.retinueList.data) {
            this.updateListData();
            this.changeSelfData(this.retinueList.data[this.curIndex]);
        }

        this.updateSpine();
        this.updateInfoUI();
    }

    changeSelfData(data) {

        if (data.retinueData) {
            this.retinueData = data.retinueData;
            this.curIndex = this.allRetinueData.indexOf(this.retinueData);
        } else {
            this.curIndex = this.allRetinueData.indexOf(this.retinueData);
        }
    }

    //头像选择
    updateRetinueData(btn: cc.Button, data: any) {

        if (data && data.retinueData) {
            this.changeSelfData(data);
            this.updateSpine();
            this.updateInfoUI();
        } else {

            let pos = 0;
            if (data.retinueData) {
                pos = data.retinueData.pos;
            } else {
                for (let i = 1; i <= 6; i++) {
                    if (!dataManager.retinueProxy.getDataByPos(i)) {
                        pos = i;
                        break;
                    }
                }
            }

            uiManager.open(UIID.UIRetinueList, { retinue: null, pos: pos });

            this.curIndex = this.retinueList.data.indexOf(data);
        }

    }

    updateRedDot() {
        if (!this.retinueData) {
            //没有随从
            RedDot.change('retinueUp', false);
            RedDot.change('retinueAwake', false);
            RedDot.change('retinueStar', false);
            RedDot.change('retinueBreak', false);
        } else {
            RedDot.change('retinueUp', dataManager.retinueProxy.ableToLevelUp(this.retinueData));
            RedDot.change('retinueBreak', dataManager.retinueProxy.ableToBreak(this.retinueData));
            RedDot.change('retinueStar', dataManager.retinueProxy.ableToStarAdd(this.retinueData));
        }
    }

    updateInfoUI() {

        this.updateRedDot();

        let data = this.retinueData;
        if (data) {
            this.lblName.string = dataManager.GetTextById(data.name_id);

            this.lblStep.string = (data.step > 0 ? '+' + data.step : '');

            this.stars.star = dataManager.retinueProxy.getShowStarNum(data.star);

            this.lblPower.string = data.power + '';

            this.spJob.url = SysDef.getRetinueTypeUrl(data.here_type);
        }

    }

    updateSpine() {

        if (this.retinueData) {
            let spineUrl = SysDef.getRetinuePaintingUrl(this.retinueData.hero_pic);

            this.nodeSpine.animation = "idle";
            this.nodeSpine.url = spineUrl;
        } else {
            this.nodeSpine.url = null;
        }

        this.playRetinueAnimation();

    }
    playRetinueAnimation() {
        this.nodeSpine.node.stopAllActions();
        this.nodeSpine.node.y = -4;
        var move1 = cc.moveTo(1, cc.v2(0, 4));
        var move2 = cc.moveTo(1, cc.v2(0, -4));
        var seq = cc.sequence(move1, move2);
        this.nodeSpine.node.runAction(cc.repeatForever(seq));
    }





    onClickCloseBtn() {
        this.closeSelf();
    }

    onClickBackToBag() {

        uiManager.open(UIID.UIBagView, { index: ItemType.Retinue });
    }

    onClickUpgrade() {

        let index = this.allRetinueData.indexOf(this.retinueData);
        if (index >= 0) {
            uiManager.open(UIID.UIRetinueUpgrade, { retinue: this.retinueData, allDatas: this.allRetinueData, UIid: UIID.UIRetinueUpgrade });
        }
    }

    onClickSuperSkill() {

        utils.showTips(dataManager.GetTextById(397));

        /*
        let index = this.allRetinueData.indexOf(this.retinueData);
        if (index >= 0) {
            uiManager.open(UIID.UIRetinueSuperSkill, { retinue: this.retinueData, allDatas: this.allRetinueData });
        }
        */
    }

    onClickStar() {
        let index = this.allRetinueData.indexOf(this.retinueData);
        if (index >= 0) {
            uiManager.open(UIID.UIRetinueStar, { retinue: this.retinueData, allDatas: this.allRetinueData, UIid: UIID.UIRetinueStar });
        }

    }

    onClickBreak() {
        let index = this.allRetinueData.indexOf(this.retinueData);
        if (index >= 0) {
            uiManager.open(UIID.UIRetinueBreak, { retinue: this.retinueData, allDatas: this.allRetinueData, UIid: UIID.UIRetinueBreak });
        }
    }

    onClickList() {
        if (this.retinueData && this.retinueData.pos > 0) {
            uiManager.open(UIID.UIRetinueList, { retinue: this.retinueData, pos: this.retinueData.pos });
        }
    }

    onClickInfo() {
        if (this.retinueData) {
            uiManager.open(UIID.UIRetinueInfo, { retinue: this.retinueData });
        }
    }

    onClickBag() {
        uiManager.open(UIID.UIBagView);
    }

    onClickBattlePos() {
        uiManager.open(UIID.UIBattlePos);
    }

    onClickOneKeyUp() {
        utils.showTips(dataManager.GetTextById(397));
    }

    onClickGoods() {
        utils.showTips(dataManager.GetTextById(397));
    }
}
