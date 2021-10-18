// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameTool=require("GameTool");
var GameConfig=require("GameConfig");
cc.Class({
    extends: cc.Component,

    properties: {
       levels:{
           default:[],
           type:cc.Node
       },
       lockImg:cc.SpriteFrame
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        cc.director.preloadScene("game1", function () {
            cc.log("Next scene preloaded");
        });
         for(var i=0;i<this.levels.length;i++){
            var name="level"+(i+1);
            GameTool.setButtonClickEvents(this,this.levels[i],"choose","ChooseLevel",name);
         }
     },
     start(){
         if(GameConfig.Game_NUMBER===0){
             return;
         }
         if(GameConfig.Game_NUMBER<=1){
            this.levels[1].color=cc.Color.WHITE;
            this.levels[1].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            return;
         }
         if(GameConfig.Game_NUMBER<=2){
            this.levels[1].color=cc.Color.WHITE;
            this.levels[2].color=cc.Color.WHITE;
            this.levels[1].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            this.levels[2].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            return;
         }
         if(GameConfig.Game_NUMBER<=3){
            this.levels[1].color=cc.Color.WHITE;
            this.levels[2].color=cc.Color.WHITE;
            this.levels[3].color=cc.Color.WHITE;
            this.levels[1].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            this.levels[2].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            this.levels[3].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            return;
         }
         if(GameConfig.Game_NUMBER<=4){
            this.levels[1].color=cc.Color.WHITE;
            this.levels[2].color=cc.Color.WHITE;
            this.levels[3].color=cc.Color.WHITE;
            this.levels[4].color=cc.Color.WHITE;
            this.levels[1].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            this.levels[2].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            this.levels[3].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            this.levels[4].getChildByName("level").getComponent(cc.Sprite).spriteFrame=this.lockImg;
            return;
         }
     },
     choose:function(event,customEventData){
        if(customEventData==="level1"){
            cc.director.loadScene("game1");
        }else if(customEventData==="level2"&&GameConfig.Game_NUMBER>=1){
            cc.director.loadScene("game2");
        }else if(customEventData==="level3"&&GameConfig.Game_NUMBER>=2){
            cc.director.loadScene("game3");
        }else if(customEventData==="level4"&&GameConfig.Game_NUMBER>=3){
            cc.director.loadScene("game4");
        }else if(customEventData==="level5"&&GameConfig.Game_NUMBER>=4){
            cc.director.loadScene("game5");
        }
     },
});
