// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CSBase from "./CSBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CSMove extends CSBase {


    @property
    Speed: cc.Vec3 = cc.Vec3.UP;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) 
    {
        if(this.Living)
        {
            this.node.setPosition( this.node.position.add(this.Speed.mul(dt)));
        }
    }
}
