import { Button, Component, Layout, UITransform, _decorator } from 'cc'
import { EDITOR } from 'cc/env'
import { MainScene } from './mainScene'

const { ccclass, property, type } = _decorator;

@ccclass('StartPanel')
export default class StartPanel extends Component {
    @type(Button)
    startMenu_btnSimpleStart: Button = null
    @type(Button)
    startMenu_btnlocalNet: Button = null
    @type(Button)
    startMenu_btnServer: Button = null
    @type(Button)
    startMenu_btnHistory: Button = null
    @type(Button)
    startMenu_btnHelp: Button = null
    @type(Button)
    startMenu_btnSetting: Button = null

    @property({ visible: false })
    parent: MainScene = null

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        if (!EDITOR) {
            this.startMenu_btnSimpleStart.node.on(UITransform.EventType.TOUCH_END, this.onClickSimpleStart.bind(this))
            this.startMenu_btnlocalNet.node.on(UITransform.EventType.TOUCH_END, this.onClickLocalNet.bind(this))
            this.startMenu_btnServer.node.on(UITransform.EventType.TOUCH_END, this.onClickServer.bind(this))
            this.startMenu_btnHistory.node.on(UITransform.EventType.TOUCH_END, this.onClickHistory.bind(this))
            this.startMenu_btnHelp.node.on(UITransform.EventType.TOUCH_END, this.onClickHelp.bind(this))
            this.startMenu_btnSetting.node.on(UITransform.EventType.TOUCH_END, this.onClickSetting.bind(this))
        }
    }

    start() {
        if (!EDITOR) {
            this.parent = MainScene.getInstance()
        }
    }

    setParentScene(parent: MainScene) {
        this.parent = parent
    }

    onClickSimpleStart() {
        if (this.parent.startSimple()) {
            this.node.removeFromParent()
        }
    }

    onClickLocalNet() {
        if (this.parent.showLocalNet()) {
            this.node.removeFromParent()
        }
    }

    onClickServer() {
        if (this.parent.showServer()) {
            this.node.removeFromParent()
        }
    }

    onClickHistory() {
        if (this.parent.showHistory()) {
            this.node.removeFromParent()
        }
    }

    onClickHelp() {
        if (this.parent.showHelp()) {
            this.node.removeFromParent()
        }
    }

    onClickSetting() {
        if (this.parent.showSettingPanel() != null) {
            this.node.removeFromParent()
        }
    }
}

