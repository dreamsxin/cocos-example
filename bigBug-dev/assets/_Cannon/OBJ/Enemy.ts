// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Cannon from "./Cannon";
import ClockObj from "./ClockObj";
import { LiveState } from "../../__Lib/Base/LiveObj";
import GM from "../GM";
import Unit from "./Unit";
import BaseObj from "./BaseObj";




    const {ccclass, property} = cc._decorator;

    @ccclass
    export default class Enemy extends Unit {
    
        @property
        Eatablity=1;

        // LIFE-CYCLE CALLBACKS:
    
        // onLoad () {}
        _InEating=false;

        private __last=0;
        private __passed=0;

        Pausing(){return GM.INCONTROLING;}
        
        _Eating(dt)
        {
            if(this.Pausing())return;

            this._InEating=true;
            this.__passed+=dt;
            if(this.__passed<2)
            {
                return;
            }

            this.__passed-=2;
       
            this._NowEatable.Hurt(this.Eatablity);

        }

        _HomeDist()
        {
            var _dist=  cc.Vec2.distance(this.GetWorldPosition(),GM.HOME.GetWorldPosition());
            return  _dist;
        }

        update (dt) 
        {
            if(this.Pausing())return;
            
            if(this._NowEatable!=null)
            {
                if(this._NowEatable.State!= LiveState.osLiving)
                {
                    this._NowEatable=null;
                    return;
                }
                this._Eating(dt);
                return;
            }
            super.update(dt);
        }
        _NowEatable:BaseObj
        AddEat(obj)
        {
            this._NowEatable=obj;
        }
    }


