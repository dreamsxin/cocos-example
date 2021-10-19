cc.Class({
    extends: cc.Component,

    properties: {
        mapNode: cc.Node,        //地图节点
    },

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = false;

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = false;


        this.initMapNode(this.mapNode);
    },

    //绘制地图
    initMapNode(mapNode) {
        let tiledMap = mapNode.getComponent(cc.TiledMap);
        let tiledSize = tiledMap.getTileSize();              //获取地图尺寸
        let wallLayer = tiledMap.getLayer('wall');           //获取墙的layer
        let wallSize = wallLayer.getLayerSize();            //获取墙的Size

        for (let i = 0; i < wallSize.width; i++) {
            for (let j = 0; j < wallSize.height; j++) {
                let tiled = wallLayer.getTiledTileAt(i, j, true);
                if (tiled.gid != 0) {
                    tiled.node.group = 'wall';

                    let body = tiled.node.addComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static; //刚体设置静态
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
                    collider.size = tiledSize;
                    collider.apply();
                }
            }
        }
    },

    // update (dt) {},
});
