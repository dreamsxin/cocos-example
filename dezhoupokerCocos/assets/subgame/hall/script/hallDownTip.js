

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.RichText,
        bg: cc.Node,
    },

    onLoad() {
        this.dataList = []
        this.isRun = false
        this.movedis = this.node.height
        this.delaytime = 3
        this.flytime = 0.5
        this.node.setPosition(cc.winSize.width / 2, cc.winSize.height + this.node.height / 2)
    },

    start() {

    },

    init(data) {
        if (this.isRun) {
            this.dataList.push(data)
        } else {
            this.showTip(data)
        }
    },

    showTip(data) {
        this.isRun = true
        if (data.msg.length > 8) {
            data.msg = data.msg.substring(0, 8) + "..."
        }
        let str = "<color=#000000>" + data.msg + "</c>"
        if (data.nick) {
            str = "<color=#000000>" + data.nick + "</c> " + str
        }
        this.label.string = str

        // this.node.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + this.node.height / 2)
        let m0 = cc.moveBy(this.flytime, cc.v2(0, -this.movedis))
        let d0 = cc.delayTime(this.delaytime)
        let m1 = cc.moveBy(this.flytime, cc.v2(0, +this.movedis))
        let ca = cc.callFunc(() => {
            if (this.dataList.length > 0) {
                this.showTip(this.dataList.shift())
            } else {
                this.isRun = false
                this.node.removeFromParent(true)
            }
        }, this)
        this.node.runAction(cc.sequence(m0, d0, m1, ca))
    },

    // update (dt) {},
});
