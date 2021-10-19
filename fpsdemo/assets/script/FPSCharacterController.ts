import { _decorator, Component, Node, Vec3, systemEvent, SystemEventType, EventKeyboard, macro, RigidBody, misc, math, geometry, PhysicsSystem, CapsuleCollider, EventMouse, Event, SkeletalAnimation } from 'cc';
import { AnimationClipName } from './AnimationClipName';
import { FPSCharacterAnimator } from './FPSCharacterAnimator';
import { FPSMessageEnum, FPSMessageSystem } from './FPSMessageSystem';
import { FPSWeaponController } from './FPSWeaponController';

const { ccclass, property } = _decorator;

@ccclass('FPSCharacterController')
export class FPSCharacterController extends Component {
    @property({ type: SkeletalAnimation })
    public skelAnim: SkeletalAnimation = null!;

    @property({ tooltip: "视口", type: Node })
    public viewport: Node = null!;

    @property({ tooltip: "奔跑速度" })
    public runSpeed = 5;

    @property({ tooltip: "行走速度" })
    public walkSpeed = 5;

    @property({ tooltip: "蹲走速度" })
    public crouchSpeed = 5;

    @property({ tooltip: "跳跃冲力" })
    public jumpImpulse = 400;

    @property({ tooltip: "蹲高" })
    public crouchHeight = 0;

    private rigidbody: RigidBody = null!;
    private capsuleCollider: CapsuleCollider = null!;
    private animator: FPSCharacterAnimator = null!;

    private forwardValue = 0;
    private strafeValue = 0;

    private originHeight = 0;
    private crouch = false;
    private crouchDown = false;
    private crouchRatio = 0;

    private onGround = false;
    private jumping = false;
    private velocity: Vec3 = null!;
    private heading: Vec3 = null!;
    private currentSpeed = 0;

    start() {
        this.currentSpeed = this.walkSpeed;

        this.rigidbody = this.getComponent(RigidBody)!;
        this.capsuleCollider = this.getComponent(CapsuleCollider)!;
        this.animator = this.getComponent(FPSCharacterAnimator)!;

        this.originHeight = this.capsuleCollider.height;
        this.capsuleCollider.on(
            "onCollisionStay",
            this.onCollisionStay,
            this
        );

        this.velocity = new Vec3();
        this.heading = new Vec3();

        this.addEventListener();
    }

    update(dt: number) {
        let target = this.capsuleCollider.height;
        let current = target;
        if (this.crouch) {
            if (this.capsuleCollider.height > this.crouchHeight) {
                target = this.crouchHeight;
            }
        }
        else {
            if (this.capsuleCollider.height < this.originHeight) {
                target = this.originHeight;
            }
        }
        let result = math.lerp(current, target, this.crouchRatio);
        this.capsuleCollider.height = result;
        this.crouchRatio = misc.clampf(this.crouchRatio + dt * 5, 0, 1);
        
        let cameraForward = this.viewport.forward.clone();
        cameraForward.y = 0;
        cameraForward.normalize();

        let cameraRight = Vec3.transformQuat(new Vec3(), Vec3.RIGHT, this.viewport.worldRotation);
        cameraRight.y = 0;
        cameraRight.normalize();

        let heading = new Vec3();
        if (this.forwardValue !== 0) {
            cameraForward.multiplyScalar(this.forwardValue);
            heading.add(cameraForward);
        }

        if (this.strafeValue !== 0) {
            cameraRight.multiplyScalar(this.strafeValue);
            heading.add(cameraRight);
        }

        this.heading.set(heading.x, heading.y, heading.z);
        this.heading.normalize();

        this.move();
    }

    move() {
        let heading = this.heading;
        if (this.onGround && !this.jumping) {
            this.rigidbody.getLinearVelocity(this.velocity);
            heading.multiplyScalar(this.currentSpeed);

            this.velocity.x = heading.x;
            this.velocity.z = heading.z;

            let rigidbody = this.rigidbody;
            rigidbody.setLinearVelocity(this.velocity);
            this.animator.updateVelocity(this.velocity.x, this.velocity.z);
        }
        else {
            this.animator.updateVelocity(0, 0);
        }
    }

    jump() {
        if (this.onGround && !this.jumping) {
            let rigidbody = this.rigidbody;
            rigidbody.applyImpulse(new Vec3(0, this.jumpImpulse, 0));
            this.onGround = false;
            this.jumping = true;
        }
    }

    onCollisionStay() {
        let center = this.capsuleCollider.worldBounds.center.clone();
        let ray = geometry.Ray.create(center.x, center.y, center.z, 0, -1, 0);
        let result = PhysicsSystem.instance.raycastClosest(ray, 4, 1);
        this.onGround = result;
        this.jumping = !result;
    }

    addEventListener() {
        systemEvent.on(
            SystemEventType.KEY_DOWN,
            (event: EventKeyboard) => {
                let keyCode = event.keyCode;
                switch (keyCode) {
                    case macro.KEY.w:
                        this.forwardValue = 1;
                        break;
                    case macro.KEY.s:
                        this.forwardValue = -1;
                        break;
                    case macro.KEY.a:
                        this.strafeValue = -1;
                        break;
                    case macro.KEY.d:
                        this.strafeValue = 1;
                        break;
                    case macro.KEY.space:
                        this.jump();
                        break;
                    case macro.KEY.c:
                        if (!this.crouchDown) {
                            this.crouch = !this.crouch;
                            if (this.crouch) {
                                this.currentSpeed = this.crouchSpeed;
                            }
                            else {
                                this.currentSpeed = this.walkSpeed;
                            }
                            this.crouchDown = true;
                            this.crouchRatio = 0;
                        }
                        break;
                }
            }
        );

        systemEvent.on(
            SystemEventType.KEY_UP,
            (event: EventKeyboard) => {
                let keyCode = event.keyCode;
                switch (keyCode) {
                    case macro.KEY.w:
                        if (this.forwardValue === 1) {
                            this.forwardValue = 0;
                        }
                        break;
                    case macro.KEY.s:
                        if (this.forwardValue === -1) {
                            this.forwardValue = 0;
                        }
                        break;
                    case macro.KEY.a:
                        if (this.strafeValue === -1) {
                            this.strafeValue = 0;
                        }
                        break;
                    case macro.KEY.d:
                        if (this.strafeValue === 1) {
                            this.strafeValue = 0;
                        }
                        break;
                    case macro.KEY.c:
                        this.crouchDown = false;
                        break;
                }
            }
        );
    }

    onMessage(message: FPSMessageEnum) {

    }
}
