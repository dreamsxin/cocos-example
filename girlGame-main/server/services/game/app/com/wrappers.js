/************************************************************
 * HttpWrapper
 ************************************************************/
const fetch = require('node-fetch');
const bluebird = require('bluebird');
fetch.Promise = bluebird;

class HttpWrapper
{
    static get(url, params, json=true)
    {
        if (params) {  
            let paramsArray = [];  
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
            if (url.search(/\?/) === -1) {  
                url += '?' + paramsArray.join('&');
            } else {  
                url += '&' + paramsArray.join('&');
            }  
        }
        return fetch(url).then(res => json ? res.json() : res.text());
    }

    static post(url, params)
    {
        return fetch(url, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => res.json());
    }
}

/************************************************************
 * PacketWrapper
 ************************************************************/
// const { deflate, unzip } = require('zlib');
const CODE_OFFSET = 4;
const BODY_LENGTH_OFFSET = 4;

class PacketWrapper
{
    static unpack(bytes)
    {
        return new Promise((resolve, reject) => {
            const code = bytes.readUInt32BE(0);
            const bodyLength = bytes.readUInt32BE(CODE_OFFSET);
            const body = bytes.slice((CODE_OFFSET + BODY_LENGTH_OFFSET),
                (CODE_OFFSET + BODY_LENGTH_OFFSET) + bodyLength);
            //unzip(body, (err, buffer) => {
            //    if (err) {
            //        reject(err);
            //    } else {
                    try {
                        resolve({
                            code: code,
                            body: JSON.parse(body.toString())
                        });
                    } catch (e) {
                        reject(e);
                    }
            //    }
            //});
        });
    }

    static pack(payload) // payload={ code, body }
    {
        return new Promise((resolve, reject) => {
            //deflate(JSON.stringify(payload.body), (err, buffer) => {
            //    if (err) {
            //        reject(err);
            //    } else {
                    try {
                        const body = Buffer.from(JSON.stringify(payload.body), 'utf8');
                
                        const header = Buffer.alloc(CODE_OFFSET + BODY_LENGTH_OFFSET, 0);
                        header.writeInt32BE(payload.code, 0);
                        header.writeInt32BE(body.length, CODE_OFFSET);
            
                        const packet = Buffer.concat([header, body], 
                            (CODE_OFFSET+BODY_LENGTH_OFFSET) + body.length);
                        
                        resolve(packet);
                    } catch (e) {
                        reject(e);
                    }
            //    }
            //});
        });
    }
}

/************************************************************
 * ResponseWrapper
 ************************************************************/
class ResponseWrapper
{
    constructor(logger)
    {
        this.logger_ = logger;
        this.code_ = 0;
        this.data_ = null;
        this.errCode_ = 0;    
    }

    getCode()
    {
        return this.code_;
    }

    setCode(code)
    {
        this.code_ = code;
    }

    getData()
    {
        return this.data_;
    }

    setData(data)
    {
        this.data_ = data;
    }

    getErrCode()
    {
        return this.errCode_;
    }

    setErrCode(errCode)
    {
        this.errCode_ = errCode.code;
    }

    toJSON()
    {
        this.logger_.Debug(this.toString());
        return {
            code: this.code_,
            body: {
                errcode: this.errCode_,
                data: this.data_
            }
        }
    }

    toPacket(callback)
    {
        PacketWrapper.pack(this.toJSON()).then(callback);
    }

    toString()
    {
        const util = require('util');
        return util.format("ResponseWrapper{ code=%d, body{ errcode=%d, data=%s } }", 
            this.code_, this.errCode_, JSON.stringify(this.data_));
    }
}

module.exports = {
    HttpWrapper,
    PacketWrapper,
    ResponseWrapper
}