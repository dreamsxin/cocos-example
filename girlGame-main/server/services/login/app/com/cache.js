const redis = require('redis');
const { promisify } = require('util');

class Cache
{
    constructor(config, logger)
    {
        this.logger_ = logger;
        try {
            this.cache_ = redis.createClient(config);
            this.logger_.Info("Redis connection success: %s:%d", config.host, config.port);
        } catch (e) {
            this.logger_.Error(e);
            process.exit(-1);
        }

        if (config.pass !== "") {
            this.cache_.auth(config.pass);
        }

        this.cache_.on('error', (err) => {
            this.logger_.Error(err);
        });
    }

    del(keys)
    {
        const delAsync = promisify(this.cache_.del).bind(this.cache_);
        return delAsync(keys);
    }

    exists(key)
    {
        const existsAsync = promisify(this.cache_.exists).bind(this.cache_);
        return existsAsync(key);
    }

    expire(key, seconds)
    {
        const expireAsync = promisify(this.cache_.expire).bind(this.cache_);
        return expireAsync(key, seconds);
    }

    ttl(key)
    {
        const ttlAsync = promisify(this.cache_.ttl).bind(this.cache_);
        return ttlAsync(key);
    }

    sort(key)
    {
        const ttlAsync = promisify(this.cache_.sort).bind(this.cache_);
        return ttlAsync(key);
    }

    eval(cmdstr)
    {
        const evalAsync = promisify(this.cache_.eval).bind(this.cache_);
        return evalAsync(cmdstr);
    }

    // STRING
    get(key)
    {
        const getAsync = promisify(this.cache_.get).bind(this.cache_);
        return getAsync(key);
    }

    set(key, value)
    {
        const setAsync = promisify(this.cache_.set).bind(this.cache_);
        return setAsync(key, value);
    }

    incr(key)
    {
        const incrAsync = promisify(this.cache_.incr).bind(this.cache_);
        return incrAsync(key);
    }

    incrby(key, value)
    {
        const incrbyAsync = promisify(this.cache_.incrby).bind(this.cache_);
        return incrbyAsync(key, value);
    }

    // HASH
    hgetall(key)
    {
        const hgetallAsync = promisify(this.cache_.hgetall).bind(this.cache_);
        return hgetallAsync(key);
    }

    hdel(key, fields)
    {
        const hdelAsync = promisify(this.cache_.hdel).bind(this.cache_);
        return hdelAsync(key, fields);
    }

    hexists(key, field)
    {
        const hexistsAsync = promisify(this.cache_.hexists).bind(this.cache_);
        return hexistsAsync(key, field);
    }

    hget(key, field)
    {
        const hgetAsync = promisify(this.cache_.hget).bind(this.cache_);
        return hgetAsync(key, field);
    }

    hset(key, field, value)
    {
        const hsetAsync = promisify(this.cache_.hset).bind(this.cache_);
        return hsetAsync(key, field, value);
    }

    hincrby(key, field, value)
    {
        const hincrbyAsync = promisify(this.cache_.hincrby).bind(this.cache_);
        return hincrbyAsync(key, field, value);
    }

    hkeys(key)
    {
        const hkeysAsync = promisify(this.cache_.hkeys).bind(this.cache_);
        return hkeysAsync(key);
    }

    hvals(key)
    {
        const hvalsAsync = promisify(this.cache_.hvals).bind(this.cache_);
        return hvalsAsync(key);
    }

    hmget(key, fields)
    {
        const hmgetAsync = promisify(this.cache_.hmget).bind(this.cache_);
        return hmgetAsync(key, fields);
    }

    hmset(key, tables)
    {
        const hmsetAsync = promisify(this.cache_.hmset).bind(this.cache_);
        return hmsetAsync(key, tables);
    }

    // LIST
    lindex(key, index)
    {
        const lindexAsync = promisify(this.cache_.lindex).bind(this.cache_);
        return lindexAsync(key, index);
    }

    linsert(key, dir, pivot, value)
    {
        const linsertAsync = promisify(this.cache_.linsert).bind(this.cache_);
        return linsertAsync(key, dir, pivot, value);
    }

    llen(key)
    {
        const llenAsync = promisify(this.cache_.llen).bind(this.cache_);
        return llenAsync(key);
    }

    lpush(key, values)
    {
        const lpushAsync = promisify(this.cache_.lpush).bind(this.cache_);
        return lpushAsync(key, values);
    }

    lpushx(key, value)
    {
        const lpushxAsync = promisify(this.cache_.lpushx).bind(this.cache_);
        return lpushxAsync(key, value);
    }

    lpop(key)
    {
        const lpopAsync = promisify(this.cache_.lpop).bind(this.cache_);
        return lpopAsync(key);
    }

    lrange(key, start, stop)
    {
        const lrangeAsync = promisify(this.cache_.lrange).bind(this.cache_);
        return lrangeAsync(key, start, stop);
    }

    lrem(key, count, value)
    {
        const lremAsync = promisify(this.cache_.lrem).bind(this.cache_);
        return lremAsync(key, count, value);
    }

    lset(key, index, value)
    {
        const lsetAsync = promisify(this.cache_.lset).bind(this.cache_);
        return lsetAsync(key, index, value);
    }

    ltrim(key, start, stop)
    {
        const ltrimAsync = promisify(this.cache_.ltrim).bind(this.cache_);
        return ltrimAsync(key, start, stop);
    }

    rpush(key, values)
    {
        const rpushAsync = promisify(this.cache_.rpush).bind(this.cache_);
        return rpushAsync(key, values);
    }
    
    rpushx(key, value)
    {
        const rpushxAsync = promisify(this.cache_.rpushx).bind(this.cache_);
        return rpushxAsync(key, value);
    }

    rpop(key)
    {
        const rpopAsync = promisify(this.cache_.rpop).bind(this.cache_);
        return rpopAsync(key);
    }

    rpoplpush(source, destination)
    {
        const rpoplpushAsync = promisify(this.cache_.rpoplpush).bind(this.cache_);
        return rpoplpushAsync(source, destination);
    }

    // SET
    sadd(key, members)
    {
        const saddAsync = promisify(this.cache_.sadd).bind(this.cache_);
        return saddAsync(key, members);
    }

    scard(key)
    {
        const scardAsync = promisify(this.cache_.scard).bind(this.cache_);
        return scardAsync(key);
    }

    sdiff(keys)
    {
        const sdiffAsync = promisify(this.cache_.sdiff).bind(this.cache_);
        return sdiffAsync(keys);
    }

    sdiffstore(destination, keys)
    {
        const sdiffstoreAsync = promisify(this.cache_.sdiffstore).bind(this.cache_);
        return sdiffstoreAsync(destination, keys);
    }

    sinter(keys)
    {
        const sinterAsync = promisify(this.cache_.sinter).bind(this.cache_);
        return sinterAsync(keys);
    }

    sinterstore(destination, keys)
    {
        const sinterstoreAsync = promisify(this.cache_.sinterstore).bind(this.cache_);
        return sinterstoreAsync(destination, keys);
    }

    sismember(keys)
    {
        const sismemberAsync = promisify(this.cache_.sismember).bind(this.cache_);
        return sismemberAsync(keys);
    }

    sismember(keys)
    {
        const smembersAsync = promisify(this.cache_.smembers).bind(this.cache_);
        return smembersAsync(keys);
    }

    smove(source, destination, member)
    {
        const smoveAsync = promisify(this.cache_.smove).bind(this.cache_);
        return smoveAsync(source, destination, member);
    }
    
    spop(key)
    {
        const spopAsync = promisify(this.cache_.spop).bind(this.cache_);
        return spopAsync(key);
    }

    srandmember(key, count)
    {
        const srandmemberAsync = promisify(this.cache_.srandmember).bind(this.cache_);
        return srandmemberAsync(key, count);
    }

    srem(key, members)
    {
        const sremAsync = promisify(this.cache_.srem).bind(this.cache_);
        return sremAsync(key, members);
    }

    sunion(keys)
    {
        const sunionAsync = promisify(this.cache_.sunion).bind(this.cache_);
        return sunionAsync(keys);
    }

    sunionstore(destination, keys)
    {
        const sunionstoreAsync = promisify(this.cache_.sunionstore).bind(this.cache_);
        return sunionstoreAsync(destination, keys);
    }

    // SORTED SET
    zadd(key, members)
    {
        const zaddAsync = promisify(this.cache_.zadd).bind(this.cache_);
        return zaddAsync(key, members);
    }

    zcard(key)
    {
        const zcardAsync = promisify(this.cache_.zcard).bind(this.cache_);
        return zcardAsync(key);
    }

    zcount(key, min, max)
    {
        const zcountAsync = promisify(this.cache_.zcount).bind(this.cache_);
        return zcountAsync(key, min, max);
    }

    zincrby(key, increment, member)
    {
        const zincrbyAsync = promisify(this.cache_.zincrby).bind(this.cache_);
        return zincrbyAsync(key, increment, member);
    }

    zrange(key, start, stop)
    {
        const zrangeAsync = promisify(this.cache_.zrange).bind(this.cache_);
        return zrangeAsync(key, start, stop);
    }

    zrangebyscore(key, min, max)
    {
        const zrangeAsync = promisify(this.cache_.zrangebyscore).bind(this.cache_);
        return zrangeAsync(key, min, max);
    }

    zrank(key, member)
    {
        const zrankAsync = promisify(this.cache_.zrank).bind(this.cache_);
        return zrankAsync(key, member);
    }

    zrem(key, members)
    {
        const zremAsync = promisify(this.cache_.zrem).bind(this.cache_);
        return zremAsync(key, members);
    }

    zrevrange(key, start, stop)
    {
        const zrevrangeAsync = promisify(this.cache_.zrevrange).bind(this.cache_);
        return zrevrangeAsync(key, start, stop);
    }

    zrevrank(key, member)
    {
        const zrevrankAsync = promisify(this.cache_.zrevrank).bind(this.cache_);
        return zrevrankAsync(key, member);
    }

    zscore(key, member)
    {
        const zscoreAsync = promisify(this.cache_.zscore).bind(this.cache_);
        return zscoreAsync(key, member);
    }

    // TRANSACTION
    commit(keys, cmds)
    {
        /**
         * keys = ['key_1', 'key_2', ...]
         * cmds = [
         *      ['set', 'key_1', 'value_1' ],
         *      ['incr', 'key_1']
         *      ['get', 'key_1']
         * ]
         */
        return new Promise((resolve, reject) => {
            this.cache_.watch(keys, () => {
                this.cache_.multi(cmds).exec((err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        this.cache_.unwatch(() => {
                            resolve(results);
                        });
                    }
                });
            });
        });
    }
}

module.exports = Cache;