// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Enemy from "./Enemy";
import Body from "./Body";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Teech extends cc.Component {

    _Owner:Enemy;
     onLoad () 
    {
        this._Owner=this.node.parent.getComponent(Enemy);
        if(this._Owner==null)
            this.enabled=false;
    }

    onCollisionEnter(other:cc.Collider ,self:cc.Collider)
    {
        console.log("onCollisionEnter:"+other.node.name+":"+self.node.name);
        
        let _body= other.node.getComponent(Body);
        if(_body!=null && _body.Owner!=null)
        {
            this._Owner.AddEat(_body.Owner);

            console.log("Teech:" +_body.Owner.name);
        }       
    }
}
