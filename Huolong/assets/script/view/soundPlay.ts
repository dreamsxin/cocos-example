
import { _decorator, Component, Node, UITransform, AudioClip } from 'cc';
import GameMain from '../controller/gameMain';
const { ccclass, property, type } = _decorator;


@ccclass('SoundPlay')
export class SoundPlay extends Component {
    @type(AudioClip)
    sound: AudioClip

    start() {
        this.node.on(UITransform.EventType.TOUCH_END, this.onclick.bind(this))
    }

    onclick() {
        if (this.sound != null) {
            GameMain.playSound(this.sound)
        }
    }
}
