
import { _decorator, Node, Component, Prefab, AudioSource, instantiate, SpriteFrame, JsonAsset, SystemEvent, AudioClip } from 'cc';
import { EDITOR } from 'cc/env';
import GameMain from '../controller/gameMain';
import { CharacterInfo } from '../core/characterInfo';
import { SystemEventType } from '../core/enumerator';
import IUserAccess from '../core/i_userAccess';
import SystemSetting from '../core/systemSetting';
import BtnCard from './btnCard';
import { CardImageCollector } from './cardImageCollector';
import HuolongPanel from './huolongPanel';
import MessageBox from './messageBox';
import PlayerInfoPanel from './playerInfoPanel';
import SettingPanel from './settingPanel';
import StartPanel from './startPanel';
import TipBar from './tipBar';
import WaitingBar from './waitingBar';
const { ccclass, property, type } = _decorator;

/**
 * Predefined variables
 * Name = MainScene
 * DateTime = Sun Sep 12 2021 20:31:49 GMT+0800 (中国标准时间)
 * Author = 261343578
 * FileBasename = mainScene.ts
 * FileBasenameNoExtension = mainScene
 * URL = db://assets/script/view/mainScene.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

let instance: MainScene = null

@ccclass('MainScene')
export class MainScene extends Component {
    @type(Prefab)
    prefab_card: Prefab = null
    @type(Prefab)
    prefab_tips: Prefab = null
    @type(Prefab)
    prefab_waitingBar: Prefab = null
    @type(Prefab)
    prefab_startPanel: Prefab = null
    @type(Prefab)
    prefab_settingPanel: Prefab = null
    @type(Prefab)
    prefab_messageBox: Prefab = null
    @type(Prefab)
    prefab_playerInfoPanel: Prefab = null

    @type(Prefab)
    prefab_huolongPanel: Prefab = null

    @type(AudioSource)
    music_source: AudioSource = null
    @type(AudioSource)
    sound_source: AudioSource = null
    @type(CardImageCollector)
    cardImageCollector: CardImageCollector = null

    @type(Node)
    root_game: Node = null
    @type(Node)
    root_panel: Node = null
    @type(Node)
    root_top: Node = null

    @type(JsonAsset)
    config_debug: JsonAsset = null
    @type(JsonAsset)
    config_initial: JsonAsset = null
    @type(JsonAsset)
    config_audioList: JsonAsset = null
    @type(JsonAsset)
    config_ai: JsonAsset = null

    @property({ visible: false })
    userAccess: IUserAccess = null

    static getInstance(): MainScene {
        return instance
    }

    onLoad() {
        if (!EDITOR) {
            GameMain.init(this, this.music_source, this.sound_source, this.config_debug.json, this.config_initial.json, this.config_audioList.json, this.config_ai.json)
            GameMain.listenEvent(SystemEventType.onSystemSettingChanged, this.onSystemSettingChanged.bind(this))
            let set = GameMain.getSystemSetting()
            this.onSystemSettingChanged(SystemEventType.onSystemSettingChanged, null, set)
        }
        instance = this
    }

    start() {
        if (!EDITOR) {
            this.showStartPanel()
        }
    }

    private onSystemSettingChanged(event: SystemEventType, data: any, set: SystemSetting) {
        if (set.musicMute) {
            this.music_source.volume = 0
        } else {
            this.music_source.volume = set.musicVolume
        }
        if (set.soundMute) {
            this.sound_source.volume = 0
        } else {
            this.sound_source.volume = set.soundVolume
        }
    }

    public setUserAccess(u: IUserAccess) {
        this.userAccess = u
    }

    public getCardImage(id: number): SpriteFrame {
        return this.cardImageCollector.getCardImage(id)
    }

    public getPlayerHeadIcon(id: number): SpriteFrame {
        return this.cardImageCollector.getPlayerHeadIcon(id)
    }

    public getAudioClip(id: number): AudioClip {
        return this.cardImageCollector.getAudioClip(id)
    }

    public createCard(id: number): BtnCard {
        let cardNode = instantiate(this.prefab_card)
        let btnCard = cardNode.getComponent(BtnCard)
        btnCard.setCard(id, this.getCardImage(id))
        btnCard.setClickEnabled(false)
        return btnCard
    }

    public showStartPanel(): StartPanel {
        GameMain.playMusic("bg_main")
        let startPanelNode = instantiate(this.prefab_startPanel)
        let startPanel = startPanelNode.getComponent(StartPanel)
        this.root_panel.addChild(startPanelNode)
        return startPanel
    }

    public showSettingPanel(): SettingPanel {
        let settingPanelNode = instantiate(this.prefab_settingPanel)
        let settingPanel = settingPanelNode.getComponent(SettingPanel)
        settingPanel.startShow()
        this.root_panel.addChild(settingPanelNode)
        return settingPanel
    }

    public showTips(text: string): TipBar {
        let tipBarNode = instantiate(this.prefab_tips)
        let tipBar = tipBarNode.getComponent(TipBar)
        tipBar.setContent(text)
        this.root_top.addChild(tipBarNode)
        return tipBar
    }

    public showWaiting(text: string): WaitingBar {
        let waitingBarNode = instantiate(this.prefab_waitingBar)
        let waitingBar = waitingBarNode.getComponent(WaitingBar)
        waitingBar.setContent(text)
        this.root_top.addChild(waitingBarNode)
        return waitingBar
    }

    public showMessageBox(text: string, okLabel: string = "确定", okCallback: Function = null, cancelLabel: string = null, cancelCallback: Function = null): MessageBox {
        let messageBoxNode = instantiate(this.prefab_messageBox)
        let messageBox = messageBoxNode.getComponent(MessageBox)
        messageBox.startShow(text, okLabel, okCallback, cancelLabel, cancelCallback)
        this.root_panel.addChild(messageBoxNode)
        return messageBox
    }

    public showPlayerInfoPanel(info: CharacterInfo, isMine: boolean = false, closeCallback: Function = null): PlayerInfoPanel {
        let playerInfoPanelNode = instantiate(this.prefab_playerInfoPanel)
        let playerInfoPanel = playerInfoPanelNode.getComponent(PlayerInfoPanel)
        playerInfoPanel.setData(info, isMine, closeCallback)
        this.root_panel.addChild(playerInfoPanelNode)
        return playerInfoPanel
    }

    public startSimple() {
        let huolongPanelNode = instantiate(this.prefab_huolongPanel)
        //let huolongPanel = huolongPanelNode.getComponent(HuolongPanel)
        this.root_game.addChild(huolongPanelNode)
        GameMain.playMusic("bg_table_huolong")
        return true
    }

    public showLocalNet() {
        if (this.checkLogin()) {
            this.showTips('点对点连接对战功能正在建设中, 敬请期待')
        }
        return false
    }

    public showServer() {
        if (this.checkLogin()) {
            this.showTips('联网对战服务器正在建设中, 敬请期待')
        }
        return false
    }

    public showHistory() {
        if (this.checkLogin()) {
            this.showPlayerInfoPanel(GameMain.getMyInfo(), true, () => {
                this.showStartPanel()
            })
            return true
        }
        return false
    }

    public showHelp() {
        if (this.checkLogin()) {
            this.showTips('帮助说明正在建设中, 敬请期待')
        }
        return false
    }

    public checkLogin() {
        if (!this.getIsLoggedIn()) {
            this.showMessageBox("需要先登录服务器", "登录", () => {
                let waitingConnectionBar = this.showWaiting("网络连接中...")
                waitingConnectionBar.node.active = false
                let loginCB = () => {
                    waitingConnectionBar.node.removeFromParent()
                    let ret = this.userAccess.sendLogin()
                    if (ret != null) { // 登陆失败
                        this.showMessageBox("登陆失败！returned: " + ret)
                    }
                }
                let reconnectCB = () => {
                    waitingConnectionBar.node.active = false
                    this.showMessageBox("连接服务器失败, 是否重试?", "取消", () => {
                        waitingConnectionBar.node.removeFromParent()
                    }, "重试", () => {
                        waitingConnectionBar.node.active = true
                        this.userAccess.connect(loginCB, reconnectCB)
                    })
                }
                if (this.userAccess.isConnection()) {
                    loginCB()
                } else {
                    waitingConnectionBar.node.active = true
                    this.userAccess.connect(loginCB, reconnectCB)
                }
            }, "取消", () => { })
            return false
        } else {
            return true
        }
    }

    public getIsLoggedIn(): boolean {
        // todo 网络连接（包括微信小游戏登录）在这里判断
        return true
    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
