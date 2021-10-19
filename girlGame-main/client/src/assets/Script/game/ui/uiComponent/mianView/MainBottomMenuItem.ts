// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainBottomMenuItem extends cc.Component {

    @property(cc.Node)
    node_bg: cc.Node = null;
    @property(cc.Node)
    node_checked: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    onClickFunc(isChecked){
            if(isChecked){

                this.getComponent(cc.Button).transition = cc.Button.Transition.NONE;
            }else {

                this.getComponent(cc.Button).transition = cc.Button.Transition.SCALE;
            }
            this.node_bg.y = isChecked?10:-10;
            this.node_bg.scale = isChecked?1:0.9;
            this.node_checked.active = isChecked;

    }
    // update (dt) {}
}
