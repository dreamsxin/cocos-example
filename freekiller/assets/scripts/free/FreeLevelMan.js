// 负责关卡数据的读取

cc.Class({
    extends: require("LevelMan"),

    properties: {

        playerNode: cc.Node,

        tiledmapNode: cc.Node,

        centerPlayer: require('CenterPlayer'),

        title: require('FreeTitle'),

        debugGun: cc.Prefab,
    },

    curLevel: 0,

    start () {
        this.curLevel = 0;
        
        this.emitLevelLoaded();

        cc.director.getCollisionManager().enabled = true;
        // cc.director.getCollisionManager().enabledDebugDraw = true;
    },

    gotoNext()
    {
        ++this.curLevel;

        this.emitLevelLoaded();
    },

    loadPlayerWeapon() {

        if (!this.debugGun)
            return;

        var weaponman = this.playerNode.getComponent('WeaponMan');
        var weaponnode = cc.instantiate(this.debugGun);
        weaponman.addMainWeaponNode(weaponnode);

        this.debugGun = null;
    },

    emitLevelLoaded()
    {
        this.loadPlayerWeapon();

        this.centerPlayer.onLevelLoaded(this);
        this.getComponent('EnermyMan').onLevelLoaded(this);
        this.getComponent('FreeEnermyGenner').onLevelLoaded(this);
        this.getComponent('PlayerMoveControl').onLevelLoaded(this);
        this.getComponent('PlayerShootControl').onLevelLoaded(this);
        this.getComponent('FinishCondition').onLevelLoaded(this);
        this.getComponent('FreeStateMan').onLevelLoaded(this);
        this.title.onLevelLoaded(this);
    },

    getPlayerNode()
    {
        return this.playerNode;
    },

    getMapNode()
    {
        return this.tiledmapNode;
    },

    getCurLevel()
    {
        return this.curLevel;
    },

    getEnermyGenner()
    {
        return this.node.getComponent('FreeEnermyGenner');
    },

    getEnermyMan()
    {
        return this.node.getComponent('EnermyMan');
    },

    getStateMan()
    {
        return this.node.getComponent('StateMan');
    },
});
