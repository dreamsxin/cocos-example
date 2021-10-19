
/**
 * Zy.
 * 2020-08-20.
 * 乘客管理.
 */

import { _decorator, Component, Node, Vec3, math, AnimationComponent } from 'cc';
import { AudioManager } from './AudioManager';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener';
const { ccclass, property } = _decorator;

@ccclass('CustomerManager')
export class CustomerManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: [Node], tooltip: "乘客数组."})
    customers: Node[] = [];

    @property({tooltip: "移动速度."})
    walkTime: number = 2;

    private static _tempVec: Vec3 = new Vec3();

    /** 当前的乘客. */
    private _currentCustomer: Node = null;
    private _startPos: Vec3 = new Vec3();
    private _endPos: Vec3 = new Vec3();
    private _inTheOrder: boolean = false;
    private _deltaTime: number = 0;
    private _state = Constants.CustomerState.NONE;

    start () {
        // Your initialization goes here.

        CustomEventListener.on(Constants.EventName.GREETING, this.onGreetingEvent, this);
        CustomEventListener.on(Constants.EventName.GOODBYD, this.onGoodbydEvent, this);
    }

    update (deltaTime: number) {
        // Your update function goes here.
        if (!this._inTheOrder) { return; }
        this._deltaTime += deltaTime;
        if (this._deltaTime <= this.walkTime) {
            Vec3.lerp(CustomerManager._tempVec, this._startPos, this._endPos, this._deltaTime / this.walkTime);
            this._currentCustomer.worldPosition = CustomerManager._tempVec;
        } else {
            this._deltaTime = 0;
            this._inTheOrder = false;
            this._currentCustomer.active = false;
            if (this._state === Constants.CustomerState.GOODBYD) {
                this._currentCustomer = null;
            }
            CustomEventListener.emit(Constants.EventName.FININSHED_WALK);
            CustomEventListener.emit(Constants.EventName.SHOW_GUIDE, true);
            if (this._state === Constants.CustomerState.GREETING) {
                AudioManager.playSound(Constants.AudioSource.INCAR);
            }
        }

    }

    /** 接客. */
    private onGreetingEvent(position: Vec3, direction: Vec3) {
        const index = Constants.randomNumber(0, this.customers.length - 1);
        this._currentCustomer = this.customers[index];
        CustomEventListener.emit(Constants.EventName.SHOW_TALK, index + 1);
        this._state = Constants.CustomerState.GREETING;
        this._inTheOrder = true;
        if (!this._currentCustomer) { return; }
        // 1.5 -> 0.5
        Vec3.multiplyScalar(this._startPos, direction, 1.5);
        this._startPos.add(position);
        Vec3.multiplyScalar(this._endPos, direction, .5);
        this._endPos.add(position);

        this._currentCustomer.worldPosition = this._startPos;
        this._currentCustomer.active = true;

        if (direction.x !== 0) {
            if (direction.x > 0) {
                this._currentCustomer.eulerAngles = new Vec3(0, -90, 0);
            } else {
                this._currentCustomer.eulerAngles = new Vec3(0, 90, 0);
            }
        } else {
            if (direction.z > 0) {
                this._currentCustomer.eulerAngles = new Vec3(0, 180, 0);
            }
        }

        const aniCmp = this._currentCustomer.getComponent(AnimationComponent);
        aniCmp.play("walk");
    }

    /** 送客. */
    private onGoodbydEvent(position: Vec3, direction: Vec3) {
        CustomEventListener.emit(Constants.EventName.SHOW_TALK, -1);
        this._state = Constants.CustomerState.GOODBYD;
        this._inTheOrder = true;
        if (!this._currentCustomer) { return; }
        // 0.5 -> 1.5
        Vec3.multiplyScalar(this._startPos, direction, .5);
        this._startPos.add(position);
        Vec3.multiplyScalar(this._endPos, direction, 1.5);
        this._endPos.add(position);

        this._currentCustomer.worldPosition = this._startPos;
        this._currentCustomer.active = true;

        if (direction.x !== 0) {
            if (direction.x > 0) {
                this._currentCustomer.eulerAngles = new Vec3(0, 90, 0);
            } else {
                this._currentCustomer.eulerAngles = new Vec3(0, -90, 0);
            }
        } else {
            if (direction.z < 0) {
                this._currentCustomer.eulerAngles = new Vec3(0, 180, 0);
            }
        }

        const aniCmp = this._currentCustomer.getComponent(AnimationComponent);
        aniCmp.play("walk");
        AudioManager.playSound(Constants.AudioSource.GETMONEY);
    }
}
