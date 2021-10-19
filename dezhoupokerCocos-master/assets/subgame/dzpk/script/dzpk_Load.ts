import { initWebSocket, initio } from "./network/receive";
import { events, EventKind } from "./conf/event";
import { msg } from "./proto/proto_dzpk_msg";
import Storage from "./dzpk_Storage";
import Sound from "./dzpk_Sound";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)  // 加载动画
    jiazai: cc.Node = null;


    onLoad () {
        this.jiazai.active = true
        this.jiazai.getComponent(sp.Skeleton).setAnimation(1, "animation", true)

        initWebSocket()
        // 注册事件
        this.RegisterEvent()
    }

    start () {

    }

    private RegisterEvent() {
        events.register(EventKind.S2C_Login, "dzpk_Load", this.Login.bind(this));
        events.register(EventKind.S2C_EnterRoom, "dzpk_Load", this.EnterRoom.bind(this));
    }

    private Login(data: msg.ILogin_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetUserInfo(data.playerInfo); 

        console.log("玩家登录成功:",data.playerInfo)
        if (data.backroom == false) {
            cc.director.preloadScene("dzpk_roomList", function () {
                console.log("dzpk_roomList界面 预加载完成");
                cc.director.loadScene("dzpk_roomList");
            });
        }
    }

    private EnterRoom(data: msg.IEnterRoom_S2C) {
        if (data == null) {
            return;
        }
        Storage.SetRoomData(data.roomData);

        console.log("玩家返回当前房间:",data)
        cc.director.preloadScene("dzpk_gameScens", function () {
            console.log("dzpk_gameScens界面 预加载完成");
            cc.director.loadScene("dzpk_gameScens");
        });
    }

    cancelEvents() {
        console.log("dzpk_Load 取消监听事件~")
        events.unregister(EventKind.S2C_Login, "dzpk_Load");
        events.unregister(EventKind.S2C_EnterRoom, "dzpk_Load");
    }

    onDestroy() {
        // 取消监听事件
        this.cancelEvents()
    }
}
