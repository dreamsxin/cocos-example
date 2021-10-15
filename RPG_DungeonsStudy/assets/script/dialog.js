let roleMap = {
    1: {
        name: '勇者',
        url: 'role/hero'
    },
    2: {
        name: '骷髅王',
        url: 'role/npc'
    }
}
cc.Class({
    extends: cc.Component,

    properties: {
        picSprite: cc.Sprite,
        nameLabel: cc.Label,
        textLabel: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // 暴露全局
        window.dialog = this.node;
        // 键盘事件的监听
        cc.systemEvent.on('keydown', this.onKeydown, this)
    },
    // 监听执行方法
    onKeydown(e) {
        switch (e.keyCode) {
            // 按下是空格键
            case cc.macro.KEY.space:
                {
                    this.nextTextData();
                    break;
                }
        }
    },
    inDestory() {
        cc.systemEvent.off('keydown', this.onKeydown, this)
    },
    // 接收传参
    init(textDataArr) {
        this.nowText = null;
        this.textEnd = true;
        this.tt = 0;

        this.textIndex = -1;
        this.textDataArr = textDataArr;
        this.node.active = true;
        this.nextTextData()
    },
    // 执行下一个文本
    nextTextData() {
        if (!this.textEnd) return;
        // 如果还有就显示执行
        if (++this.textIndex < this.textDataArr.length) {
            this.setTextData(this.textDataArr[this.textIndex]);
        } else {
            // 否则关闭
            this.node.active = false
        }
    },
    // 设置文本内容
    setTextData(textData) {
        if (!this.textEnd) return;
        this.textEnd = false;
        // 设置名字
        this.nameLabel.string = roleMap[textData.role].name;
        // 设置对话内容
        this.textLabel.string = '';
        this.nowText = textData.content;
        // 头像设置
        cc.loader.loadRes(roleMap[textData.role].url, cc.SpriteFrame, (err, texture) => {
            this.picSprite.spriteFrame = texture
        })
    },
    start() {

    },

    update(dt) {
        if (!this.nowText) return;
        this.tt += dt;
        if (this.tt >= 0.1) {
            if (this.textLabel.string.length < this.nowText.length) {
                this.textLabel.string = this.nowText.slice(0, this.textLabel.string.length + 1)
            } else {
                this.textEnd = true;
                this.nowText = null
            }
            this.tt = 0
        }
    },
});