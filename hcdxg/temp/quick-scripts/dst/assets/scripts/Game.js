
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '8e80dMWyH5LD7Oj100K42f8', 'Game');
// scripts/Game.js

"use strict";

var Fruit = cc.Class({
  name: 'FruitItem',
  properties: {
    id: 0,
    iconSF: cc.SpriteFrame
  }
}); //特-价9.9元--一套-cocoscreator代-码-联-系-Q-2483367084 
//所有游戏列表 链接：https://pan.baidu.com/s/1lJBgutpFHZJGNaarRQF-Cg 
//提取码：1111

var JuiceItem = cc.Class({
  name: 'JuiceItem',
  properties: {
    particle: cc.SpriteFrame,
    circle: cc.SpriteFrame,
    slash: cc.SpriteFrame
  }
});
cc.Class({
  "extends": cc.Component,
  properties: {
    fruits: {
      "default": [],
      type: Fruit
    },
    juices: {
      "default": [],
      type: JuiceItem
    },
    // 动态生成 找到批量处理预置元素的方案
    fruitPrefab: {
      "default": null,
      type: cc.Prefab
    },
    juicePrefab: {
      "default": null,
      type: cc.Prefab
    },
    // todo 可以实现一个audioManager
    boomAudio: {
      "default": null,
      type: cc.AudioClip
    },
    knockAudio: {
      "default": null,
      type: cc.AudioClip
    },
    waterAudio: {
      "default": null,
      type: cc.AudioClip
    }
  },
  onLoad: function onLoad() {
    this.initPhysics();
    this.isCreating = false;
    this.fruitCount = 0; // 监听点击事件 todo 是否能够注册全局事件

    this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    this.initOneFruit();
  },
  // 开启物理引擎和碰撞检测
  initPhysics: function initPhysics() {
    // 物理引擎
    var instance = cc.director.getPhysicsManager();
    instance.enabled = true; // instance.debugDrawFlags = 4

    instance.gravity = cc.v2(0, -960); // 碰撞检测

    var collisionManager = cc.director.getCollisionManager();
    collisionManager.enabled = true; // 设置四周的碰撞区域

    var width = this.node.width;
    var height = this.node.height;
    var node = new cc.Node();
    var body = node.addComponent(cc.RigidBody);
    body.type = cc.RigidBodyType.Static;

    var _addBound = function _addBound(node, x, y, width, height) {
      var collider = node.addComponent(cc.PhysicsBoxCollider);
      collider.offset.x = x;
      collider.offset.y = y;
      collider.size.width = width;
      collider.size.height = height;
    };

    _addBound(node, 0, -height / 2, width, 1);

    _addBound(node, 0, height / 2, width, 1);

    _addBound(node, -width / 2, 0, 1, height);

    _addBound(node, width / 2, 0, 1, height);

    node.parent = this.node;
  },
  initOneFruit: function initOneFruit(id) {
    if (id === void 0) {
      id = 1;
    }

    this.fruitCount++;
    this.currentFruit = this.createFruitOnPos(0, 400, id);
  },
  // 监听屏幕点击
  onTouchStart: function onTouchStart(e) {
    var _this = this;

    if (this.isCreating) return;
    this.isCreating = true;
    var _this$node = this.node,
        width = _this$node.width,
        height = _this$node.height;
    var fruit = this.currentFruit;
    var pos = e.getLocation();
    var x = pos.x,
        y = pos.y;
    x = x - width / 2;
    y = y - height / 2;
    var action = cc.sequence(cc.moveBy(0.3, cc.v2(x, 0)).easing(cc.easeCubicActionIn()), cc.callFunc(function () {
      // 开启物理效果
      _this.startFruitPhysics(fruit); // 1s后重新生成一个


      _this.scheduleOnce(function () {
        var nextId = _this.getNextFruitId();

        _this.initOneFruit(nextId);

        _this.isCreating = false;
      }, 1);
    }));
    fruit.runAction(action);
  },
  // 获取下一个水果的id
  getNextFruitId: function getNextFruitId() {
    if (this.fruitCount < 3) {
      return 1;
    } else if (this.fruitCount === 3) {
      return 2;
    } else {
      // 随机返回前5个
      return Math.floor(Math.random() * 5) + 1;
    }
  },
  // 创建一个水果
  createOneFruit: function createOneFruit(num) {
    var fruit = cc.instantiate(this.fruitPrefab);
    var config = this.fruits[num - 1];
    fruit.getComponent('Fruit').init({
      id: config.id,
      iconSF: config.iconSF
    });
    fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
    fruit.getComponent(cc.PhysicsCircleCollider).radius = 0;
    this.node.addChild(fruit);
    fruit.scale = 0.6; // 有Fruit组件传入

    fruit.on('sameContact', this.onSameFruitContact.bind(this));
    return fruit;
  },
  startFruitPhysics: function startFruitPhysics(fruit) {
    fruit.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic;
    var physicsCircleCollider = fruit.getComponent(cc.PhysicsCircleCollider);
    physicsCircleCollider.radius = fruit.height / 2;
    physicsCircleCollider.apply();
  },
  // 在指定位置生成水果
  createFruitOnPos: function createFruitOnPos(x, y, type) {
    if (type === void 0) {
      type = 1;
    }

    var fruit = this.createOneFruit(type);
    fruit.setPosition(cc.v2(x, y));
    return fruit;
  },
  // 两个水果碰撞
  onSameFruitContact: function onSameFruitContact(_ref) {
    var self = _ref.self,
        other = _ref.other;
    other.node.off('sameContact'); // 两个node都会触发，todo 看看有没有其他方法只展示一次的

    var id = other.getComponent('Fruit').id; // todo 可以使用对象池回收

    self.node.removeFromParent(false);
    other.node.removeFromParent(false);
    var _other$node = other.node,
        x = _other$node.x,
        y = _other$node.y;
    this.createFruitJuice(id, cc.v2({
      x: x,
      y: y
    }), other.node.width);
    var nextId = id + 1;

    if (nextId <= 11) {
      var newFruit = this.createFruitOnPos(x, y, nextId);
      this.startFruitPhysics(newFruit); // 展示动画 todo 动画效果需要调整

      newFruit.scale = 0;
      cc.tween(newFruit).to(.5, {
        scale: 0.6
      }, {
        easing: "backOut"
      }).start();
    } else {
      // todo 合成两个西瓜
      console.log(' todo 合成两个西瓜 还没有实现哦~ ');
    }
  },
  // 合并时的动画效果
  createFruitJuice: function createFruitJuice(id, pos, n) {
    // 播放合并的声音
    cc.audioEngine.play(this.boomAudio, false, 1);
    cc.audioEngine.play(this.waterAudio, false, 1); // 展示动画

    var juice = cc.instantiate(this.juicePrefab);
    this.node.addChild(juice);
    var config = this.juices[id - 1];
    var instance = juice.getComponent('Juice');
    instance.init(config);
    instance.showJuice(pos, n);
  }
}); //特价9.9元一套cocoscreator代码联系Q2483367084 
//截图 链接：https://share.weiyun.com/leGAHpnB 密码：b9udtv

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJGcnVpdCIsImNjIiwiQ2xhc3MiLCJuYW1lIiwicHJvcGVydGllcyIsImlkIiwiaWNvblNGIiwiU3ByaXRlRnJhbWUiLCJKdWljZUl0ZW0iLCJwYXJ0aWNsZSIsImNpcmNsZSIsInNsYXNoIiwiQ29tcG9uZW50IiwiZnJ1aXRzIiwidHlwZSIsImp1aWNlcyIsImZydWl0UHJlZmFiIiwiUHJlZmFiIiwianVpY2VQcmVmYWIiLCJib29tQXVkaW8iLCJBdWRpb0NsaXAiLCJrbm9ja0F1ZGlvIiwid2F0ZXJBdWRpbyIsIm9uTG9hZCIsImluaXRQaHlzaWNzIiwiaXNDcmVhdGluZyIsImZydWl0Q291bnQiLCJub2RlIiwib24iLCJOb2RlIiwiRXZlbnRUeXBlIiwiVE9VQ0hfU1RBUlQiLCJvblRvdWNoU3RhcnQiLCJpbml0T25lRnJ1aXQiLCJpbnN0YW5jZSIsImRpcmVjdG9yIiwiZ2V0UGh5c2ljc01hbmFnZXIiLCJlbmFibGVkIiwiZ3Jhdml0eSIsInYyIiwiY29sbGlzaW9uTWFuYWdlciIsImdldENvbGxpc2lvbk1hbmFnZXIiLCJ3aWR0aCIsImhlaWdodCIsImJvZHkiLCJhZGRDb21wb25lbnQiLCJSaWdpZEJvZHkiLCJSaWdpZEJvZHlUeXBlIiwiU3RhdGljIiwiX2FkZEJvdW5kIiwieCIsInkiLCJjb2xsaWRlciIsIlBoeXNpY3NCb3hDb2xsaWRlciIsIm9mZnNldCIsInNpemUiLCJwYXJlbnQiLCJjdXJyZW50RnJ1aXQiLCJjcmVhdGVGcnVpdE9uUG9zIiwiZSIsImZydWl0IiwicG9zIiwiZ2V0TG9jYXRpb24iLCJhY3Rpb24iLCJzZXF1ZW5jZSIsIm1vdmVCeSIsImVhc2luZyIsImVhc2VDdWJpY0FjdGlvbkluIiwiY2FsbEZ1bmMiLCJzdGFydEZydWl0UGh5c2ljcyIsInNjaGVkdWxlT25jZSIsIm5leHRJZCIsImdldE5leHRGcnVpdElkIiwicnVuQWN0aW9uIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiY3JlYXRlT25lRnJ1aXQiLCJudW0iLCJpbnN0YW50aWF0ZSIsImNvbmZpZyIsImdldENvbXBvbmVudCIsImluaXQiLCJQaHlzaWNzQ2lyY2xlQ29sbGlkZXIiLCJyYWRpdXMiLCJhZGRDaGlsZCIsInNjYWxlIiwib25TYW1lRnJ1aXRDb250YWN0IiwiYmluZCIsIkR5bmFtaWMiLCJwaHlzaWNzQ2lyY2xlQ29sbGlkZXIiLCJhcHBseSIsInNldFBvc2l0aW9uIiwic2VsZiIsIm90aGVyIiwib2ZmIiwicmVtb3ZlRnJvbVBhcmVudCIsImNyZWF0ZUZydWl0SnVpY2UiLCJuZXdGcnVpdCIsInR3ZWVuIiwidG8iLCJzdGFydCIsImNvbnNvbGUiLCJsb2ciLCJuIiwiYXVkaW9FbmdpbmUiLCJwbGF5IiwianVpY2UiLCJzaG93SnVpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTUEsS0FBSyxHQUFHQyxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNuQkMsRUFBQUEsSUFBSSxFQUFFLFdBRGE7QUFFbkJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSQyxJQUFBQSxFQUFFLEVBQUUsQ0FESTtBQUVSQyxJQUFBQSxNQUFNLEVBQUVMLEVBQUUsQ0FBQ007QUFGSDtBQUZPLENBQVQsQ0FBZCxFQU9BO0FBQ0E7QUFDQTs7QUFDQSxJQUFNQyxTQUFTLEdBQUdQLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ3ZCQyxFQUFBQSxJQUFJLEVBQUUsV0FEaUI7QUFFdkJDLEVBQUFBLFVBQVUsRUFBRTtBQUNSSyxJQUFBQSxRQUFRLEVBQUVSLEVBQUUsQ0FBQ00sV0FETDtBQUVSRyxJQUFBQSxNQUFNLEVBQUVULEVBQUUsQ0FBQ00sV0FGSDtBQUdSSSxJQUFBQSxLQUFLLEVBQUVWLEVBQUUsQ0FBQ007QUFIRjtBQUZXLENBQVQsQ0FBbEI7QUFTQU4sRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNXLFNBRFA7QUFHTFIsRUFBQUEsVUFBVSxFQUFFO0FBQ1JTLElB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QUFBQSxFQUFFLENBQUN3RyxXQUFILENBQWVDLElBQWYsQ0FBb0IsS0FBS3BGLFVBQXpCLEVBQXFDLEtBQXJDLEVBQTRDLENBQTVDLEVBSHlCLENBS3pCOztBQUNBLFFBQUlxRixLQUFLLEdBQUcxRyxFQUFFLENBQUM4RSxXQUFILENBQWUsS0FBSzdELFdBQXBCLENBQVo7QUFDQSxTQUFLUyxJQUFMLENBQVUwRCxRQUFWLENBQW1Cc0IsS0FBbkI7QUFFQSxRQUFNM0IsTUFBTSxHQUFHLEtBQUtqRSxNQUFMLENBQVlWLEVBQUUsR0FBRyxDQUFqQixDQUFmO0FBQ0EsUUFBTTZCLFFBQVEsR0FBR3lFLEtBQUssQ0FBQzFCLFlBQU4sQ0FBbUIsT0FBbkIsQ0FBakI7QUFDQS9DLElBQUFBLFFBQVEsQ0FBQ2dELElBQVQsQ0FBY0YsTUFBZDtBQUNBOUMsSUFBQUEsUUFBUSxDQUFDMEUsU0FBVCxDQUFtQi9DLEdBQW5CLEVBQXdCMkMsQ0FBeEI7QUFDSDtBQXJOSSxDQUFULEdBdU5BO0FBQ0EiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IEZydWl0ID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdGcnVpdEl0ZW0nLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIGljb25TRjogY2MuU3ByaXRlRnJhbWVcbiAgICB9XG59KTtcbi8v54m5LeS7tzkuOeWFgy0t5LiA5aWXLWNvY29zY3JlYXRvcuS7oy3noIEt6IGULeezuy1RLTI0ODMzNjcwODQgXG4vL+aJgOaciea4uOaIj+WIl+ihqCDpk77mjqXvvJpodHRwczovL3Bhbi5iYWlkdS5jb20vcy8xbEpCZ3V0cEZIWkpHTmFhclJRRi1DZyBcbi8v5o+Q5Y+W56CB77yaMTExMVxuY29uc3QgSnVpY2VJdGVtID0gY2MuQ2xhc3Moe1xuICAgIG5hbWU6ICdKdWljZUl0ZW0nLFxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcGFydGljbGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICBjaXJjbGU6IGNjLlNwcml0ZUZyYW1lLFxuICAgICAgICBzbGFzaDogY2MuU3ByaXRlRnJhbWUsXG4gICAgfVxufSk7XG5cbmNjLkNsYXNzKHtcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIGZydWl0czoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBGcnVpdCAgIH0sXG5cbiAgICAgIGp1aWNlczoge1xuICAgICAgICAgICAgZGVmYXVsdDogW10sXG4gICAgICAgICAgICB0eXBlOiBKdWljZUl0ZW1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyDliqjmgIHnlJ/miJAg5om+5Yiw5om56YeP5aSE55CG6aKE572u5YWD57Sg55qE5pa55qGIXG4gICAgICAgIGZydWl0UHJlZmFiOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXG4gICAgICAgIH0sXG5cbiAgICAgICAganVpY2VQcmVmYWI6IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcblxuICAgICAgICAvLyB0b2RvIOWPr+S7peWunueOsOS4gOS4qmF1ZGlvTWFuYWdlclxuICAgICAgICBib29tQXVkaW86IHtcbiAgICAgICAgICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BdWRpb0NsaXBcbiAgICAgICAgfSxcbiAgICAgICAga25vY2tBdWRpbzoge1xuICAgICAgICAgICAgZGVmYXVsdDogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9LFxuICAgICAgICB3YXRlckF1ZGlvOiB7XG4gICAgICAgICAgICBkZWZhdWx0OiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmluaXRQaHlzaWNzKClcblxuICAgICAgICB0aGlzLmlzQ3JlYXRpbmcgPSBmYWxzZVxuICAgICAgICB0aGlzLmZydWl0Q291bnQgPSAwXG5cbiAgICAgICAgLy8g55uR5ZCs54K55Ye75LqL5Lu2IHRvZG8g5piv5ZCm6IO95aSf5rOo5YaM5YWo5bGA5LqL5Lu2XG4gICAgICAgIHRoaXMubm9kZS5vbihjYy5Ob2RlLkV2ZW50VHlwZS5UT1VDSF9TVEFSVCwgdGhpcy5vblRvdWNoU3RhcnQsIHRoaXMpXG5cbiAgICAgICAgdGhpcy5pbml0T25lRnJ1aXQoKVxuICAgIH0sXG5cbiAgICAvLyDlvIDlkK/niannkIblvJXmk47lkoznorDmkp7mo4DmtYtcbiAgICBpbml0UGh5c2ljcygpIHtcbiAgICAgICAgLy8g54mp55CG5byV5pOOXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gY2MuZGlyZWN0b3IuZ2V0UGh5c2ljc01hbmFnZXIoKVxuICAgICAgICBpbnN0YW5jZS5lbmFibGVkID0gdHJ1ZVxuICAgICAgICAvLyBpbnN0YW5jZS5kZWJ1Z0RyYXdGbGFncyA9IDRcbiAgICAgICAgaW5zdGFuY2UuZ3Jhdml0eSA9IGNjLnYyKDAsIC05NjApO1xuXG4gICAgICAgIC8vIOeisOaSnuajgOa1i1xuICAgICAgICBjb25zdCBjb2xsaXNpb25NYW5hZ2VyID0gY2MuZGlyZWN0b3IuZ2V0Q29sbGlzaW9uTWFuYWdlcigpO1xuICAgICAgICBjb2xsaXNpb25NYW5hZ2VyLmVuYWJsZWQgPSB0cnVlXG5cbiAgICAgICAgLy8g6K6+572u5Zub5ZGo55qE56Kw5pKe5Yy65Z+fXG4gICAgICAgIGxldCB3aWR0aCA9IHRoaXMubm9kZS53aWR0aDtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMubm9kZS5oZWlnaHQ7XG5cbiAgICAgICAgbGV0IG5vZGUgPSBuZXcgY2MuTm9kZSgpO1xuXG4gICAgICAgIGxldCBib2R5ID0gbm9kZS5hZGRDb21wb25lbnQoY2MuUmlnaWRCb2R5KTtcbiAgICAgICAgYm9keS50eXBlID0gY2MuUmlnaWRCb2R5VHlwZS5TdGF0aWM7XG5cbiAgICAgICAgY29uc3QgX2FkZEJvdW5kID0gKG5vZGUsIHgsIHksIHdpZHRoLCBoZWlnaHQpID0+IHtcbiAgICAgICAgICAgIGxldCBjb2xsaWRlciA9IG5vZGUuYWRkQ29tcG9uZW50KGNjLlBoeXNpY3NCb3hDb2xsaWRlcik7XG4gICAgICAgICAgICBjb2xsaWRlci5vZmZzZXQueCA9IHg7XG4gICAgICAgICAgICBjb2xsaWRlci5vZmZzZXQueSA9IHk7XG4gICAgICAgICAgICBjb2xsaWRlci5zaXplLndpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICBjb2xsaWRlci5zaXplLmhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIF9hZGRCb3VuZChub2RlLCAwLCAtaGVpZ2h0IC8gMiwgd2lkdGgsIDEpO1xuICAgICAgICBfYWRkQm91bmQobm9kZSwgMCwgaGVpZ2h0IC8gMiwgd2lkdGgsIDEpO1xuICAgICAgICBfYWRkQm91bmQobm9kZSwgLXdpZHRoIC8gMiwgMCwgMSwgaGVpZ2h0KTtcbiAgICAgICAgX2FkZEJvdW5kKG5vZGUsIHdpZHRoIC8gMiwgMCwgMSwgaGVpZ2h0KTtcblxuICAgICAgICBub2RlLnBhcmVudCA9IHRoaXMubm9kZTtcbiAgICB9LFxuXG4gICAgaW5pdE9uZUZydWl0KGlkID0gMSkge1xuICAgICAgICB0aGlzLmZydWl0Q291bnQrK1xuICAgICAgICB0aGlzLmN1cnJlbnRGcnVpdCA9IHRoaXMuY3JlYXRlRnJ1aXRPblBvcygwLCA0MDAsIGlkKVxuICAgIH0sXG5cbiAgICAvLyDnm5HlkKzlsY/luZXngrnlh7tcbiAgICBvblRvdWNoU3RhcnQoZSkge1xuICAgICAgICBpZiAodGhpcy5pc0NyZWF0aW5nKSByZXR1cm5cbiAgICAgICAgdGhpcy5pc0NyZWF0aW5nID0gdHJ1ZVxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLm5vZGVcblxuXG4gICAgICAgIGNvbnN0IGZydWl0ID0gdGhpcy5jdXJyZW50RnJ1aXRcblxuICAgICAgICBjb25zdCBwb3MgPSBlLmdldExvY2F0aW9uKClcbiAgICAgICAgbGV0IHt4LCB5fSA9IHBvc1xuICAgICAgICB4ID0geCAtIHdpZHRoIC8gMlxuICAgICAgICB5ID0geSAtIGhlaWdodCAvIDJcblxuICAgICAgICBjb25zdCBhY3Rpb24gPSBjYy5zZXF1ZW5jZShjYy5tb3ZlQnkoMC4zLCBjYy52Mih4LCAwKSkuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpLCBjYy5jYWxsRnVuYygoKSA9PiB7XG4gICAgICAgICAgICAvLyDlvIDlkK/niannkIbmlYjmnpxcbiAgICAgICAgICAgIHRoaXMuc3RhcnRGcnVpdFBoeXNpY3MoZnJ1aXQpXG5cbiAgICAgICAgICAgIC8vIDFz5ZCO6YeN5paw55Sf5oiQ5LiA5LiqXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlT25jZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dElkID0gdGhpcy5nZXROZXh0RnJ1aXRJZCgpXG4gICAgICAgICAgICAgICAgdGhpcy5pbml0T25lRnJ1aXQobmV4dElkKVxuICAgICAgICAgICAgICAgIHRoaXMuaXNDcmVhdGluZyA9IGZhbHNlXG4gICAgICAgICAgICB9LCAxKVxuICAgICAgICB9KSlcblxuICAgICAgICBmcnVpdC5ydW5BY3Rpb24oYWN0aW9uKVxuICAgIH0sXG4gICAgLy8g6I635Y+W5LiL5LiA5Liq5rC05p6c55qEaWRcbiAgICBnZXROZXh0RnJ1aXRJZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZnJ1aXRDb3VudCA8IDMpIHtcbiAgICAgICAgICAgIHJldHVybiAxXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5mcnVpdENvdW50ID09PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gMlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g6ZqP5py66L+U5Zue5YmNNeS4qlxuICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpICsgMVxuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyDliJvlu7rkuIDkuKrmsLTmnpxcbiAgICBjcmVhdGVPbmVGcnVpdChudW0pIHtcbiAgICAgICAgbGV0IGZydWl0ID0gY2MuaW5zdGFudGlhdGUodGhpcy5mcnVpdFByZWZhYik7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuZnJ1aXRzW251bSAtIDFdXG5cbiAgICAgICAgZnJ1aXQuZ2V0Q29tcG9uZW50KCdGcnVpdCcpLmluaXQoe1xuICAgICAgICAgICAgaWQ6IGNvbmZpZy5pZCxcbiAgICAgICAgICAgIGljb25TRjogY29uZmlnLmljb25TRlxuICAgICAgICB9KTtcblxuICAgICAgICBmcnVpdC5nZXRDb21wb25lbnQoY2MuUmlnaWRCb2R5KS50eXBlID0gY2MuUmlnaWRCb2R5VHlwZS5TdGF0aWNcbiAgICAgICAgZnJ1aXQuZ2V0Q29tcG9uZW50KGNjLlBoeXNpY3NDaXJjbGVDb2xsaWRlcikucmFkaXVzID0gMFxuXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChmcnVpdCk7XG4gICAgICAgIGZydWl0LnNjYWxlID0gMC42XG5cbiAgICAgICAgLy8g5pyJRnJ1aXTnu4Tku7bkvKDlhaVcbiAgICAgICAgZnJ1aXQub24oJ3NhbWVDb250YWN0JywgdGhpcy5vblNhbWVGcnVpdENvbnRhY3QuYmluZCh0aGlzKSlcblxuICAgICAgICByZXR1cm4gZnJ1aXRcbiAgICB9LFxuXG4gICAgc3RhcnRGcnVpdFBoeXNpY3MoZnJ1aXQpIHtcbiAgICAgICAgZnJ1aXQuZ2V0Q29tcG9uZW50KGNjLlJpZ2lkQm9keSkudHlwZSA9IGNjLlJpZ2lkQm9keVR5cGUuRHluYW1pY1xuICAgICAgICBjb25zdCBwaHlzaWNzQ2lyY2xlQ29sbGlkZXIgPSBmcnVpdC5nZXRDb21wb25lbnQoY2MuUGh5c2ljc0NpcmNsZUNvbGxpZGVyKVxuICAgICAgICBwaHlzaWNzQ2lyY2xlQ29sbGlkZXIucmFkaXVzID0gZnJ1aXQuaGVpZ2h0IC8gMlxuICAgICAgICBwaHlzaWNzQ2lyY2xlQ29sbGlkZXIuYXBwbHkoKVxuICAgIH0sXG5cbiAgICAvLyDlnKjmjIflrprkvY3nva7nlJ/miJDmsLTmnpxcbiAgICBjcmVhdGVGcnVpdE9uUG9zKHgsIHksIHR5cGUgPSAxKSB7XG4gICAgICAgIGNvbnN0IGZydWl0ID0gdGhpcy5jcmVhdGVPbmVGcnVpdCh0eXBlKVxuICAgICAgICBmcnVpdC5zZXRQb3NpdGlvbihjYy52Mih4LCB5KSk7XG4gICAgICAgIHJldHVybiBmcnVpdFxuICAgIH0sXG4gICAgLy8g5Lik5Liq5rC05p6c56Kw5pKeXG4gICAgb25TYW1lRnJ1aXRDb250YWN0KHtzZWxmLCBvdGhlcn0pIHtcbiAgICAgICAgb3RoZXIubm9kZS5vZmYoJ3NhbWVDb250YWN0JykgLy8g5Lik5Liqbm9kZemDveS8muinpuWPke+8jHRvZG8g55yL55yL5pyJ5rKh5pyJ5YW25LuW5pa55rOV5Y+q5bGV56S65LiA5qyh55qEXG5cbiAgICAgICAgY29uc3QgaWQgPSBvdGhlci5nZXRDb21wb25lbnQoJ0ZydWl0JykuaWRcbiAgICAgICAgLy8gdG9kbyDlj6/ku6Xkvb/nlKjlr7nosaHmsaDlm57mlLZcbiAgICAgICAgc2VsZi5ub2RlLnJlbW92ZUZyb21QYXJlbnQoZmFsc2UpXG4gICAgICAgIG90aGVyLm5vZGUucmVtb3ZlRnJvbVBhcmVudChmYWxzZSlcblxuICAgICAgICBjb25zdCB7eCwgeX0gPSBvdGhlci5ub2RlXG5cbiAgICAgICAgdGhpcy5jcmVhdGVGcnVpdEp1aWNlKGlkLCBjYy52Mih7eCwgeX0pLCBvdGhlci5ub2RlLndpZHRoKVxuXG4gICAgICAgIGNvbnN0IG5leHRJZCA9IGlkICsgMVxuICAgICAgICBpZiAobmV4dElkIDw9IDExKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdGcnVpdCA9IHRoaXMuY3JlYXRlRnJ1aXRPblBvcyh4LCB5LCBuZXh0SWQpXG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRGcnVpdFBoeXNpY3MobmV3RnJ1aXQpXG5cbiAgICAgICAgICAgIC8vIOWxleekuuWKqOeUuyB0b2RvIOWKqOeUu+aViOaenOmcgOimgeiwg+aVtFxuICAgICAgICAgICAgbmV3RnJ1aXQuc2NhbGUgPSAwXG4gICAgICAgICAgICBjYy50d2VlbihuZXdGcnVpdCkudG8oLjUsIHtcbiAgICAgICAgICAgICAgICBzY2FsZTogMC42XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZWFzaW5nOiBcImJhY2tPdXRcIlxuICAgICAgICAgICAgfSkuc3RhcnQoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gdG9kbyDlkIjmiJDkuKTkuKropb/nk5xcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcgdG9kbyDlkIjmiJDkuKTkuKropb/nk5wg6L+Y5rKh5pyJ5a6e546w5ZOmfiAnKVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOWQiOW5tuaXtueahOWKqOeUu+aViOaenFxuICAgIGNyZWF0ZUZydWl0SnVpY2UoaWQsIHBvcywgbikge1xuICAgICAgICAvLyDmkq3mlL7lkIjlubbnmoTlo7Dpn7NcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheSh0aGlzLmJvb21BdWRpbywgZmFsc2UsIDEpO1xuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5KHRoaXMud2F0ZXJBdWRpbywgZmFsc2UsIDEpO1xuXG4gICAgICAgIC8vIOWxleekuuWKqOeUu1xuICAgICAgICBsZXQganVpY2UgPSBjYy5pbnN0YW50aWF0ZSh0aGlzLmp1aWNlUHJlZmFiKTtcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKGp1aWNlKTtcblxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmp1aWNlc1tpZCAtIDFdXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0ganVpY2UuZ2V0Q29tcG9uZW50KCdKdWljZScpXG4gICAgICAgIGluc3RhbmNlLmluaXQoY29uZmlnKVxuICAgICAgICBpbnN0YW5jZS5zaG93SnVpY2UocG9zLCBuKVxuICAgIH1cbn0pO1xuLy/nibnku7c5LjnlhYPkuIDlpZdjb2Nvc2NyZWF0b3Lku6PnoIHogZTns7tRMjQ4MzM2NzA4NCBcbi8v5oiq5Zu+IOmTvuaOpe+8mmh0dHBzOi8vc2hhcmUud2VpeXVuLmNvbS9sZUdBSHBuQiDlr4bnoIHvvJpiOXVkdHYiXX0=