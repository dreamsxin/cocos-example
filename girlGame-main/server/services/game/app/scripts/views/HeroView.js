const { logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('../../com/wrappers');
const { Hero } = require('./../controllers/HeroController');
const { Item } = require('./../controllers/ItemController');
const { Player } = require('../controllers/PlayerController');

/**
 * @api {1101} 随从列表（废弃）
 * @apiName HeroList
 * @apiGroup Hero
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function HeroList(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ('heroId' in req.body && 'number' === typeof req.body.heroId) {
        let hero = new Hero(req.uuid);
        hero.loadAll(() => {
            if (req.body.heroId === 0) {
                // 全部随从
                responseData.setData({ hero: { info: hero.getDataAll() } });
            } else {
                // 指定随从
                if (hero.checkHero(req.body.heroId)) {
                    responseData.setData({ hero: { info: hero.getData(req.body.heroId) } });
                } else {
                    responseData.setData({ heros: [] });
                }
            }
            responseData.toPacket(packet => { res.send(packet); });
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1102} 随从升级
 * @apiName HeroLevelUp
 * @apiGroup Hero
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function HeroLevelUp(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ('heroId' in req.body && 'number' === typeof req.body.heroId &&
            'state' in req.body && 'number' === typeof req.body.state) {
        let hero = new Hero(req.uuid);
        hero.loadAll(() => {
            if (hero.checkHero(req.body.heroId)) {
                if (hero.checkLevelMax(req.body.heroId)) {
                    // 随从等级已达上限
                    responseData.setErrCode(errCodes.ERR_HERO_LEVEL_IS_MAXIMUM);
                    responseData.toPacket(packet => { res.send(packet); });
                } else {
                    let playerPtr = new Player(req.openid);
                    playerPtr.load(() => {
                        let levelUpNeedExpVal;
                        if (req.body.state === 0) {
                            // 升级
                            levelUpNeedExpVal = hero.getLevelUpNeedExp(req.body.heroId, playerPtr.getLevel());
                        } else {
                            // 一键升级
                            levelUpNeedExpVal = hero.getLevelUpMaxNeedExp(req.body.heroId, playerPtr.getLevel());
                        }

                        if (levelUpNeedExpVal <= 0) {
                            // 当前所需经验达到所需经验说明随从未升级
                            responseData.setErrCode(errCodes.ERR_HERO_LEVEL_IS_MAXIMUM);
                            responseData.toPacket(packet => { res.send(packet); });
                        } else {
                            let item = new Item(req.uuid);
                            item.load(() => {
                                let [costItemLis, addExpTotal] = item.getCostExpItemListByNeedExp(levelUpNeedExpVal); // 消耗的道具及升级加入的经验值

                                //console.log("--------->>>", costItemLis, addExpTotal, levelUpNeedExpVal);
                                                            
                                if (costItemLis.length === 0) {
                                    // 道具不足
                                    responseData.setErrCode(errCodes.ERR_ITEM_NOT_ENOUGH);
                                    responseData.toPacket(packet => { res.send(packet); });
                                } else {
                                    // 随从升级
                                    let upExpVal = 0;
                                    if (req.body.state === 0) {
                                        upExpVal = addExpTotal;
                                    } else {
                                        upExpVal = addExpTotal > levelUpNeedExpVal ? levelUpNeedExpVal : addExpTotal;
                                    }
                                    hero.levelUpByExp(req.body.heroId, upExpVal);
                                    // 道具消耗
                                    let retCostItemLis =  item.costItems(costItemLis);

                                    let newHeroData = hero.getLevelUpResultData(req.body.heroId)

                                    hero.saveAll(() => {
                                        item.save(() => {
                                            responseData.setData({ hero: { info: [ newHeroData ] }, item: { info: retCostItemLis } });
                                            responseData.toPacket(packet => { res.send(packet); });
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
            } else {
                // 没有对应随从
                responseData.setErrCode(errCodes.ERR_HERO_NON_EXISTENT);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1103} 随从突破
 * @apiName HeroEvolutionUp
 * @apiGroup Hero
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function HeroEvolutionUp(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ('heroId' in req.body && 'number' === typeof req.body.heroId) {
        let hero = new Hero(req.uuid);
        hero.loadAll(() => {
            if (hero.checkHero(req.body.heroId)) {
                let heroStepData = hero.getHeroStepData(req.body.heroId);

                if (heroStepData !== null) {
                    if (hero.getLevel(req.body.heroId) >= heroStepData['need_level']) {
                        
                        let costData = Item.categoryItem(heroStepData['cost_items']);

                        // 扣除货币
                        let player = new Player(req.openid);
                        player.load(() => {
                            if (player.checkDiamond(costData['diamond'])) {
                                if (player.checkSilver(costData['silver'])) {
                                    if (player.checkGold(costData['gold'])) {
                                        // ====================
                                        let item = new Item(req.uuid);
                                        item.load(() => {
                                            if (item.checkItems(costData['items'])) {
                                                // 可升级
                                                // 消耗货币

                                                let isPlayerUpdate = false;
                                                if (costData['diamond'] > 0) {
                                                    player.costDiamond(costData['diamond']);
                                                    isPlayerUpdate = true;
                                                }
                                                if (costData['silver'] > 0) {
                                                    player.costSilver(costData['silver']);
                                                    isPlayerUpdate = true;
                                                }
                                                if (costData['gold'] > 0) {
                                                    player.costGold(costData['gold']);
                                                    isPlayerUpdate = true;
                                                }
                                                
                                                // 消耗物品
                                                let retCostItems = item.costItems(costData['items']);
                                                hero.upHeroStep(req.body.heroId, heroStepData);

                                                let newHeroData = hero.getStepUpResultData(req.body.heroId);

                                                // 成功保存数据
                                                hero.saveAll(() => {
                                                    player.save(() => {
                                                        item.save(() => {
                                                            let retData = { 
                                                                hero: { info: [newHeroData] }, 
                                                                item: { info: retCostItems } 
                                                            }

                                                            if (isPlayerUpdate) {
                                                                retData['player'] = { info: player.getData() };
                                                            }

                                                            responseData.setData(retData);
                                                            responseData.toPacket(packet => { res.send(packet); });
                                                        });
                                                    });
                                                });
                                            } else {
                                                // 道具不足
                                                responseData.setErrCode(errCodes.ERR_ITEM_NOT_ENOUGH);
                                                responseData.toPacket(packet => { res.send(packet); });
                                            }
                                        });
                                        // ====================
                                    } else {
                                        // 铜钱不足
                                        responseData.setErrCode(errCodes.ERR_PLAYER_GOLD_NOT_ENOUGH);
                                        responseData.toPacket(packet => { res.send(packet); });
                                    }  
                                } else {
                                    // 银两不足
                                    responseData.setErrCode(errCodes.ERR_PLAYER_SILVER_NOT_ENOUGH);
                                    responseData.toPacket(packet => { res.send(packet); });
                                }   
                            } else {
                                // 元宝不足
                                responseData.setErrCode(errCodes.ERR_PLAYER_DIAMOND_NOT_ENOUGH);
                                responseData.toPacket(packet => { res.send(packet); });
                            }
                        });
                    } else {
                        // 等级不足
                        responseData.setErrCode(errCodes.ERR_HERO_STEP_LEVEL_LIMITED);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                } else {
                    // 无法升级
                    responseData.setErrCode(errCodes.ERR_HERO_STEP_IS_MAXIMUM);
                    responseData.toPacket(packet => { res.send(packet); });
                }
            } else {
                // 没有对应随从
                responseData.setErrCode(errCodes.ERR_HERO_NON_EXISTENT);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1104} 随从升星
 * @apiName HeroStepUp
 * @apiGroup Hero
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function HeroStepUp(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ('heroId' in req.body && 'number' === typeof req.body.heroId) {
        let hero = new Hero(req.uuid);
        hero.loadAll(() => {
            if (hero.checkHero(req.body.heroId)) {
                let heroEvolutionData = hero.getHeroEvolutionData(req.body.heroId);
                
                if (heroEvolutionData !== null) {
                    if (hero.getHeroStepValue(req.body.heroId) >= heroEvolutionData['need_step']) {

                        let costData = Item.categoryItem(heroEvolutionData['cost_items']);

                        // 扣除货币
                        let player = new Player(req.openid);
                        player.load(() => {
                            if (player.checkDiamond(costData['diamond'])) {
                                if (player.checkSilver(costData['silver'])) {
                                    if (player.checkGold(costData['gold'])) {

                                        let item = new Item(req.uuid);
                                        item.load(() => {
                                            if (item.checkItems(costData['items'])) {
                                                // 可升级
                                                // 消耗货币
                                                let isPlayerUpdate = false;

                                                if (costData['diamond'] > 0) {
                                                    player.costDiamond(costData['diamond']);
                                                    isPlayerUpdate = true;
                                                }
                                                if (costData['silver'] > 0) {
                                                    player.costSilver(costData['silver']);
                                                    isPlayerUpdate = true;
                                                }
                                                if (costData['gold'] > 0) {
                                                    player.costGold(costData['gold']);
                                                    isPlayerUpdate = true;
                                                }
                                                // 消耗物品
                                                let retCostItems = item.costItems(costData['items']);
                                                hero.upHeroEvolution(req.body.heroId, heroEvolutionData['properties']);

                                                let newHeroData = hero.getStarUpResultData(req.body.heroId);

                                                // 成功保存数据
                                                hero.saveAll(() => {
                                                    player.save(() => {
                                                        item.save(() => {
                                                            let retData = {
                                                                hero: { info: [newHeroData] },
                                                                item: { info: retCostItems }
                                                            };

                                                            if (isPlayerUpdate) {
                                                                retData['player'] = { info: player.getData() };
                                                            }

                                                            responseData.setData(retData);
                                                            responseData.toPacket(packet => { res.send(packet); });
                                                        });
                                                    });
                                                });
                                            } else {
                                                // 道具不足
                                                responseData.setErrCode(errCodes.ERR_ITEM_NOT_ENOUGH);
                                                responseData.toPacket(packet => { res.send(packet); });
                                            }
                                        });
                                    } else {
                                        // 铜钱不足
                                        responseData.setErrCode(errCodes.ERR_PLAYER_GOLD_NOT_ENOUGH);
                                        responseData.toPacket(packet => { res.send(packet); });
                                    }  
                                } else {
                                    // 银两不足
                                    responseData.setErrCode(errCodes.ERR_PLAYER_SILVER_NOT_ENOUGH);
                                    responseData.toPacket(packet => { res.send(packet); });
                                }   
                            } else {
                                // 元宝不足
                                responseData.setErrCode(errCodes.ERR_PLAYER_DIAMOND_NOT_ENOUGH);
                                responseData.toPacket(packet => { res.send(packet); });
                            }
                        });
                    } else {
                        // 等级不足
                        responseData.setErrCode(errCodes.ERR_HERO_EVOLUTION_STEP_LEVEL_LIMITED);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                } else {
                    // 无法升级
                    responseData.setErrCode(errCodes.ERR_HERO_EVOLUTION_IS_MAXIMUM);
                    responseData.toPacket(packet => { res.send(packet); });
                }
            } else {
                // 没有对应随从
                responseData.setErrCode(errCodes.ERR_HERO_NON_EXISTENT);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1105} 随从换位
 * @apiName HeroPosition
 * @apiGroup Hero
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function HeroPosition(req, res)
{
    //const POS_LEVEL_LIMITED = [1, 1, 1, 5, 7, 9];

    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ('heroId' in req.body && 'number' === typeof req.body.heroId &&
            'pos' in req.body && 'number' === typeof req.body.pos && req.body.pos >= 1 && req.body.pos <= 6) {
        //let playerPtr = new Player(req.openid);
        //playerPtr.load(() => {
            //if (playerPtr.getLevel() >= POS_LEVEL_LIMITED[req.body.pos - 1]) {
                let hero = new Hero(req.uuid);
                hero.loadAll(() => {
                    if (hero.checkHero(req.body.heroId)) {
                        let retData = { hero: { info: [] }};

                        let otherSideHeroId = hero.getHeroIdByPos(req.body.pos);
                        if (otherSideHeroId === null) {
                            // 该布阵位置没有随从，直接设置
                            hero.setHeroPos(req.body.heroId, req.body.pos);
                            retData['hero']['info'].push(hero.getData(req.body.heroId));
                        } else {
                            // 该位置有布阵随从，进行互换位置
                            let heroPos = hero.getHeroPos(req.body.heroId);
                            hero.setHeroPos(req.body.heroId, req.body.pos);
                            hero.setHeroPos(otherSideHeroId, heroPos); // 将对方随从设置成我的布阵位置
                            retData['hero']['info'].push(hero.getData(req.body.heroId));
                            retData['hero']['info'].push(hero.getData(otherSideHeroId));
                        }

                        hero.saveAll(() => {
                            responseData.setData(retData);
                            responseData.toPacket(packet => { res.send(packet); });
                        });
                    } else {
                        // 随从不存在
                        responseData.setErrCode(errCodes.ERR_HERO_NON_EXISTENT);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            //} else {
            //    // 等级限制
            //    responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
            //    responseData.toPacket(packet => { res.send(packet); });
            //}
        //});
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1106} 随从布阵
 * @apiName HeroEmbattle
 * @apiGroup Hero
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function HeroEmbattle(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if (Array.isArray(req.body.embattle)) {
        let hero = new Hero(req.uuid);
        hero.loadAll(() => {
            if (hero.checkEmbattlePos(req.body.embattle)) {
                // 开始布阵
                let retHeroLis = hero.toEmbattle(req.body.embattle);
                hero.saveAll(() => {
                    let retData = { hero: { info: retHeroLis } };
                    responseData.setData(retData);
                    responseData.toPacket(packet => { res.send(packet); });
                });
            } else {
                responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

module.exports = {
    HeroList,
    HeroLevelUp,
    HeroEvolutionUp,
    HeroStepUp,
    HeroPosition,
    HeroEmbattle
}