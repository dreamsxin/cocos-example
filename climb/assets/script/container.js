cc.Class({
  extends: cc.Component,

  properties: {
    stairPrefab: cc.Prefab,
    stairs: [cc.Node],
    isStart: false,
    speed: 0,
    initSpeed: 0, // 用于保存初始化速度
    addSpeed: 0, // 每次加速需要增加的速度
    maxSpeed: 0, // 速度上限
    player: cc.Node,
    game: cc.Node,
    stairsNum: 6,
    // 轮流出现过多少个阶梯
    appearStairs: 0,
  },
  onLoad () {
    this.initSpeed = this.speed;
    this.createStairs();
  },

  start () {
    // this.startGame();
  },

  update (dt) {
    if (this.isStart) {
      this.move(dt);
      this.checkBgReset();
    }
  },

  createStairs() {
    let i = 0;
    while (i < this.stairsNum) {
      const newStair = cc.instantiate(this.stairPrefab);
      const stairComponent = newStair.getComponent('stair');
      stairComponent.game = this.game;
      stairComponent.player = this.player;
      if (i < 3) stairComponent.noBarrier = true;
      this.node.addChild(newStair, -1);
      newStair.setPosition(cc.v2(0, (205 * i) + 90));
      newStair.scale = (this.stairsNum - i) * .05 + .75;
      this.stairs.push(newStair);
      i += 1;
    }
  },
  startGame() {
    this.isStart = true;
  },
  move(t) {
    this.stairs.forEach(item => {
      // 移动
      // this.speed 为358.5 对应的是 减 7.35
      // 计算7.3的偏差值
      const diff = ((this.speed - 358.5) / 358.5) * 7.35;
      item.y -= (this.speed - (7.35 + diff)) * t;
      // 缩放  (item.y - 90) / 205)相当于是计算createStairs中的i的值
      const scale = (this.stairsNum - ((item.y - 90) / 205)) * .05 +.75;
      item.scale = scale;
    });
  },
  // 检查是否要重置位置
  checkBgReset() {
    // 最下面stair的顶点y坐标
    const first_yMax = this.stairs[0].y + 90;
    // 小于0则需要重置
    if (first_yMax <= 0) {
      // 把第一个取出来放到最后，并重新设置y坐标
      const preFirst = this.stairs.shift();
      this.stairs.push(preFirst);
      const curFirst = this.stairs[4];
      preFirst.y = curFirst.y + 205;
      preFirst.scale = (this.stairsNum - ((preFirst.y - 90) / 205)) * .05 +.75;

      // 修改其他stair参数，并添加和设置障碍的位置
      const stairComponent = this.stairs[5].getComponent('stair');
      stairComponent.randomPosition();
      stairComponent.createBarrier();
      stairComponent.createGold();
    }
  },

  // 位置校准：stair的移动与player可能存在偏差
  adjust() {
    // 找出距离player初始y坐标与所有stair里y坐标的差值并把差值存到新的数组中
    const arr = [], arr2 = [];
    this.stairs.forEach((stairs, i) => {
      const diff = stairs.y - this.game.getComponent('game').initY;
      arr.push(Math.abs(diff));
      arr2.push(diff);
    });
    // 得出最小差值
    const min = Math.min.apply(Math, arr);
    // 找出最小差值的下标
    let sub = -1;
    arr.forEach((item, i) => {
      if (item === min) {
        sub = i;
      }
    });
    // 所有stair都作调整
    this.stairs.forEach(stairs => stairs.y -= arr2[sub]);
  },
});
