const { logger } = require('./../../app');
const { DataHelper } = require('./../../com/helpers');
const HeroInfoModel = require('./../models/HeroInfoModel');
const GachaModel = require('./../models/GachaModel');

const GACHA_SINGLE_BAODI_COUNT = 10; // 抽卡保底次数

class GachaController
{
    static getCachaResults(player_id, count, callback)
    {
        // 随机一个橙色随从
        const getOrangeHeroId = () => {
            let orangeHeroIds = HeroInfoModel.getHeroIdsByStar(HERO_ORANGE_STAR);
            return orangeHeroIds[Math.floor(Math.random() * orangeHeroIds.length)]; // 随机出一个橙色随从
        }

        const HERO_ORANGE_STAR = 11;  // 随从橙色星级

        let heroIds = GachaModel.randGacha(count);
        if (heroIds.length === 0) {
            logger.Warn("[GachaController.getCachaResults] Cannot random a hero in gacha: count=%d, heroIds=[]", count);
            callback(heroIds, 0);
        } else {
            if (count === 1) {
                // 单抽（需要计数，第十次必出橙色value==11）
                DataHelper.getHashValue("temporary_keys:" + player_id, "GACHA_SINGLE_COUNT", count => {
                    if (isNaN(count)) count = 0;
                    
                    count += 1;
                    if (count === GACHA_SINGLE_BAODI_COUNT) {
                        DataHelper.setHashValue("temporary_keys:" + player_id, { GACHA_SINGLE_COUNT: 0 }, () => {
                            // 判断是否为橙色随从
                            if (HeroInfoModel.getHeroInitStar(heroIds[0]) !== HERO_ORANGE_STAR) {
                                // 非橙色随从但已触发保底
                                heroIds[0] = getOrangeHeroId();
                            }

                            callback(heroIds, GACHA_SINGLE_BAODI_COUNT - count);
                        });
                    } else {
                        DataHelper.incrHashValue("temporary_keys:" + player_id, "GACHA_SINGLE_COUNT", 1, ret => {
                            callback(heroIds, GACHA_SINGLE_BAODI_COUNT - count);
                        });
                    }
                }, false);
            } else {
                // 十连抽（必定需要有橙色value==11）
                let find = false;
                for (let heroId of heroIds) {
                    if (HeroInfoModel.getHeroInitStar(heroId) === HERO_ORANGE_STAR) {
                        find = true;
                        break;
                    }
                }

                if (!find) {
                    // 未出橙色需要随机添加一个橙色随从
                    let orangeHeroId = getOrangeHeroId();
                    heroIds[Math.floor(Math.random() * heroIds.length)] = orangeHeroId; // 随机替换成橙色随从
                }

                callback(heroIds, 0);
            }
        }
    }

    static getSingleCount(player_id, callback)
    {
        DataHelper.getHashValue("temporary_keys:" + player_id, "GACHA_SINGLE_COUNT", count => {
            if (isNaN(count)) count = 0;
            callback(GACHA_SINGLE_BAODI_COUNT - count);
        });
    }
}

module.exports = {
    GachaController
}