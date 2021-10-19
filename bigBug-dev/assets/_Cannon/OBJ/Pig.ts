// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseObj from "./BaseObj";
import { LiveState } from "../../__Lib/Base/LiveObj";
import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pig extends BaseObj {

    @property(cc.Label)
    label: cc.Label = null;
    @property
    Stable:number =10;
   
    _FSpeed:cc.Vec2=cc.Vec2.ZERO;
    start()
    {
        this._ReFloatA();
    }
    _nowFloat:number=0;

    _passed =0;
    _nextee =0;
    update (dt) 
    {
        super.update(dt);

       // if(this.State!=LiveState.osLiving ) return;

        this._FSpeed.y+= this._nowFloat*dt;

        if(Math.random()>0.6)
            this._FSpeed=this._FSpeed.add( GM.WA(this.Stable,0).mul(dt));
        else if(this._FSpeed.x!=0)
            this._FSpeed.x+= (this._FSpeed.x*this._FSpeed.x*dt) *  -1* this._FSpeed.x/Math.abs(this._FSpeed.x)  ;

        let _dpos =  this._FSpeed.mul(dt);

        this.node.position=this.node.position.add( cc.v3(_dpos));


        this._passed+=dt;

        if(this._passed>this._nextee)
        {
            this._ReFloatA();
            this._nextee= 1+2*Math.random();
            this._passed=0;
        }

    }

    _ReFloatA()
    {
        var y =400-this.GetWorldPosition().y;
        this._nowFloat =Math.abs(y)<40? 20- 40*Math.random():0.001*y*0.001*y  *  (50+50* Math.random());

  
    }
}
