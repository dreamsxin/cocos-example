const data_models = require('./../../defs/data.models');
const player_def = require('./../../defs/player.def');
const { DataHelper } = require('./../../com/helpers');
const { logger } = require('./../../app');
const BusinessModel = require('./../models/BusinessModel');

const PRODUCT_TYPE_NUM = BusinessModel.getTypeMaxConfig();

class Warehouse
{
    constructor(playerId)
    {
        this._tblname = "player_warehouses";
        this._playerId = playerId;
        this._data = null;
    }

    load(cb)
    {
        DataHelper.getTableFieldValue(this._tblname, { player_id: this._playerId }, {
            player_id: 'string', level: 'number', count_data: 'string',
            store_data: 'string'
        }, warehouseData => {
            if (warehouseData) {
                this._data = warehouseData;
                this._toFieldJSON();
                cb(true);
            } else {
                // 需要新建
                let model = data_models[this._tblname](), 
                    saveData = {}, 
                    fields = Object.keys(model);
                model['player_id'] = this._playerId;

                // 设置仓库默认配置值
                let simulationDefault = player_def()['simulation'];
                model['count_data'] = simulationDefault['warehouse_count_default'];

                for (let field of fields) {
                    saveData[field] = model[field];
                }
                saveData['count_data'] = JSON.stringify(model['count_data']);
                saveData['store_data'] = JSON.stringify(model['store_data']);

                this._data = model;

                DataHelper.newTable(this._tblname, { player_id: this._playerId }, saveData, (ok) => {
                    cb(ok);
                });
            }
        });
    }
    save(cb)
    {
        if (this._data !== null) {
            this._toFieldString();
            DataHelper.setTableFieldValue(this._tblname, { player_id: this._playerId }, this._data, (ret) => {
                cb(ret);
            });
        } else {
            cb(false);
        }
    }
    _toFieldJSON()
    {
        try {
            this._data['count_data'] = JSON.parse(this._data['count_data']);
            this._data['store_data'] = JSON.parse(this._data['store_data']);
        } catch (e) {
            logger.Warn("[Warehouse._toFieldJSON] Parse field to json failed:", e);
        }
    }
    _toFieldString()
    {
        this._data['count_data'] = JSON.stringify(this._data['count_data']);
        this._data['store_data'] = JSON.stringify(this._data['store_data']);
    }

    // =========================================================== 仓库升级以下
    static getLevelMaxConfig()
    {
        return  player_def()['simulation']['warehouse_upgrade_need_diamond'].length;
    }
    static getNeedDiamondConfig(level)
    {
        const WH_UPGRADE_NEED_DIAMOND = player_def()['simulation']['warehouse_upgrade_need_diamond'];
        return WH_UPGRADE_NEED_DIAMOND[level] ? WH_UPGRADE_NEED_DIAMOND[level] : 99999999;
    }
    checkLevel()
    {
        return this.getLevel() < Warehouse.getLevelMaxConfig();
    }
    getLevel()
    {
        return this._data['level'];
    }
    toUpgrade()
    {
        this._data['level'] += 1; // 升级等级
        // 扩容（全部）
        for (let i = 1; i <= PRODUCT_TYPE_NUM; i++) {
            this.addCurrCount(i, Warehouse.getExtCountConfig(this.getLevel() - 1));
        }
    }
    // =========================================================== 仓库升级以上

    // =========================================================== 仓库容量以下
    // 当前容量
    static getExtCountConfig(level)
    {
        const WH_COUNT_EXT = player_def()['simulation']['warehouse_count_ext'];
        return WH_COUNT_EXT[level] ? WH_COUNT_EXT[level] : 0;
    }
    getCurrCount(type)
    {
        return this._data['count_data'][type - 1];
    }
    addCurrCount(type, value)
    {
        this._data['count_data'][type - 1] += value;
        return this._data['count_data'][type - 1];
    }
    // =========================================================== 仓库容量以上

    // =========================================================== 仓库获取/消耗以下
    getStoreDataAll()
    {
        let lis = [];
        for (let v of this._data['store_data']) { // { type, id, count }
            lis.push({
                id: v['id'],
                count: v['count'],
                max_count: this.getCurrCount(v['type'])
            });
        }

        return lis;
    }
    getStoreEmptyCount(type, id)
    {
        let currCount = this.getCurrCount(type), countTotal = 0;
        for (let v of this._data['store_data']) {
            if (v.id === id) {
                countTotal = v.count;
                break;
            }
        }

        return (currCount - countTotal); // 空余数量
    }
    _findStorePos(id)
    {
        for (let i = 0; i < this._data['store_data'].length; i++) {
            if (id === this._data['store_data'][i]['id']) {
                return i;
            }
        }

        return -1;
    }
    checkStoreItems(items)
    {
        for (let v of items) {
            var pos = this._findStorePos(v.id);
            if (pos === -1) {
                return false; // 未找到产物
            } else {
                if (this._data['store_data'][pos]['count'] < v.count) { // 产物数量小于消耗数量
                    return false;
                }
            }
        }

        return true;
    }
    addStoreItems(items)
    {
        for (let v of items) {
            var pos = this._findStorePos(v.id),
                currCount = this.getCurrCount(v.type),
                count = v.count;
            if (pos === -1) {
                // 新产物
                count = (v.count > currCount ? currCount: v.count);
                this._data['store_data'].push({
                    type: v.type,
                    id: v.id,
                    count: count
                });
            } else {
                this._data['store_data'][pos]['count'] += v.count;
                if (this._data['store_data'][pos]['count'] > currCount) {
                    this._data['store_data'][pos]['count'] = currCount;
                }
            }
        }
    }
    costStoreItems(items)
    {
        for (let v of items) {
            var pos = this._findStorePos(v.id);
            if (pos !== -1) {
                this._data['store_data'][pos]['count'] -= v.count;
                if (this._data['store_data'][pos]['count'] <= 0) {
                    this._data['store_data'].splice(pos, 1); // 清除
                }
            }
        }
    }
    // =========================================================== 仓库获取/消耗以上
}

module.exports = {
    Warehouse
}