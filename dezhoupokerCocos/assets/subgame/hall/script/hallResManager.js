
cc.Class({
    extends: cc.Component,
    properties: {
        // spineAnimation: {
        //     default: [],
        //     type: [sp.SkeletonData],
        // },
        hallBtnName: {
            default: [],
            type: [cc.SpriteFrame],
        },
    },
    /** 脚本组件初始化，可以操作this.node // use this for initialization */
    onLoad() {
        hqq.hallResManager = this;
    },
    /** enabled和active属性从false变为true时 */
    // onEnable() { },
    /** 通常用于初始化中间状态操作 */
    start() {

    },

    getHallBtnAni(id) {
        if (this.spineAnimation[id]) {
            return this.spineAnimation[id];
        } else {

        }
    },
    getHallBtnImg(id) {
        if (this.hallBtnName[id]) {
            return this.hallBtnName[id];
        } else {

        }
    },

    /** 每帧调用一次 // called every frame */
    // update(dt) { },
    /** 所有组件update执行完之后调用 */
    // lateUpdate() { },
    /** 调用了 destroy() 时回调，当帧结束统一回收组件 */
    // onDestroy() { },
});
