// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Body from "./Body";
import Cannon from "./Cannon";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BodyCannon extends Body {



    // LIFE-CYCLE CALLBACKS:
    _Cannon:Cannon;
    onLoad () 
    {
        this._Cannon=this.node.parent.getComponent(Cannon);
        if(this._Cannon!=null)
        {
            this.node.on(cc.Node.EventType.TOUCH_START,this.onMouseDown,this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onMouseMove,this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseUp, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        }

    }
    _Yawing:boolean=false;
    _InitTouch:cc.Vec2;
    onMouseDown(event)
    { 
       this._InitTouch = event.getLocation();
       this._Yawing=true;
    }
    onMouseUp()
    {
        this._Yawing=false;

    }
    onMouseMove(event)
    {
        if(! this._Yawing)   return;
        let _pos:cc.Vec2 =event.getLocation();
        if(cc.Vec2.distance(_pos,this._InitTouch )<20)   return;

        let _dir =_pos.sub(this._InitTouch).normalize();
        let a =_dir.angle(cc.Vec2.RIGHT);
        this._Cannon.SetYaw(a*180/3.14);
    }
    start () 
    {

    }

    // update (dt) {}
}
