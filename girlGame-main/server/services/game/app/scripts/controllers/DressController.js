const data_models = require('./../../defs/data.models');
const player_def = require('./../../defs/player.def');
const { DataHelper } = require('./../../com/helpers');
const { logger } = require('./../../app');
const AccessorieModel = require('./../models/AccessorieModel');

class PlayerClothes
{
    constructor(playerId)
    {
        this.player_id_ = playerId;
        this.tblname_ = "player_clothes";
        this.data_ = null;
    }

    load(cb)
    {
        DataHelper.getTableFieldValue(this.tblname_, { player_id: this.player_id_ }, {
            player_id: 'string', 
            hair_id: 'number', makeup_id: 'number', 
            top_clothe_id: 'number', bottom_clothe_id: 'number', full_clothe_id: 'number',
            head_wear_id: 'number', neck_wear_id: 'number', ear_id: 'number', hang_id: 'number',
            hand_wear_id: 'number', hand_held_id: 'number',
            sock_id: 'number', shoe_id: 'number'
        }, clothesData => {
            if (clothesData) {
                this.data_ = clothesData;
                cb(true);
            } else {
                // 需要新建
                let model = data_models[this.tblname_](), 
                    saveData = {}, 
                    fields = Object.keys(model);
                model['player_id'] = this.player_id_;

                // =====================================
                let clothesDefault = player_def().clothes;
                model['hair_id']          = clothesDefault['hair_id'];
                model['makeup_id']        = clothesDefault['makeup_id'];
                model['top_clothe_id']    = clothesDefault['top_clothe_id'];
                model['bottom_clothe_id'] = clothesDefault['bottom_clothe_id'];
                model['full_clothe_id']   = clothesDefault['full_clothe_id'];
                model['head_wear_id']     = clothesDefault['head_wear_id'];
                model['neck_wear_id']     = clothesDefault['neck_wear_id'];
                model['ear_id']           = clothesDefault['ear_id'];
                model['hang_id']          = clothesDefault['hang_id'];
                model['hand_wear_id']     = clothesDefault['hand_wear_id'];
                model['hand_held_id']     = clothesDefault['hand_held_id'];
                model['sock_id']          = clothesDefault['sock_id'];
                model['shoe_id']          = clothesDefault['shoe_id'];
                // =====================================

                for (let field of fields) {
                    saveData[field] = model[field];
                }

                this.data_ = model;

                DataHelper.newTable(this.tblname_, { player_id: this.player_id_ }, saveData, (ok) => {
                    cb(ok);
                });
            }
        });
    }

    save(cb)
    {
        if (this.data_ !== null) {
            DataHelper.setTableFieldValue(this.tblname_, { player_id: this.player_id_ }, this.data_, (ret) => {
                cb(ret);
            });
        } else {
            cb(false);
        }
    }

    setClothes(accessorieIds)
    {
        for (let accessorieId of accessorieIds) {
            this.setClotheFieldByAccessorieId(accessorieId);
        }
    }

    clearTopAndBottomClothe()
    {
        this.data_['top_clothe_id'] = 0;
        this.data_['bottom_clothe_id'] = 0;
    }

    clearFullClothe()
    {
        this.data_['full_clothe_id'] = 0;
    }

    setClotheFieldByAccessorieId(accessorieId)
    {
        const ACCESSORIE_TYPES = AccessorieModel.TYPES(), 
            ACCESSORIE_SUBTYPES = AccessorieModel.SUB_TYPES();
            
        let replaceAccessorieId = 0,
            [type, subType] = AccessorieModel.getTypes(accessorieId);
        if ("number" === typeof type && "number" === typeof subType) {
            if (type === ACCESSORIE_TYPES.HAIR) {
                // 发型
                replaceAccessorieId = this.data_['hair_id'];
                this.data_['hair_id'] = accessorieId;
            } else if (type === ACCESSORIE_TYPES.FACE) {
                // 妆容
                replaceAccessorieId = this.data_['makeup_id'];
                this.data_['makeup_id'] = accessorieId;
            } else if (type === ACCESSORIE_TYPES.CLOTHING) {
                if (subType === ACCESSORIE_SUBTYPES.CLOTHING_TOP) {
                    // 上装
                    replaceAccessorieId = this.data_['top_clothe_id'];
                    this.data_['top_clothe_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.CLOTHING_BOTTOM) {
                    // 下装
                    replaceAccessorieId = this.data_['bottom_clothe_id'];
                    this.data_['bottom_clothe_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.CLOTHING_DRESS) {
                    // 上下套
                    replaceAccessorieId = this.data_['full_clothe_id'];
                    this.data_['full_clothe_id'] = accessorieId;
                }
            } else if (type === ACCESSORIE_TYPES.SUIT) {
                // 上下套
                replaceAccessorieId = this.data_['full_clothe_id'];
                this.data_['full_clothe_id'] = accessorieId;
            } else if (type === ACCESSORIE_TYPES.ACCESSORY) {
                // 配饰
                if (subType === ACCESSORIE_SUBTYPES.ACCESSORY_HEAD) {
                    // 头饰
                    replaceAccessorieId = this.data_['head_wear_id'];
                    this.data_['head_wear_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.ACCESSORY_NECK) {
                    // 颈饰
                    replaceAccessorieId = this.data_['neck_wear_id'];
                    this.data_['neck_wear_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.ACCESSORY_EAR) {
                    // 耳饰
                    replaceAccessorieId = this.data_['ear_id'];
                    this.data_['ear_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.ACCESSORY_WIDGET) {
                    // 挂饰
                    replaceAccessorieId = this.data_['hang_id'];
                    this.data_['hang_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.ACCESSORY_HAND) {
                    // 手饰
                    replaceAccessorieId = this.data_['hand_wear_id'];
                    this.data_['hand_wear_id'] = accessorieId;
                } else if (subType === ACCESSORIE_SUBTYPES.ACCESSORY_INHAND) {
                    // 手持
                    replaceAccessorieId = this.data_['hand_held_id'];
                    this.data_['hand_held_id'] = accessorieId;
                }
            } else if (type === ACCESSORIE_TYPES.SOCK) {
                // 袜子
                replaceAccessorieId = this.data_['sock_id'];
                this.data_['sock_id'] = accessorieId;
            } else if (type === ACCESSORIE_TYPES.SHOE) {
                // 鞋子
                replaceAccessorieId = this.data_['shoe_id'];
                this.data_['shoe_id'] = accessorieId;
            } 
        }

        return replaceAccessorieId;
    }

    getData()
    {
        return {
            hair: this.data_['hair_id'],
            makeup: this.data_['makeup_id'],
            topClothe: this.data_['top_clothe_id'],
            bottomClothe: this.data_['bottom_clothe_id'],
            fullClothe: this.data_['full_clothe_id'],
            headwear: this.data_['head_wear_id'],
            neckwear: this.data_['neck_wear_id'],
            ear: this.data_['ear_id'],
            hang: this.data_['hang_id'],
            handwear: this.data_['hand_wear_id'],
            handheld: this.data_['hand_held_id'],
            sock: this.data_['sock_id'],
            shoe: this.data_['shoe_id']
        }
    }
}

class PlayerWardrobe
{
    constructor(playerId)
    {
        this.player_id_ = playerId;
        this.tblname_ = "player_wardrobes";
        this.data_ = null;
    }

    load(cb)
    {
        DataHelper.getTableFieldValue(this.tblname_, { player_id: this.player_id_ }, {
            player_id: 'string', wardrobe_data: 'string'
        }, wardrobeData => {
            if (wardrobeData) {
                this.data_ = wardrobeData;
                this._toFieldJSON();
                cb(true);
            } else {
                // 需要新建
                let model = data_models[this.tblname_](), 
                    saveData = {}, 
                    fields = Object.keys(model);
                model['player_id'] = this.player_id_;
                model['wardrobe_data'] = AccessorieModel.getAccessorieIds(); // 临时全部获取

                for (let field of fields) {
                    saveData[field] = model[field];
                }
                saveData['wardrobe_data'] = JSON.stringify(model['wardrobe_data']);

                this.data_ = model;

                DataHelper.newTable(this.tblname_, { player_id: this.player_id_ }, saveData, (ok) => {
                    cb(ok);
                });
            }
        });
    }

    save(cb)
    {
        if (this.data_ !== null) {
            this._toFieldString();
            DataHelper.setTableFieldValue(this.tblname_, { player_id: this.player_id_ }, this.data_, (ret) => {
                cb(ret);
            });
        } else {
            cb(false);
        }
    }

    _toFieldJSON()
    {
        try {
            this.data_['wardrobe_data'] = JSON.parse(this.data_['wardrobe_data']);
        } catch (e) {
            logger.Warn("[PlayerWardrobe.toFieldJSON] Parse field to json failed:", e);
        }
    }

    _toFieldString()
    {
        this.data_['wardrobe_data'] = JSON.stringify(this.data_['wardrobe_data']);
    }

    getWardrobeData()
    {
        let wardrobeLis = this.data_['wardrobe_data'], wardrobeData = [];
        if (wardrobeLis.length > 0 && "number" === typeof wardrobeLis[0]) {
            // 列表是旧的需要转成[{id,count}]
            for (let id of wardrobeLis) {
                wardrobeData.push({ id: id, count: 1 });
            }
        } else {
            wardrobeData = this.data_['wardrobe_data'];
        }

        //return this.data_['wardrobe_data'];
        return wardrobeData;
    }

    checkAccessorie(accessorieId)
    {
        for (let id of this.data_['wardrobe_data']) {
            if (id === accessorieId) {
                return true;
            }
        }

        return false;
    }

    addAccessorieId(accessorieId)
    {
        let ret = false;
        if (!this.checkAccessorie(accessorieId)) {
            this.data_['wardrobe_data'].push(accessorieId);
            ret = true;
        }

        return ret;
    }

    removeAccessorieId(accessorieId)
    {
        for (let i = this.data_['wardrobe_data'].length - 1; i >= 0; i--) {
            if (this.data_['wardrobe_data'][i] === accessorieId) {
                this.data_['wardrobe_data'].splice(i, 1);
                break;
            }
        }
    }
}

module.exports = {
    PlayerClothes,
    PlayerWardrobe
}