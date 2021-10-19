/**
 * 服装表
 */
const { logger } = require('./../../app');
const { ACCESSORIE } = require('./../../../datas/accessorie');

class AccessorieModel
{
    static TYPES()
    {
        return {
            HAIR: 1, // 发型
            FACE: 2, // 妆容
            CLOTHING: 3, // 服装
            ACCESSORY: 4, // 配饰
            SOCK: 5, // 袜子
            SHOE: 6, // 鞋子
            SUIT: 7 // 套装
        }
    }

    static SUB_TYPES()
    {
        return {
            CLOTHING_TOP: 1, // 上装
            CLOTHING_BOTTOM: 2, // 下装
            CLOTHING_DRESS: 3, // 裙子
            ACCESSORY_HEAD: 4, // 头饰
            ACCESSORY_NECK: 5, // 颈饰
            ACCESSORY_EAR: 6, // 耳饰
            ACCESSORY_WIDGET: 7, // 挂饰
            ACCESSORY_HAND: 8, // 手饰
            ACCESSORY_INHAND: 9 // 手持
        }
    }

    // 获取全部服装ID列表（临时）
    static getAccessorieIds()
    {
        let lis = [],
            ids = Object.keys(ACCESSORIE);
        
        for (let id of ids) {
            lis.push({ id: Number(id), count: 1 });
        }

        return lis;
    }

    // 获取服装类型（包含类型和子类型）
    static getTypes(accessorieId)
    {
        if (accessorieId <= 0)
            return [0, 0];

        let accessorieData = ACCESSORIE[accessorieId];
        if ("undefined" !== typeof accessorieData) {
            return [accessorieData['first_type'], accessorieData['second_type']];
        } else {
            logger.Warn("[AccessorieModel.getTypes] Cannot find accessorie data: accessorieId=%d", accessorieId);
            return [0, 0];
        }
    }

    /*static getStyleData(styleObj, accessorieId)
    {
        let accessorieData = ACCESSORIE[accessorieId];
        if ("undefined" !== typeof accessorieData) {
            let styleIds = accessorieData['style_id'],
                styleNums = accessorieData['style_num'];

            for (let i = 0; i < styleIds.length; i++) {
                styleObj[styleIds[i]] += styleNums[i];
            }
        }

        return styleObj;
    }*/

    static getStyleScoreByRatingData(styleObj, accessorieId, ratingData)
    {
        const getWeightValue = (styleId) => {
            if ("number" === typeof ratingData[styleId]) {
                return ratingData[styleId] > 0 ? ratingData[styleId] : 1;
            } else {
                return 1;
            }
        }

        let accessorieData = ACCESSORIE[accessorieId];
        if ("undefined" !== typeof accessorieData) {
            let styleIds = accessorieData['style_id'],
                styleNums = accessorieData['style_num'];

            for (let i = 0; i < styleIds.length; i++) {
                styleObj[styleIds[i]] += styleNums[i] * getWeightValue(styleIds[i]);
            }
        }

        return styleObj;
    }
}

module.exports = AccessorieModel;