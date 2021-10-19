import { Util } from "../System/Util";

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
export enum MoveMode{
    Rotate,
    Linear,
}
@ccclass
export default class Planet extends cc.Component {
    @property(cc.Node)
    public centerNode:cc.Node = null;
    @property
    public range:number = 100;      //引力范围
    @property
    public speed:number = 0;        //线速度
    public direction:number = 0;    //移动方向（标准极坐标系下的角度）
    public height:number = 0;       //高度（到中心行星的距离）
    public radian:number = 0;        //角度（以中心行星为极点，本行星所在的角度）
    public clockwise:boolean = true;//公转是否是顺时针
    public moveMode:MoveMode = MoveMode.Linear; //移动方式
    public onLoad(){
        let graphics = this.node.getComponentInChildren(cc.Graphics);
        if(graphics){
            graphics.fillColor = cc.color(0, 0, 255, 60);
            graphics.circle(0, 0, this.range);
            graphics.fill();
        }
    } 
    public update(dt){
        switch(this.moveMode){
            case MoveMode.Linear:{
                if(this.speed == 0) return;
                this.node.x += dt * this.speed * Math.cos(this.direction);
                this.node.y += dt * this.speed * Math.sin(this.direction);
                break;
            }
            case MoveMode.Rotate:{
                if(this.speed == 0) return;
                //this.height-=0.2;
                let deltaAngle = (this.clockwise?1:-1) * this.speed * dt / this.height;
                this.radian += deltaAngle;
                let oldPos = this.node.position;
                this.node.x = this.centerNode.x + this.height * Math.cos(this.radian);
                this.node.y = this.centerNode.y + this.height * Math.sin(this.radian);
                let vec = this.node.position.sub(oldPos);
                this.direction = Util.radian(vec);
                break;
            }
        }
    }
    public MoveTowards(dir){
        this.direction = dir;
        this.moveMode = MoveMode.Linear;
    }
    public RotatAround(target:cc.Node, isClockwise = true){
        this.moveMode = MoveMode.Rotate;
        this.centerNode = target;
        this.clockwise = isClockwise;
        let vec = this.node.position.sub(target.position);
        this.height = vec.mag();
        this.radian = Util.radian(vec);
    }

}
