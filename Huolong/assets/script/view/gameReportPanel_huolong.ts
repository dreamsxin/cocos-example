import { Button, Component, Label, UITransform, _decorator } from 'cc'
import GameMain from '../controller/gameMain'
import constant from '../core/constant'
import { PlayerSeatPosition, PlayerSeatRelation } from '../core/enumerator'
import Huolong_GameReport from '../core/huolong_gameReport'
import pokerHelper from '../core/pokerHelper'
import HuolongPanel from './huolongPanel'
import { MainScene } from './mainScene'

const { ccclass, property, type } = _decorator;

@ccclass('GameReportPanel_Huolong')
export default class GameReportPanel_Huolong extends Component {
    @type(Label)
    labelGameResult: Label = null
    @type(Label)
    labelMatchNumber: Label = null
    @type(Label)
    labelOurValue: Label = null
    @type(Label)
    labelTheirValue: Label = null
    @type(Button)
    btnBackToStart: Button = null
    @type(Button)
    btnRestartNew: Button = null

    @property({ visible: false })
    mySeat: PlayerSeatPosition = 0
    @property({ visible: false })
    data: Huolong_GameReport = null
    @property({ visible: false })
    parentPanel: HuolongPanel = null

    onLoad() {
        this.btnBackToStart.node.on(UITransform.EventType.TOUCH_END, this.onBackToStart.bind(this))
        this.btnRestartNew.node.on(UITransform.EventType.TOUCH_END, this.onRestartNew.bind(this))
    }

    start() {
        if (this.data) {
            this.labelMatchNumber.string = this.data.totalMatches.toString()
            if (this.data.winner == this.mySeat || pokerHelper.getRelation(this.mySeat, this.data.winner) == PlayerSeatRelation.across) {
                this.labelGameResult.string = "攉龙！！！"
                this.labelGameResult.color = constant.color.green
                this.labelOurValue.string = "胜利"
                this.labelOurValue.color = constant.color.green
                if (this.data.winner == PlayerSeatPosition.north || this.data.winner == PlayerSeatPosition.south) {
                    this.labelTheirValue.string = this.data.nsFinalLevel.toString()
                } else {
                    this.labelTheirValue.string = this.data.weFinalLevel.toString()
                }
                GameMain.playSound("sound_game_win")
            } else {
                this.labelGameResult.string = "输了老铁！"
                this.labelGameResult.color = constant.color.red
                if (this.data.winner == PlayerSeatPosition.north || this.data.winner == PlayerSeatPosition.south) {
                    this.labelOurValue.string = this.data.weFinalLevel.toString()
                } else {
                    this.labelOurValue.string = this.data.nsFinalLevel.toString()
                }
                this.labelTheirValue.string = "胜利"
                this.labelTheirValue.color = constant.color.green
                GameMain.playSound("sound_game_lose")
            }
        }
    }

    // update (dt) {},

    startShow(mySeat: PlayerSeatPosition, data: Huolong_GameReport, parentPanel: HuolongPanel) {
        this.mySeat = mySeat
        this.data = data
        this.parentPanel = parentPanel
    }

    onBackToStart() {
        GameMain.onGameEnd(this.parentPanel)
        MainScene.getInstance().showStartPanel()
    }

    onRestartNew() {
        GameMain.onGameEnd(this.parentPanel)
        MainScene.getInstance().startSimple()
    }

}
