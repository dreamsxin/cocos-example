
/**
 * Zy.
 * 2020-08-28.
 * 特效管理.
 */

import { _decorator, Component, Node, Prefab, ParticleUtils, Vec3, ParticleSystemComponent, instantiate } from 'cc';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;

@ccclass('EffectManager')
export class EffectManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: Prefab, tooltip: "特效预制-刹车拖尾."})
    brake: Prefab = null;

    @property({type: Prefab, tooltip: "特效预制-金币粒子."})
    coin: Prefab = null;

    private _followTarget: Node = null;
    private _currentBraking: Node = null;
    private _coinParticle: ParticleSystemComponent = null;

    start () {
        // Your initialization goes here.

        CustomEventListener.on(Constants.EventName.START_BRAKING, this.onStartBraking, this);
        CustomEventListener.on(Constants.EventName.END_BRAKING, this.onEndBraking, this);
        CustomEventListener.on(Constants.EventName.SHOW_COIN, this.onShowCoin, this);
    }

    update (deltaTime: number) {
        // Your update function goes here.
        if (this._followTarget && this._currentBraking) {
            this._currentBraking.worldPosition = this._followTarget.worldPosition;
        }
    }

    /** 开始刹车. */
    private onStartBraking(follow: Node) {
        this._followTarget = follow;
        this._currentBraking = PoolManager.getNode(this.brake, this.node);
        this._currentBraking.worldPosition = follow.worldPosition;
        // 对传入的节点下的所有粒子系统执行 play(); 操作.
        ParticleUtils.play(this._currentBraking);
    }

    /** 结束刹车. */
    private onEndBraking() {
        const currentBraking = this._currentBraking;
        // 对传入的节点下的所有粒子系统执行 stop(); 操作.
        ParticleUtils.stop(currentBraking);
        this.scheduleOnce(() => {
            PoolManager.putNode(currentBraking);
        }, 2);
        this._currentBraking = null;
        this._followTarget = null;
    }

    /** 显示金币. */
    private onShowCoin(position: Vec3) {
        if (!this._coinParticle) {
            const node = instantiate(this.coin);
            node.parent = this.node;
            this._coinParticle = node.getComponent(ParticleSystemComponent);
        }
        this._coinParticle.node.worldPosition = position;
        this._coinParticle.play();
    }
}
