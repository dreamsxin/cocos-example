// 控制bullet的生命周期

cc.Class({
    extends: cc.Component,

    ctor()
    {
        this.bullets = [];
    },

    properties: {
        bulletLayer: cc.Node,
    },

    start () {

    },

    onLevelLoaded(levelMan)
    {
        this.bulletLayer.removeAllChildren();
        this.bullets = [];
    },

    addBulletNode(node) {
        var b = node.getComponent('Bullet');
        b.setBulletMan(this);

        helper.moveNodeTo(node, this.bulletLayer);

        this.bullets.push(b);
    },

    removeBulletNode(node)
    {
        this.bulletLayer.removeChild(node);

        var b = node.getComponent('Bullet');
        var index = this.bullets.indexOf(b);
        if (index>=0) {
            this.bullets.splice(index, 1);
        }
    },

    update (dt) {
        for(let i=0; i<this.bullets.length; ++i)
        {
            this.bullets[i].bulletUpdate(dt);
        }
    },
});
