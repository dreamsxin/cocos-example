
cc.Class({
    extends: cc.Component,

    properties: {
    },

    load_all_object(root, path) {
        for(let i = 0; i < root.childrenCount; i ++) {
            this.view[path + root.children[i].name] = root.children[i];
            this.load_all_object(root.children[i], path + root.children[i].name + "/");
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.view = {};
        this.load_all_object(this.node, "");
    },

    start () {
        console.log(this.view);
    },

    // update (dt) {},
});
