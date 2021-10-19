const util = require('util');
const fs = require('fs');

function p (n, s) { return ('0000' + s).substr(-n); }
function logDate() {
    let dt = new Date();
    return util.format('%s-%s-%s %s:%s:%s.%s', 
        dt.getFullYear(),
        p(2, dt.getMonth() + 1),
        p(2, dt.getDate()),
        p(2, dt.getHours()),
        p(2, dt.getMinutes()),
        p(2, dt.getSeconds()),
        p(3, dt.getMilliseconds()));
}

function LOG_LEVELNO()
{
    return {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    }
}

class LoggerWrapper
{
    // debug｜info｜warn｜error
    constructor(config) {
        this.levelNo_ = LOG_LEVELNO()[config.level];
        if (config.fileMode) {
            this.stdout_ = fs.createWriteStream(config.outFile, config.options);
            this.stderr_ = fs.createWriteStream(config.errFile, config.options);
            this.logger_ = new console.Console(this.stdout_, this.stderr_);
        } else {
            this.stdout_ = process.stdout;
            this.stderr_ = process.stderr;
            this.logger_ = new console.Console({ stdout: process.stdout, stderr: process.stderr });
        }
    }

    Debug(...args)
    {
        if (this.levelNo_ <= LOG_LEVELNO().debug) {
        	this.stdout_.write(util.format('[%s][DBG] ', logDate()));
            this.logger_.log(...args);
        }
    }

    Info(...args)
    {
        if (this.levelNo_ <= LOG_LEVELNO().info) {
        	this.stdout_.write(util.format('[%s][INF] ', logDate()));
            this.logger_.info(...args);
        }
    }

    Warn(...args)
    {
        if (this.levelNo_ <= LOG_LEVELNO().warn) {
        	this.stderr_.write(util.format('[%s][WRN] ', logDate()));
            this.logger_.warn(...args);
        }
    }

    Error(...args)
    {
        if (this.levelNo_ <= LOG_LEVELNO().error) {
            this.stderr_.write(util.format('[%s][ERR] ', logDate()));
            this.logger_.error(...args);
        }
    }

    Time(label)
    {
        if (this.levelNo_ <= LOG_LEVELNO().debug) {
            this.logger_.time(label);
        }
    }

    TimeEnd(label)
    {
        if (this.levelNo_ <= LOG_LEVELNO().debug) {
            this.logger_.timeEnd(label);
        }
    }
}

module.exports = LoggerWrapper;