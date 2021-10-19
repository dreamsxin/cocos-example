/**
 * 随从信息表
 */
const { logger } = require('./../../app');
const { HERO_INFO, INDEX_HERO_INFO_INITIAL_STAR } = require('./../../../datas/hero_info');

class HeroInfoModel
{
    // 获取随从基础数据
    static getHeroInfoData(heroId)
    {
        let heroInfoData = HERO_INFO[heroId];
        if ("undefined" === typeof heroInfoData) {
            logger.Warn("Cannot find hero info data: heroId=%d", heroId);
            return null;
        } else {
            return {
                star: heroInfoData['initial_star'],
                type: heroInfoData['here_type'],
                occupation: heroInfoData['here_occupation'],
                occupation_lv: heroInfoData['occupation'],
                skill: heroInfoData['skill']
            }
        }
    }

    // 获取随从初始星级
    static getHeroInitStar(heroId)
    {
        let heroInfoData = HERO_INFO[heroId], init_star = 0;
        if ("undefined" !== typeof heroInfoData) {
            init_star = heroInfoData['initial_star'];
        }

        return init_star;
    }

    // 获取随从列表根据星级
    static getHeroIdsByStar(star)
    {
        let ids = INDEX_HERO_INFO_INITIAL_STAR[star];
        return "undefined" === typeof ids ? [] : ids;
    }

    // 获取随从对应的碎片ID
    static getDebrisId(heroId)
    {
        let heroInfoData = HERO_INFO[heroId];
        if ("undefined" !== typeof heroInfoData) {
            return heroInfoData['hero_debris_id'];
        }

        return 0;
    }
}

module.exports = HeroInfoModel;