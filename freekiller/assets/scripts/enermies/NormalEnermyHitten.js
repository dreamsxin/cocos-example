// 普通小怪被子弹击中后的处理组件
// 挂在普通小怪上

cc.Class({
    extends: cc.Component,

    properties: {

    },

    start()
    {
        this.attr = this.node.getComponent('NormalEnermyAttr');
    },

    setEnermyMan(man)
    {
        this.man = man;
    },

    enermyUpdate(dt)
    {
        // to player
    },
});
