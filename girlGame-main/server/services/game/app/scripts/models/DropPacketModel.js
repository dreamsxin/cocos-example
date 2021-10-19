/**
 * 掉落表
 */
const { logger } = require('./../../app');
const { DROP_PACKET } = require('./../../../datas/drop_packet');

class DropPacketModel
{
    static TYPES()
    {
        return {
            NONE: 0, // 不掉落
            EXP: 1, // 经验
            SILVER: 2, // 银两
            DIAMOND: 3, // 元宝
            ENERGY: 7 // 体力
        }
    }

    // 根据掉落ID获取道具列表
    static getItemsByDorpId(dropId)
    {
        let lis = [];
        let dropData = DROP_PACKET[dropId];
        if ("undefined" !== typeof dropData && dropData['packet'].length === 4) {
            let packet = dropData['packet'];
            if (packet[1] === packet[2]) {
                // 固定数量
                lis.push({ id: packet[0], count: packet[1] });
            } else {
                // TODO: 需要根据权重随机

            }
        } else {
            logger.Warn("[DropPacketModel.getItemByDorpId] Cannot find data or packet is wrong: dropId=%d", dropId);
        }

        return lis;
    }

    // 根据掉落ID列表获取道具列表
    static getItemsByDropIds(dropIds)
    {
        let lis = [];
        for (let dropId of dropIds) {
            lis = lis.concat(DropPacketModel.getItemsByDorpId(dropId));
        }
        return lis;
    }
}

module.exports = DropPacketModel;