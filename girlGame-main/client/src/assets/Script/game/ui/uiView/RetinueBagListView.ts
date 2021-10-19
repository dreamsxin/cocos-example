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


const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueBagListView extends UIView {


    @property(UrlLoad)
    nodeSpine: UrlLoad = null;

    @property(MultiLabel)
    lblName: MultiLabel = null;

    @property(MultiLabel)
    lblPower: MultiLabel = null;

    @property(RetinueStars)
    stars: RetinueStars = null;

    @property(UrlLoad)
    typeSprite: UrlLoad = null;


    private data = null;
    curPos = 1;
    heroDatas: any;

    init() {


        EventMgr.addEventListener(RetinueProxy.infoUpdate, this.updateUI, this);



    }

    onDestroy() {

        dataManager.retinueProxy.retinueShowData = null;

        EventMgr.removeEventListener(RetinueProxy.infoUpdate, this.updateUI, this);
    }

    onOpen(fromUI: number, args): void {

        this.heroDatas = args.allDatas;
        this.data = args.data;

        if (args && args.nextUID) {
            uiManager.open(args.nextUID, { retinue: args.retinue, UIid: args.nextUID });
        }

        this.curPos = this.heroDatas.indexof(this.data);

        this.updateUI();
    }

    updateUI() {

        this.changeSelfData(this.heroDatas[this.curPos]);

        this.updateRetinueData(null, this.data);
    }

    changeSelfData(data) {
        this.data = data;
        this.curPos = this.data ? this.data.pos : 1;
        dataManager.retinueProxy.retinueShowData = this.data;
    }

    //头像选择
    updateRetinueData(btn: cc.Button, data: any) {

        if (data) {
            this.changeSelfData(data);
            this.updateSpine();
            this.updateInfoUI();
        }

    }

    updateRedDot() {
        if (!this.data) {
            //没有随从
            RedDot.change('retinueUp', false);
            RedDot.change('retinueAwake', false);
            RedDot.change('retinueStar', false);
            RedDot.change('retinueBreak', false);
        } else {
            //根据当前随从更改，临时
            let pos = this.data.pos;

            if (pos == 1) {
                RedDot.change('retinueUp', false);
                RedDot.change('retinueBreak', true);
                RedDot.change('retinueStar', false);
            } else {
                RedDot.change('retinueUp', true);
                RedDot.change('retinueBreak', false);
                RedDot.change('retinueStar', true);
            }

        }
    }

    updateInfoUI() {

        this.updateRedDot();

        let data = this.data;

        this.lblName.string = dataManager.GetTextById(data.name_id) + '+' + data.step;

        this.stars.star = data.star;

        this.lblPower.string = data.power + '';
    }

    updateSpine() {

        let spineUrl = SysDef.getRetinueDisplaySpineUrl(this.data.model);

        this.nodeSpine.animation = "idle";
        this.nodeSpine.url = spineUrl;

    }





    onClickCloseBtn() {
        this.closeSelf();
    }

    onClickBackToBag() {

        uiManager.open(UIID.UIBagView, { index: ItemType.Retinue, fromUI: UIID.UIRetinue });
    }

    onClickUpgrade() {

        uiManager.open(UIID.UIRetinueUpgrade, { retinue: this.data, index: this.data.pos, UIid: UIID.UIRetinueUpgrade });
    }

    onClickSuperSkill() {

        uiManager.open(UIID.UIRetinueSuperSkill, { retinue: this.data, index: this.data.pos });
    }

    onClickStar() {

        uiManager.open(UIID.UIRetinueStar, { retinue: this.data, index: this.data.pos, UIid: UIID.UIRetinueStar });
    }

    onClickBreak() {
        uiManager.open(UIID.UIRetinueBreak, { retinue: this.data, index: this.data.pos, UIid: UIID.UIRetinueBreak });
    }

    onClickList() {
        uiManager.open(UIID.UIRetinueList, { retinue: this.data, index: this.data.pos });
    }

    onClickInfo() {
        if (this.data) {
            uiManager.open(UIID.UIRetinueInfo, { retinue: this.data });
        }
    }

    onClickBag() {
        uiManager.open(UIID.UIBagView);
    }
}
