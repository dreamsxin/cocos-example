
import { _decorator, Component, Node, Vec2, EventTouch, macro, UITransform, Vec3, EventHandler } from 'cc';
import { SocketConnection } from './multiplayer/SocketConnection';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameUIController
 * DateTime = Tue Sep 28 2021 19:04:24 GMT+0530 (India Standard Time)
 * Author = shashankA
 * FileBasename = GameUIController.ts
 * FileBasenameNoExtension = GameUIController
 * URL = db://assets/Script/GameUIController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('GameUIController')
export class GameUIController extends Component {

    startLoc: Vec2;

    @property({
        type: [EventHandler],
        tooltip: 'Touch Drag'
    })
    touchEventCallBack: EventHandler[] = [];
    socketConnection: SocketConnection;

    start() {
        this.node.on(Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.touchEnded, this);

    }

    onConnect() {

    }

    touchMove(touch: EventTouch) {
        /*  
        ***** Do not delete this commented code

        let loc = touch.getUILocation();
        let pos = this.node.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(loc.x, loc.y));
        let angle = Math.atan2(pos.y, pos.x);
        this.touchEventCallBack.forEach(c => c.emit([pos, angle * macro.DEG])); 
        */

        let loc = touch.getLocation();
        let pos = new Vec3(loc.x - this.startLoc.x, loc.y - this.startLoc.y);
        let angle = this.get_angle(this.startLoc.x, this.startLoc.y, loc.x, loc.y);
        this.touchEventCallBack.forEach(c => c.emit([pos, angle]));
    }

    touchEnded(touch: EventTouch) {
        this.touchEventCallBack.forEach(c => c.emit([new Vec3(0, 0, 0)]));
    }

    touchStart(touch: EventTouch) {
        this.startLoc = touch.getLocation();
        this.touchMove(touch);
    }

    get_angle(cx: number, cy: number, ex: number, ey: number) {
        let dy = ey - cy;
        let dx = ex - cx;
        let theta = Math.atan2(dy, dx);
        // theta *= 180 / Math.PI;
        return theta * macro.DEG;
    }

}