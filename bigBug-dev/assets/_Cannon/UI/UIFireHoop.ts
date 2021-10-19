// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFireHoop extends cc.Component {


    @property
    MAX=2;

    @property(cc.Color)
    From: cc.Color = cc.Color.YELLOW;
    @property(cc.Color)
    To: cc.Color = cc.Color.RED;
    @property(cc.Node)
    Bound:cc.Node=null;
    @property(cc.Node)
    Hoop:cc.Node=null;

    @property(cc.Node)
    EFF_Begin:cc.Node=null;

    _Power=0;
    // LIFE-CYCLE CALLBACKS:
    _Mousing=false;
    onLoad () 
    {
        this.node.on(cc.Node.EventType.TOUCH_START,this.Begin,this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.Go, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.Cancel, this);
    }
    Begin()
    {
        this.Reset();
        this._Mousing=true;
        if(this.EFF_Begin)
        {
            var eff= cc.instantiate(this.EFF_Begin);
            eff.setParent(this.node);
            eff.active=true;
        }

    }
    Go()
    {     
        
        GM.CANNON.SetPowerFill(this.Percent()).Shoot();

        this._Mousing=false;
        this.Reset();//GM.CANNON.SetPowerFill(this.PowerLooping.Now()).Shoot();

    }
    Cancel()
    {
        this._Mousing=false;
        this.Reset();
    }
    Reset () 
    {
        this._Passed=1;
        this._Power=0;
        this._NNN =0;     
       
        this.Bound.stopAllActions();
        this.Bound.scale=1;  
    }
    Percent(){return !this._Mousing?0: this._Power/this.MAX ;}
    _Passed=0;
    _NNN=0;
    update (dt) 
    {
        if(!this._Mousing)   return;
        this._Passed+=dt;
        this._Power+=dt;

        if(this._Power>=this.MAX)  this._Power=this.MAX;

        this.Bound.scale=1+1*this.Percent();

        var dd = 0.3-0.02*this._NNN;
        if(dd<0.1) dd=0.1;
        if(this._Passed>dd)
        {
            this._NNN++;
            var hoop= cc.instantiate(this.Hoop);
            hoop.setParent(this.node);hoop.active=true;
            hoop.runAction(cc.scaleTo(dd*3,5,5));
            hoop.color= cc.Color.lerp(hoop.color,this.From,this.To,this.Percent() );
            this._Passed=0;
        }
    }
}
