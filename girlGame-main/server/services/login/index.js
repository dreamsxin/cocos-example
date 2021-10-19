const http = require('http');
const { app, serverConfig, logger } = require('./app/app');

http.createServer(app).listen(serverConfig.port, serverConfig.host, () => {
    logger.Info("Running on http://%s:%s/ (Press CTRL+C to quit)", 
        serverConfig.host, serverConfig.port);
});
if (serverConfig.ssl.enabled) {
    const https = require('https');
    const sslOptions = app.get('sslOptions');
    https.createServer(sslOptions, app).listen(443);
}
