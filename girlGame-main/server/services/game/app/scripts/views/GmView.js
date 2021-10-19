const { logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('../../com/wrappers');
const { Item } = require('./../controllers/ItemController');

/**
 * @api {9001} GM增加道具
 * @apiName GmAddItem
 * @apiGroup GM
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function GmAddItem(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if (Array.isArray(req.body.items)) {
        let item = new Item(req.body.playerId);
        item.load(() => {
            item.addItems(req.body.items);
            item.save(() => {
                responseData.setData({ items: item.toList() });
                responseData.toPacket(packet => { res.send(packet); });
            });
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

module.exports = {
    GmAddItem
}