function isDev() { return process.env.NODE_ENV === 'development'; };
const serverConfig = isDev() ? require('./../configs/server.dev.json') :
    require('./../configs/server.prod.json');
const errCodes = require('./defs/error.codes');

// logger
const Logger = require('./com/logger');
const logger = new Logger(serverConfig.log);

// key generator
const { KeyGenerator } = require('./com/utility');
const keyGenerator = new KeyGenerator(serverConfig.workerId, 
    serverConfig.datacenterId);

// cache driver
let cache = null;
if (serverConfig.cache.enabled) {
    const Cache = require('./com/cache');
    cache = new Cache(serverConfig.cache.redis, logger);
} else {
    logger.Warn("Cache driver not used.");
}

// database driver
let db = null;
if (serverConfig.db.enabled) {
    const { Database } = require('./com/database');
    db = new Database(serverConfig.db.mysql, logger);
} else {
    logger.Warn("Database driver not used.");
}

// MQ
let mq = null;
if (serverConfig.mq.enabled) {
    const RabbitMQ = require('./com/rabbitmq');
    mq = new RabbitMQ(serverConfig.mq.sync, logger);
} else {
    logger.Warn("RabbitMQ driver not used.");
}

// routes
const routes = require('./defs/routes.map');
const Router = require('./router');
const router = new Router(routes, logger);

// main progress
const Server = require('./server');
const serve = new Server(serverConfig, logger);
serve.run(router);

// crontab
setImmediate(() => {
    if (serverConfig.cron.enabled) {
        const { CronJob } = require('cron');
        const cronTabs = require('./defs/crontab.map');
        cronTabs.forEach(job => {
            new CronJob(job.time, () => {
                job.fn();
            }, null, true);    
        });
    }
});

// hot patch
setImmediate(() => {
    if (serverConfig.hotPatch.enabled) {
        const HotPatch = require('./com/hotpatch');
        serverConfig.hotPatch.dirs.forEach(path => {
            new HotPatch(logger)
                    .watchFiles(path);
        });
    }
});

// Timezone
const moment = require('moment-timezone');
moment.tz.setDefault(serverConfig.timezone);

function Shutdown()
{
    if (db) {
        db.destroy();
        logger.Info("Database destroy done.");
    }
    serve.shutdown();
    logger.Info("Server is shutdown done.");
}

// signal
process.on('SIGINT', () => {
    Shutdown();
    process.exit(0);
});
process.on('SIGTERM', () => {
    Shutdown();
    process.exit(0);
});

module.exports = {
    serverConfig,
    errCodes,
    logger,
    cache,
    db,
    mq,
    keyGenerator,
    serve
}