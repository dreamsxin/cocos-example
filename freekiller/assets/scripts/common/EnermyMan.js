// 管理所有敌人的生命周期

cc.Class({
    extends: cc.Component,

    ctor(){
        this.deadCount = 0;
    },

    properties: {
        enermyLayer: cc.Node,
    },

    onLevelLoaded(levelMan)
    {
        this.deadCount = 0;
        this.enermyLayer.removeAllChildren();
    },

    addEnermyNode(node)
    {
        helper.moveNodeTo(node, this.enermyLayer);

        let comps = node.getComponents(cc.Component);
        for(let i=0; i<comps.length; ++i)
        {
            comps[i].setEnermyMan && comps[i].setEnermyMan(this);
        }
    },

    removeEnermyNode(node)
    {
        ++this.deadCount;
        this.enermyLayer.removeChild(node, true);
    },

    update(dt) {
        for(let i=0; i<this.enermyLayer.children.length; ++i)
        {
            this.updateOneEnermy(this.enermyLayer.children[i], dt);
        }
    },

    updateOneEnermy(node, dt)
    {
        let comps = node.getComponents(cc.Component);
        for(let i=0; i<comps.length; ++i)
        {
            comps[i].enermyUpdate && comps[i].enermyUpdate(dt);
        }
    },

    getAliveEnermyCount()
    {
        return this.enermyLayer.children.length;
    },

    getNearestNodeAtWorld(pos)
    {
        var minlen = null;
        var node = null;
        var local = this.enermyLayer.convertToNodeSpaceAR(pos);
        for(let i=0; i<this.enermyLayer.children.length; ++i)
        {
            let curlen = this.enermyLayer.children[i].position.sub(local).len();
            if (minlen === null)
            {
                minlen = curlen;
                node = this.enermyLayer.children[i];
            }
            else if (curlen < minlen)
            {
                minlen = curlen;
                node = this.enermyLayer.children[i];
            }
        }
        return node;
    },

    getDeadCount()
    {
        return this.deadCount;
    },
});
