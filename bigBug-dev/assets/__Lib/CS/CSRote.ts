// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CSBase from "./CSBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CSRote extends CSBase {

    @property
    Speed: number= 90;


    update (dt) 
    {
        if(this.Living)
        {
            this.node.angle+= this.Speed*dt;
        }
    }
}
