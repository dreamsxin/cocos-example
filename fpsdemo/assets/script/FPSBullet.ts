import { CCInteger, director, geometry, instantiate, Mat3, PhysicsSystem, Quat, Vec3 } from 'cc';
import { _decorator, Component, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FPSBullet')
export class FPSBullet extends Component {
    @property({ type: Prefab })
    public impactPrefab: Prefab = null!;

    @property({ type: CCInteger })
    public speed = 500;

    private prePosition: Vec3 = null!;
    private currentPosition: Vec3 = null!;
    private translateIncrement: Vec3 = null!;
    private rayDir: Vec3 = null!;

    private range = 0;
    private rangeCount = 0;

    update(deltaTime: number) {
        let dis = this.speed * deltaTime;
        this.rangeCount += dis;
        
        if (this.range > this.rangeCount) {
            Vec3.copy(this.prePosition, this.node.worldPosition);
            this.translateIncrement.set(0, 0, dis);

            this.node.translate(this.translateIncrement, 0);
            Vec3.copy(this.currentPosition, this.node.worldPosition);

            Vec3.subtract(this.rayDir, this.currentPosition, this.prePosition);
            this.rayDir.normalize();

            let ray = new geometry.Ray(
                this.prePosition.x,
                this.prePosition.y,
                this.prePosition.z,
                this.rayDir.x,
                this.rayDir.y,
                this.rayDir.z
            );

            if (PhysicsSystem.instance.raycastClosest(
                ray,
                2,
                this.currentPosition.subtract(this.prePosition).length()
            )) {
                let result = PhysicsSystem.instance.raycastClosestResult;
                let impactEffect = instantiate(this.impactPrefab);
                director.getScene()!.addChild(impactEffect);

                impactEffect.setWorldPosition(result.hitPoint);

                Vec3.copy(impactEffect.forward, result.hitNormal);

                this.node.destroy();
            }
        }
        else {
            this.node.destroy();
        }
    }

    init(position: Vec3, rotation: Quat, range: number) {
        this.node.worldPosition = position;
        this.node.worldRotation = rotation;
        this.range = range;

        this.translateIncrement = new Vec3();
        this.prePosition = new Vec3();
        this.currentPosition = new Vec3();

        this.rayDir = new Vec3();

        Vec3.copy(this.prePosition, position);
        Vec3.copy(this.currentPosition, position);
    }
}