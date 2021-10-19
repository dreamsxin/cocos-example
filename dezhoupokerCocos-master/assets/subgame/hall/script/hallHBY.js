
cc.Class({
    extends: cc.Component,

    properties: {
        cxtime: cc.Label,
        fftime: cc.Label,
        totalgold: cc.Label,
    },

    onLoad() {

    },

    start() {

    },

    init(data) {
        this.cxtime.string = data.start_date + "至" + data.end_date
        this.fftime.string = data.start + ":00"
        this.totalgold.string = data.total + ":00元"
    },

    onClickExit() {
        this.node.removeFromParent(true)
    },
    // update (dt) {},
});
