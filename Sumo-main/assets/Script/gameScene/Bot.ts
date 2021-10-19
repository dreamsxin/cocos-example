
import { _decorator, Component, Node, Vec3, SkeletalAnimationComponent, macro } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Bot
 * DateTime = Wed Oct 06 2021 13:10:22 GMT+0530 (India Standard Time)
 * Author = sushant
 * FileBasename = Bot.ts
 * FileBasenameNoExtension = Bot
 * URL = db://assets/script/Player/Bot/Bot.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
const CELL_TIME = 0.016;
const SPEED = 2;
const MAXDISTANCE = 2;
const enum STATE  {
    IDLE,
    WALK,
    BUMP,
}
 
@ccclass('Bot')
export class Bot extends Component {
    
    
    @property({ type: Node })
    public player = null;

    private _now_time = 0;
    private _movement: Vec3 = Vec3.ZERO;
    private _skeletal: SkeletalAnimationComponent;
    private _currentState = STATE.IDLE;

    start () {
        this._skeletal = this.node.getComponent(SkeletalAnimationComponent);
        this._skeletal.play('Armature|idle');

        /* setInterval(() => {
            let direction = new Vec3(this.player.getPosition().x - this.node.getPosition().x,this.player.getPosition().y - this.node.getPosition().y,this.player.getPosition().z - this.node.getPosition().z);

            let angle = (Math.atan2(direction.x,direction.z)) * 180 / Math.PI;   
            this.node.eulerAngles = new Vec3(0, angle, 0);
        }, 500); */
    }

    update (deltaTime: number) {
        
        this._now_time += deltaTime;
        // this.fix_update(CELL_TIME);
        while (this._now_time >= CELL_TIME) {
            this.fix_update(CELL_TIME);
            this._now_time -= CELL_TIME;
        }


        let direction = new Vec3(this.player.getPosition().x - this.node.getPosition().x,this.player.getPosition().y - this.node.getPosition().y,this.player.getPosition().z - this.node.getPosition().z);

        let angle = (Math.atan2(direction.x,direction.z)) * 180 / Math.PI;   
        this.node.eulerAngles = new Vec3(0, angle, 0);


        let distance = this.getDistance(this.player.getPosition().x,this.player.getPosition().z,this.node.getPosition().x,this.node.getPosition().z);
        if(distance > MAXDISTANCE)
        {
            direction.normalize();
            this._movement = direction;
            if(this._currentState == STATE.IDLE){
                this._currentState = STATE.WALK;
                this._skeletal.play('Armature|walk');
            }
        }
        else{
            this._movement = Vec3.ZERO;
            if(this._currentState == STATE.WALK){
                this._currentState = STATE.IDLE;
                this._skeletal.play('Armature|idle');
            }
        }
    }

    getDistance(xA: number, yA: number, xB: number, yB: number) { 
        let xDiff = xA - xB; 
        let yDiff = yA - yB; 
    
        return Math.sqrt( Math.pow(xDiff,2) +  Math.pow(yDiff,2));
    }

    fix_update(dt: number) {
        this.node.setPosition(this.node.position.add3f(this._movement.x * SPEED * dt, 0, this._movement.z * SPEED * dt));
    }
}