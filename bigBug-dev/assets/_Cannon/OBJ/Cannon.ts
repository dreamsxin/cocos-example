// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OO from "./OO";
import GM from "../GM";
import ClockObj from "./ClockObj";
import Shooter from "./Shooter/Shooter";
import WaitingObj from "./WaitingObj";


const {ccclass, property} = cc._decorator;

@ccclass
export default class Cannon extends WaitingObj {



    @property
    ShootYawMin: number = 25;
    @property
    ShootYawMax: number = 65;

    @property
    PowerBase: number = 5;
    @property
    PowerSpeed: number = 100;

    @property
    Actiony: number = 100;

    @property(cc.Prefab)
    EFF_ShooterUse:cc.Node;


    Powering:number=0;
    Yawing= 30;

    _Shooters:Shooter[];

    _NowShooter:Shooter;

    _Waiting=0;
    _WaitingMax=0;
    onLoad ()
    {
        this.Name="MY";
        this._Shooters=this.getComponentsInChildren(Shooter);

        GM.CANNON=this;
    }
    Begin():Cannon
    {
        this.AddWaiting(4);
        return this;
    }

    UseShoot(num):Cannon
    {
        if(this._Shooters==null || this._Shooters.length<1)
        return this;

        if(num>this._Shooters.length) num =this._Shooters.length-1;

        this._NowShooter = this._Shooters[num];

        if(this.EFF_ShooterUse!=null)
        {
            var eff=  cc.instantiate(this.EFF_ShooterUse);
            eff.setParent(cc.director.getScene());
        }

        return this;
    }
    GetShoot(num):Shooter
    {
        if(this._Shooters==null || this._Shooters.length<1) return null;

        if(num>this._Shooters.length)  return null; 

        return this._Shooters[num];
    }

    Shoot()
    {
        if(this._NowShooter==null)  this.UseShoot(0);
        if(this._NowShooter==null) return;


        let _speed = new cc.Vec2(Math.cos(this.Yawing*3.14/180),Math.sin(this.Yawing*3.14/180)).mul(this.Powering*this.PowerBase);

        var oo= this._NowShooter.Shoot(_speed);

        this.AddWaiting(this._NowShooter.CD);

        this.__OnShoot(oo);
        
        return ;
    }
    private __OnShoot(oo)
    {
        this._ONShoot?.call(this,oo);
    }

    _ONShoot:Function;
    WaitShoot(on :(oo:OO)=>void)
    {
        this._ONShoot=on;return this;
    }

  
    SetYaw(_yaw:number)
    {
        this.Yawing=_yaw;
        if(this.Yawing>this.ShootYawMax)
            this.Yawing=this.ShootYawMax;
        if(this.Yawing<this.ShootYawMin)
            this.Yawing=this.ShootYawMin;
    }
    YawAdd(_dd:number)
    {
        this.Yawing+=_dd;

     
        if(this.Yawing>this.ShootYawMax)
            this.Yawing=this.ShootYawMax;
        if(this.Yawing<this.ShootYawMin)
            this.Yawing=this.ShootYawMin;
    }


    SetPowerFill(fill):Cannon
    {
        this.Powering = 100*fill;
        return this;
    }

    update(dt)
    {
        super.update(dt);
    }

    FireCDing()
    {
        if(this._NowShooter==null) this.UseShoot(0);
        if(this._NowShooter==null) return 1;
        return this._NowShooter.CDing();
    }
}
