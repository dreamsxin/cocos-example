
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Fruit.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcRnJ1aXQuanMiXSwibmFtZXMiOlsiY2MiLCJDbGFzcyIsIkNvbXBvbmVudCIsInByb3BlcnRpZXMiLCJpZCIsImluaXQiLCJkYXRhIiwic3AiLCJub2RlIiwiZ2V0Q29tcG9uZW50IiwiU3ByaXRlIiwic3ByaXRlRnJhbWUiLCJpY29uU0YiLCJzdGFydCIsIm9uQmVnaW5Db250YWN0IiwiY29udGFjdCIsInNlbGYiLCJvdGhlciIsInMiLCJvIiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1JDLElBQUFBLEVBQUUsRUFBRTtBQURJLEdBSFA7QUFNTEMsRUFBQUEsSUFOSyxnQkFNQUMsSUFOQSxFQU1NO0FBQ1AsU0FBS0YsRUFBTCxHQUFVRSxJQUFJLENBQUNGLEVBQWY7QUFDQSxRQUFNRyxFQUFFLEdBQUcsS0FBS0MsSUFBTCxDQUFVQyxZQUFWLENBQXVCVCxFQUFFLENBQUNVLE1BQTFCLENBQVg7QUFDQUgsSUFBQUEsRUFBRSxDQUFDSSxXQUFILEdBQWlCTCxJQUFJLENBQUNNLE1BQXRCLENBSE8sQ0FJUDtBQUNILEdBWEk7QUFZTEMsRUFBQUEsS0FaSyxtQkFZRyxDQUNaO0FBQ0E7QUFDQTtBQUNLLEdBaEJJO0FBaUJMQyxFQUFBQSxjQWpCSywwQkFpQlVDLE9BakJWLEVBaUJtQkMsSUFqQm5CLEVBaUJ5QkMsS0FqQnpCLEVBaUJnQztBQUNqQztBQUNBLFFBQUlELElBQUksQ0FBQ1IsSUFBTCxJQUFhUyxLQUFLLENBQUNULElBQXZCLEVBQTZCO0FBQ3pCLFVBQU1VLENBQUMsR0FBR0YsSUFBSSxDQUFDUixJQUFMLENBQVVDLFlBQVYsQ0FBdUIsT0FBdkIsQ0FBVjtBQUNBLFVBQU1VLENBQUMsR0FBR0YsS0FBSyxDQUFDVCxJQUFOLENBQVdDLFlBQVgsQ0FBd0IsT0FBeEIsQ0FBVjs7QUFDQSxVQUFJUyxDQUFDLElBQUlDLENBQUwsSUFBVUQsQ0FBQyxDQUFDZCxFQUFGLEtBQVNlLENBQUMsQ0FBQ2YsRUFBekIsRUFBNkI7QUFDekJZLFFBQUFBLElBQUksQ0FBQ1IsSUFBTCxDQUFVWSxJQUFWLENBQWUsYUFBZixFQUE4QjtBQUFDSixVQUFBQSxJQUFJLEVBQUpBLElBQUQ7QUFBT0MsVUFBQUEsS0FBSyxFQUFMQTtBQUFQLFNBQTlCO0FBQ0g7QUFDSjtBQUNKO0FBMUJJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGlkOiAwLFxuICAgIH0sXG4gICAgaW5pdChkYXRhKSB7XG4gICAgICAgIHRoaXMuaWQgPSBkYXRhLmlkXG4gICAgICAgIGNvbnN0IHNwID0gdGhpcy5ub2RlLmdldENvbXBvbmVudChjYy5TcHJpdGUpXG4gICAgICAgIHNwLnNwcml0ZUZyYW1lID0gZGF0YS5pY29uU0ZcbiAgICAgICAgLy8gdG9kbyDmjqfliLbkuIDkuIvmr4/np43msLTmnpznmoTlsLrlr7hcbiAgICB9LFxuICAgIHN0YXJ0KCkge1xuLy/nibkt5Lu3OS455YWDLS3kuIDlpZctY29jb3NjcmVhdG9y5LujLeeggS3ogZQt57O7LVEtMjQ4MzM2NzA4NCBcbi8v5omA5pyJ5ri45oiP5YiX6KGoIOmTvuaOpe+8mmh0dHBzOi8vcGFuLmJhaWR1LmNvbS9zLzFsSkJndXRwRkhaSkdOYWFyUlFGLUNnIFxuLy/mj5Dlj5bnoIHvvJoxMTExXG4gICAgfSxcbiAgICBvbkJlZ2luQ29udGFjdChjb250YWN0LCBzZWxmLCBvdGhlcikge1xuICAgICAgICAvLyDosozkvLzmo4DmtYvmnInngrnmtojogJfmgKfog71cbiAgICAgICAgaWYgKHNlbGYubm9kZSAmJiBvdGhlci5ub2RlKSB7XG4gICAgICAgICAgICBjb25zdCBzID0gc2VsZi5ub2RlLmdldENvbXBvbmVudCgnRnJ1aXQnKVxuICAgICAgICAgICAgY29uc3QgbyA9IG90aGVyLm5vZGUuZ2V0Q29tcG9uZW50KCdGcnVpdCcpXG4gICAgICAgICAgICBpZiAocyAmJiBvICYmIHMuaWQgPT09IG8uaWQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLm5vZGUuZW1pdCgnc2FtZUNvbnRhY3QnLCB7c2VsZiwgb3RoZXJ9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG59KTtcbiJdfQ==