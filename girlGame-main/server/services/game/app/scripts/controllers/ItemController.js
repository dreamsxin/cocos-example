const util = require('util');
const data_models = require('./../../defs/data.models');
const { DataHelper } = require('./../../com/helpers');
const { logger } = require('./../../app');
const ItemModel = require('./../models/ItemModel');
const item = require('../../../datas/item');

const ITEM_OVERLAP_COUNT_MAX = 999; // 装备叠加上限（新增：堆叠达上限不需要加入背包）

class Item
{
    constructor(playerId)
    {
        this.player_id_ = playerId;
        this.tblname_ = "player_items";
        this.data_ = null;
    }

    load(callback)
    {
        DataHelper.getListValJSON(this.tblname_, { player_id: this.player_id_ }, results => {
            this.data_ = results;
            callback();
        });
    }

    save(callback)
    {
        if (this.data_ !== null) {
            logger.Debug(this.toString());
            DataHelper.setListValJSON(this.tblname_, { player_id: this.player_id_ }, this.data_, ret => {
                callback(ret);
            });
        } else {
            callback(false);
        }
    }

    check()
    {
        return this.data_ !== null;
    }

    static doItemBonus(ItemPtr, bonusData, callback)
    {
        if (bonusData['items'].length > 0) {
            ItemPtr.load(() => {
                let ret_add_items = ItemPtr.addItems(bonusData['items']);
                ItemPtr.save(() => {
                    callback(ret_add_items);
                });
            });
        } else {
            callback(null);
        }
    }

    // 保留有效的物品、货币等
    static toValidItem(data)
    {
        let validData = {}, fields = Object.keys(data);
        for (let field of fields) {
            if ("number" === typeof data[field]) {
                // number
                if (data[field] > 0) validData[field] = data[field];
            } else {
                // array
                if (data[field].length > 0) validData[field] = data[field];
            }
        }

        return validData;
    }

    // 分类道具、货币等
    static categoryItem(items)
    {
        let data = {
            diamond: 0,
            silver: 0,
            gold: 0,
            exp: 0,
            items: []
        }

        for (let item of items) {
            if (item.id === 1) {
                // 元宝
                data.diamond = item.count;
            } else if (item.id === 2) {
                // 银两
                data.silver = item.count;
            } else if (item.id === 3) {
                // 铜钱
                data.gold = item.count;
            } else if (item.id === 4) {
                // 经验
                data.exp = item.count;
            } else {
                data.items.push(item);
            }
        }

        return data;
    }

    createGeneralItemUid(pos, itemId)
    {
        // 32bit(高16bit存储格子ID，低16位存储道具ID)
        return (pos << 16 | itemId);
    }

    getItemId(itemUid)
    {
        // 低16位转换出道具ID
        return (itemUid & 0xffff);
    }

    // 根据道具ID获取全背包道具数
    getItemCountTotal(itemId)
    {
        let count = 0;
        if (this.check()) {
            let item_uids = Object.keys(this.data_);
            for (let item_uid of item_uids) {
                if (this.getItemId(item_uid) === itemId) {
                    // 找到相应的道具
                    count += this.data_[item_uid]['count'];
                }
            }
        }
        
        return count;
    }

    // 获取道具位置（需要考虑到删除道具后的空位置复用）
    getItemPos()
    {
        if (this.check()) {
            let item_uids = Object.keys(this.data_);
            item_uids.sort((a, b) => { return a - b; });
            for (let i = 0; i < item_uids.length; i++) {
                var pos = item_uids[i] >> 16;
                if (pos !== (i + 1)) {
                    return (i + 1);
                }
            }

            return (item_uids.length + 1);
        } else {
            return 1;
        }
    }

    // 判断道具是否满足
    checkItems(items=[]) // example: items=[{id, count}, ...]
    {
        if (items.length === 0 || !this.check())
            return true;

        let ret = true;
        for (let item of items) {
            let currItemCount = this.getItemCountTotal(item.id);
            if (currItemCount < item.count) {
                // 当前道具不足
                ret = false;
                break;
            }
        }

        return ret;
    }

    // 找到背包道具
    findItem(itemId)
    {
        let item_uids = Object.keys(this.data_);
        for (let item_uid of item_uids) {
            if (this.getItemId(item_uid) === itemId) {
                return item_uid; // 是存在的道具
            }
        }

        return null;
    }

    // 根据道具ID获取相同道具UID列表
    getItemUidListByItemIdLimite(itemId)
    {
        let lis = [];
        let item_uids = Object.keys(this.data_);
        for (let item_uid of item_uids) {
            if (this.getItemId(item_uid) === itemId) {
            /*if (this.getItemId(item_uid) === itemId && 
                    this.data_[item_uid]['count'] < ITEM_OVERLAP_COUNT_MAX) {*/
                // 找到相同道具且数据未达到上限
                lis.push(item_uid);
            }
        }

        return lis;
    }

    getItemUidListByItemIdOrderCount(itemId, asc=true)
    {
        let lis = [], tmp = [];
        let item_uids = Object.keys(this.data_);
        for (let item_uid of item_uids) {
            if (this.getItemId(item_uid) === itemId) {
                tmp.push({
                    itemUid: item_uid,
                    itemCount: this.data_[item_uid]['count']
                });
            }
        }

        if (asc) {
            // 升序
            tmp.sort((a, b) => { return a.itemCount - b.itemCount; });
        } else {
            // 降序
            tmp.sort((a, b) => { return b.itemCount - a.itemCount; });
        }

        for (let v of tmp) {
            lis.push(v.itemUid);
        }

        return lis;
    }

    // 根据所需经验获取经验相关道具消耗列表
    getCostExpItemListByNeedExp(needExpVal)
    {
        let item_uids = Object.keys(this.data_), tmps = [];
        // 获取背包中全部经验丹类道具
        for (let item_uid of item_uids) {
            var item_id = this.getItemId(item_uid);
            var expPillVal = ItemModel.getExpItemEffectValue(item_id);
            if (expPillVal !== null) {
                // 是经验丹类
                tmps.push({
                    itemId: item_id,
                    itemUid: item_uid,
                    expValue: expPillVal
                });
            }
        }

        // 小 -> 大（规则：先吃小的经验丹，再吃大的经验丹）
        tmps.sort((a, b) => { return a.expValue - b.expValue; });

        let cost_item_lis = [], expTotal = 0;

        if (tmps.length > 0) {
            for (let v of tmps) {
                let currCount = this.data_[v.itemUid]['count'];
                let needCount = Math.ceil(needExpVal / v.expValue); // 计算所需这种经验丹要多少个
                if (currCount >= needCount) {
                    // 经验丹足够
                    cost_item_lis.push({ id: v.itemId, count: needCount });
                    expTotal += needCount * v.expValue;
                    break;
                } else {
                    // 经验丹不足（扣除此全部经验丹并继续吃）
                    cost_item_lis.push({ id: v.itemId, count: currCount });
                    needExpVal -= currCount * v.expValue;
                    expTotal += currCount * v.expValue;
                }
            }
        }

        return [cost_item_lis, expTotal]; // 消耗列表为空等同于道具不足
    }

    // 新道具
    newItem(pos, itemId, itemCount)
    {
        let item_uid = this.createGeneralItemUid(pos, itemId);
        let item_model = data_models[this.tblname_]();
        item_model['player_id'] = this.player_id_;
        item_model['item_uid'] = item_uid;
        item_model['item_id'] = itemId;
        item_model['count'] = itemCount;
        //SqlString.markListSqlData(item_model, SqlString.SQL_TYPES().INSERT);
        DataHelper.markInsert(item_model);

        return item_model;
    }

    // 处理增加道具
    doAddItem(itemId, itemCount)
    {
        let count = itemCount;
        do {
            let item_model = this.newItem(this.getItemPos(), itemId, 
                count > ITEM_OVERLAP_COUNT_MAX ? ITEM_OVERLAP_COUNT_MAX : count);
            
            this.data_[item_model['item_uid']] = item_model;
            count -= ITEM_OVERLAP_COUNT_MAX;
        } while (count > 0);
    }

    // 背包增加道具（需堆叠、新建）
    addItems(items=[]) // 道具增加之前需要分离剔除货币，相同道具合并
    {
        if (items.length === 0)
            return [];

        let ret_add_items = [];

        if (this.check()) {
            // 原本有道具
            for (let item of items) {
                let countTotal = item.count,
                    item_uids = this.getItemUidListByItemIdLimite(item.id);
                if (item_uids.length > 0) {
                    // 有相同道具且未达上限
                    for (let item_uid of item_uids) {
                        let currCount = this.data_[item_uid]['count'];

                        if ((currCount + countTotal) > ITEM_OVERLAP_COUNT_MAX) {
                            countTotal = 0; //(currCount + countTotal) - ITEM_OVERLAP_COUNT_MAX; // 堆叠达到上限不需要加入
                            this.data_[item_uid]['count'] = ITEM_OVERLAP_COUNT_MAX;
                            //SqlString.markListSqlData(this.data_[item_uid], SqlString.SQL_TYPES().UPDATE);
                            DataHelper.markUpdate(this.data_[item_uid]);

                            ret_add_items.push({
                                id: item.id,
                                count: this.data_[item_uid]['count']
                            });

                        } else {
                            this.data_[item_uid]['count'] += countTotal;
                            countTotal = 0;
                            //SqlString.markListSqlData(this.data_[item_uid], SqlString.SQL_TYPES().UPDATE);
                            DataHelper.markUpdate(this.data_[item_uid]);

                            ret_add_items.push({
                                id: item.id,
                                count: this.data_[item_uid]['count']
                            });
                        }

                        if (countTotal === 0)
                            break;
                    }

                    if (countTotal > 0) {
                        // 还有剩余，新建道具
                        this.doAddItem(item.id, countTotal);
                        ret_add_items.push({
                            id: item.id,
                            count: countTotal
                        });
                    }
                } else {
                    // 是新道具
                    this.doAddItem(item.id, countTotal);
                    ret_add_items.push({
                        id: item.id,
                        count: countTotal > ITEM_OVERLAP_COUNT_MAX ? ITEM_OVERLAP_COUNT_MAX : countTotal
                    });
                }
            }
        } else {
            // 无道具（全部为新道具）
            this.data_ = {};
            for (item of items) {
                if (item.count > 0) {
                    this.doAddItem(item.id, item.count);
                    ret_add_items.push({
                        id: item.id,
                        count: countTotal > ITEM_OVERLAP_COUNT_MAX ? ITEM_OVERLAP_COUNT_MAX : countTotal
                    });
                }
            }
        }

        return ret_add_items;
    }

    // 处理扣除道具
    doCostItem(itemId, itemCount)
    {
        let ret_cost_items = [];
        let countTotal = itemCount,
            item_uids = this.getItemUidListByItemIdOrderCount(itemId); // 从数量最少的开始扣
        for (let item_uid of item_uids) {
            let currCount = this.data_[item_uid]['count'];
            if ((currCount - countTotal) > 0) {
                this.data_[item_uid]['count'] -= countTotal;
                countTotal = 0;
                //SqlString.markListSqlData(this.data_[item_uid], SqlString.SQL_TYPES().UPDATE);
                DataHelper.markUpdate(this.data_[item_uid]);

                ret_cost_items.push({
                    id: this.data_[item_uid]['item_id'],
                    count: this.data_[item_uid]['count']
                });

                break;
            } else if ((currCount - countTotal) === 0) {
                // 道具扣除完需要删除
                //delete this.data_[item_uid];
                this.data_[item_uid]['count'] = 0; // 主要用于对返回客户端的数据隐藏
                countTotal = 0;
                //SqlString.markListSqlData(this.data_[item_uid], SqlString.SQL_TYPES().DELETE); // 底层接口会自动删除
                DataHelper.markDelete(this.data_[item_uid]);

                ret_cost_items.push({
                    id: this.data_[item_uid]['item_id'],
                    count: this.data_[item_uid]['count']
                });

                break;
            } else if ((currCount - countTotal) < 0) {
                // 未扣完继续
                // delete this.data_[item_uid];
                this.data_[item_uid]['count'] = 0;
                countTotal -= currCount;
                //SqlString.markListSqlData(this.data_[item_uid], SqlString.SQL_TYPES().DELETE);
                DataHelper.markDelete(this.data_[item_uid]);
            }
        }

        return ret_cost_items;
    }

    costItems(items=[])
    {
        if (items.length === 0 || !this.check())
            return [];
        
        let retCostItemLis = [];
        for (let item of items) {
            // 找到道具（如有剩余需要循环查找直到全部扣除完毕。注：需要特殊处理扣不完的情形）
            var cost_items = this.doCostItem(item.id, item.count);
            retCostItemLis = retCostItemLis.concat(cost_items);
        }

        return retCostItemLis;
    }

    toList()
    {
        let lis = [];
        if (this.check()) {
            let item_uids = Object.keys(this.data_);
            item_uids.sort((a, b) => { return a - b; });
            for (let item_uid of item_uids) {
                lis.push({
                    id: this.data_[item_uid]['item_id'],
                    count: this.data_[item_uid]['count']
                });
            }
        }

        return lis;
    }

    toString()
    {
        return util.format("Item: playerId=%s, tblname=%s, data=%s", this.player_id_, this.tblname_, JSON.stringify(this.data_));
    }
}

module.exports = {
    Item
}