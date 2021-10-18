var GameConfig=require("GameConfig");
var LevelManager=require("LevelManager");
cc.Class({
    extends: cc.Component,

    properties: {
        bloodsprite:cc.SpriteFrame,
        flag:true,
    },
     onLoad () {   
       //边界
        this.border=cc.find("Canvas/border");
       this.winWidth=cc.winSize.width;
       this.winHeight=cc.winSize.height;
       var selfWidth=this.node.getContentSize().width;
       var selfHeight=this.node.getContentSize().height;
       this.Pos=cc.Enum({
            MinX:(this.winWidth/2-selfWidth/2)*-1,
            MaxX:this.winWidth/2-selfWidth/2,
            MinY:(this.winHeight/2+selfHeight/2)*-1,
            MaxY:this.winHeight/2+selfHeight/2
       });
       var randomPosX=Math.round(Math.random()*(this.Pos.MaxX-this.Pos.MinX)+this.Pos.MinX);
        var randomPosY=Math.round(Math.random()*(this.Pos.MaxY-this.Pos.MinY)+this.Pos.MinY);
        this.node.setPosition(randomPosX,this.Pos.MinY);
        var time=(Math.random()*30+5.0+GameConfig.Game_NUMBER)/3.0//3-6
        var finished = cc.callFunc(function() {
            //销毁
            this.node.destroy();
        }, this, 100);
        var action=cc.sequence(cc.moveTo(time,randomPosX,this.Pos.MaxY),cc.fadeOut(1),finished);
        this.node.runAction(action);
        var canva=cc.find("Canvas");
        this.touchmanager=canva.getComponent("TouchManager");   
     },
     killwarm:function(){
         if(this.flag){
            this.node.stopAllActions();
            this.getComponent(cc.Animation).stop();
            this.getComponent(cc.Sprite).spriteFrame=this.bloodsprite;
            this.scheduleOnce(function() {
                this.node.destroy();  
            }, 1);
            this.flag=false;
            GameConfig.KILL_NUMBER+=1;
            if(GameConfig.KILLWARM){
                this.touchmanager.collectenergynum+=1;
            }
            var number=GameConfig.TARGET_NUMBER;
            LevelManager.NextLevel(GameConfig.KILL_NUMBER,number,GameConfig.LEVEL_NUMBER);
            var scene = cc.director.getScene();
            var name=scene.name;
            if(name!=="game5"){
                if(LevelManager.NextGame()&&GameConfig.SCENCE_UNLOCK){
                    GameConfig.SCENCE_UNLOCK=false;
                    var title=cc.find("Canvas/title");
                    title.active=true;
                    GameConfig.Game_NUMBER+=1;
                    setTimeout(function(){
                      title.active=false;
                    },1000);
                } 
            }  
         }   
     },
     update (dt) { 
         //杀虫剂出现
         if(GameConfig.INSECTICIDE){
            this.node.stopAllActions();
            this.getComponent(cc.Animation).stop();
            this.getComponent(cc.Sprite).spriteFrame=this.bloodsprite;
            this.scheduleOnce(function() {
                this.node.destroy();
            }, 1);
         }
         if(GameConfig.BOX_RECT&&GameConfig.IS_TOUCH){
            if(cc.rectIntersectsRect(this.node.getBoundingBoxToWorld(), GameConfig.BOX_RECT)){
                if(GameConfig.isclickkill){
                    this.killwarm();
                }
             }
         } 
         if(this.border&&!GameConfig.IS_OVER){
            if(cc.rectIntersectsRect(this.node.getBoundingBoxToWorld(),this.border.getBoundingBoxToWorld())){
                this.touchmanager.collectenergynum=0;
                LevelManager.GameOver(GameConfig.KILL_NUMBER,GameConfig.TARGET_NUMBER);
            } 
         }  
     },
});
