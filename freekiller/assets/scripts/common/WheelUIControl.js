
cc.Class({
    extends: cc.Component,

    properties: {
        board: cc.Node,
        pot: cc.Node,
        listener: cc.Component.EventHandler,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.board.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.board.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.board.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.board.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this.pot.active = false;
    },

    onTouchStart(event){
        this.touching = true;

        this.activePot(event);
    },

    onTouchMove(event){
        if(!this.touching)
            return;

        this.activePot(event);
    },

    onTouchEnd(event){
        this.touching = false;

        this.activePot(event);
    },

    onTouchCancel(event){
        this.touching = false;

        this.activePot(event);
    },

    activePot(event)
    {
        this.pot.active = this.touching;
        if (!this.pot.active)
            return;

        var location = event.getLocation();
        var local = this.board.convertToNodeSpaceAR(location);

        var radius = this.board.width/2;

        if (local.len() > radius) {
            local = local.normalize().mul(radius);
        }

        this.pot.setPosition(local);

        // this.checkEmit();
    },

    checkEmit()
    {
        var local = this.pot.position;
        var radius = this.board.width/2;

        var scale = local.len() / radius;

        var step = local.normalize().mul(scale);
        step = cc.v2(step);

        this.listener.emit([step]);
    },

    update (dt) {
        if (this.pot.active)
        {
            this.checkEmit();
        }
    },
});
