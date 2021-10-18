
var GameTool=require("GameTool");
var GameConfig=require("GameConfig");
cc.Class({
    extends: cc.Component,
    properties: {
       restart:cc.Node,
       back:cc.Node
    },
     onLoad () {
        var scene = cc.director.getScene();
        GameTool.setButtonClickEvents(this,this.restart,"restart1","GameOver",scene.name);
        GameTool.setButtonClickEvents(this,this.back,"back1","GameOver");
        var canva=cc.find("Canvas");
        this.touchmanager=canva.getComponent("TouchManager");   
     },
     restart1:function(event,customEventData){
        this.touchmanager.collectenergynum=0;
        GameConfig.resore();
        if(customEventData==="game1"){
            cc.director.loadScene("game1"); 
        }else if(customEventData==="game2"){
            cc.director.loadScene("game2"); 
        }else if(customEventData==="game3"){
            cc.director.loadScene("game3"); 
        }else if(customEventData==="game4"){
            cc.director.loadScene("game4"); 
        }else if(customEventData==="game5"){
            cc.director.loadScene("game5"); 
        }
     },
     back1:function(){
        this.touchmanager.collectenergynum=0;
        GameConfig.resore();
        cc.director.loadScene("level"); 
     },
});
