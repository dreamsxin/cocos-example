
class SequenceGenner
{
    init(config)
    {
        this.runningIndex = -1;

        this.gens = [];
        for(let i=0; i<config.length; ++i)
        {
            var genconfig = config[i];

            var gen = helper.create(genconfig.type);
            gen.init(genconfig.config);

            this.gens.push(gen);
        }
    }

    // 返回true代表运行完成
    // 返回false代表还需要继续运行
    gennerUpdate(dt)
    {
        if (!this.runningGenner) {
            this.runningGenner = this.beginNextGenner();
        }

        if (!this.runningGenner) {
            return true;
        }

        var res = this.runningGenner.gennerUpdate(dt);

        if (res) {
            this.runningGenner.onExit && this.runningGenner.onExit();
            this.runningGenner = null;
        }

        return false;
    }

    beginNextGenner()
    {
        ++this.runningIndex;

        var gen = this.gens[this.runningIndex];

        gen && gen.onEnter && gen.onEnter();

        return gen;
    }

    getTotalEnermy()
    {
        var total = 0;
        for(let i=0; i<this.gens.length; ++i)
        {
            total += this.gens[i].getTotalEnermy();
        }
        return total;
    }
}

module.exports = SequenceGenner;