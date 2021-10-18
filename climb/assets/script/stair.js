cc.Class({
  extends: cc.Component,

  properties: {
    // 第几个阶梯
    No: 0,
    // 障碍物个数
    barrierNum: 0,
    // 障碍位置数
    posiNum: 0,
    // 障碍位置数组
    barrierPositions: [],
    barriers: [cc.Node],
    noBarrier: false,
    barrierPrefab: cc.Prefab,
    goldPrefab: cc.Prefab,
    gold: cc.Node,
    goldPosition: -2,
    game: cc.Node,
    player: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    if (!this.noBarrier) {
      // 随机位置
      this.randomPosition();
      // 根据随机位置添加障碍物
      this.createBarrier();
      // 根据随机位置添加金币
      this.createGold();
    }
  },

  start () {
  },
  // 随机出现障碍、金币位置
  randomPosition() {
    this.barrierPositions.length = 0;
    let arr = [], i = 0, j = 0, ran = 0;
    // 创建空位置数组 [0, 1, ..., 9]
    while (i < this.posiNum) arr.push(i ++);
    // 随机一个位置作为金币的位置 去掉头尾各2个
    this.goldPosition = parseInt((arr.length - 4) * Math.random() + 2, 10);
    arr.splice(this.goldPosition, 1);
    // 随机剩余的位置作为障碍的位置，并顺序排序
    while (j < this.barrierNum) {
      // 去掉头尾各1个
      ran = parseInt((arr.length - 2) * Math.random() + 1, 10);
      this.barrierPositions.push(arr[ran]);
      arr.splice(ran, 1);
      j += 1;
    }
    this.barrierPositions.sort((a, b) => (a > b));
  },
  createBarrier() {
    // 如果是重置stair位置的话，barriers里本来就有一些barrier的，所以得用长度去判断是否需要增加
    // 在setBarrierPosition的时候也需要遍历设置位置，不能在下面的while中设置位置
    while (this.barrierPositions.length !== this.barriers.length) {
      const newBarrier = cc.instantiate(this.barrierPrefab);
      this.barriers.push(newBarrier);
      this.node.addChild(newBarrier);
    }
    this.setBarrierPosition();
  },
  setBarrierPosition() {
    this.barriers.forEach((barrier, i) => {
      barrier.setPosition(cc.v2(42 + (74 * this.barrierPositions[i]) - 375, 50));
    });
  },
  createGold() {
    // 不存在才添加，为了减少节点的添加过程
    if (!this.gold) {
      this.gold = cc.instantiate(this.goldPrefab);
      this.node.addChild(this.gold);
      this.gold.getComponent('gold').game = this.game;
      this.gold.getComponent('gold').player = this.player;
    }
    this.gold.getComponent('gold').init();
    this.gold.setPosition(cc.v2(42 + (74 * this.goldPosition) - 375, 30))
  },

  // update (dt) {},
});
