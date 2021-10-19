const util = require('util');
const data_models = require('./../../defs/data.models');
const { DataHelper } = require('./../../com/helpers');
const { logger } = require('./../../app');
const HeroInfoModel = require('./../models/HeroInfoModel');
const HeroLevelExpModel = require('./../models/HeroLevelExpModel');
const HeroPropertiesModel = require('./../models/HeroPropertiesModel');
const HeroStepModel = require('../models/HeroStepModel');
const HeroEvolutionModel = require('../models/HeroEvolutionModel');

class Hero
{
    constructor(playerId)
    {
        this.player_id_ = playerId;
        this.tblname_ = 'player_heros';
        this.data_ = null;
    }

    loadAll(callback)
    {
        DataHelper.getListValJSON(this.tblname_, { player_id: this.player_id_ }, results => {
            this.data_ = results;
            this.fieldToJSON();
            callback();
        });
    }

    saveAll(callback)
    {
        if (this.data_ !== null) {
            this.fieldToString();
            DataHelper.setListValJSON(this.tblname_, { player_id: this.player_id_ }, this.data_, ret => {
                callback(ret);
            });
        } else {
            callback(false);
        }
    }

    // 归类随从碎片和随从
    categoryDebrisAndHero(heroIds=[])
    {
        let debrisItemLis = [], heroLis = [], lis = [];
        for (let heroId of heroIds) {
            if (heroId === 0) 
                continue;

            if (this.checkHero(heroId)) {
                // 需要转成碎片
                let item = { id: HeroInfoModel.getDebrisId(heroId), count: HeroEvolutionModel.getDebrisNum(heroId) };
                debrisItemLis.push(item);
                lis.push({ id: heroId, count: item['count'] });
            } else {
                heroLis.push(heroId);
                lis.push({ id: heroId, count: 0 });
            }
        }

        return [debrisItemLis, heroLis, lis];
    }

    /**
     * create - 根据随从ID列表创建随从
     * @param {Array} heroIds 随从ID列表
     */
    create(heroIds=[])
    {
        if (this.data_ === null) this.data_ = {};
        for (let heroId of heroIds) {
        //heroIds.forEach(heroId => {
            var model = data_models[this.tblname_](),
                heroInfoData = HeroInfoModel.getHeroInfoData(heroId),
                heroPropertiesData = HeroPropertiesModel.getBasePropertiesData(heroId, model.level);
            model.player_id = this.player_id_;
            model.hero_id = heroId;
            if (heroId <= 1) {
                model.pos = heroId;
            }

            // 基础数据
            model.star = heroInfoData['star'];
            model.type = heroInfoData['type'];
            model.occupation = heroInfoData['occupation'];
            model.occupation_lv = heroInfoData['occupation_lv'];
            model.skills = heroInfoData['skill']; // 数组形式(保存需要转成字符串，载入需要转成数组)
            // 基础属性
            model.attr_base_atk = heroPropertiesData['atk'];
            model.attr_base_def = heroPropertiesData['def'];
            model.attr_base_hp = heroPropertiesData['hp'];
            model.attr_base_dex = heroPropertiesData['dex'];
            model.attr_base_critical = heroPropertiesData['critical'];
            model.attr_base_sta = heroPropertiesData['sta'];
            model.attr_base_acc = heroPropertiesData['acc'];
            model.attr_base_eva = heroPropertiesData['eva'];

            /*model['__v'] = SqlString.SQL_TYPES().INSERT;
            delete model['__mainkey'];*/
            //SqlString.markListSqlData(model, SqlString.SQL_TYPES().INSERT);
            DataHelper.markInsert(model);

            this.data_[model.hero_id] = model; // hero_id => hero_model

            if (model.star > 1) {
                // 星级不是初始星级需要计算升星属性值
                this.upHeroEvolutionByStar(heroId, 1, model.star);
            }

            this.computedHeroPower(heroId); // 计算战力
        //});
        }

        logger.Debug(this.toString());
    }

    /**
     * checkHero - 判断是否已有随从
     * @param {Number} heroId 随从ID
     */
    checkHero(heroId) {
        return (this.data_ !== null && "undefined" !== typeof this.data_[heroId]);
    }

    // ======================================================================= 随从GETTER/SETTER以下
    getHeroIds()
    {
        if (this.data_ !== null) {
            return Object.keys(this.data_);
        } else {
            return [];
        }
    }

    getLevel(heroId)
    {
        if (this.checkHero(heroId)) {
            return this.data_[heroId]['level'];
        } else {
            return 1;
        }
    }

    getDataAll()
    {
        let lis = [];
        let hero_ids = Object.keys(this.data_);
        for (let heroId of hero_ids) {
            lis.push(this.getData(heroId));
        }

        return lis;
    }

    getDataList(heroIds)
    {
        let lis = [];
        for (let heroId of heroIds) {
            lis.push(this.getData(heroId));
        }

        return lis;
    }

    getData(heroId)
    {
        let hero_fields = Object.keys(this.data_[heroId]),
            heroData = {};
        for (let field of hero_fields) {
            if (field.indexOf('__') === -1) {
                heroData[field] = this.data_[heroId][field];
            }
        }

        // =============================================== 新增字段临时处理
        if ("number" !== typeof heroData['step'])
            heroData['step'] = 0;

        if ("number" !== typeof heroData['pos']) {
            heroData['pos'] = 0;
        }

        if ("number" !== typeof heroData['power'])
            heroData['power'] = 0;
        // =============================================== 新增字段临时处理

        delete heroData['player_id'];
        delete heroData['status'];

        return heroData;
    }

    getExp(heroId)
    {
        return this.data_[heroId]['exp'] ? this.data_[heroId]['exp'] : 0;
    }

    checkLevelMax(heroId) {
        return this.data_[heroId]['level'] === HeroLevelExpModel.getLevelMax();
    }

    // 获取升级所需经验(所需经验 = 下一级所需经验 - 已有经验)
    getLevelUpNeedExp(heroId, playerLevel)
    {
        if (this.getLevel(heroId) < playerLevel) {
            let currExpVal = this.data_[heroId]['exp'] ? this.data_[heroId]['exp'] : 0;
            let needExpVal = HeroLevelExpModel.getNeedExpByLevel(this.data_[heroId]['level']);
            return (needExpVal - currExpVal);
        } else {
            return 0;
        }
    }

    getNeedExpLevel(level)
    {
        return HeroLevelExpModel.getNeedExpByLevel(level);
    }

    // 获取升级到最大等级所需经验
    getLevelUpMaxNeedExp(heroId, playerLevel)
    {
        if (this.getLevel(heroId) < playerLevel) {
            let currExpVal = this.data_[heroId]['exp'] ? this.data_[heroId]['exp'] : 0;
            let currLevel = this.data_[heroId]['level'];
            let HERO_LEVEL_MAX = playerLevel; //HeroLevelExpModel.getLevelMax();
            let needExpVal = 0;
            do {
                needExpVal += HeroLevelExpModel.getNeedExpByLevel(currLevel);
            } while (++currLevel < HERO_LEVEL_MAX);

            return (needExpVal - currExpVal);
        } else {
            return 0;
        }
    }

    getSkills(heroId)
    {
        if (this.checkHero(heroId)) {
            return this.data_[heroId]['skills'];
        } else {
            return [0, 0, 0];
        }
    }

    setSkills(heroId, newSkills)
    {
        this.data_[heroId]['skills'] = newSkills;
    }

    // 获取普攻技能
    getNormalSkillId(heroId)
    {
        if (this.checkHero(heroId)) {
            return this.data_[heroId]['skills'][0];
        } else {
            return 0;
        }
    }

    // 获取主动技能
    getActiveSkillId(heroId)
    {
        if (this.checkHero(heroId)) {
            return this.data_[heroId]['skills'][1];
        } else {
            return 0;
        }
    }

    // 获取被动技能
    getPassiveSkillId(heroId)
    {
        if (this.checkHero(heroId)) {
            return this.data_[heroId]['skills'][2];
        } else {
            return 0;
        }
    }

    // 精力
    getEnergy(heroId)
    {
        if ("undefined" === typeof this.data_[heroId]['energy']) {
            return 0;
        } else {
            return this.data_[heroId]['energy'];
        }
    }
    addEnergy(heroId, value)
    {
        if ("undefined" === typeof this.data_[heroId]['energy']) {
            this.data_[heroId]['energy'] = 0;
        }

        if (value > 0) {
            this.data_[heroId]['energy'] += value;
        }

        return this.data_[heroId]['energy'];
    }
    setEnergy(heroId, value)
    {
        if ("undefined" === typeof this.data_[heroId]['energy']) {
            this.data_[heroId]['energy'] = 0;
        }

        if (value >= 0) {
            this.data_[heroId]['energy'] = value;
        }
    }

    // 获取随从战力
    getHeroPower(heroId)
    {
        return this.data_[heroId]['power'];
    }

    // 计算随从战力（暂无公式）
    computedHeroPower(heroId)
    {
        this.data_[heroId]['power'] = this.getAttrAtk(heroId);
    }

    // 获取布阵战力
    getEmbattlePower()
    {
        let heroIds = Object.keys(this.data_), powerTotal = 0;
        for (let heroId of heroIds) {
            if (this.data_[heroId]['pos'] > 0) {
                powerTotal += this.data_[heroId]['power'];
            }
        }
        
        return powerTotal;
    }

    getAttrAtk(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_atk'] + 
                heroOne['attr_step_atk'] + 
                heroOne['attr_evolution_atk'];
        } else {
            return 0;
        }
    }

    getAttrDef(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_def'] + 
                heroOne['attr_step_def'] + 
                heroOne['attr_evolution_def'];
        } else {
            return 0;
        }
    }

    getAttrHp(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_hp'] + 
                heroOne['attr_step_hp'] + 
                heroOne['attr_evolution_hp'];
        } else {
            return 0;
        }
    }

    getAttrDex(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_dex'] + 
                heroOne['attr_step_dex'] + 
                heroOne['attr_evolution_dex'];
        } else {
            return 0;
        }
    }

    getAttrCritical(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_critical'] + 
                heroOne['attr_step_critical'] + 
                heroOne['attr_evolution_critical'];
        } else {
            return 0;
        }
    }

    getAttrSta(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_sta'] + 
                heroOne['attr_step_sta'] + 
                heroOne['attr_evolution_sta'];
        } else {
            return 0;
        }
    }

    getAttrAcc(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_acc'] + 
                heroOne['attr_step_acc'] + 
                heroOne['attr_evolution_acc'];
        } else {
            return 0;
        }
    }

    getAttrEva(heroId)
    {
        if (this.checkHero(heroId)) {
            let heroOne = this.data_[heroId];
            return heroOne['attr_base_eva'] + 
                heroOne['attr_step_eva'] + 
                heroOne['attr_evolution_eva'];
        } else {
            return 0;
        }
    }

    getHeroPos(heroId)
    {
        return this.data_[heroId]['pos'] ? this.data_[heroId]['pos'] : 0;
    }

    setHeroPos(heroId, pos)
    {
        this.data_[heroId]['pos'] = pos;
        DataHelper.markUpdate(this.data_[heroId]);
    }

    // 根据布阵位置获取随从ID
    getHeroIdByPos(pos)
    {
        let hero_ids = Object.keys(this.data_);
        for (let heroId of hero_ids) {
            if (this.data_[heroId]['pos'] === pos) {
                return heroId;
            }
        }

        return null;
    }

    // 获取随从布阵
    getEmbattle()
    {
        let embattle = [0, 0, 0, 0, 0, 0];
        let heroIds = Object.keys(this.data_);
        for (let heroId of heroIds) {
            let heroPos = this.getHeroPos(heroId);
            if (heroPos > 0) {
                embattle[heroPos-1] = heroId;
            }
        }
        
        return embattle;
    }

    // 验证布阵位置
    checkEmbattlePos(embattle)
    {
        for (let v of embattle) {
            if (isNaN(v['id']) || isNaN(v['pos']))
                return false;

            if (!this.checkHero(v['id']))
                return false;

            if (v['pos'] < 0 && v['pos'] > 6)
                return false;
        }

        return true;
    }

    // 判断是否有布阵
    checkEmbattle()
    {
        let heroIds = Object.keys(this.data_);
        for (let heroId of heroIds) {
            if (this.data_[heroId]['pos'] > 0) {
                return true;
            }
        }

        return false;
    }

    // 随从布阵
    toEmbattle(embattle)
    {
        let heroLis = [];
        
        for (let v of embattle) {
            this.data_[v['id']]['pos'] = v['pos'];

            DataHelper.markUpdate(this.data_[v['id']]);

            heroLis.push(this.getData(v['id']));
        }

        return heroLis;
    }
    // ======================================================================= 随从GETTER/SETTER以上

    // ======================================================================= 随从升级以下
    // 刷新基础属性值
    reloadBaseAttrs(heroId)
    {
        let heroBaseAttrData = HeroPropertiesModel.getBasePropertiesData(heroId, this.data_[heroId]['level']);
        this.data_[heroId]['attr_base_atk']      = heroBaseAttrData['atk'];
        this.data_[heroId]['attr_base_def']      = heroBaseAttrData['def'];
        this.data_[heroId]['attr_base_hp']       = heroBaseAttrData['hp'];
        this.data_[heroId]['attr_base_dex']      = heroBaseAttrData['dex'];
        this.data_[heroId]['attr_base_critical'] = heroBaseAttrData['critical'];
        this.data_[heroId]['attr_base_sta']      = heroBaseAttrData['sta'];
        this.data_[heroId]['attr_base_acc']      = heroBaseAttrData['acc'];
        this.data_[heroId]['attr_base_eva']      = heroBaseAttrData['eva'];

        this.computedHeroPower(heroId); // 重新计算战力
    }

    // 随从经验升级
    levelUpByExp(heroId, expValue)
    {
        if (this.checkHero(heroId)) {
            const HERO_LEVEL_MAX = HeroLevelExpModel.getLevelMax(); // 获取随从最大等级
            let currLevel = this.data_[heroId]['level'],
                expTotal = expValue + this.getExp(heroId);

            if (currLevel === HERO_LEVEL_MAX || expTotal <= 0) {
                return false; // 已是最大等级无法升级或传入经验问题
            } else {
                let isUpdated = false;
                while (expTotal >= HeroLevelExpModel.getNeedExpByLevel(currLevel) &&
                    HeroLevelExpModel.getNeedExpByLevel(currLevel) > 0 &&
                        currLevel < HERO_LEVEL_MAX) {
                    // 合计经验大于所需经验，可以升级
                    expTotal -= HeroLevelExpModel.getNeedExpByLevel(currLevel);
                    ++currLevel;
                    
                    isUpdated = true;
                }

                if (isUpdated) {
                    // 随从有升级
                    this.data_[heroId]['level'] = currLevel;
                    this.data_[heroId]['exp'] = expTotal;

                    // 根据等级刷新基础属性
                    this.reloadBaseAttrs(heroId);
                    
                    // SqlString.markListSqlData(this.data_[heroId], SqlString.SQL_TYPES().UPDATE);
                } else {
                    // 未升级加入到原先的经验值中
                    this.data_[heroId]['exp'] = expTotal;
                    //SqlString.markListSqlData(this.data_[heroId], SqlString.SQL_TYPES().UPDATE);
                }

                DataHelper.markUpdate(this.data_[heroId]);
            }
        } else {
            // 不存在指定随从
            logger.Warn("[Hero.levelUpByExp] Cannot find hero: playerId=%s, heroId=%d, expValue=%d", 
                this.player_id_, heroId, expValue);
            return false;
        }
    }

    // 获取随从升级后属性变化的数据
    getLevelUpResultData(heroId)
    {
        /*let resultData = {};
        resultData['hero_id']            = heroId;
        resultData['exp']                = this.data_[heroId]['exp'];
        resultData['level']              = this.data_[heroId]['level'];
        resultData['attr_base_atk']      = this.data_[heroId]['attr_base_atk'];
        resultData['attr_base_def']      = this.data_[heroId]['attr_base_def'];
        resultData['attr_base_hp']       = this.data_[heroId]['attr_base_hp'];
        resultData['attr_base_dex']      = this.data_[heroId]['attr_base_dex'];
        resultData['attr_base_critical'] = this.data_[heroId]['attr_base_critical'];
        resultData['attr_base_sta']      = this.data_[heroId]['attr_base_sta'];
        resultData['attr_base_acc']      = this.data_[heroId]['attr_base_acc'];
        resultData['attr_base_eva']      = this.data_[heroId]['attr_base_eva'];

        return resultData;*/

        return this.getData(heroId);
    }
    // ======================================================================= 随从升级以上

    // ======================================================================= 随从突破以下
    getHeroStepValue(heroId)
    {
        return this.data_[heroId]['step'] ? this.data_[heroId]['step'] : 0;
    }

    setHeroStepValue(heroId, value)
    {
        this.data_[heroId]['step'] = value;
    }

    reloadStepAttrs(heroId, stepData)
    {
        // 突破属性增加
        this.data_[heroId]['attr_step_atk']      += stepData['properties']['atk'];
        this.data_[heroId]['attr_step_def']      += stepData['properties']['def'];
        this.data_[heroId]['attr_step_hp']       += stepData['properties']['hp'];
        this.data_[heroId]['attr_step_dex']      += stepData['properties']['dex'];
        this.data_[heroId]['attr_step_critical'] += stepData['properties']['critical'];
        this.data_[heroId]['attr_step_sta']      += stepData['properties']['sta'];
        this.data_[heroId]['attr_step_acc']      += stepData['properties']['acc'];
        this.data_[heroId]['attr_step_eva']      += stepData['properties']['eva'];
        // 突破属性额外增加
        this.data_[heroId]['attr_step_atk']      += stepData['ext_properties']['atk'];
        this.data_[heroId]['attr_step_def']      += stepData['ext_properties']['def'];
        this.data_[heroId]['attr_step_hp']       += stepData['ext_properties']['hp'];
        this.data_[heroId]['attr_step_dex']      += stepData['ext_properties']['dex'];
        this.data_[heroId]['attr_step_critical'] += stepData['ext_properties']['critical'];
        this.data_[heroId]['attr_step_sta']      += stepData['ext_properties']['sta'];
        this.data_[heroId]['attr_step_acc']      += stepData['ext_properties']['acc'];
        this.data_[heroId]['attr_step_eva']      += stepData['ext_properties']['eva'];

        this.computedHeroPower(heroId); // 重新计算战力
    }

    getHeroStepData(heroId)
    {
        return HeroStepModel.getStepData(heroId, this.getHeroStepValue(heroId) + 1);
    }

    upHeroStep(heroId, stepData)
    {
        let currStepVal = this.getHeroStepValue(heroId);
        this.setHeroStepValue(heroId, currStepVal + 1); // 增加突破数

        // 增加精力
        this.addEnergy(heroId, stepData['ext_energy']);

        // 技能升级
        if (stepData['next_skill_id'] > 0) {
            let nextSKillId = stepData['next_skill_id'];
            let skills = this.getSkills(heroId);
            for (let i = 1; i < 3; i++) {
                if ((nextSKillId - skills[i]) === 1) {
                    skills[i] = nextSKillId;
                    break;
                }
            }
            this.setSkills(heroId, skills);
        }

        this.reloadStepAttrs(heroId, stepData);

        // 刷新突破属性（累计）
        //SqlString.markListSqlData(this.data_[heroId], SqlString.SQL_TYPES().UPDATE);
        DataHelper.markUpdate(this.data_[heroId]);
    }
    // 获取随从突破后属性变化的数据
    getStepUpResultData(heroId)
    {
        /*let resultData = {};
        resultData['hero_id']            = heroId;
        resultData['step']               = this.data_[heroId]['step'];
        resultData['attr_step_atk']      = this.data_[heroId]['attr_step_atk'];
        resultData['attr_step_def']      = this.data_[heroId]['attr_step_def'];
        resultData['attr_step_hp']       = this.data_[heroId]['attr_step_hp'];
        resultData['attr_step_dex']      = this.data_[heroId]['attr_step_dex'];
        resultData['attr_step_critical'] = this.data_[heroId]['attr_step_critical'];
        resultData['attr_step_sta']      = this.data_[heroId]['attr_step_sta'];
        resultData['attr_step_acc']      = this.data_[heroId]['attr_step_acc'];
        resultData['attr_step_eva']      = this.data_[heroId]['attr_step_eva'];

        return resultData;*/
        return this.getData(heroId);
    }
    // ======================================================================= 随从突破以上

    // ======================================================================= 随从升星以下
    getHeroStarValue(heroId)
    {
        return this.data_[heroId]['star'];
    }
    setHeroStarValue(heroId, value)
    {
        this.data_[heroId]['star'] = value;
    }
    reloadEvolutionAttrs(heroId, evolutionProperties)
    {
        this.data_[heroId]['attr_evolution_atk']      += evolutionProperties['atk'];
        this.data_[heroId]['attr_evolution_def']      += evolutionProperties['def'];
        this.data_[heroId]['attr_evolution_hp']       += evolutionProperties['hp'];
        this.data_[heroId]['attr_evolution_dex']      += evolutionProperties['dex'];
        this.data_[heroId]['attr_evolution_critical'] += evolutionProperties['critical'];
        this.data_[heroId]['attr_evolution_sta']      += evolutionProperties['sta'];
        this.data_[heroId]['attr_evolution_acc']      += evolutionProperties['acc'];
        this.data_[heroId]['attr_evolution_eva']      += evolutionProperties['eva'];

        this.computedHeroPower(heroId); // 重新计算战力
    }
    getHeroEvolutionData(heroId)
    {
        return HeroEvolutionModel.getEvolutionData(heroId, this.getHeroStarValue(heroId));
    }
    upHeroEvolution(heroId, evolutionProperties) {
        this.setHeroStarValue(heroId, this.getHeroStarValue(heroId) + 1);
        this.reloadEvolutionAttrs(heroId, evolutionProperties);
        //SqlString.markListSqlData(this.data_[heroId], SqlString.SQL_TYPES().UPDATE);

        DataHelper.markUpdate(this.data_[heroId]);
    }
    upHeroEvolutionByStar(heroId, currStar, nextStar)
    {
        for (let i = currStar; i < nextStar; i++) {
            let evolutionData = HeroEvolutionModel.getEvolutionData(heroId, i);
            this.reloadEvolutionAttrs(heroId, evolutionData['properties']);
        }
    }
    // 获取随从升星后属性变化的数据
    getStarUpResultData(heroId)
    {
        /*let resultData = {};
        resultData['hero_id']                 = heroId;
        resultData['star']                    = this.data_[heroId]['star'];
        resultData['attr_evolution_atk']      = this.data_[heroId]['attr_evolution_atk'];
        resultData['attr_evolution_def']      = this.data_[heroId]['attr_evolution_def'];
        resultData['attr_evolution_hp']       = this.data_[heroId]['attr_evolution_hp'];
        resultData['attr_evolution_dex']      = this.data_[heroId]['attr_evolution_dex'];
        resultData['attr_evolution_critical'] = this.data_[heroId]['attr_evolution_critical'];
        resultData['attr_evolution_sta']      = this.data_[heroId]['attr_evolution_sta'];
        resultData['attr_evolution_acc']      = this.data_[heroId]['attr_evolution_acc'];
        resultData['attr_evolution_eva']      = this.data_[heroId]['attr_evolution_eva'];

        return resultData;*/

        return this.getData(heroId);
    }
    // ======================================================================= 随从升星以上

    // 字段string转json
    fieldToJSON()
    {
        if (this.data_) {
            Object.keys(this.data_).forEach(heroId => {
                this.data_[heroId].skills = JSON.parse(this.data_[heroId].skills);
            });
        }
    }

    // 字段json转string
    fieldToString()
    {
        if (this.data_) {
            Object.keys(this.data_).forEach(heroId => {
                this.data_[heroId].skills = JSON.stringify(this.data_[heroId].skills);
            });
        }
    }

    toString()
    {
        return util.format("Hero: playerId=%s, data=%s", this.player_id_, JSON.stringify(this.data_));
    }
}

module.exports = {
    Hero
}