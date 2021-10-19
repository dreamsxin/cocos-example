
cc.Class({
    extends: cc.Component,

    properties: {
        onCheckShoot: [cc.Component.EventHandler],
    },

    start()
    {
    },

    setWeaponMan(man)
    {
        this.man = man;
    },

    checkShoot(shootdir)
    {
        for(let i=0; i<this.onCheckShoot.length; ++i)
        {
            this.onCheckShoot[i].emit([shootdir]);
        }
    },
});
