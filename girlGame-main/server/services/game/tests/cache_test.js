const serverConfig = require('./../configs/server.dev.json')

const Logger = require('./../app/com/logger');
const logger = new Logger(serverConfig.log);
const Cache = require('./../app/com/cache');
cache = new Cache(serverConfig.cache.redis, logger);
cache.hmset("player_quests:1322468094811181056", { player_id: '1322468094811181056', unlock_data: '[]' }).then(ok => {
    console.log(ok);
});