// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Constant extends cc.Component {

    @property(cc.Rect)
    Bound :cc.Rect;


    __LastPos =cc.Vec3.ZERO;
    update (dt)
    {
        this.__LastPos =this.node.position;     
    }
    lateUpdate(dt)
    {
        let pos= this.node.position;

        if(pos.x<this.Bound.xMin)
            pos.x=this.Bound.xMin;
        if(pos.x>this.Bound.xMax)
            pos.x=this.Bound.xMax;    

        if(pos.y<this.Bound.yMin)
            pos.y=this.Bound.yMin;
        if(pos.y>this.Bound.yMax)
            pos.y=this.Bound.yMax;  

        this.node.position=pos;
    }
}
