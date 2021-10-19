// 挂在可以添加武器的Node上
// 负责武器挂点、武器生命周期的管理

cc.Class({
    extends: cc.Component,

    properties: {

        // 主武器挂点
        mainHangingNode: cc.Node,

        // 副武器挂点
        // sideHangingNodes: [cc.Node],
    },

    ctor()
    {
        this.weapons = [];
        this.shootDir = cc.v2(0, 1);
    },

    addMainWeaponNode(node)
    {
        var weapon = node.getComponent('Weapon');
        if (!weapon)
            return;

        weapon.setWeaponMan(this);

        node.parent = this.mainHangingNode;
        this.weapons.push(weapon);
    },

    checkShoot(shootdir){

        this.shootDir = shootdir;

        for(var i=0; i<this.weapons.length; ++i)
        {
            this.weapons[i].checkShoot(shootdir);
        }
    },
});
