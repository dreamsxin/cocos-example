cc.Class({
    extends: cc.Component,

    properties: {
        colorAtlas: cc.SpriteAtlas, //颜色集
    },
    init(blockIndex) { //第几号的方块
        this.node.getComponent(cc.Sprite).spriteFrame = this.colorAtlas.getSpriteFrame(blockIndex); //0,1,2
        this.node.width = 80 + blockIndex * 40; //80,120,160
    },

    onLoad() {
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
        window.block = this; //跨函数全局调用
    },

    onDestory() {
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchmove", this.onTouchMove, this);
        this.node.off("touchend", this.onTouchend, this);
    },
    onTouchStart(e) {
        console.log("点击开始");
        this.startPos = this.node.position; //一开始进行位置储存，为了后面非法放置时位置弹回
    },
    onTouchMove(e) {
        let delta = e.getDelta(); //获取偏移量
        this.node.x += delta.x; //block的x偏移量
        this.node.y += delta.y; //block的y偏移量
    },
    onTouchEnd(e) {
        let canPlace = window.game.placeBlock(this.node); //直接放置位置
        let baseIndex = window.game.baseIndexCheck(this.node.position); //拿到位置

        console.log(baseIndex); //底座编号

        if (!canPlace) { //不能放置
            this.node.position = this.startPos;
        } else { //可以放置

        }
    },

});