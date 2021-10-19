// 提供给BulletMan使用的对象
// 不应该直接使用此脚本，应该继承这个脚本并重写方法

cc.Class({
    extends: cc.Component,

    properties: {
        onBulletUpdate: [cc.Component.EventHandler],
        onSetInitDir: [cc.Component.EventHandler],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    setBulletMan(man) {
        this.man = man;
    },

    setInitDir(dir)
    {
        for(let i=0; i<this.onSetInitDir.length; ++i)
        {
            this.onSetInitDir[i].emit([dir]);
        }
    },

    bulletUpdate(dt)
    {
        for(let i=0; i<this.onBulletUpdate.length; ++i)
        {
            this.onBulletUpdate[i].emit([dt]);
        }
    },

});
