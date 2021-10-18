"use strict";
cc._RF.push(module, '365b4UAiQRBA7QXa2IuFMmj', 'Fruit');
// scripts/Fruit.js

"use strict";

cc.Class({
  "extends": cc.Component,
  properties: {
    id: 0
  },
  init: function init(data) {
    this.id = data.id;
    var sp = this.node.getComponent(cc.Sprite);
    sp.spriteFrame = data.iconSF; // todo 控制一下每种水果的尺寸
  },
  start: function start() {//特-价9.9元--一套-cocoscreator代-码-联-系-Q-2483367084 
    //所有游戏列表 链接：https://pan.baidu.com/s/1lJBgutpFHZJGNaarRQF-Cg 
    //提取码：1111
  },
  onBeginContact: function onBeginContact(contact, self, other) {
    // 貌似检测有点消耗性能
    if (self.node && other.node) {
      var s = self.node.getComponent('Fruit');
      var o = other.node.getComponent('Fruit');

      if (s && o && s.id === o.id) {
        self.node.emit('sameContact', {
          self: self,
          other: other
        });
      }
    }
  }
});

cc._RF.pop();