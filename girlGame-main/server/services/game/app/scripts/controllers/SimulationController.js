const data_models = require('./../../defs/data.models');
const player_def = require('./../../defs/player.def');
const { DataHelper } = require('./../../com/helpers');
const { logger } = require('./../../app');
const BusinessModel = require('./../models/BusinessModel');
const OrderTaskModel = require('./../models/OrderTaskModel');
const DropPacketModel = require('./../models/DropPacketModel');
const { Item } = require('./ItemController');
const { isToday } = require('./../../com/utility');

const PRODUCT_TYPE_NUM = BusinessModel.getTypeMaxConfig();

class Simulation
{
    constructor(playerId)
    {
        this._tblname = "player_simulations";
        this._playerId = playerId;
        this._data = null;
    }

    // =========================================================== 模拟经营以下
    load(callback)
    {
        DataHelper.getTableFieldValue(this._tblname, { player_id: this._playerId }, {
            player_id: 'string', level: 'number',
            order_refresh_stime: 'number', order_refresh_free_count: 'number', order_refresh_count: 'number', order_data: 'string',
            work_data1: 'string', work_data2: 'string', work_data3: 'string', work_data4: 'string'
        }, simulationData => {
            if (simulationData) {
                this._data = simulationData;
                this._toFieldJSON();
                callback(true);
            } else {
                this._data = data_models[this._tblname]();
                let saveData = {}, 
                    simulationDefault = player_def()['simulation'],
                    model_fields = Object.keys(this._data);

                this._data['player_id'] = this._playerId;

                // 设置模拟经营默认值
                this._data['day_delay_reset_time'] = new Date().getTime();
                //this._data['order_refresh_stime'] = new Date().getTime();
                this._data['order_refresh_free_count'] = simulationDefault['order_refresh_free_count'];

                this.initWorkData(); // 初始化生产队列

                this.doRefreshOrderData(); // 刷新新的订单
                
                for (let field of model_fields) {
                    if ("object" === typeof this._data[field]) {
                        saveData[field] = JSON.stringify(this._data[field]);
                    } else {
                        saveData[field] = this._data[field];
                    }
                }

                DataHelper.newTable(this._tblname, { player_id: this._playerId }, saveData, (ok) => {
                    callback(ok);
                });
            }
        });
    }
    save(callback)
    {
        if (this._data !== null) {
            this._toFieldString();
            DataHelper.setTableFieldValue(this._tblname, { player_id: this._playerId }, this._data, (ret) => {
                callback(ret);
            });
        } else {
            callback(false);
        }
    }

    _toFieldJSON()
    {
        try {
            for (let i = 1; i <= PRODUCT_TYPE_NUM; i++) {
                var field = 'work_data' + i.toString();
                this._data[field] = JSON.parse(this._data[field]);
            }
            this._data['order_data'] = JSON.parse(this._data['order_data']);
        } catch (e) {
            logger.Warn("[Simulation._toFieldJSON] Parse field to json failed:", e);
        }
    }
    _toFieldString()
    {
        for (let i = 1; i <= PRODUCT_TYPE_NUM; i++) {
            var field = 'work_data' + i.toString();
            this._data[field] = JSON.stringify(this._data[field]);
        }
        this._data['order_data'] = JSON.stringify(this._data['order_data']);
    }

    // 每日重置模拟经营关联数据
    getDayDelayResetTime()
    {
        if ("number" === typeof this._data['day_delay_reset_time']) {
            return this._data['day_delay_reset_time'];
        } else {
            this._data['day_delay_reset_time'] = new Date().getTime();
            return this._data['day_delay_reset_time'];
        }
    }
    setDayDelayResetTime(value)
    {
        this._data['day_delay_reset_time'] = value;
    }
    resetSimulationData()
    {
        let rt = new Date(this.getDayDelayResetTime()),
            nt = new Date();

        if (!isToday(rt, nt)) {
            const simulationDefault = player_def()['simulation'];
            this.setOrderFreeRefreshCount(simulationDefault['order_refresh_free_count']);
            this.setOrderRefreshCount(0);
            this.setDayDelayResetTime(new Date().getTime());
        }
    }
    // =========================================================== 模拟经营以上

    // =========================================================== 生产以下
    // 等级
    getLevel()
    {
        return this._data['level'];
    }
    setLevel(level)
    {
        this._data['level'] = level;
    }
    doUpgrade()
    {
        // 升级等级
        this._data['level'] += 1;
        // 刷新生产数据
        this.initWorkData();
        // 重新刷新订单
        this.toRefreshOrderData();
        this.setOrderRefreshStime(new Date().getTime());
    }
    getUpgradeNeedCareerConfig()
    {
        return BusinessModel.getUpgradeNeedCareerConfig(this.getLevel());
    }
    getUpgradeNeedItemConfig()
    {
        return BusinessModel.getUpgradeNeedMaterialConfig(this.getLevel())
    }
    // 生产
    isWorkCountFull(type)
    {
        let productDataConfig = BusinessModel.getProductConfig(type, this.getLevel());
        return this._data["work_data" + type.toString()]['count'] >= productDataConfig['max_count'];
    }
    getWorkCount(type)
    {
        return this._data["work_data" + type.toString()]['count'];
    }
    setWorkCount(type, value)
    {
        this._data["work_data" + type.toString()]['count'] = value;
    }
    resumeStopToWorking(type)
    {
        let field = "work_data" + type.toString(), 
            realStime;

        if (this._data[field]['nt'] > 0) {
            realStime = new Date().getTime() - (this._data[field]['nt'] - this._data[field]['st']);
        } else {
            realStime = this._data[field]['st'];
        }

        // 重新恢复生产
        this._data[field]['nt'] = 0;
        this._data[field]['st'] = realStime;
    }
    // 生产数据
    getProductId(type)
    {
        let field = "work_data" + type.toString();
        return this._data[field]['id'];
    }
    initWorkData()
    {
        var nt = new Date().getTime();
        for (let i = 1; i <= PRODUCT_TYPE_NUM; i++) {
            var productDataConfig = BusinessModel.getProductConfig(i, this.getLevel());
            if (productDataConfig !== null) {
                var field = "work_data" + i.toString();
                this._data[field]['id'] = productDataConfig['id'];
                this._data[field]['st'] = nt;
            }
        }
    }
    getWorkData(type)
    {
        this.doWorkData(type);
        return this._data["work_data" + type.toString()];
    }
    doWorkData(type)
    {
        let productDataConfig = BusinessModel.getProductConfig(type, this.getLevel()),
            field = "work_data" + type.toString(),
            nt = new Date().getTime();
        if (this._data[field]['count'] < productDataConfig['max_count']) {
            // 未达到上限，可继续生产
            var et = nt - this._data[field]['st'];
            if (et >= productDataConfig['time']) {
                // 超过生产时间可以收获（需要计算超过多少个生产时间单位）
                var rateVal = Math.floor(et / productDataConfig['time']), // 是生产时间的几倍
                    remainTime = et - productDataConfig['time'] * rateVal, // 剩余的时间值（新的st = nt + remainTime）
                    isOver = true;
                for (let i = 1; i <= rateVal; i++) {
                    this._data[field]['count'] += productDataConfig['count']; // 产出

                    if (this._data[field]['count'] >= productDataConfig['max_count']) {  // 达到上限了
                        isOver = false;

                        // 需要暂停生产
                        this._data[field]['st'] = nt - remainTime;
                        this._data[field]['nt'] = nt; // 该字段大于0说明是生产暂停
                        break;
                    }
                }

                if (isOver) {
                    // 未达到上限重新开始时间
                    this._data[field]['st'] = nt - remainTime;
                }
            }
        } else {
            // 需要暂停生产
            this._data[field]['nt'] = nt;
        }
    }
    toWorkDataJSON()
    {
        let lis = [], nt = new Date();
        for (let i = 1; i <= PRODUCT_TYPE_NUM; i++) {
            var workData = this.getWorkData(i),
                realStime,
                productDataConfig = BusinessModel.getProductConfig(i, this.getLevel());
            
            if (workData['nt'] > 0) {
                realStime = nt.getTime() - (workData['nt'] - workData['st']);
            } else {
                realStime = workData['st'];
            }

            lis.push({
                type: i,
                id: workData['id'],
                count: workData['count'],
                etime: (realStime + productDataConfig['time'])
            });
        }

        return lis;
    }
    doWorkingFast(type)
    {
        let itemLis = [];
        let productDataConfig = BusinessModel.getProductConfig(type, this.getLevel()),
            field = "work_data" + type.toString();
        this._data[field]['count'] += productDataConfig['count']; // 增加产物数量

        itemLis.push({ id: this._data[field]['id'], count: productDataConfig['count'] });

        this._data[field]['st'] = new Date().getTime(); // 刷新时间
        this.doWorkData(type);
        return itemLis;
    }
    static getWorkFastNeedDiamondConfig()
    {
        return player_def()['simulation']['work_fast_need_diamond'];
    }
    getWorkItemList()
    {
        let lis = [];
        for (let i = 1; i <= PRODUCT_TYPE_NUM; i++) {
            var workData = this.getWorkData(i);
            if (workData['count'] > 0) {
                lis.push({
                    type: i,
                    id: workData['id'],
                    count: workData['count']
                });
            }
        }

        return lis;
    }
    // =========================================================== 生产以下

    // =========================================================== 订单以下
    static getOrderNumMaxConfig()
    {
        return player_def()['simulation']['order_num_max'];
    }
    // 免费刷新次数
    getOrderFreeRefreshCount()
    {
        return this._data['order_refresh_free_count'];
    }
    setOrderFreeRefreshCount(value)
    {
        this._data['order_refresh_free_count'] = value;
    }
    subOrderFreeRefreshCount(value)
    {
        this._data['order_refresh_free_count'] -= value;
    }
    // 付费刷新次数
    static getOrderRefreshCountMax()
    {
        return player_def()['simulation']['order_refresh_need_diamond'].length;
    }
    static getRefreshDiamondConfig(count)
    {
        const ORDER_REFRESH_NEED_DIAMOND = player_def()['simulation']['order_refresh_need_diamond'];
        return ORDER_REFRESH_NEED_DIAMOND[count] ? ORDER_REFRESH_NEED_DIAMOND[count] : 0;
    }
    getOrderRefreshCount()
    {
        return this._data['order_refresh_count'];
    }
    setOrderRefreshCount(value)
    {
        this._data['order_refresh_count'] = value;
    }
    addOrderRefreshCount(value)
    {
        this._data['order_refresh_count'] += value;
    }
    // 刷新记录时间
    getOrderRefreshStime()
    {
        return this._data['order_refresh_stime'];
    }
    setOrderRefreshStime(value)
    {
        this._data['order_refresh_stime'] = value;
    }
    getOrderRefreshEtime()
    {
        const ORDER_REFRESH_DELAY_TIME = player_def()['simulation']['order_refresh_delay_time'];
        return this._data['order_refresh_stime'] + ORDER_REFRESH_DELAY_TIME;
    }
    // 订单数据
    doRefreshOrderData()
    {
        const ORDER_REFRESH_DELAY_TIME = player_def()['simulation']['order_refresh_delay_time'];
        let orderRefreshStime = this._data['order_refresh_stime'],
            nt = new Date().getTime();

        if (nt - orderRefreshStime >= ORDER_REFRESH_DELAY_TIME) {
            // 到刷新时间
            this.toRefreshOrderData();
            this.setOrderRefreshStime(nt);
        }
    }
    toRefreshOrderData()
    {
        let orderLevel = BusinessModel.getOrderLevelConfig(this.getLevel()),
            orderCount = Simulation.getOrderNumMaxConfig(),
            newOrderIds = OrderTaskModel.getRandomOrderListConfig(orderLevel, orderCount);
        this._data['order_data'] = [];
        for (let newOrderId of newOrderIds) {
            this._data['order_data'].push({
                id: newOrderId,
                status: 0
            });
        }
        this.setOrderRefreshStime(new Date().getTime());
    }
    getOrderData()
    {
        return this._data['order_data'];
    }
    setOrderData(value)
    {
        this._data['order_data'] = value;
    }
    static getOrderNeedMaterialConfig(orderId)
    {
        return OrderTaskModel.getNeedMaterialConfig(orderId);
    }
    static getOrderBonusConfig(orderId) {
        let bonusLis = OrderTaskModel.getBonusConfig(orderId);
        let lis = DropPacketModel.getItemsByDropIds(bonusLis);
        return [Item.categoryItem(lis), lis];
    }
    getOrderStatus(orderId)
    {
        for (let v of this._data['order_data']) {
            if (v.id === orderId) {
                return v.status;
            }
        }

        return 0;
    }
    setOrderStatus(orderId, state)
    {
        for (let i = 0; i < this._data['order_data'].length; i++) {
            if (this._data['order_data'][i].id === orderId) {
                this._data['order_data'][i].status = state;
            }
        }
    }
    // =========================================================== 订单以上
}


module.exports = {
    Simulation,
}