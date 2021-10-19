// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIYawing extends cc.Component {

    @property(cc.Node)
    Yawing: cc.Node = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    Set(_yawing:number)
    {

    }
    update (dt) 
    {
        if(GM.CANNON!=null && this.Yawing!=null)
        {
            this.Yawing.angle= GM.CANNON.Yawing;
        }
    }
}
