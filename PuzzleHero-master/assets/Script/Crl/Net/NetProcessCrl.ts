import NetCmd from "./NetCmd";
import StaticData from "../../StaticData";
import ClientWebSocket from "../../Lib/NET/ClientWebSocket";
import GameData from "../../GameData";
import WXApi from "../../Lib/WXApi";
import Utility from "../../Lib/Utility";

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
export default class NetProecssCrl {

    isMaster: boolean = false

    serialNo: number = 0

    status: number = 0

    public static Share: NetProecssCrl = null

    signStr: string


    // LIFE-CYCLE CALLBACKS:


    constructor() {
        NetProecssCrl.Share = this
        ClientWebSocket.Close()
    }
    //6368623d0ec0d37d5070b1e7f26790644186590c
    doConnect(sign: string = WXApi.sign, roomId?: string): Promise<any> {
        this.signStr = sign
        this.isMaster = false
        let url: string = "/fangkuaiWxSocket/quickBattle"
        let param: any = JSON.stringify({ sign: this.signStr, opType: 0 })

        if (roomId != null && roomId != undefined) {
            url = "/fangkuaiWxSocket/friendBattle"
            param = JSON.stringify({ sign: this.signStr, roomId: roomId, opType: 0 })
        }

        return new Promise((resolve, reject) => {
            ClientWebSocket.Connect(GameData.Share.UrlConfig.wsserver + url, async (num) => {
                console.log('connect sign:', param)
                ClientWebSocket.SendMsg(param)
                resolve()
            }, () => {
                cc.log("connecting err")
            })
        })
    }

    doClose() {
        this.isMaster = false
        this.status = 0
        ClientWebSocket.Close()


    }

    doSendSycnInfo(infodata: any, dt?: number) {
        if (dt != null) {
            setTimeout(() => {
                ClientWebSocket.SendMsg(JSON.stringify({ data: infodata, opType: 1 }))
            }, dt)
        } else {
            ClientWebSocket.SendMsg(JSON.stringify({ data: infodata, opType: 1 }))
        }
    }

    handleSyncSeedAround() {
        return new Promise((resolve, reject) => {
            let seed = new Date().getTime()
            let around = Utility.GetRandom(0, 1)

            let intvnum = 0
            let senddata = { data: { cmd: NetCmd.SyncSeedAround, seed: seed, around: around }, opType: 1 }
            ClientWebSocket.ReceiveMsg((data) => {
                if (data.data != null && data.data.cmd == NetCmd.SyncSeedAround) {
                    resolve(data.data)
                    ClientWebSocket.ReleseReceive()
                    if (!NetProecssCrl.Share.isMaster) {
                        let send = { data: { cmd: NetCmd.SyncSalveSeedDone }, opType: 1 }
                        ClientWebSocket.SendMsg(JSON.stringify(send))
                    }
                    return
                }
                //master wait from slave
                if (data.data != null && data.data.cmd == NetCmd.SyncSalveSeedDone) {
                    ClientWebSocket.ReleseReceive()
                    clearInterval(intvnum)
                    resolve({ seed: seed, around: around == 0 ? 1 : 0 })
                    return
                }
            })
            if (this.isMaster) {
                intvnum = setInterval(() => {
                    cc.log("check slave to ready")
                    ClientWebSocket.SendMsg(JSON.stringify(senddata))
                }, 1000)
                // return
            }
        })
    }

    handleSyncUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => {
            let srcheros = StaticData.PlayerInfo.heros.filter(h => h.use).sort((h1, h2) => h1.type - h2.type)

            srcheros = JSON.parse(JSON.stringify(srcheros))
            srcheros.forEach(h => {
                delete h.curCards
                delete h.has
                delete h.ds
                delete h.nextCards
                delete h.nextCoin
                delete h.ulockC
                delete h.use
                delete h.d1
                delete h.d2
            })

            let pinfo: any = StaticData.PlayerInfo
            ClientWebSocket.ReceiveMsg((data) => {
                let sendinfo = {
                    cmd: NetCmd.SyncUserInfo,
                    sign: this.signStr,
                    heros: srcheros,
                    nickname: pinfo.nickname,
                    face: pinfo.face,
                    hp: StaticData.PlayerInfo.hp,
                    arenaData: pinfo.arenaData
                }
                if (data.data == null && data.state == 1) {
                    cc.log("client join and  master do it")
                    this.doSendSycnInfo(sendinfo, 0.5)
                    this.isMaster = true
                }
                if (data.data != null && data.data.cmd == NetCmd.SyncUserInfo) {

                    if (this.status == 0) {
                        this.doSendSycnInfo(sendinfo, 0.5)
                    }
                    this.status = 1
                    resolve(data.data)
                    ClientWebSocket.ReleseReceive()
                }
            })
        })
    }

    handleSyncGameData(fun: Function) {
        ClientWebSocket.ReceiveMsg((data) => {
            fun(data)
        })
    }

    handleOnClose(fun: Function) {
        ClientWebSocket.share.onClose = fun
    }




    // update (dt) {}
}
