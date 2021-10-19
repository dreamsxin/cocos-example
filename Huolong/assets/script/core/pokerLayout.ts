import arrayUtils from "../utility/arrayUtils"
import { CardColor } from "./enumerator"
import PokerCard from "./pokerCard"

export default class PokerLayout {
    cards: number[]

    constructor() {
        this.cards = []
    }

    init(group: number, withJoker: boolean = true, withJQK: boolean = true) {
        this.clear()
        for (let i = 0; i < group; ++i) {
            if (withJoker) {
                this.cards.push(PokerCard.getCardId(1, CardColor.joker, i))
                this.cards.push(PokerCard.getCardId(2, CardColor.joker, i))
            }
            for (let c = CardColor.spades; c < CardColor.joker; ++c) {
                for (let p = 0; p < 10; ++p) {
                    this.cards.push(PokerCard.getCardId(p + 1, c, i))
                }
                if (withJQK) {
                    for (let p = 10; p < 13; ++p) {
                        this.cards.push(PokerCard.getCardId(p + 1, c, i))
                    }
                }
            }
        }
    }

    clear() {
        this.cards = []
    }

    randomAllCards() {
        let initCard: number[] = this.cards
        this.cards = []
        while (initCard.length > 0) {
            let num = Math.floor(initCard.length * Math.random())
            this.cards.push(initCard[num])
            initCard.splice(num, 1)
        }
    }

    pushCard(id: number) {
        this.cards.push(id)
    }

    pushCardsRange(ids: number[]) {
        if (ids != null) {
            for (let c of ids) {
                this.cards.push(c)
            }
        }
    }

    popCard(): number | null {
        if (this.cards.length <= 0)
            return null
        return this.cards.pop()
    }

    dequeueCard(): number | null {
        if (this.cards.length <= 0)
            return null
        let ret = this.cards[0]
        this.cards.splice(0, 1)
        return ret
    }

    deleteCard(card: number): number {
        if (this.cards.length <= 0)
            return -1
        for (let i in this.cards) {
            if (this.cards[i] == card) {
                let index = parseInt(i)
                this.cards.splice(index, 1)
                return index
            }
        }
        return -1
    }

    cardsCount(): number {
        return this.cards.length
    }

    showNextCard(): number | null {
        if (this.cards.length <= 0)
            return null
        return this.cards[0]
    }

    showLastCard(): number | null {
        if (this.cards.length <= 0)
            return null
        return this.cards[this.cards.length - 1]
    }

    calculateScoreInCards(): number {
        if (this.cards.length == 0)
            return 0
        let ret = 0
        for (let p of this.cards) {
            ret += PokerCard.getScore(p)
        }
        return ret
    }

    public getJoker1Num(): number {
        let ret = 0
        for (let p of this.cards) {
            if (PokerCard.getColor(p) == CardColor.joker && PokerCard.getPoint(p) == 1) {
                ++ret
            }
        }
        return ret
    }

    public showJoker1Cards(num: number = 0): number[] {
        if (num == 0) {
            num = this.getJoker1Num()
        }
        let ret = []
        for (let p of this.cards) {
            if (ret.length >= num) {
                break
            }
            if (PokerCard.getColor(p) == CardColor.joker && PokerCard.getPoint(p) == 1) {
                ret.push(p)
            }
        }
        return ret
    }

    public checkHasCards(cards: number | number[]): boolean {
        let targetCards: number[]
        if (typeof (cards) == "number") {
            targetCards = [cards]
        } else {
            targetCards = cards
        }
        for (let c of targetCards) {
            if (arrayUtils.find(this.cards, c) < 0) {
                return false
            }
        }
        return true
    }

    public static checkCardsRepeat(cards: number[]): boolean {
        for (let c of cards) {
            let repeateNum = 0
            for (let rc of cards) {
                if (c == rc) {
                    repeateNum++
                    if (repeateNum > 1) {
                        return true
                    }
                }
            }
        }
        return false
    }

}