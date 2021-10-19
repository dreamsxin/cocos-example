
/**
 * Zy.
 * 2020-08-20.
 * 路线点.
 * Snipaste.
 */

import { _decorator, Component, Node, Vec3, Enum, macro } from 'cc';
import { Constants } from './Constants';
const { ccclass, property } = _decorator;

/** 路线点类型. */
export enum RoadPointType {
    /** 普通路径点. */
    NORMAL = 1,
    /** 起始点. */
    START,
    /** 接客点. */
    GREETING,
    /** 送客点. */
    GOODBYD,
    /** 结束点. */
    END,
    /** 停止点. */
    STOP,
    /** AI起始点. */
    AI_START,
}
Enum(RoadPointType);

/** 路线类型. */
export enum RoadMoveType {
    /** 直线. */
    LINE = 1,
    /** 弯路. */
    CURVE,
}
Enum(RoadMoveType);

@ccclass('RoadPoint')
export class RoadPoint extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({
        type: RoadPointType,
        tooltip: "路线点类型.\n- NORMAL: 普通路径点.\n- START: 起始点.\n- GREETING: 接客点.\n- GOODBYD: 送客点.\n- END: 结束点.\n- AI_START: AI起始点.",
        displayOrder: 1
    })
    pointType: RoadPointType = RoadPointType.NORMAL;

    @property({
        type: Node,
        tooltip: "下一个点.",
        displayOrder: 2,
        visible() { return this.pointType !== RoadPointType.STOP; }
    })
    nextStation: Node = null;

    @property({
        type: RoadMoveType,
        tooltip: "路线类型.\n- LINE: 直线.\n- CURVE: 弯路.",
        displayOrder: 3,
        visible() { return this.pointType !== RoadPointType.STOP; }
    })
    moveType: RoadMoveType = RoadMoveType.LINE;

    @property({
        tooltip: "是否是顺时针转弯.",
        displayOrder: 4,
        visible() { return this.pointType !== RoadPointType.STOP && this.moveType === RoadMoveType.CURVE; }
    })
    clockwise: boolean = true;

    @property({
        type: Vec3,
        tooltip: "接送客方向(默认右边).",
        displayOrder: 5,
        visible() { return this.pointType === RoadPointType.GREETING || this.pointType === RoadPointType.GOODBYD; }
    })
    direction: Vec3 = new Vec3(1, 0, 0);

    @property({
        tooltip: "AI产出间隔.",
        displayOrder: 6,
        visible() { return this.pointType === RoadPointType.AI_START; }
    })
    interval: number = 3;

    @property({
        tooltip: "AI产出延迟.",
        displayOrder: 7,
        visible() { return this.pointType === RoadPointType.AI_START; }
    })
    delayTime: number = 0;

    @property({
        tooltip: "速度.",
        displayOrder: 8,
        visible() { return this.pointType === RoadPointType.AI_START; }
    })
    speed: number = .05;

    // 201,202, 203,204
    @property({
        tooltip: "小车出现类型.",
        displayOrder: 9,
        visible() { return this.pointType === RoadPointType.AI_START; }
    })
    cars = "201";

    /** AI小车类型集合. */
    private _arrayCars: string[] = [];
    private _callback: Function = null;

    start() {
        // Your initialization goes here.
        
        this._arrayCars = this.cars.split(",");
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public startSchedule(callback: Function) {
        if (this.pointType !== RoadPointType.AI_START) { return; }
        this.stopSchedule();
        this._callback = callback;
        this.scheduleOnce(this.startDelay, this.delayTime);
    }

    public stopSchedule() {
        this.unschedule(this.startDelay);
        this.unschedule(this.scheduleCallback);
    }

    private startDelay() {
        this.schedule(this.scheduleCallback, this.interval, macro.REPEAT_FOREVER);
        this.scheduleCallback();
    }

    private scheduleCallback() {
        const index = Math.floor(Constants.randomNumber(0, this._arrayCars.length - 1));
        this._callback && this._callback(this, this._arrayCars[index]);
    }
}
