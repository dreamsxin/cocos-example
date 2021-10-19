/*
 * @Descripttion: gamelogic
 * @Author: Palos
 * @Date: 2019-09-05 14:38:56
 * @LastEditors: Palos
 * @LastEditTime: 2019-12-02 10:09:01
 */
import { IReceiveDelegate } from "./transmit";
import { msg } from "../proto/proto_dzpk_msg";
import { events, EventKind } from "../conf/event";

const { ccclass } = cc._decorator;

@ccclass
class Receiver {
    private static _instance: Receiver;
    private _delegate: IReceiveDelegate;

    constructor() {

    }

    public static getInstance(): Receiver {
        this._instance || (this._instance = new Receiver());
        return this._instance;
    }

    public init(dg: IReceiveDelegate): void {
        this._delegate = dg;
        // 心跳
        this.register(msg.MessageID.MSG_Pong, this.Pong.bind(this));
        // 錯誤信息
        this.register(msg.MessageID.MSG_Error_S2C, this.Error.bind(this));
        // 登陆成功
        this.register(msg.MessageID.MSG_Login_S2C, this.Login.bind(this));
        // 登出成功
        this.register(msg.MessageID.MSG_Logout_S2C, this.Logout.bind(this));
        // 进入房间
        this.register(msg.MessageID.MSG_JoinRoom_S2C, this.JoinRoom.bind(this));
        // 重连进入
        this.register(msg.MessageID.MSG_EnterRoom_S2C, this.EnterRoom.bind(this));
        // 中途进入玩家
        this.register(msg.MessageID.MSG_NoticeJoin_S2C, this.NoticeJoin.bind(this));
        // 退出房间
        this.register(msg.MessageID.MSG_LeaveRoom_S2C,this.LeaveRoom.bind(this));
        // 玩家坐下
        this.register(msg.MessageID.MSG_SitDown_S2C,this.SitDown.bind(this));
        // 玩家站起
        this.register(msg.MessageID.MSG_StandUp_S2C,this.StandUp.bind(this));
        // 玩家行动
        this.register(msg.MessageID.MSG_PlayerAction_S2C,this.PlayerAction.bind(this));
        // 玩家行动变更
        this.register(msg.MessageID.MSG_PlayerActionChange_S2C,this.PlayerActionChange.bind(this));
        // 玩家添加筹码
        this.register(msg.MessageID.MSG_AddChips_S2C,this.AddChips.bind(this));
        // 游戏阶段变更
        this.register(msg.MessageID.MSG_GameStepChange_S2C,this.GameStepChange.bind(this));
        // 游戏结算数据
        this.register(msg.MessageID.MSG_ResultGameData_S2C,this.ResultGameData.bind(this));
        // 准备阶段时间
        this.register(msg.MessageID.MSG_ReadyTime_S2C,this.ReadyTime.bind(this));
        // 结算阶段时间
        this.register(msg.MessageID.MSG_SettleTime_S2C,this.SettleTime.bind(this));
        // 发牌阶段时间
        this.register(msg.MessageID.MSG_PushCardTime_S2C,this.PushCardTime.bind(this));
        // 房间状态
        this.register(msg.MessageID.MSG_RoomStatus_S2C,this.RoomStatus.bind(this));
        // 聊天表情动画
        this.register(msg.MessageID.MSG_EmojiChat_S2C,this.EmojiChat.bind(this));
        // 匹配玩家
        this.register(msg.MessageID.MSG_PiPeiPlayer_S2C,this.PiPeiPlayer.bind(this));
        // 匹配玩家
        this.register(msg.MessageID.MSG_PiPeiData_S2C,this.PiPeiData.bind(this));
        // 实时行动时间
        this.register(msg.MessageID.MSG_SendActTimer_S2C,this.SendActTimer.bind(this));
        // 实时房间数据
        this.register(msg.MessageID.MSG_SendRoomData_S2C,this.SendRoomData.bind(this));
        // 处理匹配列表
        this.register(msg.MessageID.MSG_WaitPlayerList_S2C,this.WaitPlayerList.bind(this));
        // 显示房间信息
        this.register(msg.MessageID.MSG_ShowRoomInfo_S2C,this.ShowRoomInfo.bind(this));
    }

    private register(kind: msg.MessageID, func: (data: any) => {}): void {
        this._delegate && this._delegate.registerCallBack(kind, func);
    }
    private Pong(data) {

    }
    private Error(data) {
        events.dispatch(EventKind.S2C_Error, data)
    }
    private Login(data: msg.ILogin_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_Login, data)
    }
    private Logout(data: msg.ILogout_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_Logout, data)
    }
    private JoinRoom(data: msg.IJoinRoom_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_JoinRoom, data)
    }
    private EnterRoom(data: msg.IEnterRoom_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_EnterRoom, data)
    }
    private NoticeJoin(data: msg.INoticeJoin_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_NoticeJoin, data)
    }
    private LeaveRoom(data: msg.ILeaveRoom_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_LeaveRoom, data)
    }
    private SitDown(data: msg.ISitDown_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_SitDown, data)
    }
    private StandUp(data: msg.IStandUp_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_StandUp, data)
    }
    private PlayerAction(data: msg.IPlayerAction_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_PlayerAction, data)
    }
    private PlayerActionChange(data: msg.IPlayerActionChange_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_PlayerActionChange, data)
    }
    private AddChips(data: msg.IAddChips_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_AddChips, data)
    }
    private GameStepChange(data: msg.IGameStepChange_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_GameStepChange, data)
    }
    private ResultGameData(data: msg.IResultGameData_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_ResultGameData, data)
    }
    private ReadyTime(data: msg.IReadyTime_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_ReadyTime, data)
    }
    private SettleTime(data: msg.ISettleTime_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_SettleTime, data)
    }
    private PushCardTime(data: msg.IPushCardTime_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_PushCardTime, data)
    }
    private RoomStatus(data: msg.IRoomStatus_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_RoomStatus, data)
    }
    private EmojiChat(data: msg.IEmojiChat_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_EmojiChat, data)
    }
    private PiPeiPlayer(data: msg.IPiPeiPlayer_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_PiPeiPlayer, data)
    }
    private PiPeiData(data: msg.IPiPeiData_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_PiPeiData, data)
    }
    private SendActTimer(data: msg.ISendActTimer_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_SendActTimer, data)
    }
    private SendRoomData(data: msg.ISendRoomData_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_SendRoomData, data)
    }
    private WaitPlayerList(data: msg.IWaitPlayerList_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_WaitPlayerList, data)
    }
    private ShowRoomInfo(data: msg.IShowRoomInfo_S2C) {
        if (data == null) {
            return;
        }
        events.dispatch(EventKind.S2C_ShowRoomInfo, data)
    }
}

export const initReceiver = (dg: IReceiveDelegate) => {
    Receiver.getInstance().init(dg);
}
