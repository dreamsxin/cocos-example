// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var GameConfig=require("GameConfig");
cc.Class({
    extends: cc.Component,

    properties: {
       progressBar:cc.ProgressBar,
       whilte:cc.Node,
       endposX:500,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      this.handle=this.node.getChildByName("Handle");
      this.handleX=this.handle.x;
    },

   updatepress:function(num){
    
     if(num>=1){
       num=1;
     }else if(num<=0){
      num=0;
     }
      var slider=this.getComponent(cc.Slider);
      slider.progress=num;
        var posX=num/0.1*100;
        this.handle.setPositionX(this.handleX+posX);
      this.progressBar.progress=slider.progress;  
   },
   showwhilte:function(num){
     GameConfig.INSECTICIDE=true;
     var self=this;
     self.whilte.active=true;
     self.callback=function(){
       if(num>0){
         num-=2;
         self.updatepress(num/GameConfig.COLLECTENERGY_NUMBER);
       }else{
         self.unschedule(self.callback);
         GameConfig.INSECTICIDE=false;
         GameConfig.IS_DAOJU=true;
         self.whilte.active=false;
       }
     }
     self.schedule(self.callback,0.1);
   },
});
