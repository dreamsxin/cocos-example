/**
 * 技能表
 */
const { logger } = require('./../../app');
const {
    SKILL_DATA,
    INDEX_SKILL_DATA_NAME
} = require('./../../../datas/skill_data');
const SkillEffectModel = require('./SkillEffectModel');

// 技能类型枚举
function ENUM_SKILL_TYPES()
{
    return {
        NORMAL: 1, // 普攻
        ACTIVE_ATTACK: 2, // 主动攻击
        ACTIVE_GAIN: 3, // 主动回复
        PASSIVE: 4, // 被动
    }
}

// 技能追加效果类型枚举
function ENUM_SKILL_PLUS_EFFECT_TYPES()
{
    return {
        COST_ENERGY: 1, // 减少士气
        ADD_HP: 2, // 恢复气血
        RAND_ACTION_BUFF: 3 // 随机触发buff
    }
}

class SkillModel
{
    // 技能目标
    static SKILL_TARGETS()
    {
        return {
            FRONT_SINGLE: 1, // 前排单体
            FRONT_GROUP: 2, // 前排群体
            BACK_SINGLE: 3, // 后排单体
            BACK_GROUP: 4, // 后排群体
            ENEMY_GROUP: 5, // 敌方群体
            ENEMY_GROUP_RAND: 6, // 敌方群体随机一人
            GROUP: 7, // 己方群体
            GROUP_RAND: 8, // 己方群体随机一人
        }   
    }

    // 是否为主动技能
    static isActiveSkill(skillId)
    {
        let CONST_SKILLDATA = SKILL_DATA[skillId];
        if ("undefined" === typeof CONST_SKILLDATA) {
            if (skillId > 0)
                logger.Warn("Unknown skill: skillId=%d", skillId);
            return null;
        } else {
            return CONST_SKILLDATA['skill_type'] !== ENUM_SKILL_TYPES().PASSIVE;
        }
    }

    // 是否为被动技能
    static isPassiveSkill(skillId)
    {
        let CONST_SKILLDATA = SKILL_DATA[skillId];
        if ("undefined" === typeof CONST_SKILLDATA) {
            if (skillId > 0)
                logger.Warn("Unknown skill: skillId=%d", skillId);
            return null;
        } else {
            return CONST_SKILLDATA['skill_type'] === ENUM_SKILL_TYPES().PASSIVE;
        }
    }

    // 是否触发被动技能
    static triggerPassiveSkill(skillId, hpCostRate)
    {
        if (SkillModel.isPassiveSkill(skillId)) {
            let value = Math.floor(hpCostRate * 100);
            let conditionVal = SKILL_DATA[skillId]['condition_percent'];
            if (conditionVal === null) {
                return false;
            } else {
                return (value >= conditionVal);
            }
        } else {
            return false; // 非被动技能
        }

    }

    // 获取技能效果数据结构
    static getSkillEffectObject()
    {
        return {
            target: SkillModel.SKILL_TARGETS().FRONT_SINGLE, // 技能目标（默认前排单体）
            damage_rate: 1, // 伤害百分比（直接乘以攻击）
            damage_ext_val: 0, // 额外伤害值
            cost_energy_rate: 0, // 减少士气百分比（作用于守方）
            add_hp_rate: 0, // 回复血量百分比（作用于攻方）
            buff: SkillEffectModel.getSkillBuffEffectObject()
        };
    }

    // 获取技能效果数据
    static getSkillEffectData(skillId)
    {
        let effectData = SkillModel.getSkillEffectObject();

        let CONST_SKILLDATA = SKILL_DATA[skillId];
        if ("undefined" !== typeof CONST_SKILLDATA) {
            // 技能目标
            if (CONST_SKILLDATA['target'] !== null) {
                effectData['target'] = CONST_SKILLDATA['target'];   
            }

            // 技能伤害
            if (CONST_SKILLDATA['extra_damage'] !== null) {
                effectData['extra_damage'] = CONST_SKILLDATA['extra_damage'];
            }
            if (CONST_SKILLDATA['damage_value'] !== null) {
                effectData['damage_rate'] = CONST_SKILLDATA['damage_value'] / 100;
            }

            let buffId = CONST_SKILLDATA['buff_id']; // buffId===null为无BUFF

            // 技能追加效果
            if (CONST_SKILLDATA['effect_type'] !== null && CONST_SKILLDATA['effect_value'] !== null) {
                if (CONST_SKILLDATA['effect_type'] === ENUM_SKILL_PLUS_EFFECT_TYPES().COST_ENERGY) {
                    effectData['cost_energy_rate'] = CONST_SKILLDATA['effect_value'] / 100;
                } else if (CONST_SKILLDATA['effect_type'] === ENUM_SKILL_PLUS_EFFECT_TYPES().ADD_HP) {
                    effectData['add_hp_rate'] = CONST_SKILLDATA['effect_value'] / 100;
                } else if (CONST_SKILLDATA['effect_type'] === ENUM_SKILL_PLUS_EFFECT_TYPES().RAND_ACTION_BUFF) {
                    // 随机判断是否触发BUFF
                    if (buffId !== null) {
                        if (Math.ceil(Math.random() * 100) > CONST_SKILLDATA['effect_value']) {
                            // 不触发BUFF
                            buffId = null;
                        }
                    }
                }
            }

            // 技能BUFF
            if (buffId !== null) {
                effectData['buff'] = SkillEffectModel.getSkillBuffEffectData(buffId); // 获取buff效果数据
                effectData['buff']['buff_id'] = buffId;
                effectData['buff']['target'] = CONST_SKILLDATA['buff_target'];
            }
        }

        return effectData;
    }
}

module.exports = SkillModel;