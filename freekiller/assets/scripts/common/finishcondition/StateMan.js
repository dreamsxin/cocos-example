
cc.Class({
    extends: cc.Component,

    ctor()
    {
        this.curState = null;
        this.lastState = null;

        this.listeners = [];
    },

    properties: {
    },

    onLevelLoaded(levelman)
    {
        if (this.listeners.length != 0) {
            cc.error('StateMan有未清理的listener');
        }
        this.listeners = [];
    },

    setState(state)
    {
        cc.log('setState:', state);

        this.lastState = this.curState;
        this.curState = state;

        this.emitStateChanged();
    },

    addListener(listener)
    {
        this.listeners.push(listener);
    },

    removeListener(listener)
    {
        var index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.listeners.splice(index, 1);
        }
    },

    emitStateChanged()
    {
        this.onStateChanged();

        for(let i=0; i<this.listeners.length; ++i)
        {
            this.listeners[i](this);
        }
    },

    onStateChanged()
    {
    },
});
