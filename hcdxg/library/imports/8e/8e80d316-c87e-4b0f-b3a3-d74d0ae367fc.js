"use strict";
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