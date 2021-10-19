function isDev() { return process.env.NODE_ENV === 'development'; }
const serverConfig = isDev() ? require('./../configs/sync.dev.json') :
    require('./../configs/sync.prod.json');

// Logs
const Logger = require('./com/logger');
const logger = new Logger(serverConfig.log);

// Database
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
    mq = new RabbitMQ(serverConfig.mq.rabbitmq, logger);
} else {
    logger.Warn("RabbitMQ driver not used.");
}

function Shutdown()
{
    if (db) {
        db.destroy();
        logger.Info("Database destroy done.");
    }
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

// Exports
module.exports = {
    serverConfig,
    logger,
    db,
    mq
};