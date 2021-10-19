
cc.Class({
    extends: require('StateMan'),

    properties: {
        
    },

    start()
    {
    },

    onLevelLoaded(levelMan)
    {
        this.setState(LevelState.Prepare);

        this.scheduleOnce(function(){
            this.setState(LevelState.Running);
        }.bind(this), 1);
    },

    emitToSelfComponent()
    {
    	var freeLevelMan = this.getComponent('FreeLevelMan');
    	var arr = [
    		freeLevelMan.centerPlayer,
    		freeLevelMan.getComponent('FreeEnermyGenner'),
    		freeLevelMan.getComponent('PlayerMoveControl'),
    		freeLevelMan.getComponent('PlayerShootControl'),
    		freeLevelMan.title,
    	];
        
        for(let i=0; i<arr.length; ++i)
        {
        	arr[i].onStateChanged && arr[i].onStateChanged(this);
        }
    },

    onStateChanged()
    {
    	this.emitToSelfComponent();
        this.handleState();
    },

    handleState()
    {
        if (this.curState === LevelState.Finished)
        {
            this.scheduleOnce(function(){
                this.getComponent('FreeLevelMan').gotoNext();
            }.bind(this), 2);
        }
    },
});
