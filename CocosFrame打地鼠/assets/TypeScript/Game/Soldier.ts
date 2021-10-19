import { Util } from "../System/Util";
import Pool from "./Pool";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


const {ccclass, property} = cc._decorator;

@ccclass
export default class Soldier extends cc.Component {
    @property(cc.Node)
    planet:cc.Node;

    @property(Pool)
    bulletPool: Pool = null;
    
    rad:number = 0;
    public targetRad = 0;
    public speed = 0.01;
    start(){
        let vec = this.node.position.sub(this.planet.position);
        this.targetRad = this.rad = Util.radian(vec);
    }
    public MoveByLen(len){
        let r = this.node.position.sub(this.planet.position).mag();
        let rad = len/r;    //弧度
        this.MoveByRad(rad);
    }
    public MoveByRad(rad){
        let r = this.node.position.sub(this.planet.position).mag();
        this.rad += rad;
        let vec = cc.v2(Math.cos(this.rad), Math.sin(this.rad)).mul(r);
        this.node.position = this.planet.position.add(vec);
        this.node.angle = Util.angle(vec)-90;
    }
    public update(dt){
        if(Math.abs(this.rad - this.targetRad) > this.speed){
            if(this.rad < this.targetRad){
                this.MoveByRad(this.speed);
            }else{
                this.MoveByRad(-this.speed);
            }
        }
    }
}
