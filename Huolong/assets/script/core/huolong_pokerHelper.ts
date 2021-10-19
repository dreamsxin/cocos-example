import arrayUtils from "../utility/arrayUtils";
import { CardColor, PlayerSeatPosition, PlayerSeatRelation } from "./enumerator";
import Huolong_RoundReport from "./huolong_roundReport";
import PokerCard from "./pokerCard";
import pokerHelper from "./pokerHelper";

let Huolong_PokerHelper = {

    getNeedNumberOfLastCards(groupNum: number) {
        return 2 * groupNum
    },

    getNeedScore(groupNum: number) {
        return 40 * groupNum
    },

    checkCardIsMain(card: number, mainColor: CardColor, mainPoint: number): boolean {
        let color = PokerCard.getColor(card)
        let point = PokerCard.getPoint(card)
        return color == CardColor.joker || color == mainColor || point == mainPoint || point == 2   // todo 常主， 需要读取设置中
    },

    checkCardPower(card: number, mainColor: CardColor, mainPoint: number): number {
        let color = PokerCard.getColor(card)
        let point = PokerCard.getPoint(card)
        if (color == CardColor.joker) {
            if (point == 1) {
                return 10
            } else if (point == 2) {
                return 9
            } else return -1
        } else if (point == mainPoint) {
            if (color == mainColor) {
                return 8
            } else {
                return 7
            }
        } else if (point == 2) {    // todo 常主， 需要读取设置中
            if (color == mainColor) {
                return 6
            } else {
                return 5
            }
        } else if (color == mainColor) {
            return 4
        } else return 3 - color
    },

    sortCards(cards: number[], mainColor: CardColor, mainPoint: number) {
        cards.sort((a: number, b: number) => {
            return Huolong_PokerHelper.sortCompare(a, b, mainColor, mainPoint)
        })
    },

    sortCompare(a: number, b: number, mainColor: CardColor, mainPoint: number): number {
        let powerA = Huolong_PokerHelper.checkCardPower(a, mainColor, mainPoint)
        let powerB = Huolong_PokerHelper.checkCardPower(b, mainColor, mainPoint)
        if (powerA != powerB) {
            return powerB - powerA
        } else if (powerA > 4) {
            let colorA = PokerCard.getColor(a)
            let colorB = PokerCard.getColor(b)
            if (colorA == colorB) {
                return PokerCard.getGroup(a) - PokerCard.getGroup(b)
            } else {
                return colorA - colorB
            }
        } else {
            let pointA = PokerCard.getPoint(a)
            let pointB = PokerCard.getPoint(b)
            if (pointA == 1 && pointB != 1) {
                return -1
            } else if (pointB == 1 && pointA != 1) {
                return 1
            } else if (pointA != pointB) {
                return pointB - pointA
            }
        }
        return PokerCard.getGroup(a) - PokerCard.getGroup(b)
    },

    /**
     * 检查符合出牌规则的手牌
     * @param leadCards 首家行牌区，作为出牌标准
     * @param myCards 我的手牌区
     * @param mainColor 主花色
     * @param mainPoint 主点数
     * @returns 返回一个元组，第一项为符合花色的牌，第二项为不符合花色的牌
     */
    getSuitableCards(leadCards: number[], myCards: number[], mainColor: CardColor, mainPoint: number): [suitCards: number[], notSuitCards: number[]] {
        // 检查参数
        if (leadCards.length <= 0 || myCards.length < leadCards.length) {
            return [null, null]
        }
        // 拆分
        let isMain = Huolong_PokerHelper.checkCardIsMain(leadCards[0], mainColor, mainPoint)
        let color = PokerCard.getColor(leadCards[0])
        let suited: number[] = []
        let notSuited: number[] = []
        if (isMain) {
            for (let c of myCards) {
                if (Huolong_PokerHelper.checkCardIsMain(c, mainColor, mainPoint)) {
                    suited.push(c)
                } else {
                    notSuited.push(c)
                }
            }
        } else {
            for (let c of myCards) {
                if (Huolong_PokerHelper.checkCardIsMain(c, mainColor, mainPoint)) {
                    notSuited.push(c)
                } else if (PokerCard.getColor(c) == color) {
                    suited.push(c)
                } else {
                    notSuited.push(c)
                }
            }
        }
        Huolong_PokerHelper.sortCards(suited, mainColor, mainPoint)
        Huolong_PokerHelper.sortCards(notSuited, mainColor, mainPoint)
        return [suited, notSuited]
    },

    getMainCardsNumber(myCards: number[], mainColor: CardColor, mainPoint: number): number {
        let ret = 0
        if (myCards != null) {
            for (let c of myCards) {
                if (Huolong_PokerHelper.checkCardPower(c, mainColor, mainPoint) > 3) {
                    ++ret
                }
            }
        }
        return ret
    },

    compareThrewCards(mainColor: CardColor, mainPoint: number, cardA: number[], cardB: number[]) {
        if (cardB.length > 1) {
            for (let i = 1; i < cardB.length; ++i) {
                if (PokerCard.getColor(cardB[i]) != PokerCard.getColor(cardB[i - 1]) || PokerCard.getPoint(cardB[i]) != PokerCard.getPoint(cardB[i - 1])) {
                    return 1
                }
            }
        }
        let a = cardA[0]
        let b = cardB[0]
        let powerA = Huolong_PokerHelper.checkCardPower(a, mainColor, mainPoint)
        let powerB = Huolong_PokerHelper.checkCardPower(b, mainColor, mainPoint)
        let pointA = PokerCard.getPoint(a)
        let pointB = PokerCard.getPoint(b)
        if (powerA > 4 || powerB > 4) {
            return powerA - powerB
        } else if (powerA == powerB) {
            if (pointA == 1) {
                if (pointB == 1) {
                    return 0
                } else {
                    return 1
                }
            } else if (pointB == 1) {
                return -1
            } else {
                return pointA - pointB
            }
        } else if (powerA == 4 || powerB == 4) {
            return powerA - powerB
        } else {
            return 1
        }
    },

    calculateRoundResult(mainColor: CardColor, mainPoint: number, leadSeat: PlayerSeatPosition, cards: number[][]): Huolong_RoundReport {
        let currentWinner = leadSeat
        for (let seat = pokerHelper.getPosition(leadSeat, PlayerSeatRelation.next); seat != leadSeat; seat = pokerHelper.getPosition(seat, PlayerSeatRelation.next)) {
            if (Huolong_PokerHelper.compareThrewCards(mainColor, mainPoint, cards[currentWinner], cards[seat]) < 0) {
                currentWinner = seat
            }
        }
        let score = 0
        for (let cs of cards) {
            for (let c of cs) {
                score += PokerCard.getScore(c)
            }
        }
        let ret = new Huolong_RoundReport
        ret.winner = currentWinner
        ret.score = score
        return ret
    },

    checkAllCardsSame(cards: number[]): boolean {
        let color = PokerCard.getColor(cards[0])
        let point = PokerCard.getPoint(cards[0])
        for (let c of cards) {
            if (PokerCard.getColor(c) != color || PokerCard.getPoint(c) != point) {
                return false
            }
        }
        return true
    },

    checkIsTheThrewRight(allHandCards: number[], cards: number[], leaderCards: number[], mainColor: CardColor, mainPoint: number): boolean {
        let [suitCards, notSuitCards] = Huolong_PokerHelper.getSuitableCards(leaderCards, allHandCards, mainColor, mainPoint)
        let totalNum = cards.length
        let suitNum = suitCards.length
        let targetNum = totalNum
        if (totalNum > suitNum) {
            targetNum = suitNum
        }
        for (let c of cards) {
            if (arrayUtils.find(suitCards, c) >= 0) {
                targetNum--
            }
        }
        return targetNum == 0
    },
}

export default Huolong_PokerHelper
