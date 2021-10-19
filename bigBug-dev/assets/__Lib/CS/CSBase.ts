// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import OBJ from "../Base/OBJ";


const {ccclass, property} = cc._decorator;



@ccclass
export default class CSBase extends OBJ {
    



    @property
    Life: number =1;
    @property
    Delay: number =0;

  



    Living:boolean=false;

    start () 
    {

    }
    onEnable()
    {
        this.Living=false;

        this.OnWake();
        if(this.Delay>0)
            this.scheduleOnce(this._Live,this.Delay);
        else
            this._Live();
    }

    OnWake()
    {

    }
        
    private  _Live()
    {
        this.Living=true;

        this.OnLive();
        
    }



    protected  OnLive()
    {
        if(this.Life>0)
            this.schedule(this.Dead,this.Life);
    }
    protected OnDead()
    {

    }


    
    
}
