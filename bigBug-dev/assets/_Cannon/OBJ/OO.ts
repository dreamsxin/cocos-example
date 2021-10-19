// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import GM from "../GM";
import Edge from "./Edge";
import CSBase from "../../__Lib/CS/CSBase";
import LiveObj from "../../__Lib/Base/LiveObj";



    const {ccclass, property} = cc._decorator;

    @ccclass
    export default  class OO extends LiveObj {
    
        @property
        UponDir = false;
    
        @property
        ATT: number = 900;

        @property 
        AllAttacky=false;

        @property
        DeadStrick: number = 0.05;

        @property
        Stable:number =100;


        @property(cc.Node)
        Edge: cc.Node = null;



        @property(cc.Prefab)
        Eff_D: cc.Node = null;
    
        // LIFE-CYCLE CALLBACKS:
    
        // onLoad () {}
        Speed:cc.Vec2;

        Set(_speed:cc.Vec2):OO
        {
            this.Speed =_speed;
            return this;
        }
        Reset(_speed:cc.Vec2):OO
        {

            return this;
        }

        OnDead()
        {
            super.OnDead();

            let _ob=   cc.instantiate(this.Edge);
            let _edge= _ob!=null?_ob.getComponent(Edge):null;

            if(_edge!=null)
            {
                _edge.node.parent=cc.director.getScene();
                _edge.Set(this.ATT,this.AllAttacky).SetSpeed(this.Speed).SetWorldPosition(this.GetWorldPosition());
                _edge.node.active=true;
            }




            return this;
        }



        
        update (dt) 
        {
    
            this.Speed=this.Speed.add( cc.v2(0,GM.G*dt));

            this.Speed=this.Speed.add( GM.WA(this.Stable,0).mul(dt));





            let _dpos =  this.Speed.mul(dt);

            let _newpos=this.node.position.add(cc.v3(_dpos)  );

            this.node.setPosition(_newpos);


            if(this.UponDir)
            {
                var a= cc.Vec2.UP.signAngle(this.Speed)*180/3.14;
                this.node.angle = a;
            }

            if(this.node.position.y<-1000)
            {
               this.Dead();
            }

           // console.log("OO.Speed:" +this.Speed.mag());
        }



        onCollisionEnter(other:cc.Collider ,self:cc.Collider)
        {
            console.log("OO.onCollisionEnter:"+other.node.name+":"+self.node.name);
            
            this.scheduleOnce(this.Dead,this.DeadStrick);

            if(this.Eff_D!=null)
            {
                var eff=cc.instantiate(this.Eff_D);
                eff.setParent(cc.director.getScene());

                eff.position=cc.v3( this.GetWorldPosition());
            }
        }
    }   


