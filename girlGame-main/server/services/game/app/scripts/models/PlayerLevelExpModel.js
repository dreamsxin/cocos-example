/**
 * 玩家等级经验表
 */
const { logger } = require('../../app');
const { MAINROLE_LEVEL } = require('./../../../datas/mainrole_level');

class PlayerLevelExp
{
    /**
     * getNeedExpByLevel - 根据随从等级获取所需经验
     * @param {Number} level 随从经验
     */
    static getNeedExpByLevel(level)
    {
        let HeroLevelExpData = MAINROLE_LEVEL[level];
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
        return (Object.keys(MAINROLE_LEVEL).length + 1);
    }
}

module.exports = PlayerLevelExp;