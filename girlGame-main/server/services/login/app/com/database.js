const mysql = require('mysql2');

class SqlString
{
    static SQL_TYPES()
    {
        return {
            INSERT: "insert",
            DELETE: "delete",
            SELECT: "select",
            UPDATE: "update"
        }
    }

    static insertSql(tblname, vals)
    {
        var sql = "INSERT INTO " + tblname + "(";
        if (Array.isArray(vals)) {
            let val = vals[0], 
                keys = Object.keys(val);
            
            keys.forEach((key, index) => {
                sql += "`" + key + '`';
                if ((index + 1) < keys.length) {
                    sql += ", ";
                }
            });

            sql += ") VALUES ";

            vals.forEach((val, vals_index) => {
                keys = Object.keys(val);
                sql += "(";
                keys.forEach((key, index) => {
                    if ("string" === typeof val[key]) {
                        // string
                        sql += "'" + val[key] + "'";
                    } else {
                        // number
                        sql += "" + val[key] + "";
                    }

                    if ((index + 1) < keys.length) {
                        sql += ", ";
                    }
                });
                sql += ")";

                if ((vals_index + 1) < vals.length) {
                    sql += ",";
                }
            });
        } else {
            let val = vals,
                keys = Object.keys(val);
            
            keys.forEach((key, index) => {
                sql += "`" + key + '`';
                if ((index + 1) < keys.length) {
                    sql += ", ";
                }
            });

            sql += ") VALUES ";

            keys = Object.keys(val);
            sql += "(";
            keys.forEach((key, index) => {
                if ("string" === typeof val[key]) {
                    // string
                    sql += "'" + val[key] + "'";
                } else {
                    // number
                    sql += "" + val[key] + "";
                }

                if ((index + 1) < keys.length) {
                    sql += ", ";
                }
            });
            sql += ")";
        }
        
        return sql;
    }

    static deleteSql(tblname, where)
    {
        var sql = "DELETE FROM `" + tblname + "`";
        sql = SqlString.getWhere(sql, where);

        return sql;
    }

    static selectSql(tblname, query, where)
    {
        var sql = "SELECT ";
        var keys = Object.keys(query);
        keys.forEach((key, index) => {
            sql += "`" + key + "`";
            if ((index + 1) < keys.length) {
                sql += ",";
            }
        });
        sql += " FROM `" + tblname + "`";
        sql = SqlString.getWhere(sql, where);

        return sql;
    }

    static updateSql(tblname, sets, where)
    {
        var sql = "UPDATE `" + tblname + "` SET ";
        var keys = Object.keys(sets);
        keys.forEach((key, index) => {
            sql += "`" + key + "`=";
            if ("string" === typeof sets[key]) {
                sql += "'" + sets[key] + "'";
            } else {
                sql += sets[key].toString();
            }
            if ((index + 1) < keys.length) {
                sql += ", ";
            }
        });

        sql = SqlString.getWhere(sql, where);

        return sql;
    }

    static getWhere(sql, where)
    {
        // example: where={ id: ">3", _factor: "or", "score": "=5" }
        if (where !== null && 'object' === typeof where) {
            var keys = Object.keys(where);
            if (keys.length > 0) {
                sql += " WHERE ";
            }
            keys.forEach(key => {
                if (key === '_factor') {
                    sql += " " + where[key] + " ";
                } else {
                    sql += "`" + key + "`" + where[key];
                }
            });
        }

        return sql;
    }
}

class Database
{
    constructor(config, logger)
    {
        this.logger_ = logger;
        try {
            this.pool_ = mysql.createPool(config);
            if (this.pool_) { 
                this.logger_.Info("Mysql connection pool created success: %s@%s:%d/%s, limit: %d",
                    config.user, config.host, config.port, 
                    config.database, 
                    config.connectionLimit);
            }
        } catch (e) {
            this.logger_.Error(e);
            process.exit(-1);
        }
    }

    destroy()
    {
        this.pool_.end();
    }

    execute(sql)
    {
        return new Promise((resolve, reject) => {
            this.pool_.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    conn.query(sql, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }

                        conn.release();
                    });
                }
            });
        });
    }

    insert(tblname, vals)
    {
        var sql = SqlString.insertSql(tblname, vals);
        return this.execute(sql);
    }

    delete(tblname, where={})
    {
        var sql = SqlString.deleteSql(tblname, where);

        this.logger_.Debug("sql delete:", sql);

        return this.execute(sql);
    }

    select(tblname, query, where={})
    {
        var sql = SqlString.selectSql(tblname, query, where);

        this.logger_.Debug("sql select:", sql);

        return this.execute(sql);
    }

    update(tblname, sets, where={})
    {
        var sql = SqlString.updateSql(tblname, sets, where);

        this.logger_.Debug("sql update:", sql);

        return this.execute(sql);
    }
}

module.exports = {
    SqlString,
    Database
};