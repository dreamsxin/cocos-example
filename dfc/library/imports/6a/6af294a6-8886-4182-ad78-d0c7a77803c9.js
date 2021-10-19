"use strict";
cc._RF.push(module, '6af29SmiIZBgq140MeneAPJ', 'Star');
// scripts/Star.js

"use strict";

cc.Class({
  extends: cc.Component,
  properties: {
    xSpeed: 0, //X轴速度
    ySpeed: -20, //Y轴速度
    width: 300, //初始化飞碟宽度
    height: 76, //初始化飞碟高度
    timeer: 0, //变换时间
    time: 0, //变换次数
    guans: 1, //关数
    isTouch: false, //是否点击
    listener: { //监听
      default: null
    },
    game: { //关联游戏js文件
      default: null
    }
  },
  onLoad: function onLoad() {
    var self = this;
    var cd = 0;
    if (self.game.Calculate != 1) {
      cd = -237 + (self.game.Calculate - 1) * 48;
    } else {
      cd = -237;
    }
    this.listener = {
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      onTouchBegan: function onTouchBegan(touch, event) {
        // var target = event.getCurrentTarget();
        // var locationInNode = target.convertToNodeSpace(touch.getLocation());
        //var size = target.getContentSize();
        //var rect = cc.rect(2, 0, size.width, size.height); 
        //if (!cc.rectContainsPoint(rect, locationInNode))
        if (self.node.y < cd) {
          return false;
        } else {
          self.node.x = 2;
          if (self.game.Calculate != 1) {
            self.node.y = -237 + (self.game.Calculate - 1) * 46;
          } else {
            self.node.y = -237;
          }
          return true;
        }
      },
      onTouchMoved: function onTouchMoved(touch, event) {},
      onTouchEnded: function onTouchEnded(touch, event) {}
    };
    cc.eventManager.addListener(self.listener, self.node);
  },
  init: function init(game) {
    this.game = game;
  },
  start: function start() {},
  update: function update(dt) {
    if (this.node.y < 220) {
      this.ySpeed = -50;
    }
    if (this.node.y < 100) {
      this.ySpeed = -200;
    }
    var cd = -237;
    if (this.game.Calculate != 1) {
      cd = -237 + (this.game.Calculate - 1) * 46;
    }
    if (this.node.y >= cd) {
      this.timeer = this.timeer + dt;
      if (this.timeer > 0.5 / this.guans) {
        this.timeer = 0;
        if (this.time > 8) {
          this.time = 0;
        }
        this.time = this.time + 1;
        this.node.width = this.width - 20 * this.time;
        this.node.height = this.height - 3 * this.time;
      }
      this.node.x += this.xSpeed * dt;
      this.node.y += this.ySpeed * dt;
    } else {
      if (this.isTouch == false && this.game.Calculate <= 6) {
        this.isTouch = true;
        if (this.game.finalWidth != 0 && this.node.width > this.game.finalWidth) {
          alert("对不起,你挂了");
        } else {
          if (this.game.Calculate != 6) {
            this.game.spawnNewStar();
          }
        }
        this.game.finalWidth = this.node.width;
      }
    }
  }
});

cc._RF.pop();