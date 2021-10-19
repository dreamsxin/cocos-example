// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpinNode extends cc.Component {

    @property([cc.Node])
    items = []

    @property(cc.Node)
    target = null
    // LIFE-CYCLE CALLBACKS:


    update(dt) {
        let radian = Math.PI/180*this.node.angle

    }
    // update (dt) {}
}
