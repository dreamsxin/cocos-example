// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { resLoader } from "../../../../base/res/ResLoader";
import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import { EventMgr } from "../../../../base/common/EventManager";
import EventID from "../../../event/EventID";
import PlayerProxy from "../../../data/PlayerProxy";
import { uiUtils } from "../../../../util/UIUtils";
import BattleRetinueProxy from "../../../data/BattleRetinueProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerInfoItem extends cc.Component {

    @property(MultiLabel)
    lb_level: MultiLabel = null;

    @property(MultiLabel)
    lb_fight: MultiLabel = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(MultiLabel)
    lb_title: MultiLabel = null;

    @property(cc.Sprite)
    spr_player: cc.Sprite = null;

    @property(cc.Sprite)
    spr_exp: cc.Sprite = null;
    // LIFE-CYCLE CALLBACKS:

    @property()
    public isBattle = false;

    onLoad() {
        if (this.isBattle) {

            EventMgr.addEventListener(BattleRetinueProxy.eventResult, this.setCurData, this);
        } else {

            this.updatePlayerDataInfo();
            EventMgr.addEventListener(PlayerProxy.infoUpdate, this.updatePlayerDataInfo, this);
        }
    }
    updatePlayerDataInfo() {

        // this.lb_fight.string = dataManager.GetTextById(30)+dataManager.playerProxy.data.battle_val;
        this.lb_fight.string = "99999";
        this.lb_level.string = dataManager.playerProxy.data.level + '';
        this.lb_name.string = dataManager.playerProxy.data.name;
        if (dataManager.getMainRoleLevelData()[dataManager.playerProxy.data.level])
            this.spr_exp.node.scaleX = dataManager.playerProxy.data.exp / dataManager.getMainRoleLevelData()[dataManager.playerProxy.data.level].exp;
    }
    setCurData() {
        let curlevel = dataManager.playerProxy.data.level;
        let curExp = dataManager.playerProxy.getTotalExp(dataManager.playerProxy.data.exp, curlevel);

        let preExp = curExp;
        // for (let data of  dataManager.battleRetinueProxy.result.reward) {
        //     if (data.id === 4) {
        //         //经验
        //         preExp = curExp - data.count;
        //         break;
        //     }
        // }

        // if (preExp < curExp) {

        let preLv = dataManager.playerProxy.getLevelByExp(preExp);


        this.lb_fight.string = "99999";
        this.lb_level.string = preLv + '';
        this.lb_name.string = dataManager.playerProxy.data.name;
        this.spr_exp.node.scaleX = dataManager.playerProxy.data.exp / dataManager.getMainRoleLevelData()[dataManager.playerProxy.data.level].exp;
        // this.spr_exp.node.scaleX =  dataManager.playerProxy.getProgressExp(preExp);
        // } else {
        //     this.updatePlayerDataInfo();
        // }
    }
    onDestroy() {
        if (this.isBattle) {

            EventMgr.removeEventListener(BattleRetinueProxy.eventResult, this.setCurData, this);
        } else {

            EventMgr.removeEventListener(PlayerProxy.infoUpdate, this.updatePlayerDataInfo, this);
        }

    }

}
