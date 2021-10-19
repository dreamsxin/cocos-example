// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseObj from "./BaseObj";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClockObj extends BaseObj 
{
    @property
    TurnLife:number=2;

    @property
    Waitime:number=3;


    @property(cc.Prefab)
    MOD_TurnTip: cc.Node ;


    NowWaitime=0;
    TurnLifeLeft=0;
    DoTurn():ClockObj
    {
        this.TurnLifeLeft=this.TurnLife;

        this.ShowTurnTip();

        this.OnTurn();

        if(this._ONTurn!=null)
            this._ONTurn(this);
        return this;
    }
    TurnOver():ClockObj
    {
        this.TurnLifeLeft=0;
        this.NowWaitime=this.Waitime;
        this.CloseInfo();
        this.CloseTurnTip();
        this.OnTurnOver();
        if(this._ONTurnOver!=null)
            this._ONTurnOver(this);
        return this;
    }

    OnTurn()
    {
        

    }
    OnTurnOver()
    {
        

    }

    _ONTurn:(who:ClockObj)=>void ;
    WaitTurn(on:(who:ClockObj)=>void ):ClockObj
    {
        this._ONTurn=on;
        return this;
    }

    _ONTurnOver:(who:ClockObj)=>void ;
    WaitTrunOver( on:(who:ClockObj)=>void  ):ClockObj
    {
        this._ONTurnOver=on;
        return this;
    }
    _TurnTip:cc.Node;
    ShowTurnTip()
    {
        if(this._TurnTip==null)
        {
            this._TurnTip=cc.instantiate(this.MOD_TurnTip);
            this._TurnTip.parent=this.node;
            this._TurnTip.position=cc.v3(0,200,0);
            //MOD_TurnTip
        }
        if(this._TurnTip!=null)
        {
            this._TurnTip.active=true;
        }

    }
    CloseTurnTip()
    {
        if(this._TurnTip!=null)
        {
            this._TurnTip.active=false;
        } 
    }

    update(dt)
    {


        if(this.TurnLifeLeft>0)
        {
            this.TurnLifeLeft-=dt;

            this.ShowInfo( Math.ceil(this.TurnLifeLeft).toString()  ); 

            if(this.TurnLifeLeft<=0)
            {
                this.TurnOver();

                return;
            }
               
              
        }
            
    }
}
