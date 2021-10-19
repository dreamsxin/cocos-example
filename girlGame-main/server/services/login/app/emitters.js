const EventEmitter = require('events');

function EMIT_CHANNELS()
{
    return {
        DB_SYNC: "dbsync"
    }
}

/************************************************************
 * MQ
 ************************************************************/
const { mq, logger, serverConfig } = require('./app');
const { SqlString } = require('./com/database');
class MQEmitter extends EventEmitter {};
const DbSyncEmitter = new MQEmitter();
DbSyncEmitter.on(EMIT_CHANNELS().DB_SYNC, (data) => {
    const _doPublishing = (payload) => {
        // Get magic variables.
        let tblname = payload.__tblname,
        sqltype = payload.__v,
        where = payload.__where;

        // Delete magic variables
        delete payload.__tblname;
        delete payload.__v;
        delete payload.__where;

        if (tblname && sqltype) {
            // Payload translate into sql string.
            let sql = null;
            if (sqltype === SqlString.SQL_TYPES().INSERT) {
                sql = SqlString.insertSql(tblname, payload);
            } else if (sqltype === SqlString.SQL_TYPES().DELETE) {
                sql = SqlString.deleteSql(tblname, where)
            } else if (sqltype === SqlString.SQL_TYPES().UPDATE) {
                sql = SqlString.updateSql(tblname, payload, where)
            }else {
                logger.Warn("Unknown MQ sql type: %s", sqltype);
            }

            if ('string' === typeof sql) {
                // Send sql string to message queue.
                mq.send(sql);
                logger.Debug("MQ payload sql string: %s", sql);
            }
        } else {
            logger.Warn("Unknown MQ payload: %s", JSON.stringify(payload));
        }
    }

    logger.Debug("MQ payload: %s", JSON.stringify(data));

    if (Array.isArray(data)) {
        data.forEach(payload => {
            _doPublishing(payload);
        });
    } else {
        _doPublishing(data);
    }
});

module.exports = {
    EMIT_CHANNELS,
    DbSyncEmitter
}