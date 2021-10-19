

let hqqWebSocket = function () { }
hqqWebSocket.prototype = {
    ip: "",
    ws: null,
    pingTime: 0,
    pongTime: 0,
    reConnectTime: 0,
    reConnectDelayTime: 5, // 多久重连一次（秒）
    heartbeatTime: 3, // 心跳间隔（秒）
    closeTime: 9, // 断线判断时间
    events: {},
    handlers: {},
    needRecon: true,
    isConected: false,
    sgjmsg: null,
    isReconnect: false,

    init(param) {
        this.isConected = false;
        this.needRecon = true;
        this.ip = param && param.ip || this.ip;
        this.reConnectTime = param && param.reConnectTime || this.reConnectTime;
        this.reConnectDelayTime = param && param.reConnectDelayTime || this.reConnectDelayTime;
        this.heartbeatTime = param && param.heartbeatTime || this.heartbeatTime;
        this.closeTime = 3 * this.heartbeatTime;
        this.removeAllHandler();
        this.removeAllEvent();
    },
    getIsConnected() {
        return this.isConected
    },
    startPingPong() {
        let self = this
        this.heartbeat = setInterval(() => {
            self.m_checkPingPong();
        }, 1000)
    },
    sendPing() {
        // cc.log("发送心跳")
        this.pingTime = 0;
        this.ws && this.ws.send('');
    },
    connect(param) {
        this.registerAll()
        let url = hqq.app.server;
        if (url.indexOf("://") == -1) {
            url = "ws://" + url;
        } else {
            var socket = url.split("://")[1];
            var header = url.split("://")[0];
            var socketHeader = '';
            if (header == "http") {
                socketHeader = "ws://"
            } else if (header == "https") {
                socketHeader = "ws://"
            }
            url = socketHeader + socket;
        }

        this.ip = param || url
        if (cc.sys.platform === cc.sys.ANDROID || cc.sys.os === cc.sys.OS_ANDROID) { //在浏览器调试中，cc.sys.os === cc.sys.OS_ANDROID 是true  || cc.sys.os == cc.sys.OS_WINDOWS
            if (this.ip.indexOf('wss') == -1 || cc.sys.isBrowser) {
                this.ws = new WebSocket(this.ip);
            } else {
                this.ws = new WebSocket(this.ip, {}, cc.url.raw('resources/hall/cacert.pem'));
            }
        } else {
            this.ws = new WebSocket(this.ip);
        }
        this.ws.onopen = this.m_onopen.bind(this)
        this.ws.onmessage = this.m_onmessage.bind(this)
        this.ws.onerror = this.m_onerror.bind(this)
        this.ws.onclose = this.m_onclose.bind(this)
    },
    sendMessage(name, msg) {
        let data = this.protoDeal.createMsgByName(name, msg);
        (this.ws || cc.log("websocket未初始化")) && this.ws.send(data);
    },
    close() {
        // cc.log("大厅websocket主动断开")
        this.ws && this.ws.close();
        this.needRecon = false;
    },
    register(event, className, callback) {
        if (this.handlers[event] && this.handlers[event][className]) {
            // cc.log("大厅该事件已经监听", event, className)
        } else {
            if (this.handlers[event]) {
                this.handlers[event][className] = callback;
            } else {
                this.handlers[event] = {};
                this.handlers[event][className] = callback;
            }
        }
    },
    unregister(event, className) {
        this.handlers[event] && this.handlers[event][className] && (delete this.handlers[event][className]);
    },
    removeAllHandler() {
        this.handlers = {}
    },
    addEvent(event, callback) {
        this.events[event] || (this.events[event] = []);
        this.events[event].push(callback);
    },
    removeEvent(event) {
        this.events[event] && (this.events[this.events] = null);
    },
    removeAllEvent() {
        this.events = {};
    },
    registerAll() {
        this.register("nologin", "hallWebSocket", this.onReceiveNologin.bind(this)) // 玩家账号离线
        this.register("Broadcast", "hallWebSocket", this.onReceiveBroadcast.bind(this)) // 广播
        this.register("/Game/Login/login", "hallWebSocket", this.onReceiveLogin.bind(this)) // 登陆回调
        this.register("/GameServer/Notice/notice", "hallWebSocket", this.onReceiveNotice.bind(this)) // 跑马灯 下拉框 等
        this.register("/Proxy/Proxy/moveBalanceToGame", "hallWebSocket", this.moveBalanceToGame.bind(this)) // 代理押金转移
        this.register("/GameServer/GameUser/loginout", "hallWebSocket", this.onReceiveLoginout.bind(this)) // 玩家离开子游戏
        this.register("/GameServer/GameUser/login", "hallWebSocket", this.onReceiveLoginSubGame.bind(this)) // 玩家加入子游戏
        this.register("/GameServer/GameUser/changeGameUserBalance", "hallWebSocket", this.onReceiveChangeBanlance.bind(this)) // 用户金额改变
        this.register("/GameServer/GameUser/loseSettlement", "hallWebSocket", this.onReceiveloseSettlement.bind(this)) // 子游戏输结算
        this.register("/GameServer/GameUser/winSettlement", "hallWebSocket", this.onReceivewinSettlement.bind(this)) // 子游戏赢结算
        this.register("/GameServer/GameUser/bankerLoseSettlement", "hallWebSocket", this.onReceivebankerLoseSettlement.bind(this)) // 子游戏庄家输结算
        this.register("/GameServer/GameUser/bankerWinSettlement", "hallWebSocket", this.onReceivebankerWinSettlement.bind(this)) // 子游戏庄家赢结算
    },
    onReceiveNologin(data) { // 账号掉线
        // cc.log(" onReceiveNologin", data)
        hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 6 })
    },
    onReceiveBroadcast(data, msg) {
        // cc.log(" onReceiveBroadcast", msg)
        msg = msg.data.msg
        let message = msg.message;
        let title = msg.send_user.game_nick;
        let mtype = msg.type;
        if (mtype == 1000) { // im 消息
            hqq.gameGlobal.imReceive = 1
            hqq.eventMgr.dispatch(hqq.eventMgr.onReceiveBroadcast, mtype)
            let data = message.replace(/\s+/g, "")
            hqq.eventMgr.dispatch(hqq.eventMgr.showDownTip, { msg: data, nick: title })
        } else if (mtype == 2000) { // 跑马灯
            hqq.eventMgr.dispatch(hqq.eventMgr.addSliderNotice, [{
                time: 1,
                rollforver: false,
                notice: message.replace(/\s+/g, "")
            }])
        } else if (mtype == 2001) { // 下拉框
            let data = message.replace(/\s+/g, "")
            hqq.eventMgr.dispatch(hqq.eventMgr.showDownTip, { msg: data, nick: title })
        } else if (mtype == 2002) { // 下拉框 + 跑马灯
            let data = message.replace(/\s+/g, "")
            hqq.eventMgr.dispatch(hqq.eventMgr.addSliderNotice, [{
                time: 1,
                rollforver: false,
                notice: data
            }])
            hqq.eventMgr.dispatch(hqq.eventMgr.showDownTip, { msg: data, nick: title })
        }
    },
    /** 登陆成功回调 */
    onReceiveLogin(data) {
        // cc.log(" onReceiveLogin", data)
        // hqq.eventMgr.dispatch(hqq.eventMgr.onReceiveLogin, data)
    },
    onReceiveNotice(data) {
        cc.log(" onReceiveNotice", data, data.msg)
    },
    moveBalanceToGame(data, msg) {
        // if (!msg.balance || !msg.game_gold) return;
        let changegold = data.game_gold - hqq.gameGlobal.player.gold
        if (changegold > 0) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showCongratulation, hqq.commonTools.formatGold(changegold))
        }
        hqq.setPlayerinfo({
            game_gold: data.game_gold,
            balance: data.balance,
        })
    },
    onReceivebankerWinSettlement(data) {
        // cc.log(" onReceivebankerWinSettlement", data)
        // hqq.app.setGameInfo(data.game_user)
    },
    onReceivebankerLoseSettlement(data) {
        // cc.log(" onReceivebankerLoseSettlement", data)
        // hqq.app.setGameInfo(data.game_user)
    },
    onReceivewinSettlement(data) {
        // cc.log(" onReceivewinSettlement", data)
        // hqq.app.setGameInfo(data.game_user)
    },
    onReceiveloseSettlement(data) {
        // cc.log(" onReceiveloseSettlement", data)
        // hqq.app.setGameInfo(data.game_user)
    },
    onReceiveLoginSubGame(data) {
        // cc.log(" onReceiveLoginSubGame", data)
        hqq.app.setGameInfo(data.game_user)
    },
    onReceiveLoginout(data) {
        // cc.log(" onReceiveLoginout", data)
        hqq.app.setGameInfo(data.game_user)
    },
    onReceiveChangeBanlance(data) {
        // cc.log(" onReceiveChangeBanlance", JSON.stringify(data))
        if (!data.game_user) return;
        hqq.app.setGameInfo(data.game_user)
        if (!data.final_pay) return;
        let changegold = data.final_pay;
        if (changegold > 0) {
            hqq.gameGlobal.ipCheck = true
            hqq.eventMgr.dispatch(hqq.eventMgr.showCongratulation, hqq.commonTools.formatGold(changegold))
        }
    },

    m_onopen() {
        // cc.log("大厅socket连接成功，并开始登陆")
        this.isConected = true;
        this.reConnectTime = 0;
        this.startPingPong();
        if (this.isReconnect) {
            this.isReconnect = false
            if (cc.director.getScene().name == "hall") {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "连接成功")
            }
        }
        if (!hqq.isDebug) {
            let msg = {
                "event": "/Game/Login/login",
                "data": {
                    id: hqq.gameGlobal.player.account_name,
                    token: hqq.gameGlobal.token
                }
            }
            // cc.log("发送登陆", msg)
            this.ws.send(JSON.stringify(msg))
        }
    },
    m_onmessage(msg) {
        let data = JSON.parse(msg.data)
        if (!CC_DEBUG) {
            console.log("data --- ", JSON.stringify(data))
        }
        let datamsg = null
        if (data.data && data.data.msg) {
            datamsg = data.data.msg
        }
        this.m_EmitMsg(data.event, datamsg, data)
    },
    m_EmitMsg(event, data, msg) {
        if (!CC_DEBUG) {
            console.log("--------大厅收到消息--------", event)
        }
        if (this.handlers[event]) {
            for (let className in this.handlers[event]) {
                this.handlers[event][className] && this.handlers[event][className](data, msg);
            }
        } else {
            // cc.log("没有注册回调函数", msg)
        }
    },
    m_onerror(e) {
        this.isConected = false;
        hqq.logMgr.logerror(e);
        this.m_stopPingPong();
    },
    m_onclose() {
        this.isConected = false;
        this.m_stopPingPong();
        if (this.needRecon) {
            this.isReconnect = true
            if (cc.director.getScene().name == "hall" && this.reConnectTime == 0) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "网络断开，正在努力连接中")
            }
            setTimeout(() => {
                this.reConnectTime++;
                if (this.reConnectTime <= 30) {
                    this.connect();
                } else {
                    hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "抱歉，网络无法连接成功，请检查网络后重新进入")
                }
            }, 1000)
        } else {
            // hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "网络断开")
        }
    },
    m_stopPingPong() {
        clearInterval(this.heartbeat);
    },
    /** 心跳逻辑 */
    m_checkPingPong() {
        if (this.pingTime >= this.heartbeatTime) {
            this.sendPing();
        } else {
            this.pingTime++;
        }
    },
}
module.exports = hqqWebSocket
