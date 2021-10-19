const { logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('../../com/wrappers');
const { Hero } = require('./../controllers/HeroController');
const { Item } = require('./../controllers/ItemController');
const { GachaController } = require('./../controllers/GachaController');

/**
 * @api {1201} 抽卡（单抽和十连抽）
 * @apiName GachaResult
 * @apiGroup Gacha
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function GachaResult(req, res)
{
    let costItemLis = [{ id: 31, count: req.body.count }];

    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ("number" === typeof req.body.count && 
            (req.body.count === 0 || req.body.count === 1 || req.body.count === 10)) {
        if (req.body.count === 0) {
            GachaController.getSingleCount(req.uuid, remainBaodiCount => {
                let retData = { drawCard: { info: { count: remainBaodiCount } } };
                responseData.setData(retData);
                responseData.toPacket(packet => { res.send(packet); });
            });
        } else {
            let item = new Item(req.uuid);
            item.load(() => {
                if (item.checkItems(costItemLis)) {
                    let retItemLis = item.costItems(costItemLis); // 消耗抽奖道具
                    GachaController.getCachaResults(req.uuid, req.body.count, (bonusHeroIds, remainBaodiCount) => {
                        let hero = new Hero(req.uuid);
                        hero.loadAll(() => {
                            let [debrisItemLis, heroIds, drawCardLis] = hero.categoryDebrisAndHero(bonusHeroIds);

                            let retData = {};

                            retItemLis = retItemLis.concat(item.addItems(debrisItemLis)); // 增加转换的随从碎片

                            if (heroIds.length > 0) {
                                hero.create(heroIds); // 创建新随从
                                retData['hero'] = { info: hero.getDataList(heroIds) };
                            }
                            
                            retData['item'] = { info: retItemLis };

                            retData['drawCard'] = { info: { hero: drawCardLis } };
                            //if (req.body.count === 1) {
                                retData['drawCard']['info']['count'] = remainBaodiCount;
                            //}

                            hero.saveAll(() => {
                                item.save(() => {
                                    responseData.setData(retData);
                                    responseData.toPacket(packet => { res.send(packet); });
                                });
                            });
                        });
                    });
                } else {
                    // 道具不足
                    responseData.setErrCode(errCodes.ERR_ITEM_NOT_ENOUGH);
                    responseData.toPacket(packet => { res.send(packet); });
                }
            });
        }
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

module.exports = {
    GachaResult
}