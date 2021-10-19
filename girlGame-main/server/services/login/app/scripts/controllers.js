const data_models = require('./../defs/data.models');
const { DataHelper } = require('./../com/helpers');
const { serverListConfig, keyGenerator, errCodes } = require('./../app');

class ServerListController
{
    /**
     * getServerInfo - 获取服务器信息
     */
    static getServerInfo()
    {
        return serverListConfig[0];
    }
}

class Account
{
    constructor(openid)
    {
        this.openid_ = openid;
        this.tblname_ = "accounts";
        this.data_ = null;
    }

    /**
     * createAccountId - 创建账号UID
     * @param {Function} callback 
     */
    createAccountId(callback)
    {
        DataHelper.incrHashValue("sequence_keys", this.tblname_, 1, sequence => {
            callback(keyGenerator.generateKey(sequence));
        });
    }

    /**
     * load - 载入账号数据
     * @param {Function} callback 
     */
    load(callback)
    {
        DataHelper.getTableFieldValue(this.tblname_, { openid: this.openid_ }, {
            status: 1
        }, accountData => {
            if (accountData === null) {
                // 是新玩家
                // 为该玩家自动创建一个账号
                this.data_ = data_models[this.tblname_]();
                this.data_.openid = this.openid_;
                // 创建账号UID（为了方便合服等操作）
                this.createAccountId(newAccountId => {
                    this.data_.account_id = newAccountId;
                    DataHelper.newTable(this.tblname_, { openid: this.data_.openid }, this.data_, (ret) => {
                        callback(errCodes.ERR_CREAT_ACCOUNT_DATA_FAILURE);
                    });
                });
            } else {
                // 是老玩家
                callback(accountData.status === 1 ? 0 : errCodes.ERR_ACCOUNT_DISABLED);
            }
        });
    }
}

module.exports = {
    ServerListController,
    Account
}