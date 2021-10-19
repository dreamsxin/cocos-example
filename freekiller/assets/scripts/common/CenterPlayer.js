// 使player永远居中于屏幕中心，但不会超出tilemap范围
// 挂在任意位置

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onLevelLoaded(levelman) {
        this.player = levelman.getPlayerNode();
        this.tiledmap = levelman.getMapNode();
    },

    update (dt)
    {
        if(!this.player || !this.tiledmap)
            return;

        var center = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
        var world = this.player.convertToWorldSpaceAR(cc.v2(0,0));
        var diff = center.sub(world);
        var pos = this.node.position.add(diff);
        var xmax = this.tiledmap.width/2 - center.x;
        var xmin = -xmax;
        var ymax = this.tiledmap.height/2 - center.y;
        var ymin = -ymax;
        if (pos.x > xmax) {
            pos.x = xmax;
        }
        if (pos.x < xmin) {
            pos.x = xmin;
        }
        if (pos.y > ymax) {
            pos.y = ymax;
        }
        if (pos.y < ymin) {
            pos.y = ymin;
        }
        this.node.position = pos;
    },
});
