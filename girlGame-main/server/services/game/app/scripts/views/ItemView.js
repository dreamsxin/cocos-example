const { logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('../../com/wrappers');
const { Item } = require('./../controllers/ItemController');

/**
 * @api {1151} 道具列表（废弃）
 * @apiName ItemList
 * @apiGroup Item
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function ItemList(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    let item = new Item(req.uuid);
    item.load(() => {
        responseData.setData({ items: item.toList() });
        responseData.toPacket(packet => { res.send(packet); });
    });
}

module.exports = {
    ItemList
}