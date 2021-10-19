let appLogin = {
    init: function (data) {
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "开始登陆")
        this.errinfo = ""
        if (hqq.isDebug) {
            this.isRealTimeLog = false;
        } else {
            this.isRealTimeLog = true;
        }
        let hotUpdateMgr = require("hotUpdateMgr");
        hqq.hotUpdateMgr = hotUpdateMgr;
        hqq.hotUpdateMgr.init(data);
        this.upgradeIndex = 0
        this.isfirst = true
        let templog = "language:" + cc.sys.language
            + ",platform:" + cc.sys.platform
            + ",os:" + cc.sys.os
            + ",osVersion:" + cc.sys.osVersion
            + ",osMainVersion:" + cc.sys.osMainVersion
            + ",Cocos Creator v" + cc.ENGINE_VERSION;
        if (CC_JSB) {
            if (cc.sys.platform === cc.sys.ANDROID || cc.sys.os === cc.sys.OS_ANDROID
                || cc.sys.platform === cc.sys.IPHONE || cc.sys.platform === cc.sys.IPAD || cc.sys.os === cc.sys.OS_IOS) {
                hqq.app.deviceID = hqq.reflect.getDeviceId()
                hqq.app.clipboard = hqq.reflect.getClipboard()
                let nettype = jsb.Device.getNetworkType()            // 0 网络不通  1 通过无线或者有线本地网络连接因特网  2 通过蜂窝移动网络连接因特网
                !hqq.isDebug && hqq.logMgr.log(templog + ",Clipboard:" + hqq.app.clipboard
                    + ",NetworkType:" + (nettype != 0 ? nettype == 1 ? "通过无线或者有线本地网络连网" : "通过蜂窝移动网络连网" : "网络不通")
                    + ",getBatteryLevel:" + jsb.Device.getBatteryLevel()
                    + ",DeviceModel:" + jsb.Device.getDeviceModel()
                    + ",isMobile:" + cc.sys.isMobile
                    + ',getAppPackageName:' + hqq.reflect.getAppPackageName())
            }
        } else {
            !hqq.isDebug && hqq.logMgr.log(templog + ",browserType:" + cc.sys.browserType + ",browserVersion:" + cc.sys.browserVersion);
        }
        this.localInit();
        this.getLocalIp(3)
        this.secretMaxTry = 200
        this.secretTry = 0
        this.testTime = 0
        this.testTimeList = []
        this.errList = []
        this.tryIndex = 0
        this.serverinfoTryIndex = 0
        this.gamelistTryIndex = 0
        if (hqq.app.server && hqq.app.canHotServer) { // 本地已经有记录了 老玩家
            this.requestUpgradeInfo()
        } else {
            // 新玩家首次登陆 或者 本地数据已清空
        }
    },
    getLocalIp(trynum) {
        if (CC_DEBUG) {
            return
        }
        let callback = (data) => {
            // hqq.logMgr.log("ipapiData:" + JSON.stringify(data))
            hqq.gameGlobal.ipapiData = data
            hqq.gameGlobal.ipList.push(data.query)
            hqq.eventMgr.dispatch(hqq.eventMgr.refreshLoading, data.query, data.regionName, "ip-api")
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("ipapi获得信息失败：" + status + ",err:" + err + ",trynum:" + trynum + ",forcejump" + forcejump + ",readyState" + readyState);
            trynum--
            if (trynum > 0) {
                setTimeout(() => {
                    this.getLocalIp(trynum)
                }, 500);
            } else {
                this.getLocalIp2(3)
            }
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: "http://ip-api.com/json/" + "?lang=zh-CN",
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    getLocalIp2(trynum, next) {
        let callback = (data) => {
            // console.log("ipinfoData", data)
            hqq.gameGlobal.ipinfoData = data
            hqq.gameGlobal.ipList.push(data.ip)
            hqq.eventMgr.dispatch(hqq.eventMgr.refreshLoading, data.ip, data.region, "ipinfo")
            if (next) {
                this.getReginIp2()
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("ipinfo获得信息失败：" + status + ",err:" + err + ",trynum:" + trynum + ",forcejump" + forcejump + ",readyState" + readyState);
            trynum--
            if (trynum > 0) {
                setTimeout(() => {
                    this.getLocalIp2(trynum)
                }, 500);
            }
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: "https://ipinfo.io/json",
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    /** 本地初始化 */
    localInit() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "本地初始化")
        let global = hqq.localStorage.getGlobal();
        hqq.app.version = global.versionKey || hqq.app.version;
        hqq.app.server = global.serverKey || hqq.app.server;
        hqq.app.canHotServer = global.canHotServerKey || hqq.app.canHotServer;
        hqq.app.hotServer = global.hotServerKey || hqq.app.hotServer;
        hqq.app.codeBook = global.codeBookKey || hqq.app.codeBook;
        hqq.app.selectServerIndex = global.selectServerIndexKey || hqq.app.selectServerIndex;
        hqq.app.hotServerIndex = global.hotServerIndexKey || hqq.app.hotServerIndex;
        hqq.app.serverIndex = global.serverIndexKey || hqq.app.serverIndex;
        hqq.app.tempServerIndex = global.tempServerIndexKey || hqq.app.tempServerIndex;
        hqq.app.payServerIndex = global.payServerIndexKey || hqq.app.payServerIndex;
        hqq.app.serverList = global.serverListKey || hqq.app.serverList;
        hqq.app.reginIpData = global.reginIpDataKey || hqq.app.reginIpData;
        hqq.app.reginIpData2 = global.reginIpData2Key || hqq.app.reginIpData2;
        hqq.gameGlobal.player = global.playerKey || hqq.gameGlobal.player;
        if (!hqq.app.deviceID && hqq.gameGlobal.player.uuid) {
            hqq.app.deviceID = hqq.gameGlobal.player.uuid
        }

        if (cc.sys.isBrowser) {
            hqq.gameGlobal.token = global.tokenKey || hqq.webToken || ''
            hqq.gameGlobal.player.account_name = (global.playerKey && global.playerKey.account_name) || hqq.webAcconunt
            hqq.gameGlobal.player.account_pass = (global.playerKey && global.playerKey.account_name) || hqq.webAcconuntPass
            hqq.gameGlobal.player.deviceid = hqq.app.deviceID = (global.playerKey && global.playerKey.deviceid) || hqq.webDeviceid || hqq.app.deviceID
            hqq.localStorage.globalSet(hqq.gameGlobal.tokenKey, hqq.gameGlobal.token);
            hqq.localStorage.globalSet(hqq.gameGlobal.playerKey, hqq.gameGlobal.player);
        } else {
            hqq.gameGlobal.token = global.tokenKey || hqq.gameGlobal.token;
        }

        cc.game.on(cc.game.EVENT_HIDE, function () {
            cc.audioEngine.pauseMusic();
            cc.audioEngine.pauseAllEffects();
            hqq.logMgr.saveLog();
            hqq.localStorage.savaLocal();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            cc.audioEngine.resumeMusic();
            cc.audioEngine.resumeAllEffects();
        });
    },
    /**
     * @Description: 从密码本开始重试登陆
     */
    reStartAtSecret() {
        hqq.app.canHotServer = ""
        hqq.localStorage.globalSet(hqq.app.hotServerKey, "");
        hqq.app.codeBook = ""
        hqq.localStorage.globalSet(hqq.app.codeBookKey, "");
        hqq.app.server = ""
        this.upgradeIndex = 0
        this.isfirst = false
        hqq.http.stopRequestStableUrlLine();
    },
    requestUpgradeInfo() {
        let callback = (response, url) => {
            hqq.app.versionJson = response
            hqq.app.subGameVersion = response.version
            if (response[hqq.app.pinpai]) {
                hqq.app.packageID = response[hqq.app.pinpai].packageID
                hqq.app.proxyUserID = response[hqq.app.pinpai][hqq.app.huanjin].proxyUserID
            }
            hqq.app.setGeneralAgency(response)
            this.checkApkUpdata(response)
            let pn = cc.find('Canvas/Main Camera/layer/netnodepos')
            hqq.eventMgr.dispatch(hqq.eventMgr.showNetStateNode, { parent: pn, position: { x: 0, y: 0 } })
            if (cc.sys.isNative && !hqq.isDebug) {
                this.getBrandRes()
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("requestUpgradeInfo 请求热更服务器信息失败", status, forcejump, url, err, readyState)
            this.reStartAtSecret()
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/" + 'version.json?' + Math.floor(Math.random() * 1000000),
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        })
        !hqq.isDebug && this.refreshServerList()
    },
    showChoiceLimeLayer() {
        let data = {
            exitFunc: this.requestUpgradeInfo.bind(this),
            upgradeList: hqq.localStorage.globalGet(hqq.app.hotServerKey),
            // centerList: hqq.app.serverList,
            notshowexitbtn: true,
        }
        hqq.eventMgr.dispatch(hqq.eventMgr.showLineChoiceLayer, data)
    },
    refreshServerList() {
        let urllist = hqq.localStorage.globalGet(hqq.app.codeBookKey)
        let hasreceive = false;
        if (hqq.app.selectServerIndex) {
            urllist = hqq.commonTools.swapItem(urllist, hqq.app.selectServerIndex, 0);
        }
        let callback = (response, url, checknum) => {
            hqq.app.selectServerIndex = checknum;
            hqq.localStorage.globalSet(hqq.app.selectServerIndexKey, checknum);
            let responseurl = this.decodeServer(response);
            let murllist = responseurl.split(",");
            if (!hasreceive) {
                hasreceive = true;
                hqq.app.serverList = []
                for (let i = 0; i < murllist.length; i++) {
                    if (murllist[i].match("upgrade")) {
                        hqq.app.hotServer = []
                        break
                    }
                }
                for (let i = 0; i < murllist.length; i++) {
                    if (murllist[i].match("center")) {
                        hqq.app.serverList.push(murllist[i]);
                    } else if (murllist[i].match("upgrade")) {
                        hqq.app.hotServer.push(murllist[i]);
                    }
                }
                hqq.localStorage.globalSet(hqq.app.hotServerKey, hqq.app.hotServer)
                hqq.localStorage.globalSet(hqq.app.serverListKey, hqq.app.serverList);
                this.requestStableServerUrl();
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("所有请求最快的接待服务器失败，重新请求密码本", status, forcejump, err, readyState)
            this.reStartAtSecret();
        }
        let tipcallback = (checknum) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "S服务器线路" + checknum + "连接中")
        }
        hqq.http.requestFastestUrlLine({
            urllist: urllist,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: false,
            timeout: 5000,
            failtimeout: 7000,
            tipcallback: tipcallback,
        })
    },
    /** 请求最快的select服务器 */
    requestFastestSelectServer() {
        let urllist = hqq.localStorage.globalGet(hqq.app.codeBookKey)
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "云端资源检测")
        let hasreceive = false;
        if (hqq.app.selectServerIndex) {
            urllist = hqq.commonTools.swapItem(urllist, hqq.app.selectServerIndex, 0);
        }
        hqq.logMgr.time("requestFastestSelectServer")
        let callback = (response, url, checknum) => {
            hqq.logMgr.timeEnd("requestFastestSelectServer", url)
            hqq.app.selectServerIndex = checknum;
            hqq.localStorage.globalSet(hqq.app.selectServerIndexKey, checknum);
            let responseurl = this.decodeServer(response);
            let murllist = responseurl.split(",");
            if (!hasreceive) {
                hasreceive = true;
                hqq.app.serverList = []
                for (let i = 0; i < murllist.length; i++) {
                    if (murllist[i].match("upgrade")) {
                        hqq.app.hotServer = []
                        break
                    }
                }
                for (let i = 0; i < murllist.length; i++) {
                    if (murllist[i].match("center")) {
                        hqq.app.serverList.push(murllist[i]);
                    } else if (murllist[i].match("upgrade")) {
                        hqq.app.hotServer.push(murllist[i]);
                    }
                }
                if (hqq.app.huanjin == "dev" && hqq.app.hotServer.length == 0) {
                    hqq.app.hotServer = ["http://upgrade.539316.com"]
                }
                hqq.localStorage.globalSet(hqq.app.hotServerKey, hqq.app.hotServer)
                hqq.localStorage.globalSet(hqq.app.serverListKey, hqq.app.serverList);
                if (hqq.app.server && hqq.app.canHotServer && this.isfirst) {
                    this.requestGameSeverInfo();
                } else {
                    this.showChoiceLimeLayer();
                }
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("所有请求最快的接待服务器失败，重新请求密码本", status, forcejump, err, readyState)
            this.reStartAtSecret();
        }
        let tipcallback = (checknum) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "S服务器线路" + checknum + "连接中")
        }
        hqq.http.requestFastestUrlLine({
            urllist: urllist,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: false,
            timeout: 5000,
            failtimeout: 7000,
            tipcallback: tipcallback,
        })
    },
    /** 节点服务器解码 */
    decodeServer(response) {

    },
    /** 请求游戏服务器信息 */
    requestGameSeverInfo(url) {
        if (!hqq.app.server) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "线路检测中")
            return setTimeout(() => {
                this.requestGameSeverInfo();
            }, 100);
        }
        url = url ? url : hqq.app.server
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "站点请求")
        cc.director.preloadScene("hall");
        let callback = (data, murl) => {
            this.log(" getserverinfo callback", data)
            if (data.code === 200) {
                this.serverinfoTryIndex = 0
                hqq.app.remoteSeverinfo = data.msg;
                this.requestGameListInfo(hqq.app.server);
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求游戏服务器信息失败")
                hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "请求游戏服务器信息失败:" + JSON.stringify(data))
                this.reStartAtSecret();
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("获取服务器信息失败，重新刷选select线路", status, forcejump, err, readyState)
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "网络太差，重新刷选select线路" + status + ",err:" + err)
            if (hqq.app.serverList[this.serverinfoTryIndex]) {
                let newserver = hqq.app.serverList[this.serverinfoTryIndex]
                this.serverinfoTryIndex++
                this.requestGameSeverInfo(newserver)
            } else {
                this.reStartAtSecret();
            }
        }
        let endurl = hqq.app.remotePath + hqq.app.remoteGetSeverInfo + "?platform_key=" + hqq.app.remoteToken + "&package_name=" + hqq.app.packgeName + "&os=" + hqq.app.os;
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: url,
            endurl: endurl,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
            timeout: 5000,
            failtimeout: 7000,
        });
    },
    /** 请求游戏列表 */
    requestGameListInfo(url) {
        let callback = (data, url) => {
            this.log(" getGameList callback", data)
            if (data.code === 200) {
                this.gamelistTryIndex = 0
                hqq.app.remoteGamelist = data.msg;
                let sortarray = []
                for (let k in hqq.subGameList) {
                    for (let i = 0; i < hqq.app.remoteGamelist.length; i++) {
                        if (hqq.subGameList[k].game_id == hqq.app.remoteGamelist[i].game_id) {
                            hqq.subGameList[k].remoteData = hqq.app.remoteGamelist[i]
                            break;
                        }
                    }
                    sortarray.push(hqq.subGameList[k])
                }
                for (let k in hqq.oldGameList) {
                    for (let i = 0; i < hqq.app.remoteGamelist.length; i++) {
                        if (hqq.oldGameList[k].game_id == hqq.app.remoteGamelist[i].game_id) {
                            hqq.oldGameList[k].remoteData = hqq.app.remoteGamelist[i]
                            break;
                        }
                    }
                }
                sortarray.sort(function (a, b) {
                    if (b.remoteData && a.remoteData) {
                        return b.remoteData.sort - a.remoteData.sort
                    }
                })
                for (let k in hqq.subGameList) {
                    for (let i = 0; i < sortarray.length; i++) {
                        if (hqq.subGameList[k].game_id == sortarray[i].game_id && k == sortarray[i].enname) {
                            hqq.subGameList[k].hallid = i
                            break;
                        }
                    }
                }
                hqq.app.checkSubServer();
                this.login();
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求游戏列表失败")
                hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "请求游戏列表失败:" + JSON.stringify(data))
                this.reStartAtSecret();
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("获取游戏列表失败，重新刷选select线路", status, forcejump, err, readyState)
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "网络太差，重新刷选select线路" + status + ",err:" + err)
            if (hqq.app.serverList[this.gamelistTryIndex]) {
                let newserver = hqq.app.serverList[this.gamelistTryIndex]
                this.gamelistTryIndex++
                this.requestGameListInfo(newserver)
            } else {
                this.reStartAtSecret();
            }
        }
        let endurl = hqq.app.remotePath + hqq.app.remoteGetGameList + "?platform_key=" + hqq.app.remoteToken + "&package_id=" + hqq.app.remoteSeverinfo.id;
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: url,
            endurl: endurl,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
            timeout: 5000,
            failtimeout: 7000,
        });
    },
    /**
     * @Description: 检查apk更新
     */
    checkApkUpdata(data) {
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "检测安装包更新")
        let vA = data.apkversion.split('.');
        let needUp = false
        this.log(" 本地 apkVersion", hqq.app.apkVersion, "服务端 apkVersion", data.apkversion)
        if (hqq.app.apkVersion) {
            let vB = hqq.app.apkVersion.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                } else {
                    if (a > b) { // 线上版本大于本地版本
                        needUp = true;
                    } else if (a < b) {
                        hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "本地安装包版本大于线上版本")
                    }
                    break;
                }
            }
            if (vA.length > vB.length) {
                needUp = true;
            }
        }
        this.checkFatestTempHost()
        if (needUp && !cc.sys.isBrowser && cc.sys.os != "OS X" && cc.sys.os != "Windows") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "安装包更新")
            hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 8 })
        } else {
            if (cc.sys.isBrowser || cc.sys.os == "Windows" || cc.sys.os == "OS X") {
                this.requestGameSeverInfo()
            } else if (hqq.app.version != hqq.app.subGameVersion.hall) {
                this.mainUpdataCheck(hqq.app.subGameVersion.hall)
            } else {
                this.isupdataCallback(false, "hall");
            }
        }
    },
    /** 主包检查 */
    mainUpdataCheck(main_version) {
        if (hqq.app.canHotServer == "") {
            hqq.logMgr.sendMLog('主包更新检测 热更服务器地址为空')
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "热更地址为空，更新失败")
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "热更地址为空，更新失败")
            return
        }
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "m更新检测")
        hqq.eventMgr.register(hqq.eventMgr.hotCheckup, "appLogin", this.isupdataCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotFail, "appLogin", this.failCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotProgress, "appLogin", this.progressCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotFinish, "appLogin", this.finishCallback.bind(this))
        main_version = main_version == '1.0.0' ? '' : main_version
        hqq.hotUpdateMgr.checkUpdate({
            subname: "hall",
            version: hqq.app.version,
            remotev: main_version,
        })
    },
    checkFatestTempHost() {
        let data = hqq.app.versionJson
        if (data.temp_host[hqq.app.huanjin]) {
            hqq.logMgr.time("最快的temp_host地址")
            if (hqq.app.tempServerIndex) {
                data.temp_host[hqq.app.huanjin] = hqq.commonTools.swapItem(data.temp_host[hqq.app.huanjin], hqq.app.tempServerIndex, 0);
            }
            let callback = (response, url, checknum) => {
                !hqq.isDebug && hqq.logMgr.timeEnd("最快的temp_host地址", url, response)
                hqq.gameGlobal.proxy.temp_host = url;
                hqq.app.downloadUrl = url + "?p=" + hqq.app.packageID + "&u=" + hqq.gameGlobal.player.account_name + "&m=" + hqq.app.huanjin;
                hqq.app.tempServerIndex = checknum;
                hqq.localStorage.globalSet(hqq.app.tempServerIndexKey, checknum);
            }
            let failcallback = (status, forcejump, url, err, readyState) => {
                hqq.logMgr.log("tempHost请求失败", status, forcejump, err, readyState)
            }
            hqq.http.requestFastestUrlLine({
                urllist: data.temp_host[hqq.app.huanjin],
                endurl: "/checked?" + Math.floor(Math.random() * 1000000),
                callback: callback,
                failcallback: failcallback,
                needJsonParse: false,
            })
        } else {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "版本文件丢失，无法获取temp地址")
        }
    },
    isupdataCallback(bool, subname) {
        if (bool) {
            hqq.logMgr.log(subname + "需要更新")
        } else {
            hqq.logMgr.log(subname + "不需要更新")
            this.requestGameSeverInfo()
        }
    },
    failCallback(subname) {
        if (subname == "hall") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "m更新检测失败")
        } else {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, subname + "更新检测失败")
        }
        hqq.logMgr.sendLog();
        this.reStartAtSecret();
    },
    progressCallback(progress) {
    },
    finishCallback(subname) {

    },
    /** 登录服务器 */
    login() {
        this.log("login")
        if (hqq.isDebug) {
            if (hqq.app.account_name) {
                hqq.gameGlobal.player.account_name = hqq.app.account_name
                hqq.gameGlobal.player.account_pass = hqq.app.account_pass
                this.officialLogin()
            } else {
                console.log("请在appGlobal文件中配置自己的账号密码进行登录")
                this.loginWithUUID();
            }
        } else {
            this.login2()
        }
    },
    // 登陆前检测，选择登陆方式
    login2() {
        this.log('login2', hqq.app.server)
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登录中")
        if (hqq.webUpAgent && hqq.webAcconunt && hqq.webDeviceid) { // 网页版
            hqq.gameGlobal.player.account_name = hqq.webAcconunt
            hqq.gameGlobal.player.account_pass = hqq.webAcconuntPass
            hqq.app.deviceID = hqq.webDeviceid
            hqq.gameGlobal.player.code = hqq.webUpAgent
            this.loginWithUUID();
        } else if (hqq.gameGlobal.token && hqq.gameGlobal.token != "") {
            this.loginWithToken();
        } else if (hqq.gameGlobal.player.account_name && hqq.gameGlobal.player.account_pass) {
            this.officialLogin();
        } else if (hqq.app.deviceID) {
            this.loginWithUUID();
        } else if (hqq.gameGlobal.player.code) {
            this.firstLogin();
        } else {
            this.getOnlineCode(20)
        }
        hqq.logMgr.sendMLog("最优热更地址:" + hqq.app.canHotServer)
    },
    /**
     * @Description: token方式登陆
     */
    loginWithToken() {
        hqq.logMgr.log("loginWithToken")
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登录中1")
        let callback = (data, url) => {
            this.log("loginWithToken callback", data)
            if (data.code !== 200) {
                this.loginWithUUID();
            } else {
                this.setPlayerInfo(data)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("loginWithToken failcallback", status, forcejump, err, readyState)
            this.loginWithUUID();
        }
        let endurl = hqq.app.getIpGetEndurl(3);
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: hqq.app.server,
            endurl: endurl,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        });
    },
    /** 账号密码 */
    officialLogin() {
        hqq.logMgr.log("officialLogin", hqq.gameGlobal.player.account_name, hqq.gameGlobal.player.account_pass)
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登录中4")
        if (hqq.gameGlobal.player.account_name && hqq.gameGlobal.player.account_pass) {
            let callback = (data, url) => {
                this.log("officialLogin callback", data, url)
                if (data.code !== 200) {
                    this.loginWithUUID();
                } else {
                    this.setPlayerInfo(data)
                }
            }
            let failcallback = (status, forcejump, url, err, readyState) => {
                hqq.logMgr.log("officialLogin failcallback", status, forcejump, err, readyState)
                this.loginWithUUID();
            }
            let endurl = hqq.app.getIpGetEndurl(0);
            hqq.http.sendXMLHttpRequest({
                method: "GET",
                urlto: hqq.app.server,
                endurl: endurl,
                callback: callback,
                failcallback: failcallback,
                needJsonParse: true,
            });
        } else {
            this.loginWithUUID();
        }
    },
    /** uuid（设备id）登陆 */
    loginWithUUID() {
        hqq.logMgr.log("loginWithUUID", hqq.app.deviceID)
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登录中2")
        let callback = (data, url) => {
            this.log(" loginWithUUID callback", data, url)
            if (data.code !== 200) {
                this.errinfo += "loginWithUUID 失败:" + data.code + ",msg:" + data.msg + ";"
                this.firstLogin();
            } else {
                this.setPlayerInfo(data)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log(" loginWithUUID failcallback", status, forcejump, err, hqq.app.deviceID, readyState)
            this.reStartAtSecret();
        }
        let endurl = hqq.app.getIpGetEndurl(1);
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: hqq.app.server,
            endurl: endurl,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
            timeout: 5000,
            failtimeout: 7000,
        });
    },
    /** 玩家首次登陆 */
    firstLogin() {
        hqq.logMgr.log("firstLogin")
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登录中3")
        if (hqq.gameGlobal.player.code) {
            let callback = (data, url) => {
                this.log(" firstLogin callback", data, url)
                if (data.code !== 200) {
                    this.errinfo += "firstLogin 失败:" + data.code + ",msg:" + data.msg + ";"
                    hqq.logMgr.log("firstLogin 失败：" + data.code + data.msg)
                    hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登陆失败:" + data.code + data.msg)
                    hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "登陆失败:" + data.code + data.msg)
                    this.autoLogin()
                } else {
                    this.setPlayerInfo(data)
                }
            }
            let failcallback = (status, forcejump, url, err, readyState) => {
                hqq.logMgr.log('firstLogin请求失败，重新请求密码本', status, forcejump, err, readyState)
                this.reStartAtSecret();
            }
            let endurl = hqq.app.getIpGetEndurl(2);
            hqq.http.sendXMLHttpRequest({
                method: "GET",
                urlto: hqq.app.server,
                endurl: endurl,
                callback: callback,
                failcallback: failcallback,
                needJsonParse: true,
            });
        } else {
            if (!navigator) {
                hqq.logMgr.log("没有 navigator", navigator)
                if (!navigator.userAgent) {
                    hqq.logMgr.log("没有 navigator.userAgent", navigator.userAgent)
                }
            }
            this.getOnlineCode(20)
        }
    },
    getOnlineCode(trynum, server) {
        hqq.logMgr.log("getOnlineCode", trynum)
        if (hqq.app.clipboard == "" || !hqq.app.clipboard) {
            hqq.app.clipboard = 'empty'
        }
        if (hqq.app.deviceID == "" || !hqq.app.deviceID) {
            hqq.app.deviceID = 'empty'
        }
        let endurl = "/Game/Code/getOnlineCode?"
        endurl += "package_name=" + hqq.app.packgeName;
        endurl += "&os=" + hqq.app.os;
        endurl += "&uuid=" + hqq.app.deviceID;
        endurl += "&keys=" + hqq.app.clipboard;
        endurl += "&userAgent=" + navigator.userAgent;
        let callback = (response, urlto) => {
            this.tryIndex = 0
            if (response.code == 200) {
                hqq.gameGlobal.player.code = response.msg.proxy_user_id
                hqq.gameGlobal.player.id = response.msg.account_name
                this.firstLogin()
            } else {
                hqq.logMgr.log('getOnlineCode没有获取到玩家code,自动登录,' + urlto + "," + JSON.stringify(response) + "," +
                    hqq.gameGlobal.player.code + ",", hqq.app.deviceID + "," + hqq.app.clipboard)
                this.autoLogin()
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log('getOnlineCode failcallback status:' + status + ",forcejump:" + forcejump + ",url:" + url
                + ",err:" + err + ",readyState:" + readyState)
            trynum--
            if (trynum > 0) {
                setTimeout(() => {
                    this.getOnlineCode(trynum)
                }, 500);
            } else if (trynum == 0) {
                hqq.logMgr.log('getOnlineCode获取到玩家code失败,自动登录,', hqq.app.deviceID, hqq.app.clipboard)
                if (hqq.app.serverList[this.tryIndex]) {
                    let newserver = hqq.app.serverList[this.tryIndex]
                    this.tryIndex++
                    this.getOnlineCode(20, newserver)
                } else {
                    this.autoLogin()
                }
            }
        }
        server = server ? server : hqq.app.server
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: server,
            endurl: endurl,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        });
    },
    /** 设置玩家信息 */
    setPlayerInfo(data, ischange) {
        let msg = data.msg;
        hqq.app.gameuser = data.msg.game_user;
        hqq.gameGlobal.player.account_pass = "";
        hqq.gameGlobal.player.alipay = "";
        hqq.gameGlobal.player.yinhangka = "";
        hqq.gameGlobal.huanjin = hqq.app.huanjin
        hqq.gameGlobal.pay.client = hqq.app.os
        hqq.gameGlobal.token = msg.token
        hqq.gameGlobal.regin_ip = msg.game_user.regin_ip
        hqq.app.setGameInfo(msg.game_user, msg.proxy_user, msg.prev_proxy)
        hqq.localStorage.globalSet(hqq.gameGlobal.tokenKey, hqq.gameGlobal.token);
        this.getReginIp()
        for (let key in hqq.subGameList) {
            hqq.subGameList[key].hasAccount = false
        }
        for (let key in hqq.oldGameList) {
            hqq.oldGameList[key].hasAccount = false
        }
        for (let index in msg.game_accounts) {
            for (let key in hqq.subGameList) {
                if (hqq.subGameList[key].game_id == msg.game_accounts[index].game_id) {
                    hqq.subGameList[key].hasAccount = true
                }
            }
            for (let key in hqq.oldGameList) {
                if (hqq.oldGameList[key].game_id == msg.game_accounts[index].game_id) {
                    hqq.oldGameList[key].hasAccount = true
                    break;
                }
            }
        }
        hqq.localStorage.globalSet(hqq.gameGlobal.playerKey, hqq.gameGlobal.player);
        if (CC_DEBUG) {
            hqq.app.needShowFree = true;
            hqq.needShowNotice = true;
            this.jumpToNextScene();
            return
        }
        if (!ischange) {
            this.m_destroy()
            if (hqq.gameGlobal.player.phonenum != "" && hqq.subModel.payActivity.lanchscene != "" && !hqq.isDebug) {
                hqq.needShowNotice = true;
                if (hqq.gameGlobal.pay.pay_host == "") {
                    hqq.logMgr.time("最快的pay地址")
                    if (hqq.app.payServerIndex) {
                        hqq.app.remoteSeverinfo.pay_host = hqq.commonTools.swapItem(hqq.app.remoteSeverinfo.pay_host, hqq.app.payServerIndex, 0);
                    }
                    let callback = (response, url, checknum) => {
                        hqq.logMgr.timeEnd("最快的pay地址", url)
                        hqq.gameGlobal.pay.pay_host = url;
                        hqq.app.payServerIndex = checknum;
                        hqq.localStorage.globalSet(hqq.app.payServerIndexKey, checknum);
                        cc.director.preloadScene(hqq.subModel.payActivity.lanchscene, this.onProgress.bind(this), () => {
                            cc.director.loadScene(hqq.subModel.payActivity.lanchscene);
                        })
                    }
                    let failcallback = (status, forcejump, url, err, readyState) => {
                        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "pay_host请求失败:" + status + ",err:" + err)
                        hqq.logMgr.log("pay_host请求失败", status, forcejump, err, readyState)
                    }
                    let tipcallback = (checknum) => {
                        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "P服务器线路" + checknum + "连接中")
                    }
                    hqq.http.requestFastestUrlLine({
                        urllist: hqq.app.remoteSeverinfo.pay_host,
                        endurl: "/checked",
                        callback: callback,
                        failcallback: failcallback,
                        needJsonParse: false,
                        tipcallback: tipcallback,
                    });
                } else {
                    cc.director.preloadScene(hqq.subModel.payActivity.lanchscene, this.onProgress.bind(this), () => {
                        cc.director.loadScene(hqq.subModel.payActivity.lanchscene);
                    })
                }
            } else {
                hqq.app.needShowFree = true;
                hqq.needShowNotice = true;
                this.jumpToNextScene();
            }
        }
    },
    getReginIp(trynum) {
        if (CC_DEBUG) {
            hqq.gameGlobal.ipCheck = true
            return
        }
        if (hqq.gameGlobal.player.phonenum != "") {
            hqq.gameGlobal.ipCheck = true
            return
        }
        if (!hqq.gameGlobal.ipapiData) {
            this.getReginIp2()
            return
        }
        if (hqq.app.reginIpData && hqq.app.reginIpData.query == hqq.gameGlobal.regin_ip) {
            let regindata = hqq.app.reginIpData
            if (hqq.gameGlobal.ipapiData.regionName == regindata.regionName) {
                hqq.gameGlobal.ipCheck = true
            } else {
                this.getLocalIp2(3, true)
            }
            return
        }
        trynum = trynum || 2
        let callback = (data) => {
            hqq.app.reginIpData = data
            hqq.localStorage.globalSet(hqq.app.reginIpDataKey, data);
            if (hqq.gameGlobal.ipapiData && hqq.gameGlobal.ipapiData.regionName == hqq.app.reginIpData.regionName) {
                hqq.gameGlobal.ipCheck = true
            } else {
                this.getLocalIp2(3, true)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("ipapi获得信息失败：" + status + ",err:" + err + ",trynum:" + trynum, readyState);
            trynum--
            if (trynum > 0) {
                setTimeout(() => {
                    this.getReginIp(trynum)
                }, 500);
            }
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: "http://ip-api.com/json/" + hqq.gameGlobal.regin_ip + "?lang=zh-CN",
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    getReginIp2(trynum) {
        if (hqq.app.reginIpData2 && hqq.app.reginIpData2.ip == hqq.gameGlobal.regin_ip) {
            if (hqq.gameGlobal.ipinfoData.region == hqq.app.reginIpData2.region) {
                hqq.gameGlobal.ipCheck = true
            } else {
                this.getHavePay()
            }
            return
        }
        trynum = trynum || 2
        let callback = (data) => {
            hqq.app.reginIpData2 = data
            hqq.localStorage.globalSet(hqq.app.reginIpData2Key, data);
            if (hqq.gameGlobal.ipinfoData && hqq.gameGlobal.ipinfoData.region == hqq.app.reginIpData2.region) {
                hqq.gameGlobal.ipCheck = true
            } else {
                this.getHavePay()
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("ipapi获得信息失败：" + status + ",err:" + err + ",trynum:" + trynum, readyState);
            trynum--
            if (trynum > 0) {
                setTimeout(() => {
                    this.getReginIp2(trynum)
                }, 500);
            } else {
                this.getHavePay()
            }
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: "https://ipinfo.io/" + hqq.gameGlobal.regin_ip + "/json",
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    getHavePay(trynum) {
        console.log("getHavePay")
        trynum = trynum || 2
        let callback = (data) => {
            console.log("data", JSON.stringify(data))
            if (data.status != 0) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "获取充值状态失败：" + data.msg)
            }
            if (data.data.frist_pay_amount) {
                hqq.gameGlobal.ipCheck = true
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("getHavePay获得信息失败：" + status + ",err:" + err + ",trynum:" + trynum, readyState);
            trynum--
            if (trynum > 0) {
                setTimeout(() => {
                    this.getReginIp2(trynum)
                }, 500);
            }
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: hqq.gameGlobal.pay.pay_host + "/api/activity/getFristPayAmount?token=e40f01afbb1b9ae3dd6747ced5bca532&user_id=" + hqq.gameGlobal.player.id + "&is_hall=1",
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    onProgress(completedCount, totalCount, item) {
        hqq.eventMgr.dispatch(hqq.eventMgr.hotProgress, completedCount / totalCount, "jiazai")
    },
    jumpToNextScene() {
        if (hqq.webGameID) {
            let mcallback = (subdata) => {
                if (subdata == "hbsl" || subdata == 'zrsx1' || subdata == 'zrsx2'
                    || subdata == 'pccp' || subdata == 'sbty1' || subdata == 'sbty2') { //  真人视讯 红包扫雷 派彩 沙巴体育 竖屏
                    hqq.reflect && hqq.reflect.setOrientation("portrait")
                    if (subdata == 'zrsx1') {
                        hqq.gameGlobal.subGameType = 40
                    } else if (subdata == 'zrsx2') {
                        hqq.gameGlobal.subGameType = 24
                    } else if (subdata == 'sbty1') {
                        hqq.gameGlobal.subGameType = 0
                    } else if (subdata == 'sbty2') {
                        hqq.gameGlobal.subGameType = 1
                    }
                }
                if (subdata == "zrsx1" || subdata == "zrsx2") {
                    if (subdata == "zrsx1") {
                        !hqq.isDebug && cc.assetManager.loadBundle("zrsx", function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            cc.director.preloadScene(hqq.subGameList[subdata].lanchscene, this.onProgress.bind(this), () => {
                                cc.director.loadScene(hqq.subGameList[subdata].lanchscene);
                            })
                            console.log('load subpackage script successfully.', "zrsx");
                        });
                    }
                } else if (subdata == "sbty1" || subdata == "sbty2") {
                    if (subdata == "sbty1") {
                        !hqq.isDebug && cc.assetManager.loadBundle("sbty", function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            cc.director.preloadScene(hqq.subGameList[subdata].lanchscene, this.onProgress.bind(this), () => {
                                cc.director.loadScene(hqq.subGameList[subdata].lanchscene);
                            })
                            console.log('load subpackage script successfully.', "sbty");
                        });
                    }
                } else {
                    !hqq.isDebug && cc.assetManager.loadBundle(subdata, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        cc.director.preloadScene(hqq.subGameList[subdata].lanchscene, this.onProgress.bind(this), () => {
                            cc.director.loadScene(hqq.subGameList[subdata].lanchscene);
                        })
                        console.log('load subpackage script successfully.', subdata);
                    });
                }
            }
            for (let k in hqq.subGameList) {
                if (hqq.subGameList[k].game_id == hqq.webGameID) {
                    let subname = k
                    if (k == "zrsx1" || k == "zrsx2") {
                        subname = "zrsx"
                    } else if (k == "sbty1" || k == "sbty2") {
                        subname = "sbty"
                    }
                    if (!hqq.subGameList[k].hasAccount) {
                        hqq.loginMgr.createSubAccount(k, mcallback);
                    } else {
                        mcallback(subname);
                    }
                    break;
                }
            }
        } else {
            cc.director.preloadScene("hall", this.onProgress.bind(this), () => {
                cc.director.loadScene("hall");
            })
        }
    },
    /** 创建子游戏账号 */
    createSubAccount(enname, mcallback, custom) {
        if (hqq.subGameList[enname].hasAccount) {
            if (custom) {
                mcallback && mcallback(custom);
            } else {
                mcallback && mcallback(enname);
            }
            return
        }
        let subdata = hqq.app.remoteGamelist[0]
        for (let i = 0; i < hqq.app.remoteGamelist.length; i++) {
            if (hqq.subGameList[enname].game_id == hqq.app.remoteGamelist[i].game_id) {
                subdata = hqq.app.remoteGamelist[i]
                break;
            }
        }
        let callback = (data) => {
            console.log("创建子游戏账号 callback", data)
            if (data.code == 200 || data.code == 203 || (data.code == 404 && data.msg == "account already exists")) {
                for (let gname in hqq.subGameList) {
                    if (hqq.subGameList[gname].game_id == subdata.game_id) {
                        hqq.subGameList[gname].hasAccount = true;
                        hqq.localStorage.set(gname, "hasAccount", true);
                    }
                }
                if (custom) {
                    mcallback && mcallback(custom);
                } else {
                    mcallback && mcallback(enname);
                }
            } else {
                hqq.logMgr.log("创建子游戏账号返回失败", data)
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "创建子游戏账号返回失败:" + data.code);
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求创建子游戏账号失败:" + status + ",err:" + err);
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "创建子游戏账号失败:" + status + ",err:" + err)
            hqq.logMgr.log("请求创建子游戏账号失败", status, forcejump, err, readyState)
        }
        let endurl = "/Game/User/createGameAccount";
        let data = {
            game_id: subdata.game_id,
            package_id: subdata.package_id,
            balance: 0,
            id: hqq.gameGlobal.player.id,
            token: hqq.gameGlobal.token,
        }
        hqq.http.sendXMLHttpRequest({
            method: "POST",
            urlto: hqq.app.server + endurl,
            param: data,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
            timeout: 5000,
            failtimeout: 7000,
        });
    },
    /**
     * @Description: 切换账号
     */
    accountChange(account, pass, mcallback) {
        hqq.logMgr.log("accountChange")
        let callback = (data, url) => {
            this.log(" accountChange callback", data, url)
            if (data.code !== 200) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登陆失败:" + data.msg)
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "登陆失败:" + data.msg)
            } else {
                if (!hqq.isDebug && hqq.hallWebSocket) {
                    hqq.hallWebSocket.close()
                    let url = hqq.app.server;
                    if (url.indexOf("://") == -1) {
                        url = "ws://" + url;
                    } else {
                        let sourl = url.split("://")[1];
                        let header = url.split("://")[0];
                        let soHeader = "";
                        if (header == "http") {
                            soHeader = "ws://";
                        } else if (header == "https") {
                            soHeader = "wss://";
                        }
                        url = soHeader + sourl;
                    }
                    this.setPlayerInfo(data, true)
                    hqq.hallWebSocket.connect(url);
                } else {
                    this.setPlayerInfo(data, false)
                }
                mcallback && mcallback(true, data.msg.token)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("accountChange failcallback", status, forcejump, url, err, readyState)
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "网络太差，登陆超时:" + status + ";err:" + err)
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "网络太差，登陆超时:" + status + ";err:" + err)
        }
        let endurl = hqq.app.getIpGetEndurl(0) + "?"
        endurl += "uuid=" + hqq.app.deviceID;
        endurl += "&package_name=" + hqq.app.packgeName;
        endurl += "&os=" + hqq.app.os;
        if (hqq.gameGlobal.player.code == "0") {
            hqq.gameGlobal.player.code = hqq.app.getGeneralAgency();
        }
        endurl += "&code=" + hqq.gameGlobal.player.code;
        endurl += "&unique_id=" + hqq.app.unique_id;
        endurl += "&account_name=" + account;
        endurl += "&account_pass=" + pass;
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: hqq.app.server,
            endurl: endurl,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        });
    },
    /**
     * @Description: 自动登录(总代登陆，不要修改代理code了)
     */
    autoLogin() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "自动登录中")
        if ((cc.sys.os === cc.sys.OS_IOS || cc.sys.isBrowser) && (!hqq.app.deviceID || hqq.app.deviceID == "empty")) {
            let tipstr2 = "无法获取到您的手机系统信息, 您可以通过以下方法进入游戏: \n" +
                "ios14以前的版本, 请先关闭游戏进程, 然后打开手机的 '设置' 里的 '隐私' - '广告', 将'限制广告跟踪'设置为关闭, 然后重新进入游戏。\n" +
                "ios14版本, 请先关闭游戏进程, 然后打开手机的 '设置' - 里的 '隐私' - '跟踪', 将本游戏的 '允许App请求跟踪' 设置为开启, 然后重新进入游戏。\n"
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, tipstr2)
            let tipstr = "无法获取到您的手机系统信息, 您可以通过以下二种方法进入游戏: \n" +
                "方法一: \n" +
                "ios14以前的版本, 请先关闭游戏进程, 然后打开手机的 '设置' 里的 '隐私' - '广告', 将'限制广告跟踪'设置为关闭, 然后重新进入游戏。\n" +
                "ios14版本, 请先关闭游戏进程, 然后打开手机的 '设置' - 里的 '隐私' - '跟踪', 将本游戏的 '允许App请求跟踪' 设置为开启, 然后重新进入游戏。\n" +
                "方法二：\n" +
                "点击确定后按注册流程进入游戏。"
            hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, {
                type: 10,
                msg: tipstr,
                fontSize: 23,
                hideexitbtn: true,
                ensurefunc: () => {
                    let mynode = cc.director.getScene().getChildByName('smallsublayer')
                    mynode && mynode.removeFromParent(true)
                    hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 12, hideexitbtn: true })
                }
            })
            return
        }
        let callback = (data, url) => {
            hqq.logMgr.log("autologin callback", url, JSON.stringify(data.msg))
            if (data.code !== 200) {
                this.errinfo += "自动登录失败:" + data.msg + ",p:" + hqq.app.packgeName + ",c:" + hqq.gameGlobal.player.code
                    + ",a:" + hqq.app.getGeneralAgency() + ";d:" + hqq.app.deviceID + ";"
                hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, this.errinfo)
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "自动登录失败")
            } else {
                this.setPlayerInfo(data)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLoadingInfo, "登陆超时，正在重新登陆:" + status + ";err:" + err)
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "登陆超时，正在重新登陆:" + status + ";err:" + err)
            hqq.logMgr.log("登陆超时，正在重新登陆:", status, forcejump, url, err, readyState)
            this.reStartAtSecret();
        }
        let endurl = ""
        endurl += hqq.app.getIpGetEndurl(2) + "?"
        endurl += "&uuid=" + hqq.app.deviceID;
        endurl += "&package_name=" + hqq.app.packgeName;
        endurl += "&os=" + hqq.app.os;
        endurl += "&code=" + hqq.app.getGeneralAgency();
        endurl += "&unique_id=" + hqq.app.unique_id;
        endurl += "&account_name=" + hqq.gameGlobal.player.account_name;
        endurl += "&account_pass=" + hqq.gameGlobal.player.account_pass;
        endurl += "&token=" + hqq.gameGlobal.token;
        hqq.logMgr.log("autologin", endurl)
        hqq.http.sendXMLHttpRequest({
            method: "GET",
            urlto: hqq.app.server,
            endurl: endurl,
            callback: callback.bind(this),
            failcallback: failcallback.bind(this),
            needJsonParse: true,
        });
    },
    m_destroy() {
        hqq.eventMgr.unregister(hqq.eventMgr.hotCheckup, "appLogin")
        hqq.eventMgr.unregister(hqq.eventMgr.hotFail, "appLogin")
        hqq.eventMgr.unregister(hqq.eventMgr.hotProgress, "appLogin")
        hqq.eventMgr.unregister(hqq.eventMgr.hotFinish, "appLogin")
        hqq.logMgr.sendLog()

        this.testCurLine()
    },
    log() {
        this.isRealTimeLog && console.log("__appLogin__", ...arguments)
    },
    stableRestartAtSecret() {
        setTimeout(() => {
            let callback = (response) => {
                let data = this.decodeSecret(response);
                let book = data[hqq.app.huanjin];
                hqq.localStorage.globalSet(hqq.app.hotServerKey, book.upgrade)
                hqq.app.codeBook = book.select;
                hqq.localStorage.globalSet(hqq.app.codeBookKey, book.select);
                this.stableRequestSelect();
            }
            let failcallback = (status, forcejump, url, err, readyState) => {
                hqq.logMgr.log('stable请求密码本失败，重新请求密码本', status, forcejump, err, readyState)
                this.stableRestartAtSecret()
            }
            hqq.http.requestFastestUrlLine({
                urllist: hqq.app.secretlist,
                callback: callback,
                failcallback: failcallback,
                needJsonParse: false,
            })
        }, 500)
    },
    stableRequestSelect() {
        let urllist = hqq.localStorage.globalGet(hqq.app.codeBookKey)
        if (hqq.app.selectServerIndex) {
            urllist = hqq.commonTools.swapItem(urllist, hqq.app.selectServerIndex, 0);
        }
        let callback = (response, url, checknum) => {
            hqq.app.selectServerIndex = checknum;
            hqq.localStorage.globalSet(hqq.app.selectServerIndexKey, checknum);
            let murl = this.decodeServer(response);
            let urllist = murl.split(",");
            hqq.app.serverList = urllist;
            hqq.localStorage.globalSet(hqq.app.serverListKey, urllist);
            this.requestStableServerUrl();
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("请求最快的接待服务器失败，重新请求密码本", status, forcejump, err, readyState)
            this.stableRestartAtSecret();
        }
        hqq.http.requestFastestUrlLine({
            urllist: urllist,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: false,
        })
    },
    /**
     * @Description: 恒定线路检测
     */
    requestStableServerUrl() {
        let urllist = hqq.app.serverList
        let storageList = hqq.localStorage.globalGet(hqq.app.stableServerListKey)
        storageList = this.dealDiffLine(storageList, urllist)

        let murllist = hqq.localStorage.globalGet(hqq.app.hotServerKey)
        let hotserverList = hqq.localStorage.globalGet(hqq.app.stableHotServerListKey)
        hotserverList = this.dealDiffLine(hotserverList, murllist)

        let templist
        let callback = (returnList, checknum, isServer) => {
            let ipresult = "沒有获取到ip信息"
            if (hqq.gameGlobal.ipapiData && hqq.gameGlobal.ipapiData.country) {
                ipresult = "country:" + hqq.gameGlobal.ipapiData.country
                    + ",city:" + hqq.gameGlobal.ipapiData.city
                    + ",query:" + hqq.gameGlobal.ipapiData.query
                    + ",lat:" + hqq.gameGlobal.ipapiData.lat
                    + ",lon:" + hqq.gameGlobal.ipapiData.lon
                    + ",isp:" + hqq.gameGlobal.ipapiData.isp
                    + ",as:" + hqq.gameGlobal.ipapiData.as
            }
            if (isServer) {
                hqq.localStorage.globalSet(hqq.app.stableServerListKey, returnList);
                if (returnList.stable && returnList.stable.url && hqq.app.server != returnList.stable.url) {
                    hqq.app.server = returnList.stable.url
                    hqq.localStorage.globalSet(hqq.app.serverKey, hqq.app.server);
                    hqq.app.serverIndex = returnList.stable.index || checknum;
                    hqq.localStorage.globalSet(hqq.app.serverIndexKey, hqq.app.serverIndex);
                    hqq.app.checkSubServer();
                }
                for (let k = 0; k < returnList.serverList.length; k++) {
                    if (returnList.serverList[k].status == 0) {
                        return // 有线路没有测完
                    }
                }
                templist = JSON.stringify(returnList)
            } else {
                hqq.localStorage.globalSet(hqq.app.stableHotServerListKey, returnList);
                hqq.app.canHotServer = returnList.stable.url;
                hqq.localStorage.globalSet(hqq.app.canHotServerKey, hqq.app.canHotServer);
                for (let k = 0; k < returnList.serverList.length; k++) {
                    if (returnList.serverList[k].status == 0) {
                        return // 有线路没有测完
                    }
                }
                hqq.app.hotServerIndex = returnList.stable.index || checknum;
                hqq.localStorage.globalSet(hqq.app.hotServerIndexKey, hqq.app.hotServerIndex);
                hqq.logMgr.sendMLog("一次测试后的结果:" + ipresult + ",恒定线路检测:" + templist + ",恒定热更线路检测：" + JSON.stringify(returnList))
            }
        }
        hqq.http.requestStableUrlLine({
            storageList: storageList,
            hotserverList: hotserverList,
            isServer: true,
            callback: callback,
        })
    },
    dealDiffLine(storageList, urllist) {
        if (!storageList || !storageList.stable) {
            storageList = {
                stable: {},
                serverList: []
            }
            for (let i = 0; i < urllist.length; i++) {
                storageList.serverList.push({ "index": storageList.serverList.length, "url": urllist[i], "averageTime": 0, testnum: 0, status: 0, })
            }
        }

        let deletList = []
        for (let i = 0; i < storageList.serverList.length; i++) {
            let isdelet = true
            for (let j = 0; j < urllist.length; j++) {
                if (storageList.serverList[i].url == urllist[j]) {
                    isdelet = false
                    break
                }
            }
            if (isdelet) {
                deletList.push(storageList.serverList[i].url)
            }
        }
        for (let i = 0; i < deletList.length; i++) {
            for (let j = 0; j < storageList.serverList.length; j++) {
                if (deletList[i] == storageList.serverList[j].url) {
                    storageList.serverList.splice(j, 1)
                    break
                }
            }
        }
        let addList = []
        for (let i = 0; i < urllist.length; i++) {
            let idadd = true
            for (let j = 0; j < storageList.serverList.length; j++) {
                if (storageList.serverList[j].url == urllist[i]) {
                    idadd = false
                    break
                }
            }
            if (idadd) { // 新增的线路
                addList.push(urllist[i])
            }
        }
        for (let i = 0; i < addList.length; i++) {
            storageList.serverList.push({ "index": storageList.serverList.length, "url": addList[i], "averageTime": 0, testnum: 0, status: 0, })
        }
        if (addList.length > 0) { // 有新增，全部重置
            for (let i = 0; i < storageList.serverList.length; i++) {
                storageList.serverList[i] = ({ "index": i, "url": storageList.serverList[i].url, "averageTime": 0, testnum: 0, status: 0, })
            }
        } else {
            for (let i = 0; i < storageList.serverList.length; i++) {
                storageList.serverList[i].index = i
            }
        }
        return storageList
    },
    testCurLine() {
        let urllist = []
        urllist.push(hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/" + 'version.json?' + Math.floor(Math.random() * 1000000))
        urllist.push(hqq.app.server + "/checked?" + Math.floor(Math.random() * 1000000))
        hqq.http.testLine(urllist, this.testCurLineCallback.bind(this), 1)
    },
    testCurLineCallback(url, index, spendtime, err) {
        this.testTimeList.push(spendtime)
        if (err) {
            this.errList.push(err)
        }
        this.testTime = this.testTime < spendtime ? spendtime : this.testTime
        if (index == 1) {
            if (this.errList && this.errList.length == 2) {
                this.testTime = hqq.app.netState.bad + 1
                hqq.eventMgr.dispatch(hqq.eventMgr.refreshNetState, { time: this.testTime, timelist: this.testTimeList, errlist: this.errList })
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.refreshNetState, { time: this.testTime, timelist: this.testTimeList, errlist: this.errList })
            }
            setTimeout(() => {
                this.testTime = 0;
                this.testTimeList = [];
                this.errList = [];
                this.testCurLine();
            }, 5000);
        }
    },
    getBrandRes() {
        let reslist = hqq.app.versionJson[hqq.app.pinpai].brandRes;
        if (!reslist && !hqq.isDebug) {
            console.log("云端未配置品牌资源信息")
            return
        }
        let index = 0;
        for (let i = 0; i < reslist.length; i++) {
            if (reslist[i]) {
                index = i
                break
            }
        }
        let urlto = hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/brandres/" + hqq.app.pinpai + "/" + reslist[index]
        let storagepath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'brand\\');
        let localpath = storagepath + reslist[index]
        if (!jsb.fileUtils.isFileExist(localpath)) {
            jsb.fileUtils.createDirectory(storagepath)
            let callback = (response) => {
                if (!jsb.fileUtils.writeDataToFile(new Uint8Array(response), localpath)) {
                    cc.log('Remote write file failed.');
                }
                index++
                if (index < reslist.length) {
                    urlto = hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/brandres/" + hqq.app.pinpai + "/" + reslist[index]
                    localpath = storagepath + reslist[index]
                    hqq.http.getRes(urlto, callback, failcallback)
                } else {
                    this.setBrandRes()
                }
            }
            let failcallback = (status, forcejump, url, err, readyState) => {
                hqq.http.getRes(urlto, callback, failcallback)
            }
            hqq.http.getRes(urlto, callback, failcallback)
        } else {
            this.setBrandRes()
        }
    },
    setBrandRes() {
        if (cc.director.getScene().name == "loading") {
            let reslist = hqq.app.versionJson[hqq.app.pinpai].brandRes;
            if (!reslist && !hqq.isDebug) {
                console.log("云端未配置品牌资源信息")
                return
            }
            let storagepath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'brand\\');
            reslist[3] && cc.assetManager.loadRemote(storagepath + reslist[3], function (err, tex) {
                if (err) {
                    cc.error(err);
                } else {
                    let mspriteFrame = new cc.SpriteFrame(tex);
                    let bg = cc.find("Canvas/Main Camera/brandnode/bg")
                    let bgsprite = bg.getComponent(cc.Sprite)
                    bgsprite.spriteFrame = mspriteFrame
                }
            });
            if (reslist[0] && reslist[1] && reslist[2]) {
                cc.assetManager.loadRemote(storagepath + reslist[0], function (err, loadimg) {
                    if (err) {
                        cc.error(err);
                        return
                    }
                    cc.assetManager.loadRemote(storagepath + reslist[1], (err, loadatlas) => {
                        if (err) {
                            cc.error(err);
                            console.log("加载logo动画资源报错：", err)
                            return
                        }
                        cc.assetManager.loadRemote(storagepath + reslist[2], (err, loadjson) => {
                            if (err) {
                                cc.error(err);
                                console.log("加载logo动画资源报错：", err)
                                return
                            }
                            let ani = cc.find("Canvas/Main Camera/brandnode/ani")
                            let skeleton = ani.getComponent(sp.Skeleton)
                            var asset = new sp.SkeletonData();
                            asset.skeletonJson = loadjson;
                            asset.atlasText = loadatlas;
                            asset.textures = [loadimg];
                            asset.textureNames = [reslist[0]];
                            skeleton.skeletonData = asset;
                            if (hqq.app.pinpai == 'debi') {
                                skeleton.setAnimation(0, "animation", false);
                            } else {
                                skeleton.setAnimation(0, "animation", true);
                            }
                        });
                    });
                });
            }
        }
    },
    requestVersionJson(callback) {
        let mycallback = (response, url) => {
            hqq.app.versionJson = response
            hqq.app.subGameVersion = response.version
            hqq.app.packageID = response[hqq.app.pinpai].packageID
            hqq.app.proxyUserID = response[hqq.app.pinpai][hqq.app.huanjin].proxyUserID
            hqq.app.setGeneralAgency(response)
            callback && callback()
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("requestUpgradeInfo 请求热更服务器信息失败", status, forcejump, url, err, readyState)
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "无法请求到更新资源，请检查您的网络")
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: hqq.app.canHotServer + "/" + hqq.app.hotupdatePath + "/" + 'version.json?' + Math.floor(Math.random() * 1000000),
            callback: mycallback,
            failcallback: failcallback,
            needJsonParse: true,
        })
    },
}

module.exports = appLogin