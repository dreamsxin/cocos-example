/*
 * @Descripttion: gamelogic
 * @Author: Palos
 * @Date: 2019-09-05 14:38:56
 * @LastEditors: Palos
 * @LastEditTime: 2019-11-26 13:13:46
 */
import { ISendDelegate } from "./transmit";
import { events, EventKind } from "../conf/event";
import { msg } from "../proto/proto_dzpk_msg";

const { ccclass } = cc._decorator;

@ccclass
class Sender {
    private static _instance: Sender;
    private _delegate: ISendDelegate;

    constructor() {
        // URLSearchParams
    }

    public static getInstance(): Sender {
        this._instance || (this._instance = new Sender());
        return this._instance;
    }

    public init(dg: ISendDelegate): void {
        this._delegate = dg;
        events.register(EventKind.C2S_Login, "sendMsg", this.Login.bind(this));
        events.register(EventKind.C2S_Logout, "sendMsg", this.Logout.bind(this));
        events.register(EventKind.C2S_QuickStart, "sendMsg", this.QuickStart.bind(this));
        events.register(EventKind.C2S_ChangeTable, "sendMsg", this.ChangeTable.bind(this));
        events.register(EventKind.C2S_LeaveRoom, "sendMsg", this.LeaveRoom.bind(this));
        events.register(EventKind.C2S_SitDown, "sendMsg", this.SitDown.bind(this));
        events.register(EventKind.C2S_StandUp, "sendMsg", this.StandUp.bind(this));
        events.register(EventKind.C2S_PlayerAction, "sendMsg", this.PlayerAction.bind(this))
        events.register(EventKind.C2S_AddChips, "sendMsg", this.AddChips.bind(this))
        events.register(EventKind.C2S_RoomStatus, "sendMsg", this.RoomStatus.bind(this))
        events.register(EventKind.C2S_EmojiChat, "sendMsg", this.EmojiChat.bind(this))
        events.register(EventKind.C2S_WaitPlayerList, "sendMsg", this.WaitPlayerList.bind(this))
        events.register(EventKind.C2S_ShowRoomInfo, "sendMsg", this.ShowRoomInfo.bind(this))
    }

    // 发送登陆
    private Login(data) {
        this.send(msg.MessageID.MSG_Login_C2S, data)
    }
    // 发送登出
    private Logout(data) {
        this.send(msg.MessageID.MSG_Logout_C2S, data)
    }
    // 匹配房间
    private QuickStart(data) {
        this.send(msg.MessageID.MSG_QuickStart_C2S, data)
    }
    // 快速换桌
    private ChangeTable(data) {
        this.send(msg.MessageID.MSG_ChangeTable_C2S, data)
    }
    // 退出房间
    private LeaveRoom(data) {
        this.send(msg.MessageID.MSG_LeaveRoom_C2S, data)
    }
    // 坐下请求
    private SitDown(data) {
        this.send(msg.MessageID.MSG_SitDown_C2S, data)
    }
    // 站起请求
    private StandUp(data) {
        this.send(msg.MessageID.MSG_StandUp_C2S, data)
    }
    // 玩家行动
    private PlayerAction(data) {
        this.send(msg.MessageID.MSG_PlayerAction_C2S, data)
    }
    // 添加筹码
    private AddChips(data) {
        this.send(msg.MessageID.MSG_AddChips_C2S, data)
    }
    // 添加筹码
    private RoomStatus(data) {
        this.send(msg.MessageID.MSG_RoomStatus_C2S, data)
    }
    // 聊天表情动画
    private EmojiChat(data) {
        this.send(msg.MessageID.MSG_EmojiChat_C2S, data)
    }
    // 等待玩家列表
    private WaitPlayerList(data) {
        this.send(msg.MessageID.MSG_WaitPlayerList_C2S, data)
    }
    // 请求房间信息
    private ShowRoomInfo(data) {
        this.send(msg.MessageID.MSG_ShowRoomInfo_C2S, data)
    }
    // 发送数据
    private send(msgId: msg.MessageID, data: any) {
        console.log("发送数据:", msgId, data)
        this._delegate && this._delegate.sendMessage(msgId, data);
    }
}

export const initSender = (dg: ISendDelegate) => {
    Sender.getInstance().init(dg);
}
