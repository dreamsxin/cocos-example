// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SYS from "./SYS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ForceFromIntro extends cc.Component 
{



    onLoad () 
    {
        if(!SYS.LOADED())
            cc.director.loadScene("sc_intro");
    }


}
