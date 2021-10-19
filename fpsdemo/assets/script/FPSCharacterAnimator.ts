import { _decorator, Vec3, SkeletalAnimation } from 'cc';
import StateMachine from "../lib/state-machine.js";
import { AnimationClipName } from './AnimationClipName';
import { Animator } from './Animator';
import { FPSMessageEnum, FPSMessageSystem } from './FPSMessageSystem';

const { ccclass, property } = _decorator;

@ccclass('FPSCharacterAnimator')
export class FPSCharacterAnimator extends Animator {
    @property({ type: SkeletalAnimation })
    public skelAnim: SkeletalAnimation = null!;

    private velocity: Vec3 = null!;

    start() {
        this.velocity = new Vec3();
        this.initStateMachine();
        this.initSkelAnim();
    }

    updete(dt: number) {

    }

    initSkelAnim() {
        this.skelAnim.on(
            SkeletalAnimation.EventType.FINISHED,
            (eventType: string, event) => {
                switch (event.name) {
                    case AnimationClipName.TakeOutWeapon:
                    case AnimationClipName.Fire:
                    case AnimationClipName.InspectWeapon:
                        this.play("stand");
                        break;

                    case AnimationClipName.AimIn:
                        this.skelAnim.play(AnimationClipName.AimIn);
                        break;
                    case AnimationClipName.AimOut:
                        this.skelAnim.play(AnimationClipName.AimFire);
                        break;

                    case AnimationClipName.ReloadAmmoLeft:
                    case AnimationClipName.ReloadOutOfAmmo:
                        this.play("stand");
                        this.getComponent(FPSMessageSystem)!
                            .sendMessage(FPSMessageEnum.ReloadComplete);
                        break;
                }
            }
        );
    }

    initStateMachine() {
        let self = this;

        this.fsm = new StateMachine({
            transitions: [
                { name: "init", from: "none", to: "TakeoutWeapon" },
                { name: "move", from: ["Idle", "Movement", "Fire", "Aiming", "InspectWeapon"], to: "Movement" },
                { name: "stand", from: ["TakeoutWeapon", "Idle", "Movement", "Fire", "Aiming", "InspectWeapon", "Reload"], to: 'Idle' },
                { name: "fire", from: ["TakeoutWeapon", "Movement", "Fire", "Idle", "Aiming", "InspectWeapon"], to: "Fire" },
                { name: "inspect_weapon", from: "Idle", to: "InspectWeapon" },
                { name: "aiming", from: ["Movement", "Fire", "Idle", "Aiming", "InspectWeapon"], to: "Aiming" },
                { name: "reload", from: ["Movement", "Idle", "Aiming", "InspectWeapon"], to: "Reload" }
            ],

            methods: {
                onMove: function () {
                    let sqr = self.velocity.lengthSqr();
                    if (sqr > 100) {
                        self.skelAnim.play(AnimationClipName.Run);
                    }
                    else if (sqr > 0) {
                        self.skelAnim.play(AnimationClipName.Walk);
                    }
                    else {
                        self.skelAnim.play(AnimationClipName.Idle);
                    }
                },

                onStand: function () {
                    self.skelAnim.play(AnimationClipName.Idle);
                },

                onInit: function () {
                    self.skelAnim.play(AnimationClipName.TakeOutWeapon);
                },

                onFire: function () {
                    self.skelAnim.play(AnimationClipName.Fire);
                },

                onInspectWeapon: function () {
                    self.skelAnim.play(AnimationClipName.InspectWeapon);
                },

                onAiming: function () {
                    self.skelAnim.play(AnimationClipName.AimIn);
                },

                onReload: function (transitions: any, currentAmmo: number) {                    
                    if (currentAmmo > 0) {
                        self.skelAnim.play(AnimationClipName.ReloadAmmoLeft);
                    }
                    else {
                        self.skelAnim.play(AnimationClipName.ReloadOutOfAmmo);
                    }

                    self.getComponent(FPSMessageSystem)!.sendMessage(FPSMessageEnum.ReloadStart);
                },
            }
        });

        this.fsm.init();
    }

    public updateVelocity(x: number, z: number) {
        this.velocity.x = x;
        this.velocity.z = z;
    }
}