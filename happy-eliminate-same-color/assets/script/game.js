cc.Class({
    extends: cc.Component,

    properties: {
        ballPrefab: cc.Prefab,
        areaNode: cc.Node,
        hintLabel: cc.Label,
    },
    onLoad() {
        window.game = this
        this.init();

        //this.initMapOne();
        //this.initMapArray();
        this.initMap(this.level);

    },

    init() {
        this.ballNodeArr = []

        this.ballClmCnt = 4 //一行4个
        this.level = 1 //第一关
        this.maxLevel = 4

        this.gameOver = false

    },

    initMap(level) {

        // for (let i = 0; i < this.ballNodeArr.length; i++) {
        //     this.ballNodeArr[i].destroy();
        // }
        this.time = 5
        this.now = 0
        //最多4行的关卡
        if (level > this.maxLevel) //0123
            level = this.maxLevel

        ballCnt = this.ballClmCnt * level //列*行
        typeCnt = 1 + level //max=6个色

        for (let i = 0; i < ballCnt; i++) { //layout设置自动换行
            let ballNode = null

            if (!this.ballNodeArr[i]) { //第一关数组为空
                ballNode = cc.instantiate(this.ballPrefab);
                this.areaNode.addChild(ballNode);
                this.ballNodeArr.push(ballNode)

            } else {
                ballNode = this.ballNodeArr[i] //已经有Node?

            }
            ballNode.getComponent("ball").randBall(typeCnt)
        }

    },
    checkOver() {
        isOver = true;
        targetName = null
        for (let i = 0; i < this.ballNodeArr.length; i++) {
            ballNode = this.ballNodeArr[i]
            let name = ballNode.getComponent(cc.Sprite).spriteFrame.name
            if (i == 0) {
                targetName = name //第一个为标准，第一个是可变的的
                console.log(targetName)
                continue
            }
            if (name != targetName) {
                isOver = false
                break
            }
        }
        console.log("游戏结束？" + isOver)


        if (isOver)
            this.nextLevel()
    },

    nextLevel() {
        this.level++
        if (this.level > this.maxLevel) {
            console.log("全部通关")
        } else {
            console.log("关卡数：" + this.level)
            this.initMap(this.level)
        }



    },

    update(dt) {
        this.now += dt
        if (this.now <= this.time) {
            let resTime = parseInt(this.time - this.now) //60fps,1s打印60次
            console.log("剩余时间：" + resTime)



            this.hintLabel.string = `Level:${this.level} ,resTime:${resTime}s` //反斜点
        } else {
            this.gameOver = true
        }

    },

    hint() {


    },


    initMapOne() {
        let ballCnt = 4;


        for (let i = 0; i < ballCnt; i++) {
            let ballNode = cc.instantiate(this.ballPrefab);
            this.areaNode.addChild(ballNode);
        }
    },



    //尝试做多行失败，显示没问题，数据错误
    initMapArray() {
        let levelCnt = 4;
        let ballCnt = 4;

        for (let i = 0; i < levelCnt; i++) { //0123
            this.ballNodeArr[i] = []

            for (let j = 0; j < ballCnt; j++) {
                let ballNode = cc.instantiate(this.ballPrefab);
                this.areaNode.addChild(ballNode);

                ballNode.name = "ballNode[" + i + "][" + j + "]"

                this.ballNodeArr[i].push(ballNode)
                console.log(i, j) //最后打印的是3,3

            }
            //出现最后一行被push2次，i，j长度达到5,4
            if (i >= ballCnt) continue
            this.ballNodeArr.push(this.ballNodeArr[i])

            //console.log(this.ballNodeArr[i])
        }

        //console.log(this.ballNodeArr)
    },




});