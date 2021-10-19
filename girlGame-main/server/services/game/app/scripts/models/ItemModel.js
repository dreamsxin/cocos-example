/**
 * 道具表
 */
const { logger } = require('./../../app');
const {
    ITEM
} = require('./../../../datas/item');

class ItemModel
{
    static ITEM_TYPES() {
        return {
            RESOURCE: 1, // 资源类（货币、经验）
            EXPPILL: 2, // 经验丹类
        }
    }

    static checkCurrencyItem(itemId)
    {
        let ITEM_NODE = ITEM[itemId];
        if ("undefined" === typeof ITEM_NODE) {
            logger.Warn("[ItemModel.checkCurrencyItem] Cannot find item data: itemId=%d", itemId);
            return false;
        } else {
            return ITEM_NODE['type'] === ItemModel.ITEM_TYPES().RESOURCE;
        }
    }

    static getExpItemEffectValue(itemId)
    {
        let ITEM_NODE = ITEM[itemId];
        if ("undefined" === typeof ITEM_NODE) {
            logger.Warn("[ItemModel.checkExpPillItem] Cannot find item data: itemId=%d", itemId);
            return null;
        } else {
            if (ITEM_NODE['type'] === ItemModel.ITEM_TYPES().EXPPILL) {
                return ITEM_NODE['num'];
            } else {
                return null;
            }
        }
    }
}

module.exports = ItemModel;