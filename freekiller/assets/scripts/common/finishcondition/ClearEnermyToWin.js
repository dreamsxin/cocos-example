
cc.Class({
    extends: require("FinishCondition"),

    properties: {
    },

    onLevelLoaded(levelman)
    {
    	this.stateMan = levelman.getStateMan();

    	this.totalEnermy = levelman.getEnermyGenner().getTotalEnermy();

    	this.enermyMan = levelman.getEnermyMan();

    	cc.log('ClearEnermy', this.totalEnermy);
    },

    update()
    {
    	if (this.enermyMan.getDeadCount() === this.totalEnermy)
    	{
    		if (this.stateMan.curState === LevelState.Running)
    		{
	    		this.stateMan.setState(LevelState.Finished);
    		}
    	}
    }
});
