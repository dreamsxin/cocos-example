
class WaitSecond
{
    init(config)
    {
    	this.curTime = 0;
    	this.config = config;
    }

    gennerUpdate(dt)
    {
    	this.curTime += dt;

    	return this.curTime>=this.config.second;
    }

    getTotalEnermy()
    {
        return 0;
    }
}

module.exports = WaitSecond;