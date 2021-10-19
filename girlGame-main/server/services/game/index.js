const { serverConfig, logger } = require('./app/app');

logger.Info("* Running on ws://%s:%s/ (Press CTRL+C to quit)", 
    serverConfig.host, serverConfig.port);