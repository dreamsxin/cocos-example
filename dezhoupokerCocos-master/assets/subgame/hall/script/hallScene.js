
let hallWebSocket = require("hallWebSocket");

cc.Class({
    extends: cc.Component,

    properties: {
        hbslFont: cc.LabelAtlas,
        namebg: cc.Node, // 头像底框
        yuyuad: cc.Node, // 渔鱼左侧公告
        yuyumenu: cc.Node, // 渔鱼按钮菜单列表
        noticepanel: cc.Node, // 滚动公告栏
        leftmenu: cc.Node, // 左侧菜单
        btnmenu: cc.Node, // 左侧菜单按钮列表
        btnmunuselect: cc.Node, // 左侧菜单选择效果

        youkeicon: cc.Node, // 游客
        headimg: cc.Sprite, // 玩家头像
        namelabel: cc.Label, // 玩家昵称
        coinlabel: cc.Label, // 玩家金币

        gonggaobtn: cc.Node, // 公告按钮

        activitybtn: cc.Node, // 活动按钮
        proxybtn: cc.Node, // 全民代理按钮
        chatbtn: cc.Node, // 聊天按钮
        duihuanbtn: cc.Node, // 兑换按钮
        chongzhibtn: cc.Node, // 充值按钮

        HBYbtn: cc.Node, // 红包雨按钮
        JFCJbtn: cc.Node, // 积分抽奖按钮

        itembtn: cc.Node, // 子游戏按钮
        subgameview: cc.ScrollView, // 子游戏按钮缓动面板
        web: cc.WebView, // 网页
        anilayer: cc.Node, // 红包雨页面
    },

    /** 脚本组件初始化，可以操作this.node // use this for initialization */
    onLoad() {
        this.subGameBtnMap = {};
        this.subGameBtnArr = [];
        this.subGameBtnState = { // 子游戏按钮状态
            needDown: 0,
            isWait: 1,
            progress: 2,
            canClick: 3,
            noOpen: 4,
        }
        this.isSubBtnClicked = false
        hqq.audioMgr.setButtonEffect(true);
        !hqq.isDebug && this.getNotice();
        if ((hqq.app.huanjin == 'online' && hqq.app.pinpai == 'debi') ||
            (hqq.app.huanjin == 'pre' && hqq.app.pinpai == 'test') ||
            (hqq.app.huanjin == 'dev' && hqq.app.pinpai == 'test')) {
            this.HBYbtn.active = false
            this.JFCJbtn.active = false
            this.HBYTimeLabel = this.HBYbtn.getChildByName('timelabel').getComponent(cc.Label)
            this.HBYTimeLabel.string = ""
            if (!hqq.HBYTick) {
                hqq.HBYTick = {
                    startDate: [0, 0, 0],
                    endDate: [0, 0, 0],
                    hour: 0,
                    mintute: 0,
                    second: 0,
                    isInOpen: false,
                    isGet: false,
                }
            }
        } else {
            this.HBYbtn.active = false
            this.JFCJbtn.active = false
        }
        //网页版问题都处理完成前先屏蔽
        // if (cc.sys.os === cc.sys.OS_IOS) { // hqq.app.huanjin == 'dev' ||
        //     if (!hqq.localStorage.globalGet("isShowIosTip")) {
        //         hqq.eventMgr.dispatch(hqq.eventMgr.showIosTipLayer, {})
        //     }
        //     let btn2 = cc.find('Canvas/Main Camera/toppanel/btnpanel/btn_iosweb')
        //     btn2.active = true;
        // }
    },
    /** enabled和active属性从false变为true时 */
    // onEnable() { },
    /** 通常用于初始化中间状态操作 */
    start() {
        this.scheduleOnce(() => {
            this.startInit();
        }, 0)
        let pn = cc.find('Canvas/Main Camera/netstatenode')
        hqq.eventMgr.dispatch(hqq.eventMgr.showNetStateNode, { parent: pn, position: { x: 0, y: 0 } })
        if (hqq.app.needShowFree) {
            hqq.app.needShowFree = false
            if (hqq.gameGlobal.player.phonenum == "") {
                if (hqq.app.huanjin == "dev") return
                hqq.eventMgr.dispatch(hqq.eventMgr.showRegister, null);
            }
        }
    },
    startInit() { // 最先注册，及时监听来自子游戏的退出事件
        hqq.eventMgr.register(hqq.eventMgr.hotCheckup, "hallScene", this.isupdataCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotFail, "hallScene", this.failCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotProgress, "hallScene", this.progressCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotFinish, "hallScene", this.finishCallback.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotUp, "hallScene", this.setSubGameBtnUp.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotCheck, "hallScene", this.setSubGameBtnCheck.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.hotWait, "hallScene", this.setSubGameBtnUpWait.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.refreshPlayerinfo, "hallScene", this.setPlayerInfo.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.onReceiveBroadcast, "hallScene", this.onReceiveBroadcast.bind(this))
        hqq.audioMgr.playBg("hallbg");
        this.huodonghongdian = cc.find('Canvas/Main Camera/toppanel/btnpanel/btn_huodong/redpoint')
        this.huodonghongdian && !hqq.hallactivitybtn && (this.huodonghongdian.active = true);
        this.scheduleOnce(() => {
            this.setPlayerInfo();
            this.initMenuBtn()
            this.checkSubModule();
        }, 0)
    },
    // 设置玩家信息
    setPlayerInfo(msg) {
        if (msg) {
            if (msg.game_nick) {
                this.namelabel.string = msg.game_nick;
            }
            if (msg.game_gold || msg.game_gold == 0) {
                this.coinlabel.string = msg.game_gold;
            }
            if (msg.game_img) {
                hqq.commonTools.loadHeadRes(msg.game_img, this.headimg)
            }
            if (msg.phone_number) {
                this.youkeicon.active = false
            } else {
                this.youkeicon.active = true
            }
        } else {
            let player = hqq.gameGlobal.player;
            this.namelabel.string = player.nick;
            this.coinlabel.string = player.gold;
            hqq.commonTools.loadHeadRes(player.headurl, this.headimg);
            if (hqq.gameGlobal.player.phonenum != "") {
                this.youkeicon.active = false
            } else {
                this.youkeicon.active = true
            }
        }
    },
    /** 子模块更新检查 im，充提，全民代理地址 */
    checkSubModule() {
        if (1 == hqq.gameGlobal.imReceive) {
            this.chatbtn.getChildByName("redpoint").active = true;
        }
        if (1 == hqq.gameGlobal.payReceive) {
            this.duihuanbtn.getChildByName("redpoint").active = true;
        }
        if (!hqq.isDebug) {
            if (hqq.gameGlobal.im_host == ""
                || hqq.gameGlobal.proxy.proxy_host == ""
                || hqq.gameGlobal.pay.pay_host == "") {
                hqq.app.checkSubServer();
            }
            if (hqq.gameGlobal.proxy.temp_host == "") {
                hqq.loginMgr.checkFatestTempHost();
            }
        }
        this.scheduleOnce(() => {
            this.initWebSoketAndHttp();
        }, 0)
    },
    initWebSoketAndHttp() {
        if (!hqq.isDebug && !hqq.hallWebSocket) {
            hqq.hallWebSocket = new hallWebSocket();
            hqq.hallWebSocket.init();
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
            hqq.hallWebSocket.connect(url);
        }
        this.scheduleOnce(() => {
            this.initSubGameBtn();
        }, 0)
    },
    /** 子游戏初始化 */
    initSubGameBtn() {
        if (hqq.app.pinpai == "yuyu") {
            let widget = this.subgameview.getComponent(cc.Widget)
            widget.left = 340
            widget.updateAlignment()
            this.subgameview._view.getComponent(cc.Widget).updateAlignment()
        } else {
            let widget = this.subgameview.getComponent(cc.Widget)
            widget.left = 250
            widget.updateAlignment()
            this.subgameview._view.getComponent(cc.Widget).updateAlignment()
        }
        let mscale = 1 // 1334 * hs / cc.view.getFrameSize().width
        this.subgameview.content.width = (Math.ceil(Object.getOwnPropertyNames(hqq.subGameList).length / 2) * (this.itembtn.width + 15)) * mscale + 15;
        this.subgameview.setContentPosition(cc.v2(-this.subgameview.node.width / 2, 0))
        for (let key in hqq.subGameList) {
            let i = hqq.subGameList[key].hallid;
            let tempdata = hqq.subGameList[key];
            let itembtn = cc.instantiate(this.itembtn);
            this.setSubBtnPos(itembtn, i)
            this.subgameview.content.addChild(itembtn);
            let namelabel = itembtn.getChildByName("nameimg").getComponent(cc.Sprite);
            let ani = itembtn.getChildByName("ani").getComponent('sp.Skeleton');
            hqq.commonTools.loadIconRes(ani, namelabel, hqq.subGameList[key].resPath)
            itembtn.downflag = itembtn.getChildByName('downFlag')
            itembtn.progress = itembtn.getChildByName('progress')
            itembtn.jiantou = itembtn.getChildByName('jiantou')
            itembtn.progresslabel = itembtn.getChildByName('progresslabel').getComponent(cc.Label)
            itembtn.tempdata = tempdata
            if (key == "zjh" || key == "ddz" || key == "hwby") {
                itembtn.getChildByName("experience").active = true;
            }
            if (key == "hbld" || key == "brnn" || key == 'jbpby') {
                itembtn.getChildByName("hot").active = true;
            }
            this.subGameBtnMap[tempdata.enname] = itembtn;
            this.subGameBtnArr[tempdata.hallid] = itembtn;
            if (hqq.hotUpdateMgr.getSubGameIsOnUp(tempdata.enname)) { // 子游戏在更新列表中
                this.setSubGameBtnUpWait(tempdata.enname);
            } else if (!hqq.isDebug) {
                this.checkSubGameDownload(tempdata.enname);
            } else {
                let subgamern = tempdata.enname
                if (tempdata.enname == "zrsx1" || tempdata.enname == "zrsx2") {
                    subgamern = "zrsx"
                    if (tempdata.enname == "zrsx1") {
                        if (cc.sys.isBrowser) {
                            setTimeout(() => {
                                this.loadBundle(subgamern)
                            }, 3000)
                        } else {
                            this.loadBundle(subgamern)
                        }
                    }
                } else if (tempdata.enname == "sbty1" || tempdata.enname == "sbty2") {
                    subgamern = "sbty"
                    if (tempdata.enname == "sbty1") {
                        if (cc.sys.isBrowser) {
                            setTimeout(() => {
                                this.loadBundle(subgamern)
                            }, 3000)
                        } else {
                            this.loadBundle(subgamern)
                        }
                    }
                } else {
                    if (cc.sys.isBrowser) {
                        setTimeout(() => {
                            this.loadBundle(subgamern)
                        }, 3000)
                    } else {
                        this.loadBundle(subgamern)
                    }
                }
                this.setSubGameBtnState(tempdata.enname, this.subGameBtnState.canClick);
            }
        }
        this.scheduleOnce(() => {
            !hqq.isDebug && this.sgjConnect()
            !hqq.isDebug && this.hbslConnect()
            !hqq.isDebug && this.hbldConnect()
            this.getHBYConfig();
        }, 0)
    },

    // 对左侧菜单按钮初始化
    initMenuBtn() {
        if (hqq.app.pinpai == "yuyu") {
            this.leftmenu.active = false
            this.noticepanel.active = false
            this.yuyumenu.active = true
            this.namebg.active = false
            this.yuyumenu.hqq_infolist = ["all", "changyong", "duizhan", "touzhu", "shixun", "zuqiu", "jieji"]
            for (let i = 0; i < this.yuyumenu.children.length; i++) {
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallScene";
                clickEventHandler.customEventData = this.yuyumenu.hqq_infolist[i];
                clickEventHandler.handler = "onClickYuyuMenuBtn";
                let button = this.yuyumenu.children[i].getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
            this.yuyumenu.children[0].getComponent(cc.Button).interactable = false
            this.yuyuad.active = true
            var clickAdEventHandler = new cc.Component.EventHandler();
            clickAdEventHandler.target = this.node;
            clickAdEventHandler.component = "hallScene";
            clickAdEventHandler.handler = "onClickYuyuAd";
            let button = this.yuyuad.children[0].getComponent(cc.Button);
            button.clickEvents.push(clickAdEventHandler);
        } else {
            this.leftmenu.active = true
            this.noticepanel.active = true
            this.yuyuad.active = false
            this.yuyumenu.active = false
            this.namebg.active = true
            this.btnmenu.hqq_infolist = ["all", "changyong", "duizhan", "touzhu", "shixun", "zuqiu", "jieji"]
            for (let i = 0; i < this.btnmenu.children.length; i++) {
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallScene";
                clickEventHandler.customEventData = this.btnmenu.hqq_infolist[i];
                clickEventHandler.handler = "onClickMenuBtn";
                let button = this.btnmenu.children[i].getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
            let pos = this.btnmenu.children[0].getPosition().add(this.btnmenu.getPosition())
            this.btnmunuselect.x = pos.x
            this.btnmunuselect.y = pos.y
            this.btnmenu.children[0].getComponent(cc.Button).interactable = false
        }
    },
    // 初始化后的按钮特效
    subGameBtnEffect() {
        for (let i = 0; i < this.subGameBtnArr.length; i += 2) {
            this.subGameBtnArr[i] && this.subGameBtnArr[i].runAction(cc.sequence(cc.delayTime(i * 0.02), cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 1)))
            this.subGameBtnArr[i + 1] && this.subGameBtnArr[i + 1].runAction(cc.sequence(cc.delayTime(i * 0.02), cc.scaleTo(0.1, 1.1), cc.scaleTo(0.1, 1)))
        }
    },
    // 点击左侧菜单按钮统一回调
    onClickMenuBtn(event, customEventData) {
        for (let i = 0; i < this.btnmenu.children.length; i++) {
            if (this.btnmenu.children[i].name.match(customEventData)) {
                this.btnmenu.children[i].getComponent(cc.Button).interactable = false
                let pos = this.btnmenu.children[i].getPosition().add(this.btnmenu.getPosition())
                this.btnmunuselect.x = pos.x
                this.btnmunuselect.y = pos.y
                this.refreshSubGameBtn(customEventData, this.btnmenu)
            } else {
                this.btnmenu.children[i].getComponent(cc.Button).interactable = true
            }
        }
    },
    // 点击渔鱼菜单按钮统一回调
    onClickYuyuMenuBtn(event, customEventData) {
        for (let i = 0; i < this.yuyumenu.children.length; i++) {
            if (this.yuyumenu.children[i].name.match(customEventData)) {
                this.yuyumenu.children[i].getComponent(cc.Button).interactable = false
                this.refreshSubGameBtn(customEventData, this.yuyumenu)
            } else {
                this.yuyumenu.children[i].getComponent(cc.Button).interactable = true
            }
        }
    },
    // 点击渔鱼公告按钮
    onClickYuyuAd() {
        console.log("点击渔鱼公告按钮")
        this.onClickHuoDongBtn()
    },
    // 刷新子游戏按钮
    refreshSubGameBtn(customEventData, btnmenu) {
        this.subgameview.scrollToLeft(0.5)
        let btnnum = 0
        if (customEventData == 'all') {
            for (let i = 0; i < this.subGameBtnArr.length; i++) {
                this.setSubBtnPos(this.subGameBtnArr[i], i)
                btnnum++
            }
        } else if (customEventData == 'changyong') {
            let subgemesortlist = []
            for (let key in hqq.subGameList) {
                let loginHistory = this.getSubGameLoginHistory(key)
                subgemesortlist.push({ "key": key, "num": loginHistory.length || 0 })
            }
            subgemesortlist.sort(function (a, b) {
                return b.num - a.num
            })
            let index = 0
            for (let i = 0; i < subgemesortlist.length; i++) {
                let key = subgemesortlist[i].key
                if (subgemesortlist[i].num) {
                    this.setSubBtnPos(this.subGameBtnMap[key], index)
                    btnnum++
                    index++
                } else {
                    let itembtn = this.subGameBtnMap[key]
                    itembtn.active = false
                }
            }
        } else {
            let type = 0
            for (let i = 0; i < btnmenu.hqq_infolist.length; i++) {
                if (customEventData.match(btnmenu.hqq_infolist[i])) {
                    type = i - 2
                    break
                }
            }
            let index = 0
            for (let i = 0; i < this.subGameBtnArr.length; i++) {
                let key = this.subGameBtnArr[i].tempdata.enname
                if (hqq.subGameList[key].gameType == type) {
                    this.setSubBtnPos(this.subGameBtnMap[key], index)
                    btnnum++
                    index++
                } else {
                    let itembtn = this.subGameBtnMap[key]
                    itembtn.active = false
                }
            }
        }
        this.subgameview.content.width = (Math.ceil(btnnum / 2) * (this.itembtn.width + 15)) + 15;
        this.subgameview.content.x = -this.subgameview.node.width / 2
    },
    setSubBtnPos(itembtn, index) {
        itembtn.active = true
        itembtn.x = Math.floor(index / 2) * (this.itembtn.width + 15) + this.itembtn.width / 2 + 15;
        itembtn.y = -index % 2 * (this.itembtn.height + 15) + this.itembtn.height / 2 + 8;
    },
    /**
     * @Description: 水果机奖金池连接
     */
    sgjConnect() {
        if (!hqq.subGameList["sgj"]) {
            return
        }
        if (cc.sys.os != "Windows") { // 不是模拟器
            this.getSgjPool()
            if (!cc.director.getScheduler().isScheduled(this.getSgjPool, this)) {
                this.schedule(this.getSgjPool, 3)
            }
        }
    },
    getSgjPool() {
        let failcallback = () => {
            this.unschedule(this.getSgjPool, this)
        }
        let url = hqq.subGameList["sgj"].serverUrl.replace("ws", "http") + "/api/jackpot"
        this.sgjxhr = hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: url,
            callback: this.showsgjPoolNum.bind(this),
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    showsgjPoolNum(data) {
        let gold = 0
        if (data < 0.01) {
            gold = 0;
        } else {
            gold = hqq.commonTools.formatGold(data);
        }
        if (this && this.subGameBtnMap && this.subGameBtnMap["sgj"]) {
            if (this.subGameBtnMap["sgj"].getChildByName("goldlabel")) {
                this.subGameBtnMap["sgj"].getChildByName("goldlabel").getComponent(cc.Label).string = gold
            } else {
                let node = new cc.Node();
                let label = node.addComponent(cc.Label);
                label.font = this.hbslFont
                label.fontSize = 28
                label.string = gold
                node.name = "goldlabel"
                node.setPosition(0, 68)
                this.subGameBtnMap["sgj"].addChild(node)
            }
        }
    },
    /**
     * @Description: 红包扫雷奖金池连接
     */
    hbslConnect() {
        if (!hqq.subGameList["hbsl"]) {
            return
        }
        if (cc.sys.os != "Windows") { // 不是模拟器
            this.getHbslPool()
            if (!cc.director.getScheduler().isScheduled(this.getHbslPool, this)) {
                this.schedule(this.getHbslPool, 3)
            }
        }
    },
    getHbslPool() {
        let failcallback = () => {
            this.unschedule(this.getHbslPool, this)
        }
        let url = hqq.subGameList["hbsl"].serverUrl.replace("ws", "http") + "/api/jackpot"
        this.hbslxhr = hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: url,
            callback: this.showhbslPoolNum.bind(this),
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    showhbslPoolNum(data) {
        let gold = 0
        if (data < 0.01) {
            gold = 0;
        } else {
            gold = hqq.commonTools.formatGold(data);
        }
        if (this && this.subGameBtnMap && this.subGameBtnMap["hbsl"]) {
            if (this.subGameBtnMap["hbsl"].getChildByName("goldlabel")) {
                this.subGameBtnMap["hbsl"].getChildByName("goldlabel").getComponent(cc.Label).string = gold
            } else {
                let node = new cc.Node();
                let label = node.addComponent(cc.Label);
                label.font = this.hbslFont
                label.fontSize = 28
                label.string = gold
                node.name = "goldlabel"
                node.setPosition(0, 68)
                this.subGameBtnMap["hbsl"].addChild(node)
            }
        }
    },
    /**
     * @Description: hbld奖金池获取
     */
    hbldConnect() {
        if (!hqq.subGameList["hbld"]) {
            return
        }
        if (cc.sys.os != "Windows") { // 不是模拟器
            this.getHbldPool()
            if (!cc.director.getScheduler().isScheduled(this.getHbldPool, this)) {
                this.schedule(this.getHbldPool, 3)
            }
        }
    },
    getHbldPool() {
        let failcallback = () => {
            this.unschedule(this.getHbldPool, this)
        }
        let url = hqq.subGameList["hbld"].serverUrl.replace("ws", "http") + "/api/jackpot"
        this.hbldxhr = hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: url,
            callback: this.showhbldPoolNum.bind(this),
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    showhbldPoolNum(data) {
        let gold = 0
        if (data < 0.01) {
            gold = 0;
        } else {
            gold = hqq.commonTools.formatGold(data);
        }
        if (this && this.subGameBtnMap && this.subGameBtnMap["hbld"]) {
            if (this.subGameBtnMap["hbld"].getChildByName("goldlabel")) {
                this.subGameBtnMap["hbld"].getChildByName("goldlabel").getComponent(cc.Label).string = gold
            } else {
                let node = new cc.Node();
                let label = node.addComponent(cc.Label);
                label.font = this.hbslFont
                label.fontSize = 28
                label.string = gold
                node.name = "goldlabel"
                node.setPosition(0, 68)
                this.subGameBtnMap["hbld"].addChild(node)
            }
        }
    },
    /**
     * @Description: 获取公告
     */
    getNotice() {
        if (hqq.gameGlobal.noticeList.length > 0) {
            let isallread = true
            for (let i = 0; i < hqq.gameGlobal.noticeList.length; i++) {
                if (hqq.gameGlobal.noticeList[i].isread == 0) {
                    isallread = false
                    break
                }
            }
            if (!isallread) {
                this.gonggaobtn.getChildByName("redpoint").active = true;
                this.gonggaobtn.getChildByName("topbubble").active = true;
                hqq.eventMgr.register(hqq.eventMgr.refreshHallTips, "hallScene", this.setNoticeReadState.bind(this))
            }
            return
        }
        let callback = (data, url) => {
            // console.log("公告 callback", data)
            if (data.code == 200) {
                if (!data.msg || data.msg.length == 0) {
                    // console.log("没有公告需要显示")
                } else {
                    let deleteNotice = hqq.localStorage.getGlobal().noticeDeleteKey
                    data.msg.sort((a, b) => a.sort - b.sort).forEach((e, i) => {
                        if (e.type === 2) { // type == 2 是公告 == 1 是活动  is_slider
                            let isdelete = false
                            if (deleteNotice) {
                                for (let j = 0; j < deleteNotice.length; j++) {
                                    if (deleteNotice[j] == e.create_time) {
                                        isdelete = true
                                        break
                                    }
                                }
                            }
                            if (!isdelete) {
                                let notice = {
                                    key: hqq.gameGlobal.noticeList.length,
                                    isread: 0,
                                    type: e.type,
                                    title: e.title,
                                    words: e.words,
                                    create_time: e.create_time,
                                    end_time: e.end_time,
                                    start_time: e.start_time,
                                };
                                hqq.gameGlobal.noticeList.push(notice)
                            }
                        }
                        if (e.is_slider === 1) { // 是否跑马灯
                            let needinsert = true
                            for (let i = 0; i < hqq.gameGlobal.slideNoticeList.length; i++) {
                                if (hqq.gameGlobal.slideNoticeList[i].notice == e.words.replace(/\s+/g, "")) {
                                    needinsert = false
                                    break
                                }
                            }
                            if (needinsert) {
                                hqq.gameGlobal.slideNoticeList.push({
                                    time: 1,
                                    rollforver: true,
                                    notice: e.words.replace(/\s+/g, "")
                                })
                            }
                        }
                    })
                    if (hqq.gameGlobal.noticeList.length > 0) {
                        this.gonggaobtn.getChildByName("redpoint").active = true;
                        this.gonggaobtn.getChildByName("topbubble").active = true;
                        hqq.eventMgr.register(hqq.eventMgr.refreshHallTips, "hallScene", this.setNoticeReadState.bind(this))
                        if (hqq.needShowNotice) {
                            hqq.needShowNotice = false
                            if (CC_DEBUG) {
                                return
                            }
                            hqq.eventMgr.dispatch(hqq.eventMgr.showNotice, null)
                        }
                    }
                    if (hqq.gameGlobal.slideNoticeList.length > 0) {
                        hqq.eventMgr.dispatch(hqq.eventMgr.addSliderNotice, hqq.gameGlobal.slideNoticeList)
                    }
                }
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
        }
        let endurl = hqq.app.getIpGetEndurl(4);
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
     * @Description: 设置公告提示状态
     */
    setNoticeReadState(msg) {
        this.gonggaobtn.getChildByName("redpoint").active = !msg.hidenoticetip;
        this.gonggaobtn.getChildByName("topbubble").active = !msg.hidenoticetip;
    },
    /**
     * @Description: 根据id获取服务器子游戏信息
     */
    getRemoteSubgame(game_id) {
        if (!hqq.app || !hqq.app.remoteGamelist) {
            return
        }
        let remotedata = hqq.app.remoteGamelist[0];
        for (let i = 0; i < hqq.app.remoteGamelist.length; i++) {
            if (game_id === hqq.app.remoteGamelist[i].game_id) {
                remotedata = hqq.app.remoteGamelist[i];
                break;
            }
        }
        return remotedata;
    },
    // 加载子游戏的子包 包含静态子包和动态子包
    loadBundle(subname) {
        if (!cc.assetManager.getBundle(subname)) {
            cc.assetManager.loadBundle(subname, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('load subpackage script successfully.', subname);
            });
        }
        if (!cc.assetManager.getBundle(subname + "Res")) {
            cc.assetManager.loadBundle(subname + "Res", function (err) {
                if (err) {
                    return console.error(err);
                }
                hqq[subname + 'Res'] = cc.assetManager.getBundle(subname + "Res");
                console.log('load subpackage script successfully.', subname + 'Res', subname + "Res");
            });
        }
    },
    /** 判断子游戏是否下载更新等 */
    checkSubGameDownload(enname) {
        let subdata = this.getRemoteSubgame(hqq.subGameList[enname].game_id)
        if (subdata.open == 0) {
            this.setSubGameBtnState(enname, this.subGameBtnState.noOpen)
        } else {
            let subgamev;
            let localsubv = hqq.localStorage.get(enname, "versionKey");
            if (enname == 'zrsx1' || enname == 'zrsx2') {
                localsubv = hqq.localStorage.get('zrsx', "versionKey");
                subgamev = hqq.app.subGameVersion['zrsx'];
            } else if (enname == 'sbty1' || enname == 'sbty2') {
                localsubv = hqq.localStorage.get('sbty', "versionKey");
                subgamev = hqq.app.subGameVersion['sbty'];
            } else {
                subgamev = hqq.app.subGameVersion[enname];
            }
            // let txt = "local version: " + localsubv + " | remote version:" + subgamev;
            let needup = hqq.commonTools.versionCompare(localsubv, subgamev)
            if (needup && !cc.sys.isBrowser && cc.sys.os != "Windows") {
                // console.log(txt + " | subgame : " + enname + " need update");
                this.setSubGameBtnState(enname, this.subGameBtnState.needDown)
            } else {
                // console.log(txt + " | subgame : " + enname + " not need update")
                this.setSubGameBtnState(enname, this.subGameBtnState.canClick)
                if (hqq.app.isRelease) {
                    let subgamern = enname
                    if (enname == "zrsx1" || enname == "zrsx2") {
                        subgamern = "zrsx"
                        if (enname == "zrsx1") {
                            if (cc.sys.isBrowser) {
                                setTimeout(() => {
                                    this.loadBundle(subgamern)
                                }, 3000)
                            } else {
                                this.loadBundle(subgamern)
                            }
                        }
                    } else if (enname == "sbty1" || enname == "sbty2") {
                        subgamern = "sbty"
                        if (enname == "sbty1") {
                            if (cc.sys.isBrowser) {
                                setTimeout(() => {
                                    this.loadBundle(subgamern)
                                }, 3000)
                            } else {
                                this.loadBundle(subgamern)
                            }
                        }
                    } else {
                        if (cc.sys.isBrowser) {
                            setTimeout(() => {
                                this.loadBundle(subgamern)
                            }, 3000)
                        } else {
                            this.loadBundle(subgamern)
                        }
                    }
                }
            }
        }
    },
    /**
     * @Description: 设置子游戏按钮等待下载状态
     */
    setSubGameBtnUp(enname) {
        if (enname == "zrsx") {
            this.setSubGameBtnState("zrsx1", this.subGameBtnState.needDown)
            this.setSubGameBtnState("zrsx2", this.subGameBtnState.needDown)
        } else if (enname == "sbty") {
            this.setSubGameBtnState("sbty1", this.subGameBtnState.needDown)
            this.setSubGameBtnState("sbty2", this.subGameBtnState.needDown)
        } else {
            this.setSubGameBtnState(enname, this.subGameBtnState.needDown)
        }
    },
    /**
     * @Description: 设置子游戏按钮更新状态为等待
     */
    setSubGameBtnUpWait(subgamern) {
        if (subgamern == "zrsx") {
            this.setSubGameBtnState("zrsx1", this.subGameBtnState.isWait)
            this.setSubGameBtnState("zrsx2", this.subGameBtnState.isWait)
        } else if (subgamern == "sbty") {
            this.setSubGameBtnState("sbty1", this.subGameBtnState.isWait)
            this.setSubGameBtnState("sbty2", this.subGameBtnState.isWait)
        } else {
            this.setSubGameBtnState(subgamern, this.subGameBtnState.isWait)
        }
    },
    /** 下载子游戏 */
    downloadSubGame(event, enname) {
        this.clickDelay(event)
        let mycallback = () => {
            let mainversion = hqq.localStorage.globalGet(hqq.app.versionKey)
            mainversion = mainversion ? mainversion : ''
            if (mainversion != hqq.app.subGameVersion.hall) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, {
                    type: 10,
                    msg: "当前游戏版本过低，请重新启动游戏再进行更新下载",
                    ensurefunc: () => {
                        hqq.hallWebSocket.close();
                        cc.audioEngine.stopAll();
                        cc.game.restart();
                    }
                })
            } else {
                let subgamern = enname
                if (enname == "zrsx1" || enname == "zrsx2") {
                    subgamern = "zrsx"
                } else if (enname == "sbty1" || enname == "sbty2") {
                    subgamern = "sbty"
                }
                let localsubv = hqq.localStorage.get(subgamern, "versionKey") || null;
                let upstate = hqq.hotUpdateMgr.checkUpdate({
                    subname: subgamern,
                    version: localsubv || "1.0.0",
                })
                if (upstate) {
                    this.setSubGameBtnUpWait(subgamern)
                } else {
                    this.setSubGameBtnState(subgamern, this.subGameBtnState.needDown)
                }
            }
        }
        hqq.loginMgr.requestVersionJson(mycallback)
    },
    /**
     * @Description: 设置按钮状态为检测文件
     */
    setSubGameBtnCheck(enname) {
        if (enname == 'zrsx') {
            this.subGameBtnMap['zrsx1'].progresslabel.string = "检测";
            this.subGameBtnMap['zrsx2'].progresslabel.string = "检测";
        } else if (enname == 'sbty') {
            this.subGameBtnMap['sbty1'].progresslabel.string = "检测";
            this.subGameBtnMap['sbty2'].progresslabel.string = "检测";
        } else {
            this.subGameBtnMap[enname].progresslabel.string = "检测";
        }
    },
    isupdataCallback(bool, enname) {
        if (bool) { // 需要更新 自动更新，无需处理
            if (enname == "zrsx") {
                this.setSubGameBtnState("zrsx1", this.subGameBtnState.isWait)
                this.setSubGameBtnState("zrsx2", this.subGameBtnState.isWait)
            } else if (enname == "sbty") {
                this.setSubGameBtnState("sbty1", this.subGameBtnState.isWait)
                this.setSubGameBtnState("sbty2", this.subGameBtnState.isWait)
            } else {
                this.setSubGameBtnState(enname, this.subGameBtnState.isWait)
            }
        } else {
            this.finishCallback(enname);
        }
    },
    /**
     * @description: 子游戏热更新失败
     */
    failCallback(enname) {
        hqq.logMgr.log("子游戏", enname, "下载失败");
        hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "子游戏下载失败")
        this.setSubGameBtnUp(enname)
    },
    /**
     * @description: 下载进度
     */
    progressCallback(progress, enname) {
        if (enname == "apk" || enname == "hall" || enname == "jiazai") {
            return
        }
        if (isNaN(progress)) {
            progress = 0;
        }
        let mprogress = (progress * 100).toString()
        if (mprogress.includes(".")) {
            mprogress = mprogress.substring(0, mprogress.indexOf("."))
        }
        mprogress += "%"
        if (enname == "zrsx") {
            this.setSubGameBtnState("zrsx1", this.subGameBtnState.progress)
            this.setSubGameBtnState("zrsx2", this.subGameBtnState.progress)
            this.subGameBtnMap["zrsx1"].progress.getComponent(cc.ProgressBar).progress = progress;
            this.subGameBtnMap["zrsx1"].progresslabel.string = mprogress
            this.subGameBtnMap["zrsx2"].progress.getComponent(cc.ProgressBar).progress = progress;
            this.subGameBtnMap["zrsx2"].progresslabel.string = mprogress
        } else if (enname == "sbty") {
            this.setSubGameBtnState("sbty1", this.subGameBtnState.progress)
            this.setSubGameBtnState("sbty2", this.subGameBtnState.progress)
            this.subGameBtnMap["sbty1"].progress.getComponent(cc.ProgressBar).progress = progress;
            this.subGameBtnMap["sbty1"].progresslabel.string = mprogress
            this.subGameBtnMap["sbty2"].progress.getComponent(cc.ProgressBar).progress = progress;
            this.subGameBtnMap["sbty2"].progresslabel.string = mprogress
        } else {
            this.setSubGameBtnState(enname, this.subGameBtnState.progress)
            this.subGameBtnMap[enname].progress.getComponent(cc.ProgressBar).progress = progress;
            this.subGameBtnMap[enname].progresslabel.string = mprogress
        }
    },
    /**
     * @description: 子游戏热更新结束
     */
    finishCallback(enname) {
        console.log("finishCallback", enname)
        if (enname == "zrsx") {
            this.setSubGameBtnState("zrsx1", this.subGameBtnState.canClick)
            this.setSubGameBtnState("zrsx2", this.subGameBtnState.canClick)
            if (!hqq.subGameList['zrsx1'].hasAccount && !hqq.isDebug) {
                hqq.loginMgr.createSubAccount("zrsx1")
            }
        } else if (enname == "sbty") {
            this.setSubGameBtnState("sbty1", this.subGameBtnState.canClick)
            this.setSubGameBtnState("sbty2", this.subGameBtnState.canClick)
            if (!hqq.subGameList['sbty1'].hasAccount && !hqq.isDebug) {
                hqq.loginMgr.createSubAccount("sbty1")
            }
        } else {
            this.setSubGameBtnState(enname, this.subGameBtnState.canClick)
            if (!hqq.subGameList[enname].hasAccount && !hqq.isDebug) {
                hqq.loginMgr.createSubAccount(enname)
            }
        }

        if (enname == 'sgj') {
            this.sgjConnect()
        } else if (enname == 'hbsl') {
            this.hbslConnect()
        } else if (enname == 'hbld') {
            this.hbldConnect()
        }
        if (hqq.app.isRelease) {
            this.loadBundle(enname)
        }
    },
    setSubGameBtnState(enname, state) {
        if (this.subGameBtnMap[enname].subGameState == state) {
            return
        }
        this.subGameBtnMap[enname].subGameState = state
        if (state == this.subGameBtnState.needDown) { // 需要下载状态
            hqq.subGameList[enname].isDown = false
            this.subGameBtnMap[enname].downflag.active = true;
            this.subGameBtnMap[enname].jiantou.active = true;
            this.subGameBtnMap[enname].progresslabel.string = "";
            this.subGameBtnMap[enname].progress.active = true;
            this.subGameBtnMap[enname].progress.getComponent(cc.ProgressBar).progress = 0;
            if (this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.length > 0) {
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents[0].handler = "downloadSubGame"
            } else {
                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallScene";
                clickEventHandler.customEventData = enname;
                clickEventHandler.handler = "downloadSubGame";
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.push(clickEventHandler);
            }
        } else if (state == this.subGameBtnState.isWait) { // 下载检测准备状态
            hqq.subGameList[enname].isDown = false
            this.subGameBtnMap[enname].downflag.active = true;
            this.subGameBtnMap[enname].jiantou.active = false;
            this.subGameBtnMap[enname].progresslabel.string = "等待";
            this.subGameBtnMap[enname].progress.active = true;
            this.subGameBtnMap[enname].progress.getComponent(cc.ProgressBar).progress = 0;
            if (this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.length > 0) {
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents[0].handler = "downloadSubGame"
            } else {
                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallScene";
                clickEventHandler.customEventData = enname;
                clickEventHandler.handler = "downloadSubGame";
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.push(clickEventHandler);
            }
        } else if (state == this.subGameBtnState.progress) { // 下载进度状态
            this.subGameBtnMap[enname].downflag.active = true;
            this.subGameBtnMap[enname].jiantou.active = false;
            // this.subGameBtnMap[enname].progresslabel.string = mprogress
            this.subGameBtnMap[enname].progress.active = true;
            // this.subGameBtnMap[enname].progress.getComponent(cc.ProgressBar).progress = progress;
            if (this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.length > 0) {
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents[0].handler = "downloadSubGame"
            } else {
                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallScene";
                clickEventHandler.customEventData = enname;
                clickEventHandler.handler = "downloadSubGame";
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.push(clickEventHandler);
            }
        } else if (state == this.subGameBtnState.canClick) { // 可点击状态
            hqq.subGameList[enname].isDown = true
            this.subGameBtnMap[enname].downflag.active = false;
            this.subGameBtnMap[enname].jiantou.active = false;
            this.subGameBtnMap[enname].progresslabel.string = "";
            this.subGameBtnMap[enname].progress.active = false;
            this.subGameBtnMap[enname].progress.getComponent(cc.ProgressBar).progress = 0;
            if (this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.length > 0) {
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents[0].handler = "onClickSubgame"
            } else {
                let clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallScene";
                clickEventHandler.customEventData = enname;
                clickEventHandler.handler = "onClickSubgame";
                this.subGameBtnMap[enname].getComponent(cc.Button).clickEvents.push(clickEventHandler);
            }
        } else if (state == this.subGameBtnState.noOpen) { // 不开放状态
            this.subGameBtnMap[enname].getChildByName("wait").active = true;
            hqq.subGameList[enname].isDown = false
            this.subGameBtnMap[enname].downflag.active = true;
        }
    },
    // 跳转至子游戏场景
    jumpToSubGame(enname) {
        // if (!hqq.gameGlobal.ipCheck) {
        //     if (hqq.gameGlobal.ipapiData && hqq.app.reginIpData
        //         && hqq.gameGlobal.ipapiData.regionName == hqq.app.reginIpData.regionName) {
        //         hqq.gameGlobal.ipCheck = true
        //     } if (hqq.gameGlobal.ipinfoData && hqq.app.reginIpData2
        //         && hqq.gameGlobal.ipinfoData.region == hqq.app.reginIpData2.region) {
        //         hqq.gameGlobal.ipCheck = true
        //     } else {
        //         hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 10, msg: "您的账号存在异常，请绑定手机号码或者进行一次充值后再继续" })
        //         return
        //     }
        // }
        hqq.audioMgr.stopBg();
        if (enname == "hbsl" || enname == 'zrsx1' || enname == 'zrsx2'
            || enname == 'pccp' || enname == 'sbty1' || enname == 'sbty2') { //  真人视讯 红包扫雷 派彩 沙巴体育 竖屏
            hqq.reflect && hqq.reflect.setOrientation("portrait")
            if (enname == 'zrsx1') {
                hqq.gameGlobal.subGameType = 40
            } else if (enname == 'zrsx2') {
                hqq.gameGlobal.subGameType = 24
            } else if (enname == 'sbty1') {
                hqq.gameGlobal.subGameType = 0
            } else if (enname == 'sbty2') {
                hqq.gameGlobal.subGameType = 1
            }
        }
        cc.director.preloadScene(hqq.subGameList[enname].lanchscene, this.preloadSceneOnProgress.bind(this), () => {
            cc.director.loadScene(hqq.subGameList[enname].lanchscene);
        })
    },
    /**
     * @description: 按钮点击后延时
     */
    clickDelay(event) {
        event.target.getComponent(cc.Button).interactable = false
        this.scheduleOnce(function () {
            event.target.getComponent(cc.Button).interactable = true
        }, 0.5)
    },
    getSubGameLoginHistory(enname) {
        let nowd = new Date().getTime()
        let deletenum = 0
        let loginHistory = hqq.localStorage.get(enname, "loginHistory")
        if (loginHistory) {
            for (let i = 0; i < loginHistory.length; i++) {
                let jumptime = nowd - loginHistory[i]
                let days = Math.floor(jumptime / (24 * 3600 * 1000))
                if (days > 7) {
                    deletenum++
                }
            }
            if (deletenum > 0) {
                loginHistory.splice(0, deletenum)
            }
            return loginHistory
        }
        return []
    },
    /**
     * @description: 批量创建子游戏账号
     */
    _creatSubAccount() {
        let mgameid = "5b1f3a3cb76a591e7f251732"

        let sub = [
            897455482,
            112808955,
            156671265,
            820443261,
            187046088,
        ]
        if (typeof this.tempindex == 'undefined') {
            this.tempindex = 0;
        }
        if (this.tempindex >= sub.length) {
            return
        }
        let account = sub[this.tempindex];
        let pass = "123456";

        let onReceiveLoginTemp = (token) => {
            let callback = (data) => {
                console.log("创建子游戏账号 callback", data)
                this._creatSubAccount()
            }
            let failcallback = () => {
                console.log("创建子游戏账号 超时")
            }
            let endurl = "/Game/User/createGameAccount";
            let data = {
                game_id: mgameid,
                package_id: 1,
                balance: hqq.gameGlobal.player.gold,
                id: hqq.gameGlobal.player.id,
                token: token,
            }
            hqq.http.sendXMLHttpRequest({
                method: 'POST',
                urlto: hqq.app.server + endurl,
                param: data,
                callback: callback,
                failcallback: failcallback,
                needJsonParse: true,
            })
        }

        hqq.hallWebSocket.unregister("/Game/Login/login", "hallScene")
        hqq.hallWebSocket.close()
        let mcallback = (issucess, token) => {
            if (issucess) {
                console.log("切换账号成功", sub[this.tempindex])
                this.tempindex++
                onReceiveLoginTemp(token)
            } else {
                console.log("切换账号失败")
            }
        }
        hqq.loginMgr.accountChange(account, pass, mcallback)
    },
    /** 点击子游戏按钮统一回调 */
    onClickSubgame(event, enname) {
        if (this.isSubBtnClicked) {
            this.scheduleOnce(function () {
                this.isSubBtnClicked = false
            }, 0.5)
            return
        }
        this.isSubBtnClicked = true
        let loginHistory = this.getSubGameLoginHistory(enname)
        loginHistory.push(new Date().getTime())
        hqq.localStorage.set(enname, "loginHistory", loginHistory)
        if (hqq.isDebug) {
            this.jumpToSubGame(enname)
        } else if (hqq.subGameList[enname].hasAccount) {
            this.jumpToSubGame(enname)
        } else {
            hqq.loginMgr.createSubAccount(enname, this.jumpToSubGame)
        }
    },
    /** 玩家设置 */
    onClickPlayerBtn(event) {
        // console.log("玩家设置")
        this.clickDelay(event)
        hqq.eventMgr.dispatch(hqq.eventMgr.showPerson, null)
    },
    /** 公告 */
    onClickGongGaoBtn() {
        console.log("公告")
        // this._creatSubAccount()
        // return
        hqq.eventMgr.dispatch(hqq.eventMgr.showNotice, null)
    },
    preloadSceneOnProgress(completedCount, totalCount, item) {

    },
    /** 精彩活动 */
    onClickHuoDongBtn(event) {
        console.log("精彩活动")
        this.huodonghongdian && (this.huodonghongdian.active = false, hqq.hallactivitybtn = true);
        if (hqq.subModel.payActivity.lanchscene != "") {
            cc.director.preloadScene(hqq.subModel.payActivity.lanchscene, this.preloadSceneOnProgress.bind(this), () => {
                cc.director.loadScene(hqq.subModel.payActivity.lanchscene);
            })
        } else {
            console.log("请配置精彩活动场景")
        }
    },
    /** 全民代理  */
    onClickQMDL(event) {
        console.log("全民代理", event.target.getComponent(cc.Button).interactable)
        this.clickDelay(event)
        if (hqq.subModel.proxy.lanchscene != "") {
            cc.director.preloadScene(hqq.subModel.proxy.lanchscene, this.preloadSceneOnProgress.bind(this), () => {
                cc.director.loadScene(hqq.subModel.proxy.lanchscene);
            })
        } else {
            console.log("请配置全民代理场景")
        }
    },
    /** 聊天 */
    onClickChatBtn(event) {
        console.log("聊天")
        this.clickDelay(event)
        // if (hqq.subModel.im.lanchscene != "") {
        //     hqq.gameGlobal.imReceive = 0;
        //     hqq.reflect && hqq.reflect.setOrientation("portrait")
        //     cc.director.loadScene(hqq.subModel.im.lanchscene)
        // } else {
        //     console.log("请配置im场景")
        // }
        hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 11 })
    },
    /** 兑换 提现 */
    onClickDuiHuanBtn(event) {
        console.log("兑换")
        this.clickDelay(event)
        if (hqq.subModel.cash.lanchscene != "") {
            cc.director.preloadScene(hqq.subModel.cash.lanchscene, this.preloadSceneOnProgress.bind(this), () => {
                cc.director.loadScene(hqq.subModel.cash.lanchscene);
            })
        } else {
            console.log("请配置提现场景")
        }
    },
    /** 充值 */
    onClickChongZhiBtn(event) {
        // console.log("充值")
        this.clickDelay(event)
        hqq.eventMgr.dispatch(hqq.eventMgr.showPayScene, "hall")
    },
    // 免费金币
    onClickFreeGold(event) {
        this.clickDelay(event)
        if (hqq.gameGlobal.player.phonenum != "") {
            if (hqq.subModel.payActivity.lanchscene != "") {
                cc.director.preloadScene(hqq.subModel.payActivity.lanchscene, this.preloadSceneOnProgress.bind(this), () => {
                    cc.director.loadScene(hqq.subModel.payActivity.lanchscene);
                })
            } else {
                console.log("请配置精彩活动场景")
            }
        } else {
            hqq.eventMgr.dispatch(hqq.eventMgr.showRegister, null);
        }
    },
    onClickIosWeb(event) {
        console.log('打开ios网页')
        this.clickDelay(event)
        let endurl = '?token=' + hqq.gameGlobal.token + '&deviceid=' + hqq.app.deviceID + '&acconunt=' + hqq.gameGlobal.player.account_name
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (hqq.reflect.setClipboard('http://game.539316.com/' + endurl)) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "复制地址成功")
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "复制地址失败")
            }
        } else if (cc.sys.os === cc.sys.OS_IOS) {
            cc.sys.openURL('http://game.539316.com/' + endurl)
        }
    },
    // 获取红包雨活动信息
    getHBYConfig() {
        if (hqq.isDebug) {
            return
        }
        if (hqq.HBYinfo) {
            if (hqq.JFCJinfo.is_close == 1) { // 活动关闭
                this.JFCJbtn.active = false
            } else {
                this.JFCJbtn.active = true
            }
            if (hqq.HBYinfo.is_close == 1) { // 活动关闭
                this.HBYbtn.active = false
            } else {
                this.HBYbtn.active = true
                if (!hqq.HBYTick.isGet) {
                    this.getHBYFlag()
                } else {
                    this.dealHBYConfig()
                }
            }
        } else {
            let callback = (data, url) => {
                // console.log(data)
                for (let k in data.data) {
                    if (data.data[k].name == "四季发财红包雨2") {
                        let info = JSON.parse(data.data[k].info)
                        // console.log(info)
                        hqq.HBYinfo = info
                        hqq.HBYinfo.is_close = data.data[k].is_close
                        hqq.HBYinfo.activity_id = data.data[k].id
                        if (hqq.HBYinfo.is_close == 1) { // 活动关闭
                            this.HBYbtn.active = false
                        } else {
                            this.HBYbtn.active = true
                            if (!hqq.HBYTick.isGet) {
                                this.getHBYFlag()
                            } else {
                                this.dealHBYConfig()
                            }
                        }
                    } else if (data.data[k].name == "幸运轮盘2") {
                        let info = JSON.parse(data.data[k].info)
                        hqq.JFCJinfo = info
                        hqq.JFCJinfo.is_close = data.data[k].is_close
                        hqq.JFCJinfo.activity_id = data.data[k].id
                        if (hqq.JFCJinfo.is_close == 1) { // 活动关闭
                            this.JFCJbtn.active = false
                        } else {
                            this.JFCJbtn.active = true
                        }
                    }
                }
            }
            let failcallback = (status, forcejump, url, err, readyState) => {
                console.log("获取红包雨活动信息", status, forcejump, url, err, readyState)
            }
            hqq.http.sendXMLHttpRequest({
                method: 'GET',
                urlto: hqq.gameGlobal.pay.pay_host + "/api/activity_config/activityConfig?package_id=" + hqq.app.remoteSeverinfo.id + "&token=e40f01afbb1b9ae3dd6747ced5bca532",
                callback: callback,
                needJsonParse: true,
                failcallback: failcallback,
            })
        }
    },
    // 红包雨是否领取
    getHBYFlag() {
        let callback = (data, url) => {
            if (data.data.received_packet == 1) { // 已领取
                hqq.HBYTick.isGet = true
            } else {
                hqq.HBYTick.isGet = false
            }
            this.dealHBYConfig()
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            console.log("获取红包雨活动信息", status, forcejump, url, err, readyState)
        }
        hqq.http.sendXMLHttpRequest({
            method: 'GET',
            urlto: hqq.gameGlobal.pay.pay_host + "/api/activity/getUserPacketFlag?token=e40f01afbb1b9ae3dd6747ced5bca532&user_id=" + hqq.gameGlobal.player.id,
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    // 分析处理红包雨配置，并修改倒计时
    dealHBYConfig() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        hqq.HBYTick.startDate = hqq.HBYinfo.start_date.split("-")
        for (let i = 0; i < hqq.HBYTick.startDate.length; i++) {
            hqq.HBYTick.startDate[i] = parseInt(hqq.HBYTick.startDate[i])
        }
        hqq.HBYTick.endDate = hqq.HBYinfo.end_date.split("-")
        for (let i = 0; i < hqq.HBYTick.endDate.length; i++) {
            hqq.HBYTick.endDate[i] = parseInt(hqq.HBYTick.endDate[i])
        }
        if (year < hqq.HBYTick.startDate[0] &&
            month < hqq.HBYTick.startDate[1] &&
            day < hqq.HBYTick.startDate[2]) {
            this.HBYTimeLabel.string = "活动未开始"
            return
        }
        if (year > hqq.HBYTick.endDate[0] &&
            month > hqq.HBYTick.endDate[1] &&
            day > hqq.HBYTick.endDate[2]) {
            this.HBYTimeLabel.string = "活动结束"
            return
        }
        hqq.HBYTick.mintute = 59 - minute
        hqq.HBYTick.second = 59 - second
        if (!cc.director.getScheduler().isScheduled(this.timeTickHBY, this)) {
            this.schedule(this.timeTickHBY, 1)
        }
        for (let i = 0; i < hqq.HBYinfo.packetList.length; i++) {
            if (hour < hqq.HBYinfo.packetList[i].start) { // 倒计时
                hqq.HBYTick.isInOpen = false
                hqq.HBYinfo.curPacket = hqq.HBYinfo.packetList[i]
                hqq.HBYinfo.nextPacketIndex = (i + 1) == hqq.HBYinfo.packetList.length ? 0 : (i + 1)
                hqq.HBYTick.hour = hqq.HBYinfo.packetList[i].start - hour - 1
                return
            } else if (hour == hqq.HBYinfo.packetList[i].start && minute < hqq.HBYinfo.packetList[i].mintute) { // 开抢中
                hqq.HBYTick.isInOpen = true
                hqq.HBYinfo.curPacket = hqq.HBYinfo.packetList[i]
                hqq.HBYinfo.nextPacketIndex = (i + 1) == hqq.HBYinfo.packetList.length ? 0 : (i + 1)
                return
            }
        }
        if (year > hqq.HBYTick.endDate[0] &&
            month > hqq.HBYTick.endDate[1] &&
            (day + 1) > hqq.HBYTick.endDate[2]) {
            this.HBYTimeLabel.string = "活动结束"
            return
        }
        hqq.HBYTick.hour = hqq.HBYinfo.packetList[0].start + 23 - hour
        hqq.HBYTick.isInOpen = false
        hqq.HBYinfo.curPacket = hqq.HBYinfo.packetList[0]
    },
    // 红包雨倒计时及判断
    timeTickHBY() {
        if (hqq.HBYTick.isInOpen) {
            this.HBYTimeLabel.string = "发放中"
            let minute = new Date().getMinutes();
            if (minute >= hqq.HBYinfo.curPacket.mintute) { // 此次红包雨结束，开始下一轮
                hqq.HBYTick.isInOpen = false
                hqq.HBYTick.isGet = false
                this.dealHBYConfig()
            }
            if (!hqq.HBYTick.isGet && hqq.HBYTick.isInOpen) {
                this.showHBYAni()
            }
            return
        }
        if (hqq.HBYTick.second == 0) {
            if (hqq.HBYTick.mintute == 0) {
                if (hqq.HBYTick.hour == 0) { // 时机已到，开奖中
                    hqq.HBYTick.isInOpen = true
                    this.HBYTimeLabel.string = "发放中"
                    let minute = new Date().getMinutes();
                    if (minute >= hqq.HBYinfo.curPacket.mintute) { // 此次红包雨结束，开始下一轮
                        hqq.HBYTick.isInOpen = false
                        hqq.HBYTick.isGet = false
                        this.dealHBYConfig()
                    }
                    if (!hqq.HBYTick.isGet && hqq.HBYTick.isInOpen) {
                        this.showHBYAni()
                    }
                    return
                } else {
                    hqq.HBYTick.hour -= 1
                    hqq.HBYTick.mintute = 59
                    hqq.HBYTick.second = 59
                }
            } else {
                hqq.HBYTick.mintute -= 1
                hqq.HBYTick.second = 59
            }
        } else {
            hqq.HBYTick.second -= 1
        }
        let tempstr = "" + hqq.HBYTick.hour
        if (hqq.HBYTick.hour < 10) {
            tempstr = "0" + hqq.HBYTick.hour
        }
        if (hqq.HBYTick.mintute < 10) {
            tempstr += ":0" + hqq.HBYTick.mintute
        } else {
            tempstr += ":" + hqq.HBYTick.mintute
        }
        if (hqq.HBYTick.second < 10) {
            tempstr += ":0" + hqq.HBYTick.second
        } else {
            tempstr += ":" + hqq.HBYTick.second
        }
        this.HBYTimeLabel.string = tempstr
    },
    // 点击红包雨按钮
    onClickHBY(event) {
        if (hqq.HBYTick.isGet) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showHBYLayer, {
                start_date: hqq.HBYinfo.start_date,
                end_date: hqq.HBYinfo.end_date,
                start: hqq.HBYinfo.packetList[hqq.HBYinfo.nextPacketIndex].start,
                total: hqq.HBYinfo.packetList[hqq.HBYinfo.nextPacketIndex].total,
            })
        } else if (hqq.HBYTick.isInOpen) {
            this.showHBYAni()
        } else {
            hqq.eventMgr.dispatch(hqq.eventMgr.showHBYLayer, {
                start_date: hqq.HBYinfo.start_date,
                end_date: hqq.HBYinfo.end_date,
                start: hqq.HBYinfo.curPacket.start,
                total: hqq.HBYinfo.curPacket.total,
            })
        }
    },
    // 显示红包雨特效
    showHBYAni() {
        if (this.anilayer.active) {
            return
        }
        this.anilayer.active = true
        this.anilayer.getChildByName('rain').getComponent(sp.Skeleton).setAnimation(0, 'hb_rain', true)
        let ani2node = this.anilayer.getChildByName('clickopen')
        let z1 = ani2node.getChildByName('z1')
        let btn_close = ani2node.getChildByName('btn_close')
        let numlabel = ani2node.getChildByName('numlabel').getComponent(cc.Label)
        numlabel.string = ""
        let ani2 = ani2node.getComponent(sp.Skeleton)
        let clicknode = this.anilayer.getChildByName('clicknode')
        btn_close.active = false
        z1.active = false
        ani2.setAnimation(0, "hb_click", true)
        let hasclick = false
        let callback = (gold) => {
            hasclick = true
            btn_close.active = true
            z1.active = true
            btn_close.on(cc.Node.EventType.TOUCH_END, (event) => {
                this.anilayer.active = false
            })
            numlabel.string = gold
            ani2node.setScale(0.2)
            let act1 = cc.scaleTo(0.2, 1, 1.1)
            let act2 = cc.scaleTo(0.2, 1, 1)
            ani2node.runAction(cc.sequence(act1, act2))
            ani2.setAnimation(0, 'hb_open', true)
        }
        clicknode.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (hasclick) {
                console.log("已经点击过  四季发财红包雨")
                return
            }
            this.requestHBY(callback)
        })
    },
    // 拆红包
    requestHBY(mcallback) {
        let callback = (data, url) => {
            console.log("拆红包", data, url)
            hqq.HBYTick.isGet = true
            if (data.status == -1) {
                console.log("拆红包失败", data.msg)
                this.anilayer.active = false
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, data.msg)
            } else {
                mcallback(data.data.packet)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            console.log("failcallback 拆红包失败", status, forcejump, url, err, readyState)
        }
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: hqq.gameGlobal.pay.pay_host + "/api/activity/getPacket",
            param: "token=e40f01afbb1b9ae3dd6747ced5bca532&user_id=" + hqq.gameGlobal.player.id + "&activity_id=" + hqq.HBYinfo.activity_id + "&package_id=" + hqq.app.remoteSeverinfo.id,
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    // 积分抽奖
    onClickJFCJ(event) {
        if (hqq.subModel.payActivity.lanchscene != "") {
            cc.director.preloadScene(hqq.subModel.payActivity.lanchscene, () => {
                hqq.isJFCJ = true
                cc.director.loadScene(hqq.subModel.payActivity.lanchscene);
            })
        } else {
            console.log("请配置精彩活动场景")
        }
    },
    onReceiveBroadcast(mtype) {
        if (mtype == 1000) {
            this.chatbtn.getChildByName("redpoint").active = true;
        }
    },
    /** 每帧调用一次 // called every frame */
    // update(dt) { },
    /** 所有组件update执行完之后调用 */
    // lateUpdate() { },
    /** 调用了 destroy() 时回调，当帧结束统一回收组件 */
    onDestroy() {
        hqq.audioMgr.setButtonEffect(false);
        this.unschedule(this.getSgjPool, this)
        this.unschedule(this.getHbslPool, this)
        this.unschedule(this.getHbldPool, this)
        this.sgjxhr && this.sgjxhr.abort()
        this.hbslxhr && this.hbslxhr.abort()
        this.hbldxhr && this.hbldxhr.abort()
        hqq.eventMgr.unregister(hqq.eventMgr.hotCheckup, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.hotFail, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.hotProgress, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.hotFinish, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.hotUp, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.hotCheck, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.hotWait, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.refreshPlayerinfo, "hallScene")
        hqq.eventMgr.unregister(hqq.eventMgr.refreshHallTips, "hallScene")
    },
});