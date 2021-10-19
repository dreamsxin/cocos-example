import { initWebSocket, initio } from "./network/receive";
import { msg } from "./proto/proto_dzpk_msg";
import { events, EventKind } from "./conf/event";
import Storage from "./dzpk_Storage";
import Sound from "./dzpk_Sound";
import gHandler = require("../../../base/common/gHandler")
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // 操作时长
    timer: number = 15;
    // 间隔时间0.05秒
    intervalTime: number = 16;
    // 定时器
    ticker: any = null;

    @property(cc.Node)  // 洗牌动作绑定
    shuffle: cc.Node = null;
    @property(cc.Node)  // 荷官动作绑定
    heguan: cc.Node = null;
    @property(cc.Node)  // 桌面头像节点
    tableHead: cc.Node = null;
    @property(cc.SpriteFrame)  // 桌面头像节点
    timer1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面头像节点
    timer2: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面头像节点
    timer3: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面卡牌poker1
    poker1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面头像poker2
    poker2: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面头像poker3
    poker3: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面头像poker4
    poker4: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 桌面头像poker5
    poker5: cc.SpriteFrame = null;


    // 补充框事件,玩家筹码不足时, 0 不自动添加, 1 自动添加筹码 , 2 玩家添加筹码
    sysGetChips: number = 0;  
    BuChongChips: number = 0;

    shopBuyMin: number = 0;  // 用于处理补充框的显示金额
    shopAddMoney: number = 0; // 全局的补充金额,用于玩家确认是是否添加金额

    playerInfo: msg.IPlayerData = null // 用于记录头像框玩家信息

    activeChair: number = null; // 当前行动玩家
    activeTime: number = 0;

    private playerNode: any = null;        // 获取dzpk_Player节点
    private head: cc.Node = null;          // 获取桌面头像节点
    private waitGame: cc.Node = null;      // 叠加等待字体
    private sitDown: cc.Node = null;       // 坐下节点
    private standUp: cc.Node = null;       // 站起节点
    private standUpBack: cc.Node = null;   // 站起背景节点
    private table_dichi: cc.Node = null;   // 桌子底池节点
    private table_choumadi: cc.Node = null;// 桌子底池节点
    private biaoqing: cc.Node = null;      // 表情
    private addBetSencs: cc.Node = null;   // 加注场景
    private huanzhuo: cc.Node = null;      // 换桌节点
    private huanzhuoBack: cc.Node = null;  // 换桌背景
    private yinxiao_on: cc.Node = null;    // 音效开
    private yinxiao_off: cc.Node = null;   // 音效关
    private bet_check: cc.Node = null;     // bet选择 过牌按钮
    private bet_rang: cc.Node = null;      // bet选择 让牌按钮
    private bet_call: cc.Node = null;      // bet选择 跟注按钮
    private bet_callAll: cc.Node = null;   // bet选择 跟所有注按钮
    private blind_3: cc.Node = null;       // blind 3x盲注按钮
    private blind_3back: cc.Node = null;   // blind 3x盲注背景
    private blind_4: cc.Node = null;       // blind 4x盲注按钮
    private blind_4back: cc.Node = null;   // blind 4x盲注背景
    private blind_1: cc.Node = null;       // blind 1x底池按钮
    private blind_1back: cc.Node = null;   // blind 1x底池背景
    private blind_13: cc.Node = null;      // blind 1/3底池按钮
    private blind_13back: cc.Node = null;  // blind 1/3底池背景
    private blind_23: cc.Node = null;      // blind 2/3底池按钮
    private blind_23back: cc.Node = null;  // blind 2/3底池背景
    private act_check: cc.Node = null;     // act行动 弃牌按钮
    private act_call: cc.Node = null;      // act行动 跟注按钮
    private act_rang: cc.Node = null;      // act行动 让牌按钮
    private act_ALLIN: cc.Node = null;     // act行动 全压按钮
    private act_addBet: cc.Node = null;    // act行动 加注按钮
    private act_addBetBack: cc.Node = null;// act行动 加注背景
    private act_ALLIN_2: cc.Node = null;   // act行动 全压按钮
    private poker_1: cc.Node = null;       // 桌面poker_1
    private poker_2: cc.Node = null;       // 桌面poker_2
    private poker_3: cc.Node = null;       // 桌面poker_3
    private poker_4: cc.Node = null;       // 桌面poker_4
    private poker_5: cc.Node = null;       // 桌面poker_5

    private backTime: number = 0;          // 返回表情时间
    private standupTime: number = 0;       // 站起表情时间
    private sitDownTime: number = 0;       // 坐下表情时间
    private emojTime: number = 0;          // 聊天表情时间
    private AniEmojTime: number = 0;       // 聊天表情时间

    private sendCardA: any = null;         // 发牌延时

    onLoad() {

        Storage.GameHuaMian = 2;
        // this.actChairTime = 3;

        // 注册事件
        this.RegisterEvent()
        // 获取节点
        this.GetEventNode()
        // 获取玩家移位
        this.GetPlayerYiWei()
        // 显示房间桌面信息
        this.ShowTableInfo()
        // 显示桌面玩家
        this.ShowTablePlayer()
        // 显示玩家头像
        this.PlayerHeadImage()
        // 根据房间状态来显示桌面poker
        this.ShowTablePoker()

        if (Storage.RoomData.gameStep >= 1 && Storage.RoomData.gameStep <= 4) {
            setTimeout(() => {
                let Seat = Storage.SeatChange(this.activeChair)
                let timeImg: cc.Node = this.head[Seat].getChildByName("timer")
                timeImg.active = true
                this.upDateTimer(timeImg)
            }, 2500);
        }

        cc.game.on(cc.game.EVENT_HIDE, function () {
            // 取消监听事件
            // this.cancelEvents()
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            // 注册事件
            // this.RegisterEvent()
            let data: msg.IShowRoomInfo_C2S = {
            }
            events.dispatch(EventKind.C2S_ShowRoomInfo, data);
        });
    }

    PlayerHeadImage(){
        console.log("玩家再次加载头像~");
        let Seat = Storage.SeatChange(Storage.PlayerData.chair)
        let node = this.head[Seat].getChildByName("image")
        node.active = true
        let url = Storage.GetPlayerHead(Storage.PlayerData.playerInfo.headImg) 
        Storage.loadSpriteAtlas(node, url)
    }

    start() {
    
    }

    update(dt) {
        if (this.emojTime - dt >= 0) {
            this.emojTime -= dt;
        } else {
            this.emojTime = 0;
        }
        if (this.AniEmojTime - dt >= 0) {
            this.AniEmojTime -= dt;
        } else {
            this.AniEmojTime = 0;
        }
        if (this.backTime - dt >= 0) {
            this.backTime -= dt;
        } else {
            this.backTime = 0;
        }
        if (this.standupTime - dt >= 0) {
            this.standupTime -= dt;
        } else {
            this.standupTime = 0;
        }
        if (this.sitDownTime - dt >= 0) {
            this.sitDownTime -= dt;
        } else {
            this.sitDownTime = 0;
        }
        // if (this.actChairTime - dt >= 0) {
        //     this.actChairTime -= dt;
        // } else {
        //     let Seat = Storage.SeatChange(this.activeChair)
        //     let timeImg: cc.Node = this.head[Seat].getChildByName("timer")
        //     timeImg.active = true
        //     this.timer = this.activeTime
        //     this.upDateTimer(timeImg)
        //     this.actChairTime = 0;
        // }
    }

    private RegisterEvent() {
        events.register(EventKind.S2C_JoinRoom, "dzpk_Game", this.JoinRoom.bind(this));
        events.register(EventKind.S2C_NoticeJoin, "dzpk_Game", this.NoticeJoin.bind(this));
        events.register(EventKind.S2C_LeaveRoom, "dzpk_Game", this.LeaveRoom.bind(this));
        events.register(EventKind.S2C_SitDown, "dzpk_Game", this.SitDown.bind(this));
        events.register(EventKind.S2C_StandUp, "dzpk_Game", this.StandUp.bind(this));
        events.register(EventKind.S2C_PlayerAction, "dzpk_Game", this.PlayerAction.bind(this));
        events.register(EventKind.S2C_PlayerActionChange, "dzpk_Game", this.ActionChange.bind(this));
        events.register(EventKind.S2C_AddChips, "dzpk_Game", this.AddChips.bind(this));
        events.register(EventKind.S2C_GameStepChange, "dzpk_Game", this.GameStepChange.bind(this))
        events.register(EventKind.S2C_ResultGameData, "dzpk_Game", this.ResultGameData.bind(this));
        events.register(EventKind.S2C_SettleTime, "dzpk_Game", this.SettleTime.bind(this));
        events.register(EventKind.S2C_ReadyTime, "dzpk_Game", this.ReadyTime.bind(this));
        events.register(EventKind.S2C_PushCardTime, "dzpk_Game", this.PushCardTime.bind(this));
        events.register(EventKind.S2C_EmojiChat, "dzpk_Game", this.EmojiChat.bind(this));
        events.register(EventKind.S2C_PiPeiPlayer, "dzpk_Game", this.PiPeiPlayer.bind(this));
        events.register(EventKind.S2C_PiPeiData, "dzpk_Game", this.PiPeiData.bind(this));
        events.register(EventKind.S2C_SendActTimer, "dzpk_Game", this.SendActTimer.bind(this));
        events.register(EventKind.S2C_SendRoomData, "dzpk_Game", this.SendRoomData.bind(this));
        events.register(EventKind.S2C_ShowRoomInfo, "dzpk_Game", this.ShowRoomInfo.bind(this));
    }

    private GetEventNode() {
        this.playerNode = cc.find("Canvas/roomScens/player-headImg").getComponent("dzpk_Player")
        this.head = cc.find("Canvas/roomScens/player-headImg").getComponent("dzpk_Player").tableHead
        this.waitGame = cc.find("Canvas/roomScens/dzpk_zhuozi/dzpk_waitGameStart")
        this.sitDown = cc.find("Canvas/roomScens/dzpk_reqSit")
        this.standUp = cc.find("Canvas/roomScens/dzpk_tkbg/dzpk_zhanqi")
        this.standUpBack = cc.find("Canvas/roomScens/dzpk_tkbg/dzpk_zhanqi_cancel")
        this.table_dichi = cc.find("Canvas/roomScens/dzpk_zhuozi/dichi_money")
        this.table_choumadi = cc.find("Canvas/roomScens/dzpk_zhuozi/dzpk_choumadi")
        this.biaoqing =  cc.find("Canvas/roomScens/menu/dzpk_biaoqing")
        this.addBetSencs = cc.find("Canvas/roomScens/dzpk_addBetClick")
        this.huanzhuo = cc.find("Canvas/roomScens/dzpk_tkbg/dzpk_huanzhuo")
        this.huanzhuoBack = cc.find("Canvas/roomScens/dzpk_tkbg/dzpk_huanzhuo_cancel")
        this.yinxiao_on = cc.find("Canvas/roomScens/dzpk_tkbg/dzpk_yinxiao_on")
        this.yinxiao_off = cc.find("Canvas/roomScens/dzpk_tkbg/dzpk_yinxiao_off")
        this.bet_check = cc.find("Canvas/roomScens/dzpk_betButton/dzpk_check")
        this.bet_rang = cc.find("Canvas/roomScens/dzpk_betButton/dzpk_rang")
        this.bet_call = cc.find("Canvas/roomScens/dzpk_betButton/dzpk_call")
        this.bet_callAll = cc.find("Canvas/roomScens/dzpk_betButton/dzpk_callAll")
        this.blind_3 = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_3")
        this.blind_3back = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_3back")
        this.blind_4 = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_4")
        this.blind_4back = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_4back")
        this.blind_1 = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_1")
        this.blind_1back = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_1back")
        this.blind_13 = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_13")
        this.blind_13back = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_13back")
        this.blind_23 = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_23")
        this.blind_23back = cc.find("Canvas/roomScens/dzpk_blindButton/dzpk_Blind_23back")
        this.act_check = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_check")
        this.act_rang = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_rang")
        this.act_call = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_call")
        this.act_ALLIN = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_ALLIN")
        this.act_addBet = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_addBet")
        this.act_addBetBack = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_addBetBack")
        this.act_ALLIN_2 = cc.find("Canvas/roomScens/dzpk_actionButton/dzpk_ALLIN_2")
        this.poker_1 = cc.find("Canvas/roomScens/poker/poker_1")
        this.poker_2 = cc.find("Canvas/roomScens/poker/poker_2")
        this.poker_3 = cc.find("Canvas/roomScens/poker/poker_3")
        this.poker_4 = cc.find("Canvas/roomScens/poker/poker_4")
        this.poker_5 = cc.find("Canvas/roomScens/poker/poker_5")
    }

    // 进入房间
    private JoinRoom(data: msg.IJoinRoom_S2C){
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData);
    }

    private NoticeJoin(data: msg.INoticeJoin_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家中途进入房间:", data)

        this.PlayerNewJoinPlayer(data.playerData)
    }
    
    private LeaveRoom(data: msg.ILeaveRoom_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家离开房间:", data)

        let Seat = Storage.SeatChange(data.playerData.chair)
        this.DestoryPlayer(Seat)
        
        if (Storage.UserInfo.Id == data.playerData.playerInfo.Id) {
            Storage.StandUpNum = data.playerData.standUPNum
            Storage.IsNotMoney = data.playerData.IsLeaveR
            Storage.SetUserInfo(data.playerData.playerInfo)
            Storage.SetPlayerData(data.playerData)

            cc.director.preloadScene("dzpk_roomList", function () {
                events.unregister(EventKind.S2C_LeaveRoom, "dzpk_Game");
                events.unregister(EventKind.S2C_ResultGameData, "dzpk_Game");
                console.log("dzpk_roomList界面 预加载完成");
                cc.director.loadScene("dzpk_roomList");
            });
        }
    }
    
    private SitDown(data: msg.ISitDown_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData)
        console.log("玩家坐下数据:",data.roomData);
        
        if (data.playerData.playerInfo.Id == Storage.UserInfo.Id) {
            Storage.SetPlayerData(data.playerData)
            
            this.sitDown.active = false
            this.standUp.active = true
            this.standUpBack.active = false

            this.biaoqing.active = true

            if (this.head[4].active == true) {
                // 清除玩家数据
                this.ClearPlayerSeat()

                this.GetPlayerYiWei()

                // 显示桌面玩家
                this.ShowTablePlayer()
                this.head[4].getChildByName("card_1").active = false
                this.head[4].getChildByName("card_2").active = false
                this.head[4].getChildByName("card_1").getComponent("dzpk_Poker").ClearPoker()
                this.head[4].getChildByName("card_2").getComponent("dzpk_Poker").ClearPoker()
                this.head[4].getChildByName("card_1").getChildByName("zhedangwu").active = false
                this.head[4].getChildByName("card_2").getChildByName("zhedangwu").active = false
                this.head[4].getChildByName("dzpk_choumadi").active = false
                this.CloseCardType(4)
            }else {
                let Seat = Storage.SeatChange(data.playerData.chair)
                if (Seat == 4) {
                    this.PlayerNewJoinPlayer(data.playerData)
                }else {
                    // 清除玩家数据
                    this.ClearPlayerSeat()

                    this.GetPlayerYiWei()

                    // 显示桌面玩家
                    this.ShowTablePlayer()
                    this.head[4].getChildByName("card_1").active = false
                    this.head[4].getChildByName("card_2").active = false
                    this.head[4].getChildByName("card_1").getComponent("dzpk_Poker").ClearPoker()
                    this.head[4].getChildByName("card_2").getComponent("dzpk_Poker").ClearPoker()
                    this.head[4].getChildByName("card_1").getChildByName("zhedangwu").active = false
                    this.head[4].getChildByName("card_2").getChildByName("zhedangwu").active = false
                    this.head[4].getChildByName("dzpk_choumadi").active = false
                    this.CloseCardType(4)
                }
            }
        }else {
            this.PlayerNewJoinPlayer(data.playerData)
        }
    }

    ClearPlayerSeat() {
        for (let i = 0; i <= 8; i++) {
            this.head[i].active = false
            if (i == 4) {
                this.head[i].getChildByName("card").active = false
                this.head[i].getChildByName("card_1").active = false
                this.head[i].getChildByName("card_2").active = false
                this.head[i].getChildByName("card_1").getComponent("dzpk_Poker").ClearPoker()
                this.head[i].getChildByName("card_2").getComponent("dzpk_Poker").ClearPoker()
                this.head[i].getChildByName("card_1").getChildByName("zhedangwu").active = false
                this.head[i].getChildByName("card_2").getChildByName("zhedangwu").active = false
                this.CloseCardType(i)
            }
            this.head[i].getChildByName("timer").active = false
            clearInterval(this.ticker)
            this.head[i].getChildByName("card").active = false
            this.CloseActionType(i)
            this.head[i].getChildByName("dzpk_win_frame").active = false
            this.head[i].getChildByName("paixing").active = false
            this.head[i].getChildByName("paixing2").active = false
            this.head[i].getChildByName("zhuangjia").active = false
            this.head[i].getChildByName("zhedangwu").active = false
            this.head[i].getChildByName("poker_1").active = false
            this.head[i].getChildByName("poker_2").active = false
            this.head[i].getChildByName("poker_1").getChildByName("zhedangwu").active = false
            this.head[i].getChildByName("poker_2").getChildByName("zhedangwu").active = false
            this.head[i].getChildByName("poker_1").getComponent("dzpk_Poker").ClearPoker()
            this.head[i].getChildByName("poker_2").getComponent("dzpk_Poker").ClearPoker()
            this.head[i].getChildByName("dzpk_choumadi").active = false
        }
        // 关闭金币补充框和遮挡物
        let buchongkuang: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang")
        buchongkuang.active = false
        let zhedangwu: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_zhedangwu")
        zhedangwu.active = false
    }

    private StandUp(data: msg.IStandUp_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家站起:",data.playerData);
 
        // 玩家离开音效
        Sound.PlayAudio(Sound.LoadAudio(14,"0"))

        if (data.playerData.playerInfo.Id == Storage.UserInfo.Id) {
            Storage.SetPlayerData(data.playerData)
            
            this.standUp.active = false
            this.standUpBack.active = true
            this.sitDown.active = true
            this.CloseBetButton()
            this.biaoqing.active = false
        }

        let Seat = Storage.SeatChange(data.playerData.chair)
        this.DestoryPlayer(Seat)
        if (data.playerData.playerInfo.Id == Storage.UserInfo.Id) {
            this.head[Seat].getChildByName("card_1").active = false
            this.head[Seat].getChildByName("card_2").active = false
            this.head[Seat].getChildByName("card_1").getComponent("dzpk_Poker").ClearPoker()
            this.head[Seat].getChildByName("card_2").getComponent("dzpk_Poker").ClearPoker()
            this.head[Seat].getChildByName("card_1").getChildByName("zhedangwu").active = false
            this.head[Seat].getChildByName("card_2").getChildByName("zhedangwu").active = false
            this.CloseCardType(Seat)
        }
    }
    
    private PlayerAction(data: msg.IPlayerAction_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家行动：",data)

        clearInterval(this.ticker);
        this.ClearHeadImage()

        // 判断注池是否已经渲染,渲染就更新金额
        if (this.table_dichi.active) {
            this.table_dichi.getComponent(cc.Label).string = "底池: " + Storage.ShowMoney(data.potMoney)
        }else {
            this.table_dichi.active = true
            this.table_dichi.getComponent(cc.Label).string = "底池: " + Storage.ShowMoney(data.potMoney)
        }

        if (data.Id == Storage.UserInfo.Id) {
            this.CloseBetButtonQuan()
            // 激活表情
            this.biaoqing.active = true
        }
        
        // 关闭加注场景
        this.addBetSencs.active = false

        let Seat = Storage.SeatChange(data.chair)
        // 更新玩家筹码
        this.head[Seat].getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(data.chips)        

        if (data.downBet > 0) {
            if (data.actionType == 0 || data.actionType == 1 || data.actionType == 2 || data.actionType == 5) {
                // 玩家下注动画
                this.playerNode.SendChipsAction(Seat)
                setTimeout(() => {
                    this.playerNode.SendChipsAction(Seat)
                }, 30);
                setTimeout(() => {
                    this.playerNode.SendChipsAction(Seat)
                    Sound.PlayAudio(Sound.LoadAudio(10,"0"))
                }, 60);
                this.head[Seat].getChildByName("dzpk_choumadi").active = true
                this.head[Seat].getChildByName("dzpk_choumadi").getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(data.downBet)
            }
        }

        let Player = Storage.GetPlayerData(data.chair)
        if (data.actionType == 1){
            if (data.chips == 0 || data.chips == null) {
                // Allin 音效
                let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
                Sound.PlayAudio(Sound.LoadAudio(7,head))
                this.head[Seat].getChildByName("dzpk_all_in_tou").active = true
                this.head[Seat].getChildByName("dzpk_all_in_tou").getComponent(sp.Skeleton).setAnimation(1, "animation", true)
                this.ShowActionType(Seat, data.actionType)
            }else {
                // 加注音效
                let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
                Sound.PlayAudio(Sound.LoadAudio(6,head))
                this.ShowActionType(Seat,data.actionType)
            }
        }else if (data.actionType == 2){
            if (data.chips == 0 || data.chips == null) {
                // Allin 音效
                let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
                Sound.PlayAudio(Sound.LoadAudio(7,head))
                this.head[Seat].getChildByName("dzpk_all_in_tou").active = true
                this.head[Seat].getChildByName("dzpk_all_in_tou").getComponent(sp.Skeleton).setAnimation(1, "animation", true)
                this.ShowActionType(Seat, data.actionType)
            }else {
                // 跟注音效
                let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
                console.log("跟注音效:",head,Seat,data.actionType)
                Sound.PlayAudio(Sound.LoadAudio(5,head))
                this.ShowActionType(Seat,data.actionType)
            }
        }else if (data.actionType == 3){
            // 让牌音效
            let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
            Sound.PlayAudio(Sound.LoadAudio(3,head))
            this.ShowActionType(Seat,data.actionType)
        }else if (data.actionType == 4){
            // 弃牌音效
            let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
            Sound.PlayAudio(Sound.LoadAudio(8,head))
            this.ShowActionType(Seat,data.actionType)
            
            this.huanzhuo.active = true
            this.huanzhuoBack.active = false
            this.head[Seat].getChildByName("zhedangwu").active = true
            if (data.Id == Storage.UserInfo.Id) {
                this.head[Seat].getChildByName("card_1").getChildByName("zhedangwu").active = true
                this.head[Seat].getChildByName("card_2").getChildByName("zhedangwu").active = true
            }
            this.CloseBetButton()

            // 弃牌动作
            let start: any = null
            if (data.chair == Storage.PlayerData.chair) {
                start = this.head[Seat].getChildByName("card_1").getPosition()
            }else {
                start = this.head[Seat].getChildByName("card").getPosition()
                setTimeout(() => {
                this.head[Seat].getChildByName("card").active = false
                }, 50);
            }
            this.playerNode.PlayerFoldPoker(Seat,start)
            // 扔牌音效
            let headAud = Storage.GetPlayerHead(Player.playerInfo.headImg)
            Sound.PlayAudio(Sound.LoadAudio(9,headAud))
        }else if (data.actionType == 5){
            // allin音效
            let head = Storage.GetPlayerHead(Player.playerInfo.headImg)
            Sound.PlayAudio(Sound.LoadAudio(7,head))
            this.head[Seat].getChildByName("dzpk_all_in_tou").active = true
            this.head[Seat].getChildByName("dzpk_all_in_tou").getComponent(sp.Skeleton).setAnimation(1, "animation", true)
            this.ShowActionType(Seat, data.actionType)
        }

        if (data.Id == Storage.PlayerData.playerInfo.Id) {
            Storage.PlayerData.lunDownBets = data.downBet
            // 关闭blindButton 和 actionButton
            this.CloseBlindButton()
            this.CloseActionButton()
            // 显示选择行动按钮
            if (data.actionType != 4 ){
                this.bet_check.active = true
                this.bet_rang.active = true
                this.bet_callAll.active = true
            }
        }else {
            // && Storage.PlayerData.actionStatus != 0
            if (Storage.PlayerData.gameStep == 1  && Storage.PlayerData.actionStatus != 4) {
                let money = data.preChips - Storage.PlayerData.lunDownBets
                if (money > 0) {  
                    this.bet_check.active = true
                    this.bet_callAll.active = true
                    this.bet_rang.active = false
                    this.bet_call.active = true
                    if (money < 100) { // 处理后两位小数点
                        this.bet_call.getChildByName("dzpk_money").getComponent(cc.Label).string = Storage.ShowFixed2(money)
                    }else {
                        this.bet_call.getChildByName("dzpk_money").getComponent(cc.Label).string = Storage.ShowMoney(money)
                    }
                }else {
                    this.bet_check.active = true
                    this.bet_callAll.active = true
                    this.bet_rang.active = true
                    this.bet_call.active = false
                }
            }
        }
    }

    private ActionChange(data: msg.IPlayerActionChange_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家行动变更:",data);
        
        Storage.SetRoomData(data.roomData)

        let actPlayer :msg.IPlayerData = null
        for (let i = 0; i < data.roomData.playerData.length; i ++) {
            if (data.roomData.playerData[i] != null && data.roomData.playerData[i].playerInfo.Id == data.roomData.activeId) {
                actPlayer = data.roomData.playerData[i]
            }
        }

        let Seat = Storage.SeatChange(actPlayer.chair)
        // 关闭玩家行动状态
        this.CloseActionType(Seat)
        this.head[Seat].getChildByName("name").active = true

        // 激活头像框时间
        let timeImg: cc.Node = this.head[Seat].getChildByName("timer")
        this.timer = 15;
        this.upDateTimer(timeImg)

        // 判断行动玩家是否自己,不是则显示
        if (data.roomData.activeId == Storage.UserInfo.Id) {
            this.biaoqing.active = false
            // 关闭选择下按钮
            this.CloseBetButton()
            
            let IsShowActButton = true  // 是否显示Action按钮
            // 判断玩家有没有选择行动下注按钮
            let money = data.roomData.preChips - Storage.PlayerData.lunDownBets
            if (Storage.SelectActionNum == 1) {
                if (money > 0) {
                    let dataAction: msg.IPlayerAction_C2S = {
                        action: 4, // 弃牌
                    }
                    events.dispatch(EventKind.C2S_PlayerAction, dataAction);
                }else {
                    let dataAction: msg.IPlayerAction_C2S = {
                        action: 3, // 让牌
                    }
                    events.dispatch(EventKind.C2S_PlayerAction, dataAction);
                }
                IsShowActButton = false
            }else if (Storage.SelectActionNum == 2) {
                IsShowActButton = true
                if (money > 0) {
                    if (Storage.PlayerData.chips > money) {
                        IsShowActButton = false
                        let dataAction: msg.IPlayerAction_C2S = {
                            betAmount: money,
                            action: 2, // 跟牌
                        }
                        events.dispatch(EventKind.C2S_PlayerAction, dataAction);
                    }
                }
            }else if (Storage.SelectActionNum == 3) {
                if (money <= 0 ) {
                    IsShowActButton = false
                    let dataAction: msg.IPlayerAction_C2S = {
                        action: 3, // 让牌
                    }
                    events.dispatch(EventKind.C2S_PlayerAction, dataAction);
                }
            }else if (Storage.SelectActionNum == 4) {
                if (money > 0) {
                    if (Storage.PlayerData.chips > money) {
                        IsShowActButton = false
                        let dataAction: msg.IPlayerAction_C2S = {
                            betAmount: money,
                            action: 2, // 跟牌
                        }
                    events.dispatch(EventKind.C2S_PlayerAction, dataAction);
                    }
                }
            }
            if (IsShowActButton) {
                // 显示行动按钮
                this.ShowActionButton()
            }
        }
    }

    private AddChips(data: msg.IAddChips_S2C) {
        if (data == null) {
            return;
        }
        console.log("添加筹码:",data)
        
        Storage.PlayerData.chips = data.chips
        Storage.PlayerData.roomChips = data.roomChips

        let Seat = Storage.SeatChange(data.chair)
        this.head[Seat].getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(data.chips)
        let haveMoney: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_haveMoney")
        haveMoney.getComponent(cc.Label).string = Storage.ShowMoney(data.roomChips)

        if (data.addChips > 0) {
            let chips = Storage.ShowMoney(data.addChips)
            let addBetSuccTip = cc.find("Canvas/roomScens/promptBox/addBetSuccTip")
            addBetSuccTip.active = true
            let shouFont = "已自动帮您兑换了"+ chips +"筹码"
            addBetSuccTip.getChildByName("font").getComponent(cc.Label).string = shouFont
            setTimeout(() => {
                addBetSuccTip.active = false
            }, 2000); 
        }
    }

    private GameStepChange(data: msg.IGameStepChange_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData)
        console.log("游戏变更数据:",data.roomData)

        if (data.roomData.gameStep == 1) {  // 翻牌前，看手牌,下盲注
            Storage.SelectActionNum = 0;
            this.CloseBetButtonQuan()
            this.scheduleOnce(function() {
                if (Storage.PlayerData.cardSuitData.handCardKeys[0] != null && Storage.PlayerData.IsStandUp == false) {  // todo
                    let Seat = Storage.SeatChange(Storage.PlayerData.chair)
                    this.ActivationCardType(Seat, Storage.PlayerData.cardSuitData.suitPattern)
                }
            }, 3);
        }else if (data.roomData.gameStep == 2) { // 翻牌圈，牌桌上发3张公牌
            Storage.SelectActionNum = 0;
            this.CloseBetButtonQuan()
            // 将玩家筹码渲染桌面注池
            this.playerNode.GameChangeChipsAnima()

            // todo 筹码叠加问题
            this.table_choumadi.active = true
            let choumadiMoney = this.table_choumadi.getChildByName("money")
            choumadiMoney.getComponent(cc.Label).string = Storage.ShowMoney(data.roomData.potMoney)

            // this.poker_1.getComponent(cc.Sprite).spriteFrame = this.poker1
            this.poker_1.getComponent("dzpk_Poker").InitPoker(data.roomData.publicCards[0])
            this.poker_2.getComponent("dzpk_Poker").InitPoker(data.roomData.publicCards[1])
            this.poker_3.getComponent("dzpk_Poker").InitPoker(data.roomData.publicCards[2])

            this.poker_1.getChildByName("poker_back").active = true
            this.poker_2.getChildByName("poker_back").active = true
            this.poker_3.getChildByName("poker_back").active = true
            
            this.scheduleOnce(function() {
                this.poker_1.active = true
                this.poker_1.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_1)
                // 翻牌音效
                Sound.PlayAudio(Sound.LoadAudio(1,"0"))
                this.scheduleOnce(function() {
                    this.poker_1.getChildByName("poker_back").active = false
                }, 0.15);
            }, 1);
            this.scheduleOnce(function() {
                this.poker_2.active = true
                this.poker_2.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_2)
                // 翻牌音效
                Sound.PlayAudio(Sound.LoadAudio(1,"0"))
                this.scheduleOnce(function() {
                    this.poker_2.getChildByName("poker_back").active = false
                }, 0.15);
            }, 1.6);
            this.scheduleOnce(function() {
                this.poker_3.active = true
                this.poker_3.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_3)
                // 翻牌音效
                Sound.PlayAudio(Sound.LoadAudio(1,"0"))
                this.scheduleOnce(function() {
                    this.poker_3.getChildByName("poker_back").active = false
                }, 0.15);
                if (Storage.PlayerData.cardSuitData.handCardKeys[0] != null && Storage.PlayerData.IsStandUp == false) {  // todo
                    let Seat = Storage.SeatChange(Storage.PlayerData.chair)
                    this.ActivationCardType(Seat, Storage.PlayerData.cardSuitData.suitPattern)
                }
            }, 2.2);
        }else if (data.roomData.gameStep == 3) { // 转牌圈，牌桌上发第4张公共牌
            Storage.SelectActionNum = 0;
            this.CloseBetButtonQuan()
            // 将玩家筹码渲染桌面注池
            this.playerNode.GameChangeChipsAnima()
            // 更新桌面筹码底金额
            let choumadiMoney = this.table_choumadi.getChildByName("money")
            choumadiMoney.getComponent(cc.Label).string =  Storage.ShowMoney(data.roomData.potMoney)

            this.poker_4.getComponent("dzpk_Poker").InitPoker(data.roomData.publicCards[3])
            this.poker_4.getChildByName("poker_back").active = true

            this.scheduleOnce(function() {
                this.poker_4.active = true
                this.poker_4.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_4)
                // 翻牌音效
                Sound.PlayAudio(Sound.LoadAudio(1,"0"))
                this.scheduleOnce(function() {
                    this.poker_4.getChildByName("poker_back").active = false
                }, 0.15);
                if (Storage.PlayerData.cardSuitData.handCardKeys[0] != null && Storage.PlayerData.IsStandUp == false) {  // todo
                    let Seat = Storage.SeatChange(Storage.PlayerData.chair)
                    this.ActivationCardType(Seat, Storage.PlayerData.cardSuitData.suitPattern)
                }
            }, 1);
        }else if (data.roomData.gameStep == 4) { // 河牌圈，牌桌上发第5张公共牌
            Storage.SelectActionNum = 0;
            this.CloseBetButtonQuan()
            // 更新桌面筹码底金额
            let choumadiMoney = this.table_choumadi.getChildByName("money")
            choumadiMoney.getComponent(cc.Label).string = Storage.ShowMoney(data.roomData.potMoney)
                        
            this.poker_5.getComponent("dzpk_Poker").InitPoker(data.roomData.publicCards[4])
            this.poker_5.getChildByName("poker_back").active = true

            this.scheduleOnce(function() {
                this.poker_5.active = true
                this.poker_5.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_5)
                // 翻牌音效
                Sound.PlayAudio(Sound.LoadAudio(1,"0"))
                this.scheduleOnce(function() {
                    this.poker_5.getChildByName("poker_back").active = false
                }, 0.15);
                // 更新玩家手牌类型
                if (Storage.PlayerData.cardSuitData.handCardKeys[0] != null && Storage.PlayerData.IsStandUp == false) {  // todo
                    let Seat = Storage.SeatChange(Storage.PlayerData.chair)
                    this.ActivationCardType(Seat, Storage.PlayerData.cardSuitData.suitPattern)
                }
            }, 1);
        }
        
        // 清除玩家选择下注的圆圈
        this.ClearBetButtonYuan()

    }

    private ResultGameData(data: msg.IResultGameData_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData)

        console.log("结算数据:",data)

        this.huanzhuo.active = true
        this.huanzhuoBack.active = false

        // 关闭行动按钮
        this.CloseBetButton()
        this.CloseBlindButton()
        this.CloseActionButton()

        let Seat = Storage.SeatChange(Storage.PlayerData.chair)

        // 关闭玩家ALLIN动画
        this.head[Seat].getChildByName("dzpk_all_in_tou").active = false
        // 关闭桌面庄家动画
        let bankerSeat = Storage.SeatChange(Storage.RoomData.banker)
        this.head[bankerSeat].getChildByName("zhuangjia").active = false

        let WinnerPublicCard: number[] = null;
        let specialPoker: number = 0;  // 7 葫芦,8 四条,9 同花顺,10 皇家同花顺
        for (let i = 0; i < data.roomData.playerData.length; i++) {
            if (data.roomData.playerData[i] != null && data.roomData.playerData[i].IsWinner == true) {
                WinnerPublicCard = data.roomData.playerData[i].cardSuitData.publicCardKeys
                if (data.roomData.playerData[i].cardSuitData.suitPattern >= 7) {
                    specialPoker = data.roomData.playerData[i].cardSuitData.suitPattern
                }
            }
        }
        
        // 筹码回收动画
        setTimeout(() => {
            if (Storage.GameHuaMian == 2) {
                Storage.SelectActionNum = 0;
                // 将玩家筹码渲染桌面注池
                this.playerNode.GameChangeChipsAnima()
                // 更新桌面筹码底金额
                let choumadiMoney = this.table_choumadi.getChildByName("money")
                choumadiMoney.getComponent(cc.Label).string = Storage.ShowMoney(data.roomData.potMoney)
            }
        }, 500);

        // 玩家翻牌, 关闭玩家显示Win动画 或者 特殊牌型动画, 玩家头像win
        let youWin: cc.Node = cc.find("Canvas/roomScens/other_tableShow/dzpk_youwin")
        setTimeout(() => {
            if (Storage.GameHuaMian == 2) {
                let WinSeat: number = 0;
                for (let i = 0; i < data.roomData.playerData.length; i++) {
                    if (data.roomData.playerData[i] != null && data.roomData.playerData[i].IsWinner == true) {
                        WinSeat = Storage.SeatChange(data.roomData.playerData[i].chair)   
                    }
                }
                for (let i = 0; i < data.roomData.playerData.length; i++) {
                    if (data.roomData.playerData[i] != null ) {
                        let Seat = Storage.SeatChange(data.roomData.playerData[i].chair)
                        // 关闭玩家手牌
                        if (data.roomData.playerData[i].chair == Storage.PlayerData.chair) {
                            this.head[Seat].getChildByName("card_1").active = false
                            this.head[Seat].getChildByName("card_2").active = false
                            this.CloseCardType(Seat)
                        }
                        this.head[Seat].getChildByName("card").active = false
                        // 关闭玩家全压动画
                        this.head[Seat].getChildByName("dzpk_all_in_tou").active = false
                        // 显示winner头像框
                        let headWin: cc.Node = this.head[WinSeat].getChildByName("dzpk_win_frame")
                        headWin.active = true
                        headWin.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                        // 玩家poker翻牌
                        if (data.roomData.isShowDown != 1) {
                            // 公牌是否遮挡
                            let poker1: boolean = false
                            let poker2: boolean = false
                            let poker3: boolean = false
                            let poker4: boolean = false
                            let poker5: boolean = false
                            for (let i = 0; i < data.roomData.publicCards.length; i++) {
                                for (let j = 0; j < data.roomData.publicCards.length; j++) {
                                    if (data.roomData.publicCards[i] == WinnerPublicCard[j]){
                                        if (i == 0) {
                                            poker1 = true
                                        }
                                        if (i == 1) {
                                            poker2 = true
                                        }
                                        if (i == 2) {
                                            poker3 = true
                                        }
                                        if (i == 3) {
                                            poker4 = true
                                        }
                                        if (i == 4) {
                                            poker5 = true
                                        }
                                    }
                                }
                            }
                            if (poker1 == false) {
                                this.poker_1.getChildByName("zhedangwu").active = true
                            }
                            if (poker2 == false) {
                                this.poker_2.getChildByName("zhedangwu").active = true
                            }
                            if (poker3 == false) {
                                this.poker_3.getChildByName("zhedangwu").active = true
                            }
                            if (poker4 == false) {
                                this.poker_4.getChildByName("zhedangwu").active = true
                            }
                            if (poker5 == false) {
                                this.poker_5.getChildByName("zhedangwu").active = true
                            }
    
                            let hand_poker1: boolean = false
                            let hand_poker2: boolean = false
                            for (let i = 0; i < data.roomData.playerData.length; i++) {
                                if (data.roomData.playerData[i] != null && data.roomData.playerData[i].IsWinner == true) {
                                    for (let j = 0; j < 2; j++) {
                                        for (let k = 0; k < 5; k++) {
                                            if (data.roomData.playerData[i].cardSuitData.handCardKeys[j] == WinnerPublicCard[k]){
                                                if (j == 0) {
                                                    hand_poker1 = true
                                                }
                                                if (j == 1) {
                                                    hand_poker2 = true
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            }
                            if (data.roomData.playerData[i].gameStep == 1) {
                                let poker_1 = this.head[Seat].getChildByName("poker_1")
                                poker_1.active = true
                                poker_1.getComponent("dzpk_Poker").InitPoker(data.roomData.playerData[i].cardSuitData.handCardKeys[0])
                                poker_1.getComponent("dzpk_Poker").cardAnimaRight(poker_1)
                                let poker_2 = this.head[Seat].getChildByName("poker_2")
                                poker_2.active = true
                                poker_2.getComponent("dzpk_Poker").InitPoker(data.roomData.playerData[i].cardSuitData.handCardKeys[1])
                                poker_2.getComponent("dzpk_Poker").cardAnimaRight(poker_2)
                            }
                            if (data.roomData.playerData[i].IsWinner == false) {
                                this.head[Seat].getChildByName("zhedangwu").active = true
                                this.head[Seat].getChildByName("poker_1").getChildByName("zhedangwu").active = true
                                this.head[Seat].getChildByName("poker_2").getChildByName("zhedangwu").active = true
                            }else {
                                if (hand_poker1 == false) {
                                    this.head[Seat].getChildByName("poker_1").getChildByName("zhedangwu").active = true
                                }
                                if (hand_poker2 == false) {
                                    this.head[Seat].getChildByName("poker_2").getChildByName("zhedangwu").active = true
                                }
                            }
                            let paixing = this.head[Seat].getChildByName("paixing")
                            let paixing2 = this.head[Seat].getChildByName("paixing2")
                            if (data.roomData.playerData[i].IsWinner == true) {
                                this.CloseActionType(Seat)
                                if (data.roomData.playerData[i].cardSuitData.suitPattern == 1) {
                                    paixing.active = true
                                    paixing.getComponent(sp.Skeleton).setAnimation(1, "gaopaiying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 2) {
                                    paixing.active = true
                                    paixing.getComponent(sp.Skeleton).setAnimation(1, "yiduiying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 3) {
                                    paixing.active = true
                                    paixing.getComponent(sp.Skeleton).setAnimation(1, "liangduiying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 4) {
                                    paixing.active = true
                                    paixing.getComponent(sp.Skeleton).setAnimation(1, "santiaoying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 5) {
                                    paixing.active = true
                                    paixing.getComponent(sp.Skeleton).setAnimation(1, "shunziying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 6) {
                                    paixing.active = true
                                    paixing.getComponent(sp.Skeleton).setAnimation(1, "tonghuaying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 7) {
                                    paixing2.active = true
                                    paixing2.getComponent(sp.Skeleton).setAnimation(1, "huluying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 8) {
                                    paixing2.active = true
                                    paixing2.getComponent(sp.Skeleton).setAnimation(1, "sitiaoying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 9) {
                                    paixing2.active = true
                                    paixing2.getComponent(sp.Skeleton).setAnimation(1, "tonghuashunying", false)
                                }else if (data.roomData.playerData[i].cardSuitData.suitPattern == 10) {
                                    paixing2.active = true
                                    paixing2.getComponent(sp.Skeleton).setAnimation(1, "huangjiatonghuashunying", false)
                                }
                            }
                        }
                    }
                }
    
                // todo 显示桌面牌型(没有组成的牌将遮挡)
                if (Storage.PlayerData.IsWinner == true) {
                    youWin.active = true
                    youWin.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                    // youWin声音
                    Sound.PlayAudio(Sound.LoadAudio(12,"0"))
                }else {
                    // 显示桌面特殊牌型类型
                    if (specialPoker >= 7) {
                        let showCardType: cc.Node = cc.find("Canvas/roomScens/showCardType")
                        showCardType.active = true
                        if (specialPoker == 7) {
                            let huluo = showCardType.getChildByName("huluo")
                            huluo.active = true
                            huluo.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                        }else if (specialPoker == 8) {
                            let sitiao = showCardType.getChildByName("sitiao")
                            sitiao.active = true
                            sitiao.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                        }else if (specialPoker == 8) {
                            let ths = showCardType.getChildByName("ths")
                            ths.active = true
                            ths.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                        }else if (specialPoker == 8) {
                            let huangjiaths = showCardType.getChildByName("huangjiaths")
                            huangjiaths.active = true
                            huangjiaths.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                        }
                    }
                }
            }
        }, 1000);

        // 关闭玩家Win动画 或者 特殊牌型动画
        // 显示筹码发给赢钱玩家，可能会出现多赢
        setTimeout(() => {
            if (Storage.GameHuaMian == 2) {
                for (let i = 0; i < data.roomData.playerData.length; i++) {
                    if (data.roomData.playerData[i] != null) {
                        if (data.roomData.playerData[i].resultGetMoney > 0){
                            let Seat = Storage.SeatChange(data.roomData.playerData[i].chair)
                            let end = this.head[Seat].getChildByName("poker_1").getPosition();
                            // 筹码声音
                            setTimeout(() => {
                                this.playerNode.PotChipsSendWinner(Seat,end)
                            }, 50);
                            setTimeout(() => {
                                this.playerNode.PotChipsSendWinner(Seat,end)
                            }, 100);
                            setTimeout(() => {
                                this.playerNode.PotChipsSendWinner(Seat,end)
                                Sound.PlayAudio(Sound.LoadAudio(11,"0"))
                            }, 150);
                        }
                        if (data.roomData.playerData[i].IsWinner == true) {
                            youWin.active = false
                        }
                    }
                }
                if (Storage.PlayerData.IsWinner == true) {
                    youWin.active = false
                }else {
                    if (specialPoker >= 7) {
                        let showCardType: cc.Node = cc.find("Canvas/roomScens/showCardType")
                        showCardType.active = false
                        if (specialPoker == 7) {
                            let huluo = showCardType.getChildByName("huluo")
                            huluo.active = false
                        }else if (specialPoker == 8) {
                            let sitiao = showCardType.getChildByName("sitiao")
                            sitiao.active = false
                        }else if (specialPoker == 8) {
                            let ths = showCardType.getChildByName("ths")
                            ths.active = false
                        }else if (specialPoker == 8) {
                            let huangjiaths = showCardType.getChildByName("huangjiaths")
                            huangjiaths.active = false
                        }
                    }
                }
                // 关闭桌面筹码
                this.table_choumadi.active = false
            }
        }, 3400);

        // 显示玩家头像winMoney动画
        setTimeout(() => {
            if (Storage.GameHuaMian == 2) {
                for (let i = 0; i < data.roomData.playerData.length; i++) {
                    if (data.roomData.playerData[i] != null) {
                        let Seat = Storage.SeatChange(data.roomData.playerData[i].chair) 
                        if (data.roomData.playerData[i].resultMoney > 0) {
                            if (this.head[Seat].active) {
                                this.playerNode.WinMoneyShow(Seat,data.roomData.playerData[i].resultMoney)
                            }
                        }
                        this.head[Seat].getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(data.roomData.playerData[i].chips)
                    }
                }
            }
        }, 3600);

        // 关闭桌面poker
        setTimeout(() => {
            if (Storage.GameHuaMian == 2) {
                // 清空桌面数据
                this.ClearTableData()
            }
        }, 4000);
    }

    private SettleTime(data: msg.ISettleTime_S2C) {
        if (data == null) {
            return;
        }
    }

    private ReadyTime(data: msg.IReadyTime_S2C) {
        if (data == null) {
            return;
        }
        // 清空桌面数据
        this.ClearTableData()

        this.waitGame.active = true

        // 洗牌动作
        this.shuffle.active = true;
        this.shuffle.getComponent(sp.Skeleton).setAnimation(1, "animation", false)

        // todo 玩家自动或者手动添加金币，先在这里做处理(保证游戏一直在运行中)
        let limit = 0
        if (Storage.RoomData.cfgId == "0"){
            limit = 10
        } else if (Storage.RoomData.cfgId == "1") {
            limit = 50
        } else if (Storage.RoomData.cfgId == "2") {
            limit = 300
        } else if (Storage.RoomData.cfgId == "3") {
            limit = 1000
        }
        setTimeout(() => {
            let IsSysGetChips :boolean = false;
            console.log("sysGetChips:",this.sysGetChips)
            if (this.sysGetChips == 2) {
                let addChips: msg.IAddChips_C2S = {
                    addChips: this.shopAddMoney,
                    sysBuyChips: 2,
                }
                events.dispatch(EventKind.C2S_AddChips, addChips);
                console.log("玩家添加的筹码为:", this.shopAddMoney)
                IsSysGetChips = true
                this.sysGetChips = 0
                this.shopAddMoney = 0
            }
            
            console.log("IsSysGetChips:",IsSysGetChips)
            if (IsSysGetChips == false) {
                console.log("this.BuChongChips:",this.BuChongChips)
                if (this.BuChongChips == 1) {
                    console.log("玩家筹码,限制金额:",Storage.PlayerData.chips,limit)
                    if (Storage.PlayerData.chips < limit) {
                        let addChips: msg.IAddChips_C2S = {
                            addChips: Storage.PlayerData.roomChips,
                            sysBuyChips: 1,
                        }
                        events.dispatch(EventKind.C2S_AddChips, addChips);
                        this.sysGetChips = 0
                        this.shopAddMoney = 0
                        this.BuChongChips = 0
                        let buchongkuang: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang")
                        let quan = buchongkuang.getChildByName("dzpk_quan3")
                        quan.active = false
                    }
                }
            }
        }, 1000);
    }

    private PushCardTime(data: msg.IPushCardTime_S2C) {
        if (data == null) {
            return
        }
        Storage.SetRoomData(data.roomData)

        console.log("发牌阶段:",data)
        // 关闭洗牌动作 和 等待字体
        this.shuffle.active = false
        this.waitGame.active = false

        if (Storage.PlayerData.chair != -1) {
            this.huanzhuo.active = false
            this.huanzhuoBack.active = true
        }

        let sendTime: number = 0;  // 用于记录延时发牌时间
        for (let i = 0; i < Storage.RoomData.playerData.length; i++) {
            if (Storage.RoomData.playerData[i] != null && Storage.RoomData.playerData[i].gameStep == 1) {
                sendTime = sendTime + 120
                let Seat = Storage.SeatChange(Storage.RoomData.playerData[i].chair)
                this.head[Seat].getChildByName("zhedangwu").active = false
                let end: any = null;
                if (Storage.RoomData.playerData[i].playerInfo.Id == Storage.PlayerData.playerInfo.Id) { 
                    end = this.head[Seat].getChildByName("card_1").getPosition();
                    setTimeout(() => {
                        if (Storage.GameHuaMian == 2) {
                            let card_1 = this.head[Seat].getChildByName("card_1")
                            card_1.active = true
                            card_1.getComponent("dzpk_Poker").ClearPoker()
                            let cardData = Storage.PlayerData.cardSuitData.handCardKeys[0]
                            this.head[Seat].getChildByName("card_1").getComponent("dzpk_Poker").InitPoker(cardData)
                            card_1.getComponent("dzpk_Poker").cardAnimaLeft(card_1)
                            // 发牌音效
                            Sound.PlayAudio(Sound.LoadAudio(0,"0"))
                        }
                    },sendTime + 200)
                }else{
                    end = this.head[Seat].getChildByName("card").getPosition();
                    setTimeout(() => {
                        if (Storage.GameHuaMian == 2) {
                            this.head[Seat].getChildByName("card").active = true
                            // 发牌音效
                            Sound.PlayAudio(Sound.LoadAudio(0,"0"))
                        }
                    },sendTime + 200) 
                }
                setTimeout(() => {
                    if (Storage.GameHuaMian == 2) {
                        this.playerNode.SendCardAction(Seat, end);
                    }
                }, sendTime);
            }
        }

        for (let i = 0; i < Storage.RoomData.playerData.length; i++) {
            if (Storage.RoomData.playerData[i] != null && Storage.RoomData.playerData[i].gameStep == 1) {
                sendTime = sendTime + 120
                let Seat = Storage.SeatChange(Storage.RoomData.playerData[i].chair)
                let end: any = null;
                if (Storage.RoomData.playerData[i].playerInfo.Id == Storage.PlayerData.playerInfo.Id) { 
                    end = this.head[Seat].getChildByName("card_2").getPosition();
                    setTimeout(() => {
                        if (Storage.GameHuaMian == 2) {
                            let card_2 = this.head[Seat].getChildByName("card_2")
                            card_2.active = true
                            card_2.getComponent("dzpk_Poker").ClearPoker()
                            let cardData = Storage.PlayerData.cardSuitData.handCardKeys[1]
                            this.head[Seat].getChildByName("card_2").getComponent("dzpk_Poker").InitPoker(cardData)
                            card_2.getComponent("dzpk_Poker").cardAnimaLeft(card_2)
                            this.ActivationCardType(Seat,Storage.PlayerData.cardSuitData.suitPattern)  
                            // 发牌音效
                            Sound.PlayAudio(Sound.LoadAudio(0,"0"))  
                        }                    
                    },sendTime + 200)
                }else{
                    end = this.head[Seat].getChildByName("card").getPosition();
                    setTimeout(() => {
                        if (Storage.GameHuaMian == 2) {
                            this.head[Seat].getChildByName("card").active = true
                            // 发牌音效
                            Sound.PlayAudio(Sound.LoadAudio(0,"0"))
                        }
                    }, sendTime + 200) 
                }
                setTimeout(() => {
                    if (Storage.GameHuaMian == 2) {
                        this.playerNode.SendCardAction(Seat, end);
                    }
                }, sendTime);
            }
        }
        // 更新玩家筹码
        for (let i = 0; i < Storage.RoomData.playerData.length; i++) {
            if (Storage.RoomData.playerData[i] != null) {
                let Seat = Storage.SeatChange(Storage.RoomData.playerData[i].chair)
                this.head[Seat].getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(Storage.RoomData.playerData[i].chips)
            }
        }
        // 显示庄家动画
        let bankerSeat = Storage.SeatChange(Storage.RoomData.banker)
        this.head[bankerSeat].getChildByName("zhuangjia").active = true
    }

    // 聊天表情动画
    private EmojiChat(data: msg.IEmojiChat_S2C) {
        if (data == null) {
            return
        }
        this.GetEventNode()
        console.log("获取动画行动:", data);
        
        if (data.actNum > 0 && data.actNum <= 20) {
            let Player = Storage.GetPlayerData(data.actChair)
            let Seat = Storage.SeatChange(Player.chair)
            console.log("玩家表情行动座位:",Seat);
            switch (data.actNum) {
                case 1:
                    this.head[Seat].getChildByName("chat_duan").active = true
                    this.head[Seat].getChildByName("chat_duan").getChildByName("01").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_duan").active = false
                        this.head[Seat].getChildByName("chat_duan").getChildByName("01").active = false
                    }, 1500);
                    break;
                case 2:
                    this.head[Seat].getChildByName("chat_duan").active = true
                    this.head[Seat].getChildByName("chat_duan").getChildByName("02").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_duan").active = false
                        this.head[Seat].getChildByName("chat_duan").getChildByName("02").active = false
                    }, 1500);
                    break;
                case 3:
                    this.head[Seat].getChildByName("chat_duan").active = true
                    this.head[Seat].getChildByName("chat_duan").getChildByName("03").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_duan").active = false
                        this.head[Seat].getChildByName("chat_duan").getChildByName("03").active = false
                    }, 1500);
                    break;
                case 4:
                    this.head[Seat].getChildByName("chat_chang").active = true
                    this.head[Seat].getChildByName("chat_chang").getChildByName("04").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_chang").active = false
                        this.head[Seat].getChildByName("chat_chang").getChildByName("04").active = false
                    }, 1500);
                    break;
                case 5:
                    this.head[Seat].getChildByName("chat_chang").active = true
                    this.head[Seat].getChildByName("chat_chang").getChildByName("05").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_chang").active = false
                        this.head[Seat].getChildByName("chat_chang").getChildByName("05").active = false
                    }, 1500);
                    break;
                case 6:
                    this.head[Seat].getChildByName("chat_duan").active = true
                    this.head[Seat].getChildByName("chat_duan").getChildByName("06").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_duan").active = false
                        this.head[Seat].getChildByName("chat_duan").getChildByName("06").active = false
                    }, 1500);
                    break;
                case 7:
                    this.head[Seat].getChildByName("chat_chang").active = true
                    this.head[Seat].getChildByName("chat_chang").getChildByName("07").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_chang").active = false
                        this.head[Seat].getChildByName("chat_chang").getChildByName("07").active = false
                    }, 1500);
                    break;
                case 8:
                    this.head[Seat].getChildByName("chat_duan").active = true
                    this.head[Seat].getChildByName("chat_duan").getChildByName("08").active = true
                    setTimeout(() => {
                        this.head[Seat].getChildByName("chat_duan").active = false
                        this.head[Seat].getChildByName("chat_duan").getChildByName("08").active = false
                    }, 1500);
                    break;
                case 9:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let daxiao = this.head[Seat].getChildByName("emoj_Act").getChildByName("daxiao")
                    daxiao.active = true
                    daxiao.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        daxiao.active = false
                    }, 1500);
                    break;
                case 10:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let liuhan = this.head[Seat].getChildByName("emoj_Act").getChildByName("liuhan")
                    liuhan.active = true
                    liuhan.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        liuhan.active = false
                    }, 1500);
                    break;
                case 11:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let zhuakuang = this.head[Seat].getChildByName("emoj_Act").getChildByName("zhuakuang")
                    zhuakuang.active = true
                    zhuakuang.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        zhuakuang.active = false
                    }, 1500);
                    break;
                case 12:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let kun = this.head[Seat].getChildByName("emoj_Act").getChildByName("kun")
                    kun.active = true
                    kun.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        kun.active = false
                    }, 1500);
                    break;
                case 13:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let shangbai = this.head[Seat].getChildByName("emoj_Act").getChildByName("shangbai")
                    shangbai.active = true
                    shangbai.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        shangbai.active = false
                    }, 1500);
                    break;
                case 14:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let liukoushui = this.head[Seat].getChildByName("emoj_Act").getChildByName("liukoushui")
                    liukoushui.active = true
                    liukoushui.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        liukoushui.active = false
                    }, 1500);
                    break;
                case 15:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let yaobaiqi = this.head[Seat].getChildByName("emoj_Act").getChildByName("yaobaiqi")
                    yaobaiqi.active = true
                    yaobaiqi.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        yaobaiqi.active = false
                    }, 1500);
                    break;
                case 16:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let damuzhi = this.head[Seat].getChildByName("emoj_Act").getChildByName("damuzhi")
                    damuzhi.active = true
                    damuzhi.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        damuzhi.active = false
                    }, 1500);
                    break;
                case 17:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let maohuo = this.head[Seat].getChildByName("emoj_Act").getChildByName("maohuo")
                    maohuo.active = true
                    maohuo.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        maohuo.active = false
                    }, 1500);
                    break;
                case 18:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let jiong = this.head[Seat].getChildByName("emoj_Act").getChildByName("jiong")
                    jiong.active = true
                    jiong.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        jiong.active = false
                    }, 1500);
                    break;
                case 19:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let jingxia = this.head[Seat].getChildByName("emoj_Act").getChildByName("jingxia")
                    jingxia.active = true
                    jingxia.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        jingxia.active = false
                    }, 1500);
                    break;
                case 20:
                    this.head[Seat].getChildByName("emoj_Act").active = true
                    let yun = this.head[Seat].getChildByName("emoj_Act").getChildByName("yun")
                    yun.active = true
                    yun.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    setTimeout(() => {
                        yun.active = false
                    }, 1500);
                    break;
            }
        }else if (data.actNum >= 21 && data.actNum <= 24) {
            let actSeat = Storage.SeatChange(data.actChair)
            console.log("开始位置,目的位置:",actSeat,data.goalChair,Storage.SeatChange(data.goalChair));
            let goalSeat = Storage.SeatChange(data.goalChair)
            this.playerNode.EmojiChatAction(actSeat,goalSeat,data.actNum)
            // 声音
            this.head[goalSeat].getChildByName("emoj_Anima").active = true
            if (data.actNum == 21) {
                setTimeout(() => {
                    Sound.PlayAudio(Sound.LoadEmojAduio(data.actNum))
                    let jianjiaoji = this.head[goalSeat].getChildByName("emoj_Anima").getChildByName("jianjiaoji")
                    setTimeout(() => {
                        jianjiaoji.active = true
                        jianjiaoji.getComponent(sp.Skeleton).setAnimation(1,"Animation2", false)
                    }, 500);
                    setTimeout(() => {
                        jianjiaoji.active = false
                    }, 2000);
                }, 500);
            }else if (data.actNum == 22) {
                 setTimeout(() => {
                    Sound.PlayAudio(Sound.LoadEmojAduio(data.actNum))
                    let meiguihua = this.head[goalSeat].getChildByName("emoj_Anima").getChildByName("meiguihua")
                    setTimeout(() => {
                        meiguihua.active = true
                        meiguihua.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    }, 500);
                    setTimeout(() => {
                        meiguihua.active = false
                    }, 2000);
                }, 500);
            }else if (data.actNum == 23) {
                setTimeout(() => {
                    Sound.PlayAudio(Sound.LoadEmojAduio(data.actNum))
                    let pijiubei = this.head[goalSeat].getChildByName("emoj_Anima").getChildByName("pijiubei")
                    setTimeout(() => {
                        pijiubei.active = true
                        pijiubei.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    }, 500);
                    setTimeout(() => {
                        pijiubei.active = false
                    }, 2000);
                }, 500);
            }else if (data.actNum == 24) {
                setTimeout(() => {
                    Sound.PlayAudio(Sound.LoadEmojAduio(data.actNum))
                    let tuoxie = this.head[goalSeat].getChildByName("emoj_Anima").getChildByName("tuoxie")
                    tuoxie.getComponent(sp.Skeleton).setAnimation(1, "null", false)
                    setTimeout(() => {
                        tuoxie.active = true
                        tuoxie.getComponent(sp.Skeleton).setAnimation(1, "Animation1", false)
                    }, 500);
                    tuoxie.getComponent(sp.Skeleton).setAnimation(1, "Animation2", false)
                    setTimeout(() => {
                        tuoxie.active = false
                    }, 2000);
                }, 500);
            }
        }
    }

    private PiPeiPlayer(data: msg.IPiPeiPlayer_S2C) {
        let dzpk_match = cc.find("Canvas/roomScens/dzpk_zhuozi/dzpk_match")
        dzpk_match.active = true
        dzpk_match.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
    }

    private PiPeiData(data: msg.IPiPeiData_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家匹配房间:", data)

        Storage.SetRoomData(data.roomData)

        let dzpk_match = cc.find("Canvas/roomScens/dzpk_zhuozi/dzpk_match")
        dzpk_match.active = false

        this.GetEventNode()

        // 清除玩家数据
        this.ClearPlayerSeat()

        this.GetPlayerYiWei()
        // 显示桌面玩家
        this.ShowTablePlayer()

        // let Seat = Storage.SeatChange(Storage.PlayerData.chair)
        // if (Seat != 4) {
        //    // 清除玩家数据
        //    this.ClearPlayerSeat()

        //    this.GetPlayerYiWei()

        //    // 显示桌面玩家
        //    this.ShowTablePlayer()
        // }
    }

    private SendActTimer(data: msg.ISendActTimer_S2C) {
        if (data == null) {
            return;
        }
        // this.GetEventNode()

        this.timer = 15 - data.timer 

        this.activeChair = data.actChair
        this.activeTime = 15 - data.timer 
       
    }

    private SendRoomData(data: msg.ISendRoomData_S2C) {
        if (data == null) {
            return;
        }
        // Storage.SetRoomData(data.roomData)
    }

    private ShowRoomInfo(data: msg.IShowRoomInfo_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData)

        this.GetEventNode()

        this.poker_1.active = false
        this.poker_2.active = false
        this.poker_3.active = false
        this.poker_4.active = false
        this.poker_5.active = false

        // 清除玩家数据
        this.ClearPlayerSeat()

        this.GetPlayerYiWei()
        // 显示桌面玩家
        this.ShowTablePlayer()
        // 根据房间状态来显示桌面poker
        this.ShowTablePoker()

        if (Storage.RoomData.gameStep >= 1 && Storage.RoomData.gameStep <= 4) {
            let Seat = Storage.SeatChange(this.activeChair)
            let timeImg: cc.Node = this.head[Seat].getChildByName("timer")
            timeImg.active = true
            this.upDateTimer(timeImg)
        }
    }
    

    gameListClick(eve, num: number) {
        // 打开列表
        let dzpk_tkbg: cc.Node = cc.find("Canvas/roomScens/dzpk_tkbg")
        if (num == 0) {
            // 按钮点击
                Sound.PlayAudio(Sound.LoadAudio(13,"0"))
            // 如果menu打开则关闭，关闭则打开
            if (dzpk_tkbg.active) {
                dzpk_tkbg.active = false
            } else {
                dzpk_tkbg.active = true
                dzpk_tkbg.getChildByName("cancelClick").active = true
            }
        }
        if (num == 1) {  // 空白点击事件
            console.log("游戏列表背景点击~")
            dzpk_tkbg.active = false
            dzpk_tkbg.getChildByName("cancelClick").active = false
        }
        // 返回
        if (num == 2) {
            // 按钮点击
            Sound.PlayAudio(Sound.LoadAudio(13,"0"))
            if (this.backTime != 0) {return;}
            this.backTime = 3;
            console.log("玩家状态:",Storage.RoomData)
            console.log("玩家状态:",Storage.PlayerData.IsInGame);
            if (Storage.PlayerData.IsInGame == true ) { // Storage.PlayerData.gameStep == 1 || Storage.PlayerData.totalDownBet > 0
                // 显示是否返回提示框
                let backTip = cc.find("Canvas/roomScens/promptBox/backTip")
                backTip.active = true
                let zhedangwu = cc.find("Canvas/roomScens/back_zhedangwu")
                zhedangwu.active = true
            }else {
                let data: msg.ILeaveRoom_C2S = {
                }
                events.dispatch(EventKind.C2S_LeaveRoom, data);
            }
        }
        // 站起
        if (num == 3) {  // todo
            // 按钮点击
            Sound.PlayAudio(Sound.LoadAudio(13,"0"))
            if (this.standupTime != 0) {return;}
            this.standupTime = 3;
            if (Storage.RoomData.gameStep == 0 || Storage.RoomData.gameStep == 5 ||
                Storage.PlayerData.gameStep == 0) {
                let data: msg.IStandUp_C2S = {
                }
                events.dispatch(EventKind.C2S_StandUp, data);
            }else {
                if (Storage.RoomData.activeId == Storage.UserInfo.Id) {
                    // 显示是否站起提示框
                    let standupTip = cc.find("Canvas/roomScens/promptBox/standupTip")
                    standupTip.active = true
                }else {
                    // 显示是否站起提示框
                    let inGameStandup = cc.find("Canvas/roomScens/promptBox/inGameStandup")
                    inGameStandup.active = true
                    // 定时器3秒关闭提示
                    setTimeout(() => {
                        inGameStandup.active = false
                    }, 3000);
                }
            }
        }
        // 音效关
        if (num == 4) {
            this.yinxiao_on.active = false
            this.yinxiao_off.active = true
            
            // 按钮点击
            Sound.PlayAudio(Sound.LoadAudio(13,"0"))

            // 全局控制音效
            Sound.IsOpenMusic = false;

            // 停止播放所以音效
            gHandler.audioMgr.setBgState(false);
            console.log("大厅音效开关状态:",gHandler.audioMgr.getBgState())
        }
        // 音效开
        if (num == 5) {
            this.yinxiao_on.active = true
            this.yinxiao_off.active = false

            // 全局控制音效
            Sound.IsOpenMusic = true;
            
            // 开启播放音乐
            gHandler.audioMgr.setBgState(true);
            console.log("大厅音效开关状态:",gHandler.audioMgr.getBgState())
        }
        // 换桌
        if (num == 6) {
            // 按钮点击
            Sound.PlayAudio(Sound.LoadAudio(13,"0"))
            if (Storage.PlayerData.IsInGame == true) {
                let notChangeTable = cc.find("Canvas/roomScens/promptBox/notChangeTable")
                notChangeTable.active = true
                setTimeout(() => {
                    notChangeTable.active = false
                }, 2000);
            }else {
                let data: msg.IQuickStart_C2S = {
                    cfgId: Storage.RoomData.cfgId,
                }
                events.dispatch(EventKind.C2S_ChangeTable, data);
            }
        }
    }

    // 返回提示框点击事件
    backGameClick(eve, num: number){
        if (num == 1){
            let backTip = cc.find("Canvas/roomScens/promptBox/backTip")
            backTip.active = false
            let zhedangwu = cc.find("Canvas/roomScens/back_zhedangwu")
            zhedangwu.active = false
        }
        if (num == 2){
            console.log("背景点击--------------------------")
        }
    }

    // 返回提示框点击事件
    networkClick(eve, num: number){
        if (num == 1){
            let networkTip = cc.find("Canvas/roomScens/promptBox/networkTip")
            networkTip.active = false
            cc.director.loadScene("hall");
            initio();
        }
    }

    zhedangwuClick(eve, num: number){
        if (num == 1){
          console.log("点击背景遮挡物~");
        }
    }

    back_zhedangwuClick(eve, num: number){
        if (num == 1){
          console.log("back_点击背景遮挡物~");
        }
    }

    // 站起提示框点击事件
    standupClick(eve, num: number){
        let standupTip = cc.find("Canvas/roomScens/promptBox/standupTip")
        if (num == 1){
            standupTip.active = false
        }else if(num == 2){
            let dataAction: msg.IPlayerAction_C2S = {
                action: 4, // 弃牌
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);

            setTimeout(() => {
                let data: msg.IStandUp_C2S = {
                }
                events.dispatch(EventKind.C2S_StandUp, data);
                standupTip.active = false
            },500) 
            
        }
    }

    // 游戏规则点击事件
    gameRuleClick(eve, num: number){
        let rule = cc.find("Canvas/roomScens/dzpk_Rule")
        let pokerPre = rule.getChildByName("dzpk_pokerPre")
        let pokerPreBack = rule.getChildByName("dzpk_pokerPreBack")
        let gameRule = rule.getChildByName("dzpk_gameRule")
        let gameRuleBack = rule.getChildByName("dzpk_gameRuleBack")
        let pokerText = rule.getChildByName("dzpk_pokerText")
        let ruleText = rule.getChildByName("dzpk_ruleText")
        pokerPre.active = false
        pokerPreBack.active = false
        gameRule.active = false
        gameRuleBack.active = false
        pokerText.active = false
        ruleText.active = false
        if (num == 0) {   // ?号键
            // 按钮点击
            Sound.PlayAudio(Sound.LoadAudio(13,"0"))
            rule.active = true
            rule.getChildByName("cancelClick").active = true
            pokerPre.active = true
            gameRuleBack.active = true
            pokerText.active = true
        }else if (num == 1) { 
            console.log("游戏规则点击事件~")
            rule.active = false
            rule.getChildByName("cancelClick").active = false
        }else if (num == 2) {   // 牌型介绍
            pokerPre.active = true
            gameRuleBack.active = true
            pokerText.active = true
        }else if (num == 3) {   // 牌型介绍Back
            pokerPre.active = true
            gameRuleBack.active = true
            pokerText.active = true
        }else if (num == 4) {   // 游戏规则
            pokerPreBack.active = true
            gameRule.active = true
            ruleText.active = true
        }else if (num == 5) {   // 游戏规则Back
            pokerPreBack.active = true
            gameRule.active = true
            ruleText.active = true
        }
    }

    // 补充框显示点击事件
    shopStoreClick(eve, num: number){
        // 按钮点击
        Sound.PlayAudio(Sound.LoadAudio(13,"0"))
        if (num == 1){
            // 显示金币补充框和遮挡物
            let buchongkuang: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang")
            buchongkuang.active = true
            let zhedangwu: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_zhedangwu")
            zhedangwu.active = true

            let haveMoney: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_haveMoney")
            haveMoney.getComponent(cc.Label).string = Storage.ShowMoney(Storage.PlayerData.roomChips)

            let jindutiao = buchongkuang.getChildByName("dzpk_jindutiao").getComponent(cc.Slider)
            let jindutiao2 = buchongkuang.getChildByName("dzpk_jindutiao").getChildByName("jindutiao2").getComponent(cc.ProgressBar)
            if (Storage.PlayerData.roomChips > this.shopBuyMin) {
                // 只要一显示补充框的话,默认赋值添加筹码为商店买入最小值
                this.shopAddMoney = this.shopBuyMin
                // 根据房间金额来显示进度条长度
                let jindu = this.shopBuyMin / Storage.PlayerData.roomChips  
                jindutiao.progress = jindu
                jindutiao2.progress = jindutiao.progress  
                if (jindutiao.progress < jindu) {
                    jindutiao.progress = jindu
                    jindutiao2.progress = jindutiao.progress
                }
            }else {
                if (jindutiao.progress < 1) {
                    jindutiao.progress = 1
                    jindutiao2.progress = jindutiao.progress
                }
            }
            // 补充框显示金额
            let buyMinMoney: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_buyNumber_min")
            let buyMaxMoney: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_buyNumber_max")
            let jinduMoney: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_jinduMoney")

            if (Storage.RoomData.cfgId == "0") {
                buyMinMoney.getComponent(cc.Label).string = "10.0"
                buyMaxMoney.getComponent(cc.Label).string = "200"
                jinduMoney.getComponent(cc.Label).string = "10.00"
            } else if (Storage.RoomData.cfgId == "1") {
                buyMinMoney.getComponent(cc.Label).string = "50.0"
                buyMaxMoney.getComponent(cc.Label).string = "1000"
                jinduMoney.getComponent(cc.Label).string = "50.00"
            } else if  (Storage.RoomData.cfgId == "2") {
                buyMinMoney.getComponent(cc.Label).string = "300"
                buyMaxMoney.getComponent(cc.Label).string = "5000"
                jinduMoney.getComponent(cc.Label).string = "300.00"
            } else if  (Storage.RoomData.cfgId == "3") {
                buyMinMoney.getComponent(cc.Label).string = "1000"
                jinduMoney.getComponent(cc.Label).string = "1000.00"
                buyMaxMoney.active = false
                let wushangxian: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_buyNumber_wushangxian")
                wushangxian.active = true
            }
        }
    }

    // 补充框添加筹码点击事件
    addChipsClick(eve, num: number){
        // 这里要定义全局金额,来获取添加的金额
        let buchongkuang: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang")
        let zhedangwu: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_zhedangwu")
        if (num == 0){   // x 关闭
            console.log("关闭按钮点击~")
            this.shopAddMoney = 0
            buchongkuang.active = false
            zhedangwu.active = false
        }else if (num == 1){  // 确认
            console.log("确认按钮点击~")
            if (Storage.PlayerData.chair != -1) {
                if (this.shopAddMoney >= this.shopBuyMin) {  // 大于房间金额才可以添加筹码
                    this.sysGetChips = 2;
                }else {
                    this.shopAddMoney = 0
                }
                if (this.sysGetChips == 2) {
                    if (Storage.RoomData.gameStep == 0) {
                        let addChips: msg.IAddChips_C2S = {
                            addChips: this.shopAddMoney,
                            sysBuyChips: 2,
                        }
                        events.dispatch(EventKind.C2S_AddChips, addChips);
                        this.sysGetChips = 0;
                        this.shopAddMoney = 0;
                    }else {
                        let addBetTip = cc.find("Canvas/roomScens/promptBox/addBetTip")
                        addBetTip.active = true
                        setTimeout(() => {
                            addBetTip.active = false
                        },2000);
                    }
                }
            }
            buchongkuang.active = false
            zhedangwu.active = false
        }else if (num == 2){  // 是否自动获取金币
            // 这里的话其实可以写个全局变量来记录是否自动获取金币 
           let quan = buchongkuang.getChildByName("dzpk_quan3")
           if (quan.active) {
                quan.active = false
                this.sysGetChips = 0
                this.BuChongChips = 0
           }else{
                quan.active = true
                this.sysGetChips = 1
                this.BuChongChips = 1
           }
        }else if (num == 3){  // 滑动筹码
            let jindutiao = buchongkuang.getChildByName("dzpk_jindutiao").getComponent(cc.Slider)
            let jindutiao2 = buchongkuang.getChildByName("dzpk_jindutiao").getChildByName("jindutiao2").getComponent(cc.ProgressBar)
            let jinduMoney: cc.Node = cc.find("Canvas/roomScens/menu/dzpk_buchongkuang/dzpk_jinduMoney")
            if (Storage.PlayerData.roomChips > this.shopBuyMin) {
                // 根据房间金额来显示进度条长度
                let jindu = this.shopBuyMin / Storage.PlayerData.roomChips    // 0.052
                let roomMoney = Storage.PlayerData.roomChips 
                if (jindutiao.progress < jindu) {
                    this.shopAddMoney = this.shopBuyMin
                    jindutiao.progress = jindu
                    jindutiao2.progress = jindutiao.progress
                    jinduMoney.getComponent(cc.Label).string = this.shopBuyMin + ".00"
                }else {
                    let money = jindutiao.progress * roomMoney  // 给房间金额赋值
                    jindutiao2.progress = jindutiao.progress
                    jinduMoney.getComponent(cc.Label).string = Storage.ShowFixed2(money)
                    this.shopAddMoney = Number(Storage.ShowFixed2(money))
                }
            }else {
                if (jindutiao.progress < 1) {
                    jindutiao.progress = 1
                    jindutiao2.progress = jindutiao.progress
                }
            }
        }
    }

    // 申请坐下
    reqSitDown(eve, num: number) {
        // 按钮点击
        Sound.PlayAudio(Sound.LoadAudio(13,"0"))
        if (this.sitDownTime != 0) {return;}
        this.sitDownTime = 3;
        if (num == 0) {
            let data: msg.ISitDown_C2S = {
            }
            events.dispatch(EventKind.C2S_SitDown, data);
        }
    }

    // 表情包点击事件
    biaoqingClick(eve, num: number) {
        // 按钮点击
        let emoj = cc.find("Canvas/roomScens/emoj_back")
        let chat_on = emoj.getChildByName("chat_on")
        let chat_off = emoj.getChildByName("chat_off")
        let bq_on = emoj.getChildByName("bq_on")
        let bq_off = emoj.getChildByName("bq_off")
        let chat_back = emoj.getChildByName("chat_back")
        let emoj_back = emoj.getChildByName("emoj_back")
        chat_on.active = false
        chat_off.active = false
        bq_on.active = false
        bq_off.active = false
        chat_back.active = false
        emoj_back.active = false
        if (num == 0){
            // 显示表情包
            Sound.PlayAudio(Sound.LoadAudio(13,"0"))
            emoj.active = true
            emoj.getChildByName("cancelClick").active = true
            chat_on.active = true
            bq_off.active = true
            chat_back.active = true
        }else if (num == 1) {  // 关闭
            console.log("表情包背景点击~")
            // 点击背景关闭表情背景
            emoj.active = false
            emoj.getChildByName("cancelClick").active = false
        }else if (num == 2) {  // 聊天按钮
            chat_on.active = true
            bq_off.active = true
            chat_back.active = true
        }else if (num == 3) {  // 聊天背景按钮
            chat_on.active = true
            bq_off.active = true
            chat_back.active = true
        }else if (num == 4) {  // 表情按钮
            chat_off.active = true
            bq_on.active = true
            emoj_back.active = true
        }else if (num == 5) {  // 表情背景按钮
            chat_off.active = true
            bq_on.active = true
            emoj_back.active = true
        }
    }

    emojChatClick(eve, num: number) {
        if (num >= 1 && num <= 20) {
            if (this.emojTime != 0) {
                // 发言过于频繁
                let messageTip = cc.find("Canvas/roomScens/promptBox/messageTip")
                messageTip.active = true
                // 定时器3秒关闭提示
                setTimeout(() => {
                 messageTip.active = false
                }, 2000);
                return
            }
            this.emojTime = 5;

            let data: msg.IEmojiChat_C2S = {
                actNum: num,
            }
            events.dispatch(EventKind.C2S_EmojiChat, data);
        }else if (num >= 21 && num <= 24) {
            if (this.AniEmojTime != 0) {
                // 冷却时间
                let emojiTime = cc.find("Canvas/roomScens/promptBox/emojiTime")
                emojiTime.active = true
                // 定时器3秒关闭提示
                setTimeout(() => {
                    emojiTime.active = false
                }, 2000);
                return
            }
            this.AniEmojTime = 5;

            let data: msg.IEmojiChat_C2S = {
                actNum: num,
                goalChair: this.playerInfo.chair,
            }
            events.dispatch(EventKind.C2S_EmojiChat, data);
        }
        let emoj = cc.find("Canvas/roomScens/emoj_back")
        emoj.active = false
        let playerInfo_Back = cc.find("Canvas/roomScens/playerInfo_Back")
        playerInfo_Back.active = false
    }

    playerInfoClick(eve, num: number) {
        if (Storage.PlayerData.IsStandUp == true) {
            return
        }
        this.playerInfo = null
        for (let i = 0; i < Storage.RoomData.playerData.length; i++) {
            if (Storage.RoomData.playerData[i] != null) {
                if (Storage.SeatChange(Storage.RoomData.playerData[i].chair) == num) {
                    console.log("玩家座位为:",Storage.SeatChange(Storage.RoomData.playerData[i].chair),num)      
                    this.playerInfo = Storage.RoomData.playerData[i]
                }
            }
        }
        let playerInfo_Back = cc.find("Canvas/roomScens/playerInfo_Back")
        playerInfo_Back.active = true
        playerInfo_Back.getChildByName("cancelClick").active = true
        let infoBack_01 = playerInfo_Back.getChildByName("infoBack_01")
        infoBack_01.active = false
        let infoBack_02 = playerInfo_Back.getChildByName("infoBack_02")
        infoBack_02.active = false
        let infoBack_03 = playerInfo_Back.getChildByName("infoBack_03")
        infoBack_03.active = false
        let infoBack_04 = playerInfo_Back.getChildByName("infoBack_04")
        infoBack_04.active = false
        let infoBack_06 = playerInfo_Back.getChildByName("infoBack_06")
        infoBack_06.active = false
        let infoBack_07 = playerInfo_Back.getChildByName("infoBack_07")
        infoBack_07.active = false
        let infoBack_08 = playerInfo_Back.getChildByName("infoBack_08")
        infoBack_08.active = false
        let infoBack_09 = playerInfo_Back.getChildByName("infoBack_09")
        infoBack_09.active = false
        if (num == 0) {
           infoBack_01.active = true
           infoBack_01.getChildByName("name").active = true
           infoBack_01.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
           let node = infoBack_01.getChildByName("image")
           node.active = true
           let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
           Storage.loadSpriteAtlas(node, url)
           infoBack_01.getChildByName("money").active = true      
           let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips   
           infoBack_01.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
           let chicken = infoBack_01.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
           let flower = infoBack_01.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
           let beer = infoBack_01.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
           let tuoxie = infoBack_01.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
           chicken.progress = 0
           flower.progress = 0
           beer.progress = 0
           tuoxie.progress = 0
           if (this.AniEmojTime != 0) {
            let emTicker: any = null            
            emTicker = setInterval(() => {
                let a = 5 - this.AniEmojTime
                let b = 5 - a 
                let c = (1 / 5) * b 
                chicken.progress = c
                flower.progress = c
                beer.progress = c
                tuoxie.progress = c
            }, this.intervalTime);
        }
        }else if (num == 1) {
           infoBack_02.active = true
           infoBack_02.getChildByName("name").active = true
           infoBack_02.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
           let node = infoBack_02.getChildByName("image")
           node.active = true
           let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
           Storage.loadSpriteAtlas(node, url)
           infoBack_02.getChildByName("money").active = true      
           let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips    
           infoBack_02.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
           let chicken = infoBack_02.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
           let flower = infoBack_02.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
           let beer = infoBack_02.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
           let tuoxie = infoBack_02.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
           chicken.progress = 0
           flower.progress = 0
           beer.progress = 0
           tuoxie.progress = 0
           if (this.AniEmojTime != 0) {
            let emTicker: any = null            
            emTicker = setInterval(() => {
                let a = 5 - this.AniEmojTime
                let b = 5 - a 
                let c = (1 / 5) * b 
                chicken.progress = c
                flower.progress = c
                beer.progress = c
                tuoxie.progress = c
            }, this.intervalTime);
        }
        }else if (num == 2) {
           infoBack_03.active = true
           infoBack_03.getChildByName("name").active = true
           infoBack_03.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
           let node = infoBack_03.getChildByName("image")
           node.active = true
           let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
           Storage.loadSpriteAtlas(node, url)
           infoBack_03.getChildByName("money").active = true     
           let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips       
           infoBack_03.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
           let chicken = infoBack_03.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
           let flower = infoBack_03.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
           let beer = infoBack_03.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
           let tuoxie = infoBack_03.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
           chicken.progress = 0
           flower.progress = 0
           beer.progress = 0
           tuoxie.progress = 0
           if (this.AniEmojTime != 0) {
            let emTicker: any = null            
            emTicker = setInterval(() => {
                let a = 5 - this.AniEmojTime
                let b = 5 - a 
                let c = (1 / 5) * b 
                chicken.progress = c
                flower.progress = c
                beer.progress = c
                tuoxie.progress = c
            }, this.intervalTime);
        }
        }else if (num == 3) {
            infoBack_04.active = true
            infoBack_04.getChildByName("name").active = true
            infoBack_04.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
            let node = infoBack_04.getChildByName("image")
            node.active = true
            let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
            Storage.loadSpriteAtlas(node, url)
            infoBack_04.getChildByName("money").active = true       
            let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips    
            infoBack_04.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
            let chicken = infoBack_04.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
            let flower = infoBack_04.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
            let beer = infoBack_04.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
            let tuoxie = infoBack_04.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
            chicken.progress = 0
            flower.progress = 0
            beer.progress = 0
            tuoxie.progress = 0
            if (this.AniEmojTime != 0) {
                let emTicker: any = null            
                emTicker = setInterval(() => {
                    let a = 5 - this.AniEmojTime
                    let b = 5 - a 
                    let c = (1 / 5) * b 
                    chicken.progress = c
                    flower.progress = c
                    beer.progress = c
                    tuoxie.progress = c
                }, this.intervalTime);
            }
        }else if (num == 5) {
            infoBack_06.active = true
            infoBack_06.getChildByName("name").active = true
            infoBack_06.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
            let node = infoBack_06.getChildByName("image")
            node.active = true
            let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
            Storage.loadSpriteAtlas(node, url)
            infoBack_06.getChildByName("money").active = true     
            let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips    
            infoBack_06.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
            let chicken = infoBack_06.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
            let flower = infoBack_06.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
            let beer = infoBack_06.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
            let tuoxie = infoBack_06.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
            chicken.progress = 0
            flower.progress = 0
            beer.progress = 0
            tuoxie.progress = 0    
            if (this.AniEmojTime != 0) {
                let emTicker: any = null            
                emTicker = setInterval(() => {
                    let a = 5 - this.AniEmojTime
                    let b = 5 - a 
                    let c = (1 / 5) * b 
                    chicken.progress = c
                    flower.progress = c
                    beer.progress = c
                    tuoxie.progress = c
                }, this.intervalTime);
            }
        }else if (num == 6) {
            infoBack_07.active = true
            infoBack_07.getChildByName("name").active = true
            infoBack_07.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
            let node = infoBack_07.getChildByName("image")
            node.active = true
            let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
            Storage.loadSpriteAtlas(node, url)
            infoBack_07.getChildByName("money").active = true   
            let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips              
            infoBack_07.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
            let chicken = infoBack_07.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
            let flower = infoBack_07.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
            let beer = infoBack_07.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
            let tuoxie = infoBack_07.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
            chicken.progress = 0
            flower.progress = 0
            beer.progress = 0
            tuoxie.progress = 0
            if (this.AniEmojTime != 0) {
                let emTicker: any = null            
                emTicker = setInterval(() => {
                    let a = 5 - this.AniEmojTime
                    let b = 5 - a 
                    let c = (1 / 5) * b 
                    chicken.progress = c
                    flower.progress = c
                    beer.progress = c
                    tuoxie.progress = c
                }, this.intervalTime);
            }
        }else if (num == 7) {
            infoBack_08.active = true
            infoBack_08.getChildByName("name").active = true
            infoBack_08.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
            let node = infoBack_08.getChildByName("image")
            node.active = true
            let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
            Storage.loadSpriteAtlas(node, url)
            infoBack_08.getChildByName("money").active = true    
            let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips                     
            infoBack_08.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
            let chicken = infoBack_08.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
            let flower = infoBack_08.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
            let beer = infoBack_08.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
            let tuoxie = infoBack_08.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
            chicken.progress = 0
            flower.progress = 0
            beer.progress = 0
            tuoxie.progress = 0
            if (this.AniEmojTime != 0) {
                let emTicker: any = null            
                emTicker = setInterval(() => {
                    let a = 5 - this.AniEmojTime
                    let b = 5 - a 
                    let c = (1 / 5) * b 
                    chicken.progress = c
                    flower.progress = c
                    beer.progress = c
                    tuoxie.progress = c
                }, this.intervalTime);
            }
        }else if (num == 8) {
            infoBack_09.active = true
            infoBack_09.getChildByName("name").active = true
            infoBack_09.getChildByName("name").getComponent(cc.Label).string = this.playerInfo.playerInfo.nickName;
            let node = infoBack_09.getChildByName("image")
            node.active = true
            let url = Storage.GetPlayerHead(this.playerInfo.playerInfo.headImg) 
            Storage.loadSpriteAtlas(node, url)
            infoBack_09.getChildByName("money").active = true       
            let showMoney = this.playerInfo.playerInfo.account + this.playerInfo.roomChips                          
            infoBack_09.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(showMoney)
            let chicken = infoBack_09.getChildByName("chicken").getChildByName("timer").getComponent(cc.ProgressBar)
            let flower = infoBack_09.getChildByName("flower").getChildByName("timer").getComponent(cc.ProgressBar)
            let beer = infoBack_09.getChildByName("beer").getChildByName("timer").getComponent(cc.ProgressBar)
            let tuoxie = infoBack_09.getChildByName("tuoxie").getChildByName("timer").getComponent(cc.ProgressBar)
            chicken.progress = 0
           flower.progress = 0
           beer.progress = 0
           tuoxie.progress = 0
            if (this.AniEmojTime != 0) {
                let emTicker: any = null            
                emTicker = setInterval(() => {
                    let a = 5 - this.AniEmojTime
                    let b = 5 - a 
                    let c = (1 / 5) * b 
                    chicken.progress = c
                    flower.progress = c
                    beer.progress = c
                    tuoxie.progress = c
                }, this.intervalTime);
            }
        }
        if (num == 10) { // cancelBack
            console.log("玩家信息背景点击~");
            playerInfo_Back.active = false
            infoBack_01.active = false
            infoBack_02.active = false
            infoBack_03.active = false
            infoBack_04.active = false
            infoBack_06.active = false
            infoBack_07.active = false
            infoBack_08.active = false
            infoBack_09.active = false
            playerInfo_Back.getChildByName("cancelClick").active = false
        }
    }
  
    PlayerNewJoinPlayer(data: msg.IPlayerData) {
        let Seat = Storage.SeatChange(data.chair)

        this.head[Seat].active = true
        this.CloseActionType(Seat)
        this.head[Seat].getChildByName("zhedangwu").active = false
        this.head[Seat].getChildByName("name").active = true
        this.head[Seat].getChildByName("name").getComponent(cc.Label).string = data.playerInfo.nickName;
        let node = this.head[Seat].getChildByName("image")
        node.active = true
        let url = Storage.GetPlayerHead(data.playerInfo.headImg) 
        Storage.loadSpriteAtlas(node, url)
        this.head[Seat].getChildByName("money").active = true
        this.head[Seat].getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(data.chips)
        if (data.gameStep != 1) {
            this.head[Seat].getChildByName("zhedangwu").active = true
        }

        this.head[Seat].getChildByName("card").active = false
        this.CloseActionType(Seat)
        this.head[Seat].getChildByName("dzpk_win_frame").active = false
        this.head[Seat].getChildByName("paixing").active = false
        this.head[Seat].getChildByName("paixing2").active = false
        this.head[Seat].getChildByName("zhuangjia").active = false
        this.head[Seat].getChildByName("poker_1").active = false
        this.head[Seat].getChildByName("poker_2").active = false
        this.head[Seat].getChildByName("poker_1").getChildByName("zhedangwu").active = false
        this.head[Seat].getChildByName("poker_2").getChildByName("zhedangwu").active = false
        this.head[Seat].getChildByName("poker_1").getComponent("dzpk_Poker").ClearPoker()
        this.head[Seat].getChildByName("poker_2").getComponent("dzpk_Poker").ClearPoker()
        this.head[Seat].getChildByName("dzpk_choumadi").active = false
    }

    GetPlayerYiWei() {
        let NowSeat = Storage.PlayerData.chair  // 当前座位
        let TargetSeat = 4  // 目标位置
        let yiwei = NowSeat - TargetSeat  // 移位
        Storage.YiWei = yiwei
    }

    ShowTableInfo() {
        // 荷官动作
        this.heguan.active = true;
        this.heguan.getComponent(sp.Skeleton).setAnimation(1, "daiji", true)
        // 显示桌面等待游戏字体
        let waitGameStart: cc.Node = cc.find("Canvas/roomScens/dzpk_zhuozi/dzpk_waitGameStart")
        waitGameStart.active = true
        // 显示提示框
        let promptBox = cc.find("Canvas/roomScens/promptBox")
        promptBox.active = true
        // 判断大厅音效是否关闭,关闭则不显示音效键
        if (Sound.IsOpenMusic == false) {
            this.yinxiao_on.active = false
            this.yinxiao_off.active = true
        }

        let pn = cc.find('Canvas/roomScens/Internet')
        gHandler.eventMgr.dispatch(gHandler.eventMgr.showNetStateNode, { parent: pn, position: { x: 0, y: 0 } })

        // 显示房间带入金额
        this.ShowRoomMoney()
    }

    // 显示房间带入金额
    ShowRoomMoney(){
        let roomMoney: cc.Node = cc.find("Canvas/roomScens/dzpk_zhuozi/roomMoney")
        roomMoney.active = true
        if (Storage.RoomData.cfgId == "0") {
            let tiyan: cc.Node = cc.find("Canvas/roomScens/dzpk_zhuozi/roomMoney/roomMoney_1")
            tiyan.active = true
            this.shopBuyMin = 10
        } else if (Storage.RoomData.cfgId == "1") {
            let chuji: cc.Node = cc.find("Canvas/roomScens/dzpk_zhuozi/roomMoney/roomMoney_2")
            chuji.active = true
            this.shopBuyMin = 50
        } else if  (Storage.RoomData.cfgId == "2") {
            let zhongji: cc.Node = cc.find("Canvas/roomScens/dzpk_zhuozi/roomMoney/roomMoney_3")
            zhongji.active = true
            this.shopBuyMin = 300
        } else if  (Storage.RoomData.cfgId == "3") {
            let gaoji: cc.Node = cc.find("Canvas/roomScens/dzpk_zhuozi/roomMoney/roomMoney_4")
            gaoji.active = true
            this.shopBuyMin = 1000
        }
    }

    ShowTablePlayer() {
        for (let i = 0; i < Storage.RoomData.playerData.length; i++) {
            if (Storage.RoomData.playerData[i] != null) {
                let Seat = Storage.SeatChange(Storage.RoomData.playerData[i].chair)
                console.log("显示自己玩家:",Storage.RoomData.playerData[i].chair,Seat)
                this.head[Seat].active = true
                this.head[Seat].getChildByName("name").active = true
                this.head[Seat].getChildByName("name").getComponent(cc.Label).string = Storage.RoomData.playerData[i].playerInfo.nickName;
                let node = this.head[Seat].getChildByName("image")
                node.active = true
                let url = Storage.GetPlayerHead(Storage.RoomData.playerData[i].playerInfo.headImg) 
                Storage.loadSpriteAtlas(node, url)
                this.head[Seat].getChildByName("money").active = true           
                this.head[Seat].getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(Storage.RoomData.playerData[i].chips)

                if (Storage.RoomData.gameStep != 0) {
                    this.waitGame.active = false
                    if (Storage.RoomData.playerData[i].gameStep == 0) {
                        if (Storage.RoomData.playerData[i].playerInfo.Id == Storage.UserInfo.Id) {
                            this.CloseBetButton()
                            this.CloseBlindButton()
                            this.CloseActionButton()
                        }
                        this.head[Seat].getChildByName("zhedangwu").active = true
                    }else { 
                        if (Storage.RoomData.activeId == Storage.RoomData.playerData[i].playerInfo.Id) {
                            console.log("当前行动玩家:",Storage.RoomData.activeId,Storage.SeatChange(Storage.RoomData.playerData[i].chair));
                            this.CloseActionType(Seat)
                            let timeImg: cc.Node = this.head[Seat].getChildByName("timer")
                            // this.timer = this.timer - Storage.RoomData.playerData[i].timerCount - 3 
                            timeImg.active = true
                            this.upDateTimer(timeImg)
                            if (Storage.RoomData.playerData[i].playerInfo.Id == Storage.UserInfo.Id) {
                                this.CloseBetButton()
                                // 显示行动按钮
                                this.ShowActionButton()
                            }
                        }else {
                            if (Storage.RoomData.playerData[i].playerInfo.Id == Storage.UserInfo.Id) {
                                // 关闭blindButton 和 actionButton
                                this.CloseBlindButton()
                                this.CloseActionButton()
                                // 显示选择行动按钮
                                this.bet_check.active = true
                                this.bet_rang.active = true
                                this.bet_callAll.active = true
                                let money = Storage.RoomData.preChips - Storage.PlayerData.lunDownBets
                                if (money > 0) {
                                    this.bet_rang.active = false
                                    this.bet_call.active = true
                                    if (money < 100) { // 处理后两位小数点
                                        this.bet_call.getChildByName("dzpk_money").getComponent(cc.Label).string = Storage.ShowFixed2(money)
                                    }else {
                                        this.bet_call.getChildByName("dzpk_money").getComponent(cc.Label).string = Storage.ShowMoney(money)
                                    }
                                }else {
                                    this.bet_rang.active = true
                                    this.bet_call.active = false
                                }
                            }
                        }
                    }
                    // 玩家如果下注就显示筹码底
                    if (Storage.RoomData.playerData[i].lunDownBets > 0) {
                        this.head[Seat].getChildByName("dzpk_choumadi").active = true
                        this.head[Seat].getChildByName("dzpk_choumadi").getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(Storage.RoomData.playerData[i].lunDownBets)
                    }
                    // 显示玩家下注状态
                    if (Storage.RoomData.playerData[i].actionStatus != 0){
                        if (Storage.RoomData.playerData[i].actionStatus == 1){
                            this.ShowActionType(Seat,Storage.RoomData.playerData[i].actionStatus)
                        }else if (Storage.RoomData.playerData[i].actionStatus == 2) {
                            this.ShowActionType(Seat,Storage.RoomData.playerData[i].actionStatus)
                        }else if (Storage.RoomData.playerData[i].actionStatus == 3) {
                            this.ShowActionType(Seat,Storage.RoomData.playerData[i].actionStatus)
                        }else if (Storage.RoomData.playerData[i].actionStatus == 4) {
                            this.ShowActionType(Seat,Storage.RoomData.playerData[i].actionStatus)
                            this.head[Seat].getChildByName("zhedangwu").active = true
                        }
                    }
                    // 显示玩家手牌
                    if (Storage.RoomData.playerData[i].playerInfo.Id == Storage.PlayerData.playerInfo.Id) {
                        // 更新玩家手牌类型
                        if (Storage.PlayerData.gameStep == 1 && Storage.RoomData.gameStep >= 1) {  // todo
                            let Seat = Storage.SeatChange(Storage.PlayerData.chair)
                            this.ActivationCardType(Seat, Storage.PlayerData.cardSuitData.suitPattern)
                        }
                        let cardData1 = Storage.PlayerData.cardSuitData.handCardKeys[0]
                        if (cardData1 != null) {
                            // console.log("打印座位:",Storage.PlayerData.playerInfo.Id)
                            // console.log("打印Seat:",Seat);
                            let card_1 = this.head[Seat].getChildByName("card_1")
                            card_1.active = true
                            this.head[Seat].getChildByName("card_1").getComponent("dzpk_Poker").InitPoker(cardData1)
                            let card_2 = this.head[Seat].getChildByName("card_2")
                            card_2.active = true
                            let cardData2 = Storage.PlayerData.cardSuitData.handCardKeys[1]
                            this.head[Seat].getChildByName("card_2").getComponent("dzpk_Poker").InitPoker(cardData2)
                            this.ActivationCardType(Seat, Storage.PlayerData.cardSuitData.suitPattern)
                            if (Storage.RoomData.playerData[i].actionStatus == 4) {
                                this.head[Seat].getChildByName("card_1").getChildByName("zhedangwu").active = true
                                this.head[Seat].getChildByName("card_2").getChildByName("zhedangwu").active = true
                            }
                        }
                    }else {
                        if (Storage.RoomData.playerData[i].cardSuitData.handCardKeys[0] != null) {
                            if (Storage.RoomData.playerData[i].gameStep == 1) {
                                this.head[Seat].getChildByName("card").active = true
                            }
                        }
                    }
                    if (Storage.RoomData.banker == Storage.RoomData.playerData[i].chair) {
                        this.head[Seat].getChildByName("zhuangjia").active = true
                    }
                }
            }
        }
        for (let i = 0; i < Storage.RoomData.AllPlayer.length; i++) {
            // 显示坐下按钮
            if (Storage.RoomData.AllPlayer[i].playerInfo.Id == Storage.PlayerData.playerInfo.Id) {
                if (Storage.RoomData.AllPlayer[i].chair == -1 && Storage.RoomData.AllPlayer[i].IsInGame == true) {
                    this.standUp.active = false
                    this.standUpBack.active = true
                    this.sitDown.active = true
                    this.CloseBetButton()
                    this.biaoqing.active = false
                }
            }
        }
    }

    // 显示桌面poker
    ShowTablePoker() {
        // todo 判断当前房间是什么状态 
        if (Storage.RoomData.gameStep != 0) {
            if (Storage.RoomData.publicCards.length >= 3) {
                // 注池筹码 和 桌面卡牌
                this.table_dichi.active = true
                this.table_dichi.getComponent(cc.Label).string = "底池:" + Storage.ShowMoney(Storage.RoomData.potMoney)
                if (Storage.RoomData.gameStep >= 2 && Storage.RoomData.gameStep <= 5) {
                    this.CloseTablePoker()
                    this.table_choumadi.active = true
                    this.table_choumadi.getChildByName("money").getComponent(cc.Label).string = Storage.ShowMoney(Storage.RoomData.potMoney)
                    
                    setTimeout(() => {
                        this.poker_1.active = true
                        this.poker_1.getComponent("dzpk_Poker").InitPoker(Storage.RoomData.publicCards[0])
                        this.poker_1.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_1)
                    },600);
                    setTimeout(() => {
                        this.poker_2.active = true
                        this.poker_2.getComponent("dzpk_Poker").InitPoker(Storage.RoomData.publicCards[1])
                        this.poker_2.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_2)
                    },900);
                    setTimeout(() => {
                        this.poker_3.active = true
                        this.poker_3.getComponent("dzpk_Poker").InitPoker(Storage.RoomData.publicCards[2])
                        this.poker_3.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_3)
                    },1200);
                    if (Storage.RoomData.gameStep >= 3 && Storage.RoomData.gameStep <= 5) {
                        setTimeout(() => {
                            this.poker_4.active = true
                            this.poker_4.getComponent("dzpk_Poker").InitPoker(Storage.RoomData.publicCards[3])
                            this.poker_4.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_4)
                        },1500);
                    }
                    if (Storage.RoomData.gameStep == 4 || Storage.RoomData.gameStep == 5) {
                        setTimeout(() => {
                            this.poker_5.active = true
                            this.poker_5.getComponent("dzpk_Poker").InitPoker(Storage.RoomData.publicCards[4])
                            this.poker_5.getComponent("dzpk_Poker").cardAnimaLeft(this.poker_5)
                        },1800);
                    }
                }
            }
        }
    }
    
    ShowActionButton() {
        if (Storage.RoomData.gameStep == 1 ) {  // 显示盲注类型
            let blind3 = Storage.RoomData.bigBlind * 3
            if (Storage.PlayerData.chips > blind3) {
                if (blind3 >= (Storage.RoomData.preChips + Storage.RoomData.bigBlind - Storage.PlayerData.lunDownBets)){
                    this.blind_3.active = true
                }else{
                    this.blind_3back.active = true
                }
            }else {
                this.blind_3back.active = true
            }
            let blind4 = Storage.RoomData.bigBlind * 4
            if (Storage.PlayerData.chips > blind4) {
                if (blind4 >= (Storage.RoomData.preChips + Storage.RoomData.bigBlind - Storage.PlayerData.lunDownBets)){
                    this.blind_4.active = true
                }else{
                    this.blind_4back.active = true
                }
            }else {
                this.blind_4back.active = true
            }
            let potMoney = Storage.RoomData.potMoney
            if (Storage.PlayerData.chips > potMoney) {
                if (potMoney >= (Storage.RoomData.preChips + Storage.RoomData.bigBlind - Storage.PlayerData.lunDownBets)){
                    this.blind_1.active = true
                }else{
                    this.blind_1back.active = true
                }
            }else {
                 this.blind_1back.active = true
            }
        }else {  // 显示底池类型
            let pot13 = Storage.RoomData.potMoney / 3
            if (Storage.PlayerData.chips > pot13) {
                if (pot13 >= (Storage.RoomData.preChips + Storage.RoomData.bigBlind - Storage.PlayerData.lunDownBets)){
                    this.blind_13.active = true
                }else{
                    this.blind_13back.active = true
                }
            }else {
                this.blind_13back.active = true
            }
            let pot23 = Storage.RoomData.potMoney / 3
            pot23 = pot23 * 2
            if (Storage.PlayerData.chips > pot23) {
                if (pot23 >= (Storage.RoomData.preChips + Storage.RoomData.bigBlind - Storage.PlayerData.lunDownBets)){
                    this.blind_23.active = true
                }else{
                    this.blind_23back.active = true
                }
            }else {
                this.blind_23back.active = true
            }
            let potMoney = Storage.RoomData.potMoney
            if (Storage.PlayerData.chips > potMoney) {
                if (potMoney >= (Storage.RoomData.preChips + Storage.RoomData.bigBlind - Storage.PlayerData.lunDownBets)){
                    this.blind_1.active = true
                }else{
                    this.blind_1back.active = true
                }
            }else {
                 this.blind_1back.active = true
            }
        }
        // 显示行动按钮
        this.act_check.active = true
        let callMoney = Storage.RoomData.preChips - Storage.PlayerData.lunDownBets 
        if (Storage.RoomData.isHaveAllin) {
            if (Storage.PlayerData.chips > callMoney) {
                this.act_call.active = true
                let dzpk_money = this.act_call.getChildByName("dzpk_money")
                if (callMoney < 100) {
                    dzpk_money.getComponent(cc.Label).string = Storage.ShowAddBet(callMoney)
                }else {
                    dzpk_money.getComponent(cc.Label).string = Storage.ShowMoney(callMoney)
                }
                this.act_ALLIN_2.active = true
            }else {
                this.act_ALLIN.active = true
                this.act_addBetBack.active = true
            }
        }else {
            if (callMoney > 0) {
                this.act_call.active = true
                let dzpk_money = this.act_call.getChildByName("dzpk_money")
                if (callMoney < 100) {
                    dzpk_money.getComponent(cc.Label).string = Storage.ShowAddBet(callMoney)
                }else {
                    dzpk_money.getComponent(cc.Label).string = Storage.ShowMoney(callMoney)
                }
            }else {
                this.act_rang.active = true
            }
            if (Storage.PlayerData.chips > callMoney) {
                this.act_addBet.active = true
            }
        }
        
        if (callMoney > 0) {
            this.act_call.active = true
            let dzpk_money = this.act_call.getChildByName("dzpk_money")
            if (callMoney > Storage.PlayerData.chips) {
                this.act_ALLIN.active = true
                this.act_addBetBack.active = true
            }else {
                this.act_addBet.active = true
                if (callMoney < 100) {
                    dzpk_money.getComponent(cc.Label).string = Storage.ShowAddBet(callMoney)
                }else {
                    dzpk_money.getComponent(cc.Label).string = Storage.ShowMoney(callMoney)
                }
            }
        }else {
            this.act_rang.active = true
            this.act_addBet.active = true
        }
    }

    // 显示玩家行动类型
    ShowActionType(Seat, actType) {
        // 关闭行动
        this.CloseActionType(Seat)
        this.head[Seat].getChildByName("ActionType").active = true
        if (actType == 1) {
            this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_jiazhu").active = true
        }else if (actType == 2) {
            this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_genzhu").active = true
        }else if (actType == 3) {
            this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_rangpai").active = true
        }else if (actType == 4) {
            this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_qipai").active = true
        }else if (actType == 5) {
            this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_allIn").active = true
        }
        this.head[Seat].getChildByName("name").active = false
        this.head[Seat].getChildByName("timer").active = false
    }

    CloseActionType(Seat) {
        this.head[Seat].getChildByName("ActionType").active = false
        this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_jiazhu").active = false
        this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_genzhu").active = false
        this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_rangpai").active = false
        this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_qipai").active = false
        this.head[Seat].getChildByName("ActionType").getChildByName("dzpk_allIn").active = false
    }
    
    // 关闭BetButton圈
    CloseBetButtonQuan() {
        this.bet_check.getChildByName("dzpk_yuan2").active = false
        this.bet_rang.getChildByName("dzpk_yuan2").active = false
        this.bet_call.getChildByName("dzpk_yuan2").active = false
        this.bet_callAll.getChildByName("dzpk_yuan2").active = false
    }

    CloseTablePoker() {
        this.poker_1.active = false
        this.poker_2.active = false
        this.poker_3.active = false
        this.poker_4.active = false
        this.poker_5.active = false
        this.poker_1.getChildByName("zhedangwu").active = false
        this.poker_2.getChildByName("zhedangwu").active = false
        this.poker_3.getChildByName("zhedangwu").active = false
        this.poker_4.getChildByName("zhedangwu").active = false
        this.poker_5.getChildByName("zhedangwu").active = false
        this.poker_1.getComponent("dzpk_Poker").ClearPoker()
        this.poker_2.getComponent("dzpk_Poker").ClearPoker()
        this.poker_3.getComponent("dzpk_Poker").ClearPoker()
        this.poker_4.getComponent("dzpk_Poker").ClearPoker()
        this.poker_5.getComponent("dzpk_Poker").ClearPoker()
    }

    ClearTableData() {
        let dichi = cc.find("Canvas/roomScens/dzpk_zhuozi/dichi_money")
        dichi.active = false
        this.table_choumadi.active = false

        // 清除桌面扑克
        this.CloseTablePoker()
        // 清除玩家数据
        this.ClearPlayerData()
    }

    ClearPlayerData() {
        for (let i = 0; i < Storage.RoomData.playerData.length; i++) {
            if (Storage.RoomData.playerData[i] != null) {
                let Seat = Storage.SeatChange(Storage.RoomData.playerData[i].chair)
                if (Storage.RoomData.playerData[i].chair == Storage.PlayerData.chair) {
                    if (Storage.RoomData.playerData[i].cardSuitData.handCardKeys[0] != null) {
                        this.head[Seat].getChildByName("card_1").active = false
                        this.head[Seat].getChildByName("card_2").active = false
                        this.head[Seat].getChildByName("card_1").getComponent("dzpk_Poker").ClearPoker()
                        this.head[Seat].getChildByName("card_2").getComponent("dzpk_Poker").ClearPoker()
                        this.head[Seat].getChildByName("card_1").getChildByName("zhedangwu").active = false
                        this.head[Seat].getChildByName("card_2").getChildByName("zhedangwu").active = false
                        this.CloseCardType(Seat)
                    }
                }
                this.head[Seat].getChildByName("timer").active = false
                this.head[Seat].getChildByName("card").active = false
                this.CloseActionType(Seat)
                this.head[Seat].getChildByName("poker_1").getChildByName("zhedangwu").active = false
                this.head[Seat].getChildByName("poker_2").getChildByName("zhedangwu").active = false
                this.head[Seat].getChildByName("dzpk_win_frame").active = false
                this.head[Seat].getChildByName("paixing").active = false
                this.head[Seat].getChildByName("paixing2").active = false
                this.head[Seat].getChildByName("zhuangjia").active = false
                this.head[Seat].getChildByName("zhedangwu").active = false
                this.head[Seat].getChildByName("poker_1").active = false
                this.head[Seat].getChildByName("poker_2").active = false
                this.head[Seat].getChildByName("poker_1").getComponent("dzpk_Poker").ClearPoker()
                this.head[Seat].getChildByName("poker_2").getComponent("dzpk_Poker").ClearPoker()
                this.head[Seat].getChildByName("name").active = true
                this.head[Seat].getChildByName("name").getComponent(cc.Label).string = Storage.RoomData.playerData[i].playerInfo.nickName;
                this.head[Seat].getChildByName("dzpk_choumadi").active = false
            }
        }
    }

    DestoryPlayer(Seat: number) {
        this.head[Seat].active = false
        this.head[Seat].getChildByName("name").active = false
        this.head[Seat].getChildByName("image").active = false
        this.head[Seat].getChildByName("money").active = false
        this.head[Seat].getChildByName("zhedangwu").active = false
        this.head[Seat].getChildByName("zhuangjia").active = false
        this.head[Seat].getChildByName("dzpk_choumadi").active = false
    }

    // 关闭卡牌类型
    CloseCardType(Seat) {
        let cardType = this.head[Seat].getChildByName("cardType")
        cardType.active = false
        cardType.getChildByName("dzpk_cardtype1").active = false
        cardType.getChildByName("dzpk_cardtype2").active = false
        cardType.getChildByName("dzpk_cardtype3").active = false
        cardType.getChildByName("dzpk_cardtype4").active = false
        cardType.getChildByName("dzpk_cardtype5").active = false
        cardType.getChildByName("dzpk_cardtype6").active = false
        cardType.getChildByName("dzpk_cardtype7").active = false
        cardType.getChildByName("dzpk_cardtype8").active = false
        cardType.getChildByName("dzpk_cardtype9").active = false
        cardType.getChildByName("dzpk_cardtype10").active = false
    }

    // 激活卡牌类型
    ActivationCardType(Seat,suitPattern) {
        this.CloseCardType(Seat)
        
        let cardType = this.head[Seat].getChildByName("cardType")
        cardType.active = true
        if (suitPattern == 1) {
            cardType.getChildByName("dzpk_cardtype1").active = true
        }else if (suitPattern == 2) {
            cardType.getChildByName("dzpk_cardtype2").active = true
        }else if (suitPattern == 3) {
            cardType.getChildByName("dzpk_cardtype3").active = true
        }else if (suitPattern == 4) {
            cardType.getChildByName("dzpk_cardtype4").active = true
        }else if (suitPattern == 5) {
            cardType.getChildByName("dzpk_cardtype5").active = true
        }else if (suitPattern == 6) {
            cardType.getChildByName("dzpk_cardtype6").active = true
        }else if (suitPattern == 7) {
            cardType.getChildByName("dzpk_cardtype7").active = true
        }else if (suitPattern == 8) {
            cardType.getChildByName("dzpk_cardtype8").active = true
        }else if (suitPattern == 9) {
            cardType.getChildByName("dzpk_cardtype9").active = true
        }else if (suitPattern == 10) {
            cardType.getChildByName("dzpk_cardtype10").active = true
        }
    }

    // 更新头像框进度条
    upDateTimer(timeImg: cc.Node) {  
        this.ClearHeadImage()
        timeImg.active = true
        clearInterval(this.ticker);
        this.intervalTime = 16;
        this.ticker = null;
        this.ticker = setInterval(() => {
            // 头像框定时变色
            this.headTimerTicker(timeImg)
        }, this.intervalTime);
    }

    private headTimerTicker(timeImg: cc.Node) {
        if (this.timer > 0) {
            this.timer -= 0.016
            if (this.timer <= 0) {
                this.timer = 0
                timeImg.getComponent(cc.Sprite).fillRange = 0;
            } else {
                // 可能会使模拟器闪屏错误，路径加载以引起
                if (this.timer <= 15 && this.timer > 11) {
                    let ht = this.timer / 15;
                    ht = Number(ht.toFixed(3));   // 保留三位小数位,返回string
                    timeImg.getComponent(cc.Sprite).fillRange = ht;
                    timeImg.getComponent(cc.Sprite).spriteFrame = this.timer1          
                    // Storage.loadSpriteFrame(timeImg, "dzpk/headTimer/dzpk_timer1")
                }else if (this.timer <= 11 && this.timer > 5.7) {
                    let ht = this.timer / 15;
                    ht = Number(ht.toFixed(3));   // 保留三位小数位,返回string
                    timeImg.getComponent(cc.Sprite).fillRange = ht;
                    timeImg.getComponent(cc.Sprite).spriteFrame = this.timer2
                    // Storage.loadSpriteFrame(timeImg, "dzpk/headTimer/dzpk_timer2")
                } else if (this.timer <= 5.7) {
                    let ht = this.timer / 15;
                    ht = Number(ht.toFixed(3));   // 保留三位小数位,返回string
                    timeImg.getComponent(cc.Sprite).fillRange = ht;
                    timeImg.getComponent(cc.Sprite).spriteFrame = this.timer3
                    // Storage.loadSpriteFrame(timeImg, "dzpk/headTimer/dzpk_timer3")
                    if (this.timer >= 5.68) {
                        setTimeout(() => {
                            Sound.PlayAudio(Sound.LoadAudio(2,"0"))
                        }, 200);
                        setTimeout(() => {
                            Sound.PlayAudio(Sound.LoadAudio(2,"0"))
                        }, 400);
                        setTimeout(() => {
                            Sound.PlayAudio(Sound.LoadAudio(2,"0"))
                        }, 1000);
                        setTimeout(() => {
                            Sound.PlayAudio(Sound.LoadAudio(2,"0"))
                        }, 1200);
                        setTimeout(() => {
                            Sound.PlayAudio(Sound.LoadAudio(2,"0"))
                        }, 1800);
                        setTimeout(() => {
                            Sound.PlayAudio(Sound.LoadAudio(2,"0"))
                        }, 2000);
                    }
                }
                // let ht = this.timer / 15;
                // ht = Number(ht.toFixed(3));   // 保留三位小数位,返回string
                // timeImg.getComponent(cc.Sprite).fillRange = ht;
            }
        }
    }

    ClearHeadImage() {
        for (let i = 0; i < 9; i++) {
            this.head[i].getChildByName("timer").active = false
        }
    }

    // 关闭选择下注按钮
    CloseBetButton() {
        this.bet_check.active = false
        this.bet_rang.active = false
        this.bet_call.active = false
        this.bet_callAll.active = false
    }

    // 清除选择下注按钮圆圈
    ClearBetButtonYuan() {
        let betButton = cc.find("Canvas/roomScens/dzpk_betButton")
        let check = betButton.getChildByName("dzpk_check").getChildByName("dzpk_yuan2")
        let call = betButton.getChildByName("dzpk_call").getChildByName("dzpk_yuan2")
        let rang = betButton.getChildByName("dzpk_rang").getChildByName("dzpk_yuan2")
        let callAll = betButton.getChildByName("dzpk_callAll").getChildByName("dzpk_yuan2")
        check.active = false
        call.active = false
        rang.active = false
        callAll.active = false
    }
    
    // 关闭盲注按钮
    CloseBlindButton() {
        this.blind_3.active = false
        this.blind_3back.active = false
        this.blind_4.active = false
        this.blind_4back.active = false
        this.blind_1.active = false
        this.blind_1back.active = false
        this.blind_13.active = false
        this.blind_13back.active = false
        this.blind_23.active = false
        this.blind_23back.active = false
    }

    // 关闭行动按钮
    CloseActionButton() {
        this.act_check.active = false
        this.act_rang.active = false
        this.act_call.active = false
        this.act_ALLIN.active = false
        this.act_addBet.active = false
        this.act_addBetBack.active = false
        this.act_ALLIN_2.active = false
    }

    onDestroy() {
        console.log("gameSences 场景销毁！！！")
        // 清除定时器
        this.timer = null;
        this.intervalTime = null;
        clearInterval(this.ticker);
        this.ticker = null;
        // 取消监听事件
        this.cancelEvents()
    }

    cancelEvents() {
        console.log("dzpk_Game 取消监听事件~")
        events.unregister(EventKind.S2C_JoinRoom, "dzpk_Game");
        events.unregister(EventKind.S2C_NoticeJoin, "dzpk_Game");
        events.unregister(EventKind.S2C_LeaveRoom, "dzpk_Game");
        events.unregister(EventKind.S2C_NoticeLeave, "dzpk_Game");
        events.unregister(EventKind.S2C_SitDown, "dzpk_Game");
        events.unregister(EventKind.S2C_StandUp, "dzpk_Game");
        events.unregister(EventKind.S2C_CreatBanker, "dzpk_Game");
        events.unregister(EventKind.S2C_PlayerAction, "dzpk_Game");
        events.unregister(EventKind.S2C_PlayerActionChange, "dzpk_Game");
        events.unregister(EventKind.S2C_AddChips, "dzpk_Game");
        events.unregister(EventKind.S2C_GameStepChange, "dzpk_Game");
        events.unregister(EventKind.S2C_ResultGameData, "dzpk_Game");
        events.unregister(EventKind.S2C_ReadyTime, "dzpk_Game");
        events.unregister(EventKind.S2C_SettleTime, "dzpk_Game");
        events.unregister(EventKind.S2C_PushCardTime, "dzpk_Game");
        events.unregister(EventKind.S2C_EmojiChat, "dzpk_Game");
        events.unregister(EventKind.S2C_PiPeiPlayer, "dzpk_Game");
        events.unregister(EventKind.S2C_PiPeiData, "dzpk_Game");
        events.unregister(EventKind.S2C_SendActTimer, "dzpk_Game");
        events.unregister(EventKind.S2C_SendRoomData, "dzpk_Game");
    }
}
