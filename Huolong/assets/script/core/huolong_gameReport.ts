import { PlayerSeatPosition } from "./enumerator"

export default class Huolong_GameReport {
    winner: PlayerSeatPosition
    totalMatches: number
    nsWinMatches: number
    nsNotMainWinMatches: number
    nsGotLastCardsMatches: number
    nskeepMatches: number
    weWinMatches: number
    weNotMainWinMatches: number
    weGotLastCardsMatches: number
    wekeepMatches: number
    nsFinalLevel: number
    weFinalLevel: number
}