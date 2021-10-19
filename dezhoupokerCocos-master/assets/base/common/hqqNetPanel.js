cc.Class({
    extends: cc.Component,

    properties: {
        upnode: cc.Node,
        centernode: cc.Node,
        fresnbtn: cc.Node,

        upprocess: cc.Label,
        cneterprocess: cc.Label,

        tiplabelnode: cc.Node,
        exitbtn: cc.Node,
        curUpLine: cc.Node,
        curCenterLine: cc.Node,

        item: cc.Node,
        upScrollview: cc.ScrollView,
        centerScrollview: cc.ScrollView,
    },

    onLoad() {
        this.upgradeTempList = []
        this.upgradeListTemp = []
        this.upgradeList = []
        this.centerTempList = []
        this.centerList = []
        this.upgradeItemList = []
        this.centerItemList = []
        this.data = null
        this.upchoice = 0
        this.centerchoice = 0
        this.testEnd = false
        this.exitFunc = () => {
            hqq.app.hasLineChoiceLayer = false
            this.node.removeFromParent(true);
            hqq.http.stopTestLint();
            hqq.app.checkSubServer();
        }

        this.upCurLineLabelNode = this.curUpLine.getChildByName('curlinelabel')
        this.cCurLineLabelNode = this.curCenterLine.getChildByName('curlinelabel')

        this.startUpTestBtn = this.curUpLine.getChildByName('startbtn').getComponent(cc.Button)
        this.startCenterTestBtn = this.curCenterLine.getChildByName('startbtn').getComponent(cc.Button)
    },

    start() {

    },
    init(data) {
        this.data = data
        if (data.exitFunc) {
            if (data.restartGame) {
                this.exitFunc = () => {
                    hqq.app.hasLineChoiceLayer = false
                    data.exitFunc();
                    this.node.removeFromParent(true);
                    hqq.http.stopTestLint();
                    hqq.app.checkSubServer();
                    cc.audioEngine.stopAll();
                    cc.game.restart();
                }
            } else {
                this.exitFunc = () => {
                    hqq.app.hasLineChoiceLayer = false
                    data.exitFunc();
                    this.node.removeFromParent(true);
                    hqq.http.stopTestLint();
                    hqq.app.checkSubServer();
                }
            }
        } else if (data.restartGame) {
            this.exitFunc = () => {
                hqq.app.hasLineChoiceLayer = false
                this.node.removeFromParent(true);
                hqq.http.stopTestLint();
                hqq.app.checkSubServer();
                cc.audioEngine.stopAll();
                cc.game.restart();
            }
        }
        let upgradelist = hqq.localStorage.globalGet(hqq.app.hotServerKey)
        if (data.upgradeList) {
            upgradelist = data.upgradeList
        }
        for (let i = 0; i < upgradelist.length; i++) {
            this.upgradeTempList.push(upgradelist[i] + "/" + hqq.app.hotupdatePath + "/" + 'version.json?' + Math.floor(Math.random() * 1000000))
        }
        this.upCurLineLabelNode.getComponent(cc.Label).string = "线路" + (hqq.app.hotServerIndex + 1);
        if (cc.sys.os === cc.sys.OS_IOS || (hqq.app.packageInfo && hqq.app.packageInfo.system == "ios")) { // 
            hqq.iosReflect.setCallback(this.testWebSpeedAction.bind(this))
            let str = this.testListToStrAction(this.upgradeTempList)
            hqq.reflect.requestFastUrl(str)
        } else { // android  browser
            hqq.http.testLine(this.upgradeTempList, this.testUpgradeCallBack.bind(this), 10);
        }

        if (cc.director.getScene().name == "loading") {
            this.centernode.active = false
            this.upnode.x = 0
            this.fresnbtn.x = 160
        } else {
            let centerList = hqq.localStorage.globalGet(hqq.app.serverListKey)
            if (data.centerList) {
                centerList = data.centerList
            }
            for (let i = 0; i < centerList.length; i++) {
                this.centerTempList.push(centerList[i] + "/checked?" + Math.floor(Math.random() * 1000000))
            }
            this.cCurLineLabelNode.getComponent(cc.Label).string = "线路" + (hqq.app.serverIndex + 1);
            hqq.http.testLine(this.centerTempList, this.testCenterCallBack.bind(this), 1);
        }

        this.exitbtn.active = !data.notshowexitbtn
        this.tiplabelnode.active = !data.notshowexitbtn

        if (data && data.uptime && data.centertime) {
            this.refreshCurUpLine(data.uptime, hqq.app.hotServerIndex);
            this.refreshCurCenterLine(data.centertime, hqq.app.serverIndex);
        }
    },
    testListToStrAction(upgradeTempList) {
        let str = "";
        if (upgradeTempList) {
            for (let i = 0; i < upgradeTempList.length; i++) {
                const urlStr = upgradeTempList[i];
                if (i == 0) {
                    str += urlStr
                } else {
                    str += ',' + urlStr
                }
            }
        }
        return str;
    },
    // ios 测速回调
    testWebSpeedAction(data) {
        let info = JSON.parse(data)
        for (let i = 0; i < this.upgradeTempList.length; i++) {
            if (this.upgradeTempList[i] == info.url) {
                if (info.timeDiff > 0) {
                    let time = info.timeDiff / 10
                    this.testUpgradeCallBack(info.url, i, time, null)
                } else {
                    this.testUpgradeCallBack(info.url, i, 3000, info.timeDiff)
                }
            }
        }
    },
    testUpgradeCallBack(url, index, spendtime, err) {
        // if (this.upgradeListTemp[index]) {
        this.upgradeList.push({ url: url, index: index, time: spendtime, err: err })
        if (hqq.app.hotServerIndex == index) {
            this.refreshCurUpLine(spendtime, index)
        }
        this.upgradeList.sort(function (a, b) {
            if (a.err) {
                return 1
            } else if (b.err) {
                return -1
            } else {
                return a.time - b.time
            }
        })
        this.refreshUpScrollView(this.upgradeList)
        this.refreshUpProcess(this.upgradeList.length)
        // } else {
        //     this.upgradeListTemp[index] = { url: url, index: index, time: spendtime, err: err }
        // }
    },
    testCenterCallBack(url, index, spendtime, err) {
        this.centerList.push({ url: url, index: index, time: spendtime, err: err })
        this.centerList.sort(function (a, b) {
            if (a.err) {
                return 1
            } else if (b.err) {
                return -1
            } else {
                return a.time - b.time
            }
        })
        if (hqq.app.serverIndex == index) {
            this.refreshCurCenterLine(spendtime, index)
        }
        this.refreshCenterScrollView(this.centerList)
        this.refreshCenterProcess(this.centerList.length)
        // if ((index + 1) == this.centerTempList.length) {
        //     this.startCenterTestBtn.interactable = true
        // }
    },
    refreshCurUpLine(spendtime, index) {
        let color = this.getColor(spendtime)
        this.upCurLineLabelNode.color = color
        this.upCurLineLabelNode.getComponent(cc.Label).string = "线路" + (index + 1)
        let speed = this.curUpLine.getChildByName('speed')
        speed.color = color
        speed.getComponent(cc.Label).string = spendtime + "ms"
    },
    refreshCurCenterLine(spendtime, index) {
        let color = this.getColor(spendtime)
        this.cCurLineLabelNode.color = color
        this.cCurLineLabelNode.getComponent(cc.Label).string = "线路" + (index + 1)
        let speed = this.curCenterLine.getChildByName('speed')
        speed.color = color
        speed.getComponent(cc.Label).string = spendtime + "ms"
    },
    refreshUpScrollView(list) {
        this.upScrollview.content.height = list.length * this.item.height
        for (let i = 0; i < list.length; i++) {
            if (this.upgradeItemList[i]) {
                this.upgradeItemList[i].active = true
            } else if (i >= this.upgradeItemList.length) {
                let item = cc.instantiate(this.item)
                let x = 0
                let y = -i * this.item.height
                item.setPosition(x, y)
                item.active = true
                this.upScrollview.content.addChild(item)
                this.upgradeItemList.push(item)
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hqqNetPanel";
                clickEventHandler.handler = "onClickChoiceCurUpLine";
                let button = item.getChildByName('choicebtn').getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
            let color = this.getColor(list[i].time)
            let curline = this.upgradeItemList[i].getChildByName('curline')
            curline.color = color
            curline.getComponent(cc.Label).string = "线路" + (list[i].index + 1)
            let speed = this.upgradeItemList[i].getChildByName('speed')
            speed.color = color
            let btn = this.upgradeItemList[i].getChildByName('choicebtn').getComponent(cc.Button)
            btn._myinfo = list[i]
            btn.clickEvents[0].customEventData = i + "/" + list[i].index
            if (list[i].err) {
                btn.interactable = false
                speed.getComponent(cc.Label).string = "-----"
            } else {
                btn.interactable = true
                speed.getComponent(cc.Label).string = list[i].time + "ms"
            }
        }
    },
    refreshCenterScrollView(list) {
        this.centerScrollview.content.height = list.length * this.item.height
        for (let i = 0; i < list.length; i++) {
            if (this.centerItemList[i]) {
                this.centerItemList[i].active = true
            } else if (i >= this.centerItemList.length) {
                let item = cc.instantiate(this.item)
                let x = 0
                let y = -i * this.item.height
                item.setPosition(x, y)
                item.active = true
                this.centerScrollview.content.addChild(item)
                this.centerItemList.push(item)
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hqqNetPanel";
                clickEventHandler.handler = "onClickChoiceCurCenterLine";
                let button = item.getChildByName('choicebtn').getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
            let color = this.getColor(list[i].time)
            let curline = this.centerItemList[i].getChildByName('curline')
            curline.color = color
            curline.getComponent(cc.Label).string = "线路" + (list[i].index + 1)
            let speed = this.centerItemList[i].getChildByName('speed')
            speed.color = color
            let btn = this.centerItemList[i].getChildByName('choicebtn').getComponent(cc.Button)
            btn._myinfo = list[i]
            btn.clickEvents[0].customEventData = i + "/" + list[i].index
            if (list[i].err) {
                btn.interactable = false
                speed.getComponent(cc.Label).string = "-----"
            } else {
                btn.interactable = true
                speed.getComponent(cc.Label).string = list[i].time + "ms"
            }
        }
    },
    getColor(time) {
        if (time <= hqq.app.netState.outstanding) {
            return cc.color(146, 255, 24)
        } else if (time <= hqq.app.netState.good) {
            return cc.color(255, 185, 29)
        } else if (time <= hqq.app.netState.kind) {
            return cc.color(255, 21, 36)
        } else if (time <= hqq.app.netState.bad) {
            return cc.color(145, 145, 145)
        } else {
            return cc.color(255, 255, 255)
        }
    },
    onClickExit() {
        this.exitFunc()
    },
    onClickQuikLogin() {
        if (this.upgradeList[0] && !this.upgradeList[0].err) {
            hqq.app.hotServerIndex = this.upgradeList[0].index;
            hqq.localStorage.globalSet(hqq.app.hotServerIndexKey, hqq.app.hotServerIndex);
            hqq.app.canHotServer = this.data.upgradeList[this.upgradeList[0].index];
            hqq.localStorage.globalSet(hqq.app.canHotServerKey, hqq.app.canHotServer);
        } else {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "暂未检测到可用线路，请稍后...")
            return
            // hqq.app.canHotServer = this.data.upgradeList[hqq.app.hotServerIndex];
        }
        if (cc.director.getScene().name != "loading") {
            if (this.centerList[0] && !this.centerList[0].err) {
                hqq.app.server = this.data.centerList[this.centerList[0].index];
                hqq.localStorage.globalSet(hqq.app.serverKey, hqq.app.server);
                hqq.app.serverIndex = this.centerList[0].index;
                hqq.localStorage.globalSet(hqq.app.serverIndexKey, this.centerList[0].index);
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "暂未检测到可用线路，请稍后...")
                return
                // hqq.app.server = this.data.centerList[hqq.app.serverIndex];
            }
        }
        this.onClickExit()
    },
    onClickChoiceCurUpLine(event, customEventData) {
        for (let i = 0; i < this.upgradeItemList.length; i++) {
            let btn = this.upgradeItemList[i].getChildByName('choicebtn').getComponent(cc.Button)
            if (btn.clickEvents[0].customEventData == customEventData || btn._myinfo.err) {
                btn.interactable = false
            } else {
                btn.interactable = true
            }
        }
        let infolist = customEventData.split("/")
        let index0 = parseInt(infolist[0])
        let index1 = parseInt(infolist[1])
        this.upchoice = index0 + 1
        hqq.app.canHotServer = this.data.upgradeList[index1];
        hqq.localStorage.globalSet(hqq.app.canHotServerKey, hqq.app.canHotServer);

        hqq.app.hotServerIndex = index1;
        hqq.localStorage.globalSet(hqq.app.hotServerIndexKey, index1);
        this.refreshCurUpLine(this.upgradeList[index0].time, index1)

        if (cc.director.getScene().name == "loading" || this.centerchoice) {
            this.onClickExit()
        }
    },
    onClickChoiceCurCenterLine(event, customEventData) {
        for (let i = 0; i < this.centerItemList.length; i++) {
            let btn = this.centerItemList[i].getChildByName('choicebtn').getComponent(cc.Button)
            if (btn.clickEvents[0].customEventData == customEventData || btn._myinfo.err) {
                btn.interactable = false
            } else {
                btn.interactable = true
            }
        }
        let infolist = customEventData.split("/")
        let index0 = parseInt(infolist[0])
        let index1 = parseInt(infolist[1])
        this.centerchoice = index0 + 1
        hqq.app.server = this.data.centerList[index1];
        hqq.localStorage.globalSet(hqq.app.serverKey, hqq.app.server);

        hqq.app.serverIndex = index1;
        hqq.localStorage.globalSet(hqq.app.serverIndexKey, index1);
        this.refreshCurCenterLine(this.centerList[index0].time, index1)
        if (this.upchoice) {
            this.onClickExit()
        }
    },

    // onClickStartUpTest() {
    //     this.startUpTestBtn.interactable = false
    //     for (let i = 0; i < this.upgradeItemList.length; i++) {
    //         this.upgradeItemList[i].active = false
    //     }
    //     this.upgradeList = []
    //     this.upgradeListTemp = []
    //     hqq.http.testLine(this.upgradeTempList, this.testUpgradeCallBack.bind(this), 2)
    // },
    // onClickStartCenterTest() {
    //     this.startCenterTestBtn.interactable = false
    //     for (let i = 0; i < this.centerItemList.length; i++) {
    //         this.centerItemList[i].active = false
    //     }
    //     this.centerList = []
    //     hqq.http.testLine(this.centerTempList, this.testCenterCallBack.bind(this), 1)
    // },

    refreshUpProcess(curnun) {
        let len = this.upgradeTempList.length
        if (curnun < len) {
            this.upprocess.string = curnun + "/" + len + " 线路检测中，请稍候..."
        } else {
            setTimeout(() => {
                this.testEnd = true
            }, 1000)
            this.upprocess.string = "线路检测完毕"
        }
    },
    refreshCenterProcess(curnun) {
        if (curnun < this.centerTempList.length) {
            this.cneterprocess.string = curnun + "/" + this.centerTempList.length + " 线路检测中，请稍候..."
        } else {
            this.cneterprocess.string = "线路检测完毕"
        }
    },
    refreshTest() {
        if (!this.testEnd) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请等待此次测速结束")
            return
        }
        hqq.hasLineChoiceLayer = false
        this.node.removeFromParent(true);
        hqq.http.stopTestLint();
        hqq.eventMgr.dispatch(hqq.eventMgr.showLineChoiceLayer, this.data)
    }
    // update (dt) {},
});
