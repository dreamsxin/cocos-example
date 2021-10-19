
import { _decorator, Component, Node, Prefab, Camera, ParticleSystem, AudioSource, CCInteger, Vec3, instantiate, director, RigidBody } from 'cc';
import { FPSBullet } from './FPSBullet';
import { FPSCharacterAnimator } from './FPSCharacterAnimator';
import IWeapon from './IWeapon';
const { ccclass, property } = _decorator;

@ccclass('FPSFirearms')
export abstract class FPSFirearms extends Component implements IWeapon {
    @property({
        type: Prefab,
        tooltip: "子弹预制体"
    })
    public bulletPrefab: Prefab = null!;

    @property({
        type: Camera,
        tooltip: "眼视口摄像机"
    })
    public eyeCamera: Camera = null!;

    @property({
        type: Camera,
        tooltip: "枪视口摄像机"
    })
    public gunCamera: Camera = null!;

    @property({
        type: Node,
        tooltip: "枪口位置"
    })
    public muzzlePoint: Node = null!;

    @property({
        type: Node,
        tooltip: "弹壳位置"
    })
    public casingPoint: Node = null!;

    @property({
        type: ParticleSystem,
        tooltip: "枪口特效"
    })
    public muzzleParticle: ParticleSystem = null!;

    @property({
        type: AudioSource,
        tooltip: "射击音效"
    })
    public shootingAudioSource: AudioSource = null!;

    @property({
        type: AudioSource,
        tooltip: "换子弹音效左"
    })
    public reloadLeftAudioSource: AudioSource = null!;
    
    @property({
        type: AudioSource,
        tooltip: "换子弹音效右"
    })
    public reloadRightAudioSource: AudioSource = null!;

    @property({
        type: CCInteger,
        tooltip: "射速"
    })
    public fireRate = 0;

    @property({
        type: CCInteger,
        tooltip: "弹匣子弹数量"
    })
    public magazineAmmo = 30;
    private _currentAmmo = 0;
    public get currentAmmo() {
        return this._currentAmmo;
    }

    @property({
        type: CCInteger,
        tooltip: "最大子弹携带数量"
    })
    public maxAmmoCarried = 120;
    private _currentMaxAmmoCarried = 0;
    public get currentMaxAmmoCarried() {
        return this._currentMaxAmmoCarried;
    }
    
    @property({
        type: CCInteger,
        tooltip: "有效射程"
    })
    public effectiveRange = 500;

    @property({ type: FPSCharacterAnimator })
    public animator: FPSCharacterAnimator = null!;

    public basicSight: ScopeInfo = null!;

    protected rigOutScopeInfo: ScopeInfo = null!;
    protected lastFireTime = 0;
    protected eyeOriginFOV = 0;
    protected gunOriginFOV = 0;
    protected isAiming = false;
    protected isHoldingTrigger = false;
    protected gunCameraNode: Node = null!;
    
    private originalEyePosition: Vec3 = null!;
    private fireIntervalMS = 0;

    onLoad() {
        this._currentAmmo = this.magazineAmmo;
        this._currentMaxAmmoCarried = this.maxAmmoCarried;
        this.fireIntervalMS = (1 / this.fireRate * 1000);
        // this.eyeOriginFOV = this.eyeCamera.fov;
        // this.gunOriginFOV = this.gunCamera.fov;
        // this.gunCameraNode = this.gunCamera.node;
        // this.originalEyePosition = this.gunCameraNode.position.clone();
        // this.rigOutScopeInfo = this.basicSight;
    }

    public doAttack() {
        if (this._currentAmmo <= 0) {
            return;
        }

        if (!this.isAllowShooting()) {
            return;
        }

        this.shootingAudioSource.play();
        this.muzzleParticle.play();

        this._currentAmmo -= 1;
        this.animator.play("fire");
        this.createBullect();
        this.lastFireTime = Date.now();
    }

    public doReload() {
        let needAmmo = this.magazineAmmo - this._currentAmmo;
        if (this._currentMaxAmmoCarried >= needAmmo) {
            this._currentMaxAmmoCarried -= needAmmo;
            this._currentAmmo += needAmmo;
        }
        else {
            this._currentAmmo += this._currentMaxAmmoCarried;
            this._currentMaxAmmoCarried = 0;
        }
    }

    public abstract shooting(): void;
    public abstract reload(currentAmmo: number): void;

    private isAllowShooting() {
        return Date.now() - this.lastFireTime > this.fireIntervalMS;
    }

    private createBullect() {
        let node = instantiate(this.bulletPrefab);
        director.getScene()!.addChild(node);

        let rotation = this.muzzlePoint.worldRotation;
        let position = this.muzzlePoint.worldPosition;

        node.getComponent(FPSBullet)!.init(position, rotation, this.effectiveRange);
    }
}

class ScopeInfo {
    public scopeName: string = "";
    public ScopeGameObject: Node = null!;
    public eyeFOV = 0;
    public gunFOV = 0;
    public gunCameraPosition: Vec3 = null!;
}