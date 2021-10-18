var hero2 = require("HeroPlayer");//引用玩家的操作脚本

cc.Class({

        extends: cc.Component,

        properties: {

            times: 0,//控制时间

            // 碰撞音效资源
            pengAudio: {

                default: null,

                url: cc.AudioClip

            },

        },

        onLoad: function () {

            this.moveRight();

            cc.audioEngine.setEffectsVolume ( 0.2 );//设置音效声音大小
        },

        //左右移动
        moveRight: function(){
    
            var seq = cc.repeatForever( 
                cc.sequence( cc.moveBy(this.times, cc.v2(240, 0)), cc.moveBy(this.times, cc.p(-240,0)) )
            );

            this.node.runAction(seq);

        },

        //当前节点世界坐标系下的范围包围盒
        noteBox: function(){
            return this.node.getBoundingBoxToWorld();
        },  

        // called every frame, uncomment this function to activate update callback
        update: function (dt) {

            var _label = cc.find("Canvas/hero").getComponent(hero2);

            //障碍物碰撞框
            if(_label.node.getBoundingBoxToWorld().intersects(this.noteBox())){
                cc.eventManager.removeAllListeners();//移除所有事件监听
            }

        },

});