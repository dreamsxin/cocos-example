// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OBJ from "./OBJ";


const {ccclass, property} = cc._decorator;


@ccclass
export default class UIOBJ extends OBJ 
{
    IsShowing=false;
    onEnable()
    {
        this.unschedule(this._DoShow);
        this.scheduleOnce(this._DoShow,0.1);
    }
    
    Show():UIOBJ
    {
        this.unschedule(this._DoShow);
        this.scheduleOnce(this._DoShow,0.1);
    
        return this;
    }
    private _DoShow() 
    {
        this.node.active=true;
        this.OnShow();
        this.IsShowing=true;
    }
    OnShow()
    {

    }

    Close():UIOBJ
    {
        this.IsShowing=false;
        

        this._DoClose();
    
        return this;
    }
    private _DoClose() 
    {
        this.Dead();
        this.OnClose();
    }
    OnClose()
    {

    }
}
