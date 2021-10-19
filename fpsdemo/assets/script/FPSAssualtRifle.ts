import { AudioClip, _decorator } from 'cc';
import { FPSFirearms } from './FPSFirearms';
import { FPSMessageEnum } from './FPSMessageSystem';
const { ccclass, property } = _decorator;

@ccclass('FPSAssualtRifle')
export class FPSAssualtRifle extends FPSFirearms {
    @property({ type: AudioClip })
    public shootAudioClip: AudioClip = null!;

    public shooting(): void {
        this.shootingAudioSource.clip = this.shootAudioClip;
        this.doAttack();
    }

    public reload(currentAmmo: number): void {
        this.animator.play("reload", currentAmmo);
    }

    checkReloadAnimationEnd() {
        return;
    }

    onMessage(message: FPSMessageEnum) {
        if (message === FPSMessageEnum.ReloadStart) {
            if (this.currentAmmo > 0) {
                this.reloadLeftAudioSource.play();
            }
            else {
                this.reloadLeftAudioSource.play();
            }
        }
    }
}