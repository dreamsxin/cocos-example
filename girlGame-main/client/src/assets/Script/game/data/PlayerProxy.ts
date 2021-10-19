// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventManager, EventMgr } from "../../base/common/EventManager";
import { netManager, NetManager } from "../../base/network/NetManager";
import { NetNode } from "../../base/network/NetNode";
import { uiManager } from "../../base/ui/UIManager";
import { Account } from "../netMsg/Account";
import { ErrorCode } from "../netMsg/ErrorCode";
import NetMsgID from "../netMsg/NetMsgID";
import { UIID } from "../ui/UIConfig";
import CreateRoleView from "../ui/uiView/CreateRoleView";
import LoginView from "../ui/uiView/LoginView";
import { dataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

/**
 * 1.元宝
2.银两
3.铜币
 */
export enum ResourceType {
    Gold = 1,
    Silver,
    Coin,
    Exp
}

export class ClothData {
    clothId: number = 0;
    isChecked: boolean = false;
}
export class PlotData {
    chapterId: number = 1;
    sectionId: number = 1;
}
@ccclass
export default class PlayerProxy {
    /*
    private name: string = '';
    private head: string = '';
    private player_id: number = 0;
    private diamond: number = 0;
    private gold: number = 0;
    private vitality_val: number = 0;
    private battle_val: number = 0;
    private popularity_val: number = 0;
    private career_lv: number = 0;
    private power_val: number = 0;
    private glamour_val: number = 0;
    private title_id: number = 0;
    private exp: number = 0;
    private level: number = 0;
    private hair_id: number = 0;
    private face_id: number = 0;
    private body_id: number = 0;
    */
    public static infoUpdate: string = "PlayerProxy_infoUpdate";


    _data: any;

    ctor() {

        //NetNode.subscribe('player.login', this.PlayerLoginResponse, this);
        NetNode.subscribe('player.info', this.initData, this);

    }

    clearData() {

    }

    get data() {
        return this._data;
    }


    PlayerLoginRequest() {

        var req = new Account.PlayerLoginRequest();
        req.token = netManager.wstoken;
        netManager.sendCmd(NetMsgID.NetMsgID_Login, req);
    }

    PlayerCreateRoleRequest(name) {
        var req = new Account.PlayerCreatRoleRequest();
        req.token = netManager.wstoken;
        req.name = name;
        netManager.sendCmd(NetMsgID.NetMsgID_CreateRole, req);
    }

    public initData(data) {
        this._data = data;
        EventMgr.raiseEvent(PlayerProxy.infoUpdate);
    }

    getTotalExp(exp, lv) {
        let cfg = dataManager.allDatas.mainrole_level;

        /*
        if (lv > 1) {
            return cfg[lv - 1].exp + exp;
        } else {
            return exp;
        }
        */
        for (let index in cfg) {
            if (parseInt(index) == lv) {
                console.log(exp);
                return exp;
            }
            exp += cfg[index].exp;
        }
    }


    getLevelByExp(exp) {
        let cfg = dataManager.allDatas.mainrole_level;

        for (let index in cfg) {
            exp -= cfg[index].exp;
            if (exp < 0) {
                return parseInt(index);
            }
        }

        return 1;
    }

    getShowExpByTotalExp(exp) {
        let lv = this.getLevelByExp(exp);
        if (lv === 1) {
            return exp;
        }
        return exp - this.getTotalExp(0,lv);
    }

    getProgressExp(exp) {
        let lv = this.getLevelByExp(exp);
        return this.getShowExpByTotalExp(exp) / dataManager.allDatas.mainrole_level[lv].exp;
    }

    /*
        public getPlayerName() {
            return this.name;
        }
        public getPlayerHead() {
            return this.head;
        }
        public getPlayerId() {
            return this.player_id;
        }
        public getPlayerDiamond() {
            return this.diamond;
        }
        public getPlayerGold() {
            return this.gold;
        }
        public getPlayerVitality() {
            return this.vitality_val;
        }
        public getPlayerBattle() {
            return this.battle_val;
        }
        public getPlayerExp() {
            return this.exp;
        }
        public getPlayerLevel() {
            return this.level;
        }
    
        public getPlayerHairId() {
            return this.hair_id;
        }
        public getPlayerFaceId() {
            return this.face_id;
        }
        public getPlayerBodyId() {
            return this.body_id;
        }
    
    
    
    
    
        public setPlayerHead(val) {
            this.head = val;
        }
        public setPlayerDiamond(val) {
            this.diamond = val;
        }
        public setPlayerGold(val) {
            this.gold = val;
        }
        public setPlayerVitality(val) {
            this.vitality_val = val;
        }
        public setPlayerBattle(val) {
            this.battle_val = val;
        }
        public setPlayerExp(val) {
            this.exp = val;
        }
        public setPlayerLevel(val) {
            this.level = val;
        }
    
        public setPlayerHairId(val) {
            this.hair_id = val;
        }
        public setPlayerFaceId(val) {
            this.face_id = val;
        }
        public setPlayerBodyId(val) {
            this.body_id = val;
        }
    */
}
