

cc.Class({
    extends: cc.Component,

    properties: {
        center: cc.Node,
        buff1: cc.ProgressBar,
        // buff2: cc.ProgressBar,
        triangle: cc.Node,

        radius: {
            serializable: false,
            visible: false,
            default: 16,
        },

        // 每帧移动多少像素
        speed: {
            default: 1,
            visible: false,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start ()
    {
        this.buff1.node.active = false;
    },

    weaponman() {
        return this.getComponent('WeaponMan');
    },

    getWorldPosition()
    {
        return this.node.convertToWorldSpaceAR(cc.v2(0,0));
    },

    // update (dt) {},
});
