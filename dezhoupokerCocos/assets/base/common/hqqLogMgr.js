
// 日志里不要有分号； 因为日志服务器会根据分号分割消息，导致分号后的消息丢失或切割了
let hqqHttp = require("hqqHttp");
let logManager = {
    isRealTimeLog: true, // 是否在控制台实时打印
    logMaxLine: 100, // 最大的打印行数
    depth: 0,
    parentSizes: [0],
    currentResult: '',
    output: '', // 全部日志
    eoutput: '', // 错误日志
    poutput: [], // 前面5条错误日志
    serverUrl: null,
    tag: "\r\n",
    logpath: "",
    _times: {},
    canSend: true, // 是否可以发送日志
    waitTime: 10000, // 10秒
    sendfailtag: 0,
    /**
     * 初始化
     */
    init: function () {
        this.output = JSON.parse(cc.sys.localStorage.getItem('log'))
        this.eoutput = JSON.parse(cc.sys.localStorage.getItem('elog'))
        cc.sys.localStorage.setItem("log", JSON.stringify(""))
        cc.sys.localStorage.setItem("elog", JSON.stringify(""))

        window.addEventListener('error', (e) => {
            // console.log("error")
            this.logerror(e);
        })
        window.addEventListener('unhandledrejection', (e) => {
            // console.log("unhandledrejection")
            this.logerror(e);
        })
        return this;
    },
    // 发送特定的日志 data为字符串
    sendMLog(data) {
        // console.log("__logMgr__", data);
        this.send(data, true);
    },
    // 立即发送日志
    sendLog() {
        let temp = this.output
        this.output = ""
        this.send(temp, true);
    },
    // 立即发送错误日志
    sendError() {
        let temp = this.eoutput
        this.eoutput = ""
        this.send(temp);
    },
    /** 向服务器发送日志 */
    send: function (logstr, islog) {
        if (!this.canSend) {
            return
        }
        if (hqq.gameGlobal.token != "") {
            this.serverUrl = hqq.app.server + "/Game/User/log";
            let data = {
                token: hqq.gameGlobal.token,
                type: islog ? "log" : "error",
                id: hqq.gameGlobal.player.id + '',
                msg: logstr,
                package_name: hqq.app.packgeName,
                device_id: hqq.app.deviceID,
            }
            this.serverUrl && hqqHttp.sendRequestLogPost(this.serverUrl, data, null, (bool, filepath, err) => {
                if (bool) {
                    this.sendfailtag = 0
                } else {
                    this.log("日志发送失败", err)
                    this.setDelaySend()
                    this.sendfailtag++
                    if (islog) {
                        if (this.sendfailtag >= 3) {
                            this.output = logstr + this.tag;
                        } else {
                            this.output += logstr + this.tag;
                        }
                        this.output += this.getNowTime() + ":日志发送失败" + this.tag;
                    } else {
                        this.eoutput = logstr + this.tag;
                        this.eoutput += this.getNowTime() + ":日志发送失败" + this.tag;
                    }
                }
            });
        } else {
            console.log("未请求到token")
            this.setDelaySend()
            this.sendfailtag++
            if (islog) {
                if (this.sendfailtag >= 3) {
                    this.output = logstr + this.tag;
                } else {
                    this.output += logstr + this.tag;
                }
                this.output += this.getNowTime() + ":未请求到token" + this.tag;
            } else {
                this.eoutput = logstr + this.tag;
                this.eoutput += this.getNowTime() + ":未请求到token" + this.tag;
            }
        }
    },
    setDelaySend() {
        this.canSend = false
        setTimeout(() => {
            this.canSend = true
        }, this.waitTime);
    },
    time(str) {
        this._times[str] = Date.now();
    },
    timeEnd(str) {
        let data = ""
        for (let i = 0; i < arguments.length; i++) {
            data += arguments[i] + " "
        }
        var time = this._times[str];
        if (!time) {
            return
        }
        var duration = Date.now() - time;
        this.log(data, duration, "ms");
        delete this._times[str] // 删除释放
    },
    /**
     * 正常打印，注意：只会打印字符串
     * @return: 
     */
    log: function () {
        let data = ""
        for (let i = 0; i < arguments.length; i++) {
            data += arguments[i] + " "
        }
        this.isRealTimeLog && console.log("__logMgr__", data);
        this.output += this.getNowTime() + ":" + data + this.tag;
        this.logCheck();
    },
    /**
     * 报错信息捕获打印
     * @param {ErrorEvent} data
     * @return: 
     */
    logerror: function (data) {
        this.isRealTimeLog && console.log(data);
        if (data.error && data.error.stack) {
            var err = data.error.stack + this.tag;
            for (let i = 0; i < this.poutput.length; i++) {
                let out = this.poutput[i]
                let pre = out.substring(out.indexOf(":") + 1)
                if (err == pre) {
                    console.log("重复的错误日志")
                    return
                }
            }
            err = this.getNowTime() + ":" + err;
            this.eoutput += err;
            if (this.poutput.length == 5) {
                this.poutput.shift();
                this.poutput.push(err);
            } else {
                this.poutput.push(err);
            }
            this.elogCheck();
        }
    },
    saveLog: function () {
        cc.sys.localStorage.setItem("log", JSON.stringify(this.output))
        cc.sys.localStorage.setItem("elog", JSON.stringify(this.eoutput))
    },
    getNowTime: function () {
        let date = new Date();
        let strYear = date.getFullYear();
        let month = date.getMonth();
        let strMonth = (9 > month ? "0" + (month + 1) : month + 1);
        let day = date.getDate();
        let strDay = (10 > day ? "0" + day : day);
        let hour = date.getHours();
        let strHour = (hour < 10 ? "0" + hour : hour);
        let minute = date.getMinutes();
        let strMinute = (minute < 10 ? "0" + minute : minute);
        let second = date.getMinutes();
        let strSecond = (second < 10 ? "0" + second : second);
        let str = strYear + "-" + strMonth + "-" + strDay + " " + strHour + ":" + strMinute + ":" + strSecond
        return str;
    },
    logCheck: function () {
        let lines = this.output.split(this.tag);
        if (lines.length > this.logMaxLine) {
            let temp = this.output
            this.output = ""
            this.send(temp, true);
        }
    },
    elogCheck: function () {
        let lines = this.eoutput.split(this.tag);
        if (lines.length > this.logMaxLine) {
            let temp = this.eoutput
            this.eoutput = ""
            this.send(temp);
        }
    },

    determineType: function (object) {
        if (object != null) {
            var typeResult;
            var type = typeof object;
            if (type == 'object') {
                var len = object.length;
                if (len == null) {
                    if (typeof object.getTime == 'function') {
                        typeResult = 'Date';
                    }
                    else if (typeof object.test == 'function') {
                        typeResult = 'RegExp';
                    }
                    else {
                        typeResult = 'Object';
                    }
                } else {
                    typeResult = 'Array';
                }
            } else {
                typeResult = type;
            }
            return typeResult;
        } else {
            return null;
        }
    },

    formatType: function (type, obj) {
        if (this.maxDepth && this.depth >= this.maxDepth) {
            return '... (max-depth reached)';
        }

        switch (type) {
            case 'Object':
                let currentResult = '{' + this.tag;
                this.depth++;
                this.parentSizes.push(this.objectSize(obj));
                var i = 0;
                for (var prop in obj) {
                    currentResult += this.indentsForDepth(this.depth);
                    if (prop == "filename" || prop == "message") { // 只截取取报错信息中的这两个
                        currentResult += prop + ': ';
                        var subtype = this.determineType(obj[prop]);
                        var subresult = this.formatType(subtype, obj[prop]);
                        if (subresult) {
                            currentResult += subresult;
                            if (i != this.parentSizes[this.depth] - 1) currentResult += ',';
                            currentResult += this.tag;
                        } else {
                            if (i != this.parentSizes[this.depth] - 1) currentResult += ',';
                            currentResult += this.tag;
                        }
                    }
                    i++;
                }
                this.depth--;
                this.parentSizes.pop();
                currentResult += this.indentsForDepth(this.depth);
                currentResult += '}';
                if (this.depth == 0) {
                    this.currentResult += currentResult;
                    return this.currentResult;
                }
                break;
            case 'Array':
                this.currentResult += '[';
                this.depth++;
                this.parentSizes.push(obj.length);
                let add = false;
                for (var i = 0; i < obj.length; i++) {
                    var subtype = this.determineType(obj[i]);
                    if (subtype == 'Object' || subtype == 'Array') {
                        this.currentResult += this.tag + this.indentsForDepth(this.depth);
                        add = true;
                    }
                    var subresult = this.formatType(subtype, obj[i]);
                    if (subresult) {
                        this.currentResult += subresult;
                        if (i != this.parentSizes[this.depth] - 1) this.currentResult += ', ';
                        if (subtype == 'Array') this.currentResult += this.tag;
                    } else {
                        if (i != this.parentSizes[this.depth] - 1) this.currentResult += ', ';
                        if (subtype != 'Object') this.currentResult += this.tag;
                        else if (i == this.parentSizes[this.depth] - 1) this.currentResult += this.tag;
                    }
                }
                this.depth--;
                this.parentSizes.pop();
                add && (this.currentResult += this.indentsForDepth(this.depth));
                this.currentResult += ']';
                if (this.depth == 0) return this.currentResult;
                break;
            case 'function':
                // obj += '';
                // var lines = obj.split(this.tag);
                // for (var i = 0; i < lines.length; i++) {
                //     if (lines[i].match(/\}/)) this.depth--;
                //     this.currentResult += this.indentsForDepth(this.depth);
                //     if (lines[i].match(/\{/)) this.depth++;
                //     this.currentResult += lines[i] + this.tag;
                // }
                return this.currentResult;
                break;
            case 'RegExp':
                return '/' + obj.source + '/';
                break;
            case 'Date':
            case 'string':
                if (this.depth > 0 || obj.length == 0) {
                    return '"' + obj + '"';
                } else {
                    return obj;
                }
            case 'boolean':
                if (obj) return 'true';
                else return 'false';
            case 'number':
                return obj + '';
                break;
        }
    },
    trimLog: function (log, maxLines) {
        var lines = log.split(this.tag);
        if (lines.length > maxLines) {
            lines = lines.slice(lines.length - maxLines);
        }
        return lines.join(this.tag);
    },
    objectSize: function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    },
    indentsForDepth: function (depth) {
        var str = '';
        for (var i = 0; i < depth; i++) {
            str += '\t';
        }
        return str;
    }
}

module.exports = logManager;