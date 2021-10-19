// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OBJ from "./OBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Follow extends cc.Component {

    @property
    FollowDuration=1;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {

    }
    _tweener:cc.ActionInterval;
    PosTo(pos:cc.Vec2)
    {

        if(this._tweener!=null)  this.node.stopAction(this._tweener);   

        var ppos= this.node.parent.convertToNodeSpaceAR<cc.Vec2>(pos);


        this._tweener=cc.moveTo(this.FollowDuration, ppos );

        this.node.runAction( this._tweener);
    }

    __Followed:OBJ;
    Follow(who:OBJ)
    {
        this.__Followed=who;
        this.__passed=9999;
    }

    __PostoFollowed(who:OBJ)
    {
        if(who!=null && who.node!=null)
        {           
            var ppos= this.node.parent.convertToNodeSpaceAR<cc.Vec2>(who.GetWorldPosition());
            this.node.position=this.node.position.lerp(cc.v3(ppos),1);
        }else
        {
            this.__Followed=null;
        }
    }
    __passed =0;
    update(dt)
    {
        this.__PostoFollowed(this.__Followed);
    }

}
