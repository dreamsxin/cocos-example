import { CardColor, PlayerSeatPosition, PlayerSeatRelation } from "../core/enumerator"
import { Huolong_GameState, Huolong_MatchState } from "../core/enumerator_huolong"
import Huolong_GameReport from "../core/huolong_gameReport"
import HuolongGameSetting from "../core/huolong_gameSetting"
import Huolong_MatchReport from "../core/huolong_matchReport"
import PokerCard from "../core/pokerCard"
import pokerHelper from "../core/pokerHelper"
import { Model_HuolongMatch } from "./model_huolongMatch"

export class Model_HuolongGame {
    // 设定数据
    gameSetting: HuolongGameSetting
    mainColor: CardColor

    // 状态数据
    state: Huolong_GameState
    matchIndex: number
    mainPlayer: PlayerSeatPosition
    nextNomainMainPlayer: PlayerSeatPosition
    nsPoint: number
    wePoint: number

    // 局数据
    currentMatch: Model_HuolongMatch

    constructor(gameSetting: HuolongGameSetting) {
        this.gameSetting = gameSetting
        this.mainColor = CardColor.joker
        this.state = Huolong_GameState.idle
        this.matchIndex = 0
        this.mainPlayer = 0
        this.nextNomainMainPlayer = 1
        this.nsPoint = 3
        this.wePoint = 3
        this.currentMatch = null
    }

    getMainPoint(): number {
        if (this.mainPlayer == PlayerSeatPosition.north || this.mainPlayer == PlayerSeatPosition.south) {
            return this.nsPoint
        }
        if (this.mainPlayer == PlayerSeatPosition.west || this.mainPlayer == PlayerSeatPosition.east) {
            return this.wePoint
        }
        return 0
    }

    public getLoserPoint(): number {
        if (this.mainPlayer == PlayerSeatPosition.north || this.mainPlayer == PlayerSeatPosition.south) {
            return this.wePoint
        }
        if (this.mainPlayer == PlayerSeatPosition.west || this.mainPlayer == PlayerSeatPosition.east) {
            return this.nsPoint
        }
        return 0
    }

    setGameState(state: Huolong_GameState) {
        this.state = state
    }

    setMatchState(state: Huolong_MatchState) {
        this.currentMatch.state = state
    }

    getMatchState() {
        return this.currentMatch.state
    }

    isCardGivingOver() {
        return this.currentMatch.isCardGivingOver()
    }

    getPlayerCards(seat: PlayerSeatPosition): number[] {
        return this.currentMatch.playerCardLayouts[seat].cards
    }

    getLastCards(): number[] {
        return this.currentMatch.lastCardLayout.cards
    }

    startNewGame() {
        this.mainColor = CardColor.joker
        this.matchIndex = -1
        this.mainPlayer = 0
        this.nextNomainMainPlayer = 1
        this.nsPoint = 3
        this.wePoint = 3
        this.startNextMatch()
    }

    startNextMatch() {
        this.matchIndex++
        this.currentMatch = new Model_HuolongMatch(this.gameSetting, this.mainColor, this.mainPlayer, this.getMainPoint())
    }

    showJokerCards(seat: PlayerSeatPosition, cards: number[], tarCard: number) {
        this.mainColor = PokerCard.getColor(tarCard)
        this.mainPlayer = seat
        this.nextNomainMainPlayer = pokerHelper.getPosition(seat, PlayerSeatRelation.next)
        this.currentMatch.showJokerCards(seat, cards, tarCard)
    }

    makeMatchCalculate(): Huolong_MatchReport {
        // 计算本局结果
        let ret = this.currentMatch.makeMatchCalculate()

        // 判断胜利（保庄）阵营
        let nsWin = (this.mainPlayer == PlayerSeatPosition.north || this.mainPlayer == PlayerSeatPosition.south) != ret.mainGroupChange
        if (nsWin) {
            ret.oldLevel = this.nsPoint
        } else {
            ret.oldLevel = this.wePoint
        }
        ret.newLevel = ret.oldLevel + ret.upgradeLevels

        if (ret.upgradeLevels < 0) {
            // 降级
            if (ret.oldLevel == 11) {
                // J -> 3
                ret.newLevel = 3
                ret.upgradeLevels = -8
            } else if (ret.oldLevel == 1) {
                // A -> J
                ret.newLevel = 11
                ret.upgradeLevels = -3
            }
        } else if (ret.oldLevel >= 3 && (ret.oldLevel < 11 || (ret.oldLevel == 11 && ret.mainGroupChange)) && ret.newLevel > 11) {
            // 不能跨越 J
            ret.newLevel = 11
            ret.upgradeLevels = ret.newLevel - ret.oldLevel
        } else if ((ret.oldLevel >= 3 || (ret.oldLevel == 1 && ret.mainGroupChange)) && (ret.newLevel >= 14 || ret.newLevel == 2)) {
            // 不能跨越 A
            ret.newLevel = 1
            if (ret.oldLevel < 3) {
                ret.upgradeLevels = ret.newLevel - ret.oldLevel
            } else {
                ret.upgradeLevels = 14 - ret.oldLevel
            }
        } else if (ret.oldLevel == 1 && !ret.mainGroupChange && ret.upgradeLevels > 0) {
            ret.newLevel = 2
            ret.upgradeLevels = 1
        }

        if (ret.mainGroupChange) {
            let nextMain = this.nextNomainMainPlayer
            this.nextNomainMainPlayer = pokerHelper.getPosition(this.mainPlayer, PlayerSeatRelation.across)
            this.mainPlayer = nextMain
        } else {
            this.mainPlayer = pokerHelper.getPosition(this.mainPlayer, PlayerSeatRelation.across)
        }
        if (nsWin) {
            this.nsPoint = ret.newLevel
        } else {
            this.wePoint = ret.newLevel
        }

        ret.matchIndex = this.matchIndex

        return ret
    }

    getGameResult(): Huolong_GameReport {
        if (this.nsPoint != 2 && this.wePoint != 2) {
            return null
        }
        let ret = new Huolong_GameReport
        ret.winner = this.mainPlayer
        ret.totalMatches = this.matchIndex + 1
        // todo 记录更多信息
        ret.nsFinalLevel = this.nsPoint
        ret.weFinalLevel = this.wePoint
        return ret
    }
}

