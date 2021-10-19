// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


//ID	类型	各种属性	技能目标	属性值（百分比）	特效
//id	type	properties	target	propertiesvaluepercent	effectId


import { dataManager } from "./DataManager";

const { ccclass, property } = cc._decorator;


/**
1:增益2:减益3:眩晕4:回复气血
*/

export enum SkillBuffType {
    Buff = 1,
    Debuff,
    Stun,
    Heal
}
/**
1:攻击2:防御3:气血4:敏捷5:会心6:韧性7:命中8:闪避9:眩晕10:回复自身攻击气血

 */
export enum SkillBuffProperty {
    Attack = 1,
    Defence,
    HP,
    DEX,
    Crit,
    Toughness,
    Hit,
    Evasion,
    Dizziness,
    Restore
}


/** 
1.前排单体
2.前排群体
3.后排单体
4.后排群体
5.群体
6.群体随机一人
*/

export enum SkillTarget {
    Self = 1,
    AllOfUs,
    OwnFrontRow,
    Enemy,
    AllEnemy
}
/**
 * 1 近战
 * 2远程
 */
export enum SkillRange {
    Melee = 1,
    Ranged,
}
/**
 * 1 普攻
2 主动攻击
3 主动回血
4 被动
 */
export enum SkillType {
    Attack = 1,
    Skill_attack,
    HP,
    Passivity,
}

/*
技能id	技能名称	技能名	技能等级	技能描述	解锁条件(突破层数）	技能类型	是否远程	伤害系数（百分比）	附加伤害值	追加效果类型	效果值（百分比）	几率(百分比）	技能目标	被动条件（气血损失%）	子弹资源	buff效果	动作名称	特效	音频资源	配音资源	技能图标
id	name_cn	name	skill_level	skill_describe_id	unlock_condition	skill_type	long_range	damage_value	extra_damage	effect_type	effect_value	probability	target	condition_percent	bullet_id	buff_id	motion_name	effect_id	sound_effect	dub	skill_icon

 */

@ccclass
export default class SkillProxy {


    private cfgData = null;

    public ctor() {

        this.cfgData = dataManager.allDatas.skill_data;

    }

    public clearData() {

        this.cfgData = null;
    }


    public getData(skillId: number) {
        return this.cfgData[skillId];
    }
}


