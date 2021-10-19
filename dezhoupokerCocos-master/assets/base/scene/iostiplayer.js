
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // onLoad () {},

    start() {

    },
    init(data) {

    },

    onClickClose() {
        this.node.removeFromParent(true)
    },
    onCickSure() {
        console.log('onCickSure')
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
    /**
     * @Description:不再提示
     */
    noTipAgain(toggle) {
        hqq.localStorage.globalSet("isShowIosTip", toggle.isChecked)
    },

    // update (dt) {},
});
