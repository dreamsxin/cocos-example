
class WaitZeroEnermy
{
    init(config)
    {
    	this.enermyMan = cc.find('Canvas').getComponent('EnermyMan');
    }

    gennerUpdate(dt)
    {
    	if (this.enermyMan.getAliveEnermyCount()>0)
    		return false;

    	return true;
    }

    getTotalEnermy()
    {
        return 0;
    }
}

module.exports = WaitZeroEnermy;