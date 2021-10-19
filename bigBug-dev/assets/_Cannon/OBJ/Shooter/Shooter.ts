// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OO from "../OO";
import OBJ from "../../../__Lib/Base/OBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shooter extends OBJ {

    @property(cc.Prefab)
    MOD: cc.Node = null;
    @property(cc.SpriteFrame)
    ICON: cc.SpriteFrame = null;
    @property
    CD = 10;

    private _Colding=0;

    CDing():number
    {
        return this.CD<=0? 0:this._Colding/this.CD;
    }
    GetICON():cc.SpriteFrame
    {
        return this.ICON;
    }

    Shoot(Speed:cc.Vec2):OO
    {
        if(this.CDing()>0)     return null;

        if(this.MOD==null)  return null;

        this._Colding=this.CD;

        var _new=cc.instantiate(this.MOD);
        _new.setParent( cc.director.getScene());

        var oo:OO =_new.getComponent(OO);

        oo?.Set(Speed).SetWorldPosition(this.GetWorldPosition().add(Speed.normalize().mul(30)));

        return oo;
    }

    update(dt)
    {
        if(this._Colding<=0)        return;

        this._Colding-=dt;

        if(this._Colding<0) this._Colding=0;
    }
}
