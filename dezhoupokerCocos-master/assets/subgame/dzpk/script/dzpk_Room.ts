import { initWebSocket, initio } from "./network/receive";
import { events, EventKind } from "./conf/event";
import { msg } from "./proto/proto_dzpk_msg";
import Storage from "./dzpk_Storage";
import Sound from "./dzpk_Sound";
import gHandler = require("../../../base/common/gHandler")

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.Label, tooltip: "昵称" })
    NickName: cc.Label = null;
    @property({ type: cc.Label, tooltip: "金币" })
    Money: cc.Label = null;
    @property({ type: cc.Label, tooltip: "版本" })
    Version: cc.Label = null;

    timer: number = 0; // 操作时长
    intervalTime: number = 16; // 间隔时间0.05秒
    ticker: any = null; // 定时器

    private joinTime: number = 0;          // 加入房间间隔时间
    private IsPiPei: boolean = null;          // 加入房间间隔时间


    onLoad() {
        // initWebSocket()
        
        Storage.GameHuaMian = 1;

        // 注册事件
        this.RegisterEvent()
        // 渲染玩家信息
        this.ShowPlayerInfo()
        // 判断玩家是否站起超时退出,弹出提示框
        this.TimeOutExitRoom() 
        // 判断大厅音效是否关闭
        this.JudgeHallAdudio()
        // 播放音乐
        Sound.PlayBackMusic()
        // 设置界面大小
        this.resize()
        // 处理平台显示按钮
        this.HandleShowButton()

        let pn = cc.find('Canvas/roombg/plaza_bg/Internet')
        gHandler.eventMgr.dispatch(gHandler.eventMgr.showNetStateNode, { parent: pn, position: { x: 0, y: 0 } })

        // 渲染版本号
        this.Version.getComponent(cc.Label).string = "0.88"
    }

    private RegisterEvent() {
        events.register(EventKind.S2C_Login, "dzpk_Room", this.Login.bind(this));
        events.register(EventKind.S2C_JoinRoom, "dzpk_Room", this.JoinRoom.bind(this));
        events.register(EventKind.S2C_EnterRoom, "dzpk_Room", this.EnterRoom.bind(this));
        events.register(EventKind.S2C_ResultGameData, "dzpk_Room", this.ResultGameData.bind(this));
        events.register(EventKind.S2C_LeaveRoom, "dzpk_Room", this.LeaveRoom.bind(this));
        events.register(EventKind.S2C_Logout, "dzpk_Room", this.Logout.bind(this));
        events.register(EventKind.S2C_RoomStatus, "dzpk_Room", this.RoomStatus.bind(this));
        events.register(EventKind.S2C_WaitPlayerList, "dzpk_Room", this.WaitPlayerList.bind(this));
        gHandler.eventMgr.register(gHandler.eventMgr.refreshBgState, "dzpk_Room", this.bgstatechange.bind(this)); // 进入时注册监听
        gHandler.eventMgr.register(gHandler.eventMgr.refreshPlayerinfo, "dzpk_Room", this.setPlayerInfo.bind(this));
    }

    // 玩家登录
    private Login(data: msg.ILogin_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetUserInfo(data.playerInfo); 

        console.log("玩家登录成功:", data.playerInfo)

        // 渲染玩家信息
        this.ShowPlayerInfo()
    }

    // 进入房间
    private JoinRoom(data: msg.IJoinRoom_S2C){
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData);

        if (Storage.UserInfo.Id == Storage.PlayerData.playerInfo.Id) {
            console.log("进入房间成功:", data)

            // 停止播放背景音乐
            cc.audioEngine.stopMusic();
    
            cc.director.preloadScene("dzpk_gameScens", function () {
                console.log("dzpk_gameScens界面 预加载完成");
                cc.director.loadScene("dzpk_gameScens");
            });
        }
    }

    // 重连进入
    private EnterRoom(data: msg.IEnterRoom_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData);

        // 停止播放背景音乐
        cc.audioEngine.stopMusic();

        console.log("玩家返回当前房间:",data)
        cc.director.preloadScene("dzpk_gameScens", function () {
            console.log("dzpk_gameScens界面 预加载完成");
            cc.director.loadScene("dzpk_gameScens");
        });
    }

    private ResultGameData(data: msg.IResultGameData_S2C) {
        if (data == null) {
            return;
        }

        if  (Storage.GameHuaMian == 1) {
            for (let i = 0; i < data.roomData.playerData.length; i++) {
                if (data.roomData.playerData[i] != null && data.roomData.playerData[i].playerInfo.Id == Storage.UserInfo.Id) {
                    Storage.SetRoomData(data.roomData);
                    let money = cc.find("Canvas/roombg/plaza_bg/sp_num_bg/MoneyLable")
                    money.getComponent(cc.Label).string = Storage.ShowMoney(Storage.PlayerData.account)
                }
            }
        }
    }   

    private LeaveRoom(data: msg.ILeaveRoom_S2C) {
        if (data == null) {
            return;
        }

        if  (Storage.GameHuaMian == 1) {
            if (data.playerData.playerInfo.Id == Storage.UserInfo.Id){
                Storage.StandUpNum = data.playerData.standUPNum
                Storage.IsNotMoney = data.playerData.IsLeaveR
                Storage.SetUserInfo(data.playerData.playerInfo)
                Storage.SetPlayerData(data.playerData)
                let money = cc.find("Canvas/roombg/plaza_bg/sp_num_bg/MoneyLable")
                money.getComponent(cc.Label).string = Storage.ShowMoney(Storage.UserInfo.account)
            }
        }
    }
    
    // 退出大厅
    private Logout(data: msg.ILogout_S2C) {
        cc.director.loadScene("hall");
        initio();
    }
    
    private RoomStatus(data: msg.IRoomStatus_S2C) {
        if (data == null) {
            return;
        }
        console.log("玩家返回状态:", Storage.UserInfo.Id, data.RoomIdNow)
        if (data.RoomIdNow == "-1") {
            let num: number = Number(Storage.ConfigId)
            if (Storage.UserInfo.account < Storage.RoomLimit[num]) {
                let LimitMoney = cc.find("Canvas/roombg/toolTip/LimitMoney")
                LimitMoney.active = true
                return;
            }
            let cancelClick = cc.find("Canvas/roombg/cancelClick")
            cancelClick.active = true
            let pipeiTip = cc.find("Canvas/roombg/toolTip/pipeiTip")
            pipeiTip.active = true
            let pipeiTipTime =  pipeiTip.getChildByName("timer")
            pipeiTipTime.getComponent(cc.Label).string = "00:00"
            let backButton = cc.find("Canvas/roombg/backButton")
            backButton.active = true
            this.IsPiPei = true

            let data : msg.IWaitPlayerList_C2S = {
                WaitStatus: 1,
                cfgId: Storage.ConfigId,
            }
            events.dispatch(EventKind.C2S_WaitPlayerList, data);

            clearInterval(this.ticker);
            this.timer = 4;
            this.intervalTime = 16;
            this.ticker = null;
            this.ticker = setInterval(() => {
                if (this.timer > 0) {
                    this.timer -= 0.016
                    if (this.timer <= 0) {
                        this.timer = 0
                        if (this.IsPiPei == true) {
                            let data : msg.IQuickStart_C2S = {
                                cfgId: Storage.ConfigId
                            }
                            events.dispatch(EventKind.C2S_QuickStart, data);
                            setTimeout(() => {
                                pipeiTip.active = false
                                // cancelClick.active = false
                                backButton.active = false
                            }, 500);
                        }
                        return;
                    }else if (this.timer >= 2 && this.timer <= 3) {
                        pipeiTipTime.getComponent(cc.Label).string = "00:01"
                    }else if (this.timer >= 1 && this.timer <= 2) {
                        pipeiTipTime.getComponent(cc.Label).string = "00:02"
                    }else if (this.timer <= 1) {
                        pipeiTipTime.getComponent(cc.Label).string = "00:03"
                    }
                }
            }, this.intervalTime);
        }else { // 玩家当前存在其他房间
            if (data.cfgId == data.RoomIdNow) { // 玩家返回当前房间
                let Quick : msg.IQuickStart_C2S = { // 接口
                    cfgId: data.RoomIdNow
                }
                events.dispatch(EventKind.C2S_QuickStart, Quick);
            }else { // 玩家进入其他房间，提示
                let againJoin = cc.find("Canvas/roombg/toolTip/againJoin")
                againJoin.active = true
                let fontString: string = ""
                if (data.RoomIdNow == "0") {
                    fontString = "您正在德州扑克体验场游戏中，点确定继续游戏"
                }else if (data.RoomIdNow == "1") {
                    fontString = "您正在德州扑克初级场游戏中，点确定继续游戏"
                }else if (data.RoomIdNow == "2") {
                    fontString = "您正在德州扑克中级场游戏中，点确定继续游戏"
                }else if (data.RoomIdNow == "3") {
                    fontString = "您正在德州扑克高级场游戏中，点确定继续游戏"
                }
                againJoin.getChildByName("font").getComponent(cc.Label).string = fontString
            }
        }
    }

    private WaitPlayerList(data: msg.IWaitPlayerList_S2C) {
        if (data == null) {
            return;
        }
        let pipeiTip = cc.find("Canvas/roombg/toolTip/pipeiTip")
        let cancelClick = cc.find("Canvas/roombg/cancelClick")
        let backButton = cc.find("Canvas/roombg/backButton")
        pipeiTip.active = false
        cancelClick.active = false
        this.IsPiPei = false
        backButton.active = false
        clearInterval(this.ticker);
    }

    // 进入房间点击事件
    onclick(eve, num: number) {
        // 点击声音
        Sound.PlayAudio(Sound.LoadAudio(13,"0"))
        
        if (this.joinTime != 0) {return;}
        this.joinTime = 4;
        
        Storage.ConfigId = num + ""

        let data : msg.IRoomStatus_C2S = {
            cfgId: num + ""
        }
        events.dispatch(EventKind.C2S_RoomStatus, data);
    }

    // 设置界面大小
    resize() {
        //保存原始设计分辨率，供屏幕大小变化时使用
        var s = cc.view.getVisibleSize()
        // let plaza_bg: cc.Node = cc.find('Canvas/roombg/plaza_bg')
        // plaza_bg.setScale(s.width / 1334);
        let sp_trumpet_bg: cc.Node = cc.find('Canvas/roombg/sp_trumpet_bg')
        sp_trumpet_bg.setScale(s.width / 1334,s.height / 750);
        let dzpk_level: cc.Node = cc.find('Canvas/roombg/dzpk_level')
        dzpk_level.setScale(s.width / 1334, s.height / 650); //
        let baseNode = cc.director.getScene().getChildByName("Canvas")
        baseNode.setPosition(cc.winSize.width/2,cc.winSize.height/2);
    }

    // 处理平台显示按钮
    HandleShowButton() {
        if (gHandler.isOtherGame) {
            let back = cc.find("Canvas/roombg/plaza_bg/return_button")
            back.active = false
            let info = cc.find("Canvas/roombg/plaza_bg/namebg/changeInfo")
            info.active = false
            let recharge = cc.find("Canvas/roombg/plaza_bg/sp_num_bg/chongzhi")
            recharge.active = false
        }
    }

    // 返回大厅点击事件
    LeaveHallClick(eve,num: number) {
        if (num == 0) {
            let data : msg.ILogout_C2S = {
            }
            events.dispatch(EventKind.C2S_Logout, data);
        }
    }

    // 修改玩家信息和重置事件
    PlayerInfoClick(eve,num: number) {
        if (num == 0) { // 修改玩家信息
            gHandler.eventMgr.dispatch(gHandler.eventMgr.showPerson, null) // 显示个人设置界面
        }else if (num == 1) { // 充值金额
            gHandler.eventMgr.dispatch(gHandler.eventMgr.showPayScene, "dzpk_load") // 跳转充提场景
            events.dispatch(EventKind.C2S_Logout, {});
            initio();
        }
    }

    // bool true 打开 false 关闭   背景音乐的开关状态
    bgstatechange(bool) { 
        // todo 对自己的音乐资源进行操作
        if (bool == true) {
            // 播放音乐
            Sound.PlayBackMusic()
            // 全局控制音效
            Sound.IsOpenMusic = true;
            gHandler.audioMgr.playBg() // 播放大厅音乐
        }
        if (bool == false) {
            // 停止播放背景音乐
            cc.audioEngine.stopMusic();
            // 全局控制音效
            Sound.IsOpenMusic = false;
            gHandler.audioMgr.stopBg() // 终止大厅正在播放的音乐
        }
    }

    // 修改玩家信息接口处理
    setPlayerInfo(msg) {
        if (msg) { // 如果msg存在信息
            if (Storage.UserInfo != null) {
                if (msg.id != Storage.UserInfo.Id) {
                    events.dispatch(EventKind.C2S_Logout, {});
                    initio();
                    initWebSocket();
                }
            }
        }
    }

    // 重新进入点击事件
    againJionClick(eve,num: number) {
        let againJoin = cc.find("Canvas/roombg/toolTip/againJoin")
        if (num == 0) {
            againJoin.active = false
        }else if (num == 1) {
            let data : msg.IQuickStart_C2S = { // 接口
                cfgId: Storage.ConfigId
            }
            events.dispatch(EventKind.C2S_QuickStart, data);
            againJoin.active = false
        }
    }

    // 限制金额提示框事件
    LimitMoneyClick(eve,num: number) {
        let LimitMoney = cc.find("Canvas/roombg/toolTip/LimitMoney")
        if (num == 0) { // 关闭
            LimitMoney.active = false
        }else if (num == 1) {  // 确认
            LimitMoney.active = false
        }
    }

    PiPeiRoomClick(eve,num: number) {
        let pipeiTip = cc.find("Canvas/roombg/toolTip/pipeiTip")
        let cancelClick = cc.find("Canvas/roombg/cancelClick")
        let backButton = cc.find("Canvas/roombg/backButton")
        if (num == 0) { // 关闭
            pipeiTip.active = false
            cancelClick.active = false
            this.IsPiPei = false
            backButton.active = false
            let data : msg.IWaitPlayerList_C2S = {
                WaitStatus: 2,
            }
            events.dispatch(EventKind.C2S_WaitPlayerList, data);
        }else if (num == 1) {  // 确认
            pipeiTip.active = false
            cancelClick.active = false
            this.IsPiPei = false
            backButton.active = false
            let data : msg.IWaitPlayerList_C2S = {
                WaitStatus: 2,
            }
            events.dispatch(EventKind.C2S_WaitPlayerList, data);
        }
        clearInterval(this.ticker);
    }

    // 超时退出房间,弹出提示框
    TimeOutExitRoom() {
        if (Storage.StandUpNum >= 6) {
            let standupOutTip = cc.find("Canvas/roombg/toolTip/standupOutTip")
            standupOutTip.active = true
        }
        if (Storage.IsNotMoney == true) {
            let notMoney = cc.find("Canvas/roombg/toolTip/notMoney")
            notMoney.active = true
        }
    }

    // 判断大厅的音效是否关闭
    JudgeHallAdudio() {
        let bool  = gHandler.audioMgr.getBgState()
        // todo 对自己的音乐资源进行操作
        if (bool == true) {
            // 全局控制音效
            Sound.IsOpenMusic = true;
        }
        if (bool == false) {
            // 全局控制音效
            Sound.IsOpenMusic = false;
        }
    }

    // 超时退出点击事件
    timeOutClick(eve,num: number){
        let standupOutTip = cc.find("Canvas/roombg/toolTip/standupOutTip")
        if (num == 1) {
            standupOutTip.active = false
        }else if (num == 2) {
            standupOutTip.active = false
        }
    }

    notMoneyClick(eve,num: number) {
        let notMoney = cc.find("Canvas/roombg/toolTip/notMoney")
        if (num == 1) {
            notMoney.active = false
        }else if (num == 2) {
            notMoney.active = false
        }
    }

    cancelClick(eve,num: number) {
        if (num == 1) {
            console.log("进来了 1111")
        }
    }
    
    // 渲染玩家信息(用于用户离开房间,渲染房间列表信息)
    ShowPlayerInfo(){
        this.NickName.string = Storage.UserInfo.nickName
        this.Money.string = Storage.ShowMoney(Storage.UserInfo.account)
    }

    cancelEvents() {
        console.log("dzpk_Room 取消监听事件~")
        events.unregister(EventKind.S2C_Login, "dzpk_Room");
        events.unregister(EventKind.S2C_JoinRoom, "dzpk_Room");
        events.unregister(EventKind.S2C_EnterRoom, "dzpk_Room");
        events.unregister(EventKind.S2C_ResultGameData, "dzpk_Room");
        events.unregister(EventKind.S2C_LeaveRoom, "dzpk_Room");
        events.unregister(EventKind.S2C_Logout, "dzpk_Room");
        events.unregister(EventKind.S2C_RoomStatus, "dzpk_Room");
        events.unregister(EventKind.S2C_WaitPlayerList, "dzpk_Room");

        gHandler.eventMgr.unregister(gHandler.eventMgr.refreshBgState, "dzpk_Room"); 
        gHandler.eventMgr.unregister(gHandler.eventMgr.refreshPlayerinfo, "dzpk_Room");
    }

    onDestroy() {
        Storage.StandUpNum = 0
        // 取消监听事件
        this.cancelEvents()
    }

    start() {

    }

    update (dt) {
        if (this.joinTime - dt >= 0) {
            this.joinTime -= dt;
        } else {
            this.joinTime = 0;
        }
    }
}
