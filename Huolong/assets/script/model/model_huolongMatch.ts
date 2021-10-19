import { CardColor, PlayerSeatPosition, PlayerSeatRelation } from "../core/enumerator";
import { Huolong_MatchState } from "../core/enumerator_huolong";
import HuolongGameSetting from "../core/huolong_gameSetting";
import Huolong_LastCardsInfo from "../core/huolong_lastCardsInfo";
import Huolong_MatchReport from "../core/huolong_matchReport";
import Huolong_PokerHelper from "../core/huolong_pokerHelper";
import Huolong_RoundReport from "../core/huolong_roundReport";
import Huolong_ThrewCardsInfo from "../core/huolong_threwCardsInfo";
import PokerCard from "../core/pokerCard";
import pokerHelper from "../core/pokerHelper";
import PokerLayout from "../core/pokerLayout";

export class Model_HuolongMatch {
    // 游戏设定
    gameSetting: HuolongGameSetting
    mainColor: CardColor

    // 局设定
    mainPlayer: PlayerSeatPosition
    mainPoint: number

    // 局状态
    score: number
    state: Huolong_MatchState

    // 回合状态
    currentRoundIndex: number
    leadPlayer: PlayerSeatPosition
    currentPlayer: PlayerSeatPosition
    showedCards: number[]

    // 卡池
    mainCardLayout: PokerLayout     // 摸牌区
    threwCardLayout: PokerLayout    // 弃牌区
    lastCardLayout: PokerLayout     // 底牌区
    roundCardLayout: PokerLayout[]  // 行牌区
    playerCardLayouts: PokerLayout[] // 手牌

    constructor(gameSetting: HuolongGameSetting, mainColor: CardColor, mainPlayer: PlayerSeatPosition, mainPoint: number) {
        this.gameSetting = gameSetting
        this.mainColor = mainColor
        this.mainPlayer = mainPlayer
        this.mainPoint = mainPoint
        this.score = 0
        this.state = Huolong_MatchState.idle
        this.currentRoundIndex = 0
        this.leadPlayer = mainPlayer
        this.currentPlayer = mainPlayer
        this.showedCards = []
    }

    getShowedCardsNum(): number {
        return this.showedCards.length
    }

    getThrowNeedNum(): number {
        return this.roundCardLayout[this.leadPlayer].cardsCount()
    }

    isCardGivingOver() {
        return this.mainCardLayout.cardsCount() <= Huolong_PokerHelper.getNeedNumberOfLastCards(this.gameSetting.groupNum)
    }

    prepareGivingCards() {
        this.mainCardLayout = new PokerLayout
        this.mainCardLayout.init(this.gameSetting.groupNum, true, true)
        this.mainCardLayout.randomAllCards()
        this.threwCardLayout = new PokerLayout
        this.lastCardLayout = new PokerLayout
        this.roundCardLayout = [new PokerLayout, new PokerLayout, new PokerLayout, new PokerLayout]
        this.playerCardLayouts = [new PokerLayout, new PokerLayout, new PokerLayout, new PokerLayout]
    }

    giveOneCardToPlayer(seat: PlayerSeatPosition): number {
        let ret = this.mainCardLayout.dequeueCard()
        this.playerCardLayouts[seat].pushCard(ret)
        return ret
    }

    setOtherCardsToLast() {
        while (this.mainCardLayout.cardsCount() > 0) {
            this.lastCardLayout.pushCard(this.mainCardLayout.dequeueCard())
        }
    }

    giveAllCardsOver() {
        let currentPlayer = this.mainPlayer
        while (!this.isCardGivingOver()) {
            this.playerCardLayouts[currentPlayer].pushCard(this.mainCardLayout.dequeueCard())
            currentPlayer = pokerHelper.getPosition(currentPlayer, PlayerSeatRelation.next)
        }
        this.setOtherCardsToLast()
    }

    giveLastCardsToMainPlayer() {
        for (let c of this.lastCardLayout.cards) {
            this.playerCardLayouts[this.mainPlayer].pushCard(c)
        }

        return this.lastCardLayout.cards
    }

    showJokerCards(seat: PlayerSeatPosition, cards: number[], tarCard: number) {
        this.mainColor = PokerCard.getColor(tarCard)
        this.mainPlayer = seat
        this.leadPlayer = seat
        this.currentPlayer = seat
        this.showedCards = cards
    }

    makeLastCards(painingLastCards: number[][]): Huolong_LastCardsInfo[] {
        let ret = [new Huolong_LastCardsInfo, new Huolong_LastCardsInfo, new Huolong_LastCardsInfo, new Huolong_LastCardsInfo]
        let allPain = []
        let allGain = []

        // 记录每个人的埋底参与
        for (let seat in ret) {
            ret[seat].pain = painingLastCards[seat]
            allPain[seat] = painingLastCards[seat]
        }

        // 合并底牌
        let allCards: number[] = []
        for (let p of painingLastCards) {
            allCards = allCards.concat(p)
        }

        // 按重要级排序
        allCards.sort((a: number, b: number) => {
            let colorA = PokerCard.getColor(a)
            let colorB = PokerCard.getColor(b)
            let scoreA = PokerCard.getScore(a)
            let scoreB = PokerCard.getScore(b)
            if (colorA == CardColor.joker) {
                if (colorB == CardColor.joker) {
                    let pointA = PokerCard.getPoint(a)
                    let pointB = PokerCard.getPoint(b)
                    if (pointA != pointB) {
                        return pointB - pointA
                    }
                    let groupA = PokerCard.getGroup(a)
                    let groupB = PokerCard.getGroup(b)
                    return groupA - groupB
                }
                return 1
            } else if (colorB == CardColor.joker) {
                return -1
            } else if (scoreA != scoreB) {
                return scoreA - scoreB
            }
            let cRet = Huolong_PokerHelper.sortCompare(a, b, this.mainColor, this.mainPoint)
            if (cRet != 0) {
                return -cRet
            }
            let groupA = PokerCard.getGroup(a)
            let groupB = PokerCard.getGroup(b)
            return groupA - groupB
        })

        // 计算要返还的底牌
        // 选择尽可能不与玩家手牌配成重牌的返还方案，优先级为：非王牌>非分数>非5>非4>非3>非2>小牌>大牌  
        // 1表示允许返还5分，2表示允许返还分数，3表示允许返还分数和小王
        for (let allowedRules = 0; allowedRules < 4; ++allowedRules) {
            let needContinue = true
            // 从少到多，检测重复最少的方案，
            for (let allowed = 1; allowed <= this.gameSetting.groupNum; ++allowed) {
                let allSuccess = true
                let tryingCards = []
                for (let i in allCards) {
                    tryingCards[i] = allCards[i]
                }
                //依座次
                for (let seat in ret) {
                    let num = painingLastCards[seat].length
                    let gained = []
                    let gainedSuccess = true
                    if (parseInt(seat) != this.mainPlayer) {
                        //补足对应数量的牌
                        for (let i = 0; i < num; ++i) {
                            // 依次查找每一张底牌
                            let found = false
                            for (let cIndex = 0; cIndex < tryingCards.length; ++cIndex) {
                                let c = tryingCards[cIndex]
                                // 先检查牌的重复次数
                                let repeated = 0
                                // 之前已返还的牌中重复
                                for (let gainedC of gained) {
                                    if (PokerCard.checkEqual(c, gainedC)) {
                                        repeated++
                                    }
                                }
                                // 手牌中重复
                                for (let handC of this.playerCardLayouts[seat].cards) {
                                    if (PokerCard.checkEqual(c, handC)) {
                                        repeated++
                                    }
                                }
                                if (repeated < allowed
                                    && (PokerCard.getScore(c) == 0 || allowedRules > 0)
                                    && (PokerCard.getScore(c) <= 5 || allowedRules > 1)
                                    && (PokerCard.getColor(c) != CardColor.joker || allowedRules > 2)
                                    && (PokerCard.getColor(c) != CardColor.joker || PokerCard.getPoint(c) != 1)) {
                                    gained.push(tryingCards[cIndex])
                                    tryingCards.splice(cIndex, 1)
                                    found = true
                                    break
                                }
                            }
                            if (!found) {
                                gainedSuccess = false
                                break
                            }
                        }
                    }
                    if (gainedSuccess) {
                        ret[seat].gain = gained
                        allGain[seat] = gained
                    } else {
                        allSuccess = false
                        break
                    }
                }
                if (allSuccess) {
                    needContinue = false
                    allCards = tryingCards
                    break
                }
            }
            if (!needContinue) {
                break
            }
        }

        // 剩下的是最终底牌
        let hasJoker1 = PokerCard.getColor(allCards[allCards.length - 1]) == CardColor.joker && PokerCard.getPoint(allCards[allCards.length - 1]) == 1
        for (let seat in ret) {
            if (hasJoker1 || parseInt(seat) == this.mainPlayer) {
                ret[seat].lastCards = allCards
                ret[seat].allPain = allPain
                ret[seat].allGain = allGain
            } else {
                let darkCards = []
                for (let i = 0; i < this.gameSetting.groupNum; ++i) {
                    darkCards.push(0)
                    darkCards.push(0)
                }
                ret[seat].lastCards = darkCards
                ret[seat].allPain = [[], [], [], []]
                ret[seat].allGain = [[], [], [], []]
            }
        }

        // 执行交换
        this.lastCardLayout.clear()
        Huolong_PokerHelper.sortCards(allCards, this.mainColor, this.mainPoint)
        this.lastCardLayout.pushCardsRange(allCards)
        for (let seat in ret) {
            for (let pain of ret[seat].pain) {
                this.playerCardLayouts[seat].deleteCard(pain)
            }
            this.playerCardLayouts[seat].pushCardsRange(ret[seat].gain)
        }

        return ret
    }

    clearRoundCards() {
        for (let p of this.roundCardLayout) {
            this.threwCardLayout.pushCardsRange(p.cards)
            p.clear()
        }
    }

    getThrewPlayersCount() {
        let ret = 0
        for (let p of this.roundCardLayout) {
            if (p.cardsCount() > 0) {
                ++ret
            }
        }
        return ret
    }

    getCurrentRoundThrew(): number[][] {
        let ret: number[][] = []
        for (let i in this.roundCardLayout) {
            ret[i] = []
            for (let c in this.roundCardLayout[i].cards) {
                ret[i][c] = this.roundCardLayout[i].cards[c]
            }
        }
        return ret
    }

    nextPlayerThrow() {
        if (this.roundCardLayout[this.leadPlayer].cardsCount() != 0 && this.getThrewPlayersCount() < 4) {
            this.currentPlayer = pokerHelper.getPosition(this.currentPlayer, PlayerSeatRelation.next)
        }
    }

    checkIsTheThrewRight(seat: PlayerSeatPosition, cards: number[]): boolean {
        if (seat == this.leadPlayer) {
            if (cards == null || cards.length <= 0) {
                return false
            } else {
                return Huolong_PokerHelper.checkAllCardsSame(cards)
            }
        } else {
            return Huolong_PokerHelper.checkIsTheThrewRight(this.playerCardLayouts[seat].cards, cards, this.roundCardLayout[this.leadPlayer].cards, this.mainColor, this.mainPoint)
        }
    }

    makeThrowCards(seat: PlayerSeatPosition, cards: number[]): Huolong_ThrewCardsInfo {
        // 构造返回值信息队列
        let ret = new Huolong_ThrewCardsInfo
        ret.cards = []
        for (let i in cards) {
            ret.cards[i] = cards[i]
        }
        ret.seat = seat

        // 执行出牌数据设置
        for (let c of cards) {
            this.playerCardLayouts[seat].deleteCard(c)
            this.roundCardLayout[seat].pushCard(c)
        }

        // 返回
        return ret
    }

    makeRoundCalculate(): Huolong_RoundReport {
        // 计算结果
        let cards: number[][] = []
        for (let seat in this.roundCardLayout) {
            cards[seat] = this.roundCardLayout[seat].cards
        }
        let ret = Huolong_PokerHelper.calculateRoundResult(this.mainColor, this.mainPoint, this.leadPlayer, cards)
        ret.roundIndex = this.currentRoundIndex
        ret.threwCards = []
        for (let seat in this.roundCardLayout) {
            ret.threwCards[seat] = []
            for (let i in this.roundCardLayout[seat].cards) {
                ret.threwCards[seat][i] = this.roundCardLayout[seat].cards[i]
            }
        }

        // 执行结果
        this.leadPlayer = ret.winner
        if (ret.winner != this.mainPlayer && pokerHelper.getRelation(ret.winner, this.mainPlayer) != PlayerSeatRelation.across) {
            this.score += ret.score
        }
        this.currentRoundIndex++
        this.currentPlayer = ret.winner

        return ret
    }

    checkIsAllRoundsOver(): boolean {
        if (this.mainCardLayout.cardsCount() != 0) {
            return false
        }
        for (let p of this.playerCardLayouts) {
            if (p.cardsCount() > 0) {
                return false
            }
        }
        return this.state == Huolong_MatchState.rounding
    }

    /**
     * @returns 庄家是否获胜
     */
    makeMatchCalculate(): Huolong_MatchReport {
        // 分析底牌星数和分数
        let lastCards = []
        let lastCardsScore = 0
        let lastCardsLevel = 0
        let lastCardsHasJoker1 = false
        for (let c of this.lastCardLayout.cards) {
            lastCards.push(c)
            let color = PokerCard.getColor(c)
            if (color == CardColor.joker) {
                let point = PokerCard.getPoint(c)
                if (point == 1) {
                    lastCardsLevel += 3
                    lastCardsHasJoker1 = true
                } else {
                    lastCardsLevel += 2
                }
            } else {
                let score = PokerCard.getScore(c)
                lastCardsScore += score
            }
        }

        if (!lastCardsHasJoker1 || lastCardsLevel < 1) {
            lastCardsLevel = 1
        }

        // 抠底阵营检测
        let isMainPlayerWin = (this.currentPlayer == this.mainPlayer || pokerHelper.getRelation(this.currentPlayer, this.mainPlayer) == PlayerSeatRelation.across)

        // 闲家抠底加分
        if (!isMainPlayerWin) {
            this.score += lastCardsScore
        }

        // 信息记录
        let ret = new Huolong_MatchReport
        ret.lastCards = lastCards
        ret.winner = this.leadPlayer
        ret.totalScore = this.score
        ret.mainGroupChange = this.score >= Huolong_PokerHelper.getNeedScore(this.gameSetting.groupNum)
        if (isMainPlayerWin == ret.mainGroupChange) {
            ret.upgradeLevels = 0
        } else {
            ret.upgradeLevels = lastCardsLevel
        }

        // 考虑降级情况
        let lastWinnerCard = this.roundCardLayout[ret.winner].showNextCard()
        if (ret.mainGroupChange && !isMainPlayerWin && (this.mainPoint == 11 || this.mainPoint == 1) && PokerCard.getPoint(lastWinnerCard) == this.mainPoint && PokerCard.getColor(lastWinnerCard) != CardColor.joker) {
            ret.upgradeLevels = -1
            ret.mainGroupChange = false
            ret.decreaseLevel = true
        } else {
            ret.decreaseLevel = false
        }

        // 保存最后一手牌
        ret.oldMainPlayer = this.mainPlayer
        ret.finallyThrew = this.getCurrentRoundThrew()

        return ret
    }
}
