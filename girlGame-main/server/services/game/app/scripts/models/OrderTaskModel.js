/**
 * 订单任务表
 */
const player_def = require('./../../defs/player.def');
const { randomClassic } = require('./../../com/utility');
const { logger } = require('./../../app');
const { ORDER_TASK, INDEX_ORDER_TASK_LEVEL } = require('./../../../datas/order_task');

class OrderTaskModel
{
    // 获取订单所需材料
    static getNeedMaterialConfig(orderId)
    {
        let orderData = ORDER_TASK[orderId];
        if ("undefined" === typeof orderData || 
            !Array.isArray(orderData['require_id']) ||
                !Array.isArray(orderData['require_num'])) {
            logger.Warn("[OrderTaskModel.getNeedMaterialConfig] Cannot find data or field type failed: orderId=%s, require_id=%s, require_num=%s", 
                orderId, JSON.stringify(workData['require_id']), JSON.stringify(workData['require_num']));
            return [];
        } else {
            let lis = [];
            for (let i = 0; i < orderData['require_id'].length; i++) {
                lis.push({
                    id: orderData['require_id'][i],
                    count: orderData['require_num'][i] ? orderData['require_num'][i] : 0
                });
            }

            return lis;
        }
    }

    // 获取订单奖励
    static getBonusConfig(orderId)
    {
        let orderData = ORDER_TASK[orderId];
        if ("undefined" === typeof orderData) {
            logger.Warn("[OrderTaskModel.getBonusConfig] Cannot find data or field type failed: orderId=%s, reward_packet=%s", 
                orderId);
            return [];
        } else {
            return orderData['reward_packet'];
        }
    }

    // 根据订单星级随机订单列表
    static getRandomOrderListConfig(level, count=1)
    {
        let orderIds = INDEX_ORDER_TASK_LEVEL[level];
        if (Array.isArray(orderIds)) {
            const ORDER_STAR_PROBABILITY = player_def()['simulation']['order_star_probability'];
            let weightTotal = 0, randLis = [];
            for (let i = 0; i < ORDER_STAR_PROBABILITY.length; i++) {
                weightTotal += ORDER_STAR_PROBABILITY[i];
                randLis.push({
                    id: i + 1,
                    weight: ORDER_STAR_PROBABILITY[i]
                });
            }

            let lis = [], 
                limite = {}, 
                safeCounter = 99;
            // 订单ID不可重复
            do {
                var orderId = randomClassic(randLis, weightTotal);
                if (limite[orderId]) {
                    // 是重复的订单ID
                } else {
                    lis.push(orderId);
                    limite[orderId] = true;
                }

                if (lis.length >= count)
                    break;
                
            } while(--safeCounter);

            return lis;
        } else {
            logger.Warn("[OrderTaskModel.getRandomOrderListConfig] Cannot find index data: level=%d", level);
            return [];
        }
    }
}

module.exports = OrderTaskModel