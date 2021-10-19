import { CardColor } from "./enumerator";

export default class PokerCard {
    id: number

    constructor(point: number, color: CardColor, group: number) {
        this.id = PokerCard.getCardId(point, color, group)
    }

    getPoint(): number {
        return PokerCard.getPoint(this.id)
    }

    getColor(): CardColor {
        return PokerCard.getColor(this.id)
    }

    getGroup(): number {
        return PokerCard.getGroup(this.id)
    }

    getScore(): number {
        return PokerCard.getScore(this.id)
    }

    getId(): number {
        return this.id
    }

    checkEqual(id: number): boolean {
        return PokerCard.checkEqual(this.id, id)
    }

    toString(): string {
        return PokerCard.toString(this.id)
    }

    toPointString(): string {
        return PokerCard.toPointString(this.id)
    }

    static JOKER1 = 401
    static JOKER2 = 402

    static getCardId(point: number, color: CardColor, group: number): number {
        return point + 100 * color + 1000 * group
    }

    static getPoint(id: number): number {
        return id % 100
    }

    static getColor(id: number): CardColor {
        let color = Math.floor(id / 100) % 10
        return color
    }

    static getGroup(id: number): number {
        return Math.floor(id / 1000)
    }

    static getScore(id: number): number {
        let color = PokerCard.getColor(id)
        let point = PokerCard.getPoint(id)
        if (color == CardColor.joker) {
            return 0
        } else switch (point) {
            case 5:
                return 5
            case 10:
            case 13:
                return 10
            default:
                return 0
        }
    }

    static checkEqual(id1: number, id2: number): boolean {
        return id1 % 1000 == id2 % 1000
    }

    static toString(id: number): string {
        switch (PokerCard.getColor(id)) {
            case CardColor.spades:
                return "黑桃[" + PokerCard.getPoint(id) + "]";
            case CardColor.heart:
                return "红桃[" + PokerCard.getPoint(id) + "]";
            case CardColor.cube:
                return "草花[" + PokerCard.getPoint(id) + "]";
            case CardColor.diamond:
                return "方块[" + PokerCard.getPoint(id) + "]";
            case CardColor.joker:
                switch (PokerCard.getPoint(id)) {
                    case 1:
                        return "大王";
                    case 2:
                        return "小王";
                    default:
                        return "未知王牌[" + PokerCard.getPoint(id) + "]";
                }
            default:
                return "未知花色[" + PokerCard.getPoint(id) + "]";
        }
    }

    static toPointString(id: number): string {
        let p = PokerCard.getPoint(id)
        switch (PokerCard.getColor(id)) {
            case CardColor.spades:
            case CardColor.heart:
            case CardColor.cube:
            case CardColor.diamond:
                if (p == 1) {
                    return "A"
                } else if (p == 11) {
                    return "J"
                } else if (p == 12) {
                    return "Q"
                } else if (p == 13) {
                    return "K"
                } else if (p > 1 && p < 11) {
                    return p.toString()
                } else {
                    return "未知点数"
                }
            case CardColor.joker:
                switch (PokerCard.getPoint(id)) {
                    case 1:
                        return "大王";
                    case 2:
                        return "小王";
                    default:
                        return "未知王牌[" + PokerCard.getPoint(id) + "]";
                }
            default:
                return "未知花色[" + PokerCard.getPoint(id) + "]";
        }
    }
}