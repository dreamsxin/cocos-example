cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: cc.Node,
        boomNode: cc.Node,
        enemyNode: cc.Node,
        scoreLabel: cc.Label,
    },


    onLoad() {
        this.nextLevel()
        this.score = 0

        this.isFire = false
        this.node.on("touchstart", this.onTouchStart, this);
        this.node.on("touchmove", this.onTouchMove, this);
        this.node.on("touchend", this.onTouchEnd, this);
    },

    nextLevel() {
        this.placePlayer()
        this.placeEnemy()
    },

    //击中效果
    kill() {
        p1 = this.playerNode.position
        p2 = this.enemyNode.position
        w1 = this.playerNode.width
        w2 = this.enemyNode.width

        if (p1.sub(p2).mag() < w1 / 2 + w2 / 2) {

            console.log("击中了")
            //setTimeout(() => {
            this.enemyNode.active = false
            //this.playerNode.active = false
            this.boom(this.enemyNode, this.enemyNode.color)

            this.scoreLabel.string = `击杀:${++this.score}`

            this.enemyNode.stopAction(this.enemyAction)
            this.playerNode.stopAction(this.playerAction)
            //}, -1000) //2000是穿过playerNode爆炸


            // setTimeout(() => {
            this.nextLevel
            // }, 2000) //-2000爆炸立刻下一局
        }
    },

    //敌人位置
    placeEnemy() {
        console.log("placeEnemy")
        this.enemyNode.active = true

        //下落时x,y变化
        let x = cc.winSize.width / 2 - this.enemyNode.width / 2
        let y = Math.random() * cc.winSize.height / 4
        let dua = 0.6 + Math.random() * 0.5

        //初始位置
        this.enemyNode.setPosition(cc.v2(0, cc.winSize.height / 2 - this.enemyNode.height / 2))

        let seq = cc.repeatForever(
            cc.sequence(
                cc.moveTo(dua, -x, y),
                cc.moveTo(dua, x, y),
            )
        );

        this.enemyAction = this.enemyNode.runAction(seq)

        console.log("placeEnemy结束")
    },

    //特效
    boom(pos, color) {
        this.boomNode.setPosition(pos)

        let particle = this.boomNode.getComponent(cc.ParticleSystem)
        if (color !== undefined) {
            particle.startColor = particle.endColor = color
        }
        setTimeout(() => {
            particle.resetSystem() //杀死所有存在的粒子，然后重新启动粒子发射器
        }, -2000)
    },

    //死亡,重新加载
    die() {
        this.playerNode.active = false //节点销毁
        this.boom(this.playerNode.position, this.playerNode.color)

        console.log("游戏结束")

        setTimeout(() => {
            cc.director.loadScene("game")
        }, 2000) //2秒后加载场景
    },

    //下落
    fall() {
        console.log("开始下落")
        time = 10
        let seq = cc.sequence(
            //顶部触底
            cc.moveTo(time, cc.v2(0, -cc.winSize.height / 2 - this.playerNode.height)),
            cc.callFunc(() => {
                //console.log(cc.winSize)
                this.die()
            })
        )
        this.playerAction = this.playerNode.runAction(seq)

    },

    onDestory() {
        this.node.off("touchstart", this.onTouchStart, this);
        this.node.off("touchmove", this.onTouchMove, this);
        this.node.off("touchend", this.onTouchend, this);
    },

    onTouchStart(e) {
        this.fire()

    },

    //发射到顶死亡
    fire() {
        if (this.isFire) return
        this.isFire = true

        console.log("射击")
        time = 0.6
        let seq = cc.sequence(
            cc.moveTo(time, cc.v2(0, cc.winSize.height / 2)),
            cc.callFunc(() => {
                console.log("射击结束");
                this.die()
            }, 1000)
        )
        this.playerAction = this.playerNode.runAction(seq)
    },

    //初始位置
    placePlayer() {
        console.log("placePlayer")

        this.isFire = //没加时出现奇怪的二次发射
            this.playerNode.active = true
        this.playerNode.y = -cc.winSize.height / 4

        this.fall()
    },


    start() {

    },

    update(dt) {
        this.kill()
    },
});