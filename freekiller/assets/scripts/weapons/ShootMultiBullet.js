
cc.Class({
    extends: cc.Component,

    properties: {
        // 子弹模型
        bulletPrefab: cc.Prefab,

        // 射击时的音效
        shootSound: {
            type: cc.AudioClip,
            default: null,
        },

        // 每次发射几颗子弹
        bulletCount: 3,
    },

    start () {
        this.bulletMan = cc.find('Canvas').getComponent('BulletMan');
        this.weapon = this.node.getComponent('Weapon');
    },

    onShootTriggered(shootdir) {
        this.schedule(this.shoot.bind(this), 0.1, this.bulletCount-1);
    },

    shoot(){
        var bulletNode = cc.instantiate(this.bulletPrefab);

        bulletNode.position = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        bulletNode.getComponent('Bullet').setInitDir(this.weapon.man.shootDir);

        this.bulletMan.addBulletNode(bulletNode);

        helper.playEffect(this.shootSound);
    },
});
