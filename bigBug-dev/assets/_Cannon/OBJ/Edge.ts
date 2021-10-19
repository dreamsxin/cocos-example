// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import LiveObj from "../../__Lib/Base/LiveObj";



const {ccclass, property} = cc._decorator;

@ccclass
export default class Edge extends LiveObj
 {
     @property
     DDTime=0.1;

    ATTMax:number;
    ATT :number;
    Speed:cc.Vec2;
    AttackyAll:boolean=false;
    
    Set(_att:number,_all:boolean=false):Edge
    {
        this.ATT=this.ATTMax=_att;
        this.AttackyAll=_all;
        return this;
    }
    SetSpeed(_speed:cc.Vec2):Edge
    {
        this.Speed=_speed;
        return this;
    }



    update(dt)
    {
        super.update(dt);

        if(this.DDTime>0)
        {
            let pp = this.Lifing/this.DDTime;
            this.ATT=this.ATTMax*(1- pp/(1+pp));
        }             
    }

    Attack(wpos :cc.Vec2):number
    {

        // 入射速度
        let vpp=this.Speed.mag();

     
        //计算入射角度
        let dir:cc.Vec2 = cc.v2( wpos.sub(this.GetWorldPosition()));
        let radian = this.Speed.signAngle(dir);//获得带方向的夹角弧度值(参考方向顺时针为正值，逆时针为负值)
        let degree =cc.misc.radiansToDegrees(radian);




        return  Math.pow( Math.cos(radian),2)*this.ATT;
    }

}
