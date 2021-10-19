const { logger, errCodes } = require('./../../app');
const { ResponseWrapper } = require('./../../com/wrappers');
const { Player } = require('./../controllers/PlayerController');
const { Simulation } = require('./../controllers/SimulationController');
const { Warehouse } = require('./../controllers/WarehouseController');
const { Item } = require('./../controllers/ItemController');

/**
 * @api {1251} 生产列表
 * @apiName SimulationProductList
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationProductList(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    let simulationPtr = new Simulation(req.uuid);
    simulationPtr.load(() => {
        // 实更订单数据
        simulationPtr.doRefreshOrderData();
        simulationPtr.resetSimulationData(); // 隔日重置相关

        let retData = {
            time: { info: { ctime: new Date().getTime() } },
            work: { info: {} },
            order: { info: {} },
            warehouse: { info: {} }
        };

        // 生产数据
        retData['work']['info'] = { 
            level: simulationPtr.getLevel(),
            data: simulationPtr.toWorkDataJSON()
        }

        // 订单数据
        retData['order']['info'] = {
            refresh_etime: simulationPtr.getOrderRefreshEtime(),
            refresh_free_count: simulationPtr.getOrderFreeRefreshCount(),
            refresh_count: Simulation.getOrderRefreshCountMax() - simulationPtr.getOrderRefreshCount(),
            data: simulationPtr.getOrderData()
        }

        let warehousePtr = new Warehouse(req.uuid);
        warehousePtr.load(() => {
            // 仓库数据
            retData['warehouse']['info'] = {
                level: warehousePtr.getLevel(),
                data: warehousePtr.getStoreDataAll()
            }

            simulationPtr.save(() => {
                responseData.setData(retData);
                responseData.toPacket(packet => { res.send(packet); });
            });
        });
    });
}

/**
 * @api {1252} 收获产物
 * @apiName SimulationResult
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationResult(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ("number" === typeof req.body.type && req.body.type >= 1 && req.body.type <= 4) {
        // 收获后如果是生产暂停状态需要重新开始生产
        let warehousePtr = new Warehouse(req.uuid);
        warehousePtr.load(() => {
            // 获取该对应仓库还能空余多少
            
            let simulationPtr = new Simulation(req.uuid);
            simulationPtr.load(() => {
                var productId = simulationPtr.getProductId(req.body.type),
                    emptyCountTotal = warehousePtr.getStoreEmptyCount(req.body.type, productId);

                if (emptyCountTotal > 0) {
                    // 实更生产
                    simulationPtr.doWorkData(req.body.type);
                    var workCount = simulationPtr.getWorkCount(req.body.type);
                    if (workCount > 0) {
                        let retAddItemLis = [];
                        if (workCount > emptyCountTotal) {
                            warehousePtr.addStoreItems([{ type: req.body.type, id: productId, count: emptyCountTotal }]);
                            simulationPtr.setWorkCount(req.body.type, workCount - emptyCountTotal);

                            retAddItemLis.push({ type: req.body.type, id: productId, count: emptyCountTotal });
                        } else {
                            // 可以全部放入仓库
                            warehousePtr.addStoreItems([{ type: req.body.type, id: productId, count: workCount }]); // 加入仓库
                            simulationPtr.setWorkCount(req.body.type, 0); // 清空产物

                            retAddItemLis.push({ type: req.body.type, id: productId, count: workCount });
                        }
                        simulationPtr.resumeStopToWorking(req.body.type); // 恢复生产（如果有）

                        let retData = {
                            work: { info: {}, reward: {} },
                            warehouse: { info: {} }
                        };

                        retData['work']['reward'] = retAddItemLis[0];
                
                        // 生产数据
                        retData['work']['info'] = { 
                            level: simulationPtr.getLevel(),
                            data: simulationPtr.toWorkDataJSON()
                        }

                        // 仓库数据
                        retData['warehouse']['info'] = {
                            level: warehousePtr.getLevel(),
                            data: warehousePtr.getStoreDataAll()
                        }

                        simulationPtr.save(() => {
                            warehousePtr.save(() => {
                                responseData.setData(retData);
                                responseData.toPacket(packet => { res.send(packet); });
                            });
                        });
                    } else {
                        // 没有产物
                        responseData.setErrCode(errCodes.ERR_SIMULATION_PRODUCT_NON_EXISTENT);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                } else {
                    // 仓库已满
                    responseData.setErrCode(errCodes.ERR_SIMULATION_WAREHOUSE_FULL);
                    responseData.toPacket(packet => { res.send(packet); });
                }
            });
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1253} 加速生产
 * @apiName SimulationWorkingFast
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationWorkingFast(req, res)
{
    const COST_DIAMOND_NUM = Simulation.getWorkFastNeedDiamondConfig(); // 消耗的元宝

    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ("number" === typeof req.body.type && req.body.type >= 1 && req.body.type <= 4) {
        let simulationPtr = new Simulation(req.uuid);
        simulationPtr.load(() => {
            simulationPtr.doWorkData(req.body.type);
            if (!simulationPtr.isWorkCountFull(req.body.type)) {
                let playerPtr = new Player(req.openid);
                playerPtr.load(() => {
                    // 判断元宝是否足够
                    if (playerPtr.checkDiamond(COST_DIAMOND_NUM)) {
                        playerPtr.costDiamond(COST_DIAMOND_NUM); // 消耗元宝
                        
                        let retAddItemLis = simulationPtr.doWorkingFast(req.body.type);

                        let retData = { 
                            player: { info: {} },
                            work: { info: {} }
                        }

                        // 玩家数据
                        retData['player']['info'] = playerPtr.getData();

                        // 生产数据
                        retData['work']['info'] = { 
                            level: simulationPtr.getLevel(),
                            data: simulationPtr.toWorkDataJSON()
                        }

                        playerPtr.save(() => {
                            simulationPtr.save(() => {
                                responseData.setData(retData);
                                responseData.toPacket(packet => { res.send(packet); });
                            });
                        });
                    } else {
                        // 元宝不足
                        responseData.setErrCode(errCodes.ERR_PLAYER_DIAMOND_NOT_ENOUGH);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            } else {
                // 产物已满不能加速
                responseData.setErrCode(errCodes.ERR_SIMULATION_PRODUCT_IS_FULL);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1254} 升级柜台
 * @apiName SimulationUpgradeBar
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationUpgradeBar(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);

    let simulationPtr = new Simulation(req.uuid);
    simulationPtr.load(() => {
        let playerPtr = new Player(req.openid);
        playerPtr.load(() => {
            let careerLimiteVal = simulationPtr.getUpgradeNeedCareerConfig();
            if (playerPtr.checkCareerLevel(careerLimiteVal)) {
                let costItemLis = simulationPtr.getUpgradeNeedItemConfig();
                let costData = Item.categoryItem(costItemLis);
                let warehousePtr = new Warehouse(req.uuid);

                warehousePtr.load(() => {
                    // 判断仓库产物
                    if (warehousePtr.checkStoreItems(costData.items)) {
                        // 判断货币
                        Player.checkPlayerCost(playerPtr, costData, (costRet, retCode) => {
                            if (costRet) {
                                // 消耗产物
                                warehousePtr.costStoreItems(costData.items);

                                // 消耗货币
                                Player.doPlayerCost(playerPtr, costData, (retPlayerData, playerRet) => {
                                    // 开始升级
                                    simulationPtr.doUpgrade();
                                    let retData = {
                                        work: { info: {} },
                                        warehouse: { info: {} }
                                    }

                                    retData['work']['info'] = { 
                                        level: simulationPtr.getLevel(),
                                        data: simulationPtr.toWorkDataJSON()
                                    }

                                    retData['warehouse']['info'] = {
                                        level: warehousePtr.getLevel(),
                                        data: warehousePtr.getStoreDataAll()
                                    }

                                    if (playerRet) {
                                        retData['player'] = { info: retPlayerData };
                                    }
                                    simulationPtr.save(() => {
                                        warehousePtr.save(() => {
                                            responseData.setData(retData);
                                            responseData.toPacket(packet => { res.send(packet); });
                                        });
                                    });
                                });
                            } else {
                                // 货币不足
                                responseData.setErrCode(retCode);
                                responseData.toPacket(packet => { res.send(packet); });
                            }
                        });
                    } else {
                        // 产物不足
                        responseData.setErrCode(errCodes.ERR_ITEM_NOT_ENOUGH);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            } else {
                responseData.setErrCode(errCodes.ERR_SIMULATION_CAREER_LIMITED);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    });
}

/**
 * @api {1255} 刷新订单
 * @apiName SimulationRefreshOrder
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationRefreshOrder(req, res)
{
    const doRefreshCount = (simulation, callback) => {
        if (simulation.getOrderFreeRefreshCount() > 0) {
            // 有免费刷新次数（不需要消耗元宝）
            simulation.subOrderFreeRefreshCount(1); // 消耗免费次数
            callback(true, null);
        } else {
            // 需要消耗元宝
            let nextRefreshCount = simulation.getOrderRefreshCount() + 1;
            if (nextRefreshCount <= Simulation.getOrderRefreshCountMax()) {
                // 可以刷新
                let COST_DIAMOND_NUM = Simulation.getRefreshDiamondConfig(nextRefreshCount);

                let playerPtr = new Player(req.openid);
                playerPtr.load(() => {
                    if (playerPtr.checkDiamond(COST_DIAMOND_NUM)) {
                        simulation.addOrderRefreshCount(1); // 增加刷新次数
                        playerPtr.costDiamond(COST_DIAMOND_NUM);
                        playerPtr.save(() => {
                            callback(true, playerPtr.getData());
                        });
                    } else {
                        // 元宝不足
                        callback(false, errCodes.ERR_PLAYER_DIAMOND_NOT_ENOUGH);
                    }
                });
            } else {
                // 已无刷新次数
                callback(false, errCodes.ERR_SIMULATION_ORDER_REFRESH_COUNT_NOT_ENOUGH);
            }
        }
    }

    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    let simulationPtr = new Simulation(req.uuid);
    simulationPtr.load(() => {
        doRefreshCount(simulationPtr, (flag, Ret) => {
            if (flag) {
                simulationPtr.toRefreshOrderData(); // 刷新订单数据
                let retData = {
                    order: {
                        info: {
                            refresh_etime: simulationPtr.getOrderRefreshEtime(),
                            refresh_free_count: simulationPtr.getOrderFreeRefreshCount(),
                            refresh_count: Simulation.getOrderRefreshCountMax() - simulationPtr.getOrderRefreshCount(),
                            data: simulationPtr.getOrderData()
                        }
                    }
                };

                if (Ret !== null) {
                    retData['player'] = { info: Ret };
                }

                simulationPtr.save(() => {
                    responseData.setData(retData);
                    responseData.toPacket(packet => { res.send(packet); });
                });
            } else {
                responseData.setErrCode(Ret);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    });
}

/**
 * @api {1256} 订单领取报酬
 * @apiName SimulationOrderResult
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationOrderResult(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    if ("number" === typeof req.body.orderId && req.body.orderId > 0) {
        let simulationPtr = new Simulation(req.uuid);
        simulationPtr.load(() => {
            // 判断是否已领取
            if (simulationPtr.getOrderStatus(req.body.orderId) === 0) {
                let warehousePtr = new Warehouse(req.uuid);
                warehousePtr.load(() => {
                    let needOrderItemLis = Simulation.getOrderNeedMaterialConfig(req.body.orderId);
                                        
                    // 判断是否满足产物需求
                    if (warehousePtr.checkStoreItems(needOrderItemLis)) {
                        // 获取奖励
                        let [bonusData, retBonusItemLis] = Simulation.getOrderBonusConfig(req.body.orderId);
                        let retData = { order: { info: {} }, warehouse: { info: {} } };

                        let playerPtr = new Player(req.openid);
                        playerPtr.load(() => {
                            // 玩家非道具奖励
                            Player.doPlayerBonus(playerPtr, bonusData, (retPlayerData, playerRet) => {
                                if (playerRet) {
                                    retData['player'] = { info: retPlayerData };
                                }

                                let itemPtr = new Item(req.uuid);
                                // 玩家道具奖励
                                Item.doItemBonus(itemPtr, bonusData, (retItemLis) => {
                                    if (retItemLis !== null) {
                                        retData['item'] = { info: retItemLis };
                                    }

                                    // 消耗仓库
                                    warehousePtr.costStoreItems(needOrderItemLis);
                                    retData['warehouse']['info'] = {
                                        level: warehousePtr.getLevel(),
                                        data: warehousePtr.getStoreDataAll()
                                    }

                                    // 设置订单状态
                                    simulationPtr.setOrderStatus(req.body.orderId, 1);

                                    // 订单数据
                                    retData['order']['info'] = {
                                        refresh_etime: simulationPtr.getOrderRefreshEtime(),
                                        refresh_free_count: simulationPtr.getOrderFreeRefreshCount(),
                                        refresh_count: Simulation.getOrderRefreshCountMax() - simulationPtr.getOrderRefreshCount(),
                                        data: simulationPtr.getOrderData()
                                    }

                                    retData['item'] = {
                                        reward: retBonusItemLis
                                    }

                                    simulationPtr.save(() => {
                                        warehousePtr.save(() => {
                                            responseData.setData(retData);
                                            responseData.toPacket(packet => { res.send(packet); });
                                        });
                                    });
                                });
                            });
                        });
                    } else {
                        // 未满足产物需求条件
                        responseData.setErrCode(errCodes.ERR_ITEM_NOT_ENOUGH);
                        responseData.toPacket(packet => { res.send(packet); });
                    }
                });
            } else {
                // 已领取
                responseData.setErrCode(errCodes.ERR_SIMULATION_ORDER_GETED);
                responseData.toPacket(packet => { res.send(packet); });
            }
        });
    } else {
        responseData.setErrCode(errCodes.ERR_CLI_PARAMS_ILLEGAL);
        responseData.toPacket(packet => { res.send(packet); });
    }
}

/**
 * @api {1257} 升级仓库
 * @apiName SimulationUpgradeWarehouse
 * @apiGroup Simulation
 * @apiVersion 1.0.0
 * @apiDescription 接口
 * 
 */
function SimulationUpgradeWarehouse(req, res)
{
    let responseData = new ResponseWrapper(logger);
    responseData.setCode(req.code);
    let warehousePtr  = new Warehouse(req.uuid);
    warehousePtr.load(() => {
        // 判断是否已达上限
        if (warehousePtr.checkLevel()) {
            let COST_DIAMOND_NUM = Warehouse.getNeedDiamondConfig(warehousePtr.getLevel() + 1);
                        
            let playerPtr = new Player(req.openid);
            playerPtr.load(() => {
                if (playerPtr.checkDiamond(COST_DIAMOND_NUM)) {
                    playerPtr.costDiamond(COST_DIAMOND_NUM);
                    warehousePtr.toUpgrade(); // 升级仓库
                    playerPtr.save(() => {
                        let retData = { player: { info: playerPtr.getData() }, warehouse: { info: {} } };
                        retData['warehouse']['info'] = {
                            level: warehousePtr.getLevel(),
                            data: warehousePtr.getStoreDataAll()
                        }
                        warehousePtr.save(() => {
                            responseData.setData(retData);
                            responseData.toPacket(packet => { res.send(packet); });
                        });
                    });
                } else {
                    // 元宝不足
                    responseData.setErrCode(errCodes.ERR_PLAYER_DIAMOND_NOT_ENOUGH);
                    responseData.toPacket(packet => { res.send(packet); });
                }
            });
        } else {
            // 等级已达最大
            responseData.setErrCode(errCodes.ERR_SIMULATION_WAREHOUSE_LV_MAX);
            responseData.toPacket(packet => { res.send(packet); });
        }
    });
}

module.exports = {
    SimulationProductList,
    SimulationResult,
    SimulationWorkingFast,
    SimulationUpgradeBar,
    SimulationRefreshOrder,
    SimulationOrderResult,
    SimulationUpgradeWarehouse
}