const { logger } = require('../../app');
const utility = require('./../../com/utility');
const SkillModel = require('./../models/SkillModel');
const SkillEffectModel = require('./../models/SkillEffectModel');

function BATTLE_ATTR_FIELDS() 
{
    return {
        ATK: "atk",
        DEF: "def",
        HP: "hp",
        DEX: "dex",
        CRITICAL: "critical",
        STA: "sta",
        ACC: "acc",
        EVA: "eva",
        // 技能修正值（不为0直接替代原属性数值）
        SKILL_FIXED_ATK: "skill_fixed_atk",
        SKILL_FIXED_DEF: "skill_fixed_def",
        //SKILL_FIXED_HP: "skill_fixed_hp", // 血量要设置在原生的值上（因为动态变动的，其他是加成）
        SKILL_FIXED_DEX: "skill_fixed_dex",
        SKILL_FIXED_CRITICAL: "skill_fixed_critical",
        SKILL_FIXED_STA: "skill_fixed_sta",
        SKILL_FIXED_ACC: "skill_fixed_acc",
        SKILL_FIXED_EVA: "skill_fixed_eva"
    }
}
// 战斗布阵数
const BATTLE_MATRIX_SIZE = 6;
// 战斗总回合数
const BATTLE_COUNT_MAX = 999;
// 最大士气值
const BATTLE_HERO_ENERGY_MAX = 100;
// 增益士气值
const BATTLE_HERO_ADD_VAL = 20;

class Battle
{
    constructor()
    {
        this.m_keyFrames = {};
        this.m_attackHeroQueue = [];
        this.m_attackHeroQueueCursor = 0;
        this.m_BattleIndex = [];
        this.m_isWin = false;
        this.m_HpRate = 0; // 战斗结束的血量比例（用于副本评星）
    }

    // 创建PVP
    createPVP(p1, p2)
    {
        this.m_P1HeroPtr = p1;
        this.m_P2HeroPtr = p2;

        // 布阵（暂时用自动布阵）
        this.m_P1Embattles = this.autoEmbattle(this.m_P1HeroPtr, false); // 己方
        logger.Debug("P1 embattles:", JSON.stringify(this.m_P1Embattles));
        this.m_P2Embattles = this.autoEmbattle(this.m_P2HeroPtr, true); // 敌方
        logger.Debug("P2 embattles:", JSON.stringify(this.m_P2Embattles));
        this.createAttackHeroQueue();
    }

    // 创建PVE
    createPVE(p1, p1Embattle, p2, p2Embattle)
    {
        // 己方
        this.m_P1HeroPtr = p1;
        this.m_P1Embattles = this.toEmbattle(this.m_P1HeroPtr, p1Embattle, false, false);
        logger.Debug("P1 embattles:", JSON.stringify(this.m_P1Embattles));
        // 敌方
        this.m_P2HeroPtr = p2;
        this.m_P2Embattles = this.toEmbattle(this.m_P2HeroPtr, p2Embattle, true, true);
        logger.Debug("P2 embattles:", JSON.stringify(this.m_P2Embattles));
        this.createAttackHeroQueue();
    }

    toEmbattle(heroPtr, embattle, isEnemy, isNpc)
    {
        let newEmbattle = [null, null, null, null, null, null];
        for (let i = 0; i < embattle.length; i++) {
            if (embattle[i] > 0) {
                newEmbattle[i] = this.createEmbattleHeroData(heroPtr, embattle[i], i + 1, isEnemy, isNpc);
            }
        }

        return newEmbattle;
    }

    // 自动布阵
    autoEmbattle(heroPtr, isEnemy, matrixSize=6)
    {
        let shuffleIds = utility.ArrayShuffle(heroPtr.getHeroIds()),
            len = shuffleIds.length > matrixSize ? matrixSize : shuffleIds.length,
            embattles = [null, null, null, null, null, null];
        for (let i = 0; i < len; i++) {
            embattles[i] = this.createEmbattleHeroData(heroPtr, shuffleIds[i], i + 1, isEnemy, false);
        }

        return embattles;
    }

    checkEmbattle()
    {
        let p1Count = 0, p2Count = 0;
        for (let i = 0; i < BATTLE_MATRIX_SIZE; i++) {
            if (this.m_P1Embattles[i] === null) {
                ++p1Count;
            }

            if (this.m_P2Embattles[i] === null) {
                ++p2Count;
            }
        }

        return (p1Count < BATTLE_MATRIX_SIZE && p2Count < BATTLE_MATRIX_SIZE)
    }

    // 增加战斗帧
    addBattleKeyFrame(keyframe)
    {
        let key = Object.keys(this.m_keyFrames).length;
        this.m_keyFrames[key] = keyframe;
    }

    // 创建战斗帧
    createBattleKeyFrame()
    {
        const getBattleKeyFramePayloadObject = () => {
            return {
                id: 0, // 随从id
                isNpc: false, // 是否是NPC
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
                buff: [] // 技能buff列表
            };
        }

        const getBattleKeyFramePayload = (battleHero, pos) => {
            var payload = getBattleKeyFramePayloadObject();
            payload.id = battleHero['hero_id'];
            payload.isNpc = battleHero['isNpc'];
            payload.pos = pos;
            payload.lossHP = battleHero['lose_hp'];
            payload.addHP = battleHero['add_hp'];
            payload.HP = battleHero[BATTLE_ATTR_FIELDS().HP];
            payload.maxHP = battleHero['max_hp'];
            payload.energy = battleHero['energy'];
            payload.attackPos = battleHero['attack_pos'];
            payload.skillId = battleHero['skill_id'] === 0 ? battleHero['normal_skill_id'] : battleHero['skill_id'];
            payload.isEvade = battleHero['is_evade'];
            payload.isCritical = battleHero['is_critical'];
            payload.buff = battleHero['buff'];

            return payload;
        }

        const clearBattleHeroTempData = (battleHero) => {
            battleHero['lose_hp'] = 0;
            battleHero['add_hp'] = 0;
            battleHero['attack_pos'] = 0;
            battleHero['skill_id'] = 0;
            battleHero['is_evade'] = false;
            battleHero['is_critical'] = false;
            battleHero['buff'] = [];
            return battleHero;
        };

        let keyframe = { heroData: [] /** p1 */, enemyData: [] /** p2 */ }

        this.m_P1Embattles.forEach((hero, index, input) => {
            if (hero !== null) {
                keyframe.heroData.push(getBattleKeyFramePayload(hero, index + 1));
                input[index] = clearBattleHeroTempData(hero);
            } else {
                keyframe.heroData.push({});
            }
        });
        this.m_P2Embattles.forEach((hero, index, input) => {
            if (hero !== null) {
                keyframe.enemyData.push(getBattleKeyFramePayload(hero, index + 1));
                input[index] = clearBattleHeroTempData(hero);
            } else {
                keyframe.enemyData.push({});
            }
        });

        logger.Debug("Battle keyframe create: %s", JSON.stringify(keyframe));

        return keyframe;
    }

    // 创建上阵随从数据
    createEmbattleHeroData(heroPtr, heroId, pos, isEnemy, isNpc)
    {
        let battleHero = {};
        battleHero['pos'] = pos; // 布阵位置
        battleHero['hero_id'] = heroId;
        battleHero['isEnemy'] = isEnemy;
        battleHero['isNpc'] = isNpc;
        battleHero['level'] = heroPtr.getLevel(heroId);
        battleHero[BATTLE_ATTR_FIELDS().ATK] = heroPtr.getAttrAtk(heroId); // 攻击
        battleHero[BATTLE_ATTR_FIELDS().DEF] = heroPtr.getAttrDef(heroId); // 防御
        battleHero[BATTLE_ATTR_FIELDS().HP] = heroPtr.getAttrHp(heroId); // 气血
        battleHero['lose_hp'] = 0; // 临时存储丢失气血
        battleHero['add_hp'] = 0; // 临时存储回复气血
        battleHero['max_hp'] = heroPtr.getAttrHp(heroId); // 最大气血(只存储, 不参与计算)
        battleHero[BATTLE_ATTR_FIELDS().DEX] = heroPtr.getAttrDex(heroId); // 敏捷
        battleHero[BATTLE_ATTR_FIELDS().CRITICAL] = heroPtr.getAttrCritical(heroId); // 会心
        battleHero[BATTLE_ATTR_FIELDS().STA] = heroPtr.getAttrSta(heroId); // 韧性
        battleHero[BATTLE_ATTR_FIELDS().ACC] = heroPtr.getAttrAcc(heroId); // 命中
        battleHero[BATTLE_ATTR_FIELDS().EVA] = heroPtr.getAttrEva(heroId); // 闪避
        battleHero['normal_skill_id'] = heroPtr.getNormalSkillId(heroId); // 普攻技能
        battleHero['active_skill_id'] = heroPtr.getActiveSkillId(heroId); // 主动技能
        battleHero['passive_skill_id'] = heroPtr.getPassiveSkillId(heroId); // 被动技能
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK] = 0;
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_DEF] = 0;
        //battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_HP] = 0;
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_DEX] = 0;
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_CRITICAL] = 0;
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_STA] = 0;
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_ACC] = 0;
        battleHero[BATTLE_ATTR_FIELDS().SKILL_FIXED_EVA] = 0;
        battleHero['energy'] = heroPtr.getEnergy(heroId); // 存储士气值（非临时）
        battleHero['attack_pos'] = 0; // 临时存储攻击位置
        battleHero['skill_id'] = 0; // 临时存储技能ID
        battleHero['is_evade'] = false; // 临时存储是否触发闪避
        battleHero['is_critical'] = false; // 临时存储是否暴击
        battleHero['buff'] = [];

        return battleHero;
    }

    // 获取单个布阵的血量总和
    getEmbattleAttrHpTotal(embattle)
    {
        let hpTotal = 0;
        embattle.forEach(hero => {
            if (hero !== null) {
                hpTotal += this.getBattleHeroHp(hero);
            }
        });
        return hpTotal;
    }

    getAttackDefendObject()
    {
        return {
            isEnemy: false, // 是否为敌方
            isNpc: false, // 是否是怪
            pos: 0, // 随从布阵位置
            id: 0, // 随从ID
            dex: 0 // 随从敏捷（先攻计算用）
        }
    }

    // 生成攻方随从队列数据
    createAttackHeroQueue()
    {
        this.m_attackHeroQueue = [];

        // 己方
        this.m_P1Embattles.forEach((hero, index) => {
            if (hero != null) {
                let attackHeroData = this.getAttackDefendObject();
                attackHeroData.isNpc = hero['isNpc'];
                attackHeroData.pos = (index + 1);
                attackHeroData.id = hero['hero_id'];
                attackHeroData.dex = hero[BATTLE_ATTR_FIELDS().DEX];
                this.m_attackHeroQueue.push(attackHeroData);
            }
        });

        // 敌方
        this.m_P2Embattles.forEach((hero, index) => {
            if (hero !== null) {
                let attackHeroData = this.getAttackDefendObject();
                attackHeroData.isEnemy = true;
                attackHeroData.isNpc = hero['isNpc'];
                attackHeroData.pos = (index + 1);
                attackHeroData.id = hero['hero_id'];
                attackHeroData.dex = hero[BATTLE_ATTR_FIELDS().DEX];
                this.m_attackHeroQueue.push(attackHeroData);
            }
        });

        // 根据敏捷排序
        this.m_attackHeroQueue.sort((a, b) => { return b.dex - a.dex });

        logger.Debug("Battle attack hero queue: ", JSON.stringify(this.m_attackHeroQueue));

        // 删除无用字段用于可直接存入客户端需求数据
        this.m_attackHeroQueue.forEach((item, index, input) => {
            delete input[index]['dex'];
        });
    }

    // 当前攻方随从数据
    getCurrentAttackHeroData()
    {
        let round = this.m_attackHeroQueueCursor++%this.m_attackHeroQueue.length;
        return [this.m_attackHeroQueue[round], round];
    }

    checkAttackQueueOver()
    {
        let count = 0;
        for (let i = 0; i < this.m_attackHeroQueue.length; i++) {
            if (this.checkBattleHeroDead(this.m_attackHeroQueue[i])) ++count;
        }

        return this.m_attackHeroQueue.length === count;
    }

    // 获取守方前排（后排）单体
    getDefendHeroBySingle(embattles, front=true)
    {
        let defendHeroData = this.getAttackDefendObject();

        let s1, e1, s2, e2;
        if (front) {
            [s1, e1, s2, e2] = [0, 3, 3, 6];
        } else {
            [s1, e1, s2, e2] = [3, 6, 0, 3];
        }

        let lis = [];
        // 加入前排（后排）未阵亡随从
        for (let i = s1; i < e1; i++) {
            if (embattles[i] !== null && embattles[i][BATTLE_ATTR_FIELDS().HP] > 0) {
                lis.push(embattles[i]);
            }
        }

        if (lis.length > 0) {
            let heroData = lis[Math.ceil(Math.random() * lis.length) - 1];
            defendHeroData['pos'] = heroData['pos'];
            defendHeroData['id'] = heroData['hero_id'];
        } else {
            // 前排（后排）已全部阵亡，选择后排（前排）
            lis = [];
            for (let i = s2; i < e2; i++) {
                if (embattles[i] !== null && embattles[i][BATTLE_ATTR_FIELDS().HP] > 0) {
                    lis.push(embattles[i]);
                }
            }

            if (lis.length > 0) {
                let heroData = lis[Math.ceil(Math.random() * lis.length) - 1];
                defendHeroData['pos'] = heroData['pos'];
                defendHeroData['id'] = heroData['hero_id'];
            } else {
                defendHeroData = null;
            }
        }

        return defendHeroData;
    }

    // 获取守方前排（后排）群体
    getDefendHeroByGroup(embattles, front=true)
    {
        let s1, e1, s2, e2;
        if (front) {
            [s1, e1, s2, e2] = [0, 3, 3, 6];
        } else {
            [s1, e1, s2, e2] = [3, 6, 0, 3];
        }

        let lis = [];
        // 加入前排（后排）未阵亡随从
        for (let i = s1; i < e1; i++) {
            if (embattles[i] !== null && embattles[i][BATTLE_ATTR_FIELDS().HP] > 0) {
                lis.push(embattles[i]);
            }
        }

        if (lis.length === 0) {
            // 前排（后排）已全部阵亡，选择后排（前排）
            lis = [];
            for (let i = s2; i < e2; i++) {
                if (embattles[i] !== null && embattles[i][BATTLE_ATTR_FIELDS().HP] > 0) {
                    lis.push(embattles[i]);
                }
            }
        }

        let defendHeroLis = [];
        for (let heroData of lis) {
            let defendHeroData = this.getAttackDefendObject();
            defendHeroData['pos'] = heroData['pos'];
            defendHeroData['id'] = heroData['hero_id'];
            defendHeroLis.push(defendHeroData);
        }

        return defendHeroLis;
    }

    // 守方群体（随机一个或群体）
    getDefendHeroGroup(embattles, all=true)
    {
        let lis = [];
        for (let i = 0; i < 6; i++) {
            if (embattles[i] !== null && embattles[i][BATTLE_ATTR_FIELDS().HP] > 0) {
                lis.push(embattles[i]);
            }
        }

        let defendHeroLis = [];
        if (all) {
            // 群体
            for (let heroData of lis) {
                let defendHeroData = this.getAttackDefendObject();
                defendHeroData['pos'] = heroData['pos'];
                defendHeroData['id'] = heroData['hero_id'];
                defendHeroLis.push(defendHeroData);
            }
        } else {
            if (lis.length > 0) {
                // 群体随机一个
                let heroData = lis[Math.ceil(Math.random() * lis.length) - 1];
                let defendHeroData = this.getAttackDefendObject();
                defendHeroData['pos'] = heroData['pos'];
                defendHeroData['id'] = heroData['hero_id'];
                defendHeroLis.push(defendHeroData);
            } else {
                // 守方已全部阵亡（出现这个应该上一回合整个战斗就应该结束结算了）
            }
        }

        return defendHeroLis;
    }

    // 攻方群体（随机一个或群体）
    getAttackHeroGroup(isAttackHeroEnemy, all=true)
    {

        let embattles = isAttackHeroEnemy ? this.m_P1Embattles : this.m_P2Embattles;

        let lis = [];
        for (let i = 0; i < 6; i++) {
            if (embattles[i] !== null && embattles[i][BATTLE_ATTR_FIELDS().HP] > 0) {
                lis.push(embattles[i]);
            }
        }

        let defendHeroLis = [];
        if (all) {
            // 群体
            for (let heroData of lis) {
                let defendHeroData = this.getAttackDefendObject();
                defendHeroData['pos'] = heroData['pos'];
                defendHeroData['id'] = heroData['hero_id'];
                defendHeroLis.push(defendHeroData);
            }
        } else {
            if (lis.length > 0) {
                // 群体随机一个
                let heroData = lis[Math.ceil(Math.random() * lis.length) - 1];
                let defendHeroData = this.getAttackDefendObject();
                defendHeroData['pos'] = heroData['pos'];
                defendHeroData['id'] = heroData['hero_id'];
                defendHeroLis.push(defendHeroData);
            } else {
                // 守方已全部阵亡（出现这个应该上一回合整个战斗就应该结束结算了）
            }
        }

        return defendHeroLis;
    }

    // 按技能目标获取守方数据（列表）
    selectDefendHeroListDataByRule(embattles, skillTarget, isAttackHeroEnemy)
    {
        let defendHeroLis = [], targetEnemy = true;

        if (skillTarget === SkillModel.SKILL_TARGETS().FRONT_SINGLE) {
            // 前排单体
            let defendHeroData = this.getDefendHeroBySingle(embattles);
            if (defendHeroData !== null) {
                defendHeroLis.push(defendHeroData);
            }
        } else if (skillTarget === SkillModel.SKILL_TARGETS().FRONT_GROUP) {
            // 前排群体
            defendHeroLis = this.getDefendHeroByGroup(embattles);
        } else if (skillTarget === SkillModel.SKILL_TARGETS().BACK_SINGLE) {
            // 后排单体
            let defendHeroData = this.getDefendHeroBySingle(embattles, false);
            if (defendHeroData !== null) {
                defendHeroLis.push(defendHeroData);
            }
        } else if (skillTarget === SkillModel.SKILL_TARGETS().BACK_GROUP) {
            // 后排群体
            defendHeroLis = this.getDefendHeroByGroup(embattles, false);
        } else if (skillTarget === SkillModel.SKILL_TARGETS().ENEMY_GROUP) {
            // 敌方群体
            defendHeroLis = this.getDefendHeroGroup(embattles);
        } else if (skillTarget === SkillModel.SKILL_TARGETS().ENEMY_GROUP_RAND) {
            // 敌方群体随机一个
            defendHeroLis = this.getDefendHeroGroup(embattles, false);
        } else if (skillTarget === SkillModel.SKILL_TARGETS().GROUP) {
            // 己方群体
            defendHeroLis = this.getAttackHeroGroup(isAttackHeroEnemy);
            targetEnemy = false;
        } else if (skillTarget === SkillModel.SKILL_TARGETS().GROUP_RAND) {
            // 己方群体随机一个
            defendHeroLis = this.getAttackHeroGroup(isAttackHeroEnemy, false);
            targetEnemy = false;
        }

        return [defendHeroLis, targetEnemy];
    }

    // 获取守方随从数据
    getDefendHeroData(isAttackHeroEnemy, skillTarget=1)
    {
        let embattles;
        if (isAttackHeroEnemy) {
            // 攻方是敌方，需要在我方选择一个守方随从
            // 我方
            embattles = this.m_P1Embattles;
        } else {
            // 攻方是我方，需要在敌方选择一个守方随从
            // 敌方
            embattles = this.m_P2Embattles;
        }

        let [defendHeroLis, targetEnemy] = this.selectDefendHeroListDataByRule(embattles, skillTarget, isAttackHeroEnemy);
        for (let i = 0; i < defendHeroLis.length; i++) {
            defendHeroLis[i]['isEnemy'] = !isAttackHeroEnemy;
        }

        return [defendHeroLis, targetEnemy];
    }

    // ================================================================================
    // 技能
    // ================================================================================
    // 释放释放主动技能
    triggerActiveSkill(battleHero)
    {
        // 非普攻且士气已满
        if (this.checkBattleHeroEnergyFull(battleHero)) {
            // 可以释放
            this.resetBattleHeroEnergy(battleHero);
            return true;
        } else {
            return false;
        }
        
    }

    // 获取战斗随从主动技能
    getBattleHeroActiveSkillId(battleHero)
    {
        return this.getBattleHeroValue(battleHero['pos'], 'active_skill_id', battleHero['isEnemy']);
    }

    // 获取战斗随从被动技能
    getBattleHeroPassiveSkillId(battleHero)
    {
        return this.getBattleHeroValue(battleHero['pos'], 'passive_skill_id', battleHero['isEnemy']);
    }

    // 计算技能效果
    computeSkillEffect(attackHero, targetBattleHeroLis, newSkillEffectData, targetEnemy)
    {
        // 计算伤害值（作用于攻方）
        if (targetEnemy) {
            // 敌方需要计算己方攻击
            this.computeBattleHeroFixedAtk(attackHero, 
                newSkillEffectData['damage_rate'], 
                newSkillEffectData['damage_ext_val']);
        }

        // 回复气血（作用于攻方）
        this.computeBattleHeroFixedHp(attackHero, 
            newSkillEffectData['add_hp_rate']);

        // 作用于目标战斗随从（增益的是己方、减益的是敌方）
        for (let targetHero of targetBattleHeroLis) {
            if (targetEnemy) {
                // 减少士气值
                this.subBattleHeroEnergyByRate(targetHero, 
                    newSkillEffectData['cost_energy_rate']);
                // 计算BUFF效果
                this.computeSkillBuffEffect(attackHero, 
                    targetHero, 
                    newSkillEffectData['buff']);
            } else {
                // 是己方回复类型
                this.computeBattleHeroFixedHp(attackHero, 
                    newSkillEffectData['damage_rate']);
            }
        }
    }

    // 计算技能BUFF效果
    computeSkillBuffEffect(attackHero, defendHero, buffData)
    {
        let buffTarget = buffData['target'];
        if (buffTarget === SkillEffectModel.SKILL_BUFF_TARGETS().ATTACKER) {
            // 自身
            this.fixedBuffAttrs(attackHero, buffData);
            this.addBattleHeroBuff(attackHero['pos'], buffData['buff_id'], attackHero['isEnemy']);
        } else if (buffTarget === SkillEffectModel.SKILL_BUFF_TARGETS().ATTACKER_GROUP) {
            // 己方全体
            let embattle = this.getEmbattle(attackHero['isEnemy']);
            for (let battleHero of embattle) {
                this.fixedBuffAttrs(battleHero, buffData);
                this.addBattleHeroBuff(battleHero['pos'], buffData['buff_id'], battleHero['isEnemy']);
            }
        } else if (buffTarget === SkillEffectModel.SKILL_BUFF_TARGETS().ATTACKER_FRONT) {
            // 己方前排
            let embattle = this.getEmbattle(attackHero['isEnemy']);
            // 需要判断前排是否已全部阵亡
            let flag = false;
            for (let i = 0; i < 3; i++) {
                if (embattle[i] !== null && this.getBattleHeroHp(embattle[i]) > 0) {
                    this.fixedBuffAttrs(embattle[i], buffData);
                    this.addBattleHeroBuff(embattle[i]['pos'], buffData['buff_id'], attackHero['isEnemy']);
                    flag = true;
                }
            }
            if (!flag) {
                // 前排都阵亡
                for (let i = 3; i < 6; i++) {
                    if (embattle[i] !== null && this.getBattleHeroHp(embattle[i]) > 0) {
                        this.fixedBuffAttrs(embattle[i], buffData);
                        this.addBattleHeroBuff(embattle[i]['pos'], buffData['buff_id'], attackHero['isEnemy']);
                    }
                }
            }
        } else if (buffTarget === SkillEffectModel.SKILL_BUFF_TARGETS().DEFENDER) {
            // 攻击目标
            this.fixedBuffAttrs(defendHero, buffData);
            this.addBattleHeroBuff(defendHero['pos'], buffData['buff_id'], defendHero['isEnemy']);
        } else if (buffTarget === SkillEffectModel.SKILL_BUFF_TARGETS().DEFENDER_GROUP) {
            // 敌方全体
            let embattle = this.getEmbattle(defendHero['isEnemy']);
            for (let battleHero of embattle) {
                this.fixedBuffAttrs(battleHero, buffData);
                this.addBattleHeroBuff(battleHero['pos'], buffData['buff_id'], defendHero['isEnemy']);
            }
        }
    }

    // 调整BUFF属性
    fixedBuffAttrs(battleHero, buffData)
    {
        this.setBattleHeroFixedAtkByRate(battleHero, buffData['atk_rate']);
        this.setBattleHeroFixedDefByRate(battleHero, buffData['def_rate']);
        this.setBattleHeroFixedHpByRate(battleHero, buffData['hp_rate']);
        this.setBattleHeroFixedDexByRate(battleHero, buffData['dex_rate']);
        this.setBattleHeroFixedCriticalByRate(battleHero, buffData['critical_rate']);
        this.setBattleHeroFixedStaByRate(battleHero, buffData['sta_rate']);
        this.setBattleHeroFixedAccByRate(battleHero, buffData['acc_rate']);
        this.setBattleHeroFixedEvaByRate(battleHero, buffData['eva_rate']);
    }

    // 清理每个上阵战斗随从的技能修正数据（一轮结束）
    clearSkillEffectData()
    {
        for (let i = 0; i < 6; i++) {
            // 己方
            if (this.m_P1Embattles[i] !== null) {
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK] = 0;
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_DEF] = 0;
                //this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_HP] = 0;
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_DEX] = 0;
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_CRITICAL] = 0;
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_STA] = 0;
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_ACC] = 0;
                this.m_P1Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_EVA] = 0;
            }
            // 敌方
            if (this.m_P2Embattles[i] !== null) {
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK] = 0;
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_DEF] = 0;
                //this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_HP] = 0;
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_DEX] = 0;
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_CRITICAL] = 0;
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_STA] = 0;
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_ACC] = 0;
                this.m_P2Embattles[i][BATTLE_ATTR_FIELDS().SKILL_FIXED_EVA] = 0;
            }
        }
    }

    // 加入战斗随从buff
    addBattleHeroBuff(pos, buffId, isEnemy=false)
    {
        if (buffId > 0) {
            // 的确有buff
            let buffLis = this.getBattleHeroValue(pos, 'buff', isEnemy);
            buffLis.push(buffId);
            this.setBattleHeroValue(pos, 'buff', buffLis, isEnemy);
        }
    }

    // =========================================================== 获取技能修正后的战斗随从属性一下
    // * 如果技能修正值大于零则使用该值否则使用原属性值
    getBattleHeroFixedAtk(pos, isEnemy=false)
    {
        let fixedAtk = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK, isEnemy);
        if (fixedAtk > 0) {
            return fixedAtk;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().ATK, isEnemy);
        }
    }
    computeBattleHeroFixedAtk(battleHero, rateVal, extVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * rateVal + extVal;
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().ATK, isEnemy);
            newFixedVal = originVal * rateVal + extVal;
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK, newFixedVal, isEnemy);
    }
    setBattleHeroFixedAtkByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().ATK, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ATK, newFixedVal, isEnemy);
    }

    getBattleHeroFixedDef(pos, isEnemy=false)
    {
        let fixedDef = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_DEF, isEnemy);
        if (fixedDef > 0) {
            return fixedDef;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().DEF, isEnemy);
        }
    }
    setBattleHeroFixedDefByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_DEF, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().DEF, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_DEF, newFixedVal, isEnemy);
    }
    getBattleHeroHp(battleHero)
    {
        return this.getBattleHeroValue(battleHero['pos'], BATTLE_ATTR_FIELDS().HP, battleHero['isEnemy']);
    }
    computeBattleHeroFixedHp(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let maxHP = this.getBattleHeroValue(pos, 'max_hp', isEnemy);
        let currHp = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().HP, isEnemy),
            newFixedHp = currHp * (1 + rateVal);
        newFixedHp = (newFixedHp > maxHP) ? maxHP : newFixedHp;

        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().HP, Math.ceil(newFixedHp), isEnemy);
    }
    subBattleHeroFixedHp(battleHero, costVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let hpVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().HP, isEnemy) - costVal;
        hpVal  = (hpVal < 0 ? 0 : hpVal);
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().HP, hpVal, isEnemy);
    }
    setBattleHeroFixedHpByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let maxHP = this.getBattleHeroValue(pos, 'max_hp', isEnemy);
        let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().HP, isEnemy),
            newFixedVal = originVal * (1 + rateVal);
            if (newFixedVal > maxHP) {
                newFixedVal = maxHP;
            } else if (newFixedVal < 0) {
                newFixedVal = 0;
            }

        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().HP, Math.ceil(newFixedVal), isEnemy);
    }
    getBattleHeroFixedDex(pos, isEnemy=false)
    {
        let fixedDex = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_DEX, isEnemy);
        if (fixedDex > 0) {
            return fixedDex;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().DEX, isEnemy);
        }
    }
    setBattleHeroFixedDexByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_DEX, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().DEX, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_DEX, newFixedVal, isEnemy);
    }
    getBattleHeroFixedCritical(pos, isEnemy=false)
    {
        let fixedCritical = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_CRITICAL, isEnemy);
        if (fixedCritical > 0) {
            return fixedCritical;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().CRITICAL, isEnemy);
        }
    }
    setBattleHeroFixedCriticalByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_CRITICAL, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().CRITICAL, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_CRITICAL, newFixedVal, isEnemy);
    }
    getBattleHeroFixedSta(pos, isEnemy=false)
    {
        let fixedSta = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_STA, isEnemy);
        if (fixedSta > 0) {
            return fixedSta;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().STA, isEnemy);
        }
    }
    setBattleHeroFixedStaByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_STA, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().STA, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_STA, newFixedVal, isEnemy);
    }
    getBattleHeroFixedAcc(pos, isEnemy=false)
    {
        let fixedAcc = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ACC, isEnemy);
        if (fixedAcc > 0) {
            return fixedAcc;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().ACC, isEnemy);
        }
    }
    setBattleHeroFixedAccByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ACC, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().ACC, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_ACC, newFixedVal, isEnemy);
    }
    getBattleHeroFixedEva(pos, isEnemy=false)
    {
        let fixedEva = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_EVA, isEnemy);
        if (fixedEva > 0) {
            return fixedEva;
        } else {
            return this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().EVA, isEnemy);
        }
    }
    setBattleHeroFixedEvaByRate(battleHero, rateVal)
    {
        let [pos, isEnemy] = [battleHero['pos'], battleHero['isEnemy']];
        let fixedVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_EVA, isEnemy),
            newFixedVal = fixedVal;
        if (fixedVal > 0) {
            newFixedVal = fixedVal * (1 + rateVal);
        } else {
            let originVal = this.getBattleHeroValue(pos, BATTLE_ATTR_FIELDS().EVA, isEnemy);
            newFixedVal = originVal * (1 + rateVal);
        }
        this.setBattleHeroValue(pos, BATTLE_ATTR_FIELDS().SKILL_FIXED_EVA, newFixedVal, isEnemy);
    }
    // =========================================================== 获取技能修正后的战斗随从属性以上

    // 是否触发闪避
    triggerEvade(attackHero, defendHero)
    {
        // 减法公式：MAX(((ACC - EVA) * BETA + BASE_ACC_RATE), BASE_ACC_RATE)
        // 除去公式：ACC_RATE = ACC / (ACC + EVA)
        // 常用命中公式：ACC_RATE = (ACC + ADJUST_RATIO) / (EVA + ADJUST_RATIO) * BASE_ACC_RATIO, BASE_ACC_RATE=0.7, ADJUST_RATIO=100, ACC_DOWN_LIMIT=[0.2, 0.3]
        // let ADJUST_RATIO = 100, /** 调整系数 */
        //     BASE_ACC_RATIO = 0.6; /** 基本命中率 */
        // return (Math.random() <= 
        //     ((this.getBattleHeroFixedAcc(attackHero['pos'], attackHero['isEnemy']) + ADJUST_RATIO) / 
        //     (this.getBattleHeroFixedEva(defendHero['pos'], defendHero['isEnemy']) + ADJUST_RATIO) * (1 - BASE_ACC_RATIO)));

        let acc = this.getBattleHeroFixedAcc(attackHero['pos'], attackHero['isEnemy']),
            eva = this.getBattleHeroFixedEva(defendHero['pos'], defendHero['isEnemy']);

        const BASE_ACC_VAL = 80;
        return (Math.random() * 1 > Math.max((acc - eva) * 0.2 + BASE_ACC_VAL, BASE_ACC_VAL) / 100)
    }

    // 是否触发暴击
    triggerCritical(attackHero, defendHero)
    {
        // 守方韧性是否超过攻方会心的2/3
        return (this.getBattleHeroFixedSta(defendHero['pos'], defendHero['isEnemy']) > 
            Math.ceil(this.getBattleHeroFixedCritical(attackHero['pos'], attackHero['isEnemy']) * (2 / 3)));
    }

    // 计算随从攻击值
    computeAtk(attackHero, isCritical=false)
    {
        let cricialVal = (isCritical ? this.getBattleHeroFixedCritical(attackHero['pos'], attackHero['isEnemy']) : 0);
        return (1 + cricialVal) * this.getBattleHeroFixedAtk(attackHero['pos'], attackHero['isEnemy']);
    }

    // 计算战斗是否结束
    computeBattleOver()
    {
        // 哪一方血量为0战斗结束,胜利方为血量大于0的
        // 如果双方血量都为0, 胜利方为己方
        let p1HpTotal = this.getEmbattleAttrHpTotal(this.m_P1Embattles),
            p2HpTotal = this.getEmbattleAttrHpTotal(this.m_P2Embattles);

        let isBattleOver;
        if (p1HpTotal === 0 && p2HpTotal === 0) {
            this.m_isWin = true;
            isBattleOver = true; // 战斗结束
        } else if (p1HpTotal === 0 || p2HpTotal === 0) {
            this.m_isWin = (p1HpTotal > p2HpTotal);
            isBattleOver = true; // 战斗结束 
        } else {
            isBattleOver = false; // 战斗继续
        }

        return isBattleOver;
    }    

    // 计算战斗结束剩余血量百分比（己方）
    computeBattleHpRate()
    {
        let hpVal = 0, hpTotal = 0;
        for (let battleHero of this.m_P1Embattles) {
            if (battleHero !== null) {
                hpVal += battleHero[BATTLE_ATTR_FIELDS().HP];
                hpTotal += battleHero['max_hp'];
            }
        }

        this.m_HpRate = (hpVal / hpTotal) * 100;
    }

    getHpRate()
    {
        return this.m_HpRate;
    }

    // 获取布阵列表
    getEmbattle(isEnemy=false)
    {
        return (isEnemy ? this.m_P2Embattles : this.m_P1Embattles);
    }

    // 获取战斗随从数据
    getBattleHeroData(pos, isEnemy=false)
    {
        if (isEnemy) {
            return this.m_P2Embattles[pos-1];
        } else {
            return this.m_P1Embattles[pos-1];
        }
    }

    // 设置战斗随从数据
    setBattleHeroValue(pos, field, value, isEnemy=false)
    {
        if (isEnemy) {
            // 敌方
            this.m_P2Embattles[pos-1][field] = value;
        } else {
            // 我方
            this.m_P1Embattles[pos-1][field] = value;
        }
    }
    // 增加战斗随从数据
    addBattleHeroValue(pos, field, value, isEnemy=false)
    {
        if (isEnemy) {
            // 敌方
            this.m_P2Embattles[pos-1][field] += value;
        } else {
            // 我方
            this.m_P1Embattles[pos-1][field] += value;
        }
    }
    // 减少战斗随从数据
    subBattleHeroValue(pos, field, value, isEnemy=false)
    {
        if (isEnemy) {
            // 敌方
            this.m_P2Embattles[pos-1][field] -= value;
            if (this.m_P2Embattles[pos-1][field] < 0) {
                this.m_P2Embattles[pos-1][field] = 0;
            }
        } else {
            // 我方
            this.m_P1Embattles[pos-1][field] -= value;
            if (this.m_P1Embattles[pos-1][field] < 0) {
                this.m_P1Embattles[pos-1][field] = 0;
            }
        }
    }

    // 获取战斗随从数据
    getBattleHeroValue(pos, field, isEnemy=false)
    {
        if (isEnemy) {
            // 敌方
            return this.m_P2Embattles[pos-1][field];
        } else {
            // 我方
            return this.m_P1Embattles[pos-1][field];
        }
    }

    // 判断战斗随从是否已阵亡
    checkBattleHeroDead(battleHero)
    {
        return this.getBattleHeroHp(battleHero) === 0;
    }

    // 获取士气值
    checkBattleHeroEnergyFull(battleHero)
    {
        return (this.getBattleHeroValue(battleHero['pos'], 'energy', battleHero['isEnemy']) === BATTLE_HERO_ENERGY_MAX);
    }
    // 计算士气值
    computeBattleHeroEnergy(battleHero)
    {
        // 增加攻方的士气值（技能释放回合不增加，成功命中就增加）
        if (this.getBattleHeroValue(battleHero['pos'], 'energy', battleHero['isEnemy']) < BATTLE_HERO_ENERGY_MAX) {
            // 士气值未满可以增加
            this.addBattleHeroValue(battleHero['pos'], 'energy', BATTLE_HERO_ADD_VAL, battleHero['isEnemy']);
        }
    }
    // 重置士气值
    resetBattleHeroEnergy(battleHero)
    {
        this.setBattleHeroValue(battleHero['pos'], 'energy', 0, battleHero['isEnemy']);
    }

    // 扣除士气值（按百分比）
    subBattleHeroEnergyByRate(battleHero, rate)
    {
        let value = this.getBattleHeroValue(battleHero['pos'], 'energy', battleHero['isEnemy']) * (1 - rate);
        //this.subBattleHeroValue(battleHero['pos'], 'energy', value, battleHero['isEnemy']);
        this.setBattleHeroValue(battleHero['pos'], 'energy', value, battleHero['isEnemy']);
    }

    // 计算单体损益
    computeSignleHeroAttrs(attackHeroData, defendHeroData)
    {
        // * 守方按条件释放被动技能

        let hitFlag = false; // 是否命中（用于增加攻方士气值）

        if (defendHeroData !== null) {
            // 是否触发闪避
            /*let attackHero = this.getBattleHeroData(attackHeroData['pos'], attackHeroData['isEnemy']),
                defendHero = this.getBattleHeroData(defendHeroData['pos'], defendHeroData['isEnemy']);*/

            let isEvade = this.triggerEvade(attackHeroData, defendHeroData);
            if (isEvade) {
                // 守方闪避（直接结束该回合）
                this.setBattleHeroValue(defendHeroData['pos'], 'is_evade', true, defendHeroData['isEnemy']); // 设置闪避触发状态
            } else {
                // 攻方命中
                // 是否触发暴击(如果暴击需要设置暴击状态、计算暴击加成的攻击数值)
                let isCritical = this.triggerCritical(attackHeroData, defendHeroData);
                if (isCritical) {
                    this.setBattleHeroValue(attackHeroData['pos'], 'is_critical', true, attackHeroData['isEnemy']);
                }
                // 计算攻方攻击
                let attackAtkVal = this.computeAtk(attackHeroData, isCritical); // 需要计算暴击增益

                // 计算守方血量
                let defendDefVal = this.getBattleHeroFixedDef(defendHeroData['pos'], defendHeroData['isEnemy']); // 获取守方的防御值
                let defendHpVal = this.getBattleHeroHp(defendHeroData); // 获取守方当前血量（用于触发被动技能条件判断）
                let costHpVal = (attackAtkVal - defendDefVal) < 0 ? 0 : (attackAtkVal - defendDefVal); // 扣除的血量
                costHpVal = Math.ceil(costHpVal);

                // ============================================= 被动技能相关以下
                let passiveSkillId = this.getBattleHeroPassiveSkillId(defendHeroData); // 获取被动技能ID
                if (SkillModel.triggerPassiveSkill(passiveSkillId, costHpVal / defendHpVal)) {
                    // 计算被动技能属性
                    let passiveSkillEffectData = SkillModel.getSkillEffectData(passiveSkillId);
                    // 被动技能攻方守方对调就行
                    this.computeSkillBuffEffect(defendHeroData, 
                        attackHeroData, passiveSkillEffectData['buff']);

                    logger.Debug("TRIGGER_PASSIVE_SKILL: id=%d, data=%s", passiveSkillId, 
                        JSON.stringify(passiveSkillEffectData));
                }
                // ============================================= 被动技能相关以上
                // 需要根据被被动技能影响后的属性重新计算
                attackAtkVal = this.computeAtk(attackHeroData, isCritical); // 需要计算暴击增益
                defendDefVal = this.getBattleHeroFixedDef(defendHeroData['pos'], defendHeroData['isEnemy']); // 获取守方的防御值
                costHpVal = (attackAtkVal - defendDefVal) < 0 ? 0 : (attackAtkVal - defendDefVal); // 扣除的血量
                costHpVal = Math.ceil(costHpVal);

                this.setBattleHeroValue(defendHeroData['pos'], 'lose_hp', costHpVal, defendHeroData['isEnemy']);
                this.subBattleHeroFixedHp(defendHeroData, costHpVal);
                //this.subBattleHeroValue(defendHeroData['pos'], BATTLE_ATTR_FIELDS().HP, costHpVal, defendHeroData['isEnemy']);

                hitFlag = true;
            }
        } else {
            // 守方全部阵亡（理论不应该出现这种场景）
        }

        return hitFlag;
    }

    // 计算战斗
    computeFighting(attackHeroData)
    {
        let defendHeroLis = [], /** 守方随从列表（群体、单体） */ 
            targetEnemy = true,
            activeSkillData = SkillModel.getSkillEffectObject(); /** 主动技能数据（结构必须存在，后续直接调用了事） */
        if (this.triggerActiveSkill(attackHeroData)) {
            // 触发主动技能
            let activeSkillId = this.getBattleHeroActiveSkillId(attackHeroData);
            activeSkillData = SkillModel.getSkillEffectData(activeSkillId);
            logger.Debug("TRIGGER_ACTIVE_SKILL: id=%d, data=%s", activeSkillId, JSON.stringify(activeSkillData));
        }

        // 根据技能目标获取守方参战随从（默认前排单体）
        [defendHeroLis, targetEnemy] = this.getDefendHeroData(attackHeroData['isEnemy'], activeSkillData['target']);

        // 已获取守方列表技能效果对其进行计算（用于保持一轮的效果持久场景）
        this.computeSkillEffect(attackHeroData, defendHeroLis, activeSkillData, targetEnemy);

        if (targetEnemy) {
            // 对敌方技能
            let hitFlag = false;
            for (let defendHeroData of defendHeroLis) {
                if (defendHeroLis.length === 1) {
                    // 守方是单体需要设置攻击位置
                    this.setBattleHeroValue(attackHeroData['pos'], 'attack_pos', defendHeroData['pos'], attackHeroData['isEnemy']);
                }
                
                // 计算每个守方随从损益
                var flag = this.computeSignleHeroAttrs(attackHeroData, defendHeroData, activeSkillData);
                if (flag && !hitFlag) {
                    hitFlag = true;
                }
            }

            //if (hitFlag) {
                // 有命中且无释放技能回合需要增加攻方士气值
                this.computeBattleHeroEnergy(attackHeroData);
            //}
        }
    }

    // 模拟战斗
    doFighting()
    {
        // 加入开始上阵的初始帧
        this.addBattleKeyFrame(this.createBattleKeyFrame());

        let safeCount = BATTLE_COUNT_MAX; // 总回合数（用于解决无法结束战斗的特殊场景出现）
        while (safeCount--) {
            let [attackHeroData, round] = this.getCurrentAttackHeroData(); // 获取攻方随从数据
            if (!this.checkBattleHeroDead(attackHeroData)) {
                // 计算战斗
                this.computeFighting(attackHeroData);

                // 创建并加入战斗帧
                this.addBattleKeyFrame(this.createBattleKeyFrame());

                // 加入战斗先攻索引
                this.m_BattleIndex.push(attackHeroData);
            }

            if (round === 0) {
                // 一轮结束需要清理技能效果叠加数据
                this.clearSkillEffectData();
            }
            
            // 判断战斗是否结束或者整个攻方随从都阵亡
            if (this.computeBattleOver() || this.checkAttackQueueOver())
                break;
        }

        // 计算剩余血量百分比（用于副本评分）
        this.computeBattleHpRate();
    }

    isBattleWin()
    {
        return this.m_isWin;
    }

    toResults()
    {
        return {
            data: {
                playRecord: this.m_keyFrames, // 战斗帧序列
                battleIndex: this.m_BattleIndex, // 战斗先攻索引
            },
            result: {
                win: this.m_isWin, // 输赢
            }
        }
    }
}

module.exports = {
    Battle
}