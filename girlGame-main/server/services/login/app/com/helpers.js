const cache_expires = require('./../defs/cache_expires.map');
const data_models = require('./../defs/data.models');
const { SqlString } = require('./database');
const { cache, db, logger } = require('./../app');
const { EMIT_CHANNELS, DbSyncEmitter } = require('./../emitters');

class DataHelper
{
    static getWhereFromPrimaryKey(primaryKey)
    {
        var _where = {}, keys = Object.keys(primaryKey);
        keys.forEach((key, index) => {
            if (index % 2 == 1) {
                _where['_factor'] = "and";
                _where[key] = "='" + primaryKey[key].toString() + "'";
            } else {
                _where[key] = "='" + primaryKey[key].toString() + "'";
            }
        });

        return _where;
    }

    static getWhereFromMainKey(primaryKey, mainKey)
    {
        var obj = {}, _where = {};
        Object.keys(primaryKey).forEach(key => {
            obj[key] = primaryKey[key];
        });
        Object.keys(mainKey).forEach(key => {
            obj[key] = mainKey[key];
        });

        var keys = Object.keys(obj);

        keys.forEach((key, index) => {
            if (index % 2 == 1) {
                _where['_factor'] = "and";
                _where[key] = "='" + obj[key].toString() + "'";
            } else {
                _where[key] = "='" + obj[key].toString() + "'";
            }
        });

        return _where;
    }

    static getKey(tblname, primaryKey) // primaryKey = { key => value, ... }
    {
        var _key = tblname, vals = Object.values(primaryKey);
        if (vals.length > 0) {
            vals.forEach(value => {
                _key += ":" + value;
            });
        }

        return _key;
    }

    static checkKey(tblname, primaryKey, callback)
    {
        cache.exists(DataHelper.getKey(tblname, primaryKey)).then(ret => {
            callback(ret === 1);
        });
    }

    static getExpiresTime(tblname)
    {
        return ("undefined" !== typeof cache_expires[tblname] ? cache_expires[tblname] : 7 * 24 * 60 * 60); // default 7days
    }

    // index
    static checkIndex(tblname, key, field, index, callback)
    {
        cache.hget(key, index).then(value => {
            if (value) {
                callback(true);
            } else {
                // need restore from db to cache.
                let query = {}, where = {};
                query[field] = 1;
                where[field] = "=";
                if ("string" === typeof index) {
                    where[field] += "'" + index + "'";
                } else {
                    where[field] = index;
                }
                db.select(tblname, query, where).then(docs => {
                    if (docs.length > 0) {
                        cache.hset(key, index, 1).then(ok => {
                            callback(true);
                        });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    }

    static setIndex(key, index, callback)
    {
        cache.hset(key, index, 1).then(ok => {
            callback();
        });
    }

    // string
    static getString(key, callback)
    {
        cache.get(key).then(value => {
            callback(value);
        });
    }

    static setString(key, value, callback)
    {
        cache.set(key, value).then(ok => {
            callback(ok === "OK");
        });
    }

    static incrString(key, value, callback)
    {
        cache.incrby(key, value).then(count => {
            callback(count);
        });
    }

    // hash
    static getHashValue(key, field, callback, valString=true)
    {
        cache.hget(key, field).then(results => {
            callback(valString ? results : Number(results));
        });
    }

    static setHashValue(key, doc, callback)
    {
        cache.hmset(key, doc).then(ok => {
            callback(ok === "OK");
        });
    }

    static delHashValue(key, fields, callback)
    {
        var _fields;
        if (Array.isArray(fields)) {
            _fields = fields;
        } else if ('object' === typeof fields) {
            _fields = Object.keys(fields);
        } else {
            _fields = [fields];
        }

        cache.hdel(key, _fields).then(ok => {
            callback(ok === 1);
        });
    }

    static incrHashValue(key, field, value, callback)
    {
        cache.hincrby(key, field, value).then(ok => {
            callback(ok === 1);
        });
    }

    // table
    static loadTableFromDB(tblname, primaryKey, callback)
    {
        DataHelper.checkKey(tblname, primaryKey, ret => {
            if (ret) {
                callback(true);
            } else {
                // Need to load this data from db.
                let model = data_models[tblname]();
                db.select(tblname, model, DataHelper.getWhereFromPrimaryKey(primaryKey)).then(results => {
                    if (results.length > 0) {
                        DataHelper.newTable(tblname, primaryKey, results[0], ret => {
                            callback(ret);
                        }, false);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    }

    static newTable(tblname, primaryKey, data, callback, sync=true)
    {
        let cacheKey = DataHelper.getKey(tblname, primaryKey);
        cache.hmset(cacheKey, data).then(ok => {
            cache.expire(cacheKey, DataHelper.getExpiresTime(tblname)).then(expiresOk => {
                if (sync) {
                    if (Array.isArray(data)) {
                        data.forEach((item, index, input) => {
                            input[index]['__tblname'] = tblname;
                            input[index]['__v'] = SqlString.SQL_TYPES().INSERT;
                        });
                    } else {
                        data['__tblname'] = tblname;
                        data['__v'] = SqlString.SQL_TYPES().INSERT;
                    }

                    DbSyncEmitter.emit(EMIT_CHANNELS().DB_SYNC, data);
                }

                logger.Debug("[newTable] Params{ tblname=%s, primaryKey=%s, data=%s }", tblname, 
                    JSON.stringify(primaryKey), JSON.stringify(data));

                callback(ok === "OK" && expiresOk === 1);
            });
        });
    }

    static getTableFieldValue(tblname, primaryKey, query, callback)
    {
        DataHelper.loadTableFromDB(tblname, primaryKey, ret => {
            if (ret) {
                let fields = Object.keys(query);
                cache.hmget(DataHelper.getKey(tblname, primaryKey), fields).then(results => {
                    let doc = {};
                    fields.forEach((field, index) => { 
                        doc[field] = (query[field] === 'string') ? results[index] : Number(results[index]); 
                    });

                    logger.Debug("[getTableFieldValue] Returns{ doc=%s }", JSON.stringify(doc));

                    callback(doc); // table format.
                });
            } else {
                logger.Debug("[getTableFieldValue] no data: ", tblname, JSON.stringify(primaryKey));
                
                callback(null);
            }
        });
    }

    static setTableFieldValue(tblname, primaryKey, doc, callback, sync=true)
    {
        DataHelper.checkKey(tblname, primaryKey, ret => {
            if (ret) {
                let key = DataHelper.getKey(tblname, primaryKey);
                cache.hmset(key, doc).then(setOk => {
                    // setting key expires time.
                    cache.expire(key, DataHelper.getExpiresTime(tblname)).then(expiresOk => {

                        logger.Debug("[setTableFieldValue] Params{ tblname=%s, primaryKey=%s, doc=%s }", tblname, 
                            JSON.stringify(primaryKey), JSON.stringify(doc));

                        if (sync) {
                            doc['__tblname'] = tblname;
                            doc['__v'] = SqlString.SQL_TYPES().UPDATE;
                            doc['__where'] = DataHelper.getWhereFromPrimaryKey(primaryKey);

                            DbSyncEmitter.emit(EMIT_CHANNELS().DB_SYNC, doc);
                        }

                        callback(setOk === "OK" && expiresOk === 1);
                    });
                });
            } else {
                logger.Warn("[setTableFieldValue] Key is non-existent:", tblname, JSON.stringify(primaryKey));
                callback(false);
            }
        });
    }

    // list value json
    static loadListValJSONFromDB(tblname, primaryKey, callback)
    {
        DataHelper.checkKey(tblname, primaryKey, ret => {
            if (ret) {
                callback(true);
            } else {
                // Need to load this data from db.
                let model = data_models[tblname]();
                let mainKey = {};
                mainKey[model.__mainkey] = 1;
                delete model.__mainkey;
                db.select(tblname, model, DataHelper.getWhereFromPrimaryKey(primaryKey)).then(results => {
                    if (results.length > 0) {
                        DataHelper.loadListValJSON(tblname, primaryKey, mainKey, results, (ret) => {
                           callback(ret);
                       });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    }

    static loadListValJSON(tblname, primaryKey, mainKey, docs, callback)
    {
        let payload = {}, primary_key = Object.keys(primaryKey)[0], main_key = Object.keys(mainKey)[0];
        docs.forEach(doc => {
            var main_key_value = doc[main_key];
            // delete primary key and main key.
            delete doc[main_key];
            delete doc[primary_key];
            payload[main_key_value] = JSON.stringify(doc);
        });

        cache.hmset(DataHelper.getKey(tblname, primaryKey), payload).then(ok => {
            cache.expire(DataHelper.getKey(tblname, primaryKey), DataHelper.getExpiresTime(tblname)).then(expiresOk => {
                callback(ok === "OK" && expiresOk === 1);
            });
        });
    }

    static getListValJSON(tblname, primaryKey, callback)
    {
        DataHelper.loadListValJSONFromDB(tblname, primaryKey, () => {
            cache.hgetall(DataHelper.getKey(tblname, primaryKey)).then(results => {
                if (results === null) results = {};

                // Value encoding by json, so we must decode it.
                try {
                    Object.keys(results).forEach(key => {
                        results[key] = JSON.parse(results[key]);
                    });
                } catch (e) {
                    logger.Error("[getList] JSON.Parse is err:", tblname, 
                        JSON.stringify(primaryKey), e);
                }

                logger.Debug("[getList] Returns{ data=%s }", JSON.stringify(results));

                callback(results);
            });
        });
    }

    static setListValJSON(tblname, primaryKey, doc, callback, sync=true) 
    {
        // doc = { key : { __v:"insert|update|delete" } }
        let magic_v = {}, 
            deletePayload = {},
            primary_key = Object.keys(primaryKey)[0],
            main_key = data_models[tblname]().__mainkey;

        let keys = Object.keys(doc);
        for (let key of keys) {
        //keys.forEach(key => {
            if ('__v' in doc[key]) {
                magic_v[key] = doc[key]['__v'];
                if (doc[key]['__v'] === SqlString.SQL_TYPES().DELETE) {
                    // We must remove this doc element when delete operation and temporary stroage for sync. 
                    deletePayload[key] = doc[key]; 
                    delete doc[key];
                } else {
                    delete doc[key]['__v'];
                }
            }
        };

        let new_doc = {};
        keys = Object.keys(doc); // this doc deleted if magic is delete operation.
        for (let key of keys) {
        //keys.forEach(key => {
            new_doc[key] = JSON.stringify(doc[key]);
        };

        cache.hmset(DataHelper.getKey(tblname, primaryKey), new_doc).then(setOk => {
            cache.expire(DataHelper.getKey(tblname, primaryKey), DataHelper.getExpiresTime(tblname)).then(expiresOk => {
                DataHelper.delListElemValJSON(tblname, primaryKey, Object.keys(deletePayload), () => {
                    if (sync) {
                        let insertLis = [], updateLis = [], deleteLis = [];
                        Object.keys(doc).forEach(key => {
                            if ("undefined" !== typeof magic_v[key]) {
                                var mainKey = {};
                                mainKey[main_key] = key;

                                doc[key]['__tblname'] = tblname;
                                doc[key]['__v'] = magic_v[key];
                                doc[key]['__where'] = DataHelper.getWhereFromMainKey(primaryKey, mainKey);

                                if (magic_v[key] === SqlString.SQL_TYPES().INSERT) {
                                    // add primary key and main key
                                    Object.assign(doc[key], primaryKey);
                                    Object.assign(doc[key], mainKey);
                                    insertLis.push(doc[key]);
                                } else if (magic_v[key] === SqlString.SQL_TYPES().UPDATE) {
                                    // delete primary key and main key when update operation.
                                    delete doc[key][primary_key];
                                    delete doc[key][main_key];
                                    updateLis.push(doc[key]);
                                }
                            }
                        });

                        Object.keys(deletePayload).forEach(key => {
                            var mainKey = {};
                            mainKey[main_key] = key;

                            deletePayload[key]['__tblname'] = tblname;
                            deletePayload[key]['__v'] = SqlString.SQL_TYPES().DELETE;
                            deletePayload[key]['__where'] = DataHelper.getWhereFromMainKey(primaryKey, mainKey);
                            deleteLis.push(deletePayload[key]);
                        });

                        if (insertLis.length > 0) {
                            DbSyncEmitter.emit(EMIT_CHANNELS().DB_SYNC, insertLis);
                        }
                        if (updateLis.length > 0) {
                            DbSyncEmitter.emit(EMIT_CHANNELS().DB_SYNC, updateLis);
                        }
                        if (deleteLis.length > 0) {
                            DbSyncEmitter.emit(EMIT_CHANNELS().DB_SYNC, deleteLis);
                        }
                    }
                    
                    callback(setOk === "OK" && expiresOk === 1);
                });
            });
        });
    }

    static getListElemValJSON(tblname, primaryKey, field, callback)
    {
        DataHelper.loadListValJSONFromDB(tblname, primaryKey, () => {
            cache.hget(DataHelper.getKey(tblname, primaryKey), field).then(value => {
                let fieldValue = null;
                try {
                    fieldValue = JSON.parse(value);
                } catch (e) {
                    logger.Error("[getListElem] JSON.parse is err:", tblname, 
                        JSON.stringify(primaryKey), e);
                }

                logger.Debug("[getListElem] Returns{ data=%s }", value);
                callback(fieldValue);
            });
        });
    }

    static setListElemValJSON(tblname, primaryKey, field, value, callback, sync=true)
    {
        let payload = {}, main_key = data_models[tblname]().__mainkey, mainKey = {};
        Object.keys(value).forEach(field => {
            payload[field] = value[field];
            if (field === main_key) {
                mainKey[main_key] = value[field];
            }
        });
        delete value['__v'];
        payload['__tblname'] = tblname;
        payload['__where'] = DataHelper.getWhereFromMainKey(primaryKey, mainKey);

        cache.hset(DataHelper.getKey(tblname, primaryKey), field, JSON.stringify(value)).then(ok => {
            if (sync) {
                DbSyncEmitter.emit(EMIT_CHANNELS().DB_SYNC, payload);
            }

            callback(ok === "OK");
        });
    }

    static delListElemValJSON(tblname, primaryKey, fields, callback)
    {
        if (fields.length > 0) {
            cache.hdel(DataHelper.getKey(tblname, primaryKey), fields).then(delOk => {
                callback(delOk === 1);
            });
        } else {
            callback(true);
        }
    }

}

module.exports = {
    DataHelper
}