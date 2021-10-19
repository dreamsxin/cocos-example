// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ACC from "./ACC";
import { EX } from "../__Lib/EX";
import GMBase from "./GMBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GM_intro extends GMBase {




    onLoad () 
    {
        this.node.on(cc.Node.EventType.TOUCH_END, this.GOGOGOG, this);
    }
    GOGOGOG()
    {
        this.GOLevelNow();
    }
    start () 
    {
       this.schedule(this._Check,0.3);
    }

    _Check()
    {
        if(!ACC.LOADOK )    return;

        this.unschedule(this._Check);

        this.SetNowLevel(ACC.SAVING.Level)
        this.GOGOGOG();
    }
}
