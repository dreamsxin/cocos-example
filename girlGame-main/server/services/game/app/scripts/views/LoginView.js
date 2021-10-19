const jwt = require('jsonwebtoken');
const { PlayerClothes, PlayerWardrobe } = require('../controllers/DressController');
const { Hero } = require('../controllers/HeroController');
const { Item } = require('../controllers/ItemController');
const { serverConfig, serve, logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('./../../com/wrappers');
const { Player } = require('./../controllers/PlayerController');
const { Quest } = require('./../controllers/QuestController');

/**
 * @api {1001} 玩家登进
 * @apiName SignIn
 * @apiGroup Login
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 * @apiParam {String} token 玩家token
 * 
 * @apiSuccess {Object} body 返回数据
 */
function SignIn(req, res)
{
    var responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);

    if ('token' in req.body && "string" === typeof req.body.token) {
        jwt.verify(req.body.token, serverConfig.token.secretKey, (err, data) => {
            if (err) {
                responseData.setErrCode(errCodes.ERR_PLAYER_SIGNIN_TOKEN_VERIFY_FAILURE);
                responseData.toPacket(packet => { res.send(packet); });
            } else {
                let player = new Player(data.openid);
                player.load((playerData) => {
                    if (playerData !== null) {
                        // 已存在玩家数据
                        // 创建玩家session
                        serve.getSession().add(res, playerData.openid, playerData.player_id);
                        delete playerData.openid;
                        // 获取随从列表
                        let hero = new Hero(playerData.player_id);
                        hero.loadAll(() => {
                            // 获取道具列表
                            let item = new Item(playerData.player_id);
                            item.load(() => {
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
                    } else {
                        // 玩家不存在需要去创角
                        responseData.setErrCode(errCodes.ERR_PLAYER_NON_EXISTENT);
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

module.exports = {
    SignIn
}