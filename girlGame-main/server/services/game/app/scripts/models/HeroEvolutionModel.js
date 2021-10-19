/**
 * 随从升星表
 */
const { logger } = require('./../../app');
const {
    HERO_EVOLUTION,
    INDEX_HERO_EVOLUTION_HERO_ID
} = require('./../../../datas/hero_evolution');
const ModelHelper = require('./ModelHelper');
const HeroInfoModel = require('./HeroInfoModel');

class HeroEvolutionModel
{
    static getEvolutionData(heroId, currStar)
    {
        let ids = INDEX_HERO_EVOLUTION_HERO_ID[heroId],
            evolutionData = null;
        if ("undefined" === typeof ids) {
            logger.Warn("[HeroEvolutionModel.getEvolutionData] Cannot find index data: heroId=%d", heroId);
        } else if (currStar > ids.length) {
            logger.Warn("[HeroEvolutionModel.getEvolutionData] Evolution is great than max: heroId=%d, currStar=%d", heroId, currStar);
        } else {
            for (let id of ids) {
                if (HERO_EVOLUTION[id]['star_level'] === currStar) {
                    let HERO_EVOLUTION_NODE = HERO_EVOLUTION[id];
                    evolutionData = {
                        need_step: HERO_EVOLUTION_NODE['need_step'] ? HERO_EVOLUTION_NODE['need_step'] : 0,
                        cost_items: ModelHelper.getItemListByDebris([heroId], [HERO_EVOLUTION_NODE['debris_num']]),
                        properties: ModelHelper.getHeroProperties(HERO_EVOLUTION_NODE['propertiesid'], HERO_EVOLUTION_NODE['properties'])
                    }
                    break;
                }
            }
        }

        return evolutionData;
    }

    // 获取随从碎片数
    static getDebrisNum(heroId)
    {
        let currStar = HeroInfoModel.getHeroInitStar(heroId),
            ids = INDEX_HERO_EVOLUTION_HERO_ID[heroId];

        for (let id of ids) {
            if (HERO_EVOLUTION[id]['star_level'] === currStar) {
                return HERO_EVOLUTION[id]['debris_num'] ? HERO_EVOLUTION[id]['debris_num'] : 1;
            }
        }

        return 1;
    }
}

module.exports = HeroEvolutionModel;