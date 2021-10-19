
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {

    },

    //碰撞回调
    onCollisionEnter(other, self) {
        if (other.node.group == "enemy") {
        }
    },

    // update (dt) {},
});
