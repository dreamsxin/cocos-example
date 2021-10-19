
cc.Class({
    extends: cc.Component,

    properties: {
        progressBar: cc.ProgressBar,

        title: cc.Label,
    },

    onLevelLoaded(levelman)
    {
        this.enermyMan = levelman.getEnermyMan();

        this.totalEnermy = levelman.getEnermyGenner().getTotalEnermy();

        this.title.string = `第${levelman.getCurLevel()+1}关`;
    },

    update()
    {
        if (!this.totalEnermy || !this.enermyMan)
            return;

        this.progressBar.progress = this.enermyMan.getDeadCount() / this.totalEnermy;
    }
});
