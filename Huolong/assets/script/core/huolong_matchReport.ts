import { PlayerSeatPosition } from "./enumerator"

export default class Huolong_MatchReport {
    matchIndex: number
    oldMainPlayer:PlayerSeatPosition
    lastCards: number[]
    finallyThrew: number[][]
    winner: PlayerSeatPosition
    totalScore: number
    mainGroupChange: boolean
    decreaseLevel: boolean
    upgradeLevels: number
    oldLevel: number
    newLevel: number
}