const EventEmitter = require('events');
const { logger, db, mq } = require('./../app');

class MQEmitter extends EventEmitter {};
const SyncEmitter = new MQEmitter();

SyncEmitter.on('dbsync', (ch, msg) => {
    if (msg !== null) {
        let sql = msg.content.toString();
        logger.Debug("MQ sync to db:", sql);
        db.execute(sql).then(() => {
            ch.ack(msg);
        }).catch(e => {
            // 确认消息队列但将这条错误的SQL语句写入错误文件，之后需要手动修改
            // 还有需要将缓存中的数据失效时间提高以防数据库数据查询不到而缓存又失效的情景
            ch.ack(msg);
            logger.Error("DB executing sql string failed:", sql, e);
        });
    }
});

class CacheDbSync
{
    constructor()
    {

    }

    run()
    {
        mq.read((ch, msg) => {
            SyncEmitter.emit('dbsync', ch, msg);
        });
    }
}

module.exports = {
    CacheDbSync
}