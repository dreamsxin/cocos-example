// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventMgr } from "../../../base/common/EventManager";
import { NodePool } from "../../../base/res/NodePool";
import { uiManager } from "../../../base/ui/UIManager";
import { UIView } from "../../../base/ui/UIView";
import { executeAsync, ExecuteAsync } from "../../../util/ExecuteAsync";
import MultiLabel from "../../../util/MultiLabel";
import UIUtils, { uiUtils } from "../../../util/UIUtils";
import { utils } from "../../../util/Utils";
import BattleRetinueProxy, { battleRetinueProxy, BattleStep, BattleZIndex } from "../../data/BattleRetinueProxy";
import { dataManager } from "../../data/DataManager";
import PlayerProxy from "../../data/PlayerProxy";
import { SkillBuffType, SkillRange, SkillType } from "../../data/SkillProxy";
import BattleRetinueItem from "../uiComponent/battleView/BattleRetinueItem";
import ScrollList from "../uiComponent/battleView/ScrollList";
import RetinueItem from "../uiComponent/retinueView/RetinueItem";
import { UIID } from "../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleView extends UIView {


    @property(cc.Sprite)
    spr_bg: cc.Sprite = null;

    @property(BattleRetinueItem)
    battleRetinueItem: BattleRetinueItem = null;

    @property(cc.Prefab)
    floatNode: cc.Prefab = null;

    @property(cc.Prefab)
    bulletPrefab: cc.Prefab = null;

    @property(cc.Node)
    retinueNode: cc.Node = null;

    @property(cc.Node)
    startNode: cc.Node = null;

    @property(cc.Label)
    lblAcc: cc.Label = null;

    @property(MultiLabel)
    lblSkill: MultiLabel = null;

    @property(MultiLabel)
    lblBullet: MultiLabel = null;

    @property(ScrollList)
    headScroll: ScrollList = null;

    private nodePool: NodePool = null;
    private bulletPool: NodePool = null;
    private labelPool: NodePool = null;

    private selfItems: BattleRetinueItem[] = [];
    private enemyItems: BattleRetinueItem[] = [];

    private battleStep: BattleStep = BattleStep.None;
    private attackRound = 0;

    private proxy = dataManager.battleRetinueProxy;

    //正在使用的技能
    private curSkill: any;
    //子弹属性 
    private bulletStartPos: cc.Vec3;
    private bulletEndPos: cc.Vec3;
    private bulletNode: cc.Node = null;

    battleSet: { maxRetinues: number; moveSpeed: number; showTime: number; bulletSpeed: number; };
    sectionData: any;
    private  isJumpToEnd = false;

    onOpen(fId: number, data) {

        this.sectionData = data;

        EventMgr.addEventListener(BattleRetinueProxy.eventResult, this.initBattleItems, this);
        dataManager.battleRetinueProxy.sendBattleCmd(data.id);

        this.battleSet = dataManager.battleRetinueProxy.battleSet;

        this.selfItems = new Array(this.battleSet.maxRetinues);
        this.enemyItems = new Array(this.battleSet.maxRetinues);

        this.nodePool = new NodePool();
        this.nodePool.init(this.battleRetinueItem.node);

        this.labelPool = new NodePool();
        this.labelPool.init(this.floatNode);

        this.bulletPool = new NodePool();
        this.bulletPool.init(this.bulletPrefab);


        this.initUI();
    }

    onDestroy() {
        EventMgr.removeEventListener(BattleRetinueProxy.eventResult, this.initBattleItems, this);
        cc.director.getScheduler().setTimeScale(1);
        this.nodePool.destory();
        this.bulletPool.destory();
        this.labelPool.destory();
    }


    initUI() {
        this.lblAcc.string = 'x1';
    }

    initBattleItems() {
        this.initRetinueItems();

    }



    initSelfItem(data) {

        let posSelf = this.proxy.posSelf;
        let i = data.pos - 1;
        if (data && data.pos > 0) {
            let node = this.nodePool.getNode();
            let com = node.getComponent('BattleRetinueItem');
            if (!com) {
                this.selfItems[i] = null;
                return;
            }
            com.data = data;
            com.setAttackEndCallBack(this.checkAnimation, this);
            node.parent = this.retinueNode;
            node.active = true;
            node.position = posSelf[i];
            node.x -= 400;
            //node.runAction(cc.jumpTo(jumpTime, posSelf[i], 100, 1));
            this.selfItems[i] = com;
        } else {
            this.selfItems[i] = null;
        }
    }

    initEnemyItem(data) {

        let posSelf = this.proxy.posEnemy;
        let i = data.pos - 1;
        if (data && data.pos > 0) {
            let node = this.nodePool.getNode();
            let com = node.getComponent('BattleRetinueItem');
            if (!com) {
                this.enemyItems[i] = null;
                return;
            }
            data['enemy'] = true;
            com.data = data;
            com.setAttackEndCallBack(this.checkAnimation, this);
            node.parent = this.retinueNode;
            node.active = true;
            node.position = posSelf[i];
            com.playAni('idle', true);
            //node.runAction(cc.jumpTo(jumpTime, posSelf[i], 100, 1));
            this.enemyItems[i] = com;
        } else {
            this.enemyItems[i] = null;
        }
    }



    initEnemyRetinueItems() {
        let selfData = this.proxy.getEnemyData(0);
        executeAsync.setCallBack(this, this.initEnemyItem.bind(this), this.playJumpIn);
        executeAsync.createAllItems(selfData);
    }

    initRetinueItems() {

        let selfData = this.proxy.getSelfData(0);

        executeAsync.setCallBack(this, this.initSelfItem.bind(this), this.initEnemyRetinueItems);
        executeAsync.createAllItems(selfData);
    }

    updateHead() {
        let datas = [];
        for (let index = 0; index < this.headScroll.node.children.length; index++) {
            let begin = this.attackRound >= 1 ? this.attackRound - 1 : 0;
            datas.push(this.proxy.getRetinueData(begin + index));
        }
        if (this.attackRound == 0) {
            this.headScroll.init(datas);
        } else {
            this.headScroll.changeData(0.3, datas);
        }

    }


    playJumpIn() {

        cc.director.getScheduler().setTimeScale(0.7);
        let jumpTime = 0.3;
        this.battleStep = BattleStep.JumpIn;
        this.schedule(this.updateBattle, jumpTime + this.battleSet.showTime);

        let posSelf = this.proxy.posSelf;
        for (let index = 0; index < this.battleSet.maxRetinues; index++) {
            if (!this.selfItems[index]) {
                continue;
            }
            this.selfItems[index].node.runAction(cc.jumpTo(jumpTime, cc.v2(posSelf[index].x, posSelf[index].y), 100, 1));
            this.selfItems[index].playAni('into', false);
        }

        this.updateHead();
    }


    updateBattle(dt: number) {
        switch (this.battleStep) {
            case BattleStep.JumpIn:
                this.unschedule(this.updateBattle);
                this.schedule(this.updateBattle, this.battleSet.showTime);
                this.battleStep = BattleStep.BeforeStart;
                break;
            case BattleStep.BeforeStart:
                this.battleStep = BattleStep.AddBuff;
                this.unschedule(this.updateBattle);
                this.showStartNode();
                break;
            case BattleStep.AddBuff:
                this.battleStep = BattleStep.Attack;
                this.attackRound = 1;
                this.unschedule(this.updateBattle);
                this.startBattle();
                break;
        }
    }

    /**
         * {
                id: 0, // 随从id
                pos: 0, // 随从位置
                lossHP: 0, // 当回合丢失血量
                addHP: 0, // 当回合回复血量
                HP: 0, // 当前血量
                maxHP: 0, // 最大血量
                energy: 0, // 士气值（用于释放技能）
                attackPos: 0, // 攻击位置（0 不攻击）
                skillId: 0, // 技能id（0 不使用技能）
                isEvade: false, // 是否闪避
                isCritical : false, // 是否暴击
            }
         */
    showStartNode() {
        this.startNode.stopAllActions();
        var zoom1 = cc.scaleTo(0.3, 1.1, 1.1);
        var zoom2 = cc.scaleTo(0.2, 0.95, 0.95);
        var zoom3 = cc.scaleTo(0.1, 1, 1);
        var zoom4 = cc.scaleTo(0.4, 1, 1);
        var zoom5 = cc.scaleTo(0.2, 0, 0);
        var callBack = cc.callFunc(this.updateBattle, this);
        var seq = cc.sequence(zoom1, zoom2, zoom3, zoom4, zoom5, callBack);
        this.startNode.runAction(seq);


    }

    startBattle() {
        if (this.battleStep != BattleStep.Attack) {
            throw new Error("Method not implemented.");
        }

        let selfData = this.proxy.getSelfData(this.attackRound);
        let enemyData = this.proxy.getEnemyData(this.attackRound);
        //播放buff
        let playBuff = (battleRetinueItem: BattleRetinueItem) => {
            let data = battleRetinueItem.data;
            battleRetinueItem.showBuff(data.buff);
        }

        for (let index = 0; index < this.battleSet.maxRetinues; index++) {
            if (!this.selfItems[index]) {
                continue;
            }
            if (!this.startAttack(selfData, this.selfItems, index, true)) {
                let node = this.selfItems[index].node;
                node.zIndex = BattleZIndex.Hero;
            }

            playBuff(this.selfItems[index]);
        }

        for (let index = 0; index < this.battleSet.maxRetinues; index++) {
            if (!this.enemyItems[index]) {
                continue;
            }

            if (!this.startAttack(enemyData, this.enemyItems, index, false)) {
                let node = this.enemyItems[index].node;
                node.zIndex = BattleZIndex.Hero;
            }

            // this.lblSkill.string = this.curSkill.name ? dataManager.GetTextById(this.curSkill.name) : this.curSkill.id;

            playBuff(this.enemyItems[index]);
        }

    }

    //播放战斗预备
    startAttack(data, items, index, self) {
        if (!data || !data[index]) {
            return false;
        }

        let skill = dataManager.skillProxy.getData(data[index].skillId);




        let node = items[index].node;
        if (data[index].attackPos > 0 && data[index].skillId === 0) {
            this.curSkill = skill;
            if (!this.curSkill) {
                console.error('no skill');
            }
            //近战
            let moveAction = this.getMoveAction(data, index, self);
            items[index].playAni('into', false);
            node.stopAllActions();
            node.runAction(cc.sequence(moveAction, cc.callFunc(this.playAttack, this, node)));
            node.zIndex = BattleZIndex.AttackHero;
            return true;
        }
        else if (data[index].skillId !== 0) {


            if (data[index].attackPos > 0 && skill.long_range == SkillRange.Melee) {
                //近战要跑过去放技能
                let moveAction = this.getMoveAction(data, index, self);
                items[index].playAni('into', false);
                node.stopAllActions();
                node.runAction(cc.sequence(moveAction, cc.callFunc(this.playAttack, this, node)));
                node.zIndex = BattleZIndex.AttackHero;

                this.curSkill = skill;
                if (!this.curSkill) {
                    console.error('no skill');
                }
                return true;
            } else if (data[index].attackPos > 0 && skill.long_range == SkillRange.Ranged) {
                if (skill.bullet_id !== 0) {
                    this.bulletStartPos = node.position;
                    this.bulletEndPos = this.proxy.getStandPos(data[index].attackPos, !self);
                }
                this.curSkill = skill;
                if (!this.curSkill) {
                    console.error('no skill');
                }

                this.playAttack(node);
                return true;
            }
        }

        return false;
    }

    createBullet() {
        let node = this.bulletPool.getNode();
        node.parent = this.retinueNode;
        node.zIndex = BattleZIndex.Bullet;
        node.angle = - utils.getRotationTwoPoint(this.bulletStartPos, this.bulletEndPos);
        node.position = this.bulletStartPos;

        let com = node.getComponent('BattleBullet');
        com.data = { bulletID: this.curSkill.bullet_id };

        let speed = this.battleSet.bulletSpeed;
        let time = uiUtils.getDistance(this.bulletStartPos, this.bulletEndPos) / speed;
        node.runAction(cc.sequence(cc.moveTo(time, this.bulletEndPos.x, this.bulletEndPos.y), cc.callFunc(this.playDamage, this)));

        this.bulletNode = node;

        // this.lblBullet.string = dataManager.getEffectSpineUrl(this.curSkill.bullet_id);
    }

    //播放战斗动作
    playAttack(node: cc.Node) {
        if (node) {
            let com = node.getComponent('BattleRetinueItem');

            let skill = dataManager.skillProxy.getData(com.data.skillId);
            console.log(skill.skill_type);
            if (skill.skill_type != SkillType.Attack) {
                if(this.curSkill.name){

                    com.showSkillName(  dataManager.GetTextById(this.curSkill.name) );
                }
                com.playAni('skill', false);
            } else {
                com.playAni('attack', false);
            }
            if (this.curSkill && this.curSkill.shake == 1 ) {
                uiUtils.showShake(this.spr_bg, 4, 12);
            }
            com.playEffect(skill.effect_id, skill.bottom_light, false);
            // this.lblBullet.string = '';
            if (!skill.bullet_id) {
                //近战，无子弹，直接播放受击动画
                this.playDamage();
            } else {

                this.createBullet();
            }
        }
    }

    //播放攻击动作后
    checkAnimation() {

        // this.lblBullet.string = '';
        if (!this.curSkill || !this.curSkill.bullet_id) {
            //近战，无子弹，直接播放受击动画
            //这里显示伤害数字和动画
            let selfData = this.proxy.getSelfData(this.attackRound);
            let enemyData = this.proxy.getEnemyData(this.attackRound);

            let moveAction = null;
            for (let index = 0; index < this.battleSet.maxRetinues; index++) {

                //原路返回
                if (selfData[index].attackPos > 0 && this.selfItems[index]) {
                    moveAction = this.getMoveAction(selfData, index, true, true);

                    this.selfItems[index].playAni('into', false);
                    if (moveAction) {
                        this.selfItems[index].node.stopAllActions();
                        this.selfItems[index].node.runAction(moveAction);
                    }

                }

                if (enemyData[index].attackPos > 0 && this.enemyItems[index]) {
                    moveAction = this.getMoveAction(enemyData, index, false, true);
                    this.enemyItems[index].playAni('into', false);
                    if (moveAction) {
                        this.enemyItems[index].node.stopAllActions();
                        this.enemyItems[index].node.runAction(moveAction);
                    }
                }
            }
            if (moveAction) {
                this.scheduleOnce(this.checkOver, moveAction.getDuration());
            } else {
                this.scheduleOnce(this.checkOver, 0.3);
            }
        } else {
            //有子弹，播放子弹动画
            // this.createBullet();
            this.scheduleOnce(this.checkOver, 0.3);
        }
    }

    //播放受击动作
    playDamage() {

        //隐藏bullet
        if (this.curSkill && this.curSkill.bullet_id) {
            this.bulletPool.freeNode(this.bulletNode);
            this.bulletNode = null;
        }
        let self = this;

        let showDamageText = (type,num, pos: cc.Vec3) => {
            let node = this.labelPool.getNode();
            node.parent = this.retinueNode;
            node.position = cc.v3(pos.x+10,pos.y+50,pos.z);
            node.getComponent('LabelNode').showData(type,num);
            node.zIndex = BattleZIndex.Text;
        }

        //播放失血文字动画
        let playHPText = (battleRetinueItem: BattleRetinueItem) => {
            if (!battleRetinueItem) {
                return;
            }
            let data = battleRetinueItem.data;
            if (data.lossHP > 0 && !data.isCritical) {
                // uiUtils.showShake(battleRetinueItem);
                showDamageText(0,data.lossHP, battleRetinueItem.node.position );
                battleRetinueItem.playAni('hit', false);
                battleRetinueItem.playEffect(self.curSkill.hit_effect_id, -1, false);
                if (this.curSkill && this.curSkill.beat_back == 1) {
                    this.showHitBackAction();
                }
            }
        }
        //播放加血文字动画
        let playAddHPText = (battleRetinueItem: BattleRetinueItem) => {
            if (!battleRetinueItem) {
                return;
            }
            let data = battleRetinueItem.data;
            if (data.addHP > 0) {
                showDamageText(1,data.addHP, battleRetinueItem.node.position );

            }
        }

        //播放miss文字动画
        let playMissAni = (battleRetinueItem: BattleRetinueItem) => {
            if (!battleRetinueItem) {
                return;
            }
            let data = battleRetinueItem.data;
            if (data.isEvade) {
                // uiUtils.showShake(battleRetinueItem);
                showDamageText(3,'', battleRetinueItem.node.position);
                // battleRetinueItem.playAni('hit', false);

                this.showMissBackAction();
            }
        }

        //播放暴击文字动画
        let playCriticalAni = (battleRetinueItem: BattleRetinueItem) => {
            if (!battleRetinueItem) {
                return;
            }
            let data = battleRetinueItem.data;
            if (data.isCritical && data.lossHP > 0) {
                // uiUtils.showShake(battleRetinueItem);
                showDamageText(2, data.lossHP, battleRetinueItem.node.position);
                battleRetinueItem.playAni('hit', false);
                battleRetinueItem.playEffect(self.curSkill.hit_effect_id, -1, false);
            }
        }

        //播放buff
        let playBuff = (battleRetinueItem: BattleRetinueItem) => {
            if (!battleRetinueItem) {
                return;
            }
            let data = battleRetinueItem.data;
            battleRetinueItem.showBuff(data.buff);
        }

        //播放死亡
        let playDead = (battleRetinueItem: BattleRetinueItem) => {
            if (!battleRetinueItem) {
                return;
            }
            let data = battleRetinueItem.data;
            if (data.lossHP > 0 && battleRetinueItem.node.opacity === 255) {
                if (data.HP <= 0) {
                    battleRetinueItem.node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.5)));
                }
            }
        }

        //这里显示伤害数字和动画
        let selfData = this.proxy.getSelfData(this.attackRound);
        let enemyData = this.proxy.getEnemyData(this.attackRound);

        let moveAction = null;
        for (let index = 0; index < this.battleSet.maxRetinues; index++) {
            selfData[index]['enemy'] = false;
            enemyData[index]['enemy'] = true;
            //刷新数据
            if (this.selfItems[index]) {
                this.selfItems[index].data = selfData[index];
            }
            if (this.enemyItems[index]) {
                this.enemyItems[index].data = enemyData[index];
            }


            //播放失血文字动画
            playHPText(this.selfItems[index]);
            playHPText(this.enemyItems[index]);
            //播放加血文字动画
            playAddHPText(this.selfItems[index]);
            playAddHPText(this.enemyItems[index]);
            //播放miss
            playMissAni(this.selfItems[index]);
            playMissAni(this.enemyItems[index]);
            //播放暴击
            playCriticalAni(this.selfItems[index]);
            playCriticalAni(this.enemyItems[index]);
            //播放buff
            playBuff(this.selfItems[index]);
            playBuff(this.enemyItems[index]);
            //播放死亡
            playDead(this.selfItems[index]);
            playDead(this.enemyItems[index]);
            // if (!this.curSkill || !this.curSkill.bullet_id) {
            // } else {
            //     //原路返回
            //     if (selfData[index].attackPos > 0 && this.selfItems[index]) {
            //         moveAction = this.getMoveAction(selfData, index, true, true);
            //
            //         if (moveAction) {
            //             this.selfItems[index].node.stopAllActions();
            //             this.selfItems[index].node.runAction(moveAction);
            //         }
            //
            //     }
            //
            //     if (enemyData[index].attackPos > 0 && this.enemyItems[index]) {
            //         moveAction = this.getMoveAction(enemyData, index, false, true);
            //         if (moveAction) {
            //             this.enemyItems[index].node.stopAllActions();
            //             this.enemyItems[index].node.runAction(moveAction);
            //         }
            //     }
            // }
        }

        // if (!this.curSkill || !this.curSkill.bullet_id) {
        // } else {
        //     if (moveAction) {
        //         this.scheduleOnce(this.checkOver, moveAction.getDuration() + this.battleSet.showTime);
        //     } else {
        //         this.scheduleOnce(this.checkOver, this.battleSet.showTime);
        //     }
        // }

    }
    getHitBackAction(target, isSelf,isMiss=false) {
        let endPos = target.position;

        let realyX = 0;
        if (isSelf) {
            realyX = endPos.x - (isMiss?75:50);
        } else {
            realyX = endPos.x + (isMiss?75:50);
        }
        var time = isMiss?0.25:0.1;
        return cc.sequence(cc.moveTo(time, cc.v2(realyX, endPos.y)), cc.moveTo(time, cc.v2(endPos.x, endPos.y)));


    }
    showHitBackAction() {


        let moveAction = null;
        for (let index = 0; index < this.battleSet.maxRetinues; index++) {


            if (this.selfItems[index]&& this.selfItems[index].data.lossHP > 0 ) {
                moveAction = this.getHitBackAction(this.selfItems[index].node, true);

                if (moveAction) {
                    // this.selfItems[index].node.stopAllActions();
                    this.selfItems[index].node.runAction(moveAction);
                }

            }
            if (this.enemyItems[index] && this.enemyItems[index].data.lossHP > 0  ) {
                moveAction = this.getHitBackAction(this.enemyItems[index].node, false);

                if (moveAction) {
                    // this.enemyItems[index].node.stopAllActions();
                    this.enemyItems[index].node.runAction(moveAction);
                }

            }


        }
    }
    showMissBackAction() {


        let moveAction = null;
        for (let index = 0; index < this.battleSet.maxRetinues; index++) {


            if (  this.selfItems[index]&&this.selfItems[index].data.isEvade) {
                moveAction = this.getHitBackAction(this.selfItems[index].node, true,true);

                if (moveAction) {
                    // this.selfItems[index].node.stopAllActions();
                    this.selfItems[index].node.runAction(moveAction);
                }

            }
            if (this.enemyItems[index] && this.enemyItems[index].data.isEvade) {
                moveAction = this.getHitBackAction(this.enemyItems[index].node, false,true);

                if (moveAction) {
                    // this.enemyItems[index].node.stopAllActions();
                    this.enemyItems[index].node.runAction(moveAction);
                }

            }


        }
    }

    checkOver() {

        if(this.isJumpToEnd){
            if(dataManager.battleRetinueProxy.result.win){
                for(var item in this.enemyItems){
                    if(this.enemyItems[item])
                        this.enemyItems[item].node.destroy();
                }
            }else {
                for(var item in this.selfItems){
                    if(this.selfItems[item])
                        this.selfItems[item].node.destroy();
                }
            }
            return;
        }
        if (this.proxy.bEnd(this.attackRound + 1)) {
            this.onClickJumpBtn();
        } else {
            this.attackRound++;
            this.updateHead();
            this.startBattle();
        }
    }

    getMoveAction(arr: any, index: number, self: boolean = true, reverse: boolean = false) {
        let moveSpeed = this.battleSet.moveSpeed;
        let attackPos = arr[index].attackPos;
        let endPos = this.proxy.getStandPos(attackPos, !self);
        let startPos = this.proxy.getStandPos(arr[index].pos, self);

        let realyX = 0;
        if (self) {
            realyX = endPos.x - 100;
        } else {
            realyX = endPos.x + 100;
        }

        let time = uiUtils.getDistance(startPos, cc.v2(realyX, endPos.y)) / moveSpeed;
        if (time > 0) {
            // time = time > 0.4 ? 0.4 : time;
            // time = time > 0.2 ? time : 0.2;
            if (reverse) {
                return cc.jumpTo(time, cc.v2(startPos.x, startPos.y), 80, 1);
            }
            return cc.jumpTo(time, cc.v2(realyX, endPos.y), 80, 1);
        }

        return null;
    }

    playBattleProgress() {

    }





    onClickJumpBtn() {
        cc.director.getScheduler().setTimeScale(1);
        if(this.isJumpToEnd){
            return;
        }
        this.isJumpToEnd = true;
        var delay = cc.delayTime(0.5);
        var call = cc.callFunc(()=>{

            uiManager.open(UIID.UIBattleResult, this.sectionData);
        });
        this.node.runAction(cc.sequence(delay,call));
    }

    onClickAccBtn() {
        if (this.lblAcc.string == 'x1') {
            this.lblAcc.string = 'x2';
            cc.director.getScheduler().setTimeScale(2);
        }
        else if (this.lblAcc.string == 'x2') {
            this.lblAcc.string = 'x3';
            cc.director.getScheduler().setTimeScale(3);
        } else {
            this.lblAcc.string = 'x1';
            cc.director.getScheduler().setTimeScale(0.7);
        }
    }

    onClickCloseBtn() {
        cc.director.getScheduler().setTimeScale(1);
        this.closeSelf();
    }

}
