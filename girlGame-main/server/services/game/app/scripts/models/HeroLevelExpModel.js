/**
 * 随从等级经验表
 */
const { logger } = require('./../../app');
const { HERO_LEVELEXP } = require('./../../../datas/hero_levelexp');

class HeroLevelExp
{
    /**
     * getNeedExpByLevel - 根据随从等级获取所需经验
     * @param {Number} level 随从经验
     */
    static getNeedExpByLevel(level)
    {
        let HeroLevelExpData = HERO_LEVELEXP[level];
        if ("undefined" === typeof HeroLevelExpData) {
            return 0;
        } else {
            let exp = HeroLevelExpData['exp'];
            return exp;
        }
    }

    /**
     * getLevelMax - 获取最大等级
     */
    static getLevelMax()
    {
        return (Object.keys(HERO_LEVELEXP).length + 1);
    }
}

module.exports = HeroLevelExp;