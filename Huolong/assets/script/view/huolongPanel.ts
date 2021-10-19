import BtnCard from './btnCard'
import { Button, instantiate, Label, Layout, Prefab, RenderTexture, Sprite, SpriteFrame, UITransform, Node, _decorator, Component, assetManager, Texture2D, log, error } from 'cc'
import { EDITOR } from 'cc/env'
import { CardColor, GameType, ImageType, PlayerSeatPosition, PlayerSeatRelation, PlayerType, SystemEventType } from '../core/enumerator'
import { MainScene } from './mainScene'
import VI_Huolong from '../controller/interface/vi_huolong'
import GameMain from '../controller/gameMain'
import { Huolong_GameEventResponse, Huolong_PlayerEvent, Huolong_PlayerEventResult } from '../core/enumerator_huolong'
import PokerCard from '../core/pokerCard'
import PokerLayout from '../core/pokerLayout'
import pokerHelper from '../core/pokerHelper'
import Huolong_LastCardsInfo from '../core/huolong_lastCardsInfo'
import Huolong_PokerHelper from '../core/huolong_pokerHelper'
import Huolong_ThrewCardsInfo from '../core/huolong_threwCardsInfo'
import scheduler from '../utility/scheduler'
import Huolong_RoundReport from '../core/huolong_roundReport'
import MatchReportPanel_Huolong from './matchReportPanel_huolong'
import Huolong_MatchReport from '../core/huolong_matchReport'
import GameReportPanel_Huolong from './gameReportPanel_huolong'
import Huolong_GameReport from '../core/huolong_gameReport'
import arrayUtils from '../utility/arrayUtils'
import ReviewCardsPanel_Huolong from './reviewCardsPanel_huolong'
import PII_Huolong from '../controller/interface/pii_huolong'
import PIV_Huolong from '../controller/interface/piv_huolong'
import { CharacterInfo } from '../core/characterInfo'

const { ccclass, property, type } = _decorator;


@ccclass('HuolongPanel')
export default class HuolongPanel extends Component implements VI_Huolong, PII_Huolong {
    @type(Node)
    node_panelRoot: Node = null
    @type(Prefab)
    prefab_gameReportPanel: Prefab = null
    @type(Prefab)
    prefab_matchReportPanel: Prefab = null
    @type(Prefab)
    prefab_reviewCardsPanel: Prefab = null

    @type(Layout)
    info_matchInfo: Layout = null
    @type(Sprite)
    info_matchInfo_nowColor: Sprite = null
    @type(Label)
    info_matchInfo_nowValue: Label = null
    @type(Label)
    info_matchInfo_loserValue: Label = null
    @type(Label)
    info_matchInfo_score: Label = null
    @type(Label)
    info_matchInfo_matchIndex: Label = null

    @type(Layout)
    info_roundInfo: Layout = null
    @type(Button)
    info_roundInfo_btnLookLastCards: Button = null
    @type(Button)
    info_roundInfo_btnLookPrevious: Button = null
    @type(Label)
    info_roundInfo_roundIndex: Label = null

    @type(Layout)
    info_cardsInfo: Layout = null
    @type(Label)
    info_cardsInfo_mainCardsNum: Label = null

    @type(Node)
    info_myPlayerInfo: Node = null
    @type(Sprite)
    info_myPlayerInfo_iconMain: Sprite = null
    @type(Sprite)
    info_myPlayerInfo_head: Sprite = null
    @type(Label)
    info_myPlayerInfo_labelName: Label = null
    @type(Node)
    info_nextPlayerInfo: Node = null
    @type(Sprite)
    info_nextPlayerInfo_iconMain: Sprite = null
    @type(Sprite)
    info_nextPlayerInfo_head: Sprite = null
    @type(Label)
    info_nextPlayerInfo_labelName: Label = null
    @type(Node)
    info_acrossPlayerInfo: Node = null
    @type(Sprite)
    info_acrossPlayerInfo_iconMain: Sprite = null
    @type(Sprite)
    info_acrossPlayerInfo_head: Sprite = null
    @type(Label)
    info_acrossPlayerInfo_labelName: Label = null
    @type(Node)
    info_backPlayerInfo: Node = null
    @type(Sprite)
    info_backPlayerInfo_iconMain: Sprite = null
    @type(Sprite)
    info_backPlayerInfo_head: Sprite = null
    @type(Label)
    info_backPlayerInfo_labelName: Label = null

    @type(Sprite)
    info_sharedCanvasRenderer: Sprite = null

    @type(Layout)
    cardsThrown_mine: Layout = null
    @type(Layout)
    cardsThrown_next: Layout = null
    @type(Layout)
    cardsThrown_across: Layout = null
    @type(Layout)
    cardsThrown_back: Layout = null
    @type(Layout)
    cardsThrown_lastCards: Layout = null

    @type(Layout)
    cardsMine_root: Layout = null
    @type([Layout])
    cardsMine_childrenLists: Layout[] = []

    @type(Label)
    labelOKOnly: Label = null
    @type(Button)
    btnOK: Button = null
    @type(Label)
    labelOK: Label = null
    @type(Button)
    btnCancel: Button = null
    @type(Label)
    labelCancel: Label = null
    @type(Label)
    labelTips: Label = null

    @type(SpriteFrame)
    miniIcon_default: SpriteFrame = null
    @type(SpriteFrame)
    miniIcon_spades: SpriteFrame = null
    @type(SpriteFrame)
    miniIcon_heart: SpriteFrame = null
    @type(SpriteFrame)
    miniIcon_cube: SpriteFrame = null
    @type(SpriteFrame)
    miniIcon_diamond: SpriteFrame = null

    @property({ visible: false })
    parent: MainScene = null
    @property({ visible: false })
    vector: PIV_Huolong = null

    @property({ visible: false })
    myCardsData: PokerLayout = null
    @property({ visible: false })
    lastCards: number[] = null
    @property({ visible: false })
    previous: number[][] = null

    @property({ visible: false })
    eventBtnOK: Function = null
    @property({ visible: false })
    eventBtnCancel: Function = null

    @property({ visible: false })
    listenerId: any = null

    //#region cocos 生命周期方法

    onLoad() {
        this.myCardsData = new PokerLayout()
        if (!EDITOR) {
            this.info_roundInfo_btnLookLastCards.node.on(UITransform.EventType.TOUCH_END, this.onBtnLookLastCards.bind(this))
            this.info_roundInfo_btnLookPrevious.node.on(UITransform.EventType.TOUCH_END, this.onBtnLookPrevious.bind(this))
            this.btnOK.node.on(UITransform.EventType.TOUCH_END, this.onBtnOK.bind(this))
            this.btnCancel.node.on(UITransform.EventType.TOUCH_END, this.onBtnCancel.bind(this))
            this.info_myPlayerInfo_head.node.on(UITransform.EventType.TOUCH_END, this.onShowPlayerInfo.bind(this, PlayerSeatRelation.self))
            this.info_nextPlayerInfo_head.node.on(UITransform.EventType.TOUCH_END, this.onShowPlayerInfo.bind(this, PlayerSeatRelation.next))
            this.info_acrossPlayerInfo_head.node.on(UITransform.EventType.TOUCH_END, this.onShowPlayerInfo.bind(this, PlayerSeatRelation.across))
            this.info_backPlayerInfo_head.node.on(UITransform.EventType.TOUCH_END, this.onShowPlayerInfo.bind(this, PlayerSeatRelation.back))

            this.resetUI()
        }
    }

    start() {
        if (!EDITOR) {
            this.parent = MainScene.getInstance()

            GameMain.setGameStart(this)
            this.restartGame()
        }
    }

    update(dt: number) {
        this.renderWechatSharedCanvas()
    }

    //#endregion cocos 生命周期方法

    //#region 接口实现

    public setVector(vector: PIV_Huolong): void {
        this.vector = vector
    }

    public onDispose() {
        this.node.removeFromParent()
    }

    public getGameType(): GameType {
        return GameType.huolong
    }

    public getType(): PlayerType {
        return PlayerType.host
    }

    //#endregion 接口实现

    //#region 局外处理方法

    /** 
     * 初始化界面
     * */
    private resetUI() {
        // 游戏进行状态信息隐藏
        this.info_matchInfo.node.active = false
        this.info_roundInfo.node.active = false
        this.info_cardsInfo.node.active = false
        // 庄家标识隐藏
        this.info_myPlayerInfo_iconMain.node.active = false
        this.info_nextPlayerInfo_iconMain.node.active = false
        this.info_acrossPlayerInfo_iconMain.node.active = false
        this.info_backPlayerInfo_iconMain.node.active = false
        // 手牌清理
        this.clearMyCards()
        // 行牌清理
        this.cleanThrewCards()
        // 询问信息隐藏
        this.closeOKCancelButtons()
    }

    private cleanThrewCards() {
        this.cardsThrown_back.node.removeAllChildren()
        this.cardsThrown_mine.node.removeAllChildren()
        this.cardsThrown_next.node.removeAllChildren()
        this.cardsThrown_across.node.removeAllChildren()
        this.cardsThrown_lastCards.node.removeAllChildren()
    }

    /**
     * 渲染微信数据域内容
     */
    private renderWechatSharedCanvas() {
        let tex: RenderTexture = this.parent.userAccess.getWechatSharedCanvasRenderedTexture()
        if (tex != null) {
            let sp = new SpriteFrame()
            sp.texture = tex
            this.info_sharedCanvasRenderer.spriteFrame = sp;
        }
    }

    /**
     * 设定玩家信息
     * @param seat 相对于我的座次
     * @param nickName 昵称
     * @param headUrl 头像
     */
    private showUserInfo(seat: PlayerSeatRelation, info: CharacterInfo) {
        let playerInfo: Node
        let playerInfo_labelName: Label
        let playerInfo_head: Sprite
        switch (seat) {
            case PlayerSeatRelation.self:
                playerInfo = this.info_myPlayerInfo
                playerInfo_labelName = this.info_myPlayerInfo_labelName
                playerInfo_head = this.info_myPlayerInfo_head
                break
            case PlayerSeatRelation.next:
                playerInfo = this.info_nextPlayerInfo
                playerInfo_labelName = this.info_nextPlayerInfo_labelName
                playerInfo_head = this.info_nextPlayerInfo_head
                break
            case PlayerSeatRelation.across:
                playerInfo = this.info_acrossPlayerInfo
                playerInfo_labelName = this.info_acrossPlayerInfo_labelName
                playerInfo_head = this.info_acrossPlayerInfo_head
                break
            case PlayerSeatRelation.back:
                playerInfo = this.info_backPlayerInfo
                playerInfo_labelName = this.info_backPlayerInfo_labelName
                playerInfo_head = this.info_backPlayerInfo_head
                break
        }
        playerInfo.active = true
        playerInfo_labelName.string = info.name
        switch (info.imageType) {
            case ImageType.innerId:
                playerInfo_head.spriteFrame = this.parent.getPlayerHeadIcon(info.imageId)
                break
            default:
                assetManager.loadAny(info.imageUrl, (err: Error, texture: Texture2D) => {
                    if (err) {
                        error(err)
                    } else {
                        let sp = new SpriteFrame()
                        sp.texture = texture
                        playerInfo_head.spriteFrame = sp
                    }
                })
        }
    }

    private hideUserInfo(seat: PlayerSeatRelation) {
        switch (seat) {
            case PlayerSeatRelation.self:
                this.info_myPlayerInfo.active = false
                break
            case PlayerSeatRelation.next:
                this.info_nextPlayerInfo.active = false
                break
            case PlayerSeatRelation.across:
                this.info_acrossPlayerInfo.active = false
                break
            case PlayerSeatRelation.back:
                this.info_backPlayerInfo.active = false
                break
        }
    }

    private restartGame() {
        GameMain.setGameRestart()
    }

    //#endregion 局外处理方法

    //#region 控件事件响应

    private onBtnLookLastCards() {
        let panelNode = instantiate(this.prefab_reviewCardsPanel)
        let panel = panelNode.getComponent(ReviewCardsPanel_Huolong)
        panel.startShowLastCards(this.lastCards)
        this.node_panelRoot.addChild(panelNode)
    }

    private onBtnLookPrevious() {
        if (this.previous == null || this.previous.length < 4) {
            this.parent.showTips("现在才第一手啊！兄嘚，你想看什么？")
        } else {
            let panelNode = instantiate(this.prefab_reviewCardsPanel)
            let panel = panelNode.getComponent(ReviewCardsPanel_Huolong)
            let selfSeat = this.vector.getMySeat()
            let nextSeat = pokerHelper.getPosition(this.vector.getMySeat(), PlayerSeatRelation.next)
            let acrossSeat = pokerHelper.getPosition(this.vector.getMySeat(), PlayerSeatRelation.across)
            let backSeat = pokerHelper.getPosition(this.vector.getMySeat(), PlayerSeatRelation.back)
            panel.startShowPreviousCards(this.previous[selfSeat], this.previous[nextSeat], this.previous[acrossSeat], this.previous[backSeat])
            this.node_panelRoot.addChild(panelNode)
        }
    }

    private onShowPlayerInfo(seat: PlayerSeatRelation) {
        let pos = pokerHelper.getPosition(this.vector.getMySeat(), seat)
        this.parent.showPlayerInfoPanel(this.vector.getOtherInfo(pos), seat == PlayerSeatRelation.self)
    }

    //#endregion 控件事件响应

    //#region 桌面确定询问对话功能

    // 确定按钮回调
    private onBtnOK() {
        let retVal = false
        if (this.eventBtnOK != null)
            retVal = this.eventBtnOK()
        if (!retVal)
            this.closeOKCancelButtons()
    }

    // 取消按钮回调
    private onBtnCancel() {
        let retVal = false
        if (this.eventBtnOK != null)
            retVal = this.eventBtnCancel()
        if (!retVal)
            this.closeOKCancelButtons()
    }

    // 隐藏确定取消按钮
    private closeOKCancelButtons() {
        this.btnOK.node.active = false
        this.btnCancel.node.active = false
        this.labelTips.node.active = false
        this.eventBtnOK = null
        this.eventBtnCancel = null
    }

    // 展示确定取消按钮
    private showOKCancelButtons(okLabel = "确定", cancelLabel = "取消", okCallback = null, cancelCallback = null, tip = "") {
        this.eventBtnOK = okCallback
        this.btnOK.node.active = true
        this.labelOK.string = okLabel
        this.eventBtnCancel = cancelCallback
        this.btnCancel.node.active = true
        this.labelCancel.string = cancelLabel
        this.labelTips.node.active = true
        this.labelTips.string = tip
    }

    // 展示单独的一个按钮
    private showOKOnlyButton(label = "好的", callback = null, tip = "") {
        this.eventBtnOK = callback
        this.btnOK.node.active = true
        this.labelOKOnly.string = label
        this.labelTips.node.active = true
        this.labelTips.string = tip
    }

    //#endregion 桌面确定询问对话功能

    //#region 局内处理逻辑

    private setMainColor() {
        switch (this.vector.getMainColor()) {
            case CardColor.spades:
                this.info_matchInfo_nowColor.spriteFrame = this.miniIcon_spades
                break
            case CardColor.heart:
                this.info_matchInfo_nowColor.spriteFrame = this.miniIcon_heart
                break
            case CardColor.cube:
                this.info_matchInfo_nowColor.spriteFrame = this.miniIcon_cube
                break
            case CardColor.diamond:
                this.info_matchInfo_nowColor.spriteFrame = this.miniIcon_diamond
                break
        }
    }

    private setMainPlayer(seat: PlayerSeatPosition) {
        let relation = pokerHelper.getRelation(this.vector.getMySeat(), seat)
        this.info_myPlayerInfo_iconMain.node.active = false
        this.info_nextPlayerInfo_iconMain.node.active = false
        this.info_acrossPlayerInfo_iconMain.node.active = false
        this.info_backPlayerInfo_iconMain.node.active = false
        switch (relation) {
            case PlayerSeatRelation.self:
                this.info_myPlayerInfo_iconMain.node.active = true
                break
            case PlayerSeatRelation.next:
                this.info_nextPlayerInfo_iconMain.node.active = true
                break
            case PlayerSeatRelation.across:
                this.info_acrossPlayerInfo_iconMain.node.active = true
                break
            case PlayerSeatRelation.back:
                this.info_backPlayerInfo_iconMain.node.active = true
                break
        }
    }

    private getPlayerThrewCardsLayout(seat: PlayerSeatPosition): Layout {
        let relation = pokerHelper.getRelation(this.vector.getMySeat(), seat)
        switch (relation) {
            case PlayerSeatRelation.self:
                return this.cardsThrown_mine
            case PlayerSeatRelation.next:
                return this.cardsThrown_next
            case PlayerSeatRelation.across:
                return this.cardsThrown_across
            case PlayerSeatRelation.back:
                return this.cardsThrown_back
        }
    }

    // 添加手牌
    private addToMyCards(id: number[], allClicked: boolean = false) {
        if (id != null && id.length > 0) {
            this.myCardsData.pushCardsRange(id)
            for (let card of id) {
                let newCard = this.parent.createCard(card)
                newCard.setClickEnabled(true)
                newCard.setClicked(allClicked)
                this.cardsMine_childrenLists[0].node.addChild(newCard.node)
                newCard.setImageShow(false)
            }
        }
        this.repositionCards()
    }

    // 移除手牌
    private removeMyCards(id: number[]) {
        for (let c of id) {
            this.myCardsData.deleteCard(c)
            for (let i = this.cardsMine_childrenLists.length - 1; i >= 0; --i) {
                if (this.cardsMine_childrenLists[i].node.children.length > 0) {
                    this.cardsMine_childrenLists[i].node.children[0].removeFromParent()
                    break
                }
            }
        }
        this.repositionCards()
    }

    private clearMyCards() {
        this.myCardsData.clear()
        for (let g of this.cardsMine_childrenLists) {
            g.node.removeAllChildren()
        }
    }

    // 给手牌整理并排序
    private repositionCards() {
        if (this.myCardsData.cardsCount() == 0) {
            return
        }
        let cards = this.getAllSelectedCards()
        this.clearAllCardsClickState()
        let removed: Node[] = []
        let root_uit = this.cardsMine_root.getComponent(UITransform)
        let first_uit = this.cardsMine_childrenLists[0].node.children[0].getComponent(UITransform)
        let childrenMax = (root_uit.contentSize.x - first_uit.contentSize.x) / (first_uit.contentSize.x + this.cardsMine_childrenLists[0].spacingX) + 1
        for (let lay of this.cardsMine_childrenLists) {
            if (lay.node.children.length >= childrenMax) {
                for (let i = Math.ceil(childrenMax); i < lay.node.children.length;) {
                    let c = lay.node.children[i]
                    removed.push(c)
                    c.removeFromParent()
                }
            } else for (let i = lay.node.children.length; i < childrenMax; ++i) {
                if (removed.length > 0) {
                    lay.node.addChild(removed.pop())
                } else {
                    break
                }
            }
        }
        Huolong_PokerHelper.sortCards(this.myCardsData.cards, this.vector.getMainColor(), this.vector.getMainPoint())
        let totalListNum = this.cardsMine_childrenLists.length
        for (let key in this.myCardsData.cards) {
            let bigKey = totalListNum - 1
            let smallKey = parseInt(key)
            let len = this.cardsMine_childrenLists[bigKey].node.children.length
            while (smallKey >= len) {
                smallKey -= this.cardsMine_childrenLists[bigKey].node.children.length
                bigKey--
                len = this.cardsMine_childrenLists[bigKey].node.children.length
            }
            let card = this.cardsMine_childrenLists[bigKey].node.children[smallKey].getComponent(BtnCard)
            let id = this.myCardsData.cards[key]
            if (id != card.getId()) {
                card.setCard(id, this.parent.getCardImage(id))
                let index = arrayUtils.find(cards, id)
                card.setClicked(index >= 0)
            }
            card.setImageShow(true)
        }
    }

    // 重置所有手牌的点击状态
    private clearAllCardsClickState() {
        for (let g of this.cardsMine_childrenLists) {
            for (let n of g.node.children) {
                let card = n.getComponent(BtnCard)
                card.setClicked(false)
            }
        }
    }

    // 获取所有已选定手牌的id
    private getAllSelectedCards(): number[] {
        let ret: number[] = []
        for (let g of this.cardsMine_childrenLists) {
            for (let n of g.node.children) {
                let card = n.getComponent(BtnCard)
                if (card.getClicked()) {
                    ret.push(card.getId())
                }
            }
        }
        return ret
    }

    private checkCanShow() {
        let showNeedNum = this.vector.getShowedCardsNum() + 1
        let myNum = this.myCardsData.getJoker1Num()
        if (showNeedNum == 0)
            return 0
        if (showNeedNum <= myNum)
            return myNum
        return 0
    }

    //#endregion 局内处理逻辑

    //#region 玩家流程响应

    public onGameStart() {
        this.info_matchInfo.node.active = true
        this.info_matchInfo_nowColor.spriteFrame = this.miniIcon_default
        this.showUserInfo(PlayerSeatRelation.self, this.vector.getOtherInfo(this.vector.getMySeat()))
        this.showUserInfo(PlayerSeatRelation.next, this.vector.getOtherInfo(pokerHelper.getPosition(this.vector.getMySeat(), PlayerSeatRelation.next)))
        this.showUserInfo(PlayerSeatRelation.across, this.vector.getOtherInfo(pokerHelper.getPosition(this.vector.getMySeat(), PlayerSeatRelation.across)))
        this.showUserInfo(PlayerSeatRelation.back, this.vector.getOtherInfo(pokerHelper.getPosition(this.vector.getMySeat(), PlayerSeatRelation.back)))
        this.listenerId = GameMain.listenEvent(SystemEventType.onMyInfoChanged, this.onMyInfoChanged.bind(this))
        GameMain.playMusic()
    }

    public onMatchStart(matchIndex: number) {
        this.clearMyCards()
        this.info_matchInfo_nowValue.string = PokerCard.toPointString(this.vector.getMainPoint())
        this.info_matchInfo_loserValue.string = PokerCard.toPointString(this.vector.getLoserPoint())
        this.info_matchInfo_score.string = "0/" + Huolong_PokerHelper.getNeedScore(this.vector.getGameSetting().groupNum)
        this.info_matchInfo_matchIndex.string = "第" + (this.vector.getMatchIndex() + 1) + "局"
        this.info_cardsInfo.node.active = true
        this.info_cardsInfo_mainCardsNum.string = "0张主牌"
        if (matchIndex > 0) {
            this.setMainPlayer(this.vector.getMainPlayer())
        }
        GameMain.playSound("sound_match_start")
        this.vector.responseEvent(Huolong_GameEventResponse.matchReady)
    }

    public onGetACard(card: number) {
        // 记录获得的手牌
        this.addToMyCards([card])
        this.info_cardsInfo_mainCardsNum.string = Huolong_PokerHelper.getMainCardsNumber(this.myCardsData.cards, this.vector.getMainColor(), this.vector.getMainPoint()) + "张主牌"
        // 检查能否亮王牌
        let shows = this.checkCanShow()
        if (shows > 0) {
            this.showOKOnlyButton("抢庄", () => {
                this.vector.callOperate(Huolong_PlayerEvent.showStar, shows)
            })
        } else {
            this.closeOKCancelButtons()
        }
        GameMain.playSound("sound_send_card")
    }

    public onGetAllCards(cards: number[]) {
        this.addToMyCards(cards)
        this.info_cardsInfo_mainCardsNum.string = Huolong_PokerHelper.getMainCardsNumber(this.myCardsData.cards, this.vector.getMainColor(), this.vector.getMainPoint()) + "张主牌"
        // todo sound 下面这个是单牌声效，宜替换为不同的声效
        GameMain.playSound("sound_send_card")
    }

    public onMatchAborted() {
        // todo sound 此处宜有额外声效
        this.parent.showMessageBox("无人抢庄，重新发牌！", "确认", () => {
            this.vector.responseEvent(Huolong_GameEventResponse.matchAborted_nobodyShown_confirm)
        })
    }

    public onOverGetCards() {
        this.vector.responseEvent(Huolong_GameEventResponse.cardsGot)
    }

    public onPlayerShowedStar(seat: PlayerSeatPosition, targetCard: number, jokerCards: number[]) {
        // todo sound 玩家亮王宜有特殊声效
        this.setMainPlayer(seat)
        let targetLayout: Layout = this.getPlayerThrewCardsLayout(seat)
        this.cleanThrewCards()
        for (let c of jokerCards) {
            targetLayout.node.addChild(this.parent.createCard(c).node)
        }
        targetLayout.node.addChild(this.parent.createCard(targetCard).node)
        this.closeOKCancelButtons()
        this.setMainColor()
    }

    public onSendLastCards(cards: number[]) {
        for (let c of cards) {
            this.cardsThrown_lastCards.node.addChild(this.parent.createCard(c).node)
        }
        GameMain.playSound("sound_send_card")
        if (this.vector.getMainPlayer() == this.vector.getMySeat()) {
            this.addToMyCards(cards, true)
            this.showOKCancelButtons("埋底", "重置", () => {
                let sels = this.getAllSelectedCards()
                let needNum = Huolong_PokerHelper.getNeedNumberOfLastCards(this.vector.getGameSetting().groupNum)
                if (sels.length != needNum) {
                    this.parent.showTips("埋底数量不对，你需要埋" + needNum + "张牌，请检查")
                    return true
                } else {
                    this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, sels)
                }
            }, () => {
                this.clearAllCardsClickState()
                return true
            }, "请埋底")
        } else {
            this.showOKCancelButtons("摘星", "取消", () => {
                let sels = this.getAllSelectedCards()
                if (sels.length == 0) {
                    this.parent.showTips("请选择要摘星的王牌！")
                    return true
                } else {
                    for (let c of sels) {
                        if (PokerCard.getColor(c) != CardColor.joker) {
                            this.parent.showTips("摘星只能使用王牌！")
                            return true
                        }
                    }
                    this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, sels)
                }
            }, () => {
                this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, [])
            }, "请选择要摘星的王牌")
        }
    }

    public onOverLastCards(lastCards: Huolong_LastCardsInfo) {
        // todo sound 玩家埋底及摘星宜有特殊声效
        this.removeMyCards(lastCards.pain)
        this.addToMyCards(lastCards.gain, true)
        this.cardsThrown_lastCards.node.removeAllChildren()
        for (let c of lastCards.lastCards) {
            this.cardsThrown_lastCards.node.addChild(this.parent.createCard(c).node)
        }
        let seatLayout: Layout[] = [
            this.cardsThrown_mine,
            this.cardsThrown_next,
            this.cardsThrown_across,
            this.cardsThrown_back,
        ]
        for (let seat in lastCards.allPain) {
            let relation = pokerHelper.getRelation(this.vector.getMySeat(), parseInt(seat))
            seatLayout[relation].node.removeAllChildren()
            for (let c of lastCards.allGain[seat]) {
                seatLayout[relation].node.addChild(this.parent.createCard(c).node)
            }
            for (let c of lastCards.allPain[seat]) {
                seatLayout[relation].node.addChild(this.parent.createCard(c).node)
            }
        }
        this.lastCards = lastCards.lastCards
        this.previous = null
        this.info_cardsInfo_mainCardsNum.string = Huolong_PokerHelper.getMainCardsNumber(this.myCardsData.cards, this.vector.getMainColor(), this.vector.getMainPoint()) + "张主牌"
        this.showOKOnlyButton("确认", () => {
            this.cleanThrewCards()
            this.clearAllCardsClickState()
            this.closeOKCancelButtons()
            this.vector.responseEvent(Huolong_GameEventResponse.lastCardsConfirm)
        }, "这是最终埋底和摘星的结果，请确认")
    }

    public onAskForThrow(currentRoundThrew: number[][]) {
        // todo sound 玩家轮到玩家出牌，可以考虑有特殊声效
        this.info_roundInfo.node.active = true
        this.info_roundInfo_roundIndex.string = "第" + (this.vector.getRoundIndex() + 1) + "手"
        this.showOKCancelButtons("出牌", "重置", () => {
            let sels = this.getAllSelectedCards()
            let mySeat = this.vector.getMySeat()
            let leadSeat = this.vector.getLeadPlayer()
            if (mySeat != leadSeat && (sels == null || sels.length != currentRoundThrew[leadSeat].length)) {
                this.parent.showTips("必须出" + currentRoundThrew[leadSeat].length + "张牌，请检查！")
                return true
            } else if (mySeat == leadSeat) {
                if (sels == null || sels.length <= 0) {
                    this.parent.showTips("请选择要出的牌！")
                    return true
                } else if (!Huolong_PokerHelper.checkAllCardsSame(sels)) {
                    this.parent.showTips("首家必须出单牌或者每张之间相同的牌")
                    return true
                }
            } else if (!Huolong_PokerHelper.checkIsTheThrewRight(this.myCardsData.cards, sels, currentRoundThrew[leadSeat], this.vector.getMainColor(), this.vector.getMainPoint())) {
                this.parent.showTips("必须出与首家花色相同的牌！")
                return true
            }
            this.vector.callOperate(Huolong_PlayerEvent.throwCard, sels)
        }, () => {
            this.clearAllCardsClickState()
            return true
        }, "轮到你了")
    }

    public onPlayerThrewCard(info: Huolong_ThrewCardsInfo) {
        if (info.seat == this.vector.getMySeat()) {
            this.removeMyCards(info.cards)
        }
        GameMain.playSound("sound_send_card")
        this.info_cardsInfo_mainCardsNum.string = Huolong_PokerHelper.getMainCardsNumber(this.myCardsData.cards, this.vector.getMainColor(), this.vector.getMainPoint()) + "张主牌"
        this.info_roundInfo.node.active = true
        this.info_roundInfo_roundIndex.string = "第" + (this.vector.getRoundIndex() + 1) + "手"
        let seatLayout: Layout[] = [
            this.cardsThrown_mine,
            this.cardsThrown_next,
            this.cardsThrown_across,
            this.cardsThrown_back,
        ]
        let relation = pokerHelper.getRelation(this.vector.getMySeat(), info.seat)
        for (let c of info.cards) {
            seatLayout[relation].node.addChild(this.parent.createCard(c).node)
        }
    }

    public onRoundOver(reportData: Huolong_RoundReport) {
        // todo sound 一回合结束，可以考虑添加特殊声效
        this.info_matchInfo_score.string = this.vector.getNowScore().toString() + "/" + Huolong_PokerHelper.getNeedScore(this.vector.getGameSetting().groupNum)
        scheduler.callAfterDelay(() => {
            this.cleanThrewCards()
            this.vector.responseEvent(Huolong_GameEventResponse.roundConfirm)
            this.previous = reportData.threwCards
        }, this.vector.getGameSetting().aroundOverDelay)
    }

    public onMatchOver(reportData: Huolong_MatchReport, noSound: boolean = false) {
        this.closeOKCancelButtons()
        this.cleanThrewCards()
        this.info_roundInfo.node.active = false
        this.info_cardsInfo.node.active = false
        let reportNode = instantiate(this.prefab_matchReportPanel)
        let reportPanel = reportNode.getComponent(MatchReportPanel_Huolong)
        reportPanel.startShow(this.vector.getMySeat(), noSound, this.vector, reportData, () => {
            let seatLayout: Layout[] = [
                this.cardsThrown_mine,
                this.cardsThrown_next,
                this.cardsThrown_across,
                this.cardsThrown_back,
            ]
            for (let seat in reportData.finallyThrew) {
                let relation = pokerHelper.getRelation(this.vector.getMySeat(), parseInt(seat))
                for (let c of reportData.finallyThrew[seat]) {
                    seatLayout[relation].node.addChild(this.parent.createCard(c).node)
                }
            }
            for (let c of reportData.lastCards) {
                this.cardsThrown_lastCards.node.addChild(this.parent.createCard(c).node)
            }
            this.showOKOnlyButton("结算", () => {
                this.onMatchOver(reportData, true)
            }, "这是最后一手牌")
        }, () => {
            this.closeOKCancelButtons()
            this.cleanThrewCards()
            this.vector.responseEvent(Huolong_GameEventResponse.matchConfirm)
        })
        this.node_panelRoot.addChild(reportNode)
    }

    public onGameOver(reportData: Huolong_GameReport) {
        GameMain.stopMusic()
        let reportNode = instantiate(this.prefab_gameReportPanel)
        let reportPanel = reportNode.getComponent(GameReportPanel_Huolong)
        reportPanel.startShow(this.vector.getMySeat(), reportData, this)
        this.node_panelRoot.addChild(reportNode)
        if (this.listenerId != null) {
            GameMain.unlistenEvent(SystemEventType.onMyInfoChanged, this.listenerId)
            this.listenerId = null
        }
    }

    public onPlayerInfoChanged(seat: PlayerSeatPosition, oldInfo: CharacterInfo, newInfo: CharacterInfo) {
        this.showUserInfo(pokerHelper.getRelation(this.vector.getMySeat(), seat), newInfo)
    }

    public onResponse(event: Huolong_PlayerEvent, result: Huolong_PlayerEventResult) {
        switch (result) {
            case Huolong_PlayerEventResult.success:
                this.closeOKCancelButtons()
                break
            case Huolong_PlayerEventResult.cannotPushEvent:
                this.parent.showTips("程序出错：错误的操作时机")
                break
            case Huolong_PlayerEventResult.starCannotShow:
                this.parent.showTips("程序出错：错误的亮王牌时机")
                break
            case Huolong_PlayerEventResult.starCardsNotEnough:
                this.parent.showTips("你的王牌数量不足")
                break
            case Huolong_PlayerEventResult.starCardsYouDonnotHave:
                this.parent.showTips("程序出错：你没有那么多王牌")
                break
            case Huolong_PlayerEventResult.lastCardsCannotThrow:
                this.parent.showTips("程序出错：错误的埋底时机")
                break
            case Huolong_PlayerEventResult.lastCardsRepeated:
                this.parent.showTips("程序出错：底牌卡片id重复")
                break
            case Huolong_PlayerEventResult.lastCardsNumberWrong:
                this.parent.showTips("埋底数量错误，请检查")
                this.showOKCancelButtons("埋底", "重置", () => {
                    let sels = this.getAllSelectedCards()
                    this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, sels)
                }, () => {
                    this.clearAllCardsClickState()
                    return true
                }, "请埋底")
                break
            case Huolong_PlayerEventResult.lastCardsTypeError:
                this.parent.showTips("摘星只能使用王牌，请检查")
                this.showOKCancelButtons("摘星", "取消", () => {
                    let sels = this.getAllSelectedCards()
                    this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, sels)
                }, () => {
                    this.vector.callOperate(Huolong_PlayerEvent.throwLastCard, [])
                }, "请选择要摘星的大王牌")
                break
            case Huolong_PlayerEventResult.lastCardsYouDonnotHave:
                this.parent.showTips("程序出错：你没有你所要埋的底牌")
                break
            case Huolong_PlayerEventResult.threwCardsUnavailable:
                this.parent.showTips("程序出错：错误的出牌时机")
                break
            case Huolong_PlayerEventResult.threwCardsRepeated:
                this.parent.showTips("程序出错：出牌卡片id重复")
                break
            case Huolong_PlayerEventResult.threwCardsTypeWrong:
                this.parent.showTips("首家出牌只能出每一张之间都相同的牌，请检查")
                this.showOKCancelButtons("出牌", "重置", () => {
                    let sels = this.getAllSelectedCards()
                    this.vector.callOperate(Huolong_PlayerEvent.throwCard, sels)
                }, () => {
                    this.clearAllCardsClickState()
                    return true
                }, "轮到你了")
                break
            case Huolong_PlayerEventResult.threwCardsNumberWrong:
                this.parent.showTips("出牌数量错误，请检查")
                this.showOKCancelButtons("出牌", "重置", () => {
                    let sels = this.getAllSelectedCards()
                    this.vector.callOperate(Huolong_PlayerEvent.throwCard, sels)
                }, () => {
                    this.clearAllCardsClickState()
                    return true
                }, "轮到你了")
                break
            case Huolong_PlayerEventResult.threwCardsColorWrong:
                this.parent.showTips("必须出与首家花色相同的牌，请检查")
                this.showOKCancelButtons("出牌", "重置", () => {
                    let sels = this.getAllSelectedCards()
                    this.vector.callOperate(Huolong_PlayerEvent.throwCard, sels)
                }, () => {
                    this.clearAllCardsClickState()
                    return true
                }, "轮到你了")
                break
            case Huolong_PlayerEventResult.threwCardsYouDonnotHave:
                this.parent.showTips("程序出错：你没有你所要出的牌")
                break
            case Huolong_PlayerEventResult.cannotResolve:
            default:
                this.parent.showTips("程序出错：未知的错误")
                break
        }
    }

    //#endregion 玩家流程响应

    private onMyInfoChanged(event: SystemEventType, myData: any, info: CharacterInfo) {
        // this.showUserInfo(PlayerSeatRelation.self, info)
    }

}
