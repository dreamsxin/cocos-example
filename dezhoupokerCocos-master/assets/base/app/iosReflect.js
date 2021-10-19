
cc.Class({
    extends: cc.Component,
    ctor: function () {
    },
    setCallback(callback) {
        this.callback = callback
    },
    testWebSpeedAction(url) {
        if (url) {
            if (this.callback) {
                this.callback(url);
            }
        }
    }
});
