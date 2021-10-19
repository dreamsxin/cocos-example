import { error, log } from "cc"
import { CharacterInfo } from "../../core/characterInfo"
import { CardColor, GameType, PlayerSeatPosition, PlayerType } from "../../core/enumerator"
import { Huolong_GameEventResponse, Huolong_PlayerEvent, Huolong_PlayerEventResult } from "../../core/enumerator_huolong"
import Huolong_GameReport from "../../core/huolong_gameReport"
import Huolong_LastCardsInfo from "../../core/huolong_lastCardsInfo"
import Huolong_MatchReport from "../../core/huolong_matchReport"
import Huolong_PokerHelper from "../../core/huolong_pokerHelper"
import Huolong_RoundReport from "../../core/huolong_roundReport"
import Huolong_ThrewCardsInfo from "../../core/huolong_threwCardsInfo"
import PokerCard from "../../core/pokerCard"
import pokerHelper from "../../core/pokerHelper"
import PokerLayout from "../../core/pokerLayout"
import scheduler from "../../utility/scheduler"
import GameMain from "../gameMain"
import PII_Huolong from "../interface/pii_huolong"
import PIV_Huolong from "../interface/piv_huolong"

export default class PlayerItem_Huolong_AI implements PII_Huolong {
    vector: PIV_Huolong
    cardLayout: PokerLayout
    disposed: boolean = false

    constructor() {
        this.cardLayout = new PokerLayout
    }

    public setVector(vector: PIV_Huolong): void {
        this.vector = vector
    }

    public onDispose(): void {
        this.disposed = true
    }

    // 获取属性

    public getType(): PlayerType {
        return PlayerType.ai
    }

    public getGameType(): GameType {
        return GameType.huolong
    }

    public onGameStart() {

    }

    public onMatchStart(matchIndex: number) {
        this.cardLayout.clear()
        this.vector.responseEvent(Huolong_GameEventResponse.matchReady)
    }

    public onGetACard(card: number) {
        this.cardLayout.pushCard(card)
        let shows = this.checkCanShow()
        if (shows > 0) {
            this.vector.callOperate(Huolong_PlayerEvent.showStar, shows)
        }
    }

    public onGetAllCards(cards: number[]) {
        this.cardLayout.pushCardsRange(cards)
    }

    public onOverGetCards() {
        this.vector.responseEvent(Huolong_GameEventResponse.cardsGot)
    }

    public onPlayerShowedStar(seat: PlayerSeatPosition, targetCard: number, jokerCards: number[]) {

    }

    public onMatchAborted() {
        this.vector.responseEvent(Huolong_GameEventResponse.matchAborted_nobodyShown_confirm)
    }

    public onSendLastCards(cards: number[]) {
        if (this.vector.getMainPlayer() == this.vector.getMySeat()) {
            this.cardLayout.pushCardsRange(cards)
            this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, cards)
        } else {
            // debug 测试底牌返还逻辑，所有AI全部摘星
            Huolong_PokerHelper.sortCards(this.cardLayout.cards, this.vector.getMainColor(), this.vector.getMainPoint())
            let lastCards = []
            for (let i = 0; i < this.vector.getGameSetting().groupNum * 2; ++i) {
                if (PokerCard.getColor(this.cardLayout.cards[i]) == CardColor.joker) {
                    //lastCards.push(this.cardLayout.cards[i])
                }
            }
            this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, lastCards)
        }
    }

    public onOverLastCards(lastCards: Huolong_LastCardsInfo) {
        for (let c of lastCards.pain) {
            this.cardLayout.deleteCard(c)
        }
        this.cardLayout.pushCardsRange(lastCards.gain)
        Huolong_PokerHelper.sortCards(this.cardLayout.cards, this.vector.getMainColor(), this.vector.getMainPoint())
        this.vector.responseEvent(Huolong_GameEventResponse.lastCardsConfirm)
    }

    public async onAskForThrow(currentRoundThrew: number[][]) {
        let firstSeat = this.vector.getLeadPlayer()
        if (firstSeat == this.vector.getMySeat()) {
            this.vector.callOperate(Huolong_PlayerEvent.throwCard, [this.cardLayout.showLastCard()])
        } else {
            let num = currentRoundThrew[firstSeat].length
            let [cards, otherCards] = this.getSuitableCards(currentRoundThrew[firstSeat])
            if (num == 0)
                num = 1
            let threwCards = []
            for (let i = 0; i < num; ++i) {
                if (i >= cards.length)
                    threwCards.push(otherCards[otherCards.length + cards.length - i - 1])
                else
                    threwCards.push(cards[cards.length - 1 - i])
            }
            await scheduler.waitFor(GameMain.getSystemSetting().aiDelay)
            this.vector.callOperate(Huolong_PlayerEvent.throwCard, threwCards)
        }
    }

    public onPlayerThrewCard(info: Huolong_ThrewCardsInfo) {
        if (info.seat == this.vector.getMySeat()) {
            for (let c of info.cards) {
                this.cardLayout.deleteCard(c)
            }
        }
    }

    public onRoundOver(reportData: Huolong_RoundReport) {
        this.vector.responseEvent(Huolong_GameEventResponse.roundConfirm)
    }

    public onMatchOver(reportData: Huolong_MatchReport) {
        this.vector.responseEvent(Huolong_GameEventResponse.matchConfirm)
    }

    public onGameOver(reportData: Huolong_GameReport) {
    }

    public onPlayerInfoChanged(seat: PlayerSeatPosition, oldInfo: CharacterInfo, newInfo: CharacterInfo) {
    }

    public onResponse(event: Huolong_PlayerEvent, result: Huolong_PlayerEventResult): void {
        switch (event) {
            case Huolong_PlayerEvent.showStar:
                if (result != Huolong_PlayerEventResult.success) {
                    error(pokerHelper.positionToString(this.vector.getMySeat()) + "AI亮王牌请求失败，结果：" + result)
                }
                break
            case Huolong_PlayerEvent.throwLastCard:
                if (result != Huolong_PlayerEventResult.success) {
                    error(pokerHelper.positionToString(this.vector.getMySeat()) + "AI埋底请求失败，结果：" + result)
                }
                break
            case Huolong_PlayerEvent.throwCard:
                if (result != Huolong_PlayerEventResult.success) {
                    error(pokerHelper.positionToString(this.vector.getMySeat()) + "AI出牌请求失败，结果：" + result)
                }
                break
        }
    }

    // protected utility functions

    public checkCanShow() {
        let showNeedNum = this.vector.getShowedCardsNum() + 1
        let myNum = this.cardLayout.getJoker1Num()
        if (showNeedNum == 0) {
            return 0
        }
        if (showNeedNum <= myNum) {
            return myNum
        }
        return 0
    }

    public getSuitableCards(leadCards: number[]) {
        return Huolong_PokerHelper.getSuitableCards(leadCards, this.cardLayout.cards, this.vector.getMainColor(), this.vector.getMainPoint())
    }

}