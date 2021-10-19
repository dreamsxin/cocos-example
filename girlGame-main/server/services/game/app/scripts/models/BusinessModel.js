/**
 * 模拟经营表
 */
const { logger } = require('./../../app');
const { BUSINESS } = require('./../../../datas/business');

class BusinessModel
{
    static TYPES()
    {
        return {
            LOOM: 1, // 织机
            DYER: 2, // 印染
            SKLKWORM: 3, // 蚕田
            LATHE: 4 // 车床
        }
    }

    static getTypeMaxConfig()
    {
        return Object.keys(BusinessModel.TYPES()).length;
    }

    // 获取产物配置
    static getProductConfig(type, level)
    {
        let workData = BUSINESS[level];
        if ("undefined" === typeof workData) {
            return null;
        } else {
            let field_name = null;
            if (type === BusinessModel.TYPES().LOOM) {
                // 织布机
                field_name = "loom";
            } else if (type === BusinessModel.TYPES().DYER) {
                // 印染
                field_name = "dyer";
            } else if (type === BusinessModel.TYPES().SKLKWORM) {
                // 蚕田
                field_name = "sklkworm";
            } else if (type === BusinessModel.TYPES().LATHE) {
                // 车床
                field_name = "lathe";
            }

            if (field_name === null || workData[field_name].length < 4) {
                logger.Warn("[BusinessModel.getProductConfig] The config field data wrong: %s=%s", 
                    field_name, JSON.stringify(workData[field_name]));
                return null;
            } else {
                let o = {};

                o['id']        = workData[field_name][0];
                o['time']      = workData[field_name][1] * 60 * 1000; // 单位为分需要转成毫秒
                o['count']     = workData[field_name][2];
                o['max_count'] = workData[field_name][3];

                return o;
            }
        }
    }

    // 获取订单等级配置
    static getOrderLevelConfig(level)
    {
        let workData = BUSINESS[level];
        if ("undefined" === typeof workData || "number" !== typeof workData['order_level']) {
            logger.Warn("[BusinessModel.getOrderLevelConfig] Cannot find data or field type failed: level=%s, order_level=%s", 
                level, workData['order_level']);
            return 0;
        } else {
            return workData['order_level'];
        }
    }
    
    // 获取升级所需素材配置
    static getUpgradeNeedMaterialConfig(level)
    {
        let workData = BUSINESS[level];
        if ("undefined" === typeof workData || 
            !Array.isArray(workData['material_id']) || 
                !Array.isArray(workData['material_num'])) {
            logger.Warn("[BusinessModel.getUpgradeNeedMaterialConfig] Cannot find data or field type failed: level=%s, material_id=%s, material_num=%s", 
                level, JSON.stringify(workData['material_id']), JSON.stringify(workData['material_num']));
            return [];
        } else {
            let lis = [];
            for (let i = 0; i < workData['material_id'].length; i++) {
                lis.push({ 
                    id: workData['material_id'][i], 
                    count: workData['material_num'][i] ? workData['material_num'][i] : 0
                });
            }

            return lis;
        }
    }

    // 获取升级所需官阶
    static getUpgradeNeedCareerConfig(level)
    {
        let workData = BUSINESS[level];
        if ("undefined" === typeof workData || "number" !== typeof workData['rank_id']) {
            logger.Warn("[BusinessModel.getUpgradeNeedCareerConfig] Cannot find data or field type failed: level=%s, rank_id=%s", 
                level, workData['rank_id']);
            return 0;
        } else {
            return workData['rank_id'];
        }
    }
}

module.exports = BusinessModel;