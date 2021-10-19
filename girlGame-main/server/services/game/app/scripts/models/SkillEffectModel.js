/**
 * 技能效果表
 */
const { logger } = require('./../../app');
const {
    SKILL_EFFECT
} = require('./../../../datas/skill_effect');

class SkillEffectModel
{
    // 技能BUFF类型
    static SKILL_BUFF_TYPES()
    {
        return {
            GAIN: 1, // 增益
            REDUCES: 2, // 减益
            VERTIGO: 3, // 眩晕
            GAIN_HP: 4, // 回复气血
        }
    }

    // 技能BUFF属性
    static SKILL_BUFF_ATTRS()
    {
        return {
            ATTR_ATK: 1,
            ATTR_DEF: 2,
            ATTR_HP: 3,
            ATTR_DEX: 4,
            ATTR_CRITICAL: 5,
            ATTR_STA: 6,
            ATTR_ACC: 7,
            ATTR_EVA: 8,
            ATTR_VERTIGO: 9,
            ATTR_GAIN_HP: 10
        }
    }

    // 技能BUFF目标
    static SKILL_BUFF_TARGETS()
    {
        return {
            ATTACKER: 1, // 自身
            ATTACKER_GROUP: 2, // 己方全体
            ATTACKER_FRONT: 3, // 己方前排
            DEFENDER: 4, // 攻击目标
            DEFENDER_GROUP: 5 // 敌方全体
        }
    }

    // 获取技能BUFF效果数据结构
    static getSkillBuffEffectObject()
    {
        return {
            buff_id: 0, // 技能buff ID
            target: 0, // 目标
            atk_rate: 0, // 攻击（100%）
            def_rate: 0, // 防御（100%）
            hp_rate: 0, // 气血（100%）
            dex_rate: 0, // 敏捷（100%）
            critical_rate: 0, // 会心（100%）
            sta_rate: 0, // 韧性（100%）
            acc_rate: 0, // 命中（100%）
            eva_rate: 0, // 闪避（100%）
            vertigo_state: false, // 眩晕
        }
    }

    // 分类技能BUFF属性
    static categorySkillBuffEffect(buffObject, attrCategory, rate, gain=true)
    {
        if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_ATK) {
            buffObject['atk_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_DEF) {
            buffObject['def_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_HP) {
            buffObject['hp_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_DEX) {
            buffObject['dex_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_CRITICAL) {
            buffObject['critical_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_STA) {
            buffObject['sta_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_ACC) {
            buffObject['acc_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_EVA) {
            buffObject['eva_rate'] = gain ? rate : -rate;
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_VERTIGO) {
        } else if (attrCategory === SkillEffectModel.SKILL_BUFF_ATTRS().ATTR_GAIN_HP) {
            buffObject['hp_rate'] = rate;
        }

        return buffObject;
    }

    // 获取技能BUFF效果数据
    static getSkillBuffEffectData(buffId)
    {
        let buffObj = SkillEffectModel.getSkillBuffEffectObject();
        let CONST_BUFF_DATA = SKILL_EFFECT[buffId];
        if ("undefined" !== typeof CONST_BUFF_DATA) {
            //buffObj['target'] = CONST_BUFF_DATA['target'];

            if (CONST_BUFF_DATA['type'] === SkillEffectModel.SKILL_BUFF_TYPES().GAIN) {
                buffObj = SkillEffectModel.categorySkillBuffEffect(buffObj, CONST_BUFF_DATA['properties'], 
                    CONST_BUFF_DATA['propertiesvaluepercent'] / 100);
            } else if (CONST_BUFF_DATA['type'] === SkillEffectModel.SKILL_BUFF_TYPES().REDUCES) {
                buffObj = SkillEffectModel.categorySkillBuffEffect(buffObj, CONST_BUFF_DATA['properties'], 
                    CONST_BUFF_DATA['propertiesvaluepercent'] / 100, false);
            } else if (CONST_BUFF_DATA['type'] === SkillEffectModel.SKILL_BUFF_TYPES().GAIN_HP) {
                buffObj = SkillEffectModel.categorySkillBuffEffect(buffObj, CONST_BUFF_DATA['properties'], 
                    CONST_BUFF_DATA['propertiesvaluepercent'] / 100);
            }
        }

        return buffObj;
    }
}

module.exports = SkillEffectModel;