
import { _decorator, Component, systemEvent, SystemEvent, EventTouch, Touch, director, macro, Vec2, Node, Vec3, Quat, clamp, Prefab, log } from 'cc';
import { Sumo } from './Sumo';
const { ccclass, property } = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {

    startLoc: Vec2;
    startZ: number;

    @property({
        type: Node
    })
    sumo: Node;

    onLoad() {

        macro.ENABLE_MULTI_TOUCH = false;
        director.preloadScene('GameScene');
    }

    start() {
        // Created for rotating the character
        systemEvent.on(SystemEvent.EventType.TOUCH_START, this.touchStart, this);
        systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.touchMove, this);
    }

    touchStart(touch: Touch) {
        this.startLoc = touch.getLocation();
        this.startZ = this.sumo.rotation.getEulerAngles(new Vec3()).z;
    }

    touchMove(touch: Touch) {
        let loc = touch.getLocationX();
        let dist = this.startLoc.x - loc;
        // let angle = clamp(dist, -360, 360);
        // let endQuat = Quat.fromEuler(new Quat(), -90, 0, angle);
        this.sumo.setRotationFromEuler(-90, 0, this.startZ + dist);
    }

    startGame(): void {
        director.loadScene('GameScene');
    }

    onDestroy() {
        systemEvent.off(SystemEvent.EventType.TOUCH_START, this.touchStart, this);
        systemEvent.off(SystemEvent.EventType.TOUCH_MOVE, this.touchMove, this);
    }
}