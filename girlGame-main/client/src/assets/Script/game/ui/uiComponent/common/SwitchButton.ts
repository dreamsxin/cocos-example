// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SwitchButton  extends cc.Button {

    @property(cc.Node)
    node_bg1: cc.Node = null;

    @property(cc.Node)
    node_bg2: cc.Node = null;

    private switch = true;

    onLoad(){
        this.node_bg1.active = this.switch;
        this.node_bg2.active = !this.switch;
    }
    onClickHandle(){
        this.switch = !this.switch;
        this.node_bg1.active = this.switch;
        this.node_bg2.active = !this.switch;
    }


    // update (dt) {}
}
