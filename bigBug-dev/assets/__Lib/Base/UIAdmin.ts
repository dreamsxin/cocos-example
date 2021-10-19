// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIOBJ from "./UIOBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIAdmin extends UIOBJ {



    onLoad () 
    {
        super.onLoad();
        this.node.on(cc.Node.EventType.TOUCH_START,this._OnMouse,this);
    }
 
    __NNN=0;

    OnAdmin()
    {

    }

    private   _OnMouse()
    {

        this.unscheduleAllCallbacks();

        if(++this.__NNN>=3)
        {
            this._Clear();
            this.OnAdmin();
            return ;
        }
        
        this.scheduleOnce(this._Clear,0.5);
    }
    _Clear()
    {
        this.__NNN=0;
    }


}
