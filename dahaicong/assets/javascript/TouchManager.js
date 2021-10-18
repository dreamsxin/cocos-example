
var GameConfig=require("GameConfig");
var GameTool=require("GameTool");
var globalSelf=null;
cc.Class({
    extends: cc.Component,
    properties: {
       道具框:cc.Node,
       道具:cc.Node,
       道具名:cc.Node,
       toolBoxUp:cc.Node,
       bg:cc.Node,
       warmArray:{
           default:[],
           type:cc.Prefab
       },//虫子数量
       killnumber:cc.Label,//击杀数
       saving:cc.Node,
       TimeOver:false,
       inOnlyone:true,
       targetNum:cc.Label,
       startenergy:true,
       strartenergynum:0,
       collectenergynum:0,
       energyimage:cc.SpriteFrame,
       energyimage1:cc.SpriteFrame,
       //通过射线实现切水果功能
        startpoint:cc.Vec2,
        lastpoint:cc.Vec2,
    },
    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
    },
    start(){
        this.targetNum.string=GameConfig.TARGET_NUMBER;
        this.click=false;
        globalSelf=this;
        GameTool.setButtonClickEvents(this,this.toolBoxUp,"down","TouchManager");
        this.node.on('touchstart', globalSelf.onTouchDown);
        this.node.on('touchmove', globalSelf.onTouchMove);
        this.node.on('touchend', globalSelf.onTouchUp);
        this.node.on('touchcancel', globalSelf.onTouchUp);
        this.showwarm();
    },
    down:function(event,customEventData){
        this.click=!this.click;
      if(this.click){
        var height=this.道具框.getContentSize().height;
        var y=height*-1;
        var action = cc.moveBy(0.2,0,y);
        this.道具框.runAction(action);
      }else{
        var height=this.道具框.getContentSize().height;
        var action = cc.moveBy(0.2,0,height);
        this.道具框.runAction(action);
      }
    },
   //射线
   raycase:function(p1,p2){
    var results = cc.director.getPhysicsManager().rayCast(p1, p2, cc.RayCastType.Any);
    for (var i = 0; i < results.length; i++) {
        var result = results[i];
        var collider = result.collider;
        collider.node.getComponent("WormMove").killwarm();
    }
   },
    onTouchMove:function(event){
        if(globalSelf.道具&&!GameConfig.IS_DAOJU&&!GameConfig.IS_OVER){
            var name=globalSelf.道具.getComponent(cc.Sprite).spriteFrame.name;
            var touchpos=event.getLocation();
            var pos1=this.convertToNodeSpaceAR(touchpos);
             globalSelf.道具.setPosition(pos1);
             globalSelf.lastpoint=touchpos;
             //射线
             if(name==="dao"){
                globalSelf.raycase(cc.p(globalSelf.startpoint), cc.p(globalSelf.lastpoint));
             }
             //绘画功能
            //  if(globalSelf.inOnlyone&&name==="paper"){
            //     globalSelf.scheduleOnce(function(){
            //         globalSelf.TimeOver=true;
            //         globalSelf.inOnlyone=false;
            //         globalSelf.scheduleOnce(function(){
            //             var Glapics=cc.find("Canvas/Glapics");
            //             var ctx=Glapics.getComponent(cc.Graphics);
            //             ctx.clear();
            //         },0.1);  
            //      },0.2);
            //  }
            // if(name==="paper"&&!globalSelf.TimeOver){
                // var touchpos=event.getLocation();
                // var pos1=this.convertToNodeSpaceAR(touchpos);
                //  globalSelf.道具.setPosition(pos1);
            //     var touchpos=event.getLocation();
            //     this.points.push(touchpos);
            //     if (this.points.length <= 1) {
            //          return;
            //     }
            //     //this.ctx.clear();
            //     var lastPoint = this.points[0];
            //     this.ctx.moveTo(lastPoint.x, lastPoint.y);
            //     for (var i = 1, ii = this.points.length; i < ii; i++) {
            //         var point = this.points[i];
            //         this.ctx.bezierCurveTo(lastPoint.x, lastPoint.y, point.x, point.y, point.x, point.y);
            //         lastPoint = point;
            //     }
            //         this.ctx.stroke();
            // }
        }  
    },
     onTouchDown:function(event) {
         if(globalSelf.道具&&!GameConfig.IS_DAOJU&&!GameConfig.IS_OVER){
             GameConfig.IS_TOUCH=true;
            globalSelf.道具.setScale(1);
            var width=globalSelf.道具.getContentSize().width;
            var height=globalSelf.道具.getContentSize().height;
            var touchpos=event.getLocation();
            var pos1=this.convertToNodeSpaceAR(touchpos);
            var posX=pos1.x;
           //画Graphics
            var name=globalSelf.道具.getComponent(cc.Sprite).spriteFrame.name;
            if(name==="shoes"||name==="paizi"){
               GameConfig.isclickkill=true;
            }
             if(name==="dao"){
                globalSelf.道具.getComponent(cc.MotionStreak).reset();
                globalSelf.startpoint=touchpos;
            //     var Glapics=cc.find("Canvas/Glapics");
            //     this.ctx=Glapics.getComponent(cc.Graphics);
            //     this.points = [touchpos];
            //     globalSelf.TimeOver=false;
            //     globalSelf.inOnlyone=true;
             }
            globalSelf.道具.setPosition(posX,pos1.y);
            var boxs=globalSelf.道具.getChildByName("pai").getBoundingBoxToWorld();
            // var boxs=globalSelf.道具.getBoundingBoxToWorld();
             GameConfig.BOX_RECT=boxs;
            var toolBoxUp=globalSelf.道具框.getChildByName("toolBoxUp");
            var toolheight=toolBoxUp.getContentSize().height;
            var newRect = globalSelf.道具框.getBoundingBoxToWorld();
            newRect.height=newRect.height-toolheight;
            newRect=cc.rect(newRect.x,newRect.y,newRect.width,newRect.height);
            if(cc.rectIntersectsRect(newRect,boxs)&&!globalSelf.click){
                GameConfig.IS_DAOJU=true;
                var Prop=cc.find("Canvas/box/properties/"+globalSelf.道具名.name);
                globalSelf.道具.parent=Prop;
                globalSelf.道具.setPosition(80,0);  
                globalSelf.道具.parent.getComponent("PropManager").OpenNode();
                globalSelf.道具=null;
            }
         }
    },
    onTouchUp:function(event){
        GameConfig.IS_TOUCH=false;
        GameConfig.isclickkill=false;
        globalSelf.killnumber.string=GameConfig.KILL_NUMBER;
        var number=GameConfig.KILL_NUMBER;
        var number1=globalSelf.collectenergynum;
        if(number1<=GameConfig.COLLECTENERGY_NUMBER&&GameConfig.KILLWARM){
            if(globalSelf.startenergy){
                globalSelf.startenergy=false;
                globalSelf.strartenergynum=GameConfig.KILL_NUMBER;
            }
            number-=globalSelf.strartenergynum;
           var energy=globalSelf.saving.getComponent("Energy");
           energy.updatepress(number/GameConfig.COLLECTENERGY_NUMBER);
           if(number===GameConfig.COLLECTENERGY_NUMBER){
                var Prop=cc.find("Canvas/box/properties/杀虫剂");
               var daoji=Prop.getChildByName("道具");
               daoji.getComponent(cc.Sprite).spriteFrame=globalSelf.energyimage;
           }
        }   
    },
    //随机出现害虫
    showwarm:function(){
        var time=1-GameConfig.Game_NUMBER/10;
        this.schedule(function() {
            warm();
        }, time);
        function warm(){
            if(!GameConfig.IS_OVER){
                var randomnumbers=Math.floor(Math.random()*globalSelf.warmArray.length);
                var newNode=cc.instantiate(globalSelf.warmArray[randomnumbers]);
                 newNode.parent=globalSelf.bg;
            }
        }
    },   
});
