const data_models = require('./../../defs/data.models');
const PlayerDef = require('./../../defs/player.def');
const { DataHelper } = require('./../../com/helpers');
const { keyGenerator, errCodes } = require('./../../app');
const PlayerLevelExpModel = require('./../models/PlayerLevelExpModel');

class Player
{
    constructor(openid)
    {
        this.openid_ = openid;
        this.tblname_ = "players";
        this.data_ = null;
    }

    /**
     * load - 载入玩家数据
     * @param {Function} callback 
     */
    load(callback)
    {
        DataHelper.getTableFieldValue(this.tblname_, { openid: this.openid_ }, {
            openid: 'string', player_id: 'string',
            name: 'string', head: 'string', level: 'number', exp: 'number',
            diamond: 'number', silver: 'number', gold: 'number',
            vitality_val: 'number', battle_val: 'number', career_lv: 'number', power_val: 'number', popularity_val: 'number', glamour_val: 'number',
            title_id: 'number', hair_id: 'number', face_id: 'number', body_id: 'number'
        }, playerData => {
            this.data_ = playerData;
            callback(playerData);
        });
    }

    /**
     * save - 保存玩家数据
     * @param {Function} callback 
     */
    save(callback)
    {
        if (this.data_ !== null) {
            DataHelper.setTableFieldValue(this.tblname_, { openid: this.openid_ }, this.data_, (ret) => {
                callback(ret);
            });
        } else {
            callback(false);
        }
    }

    /**
     * createPlayerId - 生成玩家ID
     * @param {Function} callback 
     */
    createPlayerId(callback)
    {
        DataHelper.incrHashValue("sequence_keys", this.tblname_, 1, sequence => {
            callback(keyGenerator.generateKey(sequence));
        });
    }

    getData()
    {
        let playerData = {};
        let fields = Object.keys(this.data_);
        for (let field of fields) {
            if (field.indexOf('__') === -1) {
                playerData[field] = this.data_[field];
            }
        }

        delete playerData['openid'];

        return playerData;
    }

    check()
    {
        return this.data_ !== null;
    }

    checkName(name, callback)
    {
        DataHelper.checkIndex(this.tblname_, "player_names_index", "name", name, (indexRet) => {
            callback(indexRet);
        });
    }

    /**
     * verify - 验证玩家数据
     * @param {Function} callback 
     */
    verify(callback)
    {
        DataHelper.getTableFieldValue(this.tblname_, { openid: this.openid_ }, { player_id: 1 }, playerData => {
            callback(playerData !== null);
        });
    }

    /**
     * newPlayer - 创建玩家数据
     * @param {String} name 玩家名称
     * @param {Function} callback 
     */
    newPlayer(name, callback)
    {
        this.verify(ret => {
            if (ret) {
                // 玩家已存在
                callback(errCodes.ERR_PLAYER_EXISTS, null);
            } else {
                const player_def = PlayerDef();

                // 新建玩家数据
                this.data_ = data_models[this.tblname_]();
                this.data_.openid       = this.openid_;
                this.data_.name         = name;
                this.data_.vitality_val = player_def['info']['vitality'];
                this.data_.diamond      = player_def['currency']['diamond'];
                this.data_.silver       = player_def['currency']['silver'];
                this.data_.gold         = player_def['currency']['gold'];
                this.data_.career_lv    = 7; // 官阶（TODO: 临时设置）

                this.createPlayerId(newPlayerId => {
                    this.data_.player_id = newPlayerId;
                    DataHelper.newTable(this.tblname_, { openid: this.openid_ }, this.data_, (ret) => {
                        DataHelper.setIndex("player_names_index", name, () => {
                            callback(ret ? 0 : errCodes.ERR_PLAYER_CREAT_FAILURE, this.data_);
                        });
                    });
                });
            }
        });
    }

    static doPlayerBonus(playerPtr, bonusData, callback)
    {
        if (bonusData['diamond'] > 0 || bonusData['silver'] > 0 || bonusData['gold'] > 0 || bonusData['exp'] > 0) {
            // 有货币相关数据
            playerPtr.addDiamond(bonusData['diamond']);
            playerPtr.addSilver(bonusData['silver']);
            playerPtr.addGold(bonusData['gold']);
            playerPtr.levelUpByExp(bonusData['exp']);
            playerPtr.save(() => {
                callback(playerPtr.getData(), true);
            });
        } else {
            callback(playerPtr.getData(), false);
        }
    }

    static doPlayerCost(playerPtr, costData, callback)
    {
        if (costData['diamond'] > 0 || costData['silver'] > 0 || costData['gold'] > 0 || bonusData['exp'] > 0) {
            // 有货币相关数据
            playerPtr.costDiamond(costData['diamond']);
            playerPtr.costSilver(costData['silver']);
            playerPtr.costGold(costData['gold']);
            playerPtr.save(() => {
                callback(playerPtr.getData(), true);
            });
        } else {
            callback(playerPtr.getData(), false);
        }
    }

    static checkPlayerCost(playerPtr, costData, callback)
    {
        if (!playerPtr.checkDiamond(costData['diamond'])) {
            callback(false, errCodes.ERR_PLAYER_DIAMOND_NOT_ENOUGH);
        } else if (!playerPtr.checkSilver(costData['silver'])) {
            callback(false, errCodes.ERR_PLAYER_SILVER_NOT_ENOUGH);
        } else if (!playerPtr.checkGold(costData['gold'])) {
            callback(false, errCodes.ERR_PLAYER_GOLD_NOT_ENOUGH);
        } else {
            callback(true);
        }
    }

    // 官阶
    getCareerLevel()
    {
        return this.data_['career_lv'];
    }

    checkCareerLevel(careerLevel)
    {
        return this.data_['career_lv'] >= careerLevel;
    }

    // 等级
    getLevel()
    {
        return this.data_['level'];
    }

    setLevel(value)
    {
        return this.data_['level'] = value;
    }

    levelUpByExp(expValue)
    {
        const PLAYER_LEVEL_MAX = PlayerLevelExpModel.getLevelMax(); // 获取玩家最大等级
        let currLevel = this.getLevel(),
            expTotal = expValue + this.getExp();

        if (currLevel === PLAYER_LEVEL_MAX || expTotal <= 0) {
            return false; // 已是最大等级无法升级或传入经验问题
        } else {
            let isUpdated = false;
            while (expTotal >= PlayerLevelExpModel.getNeedExpByLevel(currLevel) &&
                PlayerLevelExpModel.getNeedExpByLevel(currLevel) > 0 &&
                    currLevel < PLAYER_LEVEL_MAX) {
                // 合计经验大于所需经验，可以升级
                expTotal -= PlayerLevelExpModel.getNeedExpByLevel(currLevel);
                ++currLevel;
                
                isUpdated = true;
            }

            if (isUpdated) {
                // 玩家有升级
                this.setLevel(currLevel);
                this.setExp(expTotal);
            } else {
                // 未升级加入到原先的经验值中
                this.setExp(expTotal);
            }
        }
    }

    // 经验
    getExp()
    {
        return this.data_['exp'];
    }

    setExp(value)
    {
        this.data_['exp'] = value;
    }

    // 体力
    getVitality()
    {
        return this.data_['vitality_val'];
    }

    addVitality(value)
    {
        this.data_['vitality_val'] += value;
    }

    costVitality(value)
    {
        if (this.data_['vitality_val'] <= value) {
            this.data_['vitality_val'] = 0;
        } else {
            this.data_['vitality_val'] -= value;
        }
    }

    checkVitality(value)
    {
        return this.data_['vitality_val'] >= value;
    }

    // 元宝
    getDiamond()
    {
        return this.data_['diamond'];
    }

    addDiamond(value)
    {
        this.data_['diamond'] += value;
        return this.data_['diamond'];
    }

    costDiamond(value)
    {
        if (this.data_['diamond'] < value) {
            return false;
        } else {
            this.data_['diamond'] -= value;
            return true;
        }
    }

    checkDiamond(value)
    {
        return this.data_['diamond'] >= value;
    }

    // 银两
    getSilver()
    {
        return this.data_['silver'] ? this.data_['silver'] : 0;
    }

    addSilver(value)
    {
        this.data_['silver'] = this.getSilver();
        this.data_['silver'] += value;
        return this.data_['silver'];
    }

    costSilver(value)
    {
        this.data_['silver'] = this.getSilver();
        if (this.data_['silver'] < value) {
            return false;
        } else {
            this.data_['silver'] -= value;
            return true;
        }
    }

    checkSilver(value)
    {
        return this.getSilver() >= value;
    }

    // 铜钱
    getGold()
    {
        return this.data_['gold'];
    }

    addGold(value)
    {
        this.data_['gold'] += value;
        return this.data_['gold'];
    }

    costGold(value)
    {
        if (this.data_['gold'] < value) {
            return false;
        } else {
            this.data_['gold'] -= value;
            return true;
        }
    }

    checkGold(value)
    {
        return this.data_['gold'] >= value;
    }

    setHairId(hairId)
    {
        this.data_.hair_id = hairId;
    }

    setFaceId(faceId)
    {
        this.data_.face_id = faceId;
    }

    setBodyId(bodyId)
    {
        this.data_.body_id = bodyId;
    }
}

module.exports = {
    Player
}