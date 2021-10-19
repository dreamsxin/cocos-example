cc.Class({
    extends: cc.Component,
    properties: {
        Calculate:0,//生成层数
		finalWidth:0,//最终宽度
        starPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
     onLoad () {
        this.spawnNewStar();
     },

    start () {

    },
	spawnNewStar: function() {
        this.Calculate=this.Calculate+1;
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到 Canvas 节点下面
		newStar.getComponent('Star').init(this);	
        this.node.addChild(newStar);
		//设置高度
        newStar.setPosition(this.getNewStarPosition());
       },
    getNewStarPosition: function () {
        var randX = 0;
        return cc.p(2, 290);
    },
     update (dt) {
     },
});
