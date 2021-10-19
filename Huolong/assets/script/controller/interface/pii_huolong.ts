import { CharacterInfo } from "../../core/characterInfo";
import { PlayerSeatPosition } from "../../core/enumerator";
import { Huolong_PlayerEvent, Huolong_PlayerEventResult } from "../../core/enumerator_huolong";
import Huolong_GameReport from "../../core/huolong_gameReport";
import Huolong_LastCardsInfo from "../../core/huolong_lastCardsInfo";
import Huolong_MatchReport from "../../core/huolong_matchReport";
import Huolong_RoundReport from "../../core/huolong_roundReport";
import Huolong_ThrewCardsInfo from "../../core/huolong_threwCardsInfo";
import PII_Base from "./pii_base";
import PIV_Huolong from "./piv_huolong";

/**
 * 攉龙游戏玩家处理器(PlayerItem)对攉龙玩家外壳(PlayerVector)的接口
 */
export default interface PII_Huolong extends PII_Base {

    setVector(vector: PIV_Huolong): void

    onGameStart(): void

    onMatchStart(matchIndex: number): void

    onGetACard(card: number): void

    onGetAllCards(cards: number[]): void

    onOverGetCards(): void

    onPlayerShowedStar(seat: PlayerSeatPosition, targetCard: number, jokerCards: number[]): void

    onMatchAborted(): void

    onSendLastCards(cards: number[]): void

    onOverLastCards(lastCards: Huolong_LastCardsInfo): void

    onAskForThrow(currentRoundThrew: number[][]): void

    onPlayerThrewCard(info: Huolong_ThrewCardsInfo): void

    onRoundOver(reportData: Huolong_RoundReport): void

    onMatchOver(reportData: Huolong_MatchReport): void

    onGameOver(reportData: Huolong_GameReport): void

    onPlayerInfoChanged(seat: PlayerSeatPosition, oldInfo: CharacterInfo, newInfo: CharacterInfo): void

    onResponse(event: Huolong_PlayerEvent, result: Huolong_PlayerEventResult): void
}