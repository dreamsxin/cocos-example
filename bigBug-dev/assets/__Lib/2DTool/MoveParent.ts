// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MoveSub from "./MoveSub";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MoveParent extends cc.Component {

    _Subs :MoveSub[];
    
    onLoad () 
    {
        this._Subs=this.node.getComponentsInChildren(MoveSub);
    }
    _DoSubMove(dpos)
    {
        if(this._Subs!=null)
        {
            this._Subs.forEach(w=>
                {
                    w.DoMove(dpos)

                })
        }

    }
    start()
    {
        this.__LastPos=this.node.position;
    }
    __LastPos=cc.v3(0,0,0);
    lateUpdate(dt)
    {

        var dpos = this.__LastPos.sub(this.node.position);
        this._DoSubMove(dpos);
        this.__LastPos=this.node.position;
    }
}
