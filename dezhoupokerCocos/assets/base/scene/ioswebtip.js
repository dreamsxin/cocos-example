
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

    },
    init(data) { },
    onClickClose() {
        this.node.removeFromParent(true);
        hqq.localStorage.globalSet("noShowIosWebTip", true)
    },
    // update (dt) {},
});
