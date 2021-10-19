
cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.RichText, // 公告板文字(富文本)
        noticeScroll: cc.ScrollView, // 滚动视窗
    },

    /** 脚本组件初始化，可以操作this.node // use this for initialization */
    onLoad() {
        this.isRoll = false
        this.className = 'temp'
        hqq.eventMgr.register(hqq.eventMgr.addSliderNotice, "hallNoticeBoard", this.addSliderNotice.bind(this))
    },
    /** enabled和active属性从false变为true时 */
    onEnable() {
        if (hqq.gameGlobal.slideNoticeList.length > 0) {
            this.addSliderNotice(hqq.gameGlobal.slideNoticeList)
        }
    },
    /** 通常用于初始化中间状态操作 */
    start() {

    },
    // 可以同场景多个节点应用
    changeRegister(className) {
        this.className = className
        hqq.eventMgr.unregister(hqq.eventMgr.addSliderNotice, "hallNoticeBoard")
        hqq.eventMgr.register(hqq.eventMgr.addSliderNotice, className, this.addSliderNotice.bind(this))
    },
    addSliderNotice(msg) {
        // cc.log("addSliderNotice", this.isRoll, msg.length, msg)
        for (let i = 0; i < msg.length; i++) {
            this.addNotice(msg[i])
        }
        if (!this.isRoll) {
            this.isRoll = true;
            this.noticeStartRoll();
        }
    },
    /**
     * 添加滚动公告
     * @param {notice} 公告文字（富文本表示<color=#00ff00>RichText</color>）
     * @param {time} 公告滚动次数
     */
    addNotice(notice) {
        if (!this.noticeList) {
            this.noticeList = [];
        }
        let noticeItem = {
            text: notice.notice,
            time: notice.time,
            rollforver: notice.rollforver,
        }
        this.noticeList.push(noticeItem);
    },
    /** 开始滚动 */
    noticeStartRoll() {
        // cc.log("noticeStartRoll")
        let item = this.noticeList.shift();
        if (item) {
            if (!item.rollforver) { // tyep = 1 永久滚动 2 滚动一次
                item.time--;
            }
            let text = item.text;
            if (item.time > 0) {
                this.noticeList.push(item);
            }
            let time = text.length * 0.1 + 15;
            this.label.string = text;
            let x = this.noticeScroll.node.width / 2 + this.label.node.width / 2;
            this.label.node.setPosition(x, 0);
            let move1 = cc.moveTo(time / 3, cc.v2(0, 0));
            let move2 = cc.moveTo(time / 3, cc.v2(-x, 0));
            let callfunc = cc.callFunc(() => {
                this.noticeStartRoll();
            }, this)
            let seq = cc.sequence(move1, move2, callfunc);
            this.label.node.runAction(seq);
        } else {
            this.isRoll = false;
        }
    },

    /** 每帧调用一次 // called every frame */
    // update(dt) { },
    /** 所有组件update执行完之后调用 */
    // lateUpdate() { },
    /** 调用了 destroy() 时回调，当帧结束统一回收组件 */
    onDestroy() {
        hqq.eventMgr.unregister(hqq.eventMgr.addSliderNotice, "hallNoticeBoard")
        hqq.eventMgr.unregister(hqq.eventMgr.addSliderNotice, this.className)
    },
});
