// 以一定的规则创建一系列enermy的组件

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLevelLoaded(levelman)
    {
    	var rule = db.freeEnermyGeneratorRules[levelman.getCurLevel()] || db.freeEnermyGeneratorDefaultRule;
    	this.rootGenner = helper.create(rule.type);
    	this.rootGenner.init(rule.config);

        // this.stateMan = levelman.getStateMan();
    },

    update(dt)
    {
        if (!this.rootGenner)
            return;

        // if (this.stateMan.curState != LevelState.Running)
        //     return;

        var res = this.rootGenner.gennerUpdate(dt);

        if (res) {
            this.rootGenner = null;
        }
    },

    getTotalEnermy()
    {
        return this.rootGenner.getTotalEnermy();
    },
});
