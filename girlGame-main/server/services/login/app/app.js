function isDev() { return process.env.NODE_ENV === 'development'; }
const serverConfig = isDev() ? require('./../configs/server.dev.json') :
    require('./../configs/server.prod.json');
const serverListConfig = require('./../configs/serverlist.json');
const errCodes = require('./defs/error.codes');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');

// Application
const app = express();

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        res.status(200).send();
    } else {
        next();
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

// redirect to https
app.post('*', (req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https' && !isDev()) {
        res.redirect('https://' + req.hostname + req.url);
    } else {
        next();
    }
});

// Logs
const Logger = require('./com/logger');
const logger = new Logger(serverConfig.log);
app.use((req, res, next) => {
    logger.Debug("- " + req.method + " -", 
        req.url, 
        req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body));
    
    next();
});

// key generator
const { KeyGenerator } = require('./com/utility');
const keyGenerator = new KeyGenerator(serverConfig.datacenterId,
    serverConfig.workerId);

// Cache
let cache = null;
if (serverConfig.cache.enabled) {
    const Cache = require('./com/cache');
    cache = new Cache(serverConfig.cache.redis, logger);
} else {
    logger.Warn("Cache driver not used.");
}

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
    mq = new RabbitMQ(serverConfig.mq.sync, logger);
} else {
    logger.Warn("RabbitMQ driver not used.");
}

// Routes
setImmediate(() => {
    const routes = require('./routes');
    routes(app);
});

// SSL
if (serverConfig.ssl.enabled) {
    const fs = require('fs');
    app.set('sslOptions', {
        key: fs.readFileSync(serverConfig.ssl.key),
        cert: fs.readFileSync(serverConfig.ssl.cert)
    });
}

// Timezone
const moment = require('moment-timezone');
moment.tz.setDefault(serverConfig.timezone);

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
    serverListConfig,
    errCodes,
    logger,
    keyGenerator,
    cache,
    db,
    mq,
    app
};