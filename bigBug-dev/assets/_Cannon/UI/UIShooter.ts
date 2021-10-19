// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIOBJ from "../../__Lib/Base/UIOBJ";
import Shooter from "../OBJ/Shooter/Shooter";
import OO from "../OBJ/OO";
import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIShooter extends UIOBJ {

    @property (cc.Color)
    ColorSelect:cc.Color;
    @property (cc.Color)
    ColorUnSelect:cc.Color;

    @property(cc.Node)
    BOUND: cc.Node = null;

    @property(cc.Node)
    ForAnim: cc.Node = null;



    @property(cc.Sprite)
    ICON: cc.Sprite = null;
    @property(cc.Label)
    NAME: cc.Label = null;

    ShootNum :number;

    Shooter:  Shooter ;
    onLoad () 
    {
         this.node.on(cc.Node.EventType.TOUCH_END,this.Select,this);
         this.UnSelect();
    }
    Set(num,sh:  Shooter):UIShooter
    {
        if(sh==null)
        {
            this.node.active=false; return;
        }
        if(this.Shooter==sh)    return;

        this.ShootNum =num;
        this.Shooter =sh;

        if(this.ICON!=null && this.Shooter!=null)
            this.ICON.spriteFrame = this.Shooter.GetICON();

        if(this.NAME!=null && this.Shooter!=null)
            this.NAME.string = this.Shooter.MOD.name;

        return this;
    }
    Select():UIShooter
    {
        this._ONSelect?.call(this,this);
        if(this.BOUND!=null)this.BOUND.color= this.ColorSelect;
        if(this.ForAnim!=null) this.ForAnim.runAction(cc.scaleTo(0.1,1.0,1.0));
        return this;
    }
    UnSelect():UIShooter
    {
        if(this.BOUND!=null)this.BOUND.color= this.ColorUnSelect;
        if(this.ForAnim!=null) this.ForAnim.runAction(cc.scaleTo(0.1,.8,.8));
        return this;
    }

    _ONSelect:Function;
    WaitSelect(on:(UIShooter)=>void):UIShooter
    {   
        this._ONSelect = on;
        return this;
    }

 
}
