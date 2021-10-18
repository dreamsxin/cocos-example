cc.Class({
  extends: cc.Component,

  properties: {
    game: cc.Node,
    player: cc.Node,
    addScore: cc.Node,
    goldPic: cc.Node,
    scoreLabel: cc.Label,
  },

  onLoad() {
  },
  init() {
    this.goldPic.opacity = 255;
    this.addScore.opacity = 0;
  },
});
