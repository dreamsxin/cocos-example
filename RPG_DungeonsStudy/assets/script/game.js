const mapTool = require('mapTool')
cc.Class({
    extends: cc.Component,

    properties: {
        MapNode: cc.Node,
        dialogNode: cc.Node,
        loadNode: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let p = cc.director.getPhysicsManager();
        p.enabled = true;
        // 绘制区域
        // p.debugDrawFlags = true;
        p.gravity = cc.v2(0, 0);
        cc.director.getCollisionManager().enabled = true
            // cc.director.getCollisionManager().enabledDebugDraw = true
        this.loadNode.active = true
            // let mapNameArr = [
            //     ['00000', '00000', '00000'],
            //     ['00010', '11110', '00100'],
            //     ['00000', '10000', '00000'],
            // ]
        let mapNameArr = mapTool.getRandNameArr();
        console.log(mapNameArr);
        this.initMap(mapNameArr);
    },
    // 根据地图名字数组生成地图
    initMap(mapNameArr) {
        let mapSt = null;
        let loadCnt = 0;
        for (let i = 0; i < mapNameArr.length; i++) {
            for (let j = 0; j < mapNameArr[i].length; j++) {
                let mapName = mapNameArr[i][j];
                if (!mapName || mapName == '00000') continue;
                if (!mapSt) {
                    mapSt = { i, j };
                }
                loadCnt++
                cc.loader.loadRes(`map/${mapName}`, cc.TiledMapAsset, (err, assets) => {

                    let node = new cc.Node()
                    let map = node.addComponent(cc.TiledMap);
                    node.anchorX = node.anchorY = 0
                        // 地图宽度对应X轴
                    node.x = (j - mapSt.j) * 384;
                    // 地图高度对应X轴
                    node.y = -(i - mapSt.i) * 384;
                    map.tmxAsset = assets;
                    node.parent = this.MapNode;
                    this.initMapNode(node)
                    if (--loadCnt == 0) {
                        this.loadNode.active = false
                    }
                })
            }
        }
    },
    initMapNode(mapNode) {
        let tiledMap = mapNode.getComponent(cc.TiledMap)
            // 获取到每个小块的距离
        let tiledSize = tiledMap.getTileSize();
        // 拿到tiledmap的wall层
        let layer = tiledMap.getLayer('wall');
        // 尺寸
        let layerSize = layer.getLayerSize();
        // 拿到smog层
        // let smogLayer = tiledMap.getLayer('smog')
        // smogLayer.node.active = false
        // 拿到宽度块数
        for (let i = 0; i < layerSize.width; i++) {
            // 拿到垂直方向块数
            for (let j = 0; j < layerSize.height; j++) {
                // 拿到对应坐标小块
                let tiled = layer.getTiledTileAt(i, j, true)
                    // 判断小块是否存在！=0就是存在的=0就不存在
                if (tiled.gid != 0) {
                    tiled.node.group = 'wall';
                    // 代码动态添加RigidBody组件
                    let body = tiled.node.addComponent(cc.RigidBody)
                        // 设置type是静态
                    body.type = cc.RigidBodyType.Static;
                    // 添加碰撞区域
                    let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
                    // 设置组件偏移量
                    collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
                    collider.size = tiledSize;
                    // 物理引擎生效,刚体需要
                    collider.apply();

                }
                // tiled = smogLayer.getTiledTileAt(i, j, true);
                // if (tiled.gid != 0) {
                //     tiled.node.group = 'smog';
                //     let collider = tiled.node.addComponent(cc.BoxCollider);
                //     collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2)
                //     collider.size = tiledSize;
                // }
            }
        }
    },
    start() {
        // for (let mapNode of this.MapNode.children) {
        //     this.initMapNode(mapNode)
        // }

        // // 初始化对话
        // let dialog = this.dialogNode.getComponent('dialog');
        // dialog.init([
        //     { role: 2, content: '勇者，你来了' },
        //     { role: 1, content: '可恶的魔王' },
        // ])
    },

    // update (dt) {},
});