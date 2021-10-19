// 使player射击玩家点击屏幕的位置
// 挂在全屏节点上

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel.bind(this));

        this.playerShoot = cc.find('Canvas').getComponent('PlayerShootControl');
    },

    onTouchStart(event)
    {
        this.touchPoint = event.getLocation();
    },

    onTouchMove(event)
    {
        this.touchPoint = event.getLocation();
    },

    onTouchEnd(event)
    {
        this.touchPoint = null;
    },

    onTouchCancel(event)
    {
        this.touchPoint = null;
    },

    update(dt) 
    {
        if (!this.touchPoint)
            return;

        if (!this.player) {
            this.player = cc.find('Canvas').getComponent('LevelMan').getPlayerNode();
        }

        if (!this.player)
            return;

        var playerpos = this.player.convertToWorldSpaceAR(cc.v2(0,0));
        var dir = this.touchPoint.sub(playerpos);
        dir = dir.normalize().mul(10);

        this.playerShoot.checkShoot(dir);
    },
});
