// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseObj from "./BaseObj";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WaitingObj extends BaseObj {


    _Waiting=0;
    _WaitingMax=0;

    AddWaiting(wt)
    {
        this._Waiting+=wt;
        this._WaitingMax=this._Waiting;

        this.scheduleOnce(this.OnWaiting,0);
    }
    WaitPercemt(){return this._WaitingMax<=0?0:  this._Waiting/ this._WaitingMax;    }
    Waiting(){return this._Waiting;}
    WaitingMax(){return this._WaitingMax;}
    
    IsInWaiting(){return this._Waiting>0;}

    Paused(){return true;}


    OnWaiting()
    {
        this._ONWaiting?.call(this,this);
    }


    _ONWaiting:Function;
    WaitWaiting(on:(WaitingObj)=>void):WaitingObj
    {
        this._ONWaiting =on;
        return this;
    }

    OnWaitingOver()
    {
        this._ONWaitingOver?.call(this,this);
    }
    _ONWaitingOver:Function;
    WaitWaitingOver(on:(WaitingObj)=>void):WaitingObj
    {
        this._ONWaitingOver =on;
        return this;
    }
    update(dt)
    {
        super.update(dt);

        if(this._Waiting<=0)  return;

        if(this._Waiting>0)
            this._Waiting-=dt;
        
        if(this._Waiting<=0)
            this.OnWaitingOver();
    }
}
