
/**
 * Zy.
 * 2020-08-20.
 * 小车.
 */

import { _decorator, Component, Node, Vec3, ParticleSystemComponent, BoxColliderComponent, RigidBodyComponent, ICollisionEvent } from 'cc';
import { AudioManager } from './AudioManager';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener';
import { RunTimeData } from './RunTimeData';
import { RoadPoint, RoadMoveType, RoadPointType } from './RoadPoint';
const { ccclass, property } = _decorator;

@ccclass('Car')
export class Car extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: ParticleSystemComponent, tooltip: "汽车尾气粒子."})
    particle_ges: ParticleSystemComponent = null;

    private static tempVec: Vec3 = new Vec3();

    /** 当前路线点对象. */
    private _currentRoadPoint: RoadPoint = null;
    /** 起始点. */
    private _pointA: Vec3 = new Vec3();
    /** 结束点. */
    private _pointB: Vec3 = new Vec3();
    /** 速度. */
    private _currentSpeed: number = .1;
    /** 移动状态. */
    private _isMoving: boolean = false;
    /** 偏移量. */
    private _offset: Vec3 = new Vec3();
    /** 触摸状态. */
    private _touchState: boolean = false;
    /** 原始角度. */
    private _originRotation: number = 0;
    /** 目标角度. */
    private _targetRotation: number = 0;
    /** 中心点. */
    private _centerPoint: Vec3 = new Vec3();
    private _rotMeasure: number = 0;
    /** 玩家小车标记. */
    private _isMain: boolean = false;
    /** 是否订单中状态. */
    private _isInOrder: boolean = false;
    /** 加速度. */
    private _acceleration: number = .1;
    /** 是否刹车状态. */
    private _isBraking: boolean = false;
    /** 汽车尾气. */
    private _gesParticle: ParticleSystemComponent = null;
    private _overCallback: Function = null;
    private _camera: Node = null;

    public maxSpeed: number = 1;

    start() {
        // Your initialization goes here.

        CustomEventListener.on(Constants.EventName.FININSHED_WALK, this.onWalkFinished, this);
    }

    update(deltaTime: number) {
        // Your update function goes here.
        if (!this._isMoving || this._isInOrder) {
            return;
        }
        // 更新移动.
        this._offset = this.node.worldPosition;
        
        if (this._isMain) {
            this._currentSpeed += this._acceleration * deltaTime;
            if (this._currentSpeed > .5) {
                this._currentSpeed = .5;
            }
        }
        if (this._currentSpeed <= .001) {
            this._isMoving = false;
            if (this._isBraking) {
                this._isBraking = false;
                CustomEventListener.emit(Constants.EventName.END_BRAKING);
            }
        }

        switch (this._currentRoadPoint.moveType) {
            case RoadMoveType.LINE: // 直线.
                this.updateLine();
                break;
            case RoadMoveType.CURVE: // 转弯.
                this.updateCurve();
                break;
        }
        this.node.worldPosition = this._offset;
        Vec3.subtract(Car.tempVec, this._pointB, this._offset);
        // console.log(`===> car update ${this.node.worldPosition}, ${Car.tempVec}, ${this._pointB}, ${this._pointA}.`);
        if (Car.tempVec.length() <= 0.01) {
            this.arrivalStation();
        }
    }

    /** 直线更新位置. */
    updateLine() {
        const z = this._pointB.z - this._pointA.z;
        const x = this._pointB.x - this._pointA.x;
        if (z !== 0) {
            if (z > 0) {
                this._offset.z += this._currentSpeed;
                if (this._offset.z > this._pointB.z) this._offset.z = this._pointB.z;
            } else {
                this._offset.z -= this._currentSpeed;
                if (this._offset.z < this._pointB.z) this._offset.z = this._pointB.z;
            }
        } else if (x !== 0) {
            if (x > 0) {
                this._offset.x += this._currentSpeed;
                if (this._offset.x > this._pointB.x) this._offset.x = this._pointB.x;
            } else {
                this._offset.x -= this._currentSpeed;
                if (this._offset.x < this._pointB.x) this._offset.x = this._pointB.x;
            }
        }
    }

    /** 弯路更新位置. */
    updateCurve() {
        const offsetRotation = this._targetRotation - this._originRotation;
        const currentRotation = this.conversionAngle(this.node.eulerAngles.y);
        // (currentRotation - offsetRotation) 当前的进度值.
        // (this._currentSpeed * this._rotMeasure * 
        // (this._targetRotation > this._originRotation ? 1 : -1)) 当前帧运动的角度.
        let nextStation = (currentRotation - this._originRotation) + 
            (this._currentSpeed * this._rotMeasure * 
            (this._targetRotation > this._originRotation ? 1 : -1));
        if (Math.abs(nextStation) > Math.abs(offsetRotation)) {
            nextStation = offsetRotation;
        }
        let target = nextStation + this._originRotation;
        Car.tempVec.set(0, target, 0);
        this.node.eulerAngles = Car.tempVec;
        const sin = Math.sin(nextStation * Math.PI / 180);
        const cos = Math.cos(nextStation * Math.PI / 180);
        const xLength = this._pointA.x - this._centerPoint.x;
        const zLength = this._pointA.z - this._centerPoint.z;
        const xPos = xLength * cos + zLength * sin + this._centerPoint.x;
        const zPos = -xLength * sin + zLength * cos + this._centerPoint.z;
        this._offset.set(xPos, 0, zPos - 1);
    }

    public setEntry(entry: Node, isMain: boolean = false) {
        this.node.worldPosition = entry.worldPosition;
        this._currentRoadPoint = entry.getComponent(RoadPoint);
        this._isMain = isMain;
        if (!this._currentRoadPoint) { return console.log("===> _currentRoadPoint is null."); }
        this._pointA = entry.worldPosition;
        this._pointB = this._currentRoadPoint.nextStation.worldPosition;
        const z = this._pointB.z - this._pointA.z;
        const x = this._pointB.x - this._pointA.x;
        if (z !== 0) {
            if (z < 0) {
                this.node.eulerAngles = new Vec3();
            } else {
                this.node.eulerAngles = new Vec3(0, 180, 0);
            }
        } else if (x !== 0) {
            if (x > 0) {
                this.node.eulerAngles = new Vec3(0, 270, 0);
            } else {
                this.node.eulerAngles = new Vec3(0, 90, 0);
            }
        }
        const collider = this.node.getComponent(BoxColliderComponent);
        if (this._isMain) {
            if (this.particle_ges) {
                this.particle_ges.play();
            }
            // 监听碰撞回调.
            collider.on("onCollisionEnter", this.onCollisionEnter, this);
            // 设置碰撞分组.
            collider.setGroup(Constants.CarGroup.MAIN_CAR);
            // 设置碰撞掩码.
            collider.setMask(Constants.CarGroup.OTHER_CAR);
        } else {
            // 设置碰撞分组.
            collider.setGroup(Constants.CarGroup.OTHER_CAR);
            // 设置碰撞掩码.
            // collider.setMask(Constants.CarGroup.MAIN_CAR + Constants.CarGroup.NORMAL);
            // 所有组都检测的掩码 -1, 所有组都不检测的掩码 0.
            collider.setMask(-1);
        }
        this.resetPhysical();
    }

    public setCamera(camera: Node, pos: Vec3, angle: number) {
        if (this._isMain) {
            this._camera = camera;
            camera.parent = this.node;
            camera.position = pos;
            camera.eulerAngles = new Vec3(angle, 0, 0);
        }
    }

    /** 开始运动. */
    public startRuning() {
        if (this._currentRoadPoint) {
            this._isMoving = true;
            this._touchState = true;
            this._acceleration = .2;
        }
    }

    /** 停止运动. */
    public stopRuning() {
        this._acceleration -= .3;
        this._isMoving = false;
        this._touchState = false;
        this._isBraking = true;
        CustomEventListener.emit(Constants.EventName.START_BRAKING, this.node);
        AudioManager.playSound(Constants.AudioSource.STOP);
    }

    public moveAfterFinished(callback: Function) {
        this._overCallback = callback;
    }

    public stopImmediately() {
        this._isMain = false;
        this._currentSpeed = 0;
    }

    /** 到站. */
    private arrivalStation() {
        // console.log("=== 到达站点.", this._currentRoadPoint.nextStation);
        this._pointA = this._pointB;
        if (this._currentRoadPoint.nextStation) {
            this._currentRoadPoint = this._currentRoadPoint.nextStation.getComponent(RoadPoint);
            // console.log("nextStation: ", this._currentRoadPoint.nextStation);
            if (this._currentRoadPoint.pointType === RoadPointType.END) {
                this._acceleration = 0;
                this._currentSpeed = .1;
                CustomEventListener.emit(Constants.EventName.SHOW_COIN, this.node.worldPosition);
                CustomEventListener.emit(Constants.EventName.GAME_END);
            }
        }
        if (this._currentRoadPoint.nextStation) {
            this._pointB = this._currentRoadPoint.nextStation.worldPosition;
            if (this._isMain) {
                if (this._isBraking) {
                    this._isBraking = false;
                    CustomEventListener.emit(Constants.EventName.END_BRAKING);
                }
                if (this._currentRoadPoint.pointType === RoadPointType.GREETING) {
                    this.greetingCustomer();
                } else if (this._currentRoadPoint.pointType === RoadPointType.GOODBYD) {
                    this.goodbydCustomer();
                } else if (this._currentRoadPoint.pointType === RoadPointType.END) {
                    AudioManager.playSound(Constants.AudioSource.WIN);
                }
            }
            this.setCurveData();
        } else {
            this._isMoving = false;
            this._currentRoadPoint = null;
            this._overCallback && this._overCallback(this);
            this._overCallback = null;
            if (this._isMain) {
                CustomEventListener.emit(Constants.EventName.GAME_OVER);
            }
        }
    }

    /** 进入碰撞. */
    private onCollisionEnter(event: ICollisionEvent) {
        // console.log(`===> onCollisionEnter `, event);
        const other = event.otherCollider, otherBody = other.getComponent(RigidBodyComponent);
        if (otherBody) {
            otherBody.useGravity = true;
            otherBody.applyForce(new Vec3(0, 3000, -1500), new Vec3(0, 0.5, 0));
        }

        const self = event.selfCollider, selfBody = this.getComponent(RigidBodyComponent);
        self.addMask(Constants.CarGroup.NORMAL);
        selfBody.useGravity = true;

        this.gameOver();
    }

    private resetPhysical() {
        const body = this.getComponent(RigidBodyComponent);
        body.useGravity = false;
        body.sleep();
        body.wakeUp();
    }

    /** 接乘客. */
    private greetingCustomer() {
        this._isInOrder = true;
        RunTimeData.instance().isTakeOver = false;
        this._currentSpeed = 0;
        this.particle_ges.stop();
        CustomEventListener.emit(Constants.EventName.GREETING, this.node.worldPosition, this._currentRoadPoint.direction);
    }

    /** 送乘客. */
    private goodbydCustomer() {
        this._isInOrder = true;
        RunTimeData.instance().isTakeOver = true;
        RunTimeData.instance().currentProgress++;
        this._currentSpeed = 0;
        this.particle_ges.stop();
        CustomEventListener.emit(Constants.EventName.GOODBYD, this.node.worldPosition, this._currentRoadPoint.direction);
        CustomEventListener.emit(Constants.EventName.SHOW_COIN, this.node.worldPosition);
    }

    /** 乘客走路结束. */
    private async onWalkFinished() {
        this._isInOrder = false;
        this._isMoving = this._touchState;
        this._currentSpeed = .1;
        this.particle_ges && this.particle_ges.play();
        // console.log(`===> walk finished isInOrder: ${this._isInOrder}, isMoving: ${this._isMoving}, touchState: ${this._touchState}.`, );
    }

    /** 设置拐弯数据. */
    private setCurveData() {
        if (this._currentRoadPoint.moveType === RoadMoveType.CURVE) {
            // 转弯.
            this._originRotation = this.conversionAngle(this.node.eulerAngles.y);
            if (this._currentRoadPoint.clockwise) {
                this._targetRotation = this._originRotation - 90;
                if ((this._pointB.z < this._pointA.z && this._pointB.x > this._pointA.x) ||
                    (this._pointB.z > this._pointA.z && this._pointB.x < this._pointA.x)) {
                    this._centerPoint.set(this._pointB.x, 0, this._pointA.z);
                } else {
                    this._centerPoint.set(this._pointA.x, 0, this._pointB.z);
                }
            } else {
                this._targetRotation = this._originRotation + 90;
                if (this._pointB.z > this._pointA.z && this._pointB.x > this._pointA.x ||
                    (this._pointB.z < this._pointA.z && this._pointB.x < this._pointA.x)) {
                    this._centerPoint.set(this._pointB.x, 0, this._pointA.z);
                } else {
                    this._centerPoint.set(this._pointA.x, 0, this._pointB.z);
                }
            }
            Vec3.subtract(Car.tempVec, this._pointA, this._centerPoint);
            let radiu = Car.tempVec.length();
            this._rotMeasure = 90 / (Math.PI * radiu / 2);
        }
    }

    /** 游戏结束. */
    private gameOver() {
        this._isMoving = false;
        this._currentSpeed = 0;
        CustomEventListener.emit(Constants.EventName.GAME_OVER);
    }

    /** 角度转换为正值. */
    private conversionAngle(value: number): number {
        return value <= 0 ? value += 360 : value;
    }
}
