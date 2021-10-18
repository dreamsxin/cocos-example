"use strict";
cc._RF.push(module, '56c1eHSOMxI0L+m6MX8FMXw', 'Juice');
// scripts/Juice.js

"use strict";

var RandomInteger = function RandomInteger(e, t) {
  return Math.floor(Math.random() * (t - e) + e);
}; //特-价9.9元--一套-cocoscreator代-码-联-系-Q-2483367084 
//所有游戏列表 链接：https://pan.baidu.com/s/1lJBgutpFHZJGNaarRQF-Cg 
//提取码：1111


cc.Class({
  "extends": cc.Component,
  properties: {
    particle: {
      "default": null,
      type: cc.SpriteFrame
    },
    circle: {
      "default": null,
      type: cc.SpriteFrame
    },
    slash: {
      "default": null,
      type: cc.SpriteFrame
    }
  },
  init: function init(data) {
    this.particle = data.particle;
    this.circle = data.particle;
    this.slash = data.slash;
  },
  // 合并时的动画效果
  showJuice: function showJuice(pos, width) {
    var _this = this;

    var _loop = function _loop(i) {
      var node = new cc.Node('Sprite');
      var sp = node.addComponent(cc.Sprite);
      sp.spriteFrame = _this.particle;
      node.parent = _this.node;
      var a = 359 * Math.random(),
          i = 30 * Math.random() + width / 2,
          l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
      node.scale = .5 * Math.random() + width / 100;
      var p = .5 * Math.random();
      node.position = pos;
      node.runAction(cc.sequence(cc.spawn(cc.moveBy(p, l), cc.scaleTo(p + .5, .3), cc.rotateBy(p + .5, RandomInteger(-360, 360))), cc.fadeOut(.1), cc.callFunc(function () {
        node.active = false;
      }, _this)));
    };

    // 果粒
    for (var i = 0; i < 10; ++i) {
      _loop(i);
    } // 水珠


    var _loop2 = function _loop2(f) {
      var node = new cc.Node('Sprite');
      var sp = node.addComponent(cc.Sprite);
      sp.spriteFrame = _this.circle;
      node.parent = _this.node;
      var a = 359 * Math.random(),
          i = 30 * Math.random() + width / 2,
          l = cc.v2(Math.sin(a * Math.PI / 180) * i, Math.cos(a * Math.PI / 180) * i);
      node.scale = .5 * Math.random() + width / 100;
      var p = .5 * Math.random();
      node.position = pos;
      node.runAction(cc.sequence(cc.spawn(cc.moveBy(p, l), cc.scaleTo(p + .5, .3)), cc.fadeOut(.1), cc.callFunc(function () {
        node.active = false;
      }, _this)));
    };

    for (var f = 0; f < 20; f++) {
      _loop2(f);
    } // 果汁


    var node = new cc.Node('Sprite');
    var sp = node.addComponent(cc.Sprite);
    sp.spriteFrame = this.slash;
    node.parent = this.node;
    node.position = pos;
    node.scale = 0;
    node.angle = RandomInteger(0, 360);
    node.runAction(cc.sequence(cc.spawn(cc.scaleTo(.2, width / 150), cc.fadeOut(1)), cc.callFunc(function () {
      node.active = false;
    })));
  }
});

cc._RF.pop();