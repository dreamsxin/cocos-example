var GameConfig=require("GameConfig");
var LevelManager={
    NextLevel:function(killnumber,targetnumber,levelnumber){
        if(killnumber>=targetnumber){
            levelnumber+=1;
            targetnumber+=levelnumber*10;
            GameConfig.TARGET_NUMBER=targetnumber;
            var level=cc.find("Canvas/level");
            level.getComponent(cc.Label).string="关卡"+levelnumber;
            GameConfig.LEVEL_NUMBER=levelnumber;
            level.active=true;
            GameConfig.IS_OVER=true;
            var bg=cc.find("Canvas/bg");
            var child=bg.children; 
            for(var i=0;i<child.length;i++){
                child[i].destroy();
            }
            var timeId=setTimeout(function(){
                level.active=false;
                var target=cc.find("Canvas/target");
                target.getChildByName("targetnum").getComponent(cc.Label).string=targetnumber;
                target.getComponent(cc.Animation).play("targetLabel");
                GameConfig.IS_OVER=false;
            },1000);
        }
    },
    GameOver:function(killnumber,targetnumber){
            var gameover=cc.find("Canvas/gameOver");
            gameover.active=true;
            GameConfig.IS_OVER=true;
            var bg=cc.find("Canvas/bg");
            var child=bg.children; 
            for(var i=0;i<child.length;i++){
                child[i].active=false;
            }   
    },
    //杀死多少只害虫解锁
    NextGame:function(){
        var targetnumber=80*(GameConfig.Game_NUMBER+1);
        if(GameConfig.KILL_NUMBER>targetnumber){
            return true;
        }else{
            return false;
        }
    },
};
module.exports=LevelManager;