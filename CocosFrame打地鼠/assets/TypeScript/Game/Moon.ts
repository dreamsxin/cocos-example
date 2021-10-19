import Planet from "./Planet";
import { threadId } from "worker_threads";
const {ccclass, property} = cc._decorator;
export enum MoonState{
    Aim,        //瞄准阶段
    Launched,   //已起飞阶段
    Captured,   //被捕获阶段（进入了行星引力范围，但是还没公转）
    Rotate,     //开始公转
}
@ccclass
export default class Moon extends Planet {
    @property(cc.Node)
    arrow:cc.Node = null;

    public moonState:MoonState = MoonState.Rotate;
    private capturer:Planet = null;

    public onLoad(){
        super.onLoad();
        this.arrow.active = false;
    }
    public update(dt){
        super.update(dt);
        if(this.arrow.active){
            //this.arrow.angle = this.direction*180/Math.PI;
        }
        if(this.capturer && this.moonState == MoonState.Captured){
            let vec1 = cc.v2(Math.cos(this.direction), Math.sin(this.direction));   //月球飞行向量
            let vec2 = this.capturer.node.position.sub(this.node.position);         //月球指向中心天体向量
            if(vec1.angle(vec2) > Math.PI/2){
                this.moonState = MoonState.Rotate;
                let vec31 = cc.v3(vec1);
                let vec32 = cc.v3(vec2);
                this.RotatAround(this.capturer.node, vec31.cross(vec32).z > 0);     //根据叉乘结果判断顺逆时针
            }
        }
    }
    public setArrowDir(angle){
        this.arrow.angle = angle;
    }
    //瞄准
    public aim(){
        this.moonState = MoonState.Aim;
        this.arrow.active = true;
    }
    //发射
    public launch(){
        this.moonState = MoonState.Launched;
        this.arrow.active = false;
        this.capturer = null;
        this.MoveTowards(this.arrow.angle*Math.PI/180);
    }
    //被捕获
    public captured(capturer:Planet){
        this.capturer = capturer;
        this.moonState = MoonState.Captured;
        this.arrow.active = false;
        this.MoveTowards(this.direction);
    }
}
