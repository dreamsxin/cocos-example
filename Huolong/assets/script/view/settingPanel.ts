import { AudioSource, Button, Component, EventHandler, Layout, replaceProperty, Slider, UITransform, _decorator } from "cc"
import GameMain from "../controller/gameMain";
import constant from "../core/constant";
import { MainScene } from "./mainScene";

const { ccclass, property, type } = _decorator;

@ccclass('SettingPanel')
export default class SettingPanel extends Component {
    @type(Slider)
    sliderMusicVolumn: Slider = null
    @type(Slider)
    sliderSoundVolumn: Slider = null
    @type(Button)
    btnSaveClose: Button = null

    @property({ visible: false })
    callback: Function = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let music_slider_event = new EventHandler()
        music_slider_event.target = this.node
        music_slider_event.component = "SettingPanel"
        music_slider_event.handler = "onMusicVolumnChange"
        this.sliderMusicVolumn.slideEvents.push(music_slider_event)
        let sound_slider_event = new EventHandler()
        sound_slider_event.target = this.node
        sound_slider_event.component = "SettingPanel"
        sound_slider_event.handler = "onSoundVolumnChange"
        this.sliderSoundVolumn.slideEvents.push(sound_slider_event)
        this.btnSaveClose.node.on(UITransform.EventType.TOUCH_END, this.onSaveSettings.bind(this))

    }

    start() {
        let set = GameMain.getSystemSetting()
        this.sliderMusicVolumn.progress = set.musicVolume
        this.sliderSoundVolumn.progress = set.soundVolume
    }

    // update (dt) {},

    startShow(closeCB = null) {
        this.callback = closeCB
    }

    onMusicVolumnChange() {
        this.saveSetting()
    }

    onSoundVolumnChange() {
        this.saveSetting()
    }

    onSaveSettings() {
        if (this.callback != null) {
            this.callback()
        }
        this.saveSetting()
        MainScene.getInstance().showStartPanel()
        this.node.removeFromParent()
    }


    private saveSetting() {
        let set = GameMain.getSystemSetting()
        set.musicVolume = this.sliderMusicVolumn.progress
        set.soundVolume = this.sliderSoundVolumn.progress
        GameMain.updateSystemSetting(set)
    }
}
