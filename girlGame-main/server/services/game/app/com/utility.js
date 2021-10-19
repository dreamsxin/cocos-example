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
            sequence);
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

function ArrayShuffle(a) {
    var len = a.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = a[index];
        a[index] = a[len - i - 1];
        a[len - i - 1] = temp;
    }

    return a;
}

function random(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomClassic(lis, weightTotal=100) {
    let total = 0;
    for (let v of lis) { // lis = [{id, weight}, ...]
        var seed = random(1, weightTotal - total);
        if (seed <= v.weight) {
            return v.id;
        }

        total += v.weight;
    }

    return 0; // 正常概率不会出现这种情况
}

function isToday(t1, t2)
{
    return (t1.getFullYear() === t2.getFullYear() &&
        t1.getMonth() === t2.getMonth() &&
            t1.getDate() === t2.getDate());
}

module.exports = {
    DateTime,
    KeyGenerator,
    ArrayShuffle,
    random,
    randomClassic,
    isToday
}