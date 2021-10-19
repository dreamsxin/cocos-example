// 普通小怪的属性节点
// 挂在小怪node的第一个

cc.Class({
    extends: cc.Component,

    properties: {
        blood: 0,
        speed: 0,
        label: cc.Label,
    },

    start()
    {
    	this.player = cc.find('Canvas').getComponent('LevelMan').getPlayerNode();
        this.label.string = this.blood;
    },

    setEnermyMan(man)
    {
    	this.man = man;
    },

    update(dt)
    {
    },

    enermyUpdate(dt)
    {
        if (!this.player)
            return;

        var target = this.player.convertToWorldSpaceAR(cc.v2(0,0));
        var cur = this.node.parent.convertToWorldSpaceAR(this.node.position);

    	var dir = target.sub(cur).normalize();
    	var step = dir.mul(this.speed);

        var moveto = cur.add(step);
        moveto = this.node.parent.convertToNodeSpaceAR(moveto);
    	this.node.position = moveto;
    },

    onCollisionEnter(other, self)
    {
    	if (!this.man)
    		return;

        if (this.dead)
            return;

        var comp = other.node.getComponent('CauseDamage');
        if (!comp)
            return;

    	this.blood -= comp.getDamage();

        this.label.string = this.blood;

    	if (this.blood <= 0) {
            this.dead = true;
    		this.man.removeEnermyNode(this.node);
    	}
    },
});
