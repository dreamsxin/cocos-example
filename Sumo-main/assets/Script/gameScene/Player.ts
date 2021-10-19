
import { _decorator, Component, Vec3, Node, macro, SkeletalAnimationComponent, BoxCollider, ICollisionEvent, RigidBodyComponent } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Player
 * DateTime = Fri Sep 24 2021 14:15:01 GMT+0530 (India Standard Time)
 * Author = shashankA
 * FileBasename = Player.ts
 * FileBasenameNoExtension = Player
 * URL = db://assets/Script/Player.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
const CELL_TIME = 0.016;
const SPEED = 4;
const BUMPVALUE = 4;
const enum STATE  {
    IDLE,
    WALK,
    BUMP,
}

@ccclass('Player')
export class Player extends Component {


    @property({ type: Node })
    playerCamera: Node = null;
    private _currentPlayerPosition: Vec3 = Vec3.ZERO;
    private _vector: Vec3 = Vec3.ZERO;
    private _vectorAngle: Vec3 = Vec3.ZERO;
    private _now_time = 0;
    private _skeletal: SkeletalAnimationComponent;
    private _currentState = STATE.IDLE;
    
    start() {
        this._skeletal = this.node.getComponent(SkeletalAnimationComponent);
        this._skeletal.play('Armature|idle');


        const collider = this.node.getComponent(BoxCollider)!;
        collider.on('onCollisionEnter', this._onCollisionEnter, this);
    }

    private _onCollisionEnter(event: ICollisionEvent) {
        const otherCollider = event.otherCollider;
        if(otherCollider.node.name === 'platform'){
            return;
        }
        console.log("COLLIDED ------- "+this._currentPlayerPosition);
        console.log("COLLIDED ------- "+this._vector.x+"    "+this._vector.y);
        this._currentState = STATE.BUMP;
        this.getComponent(RigidBodyComponent).applyImpulse(new Vec3(this._vector.x* BUMPVALUE * -1, 0, this._vector.y* BUMPVALUE ));


        setTimeout(() => {
            this.getComponent(RigidBodyComponent).clearVelocity();
            this._currentState = STATE.IDLE;
          }, 1000);


        // const otherRigidBody = otherCollider.node.getComponent(RigidBody)!;
        // otherRigidBody.useGravity = true;
        // otherRigidBody.applyForce(new Vec3(0, 3000, -1500), new Vec3(0, 0.5, 0));

        // const collider = event.selfCollider;
        // collider.addMask(Constants.CarGroup.NORMAL);
        // const rigidBody = this.node.getComponent(RigidBody)!;
        // rigidBody.useGravity = true;
        // this._runState = RunState.CRASH;
        // AudioManager.playSound(Constants.AudioSource.CRASH);
        // CustomEventListener.dispatchEvent(EventName.GAME_OVER);
    }

    touchCallBack(vector: Vec3, angle: number) {
        Vec3.rotateZ(vector, vector, Vec3.ZERO, this.playerCamera.eulerAngles.y * macro.RAD);
        this._vector = vector.normalize();
        if (angle) {
            this.node.eulerAngles = new Vec3(0, angle + 90 + this.playerCamera.eulerAngles.y, 0);
        }
    }

    touchAngleCallBack(vector: Vec3, angle: number) {
        this._vectorAngle = vector.normalize();
    }

    fix_update(dt: number) {
        if(this._currentState == STATE.BUMP)
            return;
        if (this._vector.lengthSqr() > 0) {
            if(this._currentState == STATE.IDLE){
                this._currentState = STATE.WALK;
                this._skeletal.play('Armature|walk');
            }
            this.node.setPosition(this.node.position.add3f(this._vector.x * SPEED * dt, 0, -this._vector.y * SPEED * dt));

            this._currentPlayerPosition = new Vec3(this._vector.x,0,this._vector.y);

            this.playerCamera.setPosition(this.playerCamera.position.add3f(this._vector.x * SPEED * dt, 0, 0));
        }
        else{
            if(this._currentState == STATE.WALK){
                this._currentState = STATE.IDLE;
                this._skeletal.play('Armature|idle');
            }
        }

        if (this._vectorAngle.lengthSqr() > 0) {
            this.playerCamera.eulerAngles = this.playerCamera.eulerAngles.add3f(0, -this._vectorAngle.x, 0);
        }
    }

    update(deltaTime: number) {
        this._now_time += deltaTime;
        // this.fix_update(CELL_TIME);
        while (this._now_time >= CELL_TIME) {
            this.fix_update(CELL_TIME);
            this._now_time -= CELL_TIME;
        }
    }
}