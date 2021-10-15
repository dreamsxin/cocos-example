cc.Class({
    extends: cc.Component,

    properties: {
        ballAtlas: cc.SpriteAtlas,
    },


    onLoad() {


        this.node.on("touchstart", this.onTouchStart, this); //绑定触摸事件
    },

    //随机逻辑，eg传入难度5，显示012345的图集图片
    //typeCnt图片数需要随着难度增加, 这不是单单属于小球的方法
    randBall(typeCnt) { //有多少个球
        frames = this.ballAtlas.getSpriteFrames()
        console.log(frames.length)

        if (typeCnt > frames.length) { //max=6,max=6
            typeCnt = frames.length
        }


        sprite = this.node.getComponent(cc.Sprite) //拿到当前节点的Sprite组件
        randIndex = parseInt(Math.random() * typeCnt) //0到N的随机整数
        //将Sprite组件的属性替换为图集
        sprite.spriteFrame = this.ballAtlas.getSpriteFrame(randIndex)

        this.typeCnt = typeCnt //每关球池上限用到
    },


    nextBall() { //点击鼠标顺序切换图集图片
        if (window.game.gameOver) return


        let sprite = this.node.getComponent(cc.Sprite) //取sprite组件
        let index = sprite.spriteFrame.name; //01 012 0123 01234

        //图集最大为5，要能拿到图集的最后一个的名字
        let nextIndex = parseInt(index) + 1 //0+1=01,所以用了parseInt
        if (nextIndex >= this.typeCnt) //数组边界检测循环
            nextIndex = 0;

        let frames = this.ballAtlas.getSpriteFrames() //取图集组件
        sprite.spriteFrame = frames[nextIndex] //将Sprite组件的属性替换为图集

        window.game.checkOver()
    },
    onTouchStart(e) {
        this.nextBall()

    },

});