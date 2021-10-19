// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import OO from "./OO";
import BaseObj from "./BaseObj";
import Edge from "./Edge";
import Cannon from "./Cannon";
import OBJ from "../../__Lib/Base/OBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Body extends OBJ {



    // LIFE-CYCLE CALLBACKS:

    Owner:BaseObj;
     onLoad () 
    {
        this.Owner=this.node.parent.getComponent(BaseObj);
        this.node.position
    }


    onCollisionEnter(other:cc.Collider ,self:cc.Collider)
    {
        console.log("onCollisionEnter:"+other.node.name+":"+self.node.name);
        
        let _edge= other.node.getComponent(Edge);
        if(_edge!=null && this.Owner!=null)
        {
            if(!_edge.AttackyAll &&  !this.Owner.IsEnamy)
                return ;
            let att = _edge.Attack(this.GetWorldPosition());
            let denf = this.Owner.Denf;
            var dd= denf/(100+denf);
            var hp = att*( 1-dd);

            if(this.Owner!=null) 
                this.Owner.Hurt(hp);
            //威力
            //let power= 
            console.log("att：" +Math.ceil(att));


        }       
    }
    // update (dt) {}
}
