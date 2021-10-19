// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";
import UIOBJ from "../../__Lib/Base/UIOBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILevelWind extends UIOBJ {


    @property(cc.Sprite)
    WindProgress:cc.Sprite=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        this.WindProgress.fillRange=0;
    }

    update (dt) 
    {
        if(this.WindProgress==null) return;
        if(GM.LEVEL==null) return;

        this.WindProgress.fillRange = GM.LEVEL.Winding()/20;
        var c=this.WindProgress.node.color;
        this.WindProgress.node.color =cc.Color.lerp(c,cc.Color.GREEN,cc.Color.BLUE,this.WindProgress.fillRange) ;
        //    this.WindProgress.fillRange<0.3? cc.Color.YELLOW:
         //   (this.WindProgress.fillRange<0.7?cc.Color.ORANGE:cc.Color.RED);
    }
}
