import { error, log } from "cc"
import { CharacterInfo } from "../../core/characterInfo"
import { CardColor, GameType, PlayerSeatPosition, SystemEventType } from "../../core/enumerator"
import { Huolong_GameEvent, Huolong_GameEventResponse, Huolong_PlayerEvent, Huolong_PlayerEventResult } from "../../core/enumerator_huolong"
import HuolongGameSetting from "../../core/huolong_gameSetting"
import PokerCard from "../../core/pokerCard"
import pokerHelper from "../../core/pokerHelper"
import scheduler from "../../utility/scheduler"
import GameMain from "../gameMain"
import CI_Huolong from "../interface/ci_huolong"
import PII_Huolong from "../interface/pii_huolong"
import PIV_Huolong from "../interface/piv_huolong"
import PVI_Huolong from "../interface/pvi_huolong"

class MessageData {
    isResponse: boolean
    type: number
    data: any

    constructor(isResponse: boolean, type: number, data: any = null) {
        this.isResponse = isResponse
        this.type = type
        this.data = data
    }
}

export default class PlayerVector_Huolong implements PVI_Huolong, PIV_Huolong {
    controller: CI_Huolong
    info: CharacterInfo = null
    playerItem: PII_Huolong
    scheduler: Promise<void>
    messageQueue: MessageData[]
    seat: PlayerSeatPosition
    disposed: boolean = false

    constructor() {
        this.controller = null
        this.messageQueue = []
        this.seat = null
        this.scheduler = this.update(0.02)
    }

    onDispose(): void {
        this.playerItem.onDispose()
        GameMain.notifyEvent(SystemEventType.onPlayerExitGame, this.getGameType(), this.seat, this.info)
        this.disposed = true
    }

    // 获取属性

    public getGameType(): GameType {
        return GameType.huolong
    }

    public getMainPlayer(): PlayerSeatPosition {
        return this.controller.getMainPlayer()
    }

    public getMainColor(): CardColor {
        return this.controller.getMainColor()
    }

    public getMainPoint(): number {
        return this.controller.getMainPoint()
    }

    public getGameSetting(): HuolongGameSetting {
        return this.controller.getGameSetting()
    }

    public getShowedCardsNum(): number {
        return this.controller.getShowedCardsNum()
    }

    public getLoserPoint(): number {
        return this.controller.getLoserPoint()
    }

    public getMatchIndex(): number {
        return this.controller.getMatchIndex()
    }

    public getRoundIndex(): number {
        return this.controller.getRoundIndex()
    }

    public getLeadPlayer(): number {
        return this.controller.getLeadPlayer()
    }

    public getNowScore(): number {
        return this.controller.getNowScore()
    }

    public getMySeat() {
        return this.seat
    }

    public getInfo() {
        return this.info
    }

    public getOtherInfo(seat: number): CharacterInfo {
        return this.controller.getOtherInfo(seat)
    }

    public getAllPlayersInfo(): CharacterInfo[] {
        return this.controller.getAllPlayersInfo()
    }

    /**
     * 设定玩家座次方位
     * @param seat 座次
     */
    public setSeat(seat: PlayerSeatPosition) {
        this.seat = seat
    }


    /**
     * 设定玩家个性信息
     * @param info 玩家个性信息
     */
    public setInfo(info: CharacterInfo) {
        this.info = info
    }

    /**
     * 设置裁判控制器，用于通知事件
     * @param controller 裁判
     */
    public setController(controller: CI_Huolong) {
        this.controller = controller
    }

    public setItem(playerItem: PII_Huolong) {
        this.playerItem = playerItem
        playerItem.setVector(this)
    }

    /**
     * 裁判用，向该玩家通知事件
     * @param event 事件类型
     * @param data 事件数据
     */
    public pushEvent(event: Huolong_GameEvent, data: any) {
        this.messageQueue.push(new MessageData(false, event, data));
    }

    /**
     * 向裁判响应事件
     * @param event 反馈事件
     */
    public responseEvent(event: Huolong_GameEventResponse) {
        this.controller.responseEvent(this.seat, event)
    }

    /**
     * 向裁判发送操作请求
     * @param event 操作类型
     * @param data 操作数据（牌序）
     */
    public callOperate(event: Huolong_PlayerEvent, data: any) {
        this.controller.playerOperate(this.seat, event, data)
    }

    /**
     * 裁判用，反馈玩家操作结果
     * @param event 玩家操作类型
     * @param data 玩家操作结果
     */
    public responseOperate(event: Huolong_PlayerEvent, result: Huolong_PlayerEventResult) {
        this.messageQueue.push(new MessageData(true, event, result));
    }

    private async update(dt: number) {
        while (!this.disposed) {
            if (this.messageQueue.length > 0) {
                let msg = this.messageQueue[0]
                this.messageQueue.splice(0, 1)
                if (msg.isResponse) {
                    this.playerItem.onResponse(msg.type, msg.data)
                } else switch (msg.type) {
                    case Huolong_GameEvent.startGame:
                        this.log("玩家收到通知： 游戏开始")
                        this.playerItem.onGameStart()
                        break
                    case Huolong_GameEvent.startMatch:
                        this.log("玩家收到通知： 新一局开始，这是第" + msg.data + "局")
                        this.playerItem.onMatchStart(msg.data)
                        break
                    case Huolong_GameEvent.giveCard:
                        this.log("玩家收到通知： 摸一张牌:" + PokerCard.toString(msg.data))
                        this.playerItem.onGetACard(msg.data)
                        break
                    case Huolong_GameEvent.giveAllCards:
                        this.log("玩家收到通知： 摸" + msg.data.length + "张牌")
                        this.playerItem.onGetAllCards(msg.data)
                        break
                    case Huolong_GameEvent.matchAborted_nobodyShown:
                        this.log("玩家收到通知： 无人亮王，重开")
                        this.playerItem.onMatchAborted()
                        break
                    case Huolong_GameEvent.gaveCardsOver:
                        this.log("玩家收到通知： 发牌结束")
                        this.playerItem.onOverGetCards()
                        break
                    case Huolong_GameEvent.playerShowedStar:
                        this.log("玩家收到通知： 有玩家亮王, 座次：" + msg.data[0] + "大王总数：" + msg.data[2].length + ", 亮牌：" + PokerCard.toString(msg.data[1]))
                        this.playerItem.onPlayerShowedStar(msg.data[0], msg.data[1], msg.data[2])
                        break
                    case Huolong_GameEvent.sendLastCards:
                        this.log("玩家收到通知： 收底牌")
                        this.playerItem.onSendLastCards(msg.data)
                        break
                    case Huolong_GameEvent.threwLastCards:
                        this.log("玩家收到通知： 庄家埋底结束")
                        this.playerItem.onOverLastCards(msg.data)
                        break
                    case Huolong_GameEvent.askForThrow:
                        this.log("玩家收到通知： 轮到我出牌了")
                        this.playerItem.onAskForThrow(msg.data)
                        break
                    case Huolong_GameEvent.playerThrew:
                        this.log("玩家收到通知： 玩家出牌， 座次：" + msg.data.seat)
                        this.playerItem.onPlayerThrewCard(msg.data)
                        break
                    case Huolong_GameEvent.roundReport:
                        this.log("玩家收到通知： 回合结束")
                        this.playerItem.onRoundOver(msg.data)
                        break
                    case Huolong_GameEvent.matchReport:
                        this.log("玩家收到通知： 本局结束")
                        this.playerItem.onMatchOver(msg.data)
                        break
                    case Huolong_GameEvent.gameReport:
                        this.log("玩家收到通知： 游戏结束")
                        this.playerItem.onGameOver(msg.data)
                        break
                    case Huolong_GameEvent.playerInfoChanged:
                        this.log("玩家收到通知： 信息变更")
                        let seat = msg.data[0] as PlayerSeatPosition
                        let oldInfo = msg.data[1] as CharacterInfo
                        let newInfo = msg.data[2] as CharacterInfo
                        if (seat == this.seat) {
                            this.setInfo(newInfo)
                        }
                        this.playerItem.onPlayerInfoChanged(seat, oldInfo, newInfo)
                }
            }
            await scheduler.waitFor(dt)
        }
    }

    public log(str: string) {
        log(pokerHelper.positionToString(this.seat) + str)
    }

    public error(str: string) {
        error(pokerHelper.positionToString(this.seat) + str)
    }

}