import { Button, Label, UITransform, Node, v3, _decorator, Component } from 'cc'
import GameMain from '../controller/gameMain'
import CI_Huolong from '../controller/interface/ci_huolong'
import PIV_Huolong from '../controller/interface/piv_huolong'
import constant from '../core/constant'
import { PlayerSeatPosition, PlayerSeatRelation } from '../core/enumerator'
import Huolong_MatchReport from '../core/huolong_matchReport'
import Huolong_PokerHelper from '../core/huolong_pokerHelper'
import PokerCard from '../core/pokerCard'
import pokerHelper from '../core/pokerHelper'
import { MainScene } from './mainScene'

const { ccclass, property, type } = _decorator;

@ccclass('MatchReportPanel_Huolong')
export default class MatchReportPanel_Huolong extends Component {
    @type(Label)
    labelWinLose: Label = null
    @type(Label)
    labelMainPlayerGetLast: Label = null
    @type(Label)
    labelLoserScore: Label = null
    @type(Label)
    labelOurOldLevel: Label = null
    @type(Label)
    labelOurNewLevel: Label = null
    @type(Label)
    labelTheirOldLevel: Label = null
    @type(Label)
    labelTheirNewLevel: Label = null
    @type(Node)
    lastCards: Node = null
    @type(Button)
    btnSearchDesk: Button = null
    @type(Button)
    btnContinue: Button = null

    @property({ visible: false })
    mySeat: PlayerSeatPosition = 0
    @property({ visible: false })
    noSound: boolean = false
    @property({ visible: false })
    vector: PIV_Huolong = null
    @property({ visible: false })
    data: Huolong_MatchReport = null
    @property({ visible: false })
    searchDescCB: Function = null
    @property({ visible: false })
    continueCB: Function = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.btnSearchDesk.node.on(UITransform.EventType.TOUCH_END, this.onClickSearchDesk.bind(this))
        this.btnContinue.node.on(UITransform.EventType.TOUCH_END, this.onClickMatchContinue.bind(this))

    }

    start() {
        if (this.data) {
            this.onMatchOver()
        }
    }

    // update (dt) {},

    startShow(mySeat: PlayerSeatPosition, noSound: boolean, vector: PIV_Huolong, data: Huolong_MatchReport, searchDescCB: Function, continueCB: Function) {
        this.mySeat = mySeat
        this.noSound = noSound
        this.vector = vector
        this.data = data
        this.searchDescCB = searchDescCB
        this.continueCB = continueCB
    }

    onClickSearchDesk() {
        if (this.searchDescCB) {
            this.searchDescCB()
        }
        this.node.removeFromParent()
    }

    onClickMatchContinue() {
        if (this.continueCB) {
            this.continueCB()
        }
        this.node.removeFromParent()
    }

    onMatchOver() {
        let ourOldLevel = this.data.oldLevel
        let ourNewLevel = this.data.newLevel
        let theirOldLevel = this.data.oldLevel
        let theirNewLevel = this.data.newLevel
        let areWeOldZhuang = this.mySeat == this.data.oldMainPlayer || pokerHelper.getRelation(this.mySeat, this.data.oldMainPlayer) == PlayerSeatRelation.across
        let retString = ""
        // todo sound ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????/????????????
        if (areWeOldZhuang && !this.data.mainGroupChange) {
            if (this.data.upgradeLevels < 0) {
                this.labelWinLose.color = constant.color.red
                GameMain.playSound("sound_match_lose")
                retString = "?????????"
            } else {
                this.labelWinLose.color = constant.color.green
                switch (this.data.upgradeLevels) {
                    case 0:
                        retString = "??????????????????"
                        break
                    case 1:
                        retString = "?????????"
                        break
                    default:
                        retString = "????????????"
                        break
                }
                if (!this.noSound)
                    GameMain.playSound("sound_match_win")
            }
            if (this.mySeat == PlayerSeatPosition.north || this.mySeat == PlayerSeatPosition.south) {
                theirOldLevel = this.vector.getLoserPoint()
                theirNewLevel = this.vector.getLoserPoint()
            } else {
                theirOldLevel = this.vector.getLoserPoint()
                theirNewLevel = this.vector.getLoserPoint()
            }
        } else if (areWeOldZhuang && this.data.mainGroupChange) {
            this.labelWinLose.color = constant.color.red
            switch (this.data.upgradeLevels) {
                case 0:
                    retString = "??????"
                    break
                case 1:
                    retString = "?????????"
                    break
                default:
                    retString = "????????????"
                    break
            }
            if (!this.noSound)
                GameMain.playSound("sound_match_lose")
            if (this.mySeat == PlayerSeatPosition.north || this.mySeat == PlayerSeatPosition.south) {
                ourOldLevel = this.vector.getLoserPoint()
                ourNewLevel = this.vector.getLoserPoint()
            } else {
                ourOldLevel = this.vector.getLoserPoint()
                ourNewLevel = this.vector.getLoserPoint()
            }
        } else if (!areWeOldZhuang && this.data.mainGroupChange) {
            this.labelWinLose.color = constant.color.green
            switch (this.data.upgradeLevels) {
                case 0:
                    retString = "??????"
                    break
                case 1:
                    retString = "?????????"
                    break
                default:
                    retString = "????????????"
                    break
            }
            if (!this.noSound)
                GameMain.playSound("sound_match_win")
            if (this.mySeat == PlayerSeatPosition.north || this.mySeat == PlayerSeatPosition.south) {
                theirOldLevel = this.vector.getLoserPoint()
                theirNewLevel = this.vector.getLoserPoint()
            } else {
                theirOldLevel = this.vector.getLoserPoint()
                theirNewLevel = this.vector.getLoserPoint()
            }
        } else {
            if (this.data.upgradeLevels < 0) {
                this.labelWinLose.color = constant.color.green
                retString = "?????????"
                GameMain.playSound("sound_match_win")
            } else {
                this.labelWinLose.color = constant.color.red
                switch (this.data.upgradeLevels) {
                    case 0:
                        retString = "??????"
                        break
                    case 1:
                        retString = "?????????"
                        break
                    default:
                        retString = "????????????"
                        break
                }
                if (!this.noSound)
                    GameMain.playSound("sound_match_lose")
            }
            if (this.mySeat == PlayerSeatPosition.north || this.mySeat == PlayerSeatPosition.south) {
                ourOldLevel = this.vector.getLoserPoint()
                ourNewLevel = this.vector.getLoserPoint()
            } else {
                ourOldLevel = this.vector.getLoserPoint()
                ourNewLevel = this.vector.getLoserPoint()
            }
        }
        // ??????????????????
        this.labelWinLose.string = retString
        this.labelMainPlayerGetLast.string = (!this.data.mainGroupChange && (this.data.upgradeLevels >= 0)) ? "??????" : "??????"
        this.labelMainPlayerGetLast.color = (!this.data.mainGroupChange && (this.data.upgradeLevels >= 0)) ? constant.color.green : constant.color.red
        this.labelLoserScore.string = this.data.totalScore.toString()
        if (this.data.totalScore > Huolong_PokerHelper.getNeedScore(this.vector.getGameSetting().groupNum))
            this.labelLoserScore.color = constant.color.green
        else
            this.labelLoserScore.color = constant.color.red
        this.labelOurOldLevel.string = PokerCard.toPointString(ourOldLevel)
        this.labelOurNewLevel.string = PokerCard.toPointString(ourNewLevel)
        if (ourNewLevel > ourOldLevel)
            this.labelOurNewLevel.color = constant.color.green
        else
            this.labelOurNewLevel.color = constant.color.red
        if (ourOldLevel == 1 && ourNewLevel > 1)
            this.labelOurNewLevel.string = '??????'
        this.labelTheirOldLevel.string = PokerCard.toPointString(theirOldLevel)
        this.labelTheirNewLevel.string = PokerCard.toPointString(theirNewLevel)
        if (theirNewLevel > theirOldLevel)
            this.labelTheirNewLevel.color = constant.color.green
        else
            this.labelTheirNewLevel.color = constant.color.red
        if (theirOldLevel == 1 && theirNewLevel > 1)
            this.labelTheirNewLevel.string = '??????'
        // ??????
        this.lastCards.removeAllChildren()
        let lastCardsCount = this.data.lastCards.length
        for (let i = 0; i < lastCardsCount; ++i) {
            let btnCard = MainScene.getInstance().createCard(this.data.lastCards[i])
            this.lastCards.addChild(btnCard.node)
            btnCard.node.position = v3((i - (lastCardsCount - 1) / 2) * 30, 0, btnCard.node.position.z)
        }
    }
}
