

cc.Class({
    extends: cc.Component,

    properties: {
        register: cc.Node,
        changehead: cc.Node,
        bindalipay: cc.Node,
        nickchange: cc.Node,
        login: cc.Node,
        nologin: cc.Node,
        download: cc.Node,
        tiplayer: cc.Node,
        tiplayerinfo: cc.Label,
        imnode: cc.Node,

        exitbtn: cc.Node,
        surecg: cc.Node,

        headscroll: cc.ScrollView,
        headitem: cc.Node,
    },

    onLoad() {

    },

    start() {

    },

    init(data) {
        this.headpanelinit = false
        this.ensurefunc = () => {
            this.onClickExit()
        }
        this.changehead.active = false
        this.bindalipay.active = false
        this.nickchange.active = false
        this.login.active = false
        this.nologin.active = false
        this.tiplayer.active = false
        this.download.active = false
        this.data = data
        switch (data.type) {
            case 1: // 修改头像
                this.changehead.active = true
                if (!this.headpanelinit) {
                    this.headpanelinit = true
                    this.changeheadInit()
                }
                this.ensurefunc = this.changeheadCallback
                break;
            case 2: // 绑定支付宝
                this.bindalipay.active = true
                this.ensurefunc = this.bindalipayCallback
                break;
            case 3: // 修改昵称
                this.nickchange.active = true
                this.ensurefunc = this.nickchangeCallback
                break;
            case 4: // 切换账号
                this.login.active = true
                this.ensurefunc = this.loginCallback
                break;
            case 5: // 切换账号 自动加 id 
                this.login.active = true
                this.login.getChildByName("phoneeditbox").getComponent(cc.EditBox).string = hqq.gameGlobal.player.id
                this.ensurefunc = this.loginCallback
                break;
            case 6: // 账号掉线
                this.nologin.active = true
                this.exitbtn.active = false
                this.surecg.y = -140
                this.ensurefunc = this.nologinCallback
                break;
            case 7: // 账号掉线 加自动登录
                this.login.active = true
                if (this.login.getChildByName("txt_autologin")) {
                    this.login.getChildByName("txt_autologin").active = true
                }
                if (this.login.getChildByName("txt_forgetpwd")) {
                    this.login.getChildByName("txt_forgetpwd").active = false
                }
                this.ensurefunc = this.loginCallback
                break;
            case 8: // 安装包跳转下载
                this.download.active = true
                if (data.msg) {
                    let label = this.download.getChildByName('downlabel').getComponent(cc.Label)
                    label.string = data.msg || '安装包有更新，请点击确定进行重新下载安装'
                }
                this.exitbtn.active = false
                this.surecg.y = -10
                this.clearLocalData()
                this.ensurefunc = this.downLoadCallback
                break;
            case 9: // 跳转浏览器网页客户端
                this.tiplayerinfo.string = data.msg || 'ios掉包严重，移步至浏览器网页版，无忧游戏'
                this.tiplayer.active = true
                this.surecg.y = -140
                this.ensurefunc = this.openUrl
                break;
            case 10: // 任意提示信息
                this.tiplayerinfo.string = data.msg || '金币不足，不能进入该等级的房间'
                if (data.fontSize) {
                    this.tiplayerinfo.fontSize = data.fontSize
                    this.tiplayerinfo.lineHeight = data.fontSize * 1.3
                }
                this.tiplayer.active = true
                this.surecg.y = -140
                if (data.ensurefunc) {
                    this.ensurefunc = data.ensurefunc
                }
                break;
            case 11: // im选择
                this.imnode.active = true
                this.surecg.active = false
                this.initImNode()
                break;
            case 12: // 注册
                this.register.active = true
                this.ensurefunc = data.ensurefunc
                break;
        }
        if (data.hideexitbtn) {
            this.exitbtn.active = false
        }
        if (data.exitfunc) {
            this.onClickExit = () => {
                data.exitfunc()
                this.node.removeFromParent(true)
            }
        }
    },
    randDeviceID() {
        let randID = ""
        for (let i = 0; i < 3; i++) {
            let s = Math.random().toString(36)
            randID += s.substring(s.indexOf(".") + 1)
        }
        return randID
    },
    registerTextEndCheck(event, customEventData) {
        let text = event.string
        if (text.length < 6) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "账号密码太短，请重新输入")
            return
        }
        if (text.length > 12) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "账号密码太长，请重新输入")
            return
        }
        if (!text.match(/[0-9a-zA-Z]/g) || text.match(/[0-9a-zA-Z]/g).length != text.length) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "账号密码包含0-9a-zA-Z之外的特殊字符，请重新输入")
            return
        }
    },
    registerAccount() {
        let account = this.register.getChildByName("account").getComponent(cc.EditBox).string
        let pass0 = this.register.getChildByName("pass0").getComponent(cc.EditBox).string
        let pass1 = this.register.getChildByName("pass1").getComponent(cc.EditBox).string
        if (account.length < 6) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "账号太短")
            return
        }
        if (account.length > 12) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "账号太长，请重新输入")
            return
        }
        if (account.match(/[0-9a-zA-Z]/g).length != account.length) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "账号中包含0-9a-zA-Z之外的特殊字符")
            return
        }
        if (pass0.length < 6 || pass1.length < 6) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "密码太短")
            return
        }
        if (pass0.length > 12) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "密码太长，请重新输入")
            return
        }
        if (pass0 != pass1) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "两次输入密码不同，请重新输入密码")
            return
        }
        if (pass0.match(/[0-9a-zA-Z]/g).length != pass0.length) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "密码中包含0-9a-zA-Z之外的特殊字符")
            return
        }
        let callback = (data, url) => {
            if (data.code == 200) {
                this.onClickExit()
                hqq.loginMgr.setPlayerInfo(data)
            } else {
                if (data.code == 404 && data.msg == "uuid is exists") {
                    hqq.http.sendXMLHttpRequest({
                        method: 'POST',
                        urlto: hqq.app.server,
                        endurl: hqq.app.getIpPostEndUrl(9),
                        callback: callback,
                        failcallback: failcallback,
                        needJsonParse: true,
                        param: {
                            uuid: this.randDeviceID(),
                            os: hqq.app.os,
                            package_name: hqq.app.packgeName,
                            account_pass: pass1,
                            game_nick: account,
                            role_name: account,
                            proxy_user_id: hqq.gameGlobal.player.code,
                        }
                    })
                } else {
                    hqq.logMgr.log("注册失败:" + data.code + ",信息:" + data, data.msg)
                    hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "注册失败:" + data.code + ",信息:" + data.msg)
                }
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("注册失败:" + status + ",错误:" + err, readyState)
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "注册失败:" + status + ",错误:" + err)
        }
        if (!hqq.gameGlobal.player.code) {
            hqq.gameGlobal.player.code = hqq.app.getGeneralAgency()
        }
        let randid = this.randDeviceID()
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: hqq.app.server,
            endurl: hqq.app.getIpPostEndUrl(9),
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
            param: {
                uuid: randid,
                os: hqq.app.os,
                package_name: hqq.app.packgeName,
                account_pass: pass1,
                role_name: account,
                proxy_user_id: hqq.gameGlobal.player.code,
            }
        })
    },
    initImNode() {
        let web = this.imnode.getChildByName("web")
        var webclickEventHandler = new cc.Component.EventHandler();
        webclickEventHandler.target = this.node;
        webclickEventHandler.component = "hallPSubsLayer";
        webclickEventHandler.handler = "onClickImWeb";
        let webbutton = web.getComponent(cc.Button);
        webbutton.clickEvents.push(webclickEventHandler);

        let app = this.imnode.getChildByName("app")
        var appclickEventHandler = new cc.Component.EventHandler();
        appclickEventHandler.target = this.node;
        appclickEventHandler.component = "hallPSubsLayer";
        appclickEventHandler.handler = "onCLlickImApp";
        let appbutton = app.getComponent(cc.Button);
        appbutton.clickEvents.push(appclickEventHandler);
    },
    onClickImWeb() {
        // hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "客服系统更新中,请选择app端入口冾线上客服")
        // cc.sys.openURL("https://chatlink.mstatik.com/widget/standalone.html?eid=211901")
        cc.sys.openURL("https://vue.livelyhelp.chat/chatwindow.aspx?platform=4a06-4ce4-926f-12e26e1043fa&planId=189&code=2abc&siteId=5001662&new=1&Skill=English&Product=LiveChat")
    },
    onCLlickImApp() {
        // cc.sys.openURL("http://www.kefu363.com/standalone.html?appId=M78540") // 404失效
        cc.sys.openURL("http://livechats.bffkydw.cn/service.html?cid=M78540")
        // if (hqq.subModel.im.lanchscene != "") {
        //     hqq.gameGlobal.imReceive = 0;
        //     hqq.reflect && hqq.reflect.setOrientation("portrait")
        //     cc.director.loadScene(hqq.subModel.im.lanchscene)
        // } else {
        //     console.log("请配置im场景")
        // }
    },

    // 清除本地缓存及可读写路径
    clearLocalData() {
        let islocalstorageClear = false
        if (hqq.localStorage) {
            islocalstorageClear = hqq.localStorage.clear()
            if (hqq.app.huanjin == 'dev') {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "删除本地缓存", islocalstorageClear)
            }
        }
        if (cc.sys.isBrowser) {
            return
        }
        let directory = jsb.fileUtils.getWritablePath()
        let isok = jsb.fileUtils.removeDirectory(directory)
        return isok
    },
    downLoadCallback() {
        if (hqq.app.downloadUrl) {
            cc.sys.openURL(hqq.app.downloadUrl)
        } else {
            if (hqq.app.pinpai == "test") {
                cc.sys.openURL("https://temp.wepic666.com?p=1&u=442619406")
            } else if (hqq.app.pinpai == "debi") {
                cc.sys.openURL("https://temp.wepic666.com?p=2&u=770256905")
            } else if (hqq.app.pinpai == "xingba") {
                cc.sys.openURL("https://temp.wepic666.com?p=3&u=811425071")
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "下载链接错误")
            }
        }
    },
    nologinCallback() {
        this.exitbtn.active = true
        this.nologin.active = false
        this.surecg.y = this.surecg.y - 61
        this.login.active = true
        this.login.getChildByName("phoneeditbox").getComponent(cc.EditBox).string = hqq.gameGlobal.player.id
        this.data = { type: 7 }
        this.ensurefunc = this.loginCallback
    },

    changeheadCallback() {
        let callback = (data, url) => {
            if (data.code == 200) {
                hqq.app.setGameInfo({ game_img: data.msg, })
                this.onClickExit()
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "修改失败:" + data.msg)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err, readyState)
        }

        let endurl = hqq.app.getIpPostEndUrl(8)
        let data = {
            id: hqq.gameGlobal.player.id,
            token: hqq.gameGlobal.token,
            image: this.headindex + ".png",
        }
        console.log("hqq.app.server + endurl", hqq.app.server + endurl)
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: hqq.app.server + endurl,
            param: data,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        })
    },

    alipayInputCheck(event) { // 支付宝账号输入检测
        let str = ''
        for (let i = 0; i < event.string.length; i++) {
            let input = event.string[i]
            if (!isNaN(input) || ((input >= 'A' && input <= 'Z') || (input >= 'a' && input <= 'z')) || input == "@" || input == ".") {
                str += event.string[i]
            } else if (/[^\u4e00-\u9fa5]/.test(event.string.charCodeAt(i))) { // @ 字符在里面
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "支付宝账号不支持中文字符")
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "支付宝账号只支持数字和英文字母")
            }
        }
        this.bindalipay.getChildByName("alipayeditbox").getComponent(cc.EditBox).string = str
    },

    bindalipayCallback() {
        let url = hqq.gameGlobal.pay.pay_host + "/api/payment_account/saveAccount"
        let alipayaccount = this.bindalipay.getChildByName("alipayeditbox").getComponent(cc.EditBox).string
        if (alipayaccount.length == 0) {
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入支付宝账号")
        }
        for (let i = 0; i < alipayaccount.length; i++) {
            let input = alipayaccount[i]
            if (!isNaN(input) || ((input >= 'A' && input <= 'Z') || (input >= 'a' && input <= 'z')) || input == "@" || input == ".") {
            } else {
                return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "支付宝账号只支持数字和英文字母")
            }
        }
        let shoukuanren = this.bindalipay.getChildByName("shoukuanren").getComponent(cc.EditBox).string
        if (shoukuanren.length == 0) {
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入收款人姓名")
        }
        let obj = {};
        obj = {
            account_card: alipayaccount,
            account_name: shoukuanren,
        };
        let info = JSON.stringify(obj);
        let dataStr = "user_id=" + hqq.gameGlobal.pay.user_id
        dataStr += "&user_name=" + hqq.gameGlobal.pay.user_name
        dataStr += "&action=add&withdraw_type=1&type=2"
        dataStr += "&info=" + info
        dataStr += "&client=" + hqq.gameGlobal.pay.client
        dataStr += "&proxy_user_id=" + hqq.gameGlobal.pay.proxy_user_id
        dataStr += "&proxy_name=" + hqq.gameGlobal.pay.proxy_name
        dataStr += "&package_id=" + hqq.gameGlobal.pay.package_id
        dataStr += "&token=e40f01afbb1b9ae3dd6747ced5bca532"
        dataStr += "&version=1"
        let callback = (response) => {
            if (response.status == 0) {
                hqq.eventMgr.dispatch(hqq.eventMgr.getPayInfo)
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "操作成功")
                this.onClickExit()
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, response.msg)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err, readyState)
        }
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: url,
            param: dataStr,
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },

    nickchangeCallback() {
        let callback = (data, url) => {
            if (data.code == 200) {
                hqq.eventMgr.dispatch(hqq.eventMgr.refreshPlayerinfo, { game_nick: data.msg })
                this.onClickExit()
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "修改失败:" + data.msg)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err, readyState)
        }

        let nick = this.nickchange.getChildByName("nickeditbox").getComponent(cc.EditBox).string
        if (nick == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入有效昵称")
            return
        }
        let endurl = hqq.app.getIpPostEndUrl(1)
        let data = {
            id: hqq.gameGlobal.player.id,
            token: hqq.gameGlobal.token,
            game_nick: nick,
        }
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: hqq.app.server + endurl,
            param: data,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        })
    },

    loginCallback() {
        let account = this.login.getChildByName("phoneeditbox").getComponent(cc.EditBox).string
        let pass = this.login.getChildByName("passeditbox").getComponent(cc.EditBox).string
        hqq.loginMgr.accountChange(account, pass, (issucess) => {
            if (issucess) {
                this.onClickExit()
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "切换账号失败")
            }
        })
    },

    changeheadInit() {
        this.itemlist = []
        this.headindex = "1"
        let headlen = 10
        this.headscroll.content.height = Math.floor(headlen / 5) * 155
        let player = hqq.gameGlobal.player
        let headid = parseInt(player.headurl.substring(0, player.headurl.indexOf(".")))
        headid = headid % 10
        for (let i = 0; i < headlen; i++) {
            let headitem = cc.instantiate(this.headitem)
            let head = headitem.getChildByName("masknode").getChildByName("head").getComponent(cc.Sprite)
            hqq.commonTools.loadHeadRes(i, head)
            let x = i % 5
            let y = Math.floor(i / 5)
            headitem.setPosition(156 * (x - 2), 155 * (-0.5 - y))
            headitem.active = true
            this.itemlist.push(headitem)
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "hallPSubsLayer";
            clickEventHandler.customEventData = i;
            clickEventHandler.handler = "onClickHeadItem";
            let button = headitem.getComponent(cc.Button);
            button.clickEvents.push(clickEventHandler);

            this.headscroll.content.addChild(headitem)
            if (headid == i) {
                this.onClickHeadItem({ target: headitem }, headid)
            }
        }
    },

    onClickHeadItem(event, custom) {
        this.headindex = custom + ""
        event.target.getChildByName("selectsp").active = true
        for (let i = 0; i < this.itemlist.length; i++) {
            if (custom == i) {
            } else {
                this.itemlist[i].getChildByName("selectsp").active = false
            }
        }
    },

    onClickForgetPass() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showBiglayer, 1)
        this.onClickExit()
    },

    onClickAutoLogin() {
        hqq.loginMgr.autoLogin()
    },

    onClickCopyDownurl() {
        if (hqq.reflect) {
            if (hqq.reflect.setClipboard(hqq.app.downloadUrl)) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "复制下载链接成功")
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "复制下载链接失败")
            }
        }
    },

    onClickExit() {
        this.node.removeFromParent(true)
    },

    onClickSure() {
        switch (this.data.type) {
            case 1: // 修改头像
                this.changeheadCallback()
                break;
            case 2: // 绑定支付宝
                this.bindalipayCallback()
                break;
            case 3: // 修改昵称
                this.nickchangeCallback()
                break;
            case 4: // 切换账号
                this.loginCallback()
                break;
            case 5: // 切换账号 自动加 id 
                this.loginCallback()
                break;
            case 6: // 账号掉线
                this.nologinCallback()
                break;
            case 7: // 账号掉线 加自动登录
                this.loginCallback()
                break;
            case 8: // 安装包跳转下载
                this.downLoadCallback()
                break;
            case 9: // 跳转浏览器网页客户端
                // this.openUrl()
                break;
            case 10:// 任意提示信息
            case 11:
                if (this.data.ensurefunc) {
                    this.data.ensurefunc()
                } else {
                    this.onClickExit()
                }
                break
            case 12:
                this.registerAccount()
                break;
        }
    },

    // update (dt) {},

});
