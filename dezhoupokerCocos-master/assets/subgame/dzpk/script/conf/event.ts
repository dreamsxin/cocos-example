/*
 * @Descripttion: gamelogic
 * @Author: Palos
 * @Date: 2019-09-05 14:38:56
 * @LastEditors: Palos
 * @LastEditTime: 2019-12-02 10:09:12
 */
const { ccclass } = cc._decorator;

type IBindFunc = (data: any) => void;

@ccclass
class EventManage {
    private static _instance: EventManage;
    private _mapHandler: Map<EventKind, Map<string, IBindFunc>>;

    constructor() {
        this._mapHandler = new Map();
    }
    public static getInstance(): EventManage {
        this._instance || (this._instance = new EventManage());
        return this._instance;
    }
    /**
     * 注册监听事件
     * @param kind 事件类型
     * @param className 响应函数所属类名
     * @param func 响应函数
     */
    public register(kind: EventKind, className: string, func: IBindFunc): void {
        const funcs = this._mapHandler.get(kind) || (new Map());
        if (funcs.has(className)) {
            return
        }
        funcs.set(className, func);
        this._mapHandler.set(kind, funcs);
    }

    /**
     * 取消监听事件
     * @param kind 事件类型
     * @param className 响应函数所属类名
     */
    public unregister(kind: EventKind, className: string): void {
        if (!this._mapHandler.has(kind)) {
            return
        }
        const funcs = this._mapHandler.get(kind);
        funcs.has(className) && funcs.delete(className);
        this._mapHandler.set(kind, funcs);
    }

    /**
     * 派发事件
     * @param kind 事件类型
     * @param data 传递的数据
     */
    public dispatch(kind: EventKind, data?: any): void {
        if (!this._mapHandler.has(kind)) {
            return
        }
        const funcs = this._mapHandler.get(kind);
        funcs.forEach((value: IBindFunc) => {
            value(data);
        })
    }
}

export const enum EventKind {
    // 客户端
    C2S_Login,
    C2S_Logout,
    C2S_QuickStart,
    C2S_ChangeTable,
    C2S_LeaveRoom,
    C2S_SitDown,
    C2S_StandUp,
    C2S_PlayerAction,
    C2S_AddChips,
    C2S_RoomStatus,
    C2S_EmojiChat,
    C2S_WaitPlayerList,
    C2S_ShowRoomInfo,

    // 服务器
    S2C_Error,
    S2C_Login,
    S2C_Logout,
    S2C_JoinRoom,
    S2C_EnterRoom,
    S2C_NoticeJoin,
    S2C_LeaveRoom,
    S2C_NoticeLeave,
    S2C_SitDown,
    S2C_StandUp,
    S2C_CreatBanker,
    S2C_PlayerAction,
    S2C_PlayerActionChange,
    S2C_AddChips,
    S2C_GameStepChange,
    S2C_ResultGameData,
    S2C_ReadyTime,
    S2C_SettleTime,
    S2C_PushCardTime,
    S2C_RoomStatus,
    S2C_EmojiChat,
    S2C_PiPeiPlayer,
    S2C_PiPeiData,
    S2C_SendActTimer,
    S2C_SendRoomData,
    S2C_WaitPlayerList,
    S2C_ShowRoomInfo,

    // 网络连接状态
    Event_onopen,
    Event_onerror,
    Event_onclose,
    Event_timeOut
}

export const events = EventManage.getInstance();
