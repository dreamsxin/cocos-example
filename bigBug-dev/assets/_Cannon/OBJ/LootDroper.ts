// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LootDroper extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {

    }
    _MOD:cc.Node ;
    _Count:number;
    _From:cc.Vec2 ;
    _To:cc.Vec2;
    _Counted=0;
    _Passed=0;
    update (dt) 
    {
        if(this._MOD==null)
        {
            this._End();return;
        }


        this._Passed+=dt;
        if(this._Passed<0.2)    return;
          
        this._Counted++;
        this._Passed=0;
        if(this._Counted>this._Count)
        {          
            this._End();return;
        }
        
        this._DropOne(); 
 
        
    }
    _DropOne()
    {
        var one=   cc.instantiate(this._MOD);
        one.setParent(cc.director.getScene());
        one.position =cc.v3( this._From);

        var bezier = [cc.v2(0, 300*(0.5-Math.random())), cc.v2(300-500*Math.random(), -300), cc.v2(0, 560)];
        var bezierForward = cc.bezierBy(2, bezier);

       
        one.runAction(bezierForward);

    }
    _End()
    {
        this.destroy();
    }
    Set(mod,count):LootDroper
    {
        this._MOD=mod;
        this._Count =count;
        this._Counted=0;
        this._Passed=9999;
        return this;
    }
    SetPos(from,to):LootDroper
    {
        this._From=from;this._To=to;
        return this;
    }

    static ADD(node:cc.Node):LootDroper
    {
        return node.addComponent(LootDroper);
    }
}
