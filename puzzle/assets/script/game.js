cc.Class({
    extends: cc.Component,

    properties: {
        /**  */
        //blockNode: cc.Node, //暂时用，实际用预制体
        //imgNode: cc.Node  //原本想通过节点上的图拿到
        blockPrefab: cc.Prefab,

    },

    onLoad() {
        window.game = this

        // bgWidth = this.node.width
        // bgHeight = this.node.height
        // console.log("Load:" + this.node.width, this.node.height)//1280*720

        this.init()

        //this.loadPicTest()
        this.loadPic()
    },

    //乱序
    randBlock() {

        for (let i = 0; i < this.sideBlockNum; i++) { //一列一列的操作
            for (let j = 0; j < this.sideBlockNum; j++) {
                // let randNumA = parseInt(Math.random() * 4)
                // let randNumB = parseInt(Math.random() * 4)
                let randIndex = {
                    i: parseInt(Math.random() * 4),
                    j: parseInt(Math.random() * 4)

                };

                blockA = this.blockNodeArr[i][j]
                blockB = this.blockNodeArr[randIndex.i][randIndex.j]

                //1、换位置
                posA = blockA.position
                posB = blockB.position

                blockA.setPosition(posB)
                blockB.setPosition(posA)
                //2、换数组顺序
                this.blockNodeArr[i][j] = blockB
                this.blockNodeArr[randIndex.i][randIndex.j] = blockA

            }
        }

    },

    init() {
        this.sideBlockNum = 4 //4*4
        this.blockLength = 180 //边长
    },

    shotPic(texture) {
        this.blockNodeArr = []

        for (let i = 0; i < this.sideBlockNum; i++) { //一列一列的操作
            this.blockNodeArr[i] = []
            for (let j = 0; j < this.sideBlockNum; j++) {
                let block = cc.instantiate(this.blockPrefab)
                this.node.addChild(block)

                block.name = `(${i} , ${j})`
                //一列一列地设置位置
                block.setPosition(cc.v2(i * this.blockLength, -j * this.blockLength)) //i不变j变，00,01,02
                console.log("坐标：" + i, j + "\t位置：" + i * this.blockLength + ",\t" + (-j * this.blockLength))
                block.getComponent("block").init(texture, cc.v2(i, j)); //一列一列地截图

                // this.blockNodeArr[i][j] = block
                this.blockNodeArr[i].push(block)
            }
            this.blockNodeArr.push(this.blockNodeArr[i])
        }

        //console.log("数组：" + this.blockNodeArr[0][0])//?
        this.randBlock()

    },

    loadPic() {
        //读取资源,类型,回调
        cc.loader.load({
            //url: "res/raw-assets/source/img.png",//本人拿不到截图
            url: "assets/others/native/ef/efce5078-fd9b-4e65-9b73-9bc53fa984d8.png", //控制台拿到的
            type: "png" //类型
        }, (err, texture) => {

            //加载的资源绑定到对象上
            //this.picTexture是新定义的
            this.picTexture = texture;
            //this.blockNode.getComponent("block").init(texture, cc.v2(0, 0));

            this.shotPic(texture)
        });



    },

    loadPicTest() {
        frame = this.imgNode.getComponent(cc.Sprite).spriteFrame
        console.log(frame)

        this.blockNode.getComponent("block").init(frame, cc.v2(0, 0));
    },

});