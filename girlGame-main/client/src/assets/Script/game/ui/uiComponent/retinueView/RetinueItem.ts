// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import SysDef from "../../../../util/SysDef";
import UrlLoad from "../../uiComponent/common/UrlLoad";
import { uiManager } from "../../../../base/ui/UIManager";
import { UIID } from "../../UIConfig";
import RetinueStars from "./RetinueStars";
import RedDot from "../common/RedDot";
import RenderListItem from "../common/RenderListItem";
import { EventMgr } from "../../../../base/common/EventManager";
import { shaderUtils } from "../../../../util/ShaderUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueItem extends RenderListItem {

    @property({
        type: cc.Node,
        tooltip: "选择框"
    })
    nodeSelect: cc.Node = null;
    @property({
        type: UrlLoad,
        tooltip: "背景"
    })
    urlbg: UrlLoad = null;

    @property({
        type: UrlLoad,
        tooltip: "头像"
    })
    urlIcon: UrlLoad = null;

    @property({
        type: UrlLoad,
        tooltip: "全身"
    })
    urlWhole: UrlLoad = null;

    @property({
        type: UrlLoad,
        tooltip: "卡片"
    })
    urlCard: UrlLoad = null;


    @property({
        type: UrlLoad,
        tooltip: "职业"
    })
    urlJob: UrlLoad = null;

    //等级
    @property(MultiLabel)
    lbLv: MultiLabel = null;
    //名字
    @property(MultiLabel)
    lbName: MultiLabel = null;
    //名字+等级
    @property(MultiLabel)
    lbNameLv: MultiLabel = null;
    //名字+突破等级
    @property(MultiLabel)
    lbNameBreak: MultiLabel = null;

    @property({
        type: UrlLoad,
        tooltip: "卡牌背景框"
    })
    urlCardbg: UrlLoad = null;

    @property({
        type: UrlLoad,
        tooltip: "卡牌背景框"
    })
    urlCardbgSmall: UrlLoad = null;

    @property({
        type: UrlLoad,
        tooltip: "名字背景框"
    })
    urlNamebg: UrlLoad = null;

    //实力值
    @property(MultiLabel)
    lbPower: MultiLabel = null;
    //上阵牌
    @property(cc.Node)
    nodeBattle: cc.Node = null;
    //5星
    @property(RetinueStars)
    layoutStars: RetinueStars = null;

    //上阵
    @property(MultiLabel)
    lbOnBattle: MultiLabel = null;

    //上阵
    @property(cc.Button)
    btnOnBattle: cc.Button = null;

    @property({
        type: MultiLabel,
        tooltip: "碎片数量"
    })
    lbSoulNum: MultiLabel = null;

    @property({
        type: cc.ProgressBar,
        tooltip: "碎片进度条"
    })
    barSoul: cc.ProgressBar = null;

    @property({
        type: cc.Node,
        tooltip: "红点"
    })
    nodeRedDot: cc.Node = null;

    @property({
        type: cc.Node,
        tooltip: "可升星"
    })
    nodeStarTip: cc.Node = null;

    @property({
        type: UrlLoad,
        tooltip: "战斗spine"
    })
    spineBattle: UrlLoad = null;


    @property({
        tooltip: "是否置灰"
    })
    bGray: Boolean = false;

    onLoad() {

    }


    showData() {

        if (!this._data) {
            this.node.opacity = 0;
            return;
        }


        this.node.opacity = 255;

        let data = this._data;

        if (this.urlIcon) {
            if (data.isNpc) {

                this.urlIcon.url = SysDef.getNpcIconUrl(data.icon);
            } else {

                this.urlIcon.url = SysDef.getRetinueIconUrl(data.icon);
            }
        }
        if (this.urlCard) {
            this.urlCard.url = SysDef.getRetinueCardUrl(data.card_image);
        }
        if (this.urlCardbg) {
            this.urlCardbg.url = SysDef.getRetinueCardBgUrl(data.starLevel);
            if (this.urlCardbgSmall) {
                this.urlCardbgSmall.url = SysDef.getRetinueCardBgUrl(data.starLevel) + '1';
            } else {
                console.error('no small cardbg');
            }
        }


        if (this.urlNamebg) {
            this.urlNamebg.url = SysDef.getRetinueNameBgUrl(data.starLevel);
        }

        if (this.urlWhole) {
            this.urlWhole.url = SysDef.getRetinuePaintingUrl(data.hero_pic);
        }

        if (this.urlbg) {
            if (data.isBattleBg) {
                this.urlbg.url = data.isNpc ? SysDef.getBattleEnemyBgUrl() : SysDef.getBattleSelfBgUrl();
            } else {

                this.urlbg.url = SysDef.getRetinueBgUrl(data.starLevel);
            }
        }
        if (this.urlJob) this.urlJob.url = SysDef.getRetinueTypeUrl(data.here_type);

        if (this.lbLv) this.lbLv.string = data.level;
        if (this.lbPower) this.lbPower.string = dataManager.GetTextById(30) + data.power;
        if (this.nodeBattle) this.nodeBattle.opacity = data.pos > 0 ? 255 : 0;

        if (this.lbName) {
            this.lbName.string = dataManager.GetTextById(data.name_id);
            this.lbName.node.color = this.getColor();
        }
        if (this.lbNameLv) {
            if (data) {
                this.lbNameLv.string = dataManager.GetTextById(data.name_id) + '  ' + dataManager.GetTextById(132) + data.level;
            } else {
                this.lbNameLv.string = dataManager.GetTextById(data.name_id);
            }
            this.lbNameLv.node.color = this.getColor();
        }

        if (this.lbNameBreak) {
            if (data.step > 0) {
                this.lbNameBreak.string = dataManager.GetTextById(data.name_id) + '+' + data.step;
            } else {
                this.lbNameBreak.string = dataManager.GetTextById(data.name_id);
            }
            this.lbNameBreak.node.color = this.getColor();
        }

        if (this.layoutStars) {
            if (data) {
                this.layoutStars.star = dataManager.retinueProxy.getShowStarNum(data.star);
            }
            else {
                this.layoutStars.star = 0;
            }
        }

        if (this.lbOnBattle) {
            if (data.pos > 0) {

                if (data.replacePos && !dataManager.retinueProxy.getDataByPos(data.replacePos)) {
                    //上阵
                    this.lbOnBattle.string = dataManager.GetTextById(271);
                    if (this.btnOnBattle) this.btnOnBattle.interactable = false;
                } else {
                    this.lbOnBattle.string = dataManager.GetTextById(243);
                    if (this.btnOnBattle) this.btnOnBattle.interactable = true;
                }
            } else {
                this.lbOnBattle.string = dataManager.GetTextById(242);
            }
        }

        if (this.lbSoulNum && this.barSoul) {
            let dataCur = dataManager.retinueProxy.getStarStatus(data.id, data.star);
            let itemData = dataManager.bagProxy.getItem(data.hero_debris_id);
            this.lbSoulNum.string = itemData.count + '/' + dataCur.debris_num;
            this.barSoul.progress = itemData.count / dataCur.debris_num;

        }

        if (this.nodeRedDot) {
            this.nodeRedDot.active = dataManager.retinueProxy.ableToLevelUp(data)
                || dataManager.retinueProxy.ableToStarAdd(data)
                || dataManager.retinueProxy.ableToBreak(data);
        }

        if (this.nodeStarTip) {
            this.nodeStarTip.active = dataManager.retinueProxy.ableToStarAdd(data);
        }

        if (this.spineBattle) {
            this.spineBattle.url = SysDef.getRetinueBattleSpineUrl(data.model);
        }
        if (this.bGray) {
            shaderUtils.setNodeGray(this.node);
        }

    }

    getColor(): cc.Color {
        if (this.bGray) {
            return cc.Color.WHITE;
        }
        switch (this.data.starLevel) {
            case 1:
                return cc.color(124, 220, 255);
            case 2:
                return cc.color(200, 185, 255);
            case 3:
                return cc.color(240, 173, 94);
            case 4:
                return cc.color(240, 214, 114);
        }

        return cc.Color.WHITE;
    }

    onClickInfo() {

        uiManager.open(UIID.UIRetinueInfo, { retinue: this._data });
    }

    onClickOnBattle() {

        dataManager.retinueProxy.sendOnBattle(this._data.id, this._data.replacePos);
    }




    public set select(chosed: Boolean) {
        if (this.nodeSelect) this.nodeSelect.opacity = chosed ? 255 : 0;
    }

    onDestroy() {

    }
}
