cc.Class({
    extends: cc.Component,
    //空节点bg
    //Label在bg下

    properties: {
        labelEmptyNode: cc.Node, //细胞总界面
    },
    onLoad() {

        console.log(this.node.name)
        //for (let i = 0; i < 80; i++) {
        let label = this.labelEmptyNode.addComponent(cc.Label);
        label.string = "325432ft"
        label.fontSize = 20;
        console.log(label)

        label.node.color = new cc.color(255, 255, 0, 255)
        //label.node.setPosition(cc.v2(100, 100))
        //}
        console.log(this.node)

        // let label = this.node.addComponent(cc.Label);
        // label.string = "sdasxfgsdbg";
        // label.fontSize = 80;
        // label.lineHeight = 80; //40

        // label.node.x = 100
        // label.node.y = 100
        // label.node.setPosition(cc.v2(100, -100))

        // //对影响文字上半部分被遮住没用
        // //label.node.width =;//449.78
        // //label.node.height = 200 //50.4

        // label.node.color = new cc.color(55, 55, 55, 255)

        // //label挂在bg(Node)上
        // console.log(label)
        // console.log(label.node)
    },
});