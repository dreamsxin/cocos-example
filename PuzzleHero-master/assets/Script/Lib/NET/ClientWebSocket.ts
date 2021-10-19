// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClientWebSocket {


    public static share: ClientWebSocket = null

    wsocket: WebSocket = null

    isConnect: boolean = false

    onClose: Function = null

    public static isConnect() {
        if (ClientWebSocket.share != null && ClientWebSocket.share.isConnect == true) {
            return true
        } else {
            //cc.log("socket close")
            return false
        }
    }

    public static Close() {
        if (this.isConnect) {
            try {
                ClientWebSocket.share.onClose =null
                ClientWebSocket.share.wsocket.onmessage = null
                ClientWebSocket.share.isConnect = false
                ClientWebSocket.share.wsocket.close()
            } catch (error) {

            }

        }
    }

    public static Connect(url: string, cb: (st: number) => void, onclose: () => void = null) {
        if (ClientWebSocket.share == null) {
            ClientWebSocket.share = new ClientWebSocket()
        }
        ClientWebSocket.share.wsocket = new WebSocket(url)
        ClientWebSocket.share.wsocket.onopen = (data) => {
            ClientWebSocket.share.isConnect = true
            console.log("链接成功")
            cb(1)
        }
        ClientWebSocket.share.wsocket.onclose = (data) => {
            console.log("链接断开")
            if (onclose != null) {
                onclose()
                onclose = null
                cb = null
            }
            if (ClientWebSocket.share.onClose != null) {
                ClientWebSocket.share.onClose()
                ClientWebSocket.share.onClose = null
            }
            ClientWebSocket.share = null
        }
    }

    public static SendMsg(data: string) {
        if (ClientWebSocket.isConnect()) {
            ClientWebSocket.share.wsocket.send(data)
        }
    }

    public static ReceiveMsg(fun: Function) {
        if (ClientWebSocket.isConnect()) {
            ClientWebSocket.share.wsocket.onmessage = null
            ClientWebSocket.share.wsocket.onmessage = (data) => {
                fun(JSON.parse(data.data))
            }
        }
    }

    public static ReleseReceive() {
        ClientWebSocket.share.wsocket.onmessage = null
    }

    // update (dt) {}
}
