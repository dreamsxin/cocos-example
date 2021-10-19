const HeroInfoModel = require('./HeroInfoModel');

class ModelHelper
{
    // 获取随从属性结构
    static getHeroAttrObject()
    {
        return {
            atk: 0,
            def: 0,
            hp: 0,
            dex: 0,
            critical: 0,
            sta: 0,
            acc: 0,
            eva: 0
        };
    }

    // 获取随从属性（统一格式）
    static getHeroProperties(ids, properties)
    {
        let attrs = ModelHelper.getHeroAttrObject(), 
            propertiesVal;

        if (Array.isArray(ids) && Array.isArray(properties)) {
            ids.forEach((propertiesId, index) => {
                propertiesVal = properties[index];
                if (propertiesId === 1) {
                    // 攻击
                    attrs['atk'] = propertiesVal;
                } else if (propertiesId === 2) {
                    // 防御
                    attrs['def'] = propertiesVal;
                } else if (propertiesId === 3) {
                    // 气血
                    attrs['hp'] = propertiesVal;
                } else if (propertiesId === 4) {
                    // 敏捷
                    attrs['dex'] = propertiesVal;
                } else if (propertiesId === 5) {
                    // 会心
                    attrs['critical'] = propertiesVal;
                } else if (propertiesId === 6) {
                    // 韧性
                    attrs['sta'] = propertiesVal;
                } else if (propertiesId === 7) {
                    // 命中
                    attrs['acc'] = propertiesVal;
                } else if (propertiesId === 8) {
                    // 闪避
                    attrs['eva'] = propertiesVal;
                } else {
                    // Nothing
                }
            });
        }

        return attrs;
    }

    static getItemList(ids, nums)
    {
        let lis = [];
        if (Array.isArray(ids) && Array.isArray(nums)) {
            for (let i = 0; i < ids.length; i++) {
                var item_id = ids[i],
                item_count = nums[i];
            if ('number' === typeof item_id && item_id > 0 &&
                'number' === typeof item_count && item_count > 0) {
                    lis.push({
                        id: item_id,
                        count: item_count
                    });
                }
            }
        }

        return lis;
    }

    static getItemListByDebris(ids, nums)
    {
        let lis = [];

        for (let i = 0; i < ids.length; i++) {
            var item_id = HeroInfoModel.getDebrisId(ids[i]),
                item_count = nums[i];
            if ('number' === typeof item_id && item_id > 0 &&
                'number' === typeof item_count && item_count > 0) {
                lis.push({
                    id: item_id,
                    count: item_count
                });
            }
        }

        return lis;
    }
}

module.exports = ModelHelper;