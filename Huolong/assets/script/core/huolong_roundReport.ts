import { PlayerSeatPosition } from "./enumerator"

export default class Huolong_RoundReport {
    roundIndex: number
    threwCards: number[][]
    winner: PlayerSeatPosition
    score: number
}