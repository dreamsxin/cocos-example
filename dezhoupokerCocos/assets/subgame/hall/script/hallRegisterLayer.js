
cc.Class({
    extends: cc.Component,

    properties: {
        goldlabel: cc.Label,
    },

    // onLoad () {},

    start() {

    },

    init() {

    },

    onClickExit() {
        this.node.removeFromParent(true)
    },

    onClickRegister() {
        if (hqq.gameGlobal.player.phonenum != "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "已经绑定过手机")
        } else {
            hqq.eventMgr.dispatch(hqq.eventMgr.showBiglayer, 3)
            this.node.removeFromParent(true)
        }
    },

    // update (dt) {},
});
