import NetProecssCrl from "../Crl/Net/NetProcessCrl";
import WXApi from "../Lib/WXApi";
import Utility from "../Lib/Utility";
import StaticData from "../StaticData";
import NetCmd from "../Crl/Net/NetCmd";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FriendBattleUI extends cc.Component {

    @property(cc.Sprite)
    myIcon: cc.Sprite = null
    @property(cc.Sprite)
    friendIcon: cc.Sprite = null

    @property(cc.Node)
    readyIcon1: cc.Node = null
    @property(cc.Node)
    readyIcon2: cc.Node = null

    @property(cc.Node)
    inviteBtn: cc.Node = null
    @property(cc.Node)
    readyBtn: cc.Node = null
    @property(cc.Node)
    alreadyBtn: cc.Node = null

    @property(cc.Node)
    countDown: cc.Node = null
    @property(cc.Node)
    blockNode: cc.Node = null


    iamReady: boolean = false
    friendReady: boolean = false

    userInfo: any = null
    tempRoomid: string = null

    connected: boolean = false

    // onLoad () {}

    start() {

    }

    onEnable() {
        if (CC_PREVIEW) WXApi.room_id = 'test'
        this.connected = false
        this.blockNode.active = false
        this.readyIcon1.active = false
        this.readyIcon2.active = false
        this.inviteBtn.active = !WXApi.room_id
        this.readyBtn.active = false//!this.inviteBtn.active
        this.alreadyBtn.active = false
        this.tempRoomid = null
        this.friendIcon.spriteFrame = null

        Utility.LoadImgAyns(StaticData.PlayerInfo.face, this.myIcon)
        if (WXApi.room_id) {
            //被邀请者  直接开始匹配
            this.tempRoomid = WXApi.room_id
            this.checkFriendGame()
            WXApi.room_id = null
        }
    }

    async checkFriendGame() {
        //好友对战开始连接
        console.log('start checkFriendGame')
        StaticData.tempRoomid = this.tempRoomid ? this.tempRoomid : WXApi.sign
        await NetProecssCrl.Share.doConnect(WXApi.sign, this.tempRoomid ? this.tempRoomid : WXApi.sign)
        this.userInfo = await NetProecssCrl.Share.handleSyncUserInfo()

        console.log('end checkFriendGame:', this.userInfo)
        //匹配成功
        let icon: string = this.userInfo.face
        Utility.LoadImgAyns(icon, this.friendIcon)
        this.inviteBtn.active = false
        this.readyBtn.active = true
        this.connected = true

        //监听网络回调
        NetProecssCrl.Share.handleSyncGameData((data) => {
            console.log('getgamedata:', data)
            //好友准备信息
            if (data.data != null && data.data.cmd == NetCmd.SyncUserReady) {
                this.friendReady = data.data.isReady
            }
            //好友已退出房间
            if (data.data != null && data.data.cmd == NetCmd.SyncExitShareGame) {
                if (data.data.exit) {
                    WXApi.tipsDialog('好友已退出房间')
                    this.closeCB()
                }
            }
        })
    }

    readyGame() {
        if (!this.connected) return
        this.iamReady = true
        this.inviteBtn.active = false
        this.readyBtn.active = false
        this.alreadyBtn.active = true
        NetProecssCrl.Share.doSendSycnInfo({ isReady: true, cmd: NetCmd.SyncUserReady })
    }

    shareBattleCB() {
        WXApi.OpenShare("向你发出挑战邀请,你敢接受吗?", { room_id: WXApi.sign }, "https://gamecdn.xunyi.online/mengwu/fangkuaiBattle/share0814/share4.png", "", () => {
            console.log("share call back")
        })
        //等待用户关闭分享界面回来调用
        this.scheduleOnce(() => {

            //分享后 开始匹配好友
            this.checkFriendGame()
        }, 2)
    }

    //断开连接
    doCloseNet() {
        NetProecssCrl.Share.doClose()
    }

    //取消准备
    cancelReady() {
        this.iamReady = false
        this.readyBtn.active = true
        this.alreadyBtn.active = false
        NetProecssCrl.Share.doSendSycnInfo({ isReady: false, cmd: NetCmd.SyncUserReady })
    }

    //关闭界面
    closeCB() {
        NetProecssCrl.Share.doSendSycnInfo({ isReady: false, cmd: NetCmd.SyncUserReady })
        NetProecssCrl.Share.doSendSycnInfo({ exit: true, cmd: NetCmd.SyncExitShareGame })
        this.doCloseNet()
        this.iamReady = false
        this.friendReady = false
        this.friendIcon.spriteFrame = null
        this.node.active = false
    }

    update(dt) {
        this.readyIcon1.active = this.iamReady
        this.readyIcon2.active = this.friendReady

        if (this.iamReady && this.friendReady) {
            this.iamReady = false
            this.friendReady = false
            this.countDown.getChildByName('New Label').active = true
            this.countDown.getComponent(cc.Animation).play()
            this.blockNode.active = true
            this.scheduleOnce(() => {
                this.countDown.getChildByName('New Label').active = false
                StaticData.startFromShareGame = true
                this.userInfo.heros.forEach(h => {
                    h.atk = 3
                });
                this.userInfo.hp = 90
                GameMenuUI.Share.enterGame(this.userInfo)
            }, 3)
        }
    }
}
