// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import { EventMgr } from "../../base/common/EventManager";
import { netManager, NetManager } from "../../base/network/NetManager";
import { NetNode } from "../../base/network/NetNode";
import NetMsgID from "../netMsg/NetMsgID";
import { dataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;

export enum BattleStep {
    None = 0,
    JumpIn,
    BeforeStart,
    AddBuff,
    Attack,
    End
}

export enum BattleZIndex {
    Hero = 0,
    AttackHero = 100,
    Bullet,
    Text,
}


@ccclass
export default class BattleRetinueProxy {

    public static eventResult = 'BattleRetinueProxy_eventResult';

    public battleSet = {
        //最大随从数量
        maxRetinues: 6,
        //卡牌移动速度
        moveSpeed: 2500,
        //入场后展示时间
        showTime: 0,
        //子弹速度
        bulletSpeed: 3000
    }

    private battleData = null;
    public result = null;
    posSelf: cc.Vec3[] = [];
    posEnemy: cc.Vec3[] = [];


    public ctor() {

        // NetMsgID_Battle

        NetNode.subscribe('battle.data', this.onBattlePrg, this);
        NetNode.subscribe('battle.result', this.onBattleResult, this);

        this.initPos();
    }

    public clearData() {

        this.posSelf = null;
        this.posEnemy = null;
    }

    sendBattleCmd(questId) {
        var req = {
            questId: questId
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Battle, req);
    }

    onBattlePrg(obj) {

        /*
        id:随从id
        pos:随从位置
        lossHP:当回合丢失血量
        addHP:当回合回复血量
        HP:当前血量
        maxHP:最大血量
        energy：能量
        attackPos:攻击位置，0为不攻击
        skillId:技能id。0为不使用技能
        */
        this.battleData = obj;
    }

    onBattleResult(obj) {
        this.result = obj;

        EventMgr.raiseEvent(BattleRetinueProxy.eventResult);
    }

    initPos() {

        let delta = -200;

        this.posSelf[0] = new cc.Vec3(-150, 120);
        this.posSelf[1] = new cc.Vec3(-150, 120 + delta);
        this.posSelf[2] = new cc.Vec3(-150, 120 + delta * 2);
        this.posSelf[3] = new cc.Vec3(-280, -10);
        this.posSelf[4] = new cc.Vec3(-280, -10 + delta);
        this.posSelf[5] = new cc.Vec3(-280, -10 + delta * 2);

        this.posEnemy[0] = new cc.Vec3(150, 120);
        this.posEnemy[1] = new cc.Vec3(150, 120 + delta);
        this.posEnemy[2] = new cc.Vec3(150, 120 + delta * 2);
        this.posEnemy[3] = new cc.Vec3(280, 10);
        this.posEnemy[4] = new cc.Vec3(280, 10 + delta);
        this.posEnemy[5] = new cc.Vec3(280, 10 + delta * 2);

    }

    getStandPos(pos: number, self: boolean) {
        if (self) {
            return this.posSelf[pos - 1];
        }

        return this.posEnemy[pos - 1];

    }

    public getRetinueData(index: number) {
        if (index >= this.battleData.battleIndex.length) {
            return null;
        }

        return this.battleData.battleIndex[index];
    }

    public bEnd(index: number) {
        if (!this.battleData.playRecord[index]) {
            return true;
        }
        return false;
    }

    public getSelfData(index: number) {
        if (!this.battleData.playRecord[index]) {
            return null;
        }
        return this.battleData.playRecord[index].heroData;
    }

    public getEnemyData(index: number) {
        if (!this.battleData.playRecord[index]) {
            return null;
        }
        return this.battleData.playRecord[index].enemyData;
    }
}

export let battleRetinueProxy: BattleRetinueProxy = new BattleRetinueProxy();
