cc.Class({
    extends: cc.Component,

    properties: {
        spritenode: cc.Node,
        backSprite: {
            default: [],
            type: [cc.SpriteFrame],
        },
        label: cc.Label,
        tipnode: cc.Node,
    },

    onLoad() {
        this.upTime = 0;
        this.centerTime = 0;
        hqq.eventMgr.register(hqq.eventMgr.refreshNetState, "netnode", this.refreshNetState.bind(this))
        this.blinkaction = cc.repeatForever(cc.blink(3, 3));
        this.isOnAction = false
    },

    start() {

    },

    init(data) {
        // this.subdata = data.subdata
        let subdata = {
            upgradeList: hqq.localStorage.globalGet(hqq.app.hotServerKey),
            centerList: hqq.app.serverList,
            notshowexitbtn: false,
            uptime: this.upTime,
            centertime: this.centerTime,
        }
        if (cc.director.getScene().name == "loading") {
            subdata.restartGame = true
            subdata.notshowexitbtn = true
        }
        if (data && data.subdata) {
            for (let k in data.subdata) {
                subdata[k] = data.subdata[k]
            }
        }

        if (cc.director.getScene().name == "loading") {
            this.tipnode.active = true
            this.tipnode.on(cc.Node.EventType.TOUCH_END, (event) => {
                hqq.eventMgr.dispatch(hqq.eventMgr.showLineChoiceLayer, subdata)
            })
        }
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showLineChoiceLayer, subdata)
        })
    },
    refreshNetState(data) {
        this.upTime = data.timelist[0] > data.timelist[1] ? data.timelist[0] : data.timelist[1]
        this.centerTime = data.timelist[2]
        this.label.node.color = this.getColor(data.time);
        if (data.time <= hqq.app.netState.outstanding) {
            this.spritenode.getComponent(cc.Sprite).spriteFrame = this.backSprite[4]
            this.spritenode.stopAllActions()
            this.isOnAction = false
            this.spritenode.opacity = 255
            this.label.string = data.time + "ms"
        } else if (data.time <= hqq.app.netState.good) {
            this.spritenode.getComponent(cc.Sprite).spriteFrame = this.backSprite[3]
            this.spritenode.stopAllActions()
            this.isOnAction = false
            this.spritenode.opacity = 255
            this.label.string = data.time + "ms"
        } else if (data.time <= hqq.app.netState.kind) {
            this.spritenode.getComponent(cc.Sprite).spriteFrame = this.backSprite[2]
            if (!this.isOnAction) {
                this.spritenode.runAction(this.blinkaction)
                this.isOnAction = true
            }
            this.label.string = data.time + "ms"
        } else if (data.time <= hqq.app.netState.bad) {
            this.spritenode.getComponent(cc.Sprite).spriteFrame = this.backSprite[1]
            if (!this.isOnAction) {
                this.spritenode.runAction(this.blinkaction)
                this.isOnAction = true
            }
            this.label.string = data.time + "ms"
        } else {
            this.spritenode.getComponent(cc.Sprite).spriteFrame = this.backSprite[0]
            if (!this.isOnAction) {
                this.spritenode.runAction(this.blinkaction)
                this.isOnAction = true
            }
            this.label.string = "无信号"
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
    onDestroy() {
        hqq.eventMgr.unregister(hqq.eventMgr.refreshNetState, "netnode")
    }

    // update (dt) {},
});
