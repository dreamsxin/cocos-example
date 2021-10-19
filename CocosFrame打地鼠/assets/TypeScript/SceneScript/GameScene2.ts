import Scene from "../System/Scene";
import Planet from "../Game/planet";
import { Util } from "../System/Util";
import Moon from "../Game/Moon";
import Panel from "../System/Panel";
import PanelManager from "../System/PanelManager";
import Pool from "../Game/Pool";
import Soldier from "../Game/Soldier";
import Bullet from "../Game/Bullet";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene2 extends Scene {
    @property(cc.Node)
    world: cc.Node = null;

    @property(cc.Node)
    planet: cc.Node = null;

    @property(Soldier)
    soldier: Soldier = null;

    @property(cc.Node)
    gun: cc.Node = null;

    @property(Pool)
    bulletPool: Pool = null;

    @property
    speed: number = 40;

    @property
    ROF: number = 3;


    private touching:boolean = false;
    private touchPos:cc.Vec2 = null;
    private targetAngle = 0;
    private timer = 0;
    public onLoad(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)  
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)  
        this.targetAngle = this.world.angle;
    }
    public onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)  
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this)  
    }
    public start(){

    }
    public update(dt){
        if(this.touching){
            this.targetAngle += this.speed*dt* (this.touchPos.x < this.node.width/2?-1:1);
            this.soldier.targetRad -= this.speed*dt* (this.touchPos.x < this.node.width/2?-1:1)*Math.PI/180;
        }
        this.world.angle = Util.lerp(this.world.angle, this.targetAngle, 0.05);
        this.timer += dt;
        if(this.timer>=1/this.ROF){
            this.timer = 0;
            let bullet = this.bulletPool.getInstance();
            this.world.addChild(bullet);
            let pos:any = this.gun.convertToWorldSpaceAR(cc.Vec2.ZERO);
            bullet.position = this.world.convertToNodeSpace(pos);
            //bullet.getComponent(Bullet).dir = Util.radToVec2(this.);
        }
    }

    private onTouchStart(e:cc.Event.EventTouch){
        this.touching = true;
        this.touchPos = e.getLocation();
    }
    private onTouchMove(e:cc.Event.EventTouch){
        this.touchPos = e.getLocation();
    }
    private onTouchEnd(e:cc.Event.EventTouch){
        this.touching = false;
    }
    private onGameOverBtnTap(){

    }
}
