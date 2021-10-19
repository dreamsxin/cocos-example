// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LiveObj from "../../__Lib/Base/LiveObj";
import Loot from "./Loot";
import GM from "../GM";



const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseObj extends LiveObj 
{

    @property
    Name: string = 'Name';
    @property
    Desc: string = 'Desc';
    
    @property
    IsEnamy=false;

    @property
    HP: number =100;

    @property
    Denf: number = 0;

    @property
    Speed: number = 50;

    @property(cc.Label)
    uiName: cc.Label = null;
    @property(cc.Sprite)
    uiHP: cc.Sprite = null;

    @property(cc.Prefab)
    MOD_Tip: cc.Node ;

    @property(cc.Prefab)
    MOD_Info: cc.Node ;

    NowHP:number=0;

    // LIFE-CYCLE CALLBACKS:

    NameFull():string{return this.NameUDD()+"_HP("+this.NowHP.toFixed(0).toString()+")"}
    HPrecent():number{return this.HP<=0?0: this.NowHP/this.HP; }


    Pausing(){ return false; }




    ShowTip(_tip:string):cc.Label
    {
        if(this.MOD_Tip==null)
            return;

        let _new=    cc.instantiate(this.MOD_Tip);

        _new.parent= cc.director.getScene();

        _new.position=cc.v3( this.GetWorldPositionX(cc.Vec2.UP.mul(100)));

        if(_new != null && !this.IsEnamy) _tip="-"+_tip;

        let _label =_new.getComponent(cc.Label);

        if(_label!=null)
        {
            _label.string =_tip;

            
        }
        return _label;

    }

    _InfoLable:cc.Label;
    
    ShowInfo(_info:string):cc.Label
    {
        if(this.MOD_Info==null)
            return;

        if(this._InfoLable==null)
        {
            let _new=    cc.instantiate(this.MOD_Info);

            _new.parent= this.node;
    
            _new.position=cc.Vec3.UP.mul(200);
            
            this._InfoLable =_new.getComponent(cc.Label);            
        }

        if(this._InfoLable!=null)
        {
            this._InfoLable.string =_info;  
            this._InfoLable.node.active=true;
        }
      
        return this._InfoLable;


    }
    CloseInfo()
    {
        if(this._InfoLable!=null)
        {
            this._InfoLable.node.active=false;
        } 
    }
    Hurt(dHP:number):BaseObj
    {
        if(dHP<1) dHP=1;
        this.NowHP-=dHP;

        if(this.NowHP<=0)
        {
            this.NowHP=0;
            this.OnKilled();
            this.Dead();
        }

        let tip= this.ShowTip(dHP.toFixed(0));
        if(tip!=null)
            tip.node.color=this.IsEnamy?cc.Color.ORANGE:cc.Color.GREEN;

        var _log:string="[OBJ Hurt@" +this.NameFull()+"]: ";

        console.log( _log+dHP.toFixed(0).toString()   )
        return this;
    }

    OnLive()
    {
        super.OnLive();
        this.NowHP=this.HP;
        if(this.uiName!=null)
            this.uiName.string=this.Name;
    }

    OnKilled()
    {
        var _loot=this.getComponents(Loot);
        if(_loot!=null)
        {
            _loot.forEach(t => 
            {
                t.Drop();
            });
        }
      
    }


    update(dt)
    {
        super.update(dt);

        if(this.uiHP!=null)
            this.uiHP.fillRange=this.HPrecent();
    }
}



