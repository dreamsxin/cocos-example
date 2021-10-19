
cc.Class({
    extends: cc.Component,

    properties: {
    },

    start()
    {
        cc.log('PlayerShoot start');
    },

    onLevelLoaded(levelman) {
        this.playerInfo = levelman.getPlayerNode().getComponent('PlayerInfo');
        this.enermyMan = cc.find('Canvas').getComponent('EnermyMan');
    },

    checkShoot(step)
    {
    	if (step.len()<0.5)
        {
            let pos = this.playerInfo.getWorldPosition();
            let e = this.enermyMan.getNearestNodeAtWorld(pos);
            if (e)
            {
                step = e.convertToWorldSpaceAR(cc.v2(0,0)).sub(pos).normalize();
            }
        }

        var shootdir = step.normalize();

        this.playerInfo.triangle.angle = -step.signAngle(cc.v2(0,1)) * 180 / 3.14;

        this.playerInfo.weaponman().checkShoot(shootdir);
    },
});
