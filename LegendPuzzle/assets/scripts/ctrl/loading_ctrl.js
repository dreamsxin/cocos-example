cc.Class({
    extends: cc.Component,

    properties: {
        progressBar:{
            type:cc.ProgressBar,
            default:null
        },
        speed:{
            type:cc.Integer,
            default:1
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.progressBar.progress = 0;
    },

    loadScene(sceneName){
        this.sceneName = sceneName;
        cc.director.preloadScene(sceneName,this.loading.bind(this),this.loaded.bind(this));
    },
    loading(completedCount,totalCount,res){
        this.progress = completedCount / totalCount;
        this.resource = res;
        this.completedCount = completedCount;
        this.totalCount = totalCount;
    },
    loaded(error,asset){
        this.finished = true;
    },
    update (dt) {
        if(!this.resource){
            return;
        }
        //一个流畅的进度条动画
        if(this.progressBar.progress<this.progress){
            this.progressBar.progress += this.speed * dt;
        }
        // 加载完成，跳转
        if(this.progressBar.progress >=1 && this.finished == true){
            cc.director.loadScene(this.sceneName);
        }
    },
});
