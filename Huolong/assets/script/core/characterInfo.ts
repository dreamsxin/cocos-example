import { GameType, Gender, ImageType } from "./enumerator"

/**
 * 玩家信息结构体
 */
export class CharacterInfo {
    public id: number
    public name: string = ""
    public gender: Gender = Gender.unknown
    public birthYear: number
    public age: number
    public stateWords: string = ""
    public imageType: ImageType
    public imageUrl: String = ""
    public imageId: number

    public constructor(obj: any) {
        if (obj != null) {
            this.id = obj.id
            this.name = obj.name
            this.gender = obj.gender
            this.birthYear = obj.birthYear
            this.age = obj.age
            this.imageType = obj.imageType
            this.imageUrl = obj.imageUrl
            this.imageId = obj.imageId
        }
    }

    public equals(target: CharacterInfo): boolean {
        return this.id == target.id
    }
}

/**
 * AI说话及对话用的文本内容结构体
 */
export class CharacterAIText {
    public id: number   // 文本索引
    public text: string // 文本内容，为空则表示不说话，用于填充不说话的权重
    public rateWeight: number   // 文本出现概率权重，同整个数组中的文本一起计算概率
    public gameTypes: GameType[]     // 限制的游戏类型

    public constructor(obj: any) {
        this.id = obj.id
        this.text = obj.text
        this.rateWeight = obj.rateWeight
        this.gameTypes = []
        if (obj.gameTypes != null) {
            for (let k in obj.gameTypes) {
                this.gameTypes[k] = obj.gameTypes[k]
            }
        }
    }
}

/**
 * AI逻辑数据
 */
export class CharacterInfoAI extends CharacterInfo {
    public readonly baseWeight: number
    public readonly friendOthersRate: Map<number, number>
    public readonly enemyOthersRate: Map<number, number>
    public readonly startText: number[]
    public readonly startTextToFriendSpecial: Map<number, number[]>
    public readonly startTextToEnemySpecial: Map<number, number[]>
    public readonly startTextToUnknownSpecial: Map<number, number[]>
    public readonly showCardsText: number[]
    public readonly showCardsTextToFriendSpecial: Map<number, number[]>
    public readonly showCardsTextToEnemySpecial: Map<number, number[]>
    public readonly sendJokerToLastCardsText: number[]
    public readonly sendJokerToLastCardsTextToFriendSpecial: Map<number, number[]>
    public readonly sendJokerToLastCardsTextToEnemySpecial: Map<number, number[]>
    public readonly waitingText: number[]
    public readonly waitingTextToFriendSpecial: Map<number, number[]>
    public readonly waitingTextToEnemySpecial: Map<number, number[]>
    public readonly waitingTextToUnknownSpecial: Map<number, number[]>
    public readonly winRoundText: number[]
    public readonly winRoundTextToFriendSpecial: Map<number, number[]>
    public readonly winRoundTextToEnemySpecial: Map<number, number[]>
    public readonly winRoundTextToUnknownSpecial: Map<number, number[]>
    public readonly loseRoundText: number[]
    public readonly loseRoundTextToFriendSpecial: Map<number, number[]>
    public readonly loseRoundTextToEnemySpecial: Map<number, number[]>
    public readonly loseRoundTextToUnknownSpecial: Map<number, number[]>
    public readonly winMatchText: number[]
    public readonly winMatchTextToFriendSpecial: Map<number, number[]>
    public readonly winMatchTextToEnemySpecial: Map<number, number[]>
    public readonly loseMatchText: number[]
    public readonly loseMatchTextToFriendSpecial: Map<number, number[]>
    public readonly loseMatchTextToEnemySpecial: Map<number, number[]>
    public readonly responseToSpecial: Map<number, number[]>

    public constructor(obj: any) {
        super(obj)
        this.baseWeight = obj.baseWeight
        this.friendOthersRate = new Map<number, number>()
        if (obj.friendOthersRate) {
            for (let k in obj.friendOthersRate) {
                this.friendOthersRate.set(parseInt(k), obj.friendOthersRate[k])
            }
        }
        this.enemyOthersRate = new Map<number, number>()
        if (obj.enemyOthersRate) {
            for (let k in obj.enemyOthersRate) {
                this.enemyOthersRate.set(parseInt(k), obj.enemyOthersRate[k])
            }
        }
    }
}