// 负责加载tmx地图、player

cc.Class({
    extends: require('LevelLoader'),

    properties: {
        tiledmap: cc.TiledMap,

        namePattern: cc.String,

        playerPrefab: cc.Prefab,

        onLevelLoaded: [cc.Component.EventHandler],
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },

    onLevelChanged(levelMan) {
        var mapname = `${this.namePattern}${levelMan.curLevel}`;

        cc.loader.loadRes(mapname, (err, asset) => {
            this.tiledmap.tmxAsset = asset;

            this.displayLayer = this.tiledmap.getLayer('display');

            var objects = this.tiledmap.getObjectGroup('object').getObjects();
            for(var i=0; i<objects.length; ++i)
            {
                if (!objects[i].name) {
                    cc.warn('没有配置对象名称');
                    continue;
                }

                var types = objects[i].name.split('.');
                if (types[0] === "player") {
                    this.loadPlayer(objects[i]);
                }
                else if (types[0] === "wall") {
                    this.loadWall(objects[i]);
                }
                else {
                    cc.warn('未知的碰撞类型:', types[0]);
                }
            }

            for(var i=0; i<this.onLevelLoaded.length; ++i)
            {
                this.onLevelLoaded[i].emit([this]);
            }
        });
    },

    loadPlayer(config)
    {
        this.player = cc.instantiate(this.playerPrefab);

        // var mapRC = this.tiledmap.getMapSize();
        // var tileSize = this.tiledmap.getTileSize();
        var center = cc.v2(this.tiledmap.node.width/2, this.tiledmap.node.height/2);

        var x = config.x - center.x;
        var y = config.y - center.y;

        this.player.position = cc.v2(x, y);

        // 由于creator的bug，此方法会导致player在某些区域显示不出来
        // this.displayLayer.addUserNode(this.player);
        this.player.parent = this.displayLayer.node;
    },

    loadWall(config)
    {
        var center = cc.v2(this.tiledmap.node.width/2, this.tiledmap.node.height/2);
        var layer = this.tiledmap.getObjectGroup('object');
        var types = config.name.split('.');
        if (types[1] === 'square')
        {
            var box = layer.addComponent(cc.BoxCollider);
            box.size = new cc.Size(config.width, config.height);
            box.offset = cc.v2(config.x-center.x+config.width/2, config.y-center.y-config.height/2);
        }
    },

});
