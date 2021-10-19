
cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            // ATTRIBUTES:
            default: null,        // The default value will be used only when the component attaching
                                  // to a node for the first time
            type: cc.Sprite, // optional, default is typeof default
            serializable: true,   // optional, default is true
        },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    start () {
        
    },

    onFreeClicked(){
        freeMan.start();
    },

    // update (dt) {},
});
