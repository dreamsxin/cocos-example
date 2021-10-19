
import { _decorator, Component, Node, Mat4, Vec3, systemEvent, SystemEventType, EventMouse, misc, game } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FPSCameraControler')
export class FPSCameraController extends Component {
    @property({ type: Node, tooltip: "视口" })
    viewport: Node = null!;

    @property({ type: Node })
    shooter: Node = null!;

    private shooterAzimuth = 0;
    private shooterElevation = 0;

    start() {
        let temp = this.shooter.forward.clone();
        temp.y = 0;
        temp.normalize();
        this.shooterAzimuth = Math.atan2(-temp.x, -temp.z) * (180 / Math.PI);

        let mat4 = new Mat4();
        let rot = mat4.rotate(this.shooterAzimuth, Vec3.UP) as Mat4;
        temp = this.shooter.forward.clone();
        temp = temp.transformMat4(rot);
        this.shooterElevation = Math.atan(temp.y) * (180 / Math.PI);

        this.addEventListener();
    }

    lateUpdate(deltaTime: number) {
        this.shooter.setRotationFromEuler(this.shooterElevation, this.shooterAzimuth, 0);
    }

    addEventListener() {
        systemEvent.on(
            SystemEventType.MOUSE_DOWN,
            (event: EventMouse) => {
                let canvas = game.canvas!;
                if (document.pointerLockElement !== canvas && canvas.requestPointerLock) {
                    canvas.requestPointerLock();
                }
            }
        );

        systemEvent.on(
            SystemEventType.MOUSE_MOVE,
            (event: EventMouse) => {
                let movementX = -event.movementX;
                this.shooterAzimuth += movementX / 10;

                let movementY = event.movementY;
                this.shooterElevation = misc.clampf(this.shooterElevation + (movementY / 10), -50, 50);
            }
        );
    }
}