
var GameTool=require("GameTool");
var TouchManager=require("TouchManager");
var GameConfig=require("GameConfig");
cc.Class({
    extends: cc.Component,
    properties: {
        tool:cc.Node,
        
    },
     onLoad () {
        this.OpenNode();
     },
     OpenNode:function(){
        this.node.on('touchstart', this.onTouchDown,this);
        this.node.on('touchend', this.onTouchUp,this);
        this.node.on('touchcancel', this.onTouchUp,this);   
     },
     onTouchDown:function(event) {
         if(GameConfig.IS_DAOJU&&!GameConfig.IS_OVER){
         var target=event.target;
         var Prop=cc.find("Canvas/box/properties");
         var name=event.target.name;
         if(target.parent.name!=="properties"){
            switch(name){
                case "拍子":
                   target.parent=Prop;
                   break;
                case "人字拖":
                   target.parent=Prop;
                   break;
                case "报纸":
                   target.parent=Prop;
                   break;
                case "杀虫剂":
                   target.parent=Prop;
                   GameConfig.KILLWARM=true;
                   var saving=cc.find("Canvas/box/saving");
                   saving.active=true;
                   break;
                case "沾纸":
                   target.parent=Prop;
                   break;
             }   
            target.setPositionY(20);    
         }else{
            var canva=cc.find("Canvas");
            var pos=Prop.convertToWorldSpaceAR(target.getPosition());
            var child=target.getChildByName("道具");
            if(target.name==="人字拖"||target.name==="拍子"||target.name==="报纸"){
            child.parent=canva;
            var pos1=canva.convertToNodeSpaceAR(pos);
            var width=target.getContentSize().width;
            var posX=pos1.x+width/2;
            child.setPosition(posX,pos1.y);
             canva.getComponent(TouchManager).道具=child; 
            }
            this.tool=child;
           }  
        } 
     },
     onTouchUp:function(event){
        var target=event.target;
       if(this.tool){
        var child=this.tool;
        if(child.parent.name==="Canvas"){
            GameConfig.IS_DAOJU=false;
            //var child=target.getChildByName("道具");
            child.setScale(1.2);
            var canva=cc.find("Canvas");
            canva.getComponent(TouchManager).道具名=target;
            this.CloseNode();
        }else if(target.name==="杀虫剂"){
            var saving=cc.find("Canvas/box/saving");
            var slidernum=saving.getComponent(cc.Slider).progress;
            if(slidernum===1){
                GameConfig.IS_DAOJU=false;
                child.setScale(1);
                saving.getComponent("Energy").showwhilte(GameConfig.COLLECTENERGY_NUMBER);
                var canva=cc.find("Canvas");
                canva.getComponent(TouchManager).startenergy=true;
                canva.getComponent(TouchManager).collectenergynum=0;
                var daoju=target.getChildByName("道具");
                daoju.getComponent(cc.Sprite).spriteFrame=canva.getComponent(TouchManager).energyimage1;
            }
        }
       }   
     },
     //关闭监听
     CloseNode:function(){
        this.node.off('touchstart', this.onTouchDown,this);
        this.node.off('touchend', this.onTouchUp,this);
        this.node.off('touchcancel', this.onTouchUp,this);   
     },
});
