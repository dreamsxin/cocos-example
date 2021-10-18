// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    // 存在的阶梯数组
    stairs: [cc.Node],
    initY: 0,
    container: cc.Node,
    player: cc.Node,
    playerComponent: cc.Component,
    ctrl: cc.Node,
    ctrlButtonLabel: cc.Label,
    gameOverNode: cc.Node,
    status: 0, // 0 未开始，1 游戏中，2 已结束
    goldContinuousCount: 0, // 连续获得金币次数
    score: 0, // 当前分数
    addCount: 0, // 获得金币时，增加的分数值
    scoreLabel: cc.Label,
  },

  onLoad() {
    // 设置player组件
    this.playerComponent = this.player.getComponent('player');
    // 设置player初始位置
    this.player.setPosition(0, this.initY);
  },

  ctrlButtonHandle() {
    if (this.status === 0) {
      this.startGame();
    } else if (this.status === 2) {
      this.init();
    }
  },

  // 开始游戏
  startGame() {
    console.log('start game');
    // player 开始运动
    this.playerComponent.play();
    // stair移动
    this.container.getComponent('container').startGame();
    // 隐藏控制面板
    this.ctrl.runAction(cc.hide());

    this.status = 1;
  },

  // 结束游戏
  stopGame() {
    this.player.stopAllActions();
    this.container.getComponent('container').isStart = false;
    this.ctrl.runAction(cc.show());
    this.ctrlButtonLabel.string = '再来一局';
    this.gameOverNode.runAction(cc.fadeIn(.5));

    this.status = 2;
  },

  // 点击再玩一次，初始化游戏画面
  init() {
    const containerComponent = this.container.getComponent('container');
    // 在container中删除所有已存在的stair节点
    containerComponent.stairs.forEach(stair => stair.removeFromParent());
    // 清空stairs
    containerComponent.stairs.length = 0;
    containerComponent.createStairs();
    // 设置player初始位置
    this.player.setPosition(0, this.initY);

    this.ctrlButtonLabel.string = '开始游戏';
    this.gameOverNode.runAction(cc.hide());
    this.status = 0;
    this.score = 0;
    this.scoreLabel.string = 'Score:0';
    containerComponent.speed = containerComponent.initSpeed;
    this.playerComponent.step = 2;
    this.playerComponent.preStep = 0;
  },

  // 获得金币处理函数
  getGoldHandle() {
    if (this.goldContinuousCount > 4) {
      this.addCount = 50;
    } else {
      this.addCount = 20 + (this.goldContinuousCount - 1) * 10;
    }
    this.score += this.addCount;
    this.scoreLabel.string = `Score:${this.score}`;
  },
});
