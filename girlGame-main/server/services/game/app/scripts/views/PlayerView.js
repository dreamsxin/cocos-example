const jwt = require('jsonwebtoken');
const { serverConfig, serve, logger, errCodes } = require('../../app');
const { ResponseWrapper } = require('../../com/wrappers');
const PlayerDef = require('./../../defs/player.def');
const { Player } = require('./../controllers/PlayerController');
const { Hero } = require('./../controllers/HeroController');
const { Item } = require('./../controllers/ItemController');
const { Quest } = require('./../controllers/QuestController');
const { PlayerClothes, PlayerWardrobe } = require('../controllers/DressController');

/**
 * @api {1002} 玩家创角
 * @apiName PlayerCreate
 * @apiGroup Player
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 * @apiParam {String} token 玩家token
 * @apiParam {String} name 玩家名称
 * 
 * @apiSuccess {String} name 玩家名称
 * @apiSuccess {String} head 玩家头像
 * @apiSuccess {Number} level 玩家等级
 * @apiSuccess {Number} exp 玩家经验
 * @apiSuccess {Number} diamond 玩家钻石
 * @apiSuccess {Number} gold 玩家金币
 * @apiSuccess {Number} vitality_val 玩家体力
 * @apiSuccess {Number} battle_val 玩家战力
 * @apiSuccess {Number} career_lv 玩家官阶
 * @apiSuccess {Number} power_val 玩家权力
 * @apiSuccess {Number} popularity_val 玩家人气
 * @apiSuccess {Number} glamour_val 玩家魅力
 * @apiSuccess {Number} title_id 玩家称号
 * @apiSuccess {Number} hair_id 玩家发型
 * @apiSuccess {Number} face_id 玩家脸型
 * @apiSuccess {Number} body_id 玩家身体
 */
function PlayerCreate(req, res)
{
    var responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);

    if ('token' in req.body && "string" === typeof req.body.token && 
            'name' in req.body && "string" === typeof req.body.name && req.body.name.replace(/\s+/g, "").length > 0) {
        jwt.verify(req.body.token, serverConfig.token.secretKey, (err, data) => {
            if (err) {
                responseData.setErrCode(errCodes.ERR_PLAYER_SIGNIN_TOKEN_VERIFY_FAILURE);
                responseData.toPacket(packet => { res.send(packet); });
            } else {
                let player = new Player(data.openid);
                player.checkName(req.body.name, nameRet => {
                    if (!nameRet) {
                        player.newPlayer(req.body.name, (errCode, playerData) => {
                            if (errCode === 0) {
                                // 创角成功
                                // 生成session
                                serve.getSession().add(res, data.openid, playerData.player_id);
                                delete playerData.openid;
                                delete playerData.status;

                                const player_def = PlayerDef();
                                
                                // 创建玩家随从
                                let hero = new Hero(playerData.player_id);
                                hero.create(player_def['heros']);
                                hero.saveAll(() => {
                                    // 初期化背包
                                    let item = new Item(playerData.player_id);
                                    item.load(() => {
                                        item.addItems(player_def['items']);
                                        item.save(() => {
                                            let retData = { 
                                                player: { info: playerData }
                                            };
            
                                            let retHeroLis = hero.getDataAll();
                                            if (retHeroLis.length > 0) {
                                                retData['hero'] = { info: retHeroLis };
                                            }
            
                                            let retItemLis = item.toList();
                                            if (retItemLis.length > 0) {
                                                retData['item'] = { info: retItemLis };
                                            }

                                            // 副本数据
                                            let quest = new Quest(playerData.player_id);
                                            quest.load(() => {
                                                retData['quest'] = { info: quest.getUnlockData() };
                                                retData['starawards'] = { info: quest.getStarAwardData() };

                                                // 玩家服装
                                                let clothesPtr = new PlayerClothes(playerData.player_id);
                                                clothesPtr.load(() => {
                                                    retData['clothes'] = { info: clothesPtr.getData() };
                                                    // 玩家衣柜
                                                    let wardrobesPtr = new PlayerWardrobe(playerData.player_id);
                                                    wardrobesPtr.load(() => {
                                                        retData['wardrobes'] = { info: wardrobesPtr.getWardrobeData() };

                                                        responseData.setData(retData);
                                                        responseData.toPacket(packet => { res.send(packet); });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            } else {
                                // 创角失败
                                responseData.setErrCode(errCode);
                                responseData.toPacket(packet => { res.send(packet); });
                            }
                        });
                    } else {
                        // 玩家名称重复
                        responseData.setErrCode(errCodes.ERR_PLAYER_NAME_REPEAT);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1003} 玩家设置着装
 * @apiName PlayerDressSetting
 * @apiGroup Player
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 * @apiParam {Number} hair 发型
 * @apiParam {Number} makeup 妆容
 * @apiParam {Number} topClothe 上装 
 * @apiParam {Number} bottomClothe 下装
 * @apiParam {Number} fullClothe 上下套
 * @apiParam {Number} headwear 头饰
 * @apiParam {Number} neckwear 颈饰
 * @apiParam {Number} ear 耳饰
 * @apiParam {Number} hang 挂饰
 * @apiParam {Number} handwear 手饰 
 * @apiParam {Number} handheld 手持
 * @apiParam {Number} sock 袜子
 * @apiParam {Number} shoe 鞋子
 * 
 */
function PlayerDressSetting(req, res)
{
    var responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if (req.body !== null && "object" === typeof req.body) {
        // 判断妆容（妆容只能替换不能卸下）
        if (req.body.makeup > 0) {
            // 判断上下装（上下装必须一套）
            if ((req.body.topClothe === 0 && req.body.bottomClothe === 0) || 
                    (req.body.topClothe > 0 && req.body.bottomClothe > 0)) {
                let accessorieIds = Object.values(req.body),
                    clothesPtr = new PlayerClothes(req.uuid);
                clothesPtr.load(() => {
                    clothesPtr.setClothes(accessorieIds);

                    if (req.body.topClothe === 0 && req.body.bottomClothe === 0 || req.body.fullClothe > 0) {
                        clothesPtr.clearTopAndBottomClothe();
                    } else if (req.body.topClothe > 0 && req.body.bottomClothe > 0) {
                        clothesPtr.clearFullClothe();
                    }

                    clothesPtr.save(() => {
                        responseData.setData({ clothes: { info: clothesPtr.getData() } });
                        responseData.toPacket(packet => { res.send(packet); });
                    });
                });
            } else {
                // 上下套不统一
                responseData.setErrCode(errCodes.ERR_PLAYER_CLOTHING_DRESS_NOT_FULL);
                responseData.toPacket(packet => { res.send(packet); });
            }
        } else {
            // 无法卸下妆容
            responseData.setErrCode(errCodes.ERR_PLAYER_CLOTHING_FACE_NOT_UNLOAD);
            responseData.toPacket(packet => { res.send(packet); });
        }
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

module.exports = {
    PlayerCreate,
    PlayerDressSetting
}