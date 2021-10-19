// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelWind extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    Force:number=0;
    Stable:number=0;

    Now:number=0;
    start () 
    {
        //this.Reset();
    }
    Reset():LevelWind
    {
        this.Now=0;

        this._LastDelay=2;
        return this;
    }
    Set(force:number,stable:number):LevelWind
    {
        this.Force=force;this.Stable=stable;

        return this;
    }
    _GetLasting():number
    {
        var  _lasting =10* this.Stable/(100+this.Stable);
        if(_lasting<=0) _lasting=0.1;

        _lasting *=0.8+0.4*Math.random();
        return _lasting;
    }
    __Dir=1;
    _ChangeCheck()
    {
       

        var dw= 10* this.Force/(500+this.Force);
        dw *= 0.5+1*Math.random();
        this.__Dir*=Math.random()>0.85?-1:1;
        dw*=this.__Dir;

        this.Now+=dw;

        if(this.Now>10) this.Now=10;
        if(this.Now<-10) this.Now=-10;

        GM.W=this.Now;
    }
    _LastDelay =99999;
     update (dt) 
     {
        this._LastDelay-=dt;
        if(this._LastDelay<=0)
        {
            this._ChangeCheck();
            this._LastDelay+=this._GetLasting();
        }
     }
}
