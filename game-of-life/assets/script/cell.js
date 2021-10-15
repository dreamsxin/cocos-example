cc.Class({
    extends: cc.Component,

    properties: {
        colorNode: cc.Node, //预制体最里面的小白块
    },


    setState(state) { //实际改变颜色是的接口

        this.state = state;

        if (this.state === 0) { //改变颜色的处理
            this.colorNode.color = new cc.Color(255, 255, 255); //白色
        } else {
            this.colorNode.color = new cc.Color(0, 0, 0); //黑色
        }
    },

    //没有这，不能切来切去
    switchState() { //改变颜色标号的接口，会被game.js调用

        //等于0就改为1，不等于0就改为0
        let state = this.state == 0 ? 1 : 0;

        this.setState(state); //调用改变颜色的接口
    },
});