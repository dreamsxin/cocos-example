// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import CSTween from "./CSTween";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CSScale extends CSTween {

    OnWake()
    {
        super.OnWake();
        if(this.ForceFrom)
        {
            this.node.setScale(this.From);
        }
    }


    OnLive()
    {
        super.OnLive();


        this.node.runAction(cc.scaleTo(this.Life,this.TO.x,this.TO.y));
    }
}
