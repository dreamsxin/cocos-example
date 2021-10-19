// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OBJ from "./OBJ";
export enum  LiveState
{
    osNone=0,
    osLiving=1,
    osDead=2,
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class LiveObj extends OBJ {

    Lifing :number;
    State: LiveState = LiveState.osNone;

    @property
    AutoLive:boolean=true;


    onEnable()
    {
       if(this.AutoLive) 
            this.Live();
    }
    Live():LiveObj
    {
        this.Lifing=0;
        this.State= LiveState.osLiving;

        this.OnLive();

        return this;
    }
    OnLive()
    {

    }

    OnDead()
    {
        super.OnDead();
        this.State= LiveState.osDead;

    }
    
    update(dt)
    {
        if(this.State!=LiveState.osLiving)   return;
        this.Lifing+=dt;
    }
}
