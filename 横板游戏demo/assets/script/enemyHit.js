const collision = require('collision');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.enemy = this.node.parent.getComponent('enemy');
        this.heroNode = cc.find('Canvas/bg/hero').getComponent('hero');
    },

    //碰撞回调
    onCollisionEnter(other, self) {
        if (other.node.group == "hero" && other.tag == 1 && this.heroNode.getHeroState() == collision.State.attack) {
            this.enemy.hurt();
        }
    },
});
