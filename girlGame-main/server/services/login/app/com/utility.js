const { Snowflake } = require('node-snowflake');
const moment = require('moment-timezone');

class KeyGenerator
{
    constructor(datacenterId, workerId)
    {
        this.datacenter_id_ = datacenterId;
        this.worker_id_ = workerId;
    }

    generateKey(sequence)
    {
        return Snowflake.nextId(this.worker_id_, 
            this.datacenter_id_, 
            sequence % 4096);
    }
}

class DateTime
{
    constructor(date=null)
    {
        this.date_ =(date === null ? new Date() : new Date(date));
    }

    toDateTimeString(fmt='YYYY-MM-DD HH:mm:ss')
    {
        return moment(this.date_).format(fmt);
    }
}

module.exports = {
    DateTime,
    KeyGenerator
}