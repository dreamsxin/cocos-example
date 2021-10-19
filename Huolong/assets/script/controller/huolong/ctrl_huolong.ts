import { error, Game, log, SystemEvent, warn } from "cc";
import { Model_HuolongGame } from "../../model/model_huolongGame";
import { CharacterInfo } from "../../core/characterInfo";
import { CardColor, GameType, PlayerSeatPosition, PlayerSeatRelation, SystemEventType } from "../../core/enumerator";
import { Huolong_GameEvent, Huolong_GameEventResponse, Huolong_GameState, Huolong_MatchState, Huolong_PlayerEvent, Huolong_PlayerEventResult } from "../../core/enumerator_huolong";
import Huolong_PokerHelper from "../../core/huolong_pokerHelper";
import PokerCard from "../../core/pokerCard";
import pokerHelper from "../../core/pokerHelper";
import PokerLayout from "../../core/pokerLayout";
import scheduler from "../../utility/scheduler";
import CI_Huolong from "../interface/ci_huolong";
import PVI_Huolong from "../interface/pvi_huolong";
import GameMain from "../gameMain";
import HuolongGameSetting from "../../core/huolong_gameSetting";

class MessageData {
    isResponse: boolean
    seat: PlayerSeatPosition
    type: number
    data: any

    constructor(isResponse: boolean, seat: PlayerSeatPosition, type: number, data: any = null) {
        this.isResponse = isResponse
        this.seat = seat
        this.type = type
        this.data = data
    }
}

export default class Ctrl_Huolong implements CI_Huolong {
    players: PVI_Huolong[]
    readyTags: boolean[]
    model: Model_HuolongGame
    messageQueue: MessageData[]
    scheduler: Promise<void>
    showingPlayer: PlayerSeatPosition
    showingCards: number[]
    savingLastCards: number[][]
    disposed: boolean = false

    constructor(gameSetting: HuolongGameSetting) {
        this.players = [null, null, null, null]
        this.readyTags = [false, false, false, false]
        this.model = new Model_HuolongGame(gameSetting)
        this.messageQueue = []
        this.scheduler = null
        this.showingPlayer = 0
        this.showingCards = null
        this.savingLastCards = [null, null, null, null]


        GameMain.listenEvent(SystemEventType.onPlayerInfoChanged, this.onPlayerInfoChanged.bind(this))
    }

    public onDispose(): void {
        for (let p of this.players) {
            p.onDispose()
        }
        this.disposed = true
    }

    public getGameType(): GameType {
        return GameType.huolong
    }

    // 内值变更操作

    public setPlayer(seatIndex: number, player: PVI_Huolong) {
        this.players[seatIndex] = player
        player.setController(this)
        player.setSeat(seatIndex)
    }

    // 内值获取操作

    private checkPlayerFull(): boolean {
        for (let p in this.players) {
            if (p == null) {
                return false
            }
        }
        return true
    }

    public getOtherInfo(seat: number): CharacterInfo {
        return this.players[seat].getInfo()
    }

    public getAllPlayersInfo(): CharacterInfo[] {
        let ret: CharacterInfo[] = []
        for (let seat in this.players) {
            ret[seat] = this.players[seat].getInfo()
        }
        return ret
    }

    public getAllPlayersId(): number[] {
        let ret: number[] = []
        for (let seat in this.players) {
            if (this.players[seat] == null) {
                ret[seat] = 0
            } else {
                let info = this.players[seat].getInfo()
                if (info == null) {
                    ret[seat] = 0
                } else {
                    ret[seat] = info.id
                }
            }
        }
        return ret
    }

    public getGameSetting(): HuolongGameSetting {
        return this.model.gameSetting
    }

    public getMainPlayer(): PlayerSeatPosition {
        return this.model.mainPlayer
    }

    public getMainColor(): CardColor {
        return this.model.mainColor
    }

    public getMainPoint(): number {
        return this.model.getMainPoint()
    }

    public getLoserPoint(): number {
        return this.model.getLoserPoint()
    }

    public getNowScore(): number {
        return this.model.currentMatch.score
    }

    public getMatchIndex(): number {
        return this.model.matchIndex
    }

    public getRoundIndex(): number {
        return this.model.currentMatch.currentRoundIndex
    }

    public getLeadPlayer(): number {
        return this.model.currentMatch.leadPlayer
    }

    public getShowedCardsNum(): number {
        if (this.model.matchIndex == 0) {
            if (this.showingCards != null) {
                return this.showingCards.length
            } else {
                return this.model.currentMatch.getShowedCardsNum()
            }
        } else {
            return 99
        }
    }

    // 流程控制, 事件通知响应

    public responseEvent(seat: PlayerSeatPosition, event: Huolong_GameEventResponse): boolean {
        if (this.model.currentMatch == null) {
            warn("不在游戏中, 收到了事件回复, 座次: " + seat + ", 事件： " + event)
            return false
        } else if (this.model.currentMatch.state != Huolong_MatchState.waitingResponse) {
            warn("非法的回复时机, 座次: " + seat + ", 事件： " + event)
            return false
        } else {
            this.messageQueue.push(new MessageData(true, seat, event))
        }
        return true
    }

    public playerOperate(seat: PlayerSeatPosition, event: Huolong_PlayerEvent, data: any): boolean {
        if (this.model.currentMatch == null) {
            warn("不在游戏中, 收到了事件操作, 座次: " + seat + ", 事件： " + event)
            this.players[seat].responseOperate(event, Huolong_PlayerEventResult.cannotPushEvent)
            return false
        } else {
            this.messageQueue.push(new MessageData(false, seat, event, data))
        }
        return true
    }

    /**
     * 游戏开始
     */
    public startGame() {
        if (!this.checkPlayerFull() || this.model.state == Huolong_GameState.gaming) {
            return
        }
        this.scheduler = this.update(0.1)
        this.model.startNewGame()
        this.model.setGameState(Huolong_GameState.gaming)
        for (let p of this.players) {
            p.pushEvent(Huolong_GameEvent.startGame, null)
        }
        this.toNextMatch()
    }

    // 流程处理

    /**
     * 下一局开始
     */
    private toNextMatch() {
        if (this.model.state == Huolong_GameState.gaming && this.model.getMatchState() == Huolong_MatchState.idle) {
            this.noticePlayersToReset()
        } else {
            error("不在游戏中, 收到了开始下一局的指令, 游戏状态: " + this.model.state + ", 局状态： " + this.model.getMatchState())
        }
    }

    /**
     * 新局开始, 通知所有玩家, 要求他们返回就绪状态
     */
    private noticePlayersToReset() {
        this.readyTags = [false, false, false, false]
        this.model.setMatchState(Huolong_MatchState.waitingResponse)
        for (let p of this.players) {
            p.pushEvent(Huolong_GameEvent.startMatch, this.model.matchIndex)
        }
    }

    /**
     * 收到玩家的就绪回复, 做处理, 当所有玩家就绪时, 本局开始
     * @param playerSeat 玩家座次
     */
    private onPlayerReady(playerSeat: PlayerSeatPosition) {
        this.readyTags[playerSeat] = true
        for (let p of this.readyTags) {
            if (!p) {
                return
            }
        }
        // 所有玩家已就绪
        this.onGiveCards()
    }

    /**
     * 发牌过程
     */
    private async onGiveCards() {
        this.model.currentMatch.prepareGivingCards()
        this.model.setMatchState(Huolong_MatchState.givingCards)
        // 通知UI开始发牌
        if (this.model.matchIndex == 0) {
            let currentPlayer = this.getMainPlayer()
            while (!this.model.isCardGivingOver()) {
                await scheduler.waitFor(this.model.gameSetting.firstRoundGiveCardsDelay)
                let card = this.model.currentMatch.giveOneCardToPlayer(currentPlayer)
                this.players[currentPlayer].pushEvent(Huolong_GameEvent.giveCard, card)
                if (this.showingCards != null && this.showingPlayer == currentPlayer) {
                    if (PokerCard.getColor(card) != CardColor.joker) {
                        log("亮王牌成功")
                        this.model.showJokerCards(currentPlayer, this.showingCards, card)
                        for (let p of this.players) {
                            p.pushEvent(Huolong_GameEvent.playerShowedStar, [currentPlayer, card, this.showingCards])
                        }
                        this.showingCards = null
                    } else if (PokerCard.getPoint(card) == 1) {
                        log("大王牌叠加，加亮")
                        this.showPlayerStar(currentPlayer, this.showingCards.length + 1)
                    } else {
                        log("亮王牌遇到小王，跳过")

                    }
                }
                currentPlayer = pokerHelper.getPosition(currentPlayer, PlayerSeatRelation.next)
            }
            this.model.currentMatch.setOtherCardsToLast()
        } else {
            this.model.currentMatch.giveAllCardsOver()
            for (let i in this.players) {
                this.players[i].pushEvent(Huolong_GameEvent.giveAllCards, this.model.getPlayerCards(parseInt(i)))
            }
            await scheduler.waitFor(this.model.gameSetting.firstRoundGiveCardsDelay)
        }
        this.readyTags = [false, false, false, false]
        this.model.setMatchState(Huolong_MatchState.waitingResponse)
        for (let p of this.players) {
            p.pushEvent(Huolong_GameEvent.gaveCardsOver, null)
        }
    }

    /**
     * 有玩家发送亮王牌时
     * @param seat 座次
     * @param cards 亮王牌的数量
     */
    private onPlayerShowedStar(seat: PlayerSeatPosition, cards: number) {
        if (this.model.getMatchState() != Huolong_MatchState.givingCards || this.model.matchIndex > 0) {
            warn("不在发牌阶段中, 收到了亮王牌操作, 座次: " + seat + ", 数量 " + cards)
            this.players[seat].responseOperate(Huolong_PlayerEvent.showStar, Huolong_PlayerEventResult.starCannotShow)
        } else if (this.getShowedCardsNum() > cards) {
            warn("收到了亮王牌操作, 但牌数未达到要求, 座次: " + seat + ", 数量 " + cards + ", 要求数量：" + this.getShowedCardsNum())
            this.players[seat].responseOperate(Huolong_PlayerEvent.showStar, Huolong_PlayerEventResult.starCardsNotEnough)
        } else {
            let realNum = this.model.currentMatch.playerCardLayouts[seat].getJoker1Num()
            if (realNum < cards) {
                warn("收到了亮王牌操作, 但实际牌数未达到自称数, 座次: " + seat + ", 数量 " + cards + ", 实际数量：" + realNum)
                this.players[seat].responseOperate(Huolong_PlayerEvent.showStar, Huolong_PlayerEventResult.starCardsYouDonnotHave)
            } else {
                this.showPlayerStar(seat, cards)
                this.players[seat].responseOperate(Huolong_PlayerEvent.showStar, Huolong_PlayerEventResult.success)
            }
        }
    }

    private showPlayerStar(seat: PlayerSeatPosition, cards: number) {
        this.showingPlayer = seat
        this.showingCards = this.model.currentMatch.playerCardLayouts[seat].showJoker1Cards(cards)
    }

    /**
     * 有玩家返回"摸牌完毕就绪"(Huolong_GameEventResponse.cardsGot)事件时，在此处理. 所有玩家就绪，则开始处理底牌
     * @param playerSeat 
     * @returns 
     */
    private onGetCardsOK(playerSeat: PlayerSeatPosition) {
        this.readyTags[playerSeat] = true
        for (let p of this.readyTags) {
            if (!p) {
                return
            }
        }
        // 所有玩家已就绪
        this.onSendLastCards()
    }

    /**
     * 发底牌逻辑
     */
    private onSendLastCards() {
        if (this.getMainColor() == CardColor.joker) {
            this.readyTags = [false, false, false, false]
            this.model.setMatchState(Huolong_MatchState.waitingResponse)
            for (let p of this.players) {
                p.pushEvent(Huolong_GameEvent.matchAborted_nobodyShown, null)
            }
        } else {
            this.model.setMatchState(Huolong_MatchState.givingLastCards)
            let lastCards = this.model.currentMatch.giveLastCardsToMainPlayer()
            this.savingLastCards = [null, null, null, null]
            for (let p of this.players) {
                p.pushEvent(Huolong_GameEvent.sendLastCards, lastCards)
            }
        }
    }

    private onMatchAbortedOK(seat: PlayerSeatPosition) {
        this.readyTags[seat] = true
        for (let p of this.readyTags) {
            if (!p) {
                return
            }
        }
        // 所有玩家已就绪
        this.model.setGameState(Huolong_GameState.idle)
        this.startGame()
    }

    /**
     * 有玩家埋底牌时处理
     * @param seat 座次
     * @param cards 要埋底/摘星的牌
     */
    private onPlayerThrewLastCards(seat: PlayerSeatPosition, cards: number[]) {
        if (this.model.getMatchState() != Huolong_MatchState.givingLastCards) {
            this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.lastCardsCannotThrow)
        } else if (cards != null && PokerLayout.checkCardsRepeat(cards)) {
            this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.lastCardsRepeated)
        } else {
            if (cards == null) {
                cards = []
            }
            if (this.model.mainPlayer == seat) {
                if (Huolong_PokerHelper.getNeedNumberOfLastCards(this.model.gameSetting.groupNum) != cards.length) {
                    this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.lastCardsNumberWrong)
                } else if (!this.model.currentMatch.playerCardLayouts[seat].checkHasCards(cards)) {
                    this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.lastCardsYouDonnotHave)
                } else {
                    log("玩家" + seat + "埋底，数量：" + cards.length)
                    this.savingLastCards[seat] = cards
                    this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.success)
                }
            } else {
                let isNotJoker = false
                for (let c of cards) {
                    if (PokerCard.getColor(c) != CardColor.joker) {
                        isNotJoker = true
                        break
                    }
                }
                if (isNotJoker) {
                    this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.lastCardsTypeError)
                } else if (!this.model.currentMatch.playerCardLayouts[seat].checkHasCards(cards)) {
                    this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.lastCardsYouDonnotHave)
                } else {
                    log("玩家" + seat + "摘星，数量：" + cards.length)
                    this.savingLastCards[seat] = cards
                    this.players[seat].responseOperate(Huolong_PlayerEvent.throwLastCard, Huolong_PlayerEventResult.success)
                }
            }
            let allOver = true
            for (let i = 0; i < 4; ++i) {
                if (this.savingLastCards[i] == null) {
                    allOver = false
                }
            }
            if (allOver) {
                this.resolveLastCards()
            }
        }
    }

    private resolveLastCards() {
        let joker1Num = 0
        for (let p of this.savingLastCards) {
            for (let c of p) {
                if (PokerCard.getColor(c) == CardColor.joker && PokerCard.getPoint(c) == 1) {
                    joker1Num++
                }
            }
        }
        if (joker1Num == 0) {
            // 1. 去除无效的摘星：没人摘大王的话，非庄家的小王无效
            for (let seat = 0; seat < this.savingLastCards.length; ++seat) {
                if (seat != this.model.mainPlayer) {
                    this.savingLastCards[seat] = []
                }
            }
        }
        if (joker1Num > 0.65 * this.model.gameSetting.groupNum && joker1Num < this.model.gameSetting.groupNum) {
            // 2. 强制摘星,只对未摘大王的玩家生效
            for (let seat = 0; seat < this.savingLastCards.length; ++seat) {
                let joker1Num = 0
                let p = this.savingLastCards[seat]
                for (let c of p) {
                    if (PokerCard.getColor(c) == CardColor.joker && PokerCard.getPoint(c) == 1) {
                        joker1Num++
                    }
                }
                if (joker1Num == 0) {
                    this.savingLastCards[seat] = this.savingLastCards[seat].concat(this.model.currentMatch.playerCardLayouts[seat].showJoker1Cards())
                }
            }

        }
        // 3. 交换最终摘星牌和底牌
        this.readyTags = [false, false, false, false]
        this.model.setMatchState(Huolong_MatchState.waitingResponse)
        let result = this.model.currentMatch.makeLastCards(this.savingLastCards)
        for (let seat in result) {
            this.players[seat].pushEvent(Huolong_GameEvent.threwLastCards, result[seat])
        }
    }

    private onLastCardsConfirm(playerSeat: PlayerSeatPosition) {
        this.readyTags[playerSeat] = true
        for (let p of this.readyTags) {
            if (!p) {
                return
            }
        }
        // 所有玩家已就绪
        this.startRunRound()
    }

    /**
     * 开始新一回合行牌
     */
    private startRunRound() {
        this.model.setMatchState(Huolong_MatchState.rounding)
        if (this.model.currentMatch.checkIsAllRoundsOver()) {
            this.onMatchOver()
        } else {
            this.model.currentMatch.clearRoundCards()
            this.askForNextThrow()
        }
    }

    /**
     * 要求当前玩家出牌
     */
    private askForNextThrow() {
        this.model.currentMatch.nextPlayerThrow()
        if (this.model.currentMatch.getThrewPlayersCount() >= 4) {
            this.onRoundOver()
        } else {
            this.model.setMatchState(Huolong_MatchState.rounding)
            this.players[this.model.currentMatch.currentPlayer].pushEvent(Huolong_GameEvent.askForThrow, this.model.currentMatch.getCurrentRoundThrew())
        }
    }

    /**
     * 玩家出牌处理
     * @param playerSeat 座次
     * @param cards 所出的牌
     */
    private onThrowCards(playerSeat: PlayerSeatPosition, cards: number[]) {
        if (this.model.getMatchState() != Huolong_MatchState.rounding || this.model.currentMatch.currentPlayer != playerSeat) {
            this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.threwCardsUnavailable)
        } else if (cards != null && PokerLayout.checkCardsRepeat(cards)) {
            this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.threwCardsRepeated)
        } else if (playerSeat != this.model.currentMatch.leadPlayer && (cards == null || cards.length != this.model.currentMatch.getThrowNeedNum())) {
            this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.threwCardsNumberWrong)
        } else if (!this.model.currentMatch.checkIsTheThrewRight(playerSeat, cards)) {
            if (playerSeat == this.model.currentMatch.leadPlayer) {
                this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.threwCardsTypeWrong)
            } else {
                this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.threwCardsColorWrong)
            }
        } else if (!this.model.currentMatch.playerCardLayouts[playerSeat].checkHasCards(cards)) {
            this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.threwCardsYouDonnotHave)
        } else {
            let ret = this.model.currentMatch.makeThrowCards(playerSeat, cards)
            this.players[playerSeat].responseOperate(Huolong_PlayerEvent.throwCard, Huolong_PlayerEventResult.success)
            for (let p of this.players) {
                p.pushEvent(Huolong_GameEvent.playerThrew, ret)
            }
            this.askForNextThrow()
        }
    }

    /**
     * 回合结束，结算回合结果
     */
    private onRoundOver() {
        let ret = this.model.currentMatch.makeRoundCalculate()
        this.readyTags = [false, false, false, false]
        this.model.setMatchState(Huolong_MatchState.waitingResponse)
        for (let p of this.players) {
            p.pushEvent(Huolong_GameEvent.roundReport, ret)
        }
    }

    private onRoundConfirm(playerSeat: PlayerSeatPosition) {
        this.readyTags[playerSeat] = true
        for (let p of this.readyTags) {
            if (!p) {
                return
            }
        }
        // 所有玩家已就绪
        this.startRunRound()
    }

    /**
     * 本局结束，结算结果
     */
    private onMatchOver() {
        let ret = this.model.makeMatchCalculate()
        this.readyTags = [false, false, false, false]
        this.model.setMatchState(Huolong_MatchState.waitingResponse)
        for (let p of this.players) {
            p.pushEvent(Huolong_GameEvent.matchReport, ret)
        }
    }

    private onMatchOverConfirm(playerSeat: PlayerSeatPosition) {
        this.readyTags[playerSeat] = true
        for (let p of this.readyTags) {
            if (!p) {
                return
            }
        }
        let gameReport = this.model.getGameResult()
        if (gameReport == null) {
            this.model.startNextMatch()
            this.model.setMatchState(Huolong_MatchState.idle)
            this.toNextMatch()
        } else {
            for (let p of this.players) {
                p.pushEvent(Huolong_GameEvent.gameReport, gameReport)
            }
            this.model.setGameState(Huolong_GameState.idle)
        }
    }

    /**
     * 队列消息处理循环
     * @param dt 处理周期
     */
    private async update(dt: number) {
        while (!this.disposed) {
            let msg: MessageData = null
            if (this.messageQueue.length > 0) {
                msg = this.messageQueue[0]
                this.messageQueue.splice(0, 1)
                if (msg.isResponse) {
                    if (this.model.currentMatch.state != Huolong_MatchState.waitingResponse) {
                        warn("回复重复或已过时, 座次: " + msg.seat + ", 事件： " + msg.type)
                    } else switch (msg.type) {
                        case Huolong_GameEventResponse.matchReady:
                            this.onPlayerReady(msg.seat)
                            break;
                        case Huolong_GameEventResponse.cardsGot:
                            this.onGetCardsOK(msg.seat)
                            break;
                        case Huolong_GameEventResponse.matchAborted_nobodyShown_confirm:
                            this.onMatchAbortedOK(msg.seat)
                            break;
                        case Huolong_GameEventResponse.lastCardsConfirm:
                            this.onLastCardsConfirm(msg.seat)
                            break;
                        case Huolong_GameEventResponse.roundConfirm:
                            this.onRoundConfirm(msg.seat)
                            break;
                        case Huolong_GameEventResponse.matchConfirm:
                            this.onMatchOverConfirm(msg.seat)
                            break;
                    }
                } else {
                    switch (msg.type) {
                        case Huolong_PlayerEvent.showStar:
                            this.onPlayerShowedStar(msg.seat, msg.data)
                            break
                        case Huolong_PlayerEvent.throwLastCard:
                            this.onPlayerThrewLastCards(msg.seat, msg.data)
                            break
                        case Huolong_PlayerEvent.throwCard:
                            this.onThrowCards(msg.seat, msg.data)
                    }
                }
            }
            await scheduler.waitFor(dt)
        }
    }

    private onPlayerInfoChanged(event: SystemEvent, myData: any, game: GameType, seat: PlayerSeatPosition, oldInfo: CharacterInfo, newInfo: CharacterInfo) {
        if (game == this.getGameType() && this.players[seat] != null && this.players[seat].getInfo().equals(oldInfo)) {
            for (let p of this.players) {
                p.pushEvent(Huolong_GameEvent.playerInfoChanged, [seat, oldInfo, newInfo])
            }
        }
    }
}