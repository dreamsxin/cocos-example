cc.Class({
    extends: cc.Component,

    properties: {

        label: cc.Label,

    },

    onLoad() {
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
        window.block = this; //跨函数全局调用
    },

    //汉诺塔贴过来修改的
    onDestory() {
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchmove", this.onTouchMove, this);
        this.node.off("touchend", this.onTouchend, this);
    },
    onTouchStart(e) {

        this.startPos = this.node.position
        //onTouchEnd用到this.startIndex
        this.startIndex = this.getPosIndex(this.startPos, this.node.width, this.node.height)

        console.log("start:" + this.startIndex.i, this.startIndex.j)

        this.node.opacity = 128
        this.node.zIndex = 1

    },

    getPosIndex(pos, width, height) { //
        //1、超范围pos为原来的位置
        let length = window.game.sideBlockNum * window.game.blockLength//段数*段长=边长
        if (pos.x < 0 || pos.y > 0 || pos.x > length || pos.y < -length) {
            pos = this.startPos
        }


        let i = Math.abs(parseInt(pos.x / width))
        let j = Math.abs(parseInt(pos.y / height))

        console.log("Move:" + pos.x, pos.y)
        console.log("Move:" + i, j)



        return {
            i,
            j
        }
    },

    onTouchMove(e) {
        let delta = e.getDelta(); //获取偏移量
        this.node.x += delta.x; //block的x偏移量
        this.node.y += delta.y; //block的y偏移量

        //console.log(this.node.x, this.node.y)
        let moveIndex = this.getPosIndex(this.node)
        console.log("Move:" + moveIndex.i, moveIndex.j)
    },



    onTouchEnd(e) {
        this.node.opacity = 255 //透明度
        this.node.zIndex = 0 //覆盖轴

        //1、endPos从不规范到规范
        endPos = this.node.position
        let endIndex = this.getPosIndex(endPos, this.node.width, this.node.height) //还是鼠标按住的那个节点，位置变化了
        let endNode = window.game.blockNodeArr[endIndex.i][endIndex.j]
        console.log("End:" + endIndex.i, endIndex.j)
        console.log("End:" + endPos)
        console.log("End:" + endNode.position)



        if (endNode) { //对应位置存在方块 

            endPos = endNode.position
            console.log("endPos" + endPos)
            console.log("this.startPos" + this.startPos)
            //2、位置交换
            startNode = this.node
            //ij顺序导致对角线交换
            startNode.setPosition(endPos) //鼠标按着的点
            endNode.setPosition(this.startPos) //B的位置

            //3、节点交换
            window.game.blockNodeArr[this.startIndex.i][this.startIndex.j] = endNode
            window.game.blockNodeArr[endIndex.i][endIndex.j] = startNode
            console.log(this.startIndex.i + "," + this.startIndex.j + "与" + endIndex.i + "," + endIndex.j + "交换了")
        } else {
            startNode.setPosition(this.startPos)
        }
    },

    //接口函数，资源，坐标值
    init(picTexture, pos) {
        //console.log(picTexture, pos)

        let sprite = this.node.getComponent(cc.Sprite); //this.node是block，也就是方块预制体
        let width = this.node.width; //方块的宽
        let height = this.node.height; //方块的高
        //有图，有坐标，有宽和高
        //将picTexture按cc.rect()的方式截图
        let frame = new cc.SpriteFrame(picTexture, cc.rect(pos.x * width, pos.y * height, width, height));
        sprite.spriteFrame = frame; //将截取的图赋给方块

        this.label.string = "(" + pos.y + ", " + pos.x + ")" //cc.v2(0,0)等
    },
});