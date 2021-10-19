// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Loot from "../../_Cannon/OBJ/Loot";

const {ccclass, property} = cc._decorator;

export enum  DeadActionOption
{
    daNone=0,
    daDestroy=1,
    daDisactive=2,
}

@ccclass
export default class OBJ extends cc.Component 
{
    static OBJ_UDD=14151;


    UDD:number=0;
    
    @property
    DeadAction: DeadActionOption = DeadActionOption.daDestroy;
 
    NameUDD():string{return  this.node.name+"["+this.UDD.toString()+"]"; }

    GetWorldPosition():cc.Vec2 {return this.node.convertToWorldSpaceAR<cc.Vec2>(cc.Vec2.ZERO);}
    GetWorldPositionX(dpos:cc.Vec2):cc.Vec2 {     return this.node.convertToWorldSpaceAR(dpos);  }
  
    SetWorldPosition(pos:cc.Vec2):OBJ
    {
        this.node.position =cc.v3( this.node.parent.convertToNodeSpaceAR(pos));
        return this;
    }


    onLoad()
    {
        this.UDD=OBJ.OBJ_UDD++;
    }



    Dead():OBJ
    {

        if(this._ONDead!=null)
            this._ONDead(this);



        this.OnDead();

        this._DoDead();

        return this;
    }
    protected OnDead()
    {

    }
    private _DoDead()
    {
  

        switch(this.DeadAction)
        {
            case DeadActionOption.daDestroy:
                this.node.destroy();break;
            case DeadActionOption.daDisactive:
                this.node.active=false;break;    
        }
    }
    private _ONDead :(w)=>void 
    WaitDead<T extends OBJ>(on :(who:T)=>void )
    {
        this._ONDead=on;
        return this;
    }
}
