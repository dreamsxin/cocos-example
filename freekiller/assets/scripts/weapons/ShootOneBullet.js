// 每次射击触发时，只发射一颗子弹

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
    },

    start () {
        this.bulletMan = cc.find('Canvas').getComponent('BulletMan');
    },

    onShootTriggered(shootdir) {
        var bulletNode = cc.instantiate(this.bulletPrefab);

        bulletNode.position = this.node.convertToWorldSpaceAR(cc.v2(0,0));
        bulletNode.getComponent('Bullet').setInitDir(shootdir);

        this.bulletMan.addBulletNode(bulletNode);

        helper.playEffect(this.shootSound);
    },
});
