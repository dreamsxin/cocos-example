import { _decorator, Component, systemEvent, SystemEventType, EventMouse, EventKeyboard, macro, Label } from 'cc';
import { FPSFirearms } from './FPSFirearms';
import { FPSMessageEnum } from './FPSMessageSystem';
const { ccclass, property } = _decorator;

@ccclass('FPSWeaponController')
export class FPSWeaponController extends Component {
    @property({ type: FPSFirearms })
    public carriedWeapon: FPSFirearms = null!;

    @property({ type: Label })
    public ammoLabel: Label = null!;

    private mouseLeftDown = false;

    start() {
        this.addEventListener();
        this.updateAmmoInfo();
    }

    update() {
        if (this.mouseLeftDown) {
            this.carriedWeapon.shooting();
            this.updateAmmoInfo();
        }
    }

    private updateAmmoInfo() {
        this.ammoLabel.string = `${this.carriedWeapon.currentAmmo}/${this.carriedWeapon.currentMaxAmmoCarried}`;
    }

    private addEventListener() {
        systemEvent.on(
            SystemEventType.MOUSE_DOWN,
            (event: EventMouse) => {
                let buttonCode = event.getButton();
                switch (buttonCode) {
                    case EventMouse.BUTTON_LEFT:
                        this.mouseLeftDown = true;
                        break;
                }
            }
        );

        systemEvent.on(
            SystemEventType.MOUSE_UP,
            (event: EventMouse) => {
                let buttonCode = event.getButton();
                switch (buttonCode) {
                    case EventMouse.BUTTON_LEFT:;
                        this.mouseLeftDown = false;
                        break;
                }
            }
        );

        systemEvent.on(
            SystemEventType.KEY_DOWN,
            (event: EventKeyboard) => {
                let keyCode = event.keyCode;
                switch (keyCode) {
                    case macro.KEY.r:
                        let currentAmmo = this.carriedWeapon.currentAmmo;
                        if (currentAmmo < this.carriedWeapon.magazineAmmo && this.carriedWeapon.currentMaxAmmoCarried > 0) {
                            this.carriedWeapon.reload(currentAmmo);
                        }
                        break;
                }
            }
        );
    }

    onMessage(message: FPSMessageEnum) {
        switch (message) {
            case FPSMessageEnum.ReloadComplete:
                this.carriedWeapon.doReload();
                this.updateAmmoInfo();
                break;
        }
    }
}