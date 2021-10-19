
class NormalEnermyGenner
{
    init(config)
    {
        this.config = config;

        this.totalCount = this.config.totalCount || 1;
    }

    onEnter()
    {
        var names = [];
        for(let i=0; i<this.config.names.length; ++i)
        {
            names.push(`enermies/${this.config.names[i]}`);
        }

        cc.loader.loadResArray(names, function(err, assets){
            if (err) {
                cc.error(err.toString());
                return;
            }

            this.assets = assets;
        }.bind(this));

        this.enermyMan = cc.find('Canvas').getComponent('EnermyMan');
    }

    gennerUpdate(dt)
    {
        if (!this.assets) {
            return false;
        }

        for(let i=0; i<this.totalCount; ++i)
        {
            let node = cc.instantiate(helper.randSelect(this.assets));

            node.x = helper.randInt(0, 960);
            node.y = helper.randInt(0, 640);

            let comp = node.getComponent('NormalEnermy');
            comp.blood = comp.blood + helper.randInt(this.config.bloodAddRange);
            comp.speed = comp.speed + helper.randInt(this.config.speedAddRange);

            this.enermyMan.addEnermyNode(node);
        }

        return true;
    }

    getTotalEnermy()
    {
        return this.totalCount;
    }
}

module.exports = NormalEnermyGenner;