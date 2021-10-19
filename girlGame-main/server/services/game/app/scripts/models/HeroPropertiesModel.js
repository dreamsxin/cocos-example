/**
 * 随从属性表
 */
const { logger } = require('./../../app');
const { 
    HERO_PROPERTIES, 
    INDEX_HERO_PROPERTIES_NAME_ID 
} = require('./../../../datas/hero_properties');
const ModelHelper = require('./ModelHelper');

class HeroPropertiesModel
{
    /**
     * getBasePropertiesData - 获取随从基础属性数据
     * @param {Number} heroId 随从ID
     * @param {Number} level 随从等级
     */
    static getBasePropertiesData(heroId, level)
    {
        let ids = INDEX_HERO_PROPERTIES_NAME_ID[heroId];
        if ("undefined" === typeof ids) {
            logger.Warn("Cannot find hero properties indexs: heroId=%d", heroId);
            return null;
        } else {
            var id, heroPropertiesData = null;
            for (let i = 0; i < ids.length; i++) {
                id = ids[i];
                heroPropertiesData = HERO_PROPERTIES[id];
                if ("undefined" === typeof heroPropertiesData) {
                    logger.Warn("Cannot find hero properties data: heroId=%d, id=%d", heroId, id);
                    return null;
                } else {
                    if (heroPropertiesData['level'] === level) {
                        // Find the data by level
                        break;
                    }
                }
            }

            if (heroPropertiesData !== null) {
                return ModelHelper.getHeroProperties(heroPropertiesData['propertiesid'], 
                    heroPropertiesData['properties']);
            } else {
                return ModelHelper.getHeroAttrObject();
            }
        }
    }
}

module.exports = HeroPropertiesModel;