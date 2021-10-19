// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";
import Win from "../../__Lib/Base/Win";
import UIShooter from "./UIShooter";
import UIPowerLooping from "./UIPowerLooping";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinControl extends Win {

    @property(cc.Label)
    Couting: cc.Label = null;
    @property(cc.Label)
    WaitAddSA: cc.Label = null;


    @property(UIPowerLooping)
    PowerLooping:UIPowerLooping = null;

    @property(cc.Label)
    Yaw: cc.Label = null;

    @property(cc.Label)
    PowerNum: cc.Label = null;

    @property(cc.Sprite)
    Powering: cc.Sprite = null;


    @property(cc.Node)
    EFF_Tip: cc.Node = null;

    @property(cc.Node)
    EFF_Counting: cc.Node = null;

    uiShooters :UIShooter[];
    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        super.onLoad();
        //this.node.on(cc.Node.EventType.TOUCH_END,this.__DoShoot,this);
    }
    __DoShoot()
    {
        //9[this.Shoot();
    }
    __NOW:UIShooter ;
    start ()
    {
        if(this.WaitAddSA!=null)this.WaitAddSA.node.scale=0;
        

        this.uiShooters=this.getComponentsInChildren(UIShooter);
        if(this.uiShooters!=null && GM.CANNON!=null)
        {
            var NN=0;
            this.uiShooters.forEach(ui=>
                {
                    ui.Set(NN,GM.CANNON.GetShoot(NN++)).WaitSelect(w=>
                        {
                            this.__NOW?.UnSelect();
                            this.__NOW=w;
                            if(GM.CANNON!=null)
                                GM.CANNON.UseShoot(w.ShootNum);
                            if(this.WaitAddSA!=null)
                            {
                                this.WaitAddSA.node.setScale(0,0,0);
                                this.WaitAddSA.node.runAction(cc.scaleTo(0.2,.5,.5).easing(cc.easeSineIn()));
                                this.WaitAddSA.string="加等待"+w.Shooter.CD+"秒";
                            }
                                
                        });
                })
        }

    }

    OnShow()
    {
        super.OnShow();
        this.__Couting=GM.CONTROLTIME;
        if(this.EFF_Tip!=null)
            this.EFF_Tip.runAction(cc.blink(1, 1).repeat(99));
    }
    Shoot()
    {
        GM.CANNON.SetPowerFill(this.PowerLooping.Now()).Shoot();
        //var _fs = this.PowerLooping.Now();

        this.Close();
    }
    __Couting=0;
    update (dt) 
    {

        //if(!this.IsShowing)return;

        // this.__Couting-=dt;

        // if(this.__Couting<=0)
        // {
        //     this.Shoot();
        //     return;
        // }
        // if(this.Couting!=null)
        // {         
        //     var ttt= this.__Couting.toFixed(0);
        //     if(ttt!=this.Couting.string && this.EFF_Counting!=null)
        //     {
        //         this.EFF_Counting.active=this.__Couting<5;
        //         var fss = this.__Couting<5?1:0.6;
        //         this.Couting.node.setScale(0,0,0);           
        //         this.Couting.node.runAction(cc.scaleTo(0.2,fss,fss).easing(cc.easeSineIn()));
    
        //         this.Couting.node.color = this.__Couting<5?cc.Color.RED:cc.Color.WHITE;

        //         this.Couting.string= ttt;
        //     }
          


        // }


        if(this.Yaw!=null && GM.CANNON!=null)
        {
            this.Yaw.string=GM.CANNON.Yawing.toFixed(0);
        }
        if(this.PowerNum!=null && GM.CANNON!=null)
        {
            
            this.PowerNum.string=Math.floor(GM.CANNON.Powering).toString();
        }
        if(this.Powering!=null && GM.CANNON!=null)
        {          
            this.Powering.fillRange= GM.CANNON.Powering/100;
        }





    }
}
