//GAME.js
var HeroPlayer = require("HeroPlayer");
var MoveBg = require('BgMove');
var bgmu = require('Audio');


cc.Class({

    extends: cc.Component,

    properties: {



        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关

        player: {

            default: null,

            type: cc.Node

        },

        // bgsprite1 节点，用于背景移动

        bgsprite1: {

            default: null,

            type: cc.Node

        },

        // bgsprite2 节点，用于背景移动

        bgsprite2: {

            default: null,

            type: cc.Node

        },

        // score label 的引用

        scoreDisplay: {

            default: null,

            type: cc.Label

        },

        // 背景音乐资源
        bgmusic: {

            default: null,

            type: cc.Node

        },

        // 游戏音乐资源
        gameAudio: {

            default: null,

            url: cc.AudioClip

        },

        // 游戏结束音乐资源
        gameOverAudio: {

            default: null,

            url: cc.AudioClip

        },

    },

    //事件监听
    setEventControl: function(){

        var self = this;

        var hero = self.player.getComponent(HeroPlayer);//角色绑定控件

        var bg1 = self.bgsprite1.getComponent(MoveBg);//绑定背景控件

        var bg2 = self.bgsprite2.getComponent(MoveBg);//绑定背景控件

        var mus = self.bgmusic.getComponent(bgmu);

        cc.eventManager.addListener({

            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            swallowTouches: true,

            // 设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞没

            onTouchBegan: function (touch, event) {

                //实现 onTouchBegan 事件回调函数

                var target = event.getCurrentTarget();

                // 获取事件所绑定的 target

                var locationInNode = target.convertToNodeSpace(touch.getLocation());

                cc.log("当前点击坐标"+locationInNode);

                mus.setCp(touch.getLocation());
      
                hero.node.runAction(hero.setJumpUpAction());//精灵移动

                cc.log("跳跃：－－－－－－－－");

                 return true;
            },


            onTouchMoved: function (touch, event) {            // 触摸移动时触发



            },

             onTouchEnded: function (touch, event) {            // 点击事件结束处理
                
                if(self.player.y > 0){
                    var height = self.player.y;//背景需要移动的高度
                    
                    self.player.y = height/2;//设置精灵的高度位置

                    self.gainScore();  //积分更新

                    bg1.node.runAction(bg1.setMoveAction(height));//背景实现向下滚动
                    
                    bg2.node.runAction(bg2.setMoveAction(height));//背景实现向下滚动
                }

                //  cc.log("跳跃后角色坐标：" + self.player.getPosition() );

            }



        }, self.node);

    },


    //如果背景1的坐标移出屏幕开始设置新的坐标

    setBgMoveCreate: function(){

        //如果背景1的坐标移出屏幕开始设置新的坐标

        if(this.bgsprite1.y  < -500 ){

            this.bgsprite2.y = this.bgsprite1.y+this.bgsprite1.getContentSize().height;

        }

        //如果背景2的坐标移出屏幕开始设置新的坐标

        if(this.bgsprite2.y < -500 ){

            this.bgsprite1.y = this.bgsprite2.y+this.bgsprite2.getContentSize().height;

        }

    },

    //gameover方法 然后在update实现gameover判断
    gameOver: function () {

        cc.eventManager.removeAllListeners();//移除所有事件监听

        this.player.stopAllActions(); //停止 player 节点的跳跃动作

        cc.director.loadScene("GameOver");//切换场景到结束场景

    },

    //积分更新
    gainScore: function () {

        this.score += 1;

        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string =  this.score.toString();

        cc.sys.localStorage.setItem("ScoreDis" ,this.scoreDisplay.string);//本地存储

    },


    onLoad: function () {
    
        //触摸监听
        this.setEventControl();
    
        // 初始化计分
        this.score = 0;

        //添加判断
        this.isMoving = true;
    
    },

    //实现update方法
    update: function (dt) {

        this.setBgMoveCreate(); //检测背景

        //gameOver判断 玩家坠落到屏幕底部游戏结束
        if (this.player.getPositionY() <= -cc.view.getVisibleSize().height / 2) {
            this.unscheduleAllCallbacks();
            cc.audioEngine.playEffect(this.gameOverAudio, false); //游戏结束音乐

            if (this.isMoving) {
                this.gameOver();
                this.isMoving = false;
            }

        }
        //判断音效
        if (this.bgmusic.getComponent(bgmu).isOpen) {
            cc.log("恢复现在正在播放的所有音效");
            cc.audioEngine.resumeAllEffects() //恢复播放所有之前暂停的所有音效

        } else {
            cc.log("暂停现在正在播放的所有音效");
            cc.audioEngine.pauseAllEffects() //恢复播放所有之前暂停的所有音效

        }
    },

});