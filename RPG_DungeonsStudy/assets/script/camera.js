cc.Class({
    extends: cc.Component,

    properties: {
        playerNode: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    update(dt) {
        if (!this.playerNode) return;
        let w_pos = this.playerNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let n_pos = this.node.parent.convertToNodeSpaceAR(w_pos)
        this.node.position = n_pos
    },
});