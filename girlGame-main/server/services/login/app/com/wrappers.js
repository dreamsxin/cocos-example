class ResponseWrapper
{
    constructor(logger)
    {
        this.logger_ = logger;
        this.errcode_ = 0;
        this.data_ = {};
    }

    getErrCode()
    {
        return this.errcode_;
    }

    setErrCode(errCode)
    {
        this.errcode_ = errCode.code;
    }

    getData()
    {
        return this.data_;
    }

    setData(data)
    {
        this.data_ = data;
    }

    toJSON()
    {
        this.logger_.Debug(this.toString());

        this.data_['errcode'] = this.errcode_;
        return this.data_;
    }
    
    toString()
    {
        const util = require('util');
        return util.format("ResponseWrapper{ errcode=%d, data=%s }", this.errcode_, JSON.stringify(this.data_));
    }
}

module.exports = {
    ResponseWrapper
};