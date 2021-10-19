
let appGlobal = {
    isRelease: true, // 是否是版本发布状态
    /* ------------------------------------------------------------------- */
    pinpai: "test", // 渠道 test （特斯特） debi （德比） qibao（七宝） xingba （杏吧娱乐） yuyu （渔鱼游戏）
    // pinpai: "debi", // 渠道 test debi qibao
    huanjin: "dev", // dev pre online
    // huanjin: "pre", // pre online
    // huanjin: "online", // pre online

    // account_name: "443602268", // 账号,  
    // account_pass: "123456", //密码, 

    deviceID: "",
    os: "android", // 平台 android ios

    secretlist: [ // 密码本

    ],

    apkVersionKey: "apkVersionKey",
    apkVersion: "1.0.0",

    versionKey: "versionKey",
    version: "1.0.0",

    // hallVersionKey: "hallVersionKey",
    // hallVersion: "1.0.0",

    secretBookKey: "secretBookKey", // 密码本
    secretBook: "", // 密码本

    selectServerListKey: "selectServerListKey", // 转接服务器
    selectServerList: 0, // 转接服务器

    selectServerIndexKey: "selectServerIndexKey", // 转接服务器索引
    selectServerIndex: 0, // 转接服务器索引

    serverListKey: "serverListKey", // 长连接服务器列表
    serverList: "", // 长连接服务器列表

    serverKey: "serverKey", // 长连接服务器
    server: "", // 长连接服务器

    serverIndexKey: "serverIndexKey", // 长连接服务器索引
    serverIndex: 0, // 长连接服务器索引

    hotServerListKey: "hotServerListKey", // 热更服务器列表
    hotServerList: "", // 热更服务器列表

    hotServerKey: "hotServerKey", // 热更服务器
    hotServer: "", // 热更服务器

    canHotServerKey: "canHotServerKey", // 热更服务器
    canHotServer: "", // 热更服务器

    hotServerIndexKey: "hotServerIndexKey", // 热更服务器列表索引
    hotServerIndex: 0, // 热更服务器列表索引

    tempServerIndexKey: "tempServerIndexKey", // temp服务器列表索引
    tempServerIndex: 0, // temp服务器列表索引

    payServerIndexKey: "payServerIndexKey", // 充提服务器列表索引
    payServerIndex: 0, // 充提服务器列表索引

    stableServerListKey: "stableServerListKey", // 恒定检测长连接服务器列表
    stableServerList: "", // 恒定检测长连接服务器列表

    stableHotServerListKey: "stableHotServerListKey", // 恒定检测热更服务器列表
    stableHotServerList: "", // 恒定检测热更服务器列表

    noticeKey: "noticeKey", // 公告已读
    noticeDeleteKey: "noticeDeleteKey", // 公道删除

    reginIpDataKey: "reginIpDataKey", // 注册ip信息
    reginIpData: null,

    reginIpData2Key: "reginIpData2Key", // 注册ip信息
    reginIpData2: null,

    packgeName: "com.test.pre.android", // 包名
    hotupdatePath: "com.test.pre.android", // 热更服务器下的资源路径

    remotePath: "/entry/info/",
    remoteGetSeverInfo: "getserverinfo",
    remoteGetGameList: "getGameList",
    remoteToken: "123789",
    remoteSeverinfoKey: "remoteSeverinfoKey",
    remoteSeverinfo: null,
    remoteGamelistKey: "remoteGamelistKey",
    remoteGamelist: null,

    clipboard: "", // 剪贴板
    unique_id: "0", // 代理档位

    officialWebsite: { // 官网
        test: "https://temp.jsksafe.com?p=1&u=442619406",
        debi: "https://temp.jsksafe.com?p=2&u=770256905",
        xingba: "https://temp.jsksafe.com?p=3&u=811425071",
        yuyu: "https://temp.wepic666.com?p=6&u=541999022",
    },
    GeneralAgency: { // 总代
        isgetFromJava: false, // 是否从java代码中获得代理信息
        test: {
            dev: 351027469,
            pre: 319010216,
            online: 442619406
        },
        debi: {
            dev: 970374128,
            pre: 218638346,
            online: 770256905
        },
        qibao: {
            dev: 638044957,
            pre: 818392292,
            online: 442619406
        },
        xingba: {
            dev: 118411497,
            pre: 491187717,
            online: 811425071
        },
        yuyu: {
            dev: 566283153,
            pre: 671627403,
            online: 541999022
        }
    },
    versionJson: {}, // version.json
    subGameVersion: {}, // version.json 中的version部分
    proxyUserID: 0, // 代理id
    packageID: 0, // 包体id
    netState: { // 网络状态分级
        // outstanding: 100,
        // good: 200,
        // kind: 500,
        // bad: 3000,
        outstanding: 500,
        good: 1000,
        kind: 3000,
        bad: 10000,
    },
    downloadUrl: '', // app下载地址
    packageInfo: null, // 包体内嵌的游戏信息
    hasLineChoiceLayer: false, // 线路检测界面是否已添加
    needShowFree: false, // 是否需要显示免费金币界面
    // 根据安装包及系统初始化游戏配置
    init(sys) {
        let temppackageinfo = hqq.reflect.getHqqPackageInfo()
        if (temppackageinfo) {
            let info = JSON.parse(temppackageinfo)
            this.packageInfo = info
            this.pinpai = info.pinpai
            this.huanjin = info.huanjin
            this.apkVersion = info.version
            this.hotupdatePath = "com.test." + this.huanjin + ".android";
            if (info.engine_version) {
                if (info.engine_version == '2.1.3') {
                    this.hotupdatePath += "/ccc2.4.3"
                } else {
                    this.hotupdatePath += "/ccc" + info.engine_version
                }
            }
            if (info.proxyid) {
                this.GeneralAgency.isgetFromJava = true
                this.GeneralAgency[this.pinpai][this.huanjin] = info.proxyid
            }
            if (info.language) {
                hqq.language = info.language
            }
        } else {
            this.hotupdatePath = "com.test." + this.huanjin + ".android";
            // this.hotupdatePath += "/ccc2.4.3"
        }
        this.platform = "/com." + this.pinpai + "." + this.huanjin + ".android/";
        this.androidPlatform = "/com." + this.pinpai + "." + this.huanjin + ".android/";
        this.iosPlatform = "/com." + this.pinpai + "." + this.huanjin + ".ios/";
        this.androidPackgeName = "com." + this.pinpai + "." + this.huanjin + ".android";
        this.iosPackgeName = "com." + this.pinpai + "." + this.huanjin + ".ios";
        if (sys == 0) { // android
            this.packgeName = this.androidPackgeName;
            this.platform = this.androidPlatform;
            this.os = "android";
        } else if (sys == 1) { // ios
            this.packgeName = this.iosPackgeName;
            this.platform = this.iosPlatform;
            this.os = "ios";
        } else if (sys == 2) { // windows
            this.packgeName = this.androidPackgeName;
            this.platform = this.androidPlatform;
            this.os = "android";
        } else {
            this.packgeName = this.androidPackgeName;
            this.platform = this.androidPlatform;
        }
        if (this.pinpai == "test") {
            this.packageID = 1
        } else if (this.pinpai == "debi") {
            this.packageID = 2
        } else if (this.pinpai == "xingba") {
            this.packageID = 3
            if (this.huanjin == "dev") {
                this.packageID = 5
            }
        } else if (this.pinpai == "yuyu") {
            this.packageID = 7
        }
        if (hqq.isDebug) {
            if (!this.deviceID) {
                this.deviceID = "123456789"
            }
            if (this.huanjin == 'dev') {
                this.server = 'http://center.539316.com'
                this.canHotServer = 'http://upgrade.539316.com'
            } else if (this.huanjin == 'pre') {
                this.server = 'https://center.lymrmfyp.com'
                this.canHotServer = 'https://upgrade.lymrmfyp.com'
            }
        }
        if (CC_DEBUG) {
            // this.isRelease = false
            this.deviceID = "123456789" // burt
        }
        return this;
    },
    // 获取向中心服get的接口及组合参数
    getIpGetEndurl(gettype) {
        let endurl = ""
        switch (gettype) {
            case 0:
                endurl += "/Game/login/officialLogin?" // 账号密码登陆
                break;
            case 1:
                endurl += "/Game/login/loginWithUUID?" // uuid 登陆
                break;
            case 2:
                endurl += "/Game/login/firstLogin?" // 首次登陆
                break;
            case 3:
                endurl += "/Game/login/loginWithToken?" // token 登陆
                break;
            case 4:
                let now = new Date();
                let time = (now.getTime() / 1000) >> 0;
                endurl += "/Common/Notice/getNotice?" // 获取公告
                endurl += "&id=" + hqq.gameUser.id;
                endurl += "&platform_key=" + this.remoteToken;
                let query = JSON.stringify({
                    'package_ids': { $elemMatch: { $eq: hqq.gameUser.package_id } },
                    'is_open': 1,
                    'start_time': { $lte: time },
                    'end_time': { $gte: time }
                })
                endurl += "&query=" + query;
                return endurl;
            case 5:
                endurl += "/Game/Verify/getCaptcha?" // 获取下次可发送手机验证码的时间
                endurl += "&id=" + hqq.gameUser.id;
                endurl += "&token=" + hqq.gameGlobal.token;
                return endurl;
        }
        endurl += "&uuid=" + this.deviceID;
        endurl += "&package_name=" + this.packgeName;
        endurl += "&os=" + this.os;
        endurl += "&code=" + hqq.gameGlobal.player.code;
        endurl += "&unique_id=" + this.unique_id;
        endurl += "&account_name=" + hqq.gameGlobal.player.account_name;
        endurl += "&account_pass=" + hqq.gameGlobal.player.account_pass;
        endurl += "&token=" + hqq.gameGlobal.token;
        return endurl
    },
    // 获取向中心服post的接口
    getIpPostEndUrl(gettype) {
        let endurl = ""
        switch (gettype) {
            case 1:
                endurl += "/Game/User/setGameUserNickName" // 设置昵称
                break;
            case 2:
                endurl += "/Game/User/createGameAccount" // 创建子游戏账号
                break;
            case 3:
                endurl += "/Game/User/setPrevProxyId" // 设置代理id
                break;
            case 4:
                endurl += "/Game/User/setAccountPass" // 设置账号密码
                break;
            case 5:
                endurl += "/Game/User/setGameUserPhone" // 绑定手机
                break;
            case 6:
                endurl += "/Game/Verify/createCaptcha" // 创建图形验证码
                break
            case 7:
                endurl += "/Game/Verify/sendPhoneMessage" // 请求发送手机验证码
                break
            case 8:
                endurl += "/Game/User/setGameUserImage" // 修改头像
                break
            case 9:
                endurl += "/Game/login/regin" // 账号注册
                break
        }
        return endurl
    },
    // 获取总代号
    getGeneralAgency() {
        return this.GeneralAgency[this.pinpai][this.huanjin]
    },
    // 根据热更version.json设置本地总代
    setGeneralAgency(data) {
        if (this.GeneralAgency.isgetFromJava) {
            return
        }
        for (let huanjin in data[this.pinpai]) {
            this.GeneralAgency[this.pinpai][huanjin] = data[this.pinpai][huanjin].proxyUserID
        }
    },
    // 根据确定的中心服地址，组合出各模块及子游戏的服务器地址
    checkSubServer() {
        let url = this.server
        if (url.includes("center")) {
            hqq.gameGlobal.pay.pay_host = url.replace("center", "pay")
        }
        if (url.includes("center")) {
            hqq.gameGlobal.im_host = url.replace("center", "im")
        }
        if (url.includes("center")) {
            hqq.gameGlobal.proxy.proxy_host = url.replace("center", "proxy")
        }
        for (let k in hqq.subGameList) {
            let url = this.server
            if (url.includes("http:")) {
                url = url.replace("http", "ws")
            } else if (url.includes("https:")) {
                url = url.replace("https", "ws")
            }
            if (url.includes("center")) {
                url = url.replace("center", "game")
            }
            hqq.subGameList[k].serverUrl = url + hqq.subGameList[k].endUrl
        }
    },
    // 根据中心服返回设置游戏相关信息
    setGameInfo(game_user, proxy_user, prev_proxy) {
        let data = { token: hqq.gameGlobal.token }
        data.ischangeAccount = false
        if (game_user) {
            for (let k in game_user) {
                hqq.gameUser[k] = hqq.gameUser[k] || game_user[k]
            }
            if (game_user.id) {
                if (hqq.gameGlobal.player.id != "" && hqq.gameGlobal.player.id != game_user.id) {
                    data.ischangeAccount = true
                }
                hqq.gameGlobal.player.account_name = game_user.id;
                hqq.gameGlobal.pay.user_id = game_user.id;
                hqq.gameGlobal.player.id = game_user.id;
                data.id = game_user.id;
            }

            if (game_user.game_gold || game_user.game_gold == 0) {
                let gold = game_user.game_gold
                if (gold < 0.01) {
                    gold = "0";
                } else {
                    gold = hqq.commonTools.formatGold(game_user.game_gold);
                }
                hqq.gameGlobal.player.gold = gold;
                data.game_gold = gold
            }
            if (game_user.game_img) {
                hqq.gameGlobal.player.headurl = game_user.game_img;
                data.game_img = game_user.game_img;
            }
            if (game_user.game_nick || game_user.game_nick == '') {
                hqq.gameGlobal.player.nick = game_user.game_nick;
                hqq.gameGlobal.pay.user_name = game_user.game_nick
                data.game_nick = game_user.game_nick;
            }
            if (game_user.phone_number || game_user.phone_number == "") {
                hqq.gameGlobal.player.phonenum = game_user.phone_number;
                data.phone_number = game_user.phone_number;
            }
            if (game_user.uuid) {
                hqq.gameGlobal.player.uuid = game_user.uuid
                hqq.gameGlobal.pay.proxy_user_id = game_user.proxy_user_id
                hqq.gameGlobal.pay.package_id = game_user.package_id
            }
        }
        if (prev_proxy) {
            hqq.gameGlobal.player.proxy_pid = prev_proxy.proxy_pid;
            hqq.gameGlobal.pay.proxy_name = prev_proxy.proxy_nick
        }
        if (proxy_user) {
            hqq.gameGlobal.proxy.package_id = proxy_user.package_id
            hqq.gameGlobal.proxy.balance = proxy_user.balance
            data.balance = proxy_user.balance
        }
        hqq.eventMgr.dispatch(hqq.eventMgr.refreshPlayerinfo, data)
    },
    // 设置玩家数据
    setPlayerinfo(info) {
        console.log("设置玩家数据 是否已经弃用？")
        let data = {}
        if (info.game_gold || info.game_gold == 0) {
            let gold = info.game_gold
            if (gold < 0.01) {
                gold = "0";
            } else {
                gold = hqq.commonTools.formatGold(info.game_gold);
            }
            hqq.gameGlobal.player.gold = gold;
            data["game_gold"] = gold
        }
        if (info.game_img) {
            hqq.gameGlobal.player.headurl = info.game_img;
            data["game_img"] = info.game_img;
        }
        if (info.game_nick) {
            hqq.gameGlobal.player.nick = info.game_nick;
            hqq.gameGlobal.pay.user_name = info.game_nick;
            data["game_nick"] = info.game_nick;
        }
        if (info.id) {
            hqq.gameGlobal.player.id = info.id;
            hqq.gameGlobal.pay.user_id = info.id;
            data["id"] = info.id;
        }
        if (info.proxy_user_id) {
            hqq.gameGlobal.pay.proxy_user_id = info.proxy_user_id
            data["proxy_user_id"] = info.proxy_user_id;
        }
        if (info.package_id) {
            hqq.gameGlobal.pay.package_id = info.package_id
            data["package_id"] = info.package_id;
        }
        if (info.phone_number) {
            hqq.gameGlobal.player.phonenum = info.phone_number;
            data["phone_number"] = info.phone_number;
            hqq.gameGlobal.ipCheck = true
        }
        if (info.balance) {
            hqq.gameGlobal.proxy.balance = info.balance
            data["balance"] = info.balance;
        }
        hqq.eventMgr.dispatch(hqq.eventMgr.refreshPlayerinfo, data)
    },
}

module.exports = appGlobal;