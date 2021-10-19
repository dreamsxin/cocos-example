// 使node做直线移动

cc.Class({
    extends: cc.Component,

    properties: {
        dir: cc.Vec2,

        speed: cc.Integer,
    },

    setInitDir(dir)
    {
        this.dir = dir;
    },

    checkMove(dt) {
    	var step = this.dir.mul(this.speed);
        this.node.position = this.node.position.add(step);
        this.node.angle = -step.signAngle(cc.v2(0, 1)) * 180 / 3.14;
    },
});
