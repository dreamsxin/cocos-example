cc.Class({
  extends: cc.Component,

  properties: {
    game: cc.Node
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    const manager = cc.director.getCollisionManager();
    // 开启碰撞检测系统
    manager.enabled = true;
    // 开启 debug 绘制
    // manager.enabledDebugDraw = true;
    // 显示碰撞组件的包围盒
    // manager.enabledDrawBoundingBox = true;
  },
  onCollisionEnter(collider) {
    const game = this.game.getComponent('game');
    if (this.node.y >= game.initY && this.node.y <= (game.initY + 110)) {
      if (collider.node.name === 'barrierItem') {
        // 碰撞的是障碍
        console.log('game over');
        game.stopGame();
      } else if (collider.node.name === 'gold'){
        // 碰撞的是金币

        // player内的监听
        this.node.getComponent('player').getGoldHandle();

        // gold的处理
        const colliderComponent = collider.node.getComponent('gold');
        colliderComponent.goldPic.opacity = 0;
        colliderComponent.scoreLabel.string = `+${game.addCount}`;
        colliderComponent.addScore.opacity = 255;
        this.scheduleOnce(_ => {
          colliderComponent.addScore.opacity = 0;
        }, .5);
      }
    }
  },

  start() {
  },

  // update (dt) {},
});
