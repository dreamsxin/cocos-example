cc.Class({
    extends: cc.Component,

    properties: {
        loading:{
            type:cc.Prefab,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        
    },
    gameStart(){
        //展示加载界面
        var loadingBar = cc.instantiate(this.loading);
        this.node.addChild(loadingBar);
        //加载场景
        loadingBar.getComponent("loading_ctrl").loadScene("choose")
    },
    
    update (dt) {
        
    },
});
