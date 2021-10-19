const { logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('../../com/wrappers');
const { Quest } = require('./../controllers/QuestController');
const { Player } = require('./../controllers/PlayerController');
const { Item } = require('./../controllers/ItemController');
const { Hero } = require('./../controllers/HeroController');
const { Npc } = require('./../controllers/NpcController');
const { Battle } = require('./../controllers/BattleController');

/**
 * @api {1050} 关卡战斗
 * @apiName QuestBattle
 * @apiGroup Quest
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function QuestBattle(req, res)
{
    function doQuestUnlockData(questId, taskId, battlePtr, callback)
    {
        let quest = new Quest(req.uuid); // 载入玩家副本数据
        quest.load(() => {
            let battleStar = Quest.getBattleRatingStar(taskId, battlePtr.getHpRate());
            let newQuestNode = { id: questId, star: battleStar, curStar: battleStar, isFirst: true };
            if (!quest.checkQuestUnlock(questId)) {
                quest.addUnlockData(newQuestNode);
                quest.save(() => { // 保存玩家副本数据
                    callback(newQuestNode, battleStar);
                });
            } else {
                newQuestNode['isFirst'] = false;
                callback(newQuestNode, battleStar);
            }
        });
    }

    const COST_VITALITY_MAX = 5;

    var responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);

    let taskData = Quest.getTaskData(req.body.questId);
    if ('questId' in req.body && 'number' === typeof req.body.questId && taskData) {
        if (Quest.isFightQuest(taskData['type'])) {
            // TODO: 判断解锁条件
            let [condRet, condErrCode] = Quest.verifyUnlockConditon(req.body.questId);
            if (condRet) { 
                let player = new Player(req.openid);
                player.load(() => {
                    // 判断体力
                    if (true) {
                    //if (player.checkVitality(COST_VITALITY_MAX)) {
                        // 获取己方上阵数据
                        let p1 = new Hero(req.uuid);
                        p1.loadAll(() => {
                            if (p1.checkEmbattle()) {
                                // 获取敌方NPC数据
                                let npcEmbattle = Npc.getEmbattle(taskData['id']),
                                    npc = new Npc(npcEmbattle);

                                let battle = new Battle();
                                battle.createPVE(p1, p1.getEmbattle(), npc, npcEmbattle);
                                battle.doFighting();

                                let retData = { 
                                    battle: battle.toResults()
                                };
                                // 关卡解锁数据处理
                                if (battle.isBattleWin()) {
                                    doQuestUnlockData(req.body.questId, taskData['id'], battle, (retQuestData, ratingStar) => {
                                        // 扣除体力
                                        player.costVitality(COST_VITALITY_MAX);

                                        retData['quest'] = { info: [retQuestData] };

                                        // 获得通过奖励
                                        let [bonusData, retBonusData] = Quest.getAwards(taskData['id']);
                                    
                                        // 玩家奖励处理
                                        Player.doPlayerBonus(player, bonusData, retPlayerData => {
                                            if (retPlayerData) {
                                                retData['player'] = { info: retPlayerData };
                                            }
                                            
                                            // 道具奖励处理
                                            let itemPtr = new Item(req.uuid);
                                            Item.doItemBonus(itemPtr, bonusData, retItems => {
                                                if (retItems) {
                                                    retData['item'] = { info: retItems };
                                                }

                                                Object.assign(retData['battle']['result'], { star: ratingStar, reward: retBonusData }); // 合并奖励返回

                                                responseData.setData(retData);
                                                responseData.toPacket(packet => { res.send(packet); });

                                            });

                                        });
                                    });
                                } else {
                                    responseData.setData(retData);
                                    responseData.toPacket(packet => { res.send(packet); });
                                }
                            } else {
                                // 未布阵
                                responseData.setErrCode(errCodes.ERR_QUEST_BATTLE_NOT_EMBATTLE);
                                responseData.toPacket(packet => { res.send(packet); });
                            }
                        });
                    } else {
                        // 体力不足
                        responseData.setErrCode(errCodes.ERR_PLAYER_VITALITY_NOT_ENOUGH);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            } else {
                // 条件不满足
                responseData.setErrCode(condErrCode);
                responseData.toPacket(packet => { res.send(packet); });
            }
        } else {
            // 非战斗副本
            responseData.setErrCode(errCodes.ERR_QUEST_NOT_FIGHT);
            responseData.toPacket(packet => { res.send(packet); });
        }
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }

    /*let battle = new Battle();
    let p1 = new Hero(req.uuid);
    let p2 = new Hero('1318444852744163328');
    p1.loadAll(() => {
        p2.loadAll(() => {
            battle.createPVP(p1, p2);
            if (battle.checkEmbattle()) {
                battle.doFighting();
            }
            responseData.setData({ battle: battle.toResults() });
            responseData.toPacket(packet => {
                res.send(packet);
            });
        });
    });*/
}

/**
 * @api {1051} 副本剧情
 * @apiName QuestStoryRecord
 * @apiGroup Quest
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function QuestStoryRecord(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    let taskData = Quest.getTaskData(req.body.questId);
    if ('questId' in req.body && 'number' === typeof req.body.questId && taskData) {
        // 判断是否为剧情副本
        if (true) {
        //if (Quest.isStoryQuest(taskData.type)) {
            // TODO: 判断解锁条件
            let [condRet, condErrCode] = Quest.verifyUnlockConditon(req.body.questId);
            if (condRet) { 
                let quest = new Quest(req.uuid); // 载入玩家副本数据
                quest.load(() => {
                    if (!quest.checkQuestUnlock(req.body.questId)) {
                        let newQuestNode = { id: req.body.questId, star: 3, curStar: 3, isFirst: true };
                        quest.addUnlockData(newQuestNode);
                        quest.save(() => { // 保存玩家副本数据
                            responseData.setData({ quest: { info: [newQuestNode] } });
                            responseData.toPacket(packet => { res.send(packet); });
                        });
                    } else {
                        // 副本已解锁
                        responseData.setErrCode(errCodes.ERR_QUEST_REAL_UNLOCKED);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            } else {
                // 条件不满足
                responseData.setErrCode(condErrCode);
                responseData.toPacket(packet => { res.send(packet); });
            }
        } else {
            // 非剧情副本
            responseData.setErrCode(errCodes.ERR_QUEST_NOT_STORY);
            responseData.toPacket(packet => { res.send(packet); });
        }
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1052} 副本配装
 * @apiName QuestClothing
 * @apiGroup Quest
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function QuestClothing(req, res)
{
    const doBonus = (highFlag, bonusData, callback) => {
        if (highFlag) {
            let retData = {};
            let playerPtr = new Player(req.openid);
            playerPtr.load(() => {
                Player.doPlayerBonus(playerPtr, bonusData, (retPlayerData, flag) => {
                    if (flag) {
                        retData['player'] = { info: retPlayerData };
                    }
                    
                    let itemPtr = new Item(req.uuid);
                    Item.doItemBonus(itemPtr, bonusData, retItemData => {
                        if (retItemData) {
                            retData['item'] = { info: retItemData };
                        }

                        callback(retData);
                    });
                });
            });
        } else {
            callback(null);
        }
    }

    var responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    let taskData = Quest.getTaskData(req.body.questId);
    if ('questId' in req.body && 'number' === typeof req.body.questId && 
            'clothes' in req.body && req.body.clothes !== null && 'object' === typeof req.body.clothes && 
                taskData) {
        // 判断是否为配装副本
        if (Quest.isClothingQuest(taskData['type'])) {
            // TODO: 判断解锁条件
            let [condRet, condErrCode] = Quest.verifyUnlockConditon(req.body.questId);
            if (condRet) { 
                let quest = new Quest(req.uuid); // 载入玩家副本数据
                quest.load(() => {
                    // 配装副本评分
                    let accessorieIds = Object.values(req.body.clothes);
                    let [clothingStar, scoreTotal, styleScoreLis] = Quest.getClothingRatingStar(taskData['id'], accessorieIds);

                    let [bonusData, rBonusData] = Quest.getClothingAwards(taskData['id'], clothingStar);

                    if (!quest.checkQuestUnlock(req.body.questId)) {
                        let newQuestNode = { id: req.body.questId, star: clothingStar };
                        quest.addUnlockData(newQuestNode);
                        quest.save(() => { // 保存玩家副本数据
                            let newUnlockData = { id: req.body.questId, star: clothingStar, curStar: clothingStar, isFirst: true };
                            let retData = { quest: { info: [newUnlockData], result: { score: scoreTotal, styles: styleScoreLis } } };

                            doBonus(true, bonusData, retBonusData => {
                                if (retBonusData) {
                                    Object.assign(retData, retBonusData);
                                }

                                //retData['quest']['result']['reward'] = rBonusData;
                                if ('item' in retData) {
                                    Object.assign(retData['item'], { reward: rBonusData });
                                } else {
                                    retData['item'] = { reward: rBonusData };
                                }
                            
                                responseData.setData(retData);
                                responseData.toPacket(packet => { res.send(packet); });
                            });
                        });
                    } else {
                        // 最高星覆盖
                        let [newUnlockData, isHigh] = quest.setUnlockData(req.body.questId, clothingStar);
                        if (newUnlockData !== null) {
                            newUnlockData['curStar'] = clothingStar;
                            newUnlockData['isFirst'] = false;
                            quest.save(() => { // 保存玩家副本数据
                                let retData = { quest: { info: [newUnlockData], result: { score: scoreTotal, styles: styleScoreLis } } };
                                doBonus(isHigh, bonusData, retBonusData => {
                                    if (retBonusData) {
                                        Object.assign(retData, retBonusData);
                                    }

                                    if (isHigh) {
                                        if ('item' in retData) {
                                            Object.assign(retData['item'], { reward: rBonusData });
                                        } else {
                                            retData['item'] = { reward: rBonusData };
                                        }
                                        //retData['quest']['result']['reward'] = rBonusData;
                                    }

                                    responseData.setData(retData);
                                    responseData.toPacket(packet => { res.send(packet); });
                                });
                            });
                        } else {
                            responseData.toPacket(packet => { res.send(packet); });
                        }
                    }
                });
            } else {
                // 条件不满足
                responseData.setErrCode(condErrCode);
                responseData.toPacket(packet => { res.send(packet); });
            }
        } else {
            // 非配装副本
            responseData.setErrCode(errCodes.ERR_QUEST_NOT_CLOTHING);
            responseData.toPacket(packet => { res.send(packet); });
        }
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1053} 副本星级宝箱
 * @apiName QuestStarAward
 * @apiGroup Quest
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function QuestStarAward(req, res)
{
    var responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ("number" === typeof req.body.chapterId && 
            "number" === typeof req.body.pos && req.body.pos >= 1 && req.body.pos <= 3) {
        let quest = new Quest(req.uuid);
        quest.load(() => {
            // 判断是否已领取
            if (!quest.checkReward(req.body.chapterId, req.body.pos)) {
                // 判断星级宝箱是否可领取
                if (quest.checkNeedStar(req.body.chapterId, req.body.pos)) {
                    let [bonusData, retBonusData] = quest.getStarAwards(req.body.chapterId, req.body.pos);

                    if (bonusData !== null) {
                        let player = new Player(req.openid);
                        let retData = {};
                        player.load(() => {
                            // 玩家奖励处理
                            Player.doPlayerBonus(player, bonusData, (retPlayerData, flag) => {
                                if (flag) {
                                    retData['player'] = { info: retPlayerData };
                                }

                                // 道具奖励处理
                                let itemPtr = new Item(req.uuid);
                                Item.doItemBonus(itemPtr, bonusData, retItems => {
                                    if (retItems) {
                                        retData['item'] = { info: retItems, reward: retBonusData };
                                    } else {
                                        retData['item'] = { reward: retBonusData };
                                    }

                                    let awardRecordData = { id: req.body.chapterId, pos: req.body.pos };
                                    quest.addStarAwardData(awardRecordData);
                                    retData['starawards'] = { info: [awardRecordData] };
                                    //retData['starawards']['result'] = { reward: retBonusData };
                                    quest.save(() => {
                                        responseData.setData(retData);
                                        responseData.toPacket(packet => { res.send(packet); });
                                    });
                                });
                            });
                        });
                    } else {
                        // 无法获取宝箱数据参数异常
                        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                } else {
                    // 星级宝箱条件未满足
                    responseData.setErrCode(errCodes.ERR_QUEST_STAR_AWARD_NEED_STAR_LIMITED);
                    responseData.toPacket(packet => { res.send(packet); }); 
                }
            } else {
                // 星级宝箱已领取
                responseData.setErrCode(errCodes.ERR_QUEST_STAR_AWARD_GETED);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

module.exports = {
    QuestBattle,
    QuestStoryRecord,
    QuestClothing,
    QuestStarAward
}