cc.Class({

        extends: cc.Component,

        properties: {

            // foo: {

            //    default: null,

            //    url: cc.Texture2D,  // optional, default is typeof default

            //    serializable: true, // optional, default is true

            //    visible: true,      // optional, default is true

            //    displayName: 'Foo', // optional

            //    readonly: false,    // optional, default is false

            // },

            // ...

        },

        // use this for initialization
        onLoad: function () {

        },

        //切换场景
        toScene: function(){
            cc.director.loadScene("MainScene")
        }
        // called every frame, uncomment this function to activate update callback
        // update: function (dt) {
        // },
    });