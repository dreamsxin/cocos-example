import UIMgr from "../Lib/UI/UIMgr";
import SoundMgr from "../Lib/SoundMgr";
import Logger from "../LoggerCrl";
import ClientWebSocket from "../Lib/NET/ClientWebSocket";
import WXApi from "../Lib/WXApi";
import BaseX from "../Lib/Base64";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import StaticData from "../StaticData";
import GameData from "../GameData";
import PlatformUtility from "../Lib/PlatformUtility";

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
export default class LoadingCrl extends cc.Component {

    @property(cc.ProgressBar)
    loadBar: cc.ProgressBar = null

    @property(cc.Node)
    comLoading: cc.Node = null

    @property(cc.Node)
    loginBtn: cc.Node = null

    @property(cc.Label)
    tipsStr: cc.Label = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {
    // }

    start() {
        //console.log('date format:', new Date(new Date().getTime())["Format"]('yyyy-MM-dd hh:mm:ss'))

        //WXApi.SetStorage("tur", "1")

        //PlatformUtility.CopyToClipboard('test str')

        this.tipsStr.string = GameData.Share.getRandomTips()

        this.scheduleOnce(() => {
            Logger.record(32)

            if (WXApi.channelID == 0)
                this.login()
            else {
                this.preloadGameMenu()
            }

            let delay = cc.delayTime(1)
            let fo = cc.fadeOut(0.5);
            let cb = cc.callFunc(() => {
                this.comLoading.active = false;
            })
            let sq = cc.sequence(delay, fo, cb);
            this.comLoading.getChildByName('comLogo').runAction(sq);
        }, 0.1)
    }

    preloadGameMenu() {
        cc.director.preloadScene("GameMenu", (c, ac) => {
            this.loadBar.progress = (c / ac)/*  * 0.5 */
        }, (err, asset) => { this.handleLoadGameScene(err, asset) })
    }

    handleLoadGameScene(err, asset) {
        if (err) {
            this.scheduleOnce(this.preloadGameMenu, 1)
            //this.preloadGameMenu()
            return
        }
        SoundMgr.initAll(() => {
            // if (CC_WECHATGAME) {
            //     this.login()
            // } else {
            //     cc.director.loadScene("GameMenu")
            // }

            this.loadBar.node.active = false
            this.tipsStr.node.active = false

            if (WXApi.isAndroidValid) {
                WXApi.defServer = GameData.Share.UrlConfig.server
                WXApi.Url = WXApi.defServer
                cc.log("connect to :[", WXApi.defServer, "]")
                this.showRegUI()
                return
            }

            if (WXApi.channelID == 2) {
                this.loginBtn.active = true
            } else if (WXApi.channelID == 0) {
                Logger.exportWXData('create')
                Logger.recordTS(3)
                this.checkScope()
            }
            else {
                this.login()
            }
        })

        // cc.log("loaded GameMenu ")
        // cc.director.preloadScene("GameScene", (c, ac) => {
        //     this.loadBar.progress = 0.5 + (c / ac) * 0.5
        // }, () => {

        //     cc.log("loaded GameScene ")
        //     SoundMgr.initAll(() => {
        //         // if (CC_WECHATGAME) {
        //         //     this.login()
        //         // } else {
        //         //     cc.director.loadScene("GameMenu")
        //         // }

        //         this.loadBar.node.active = false

        //         if (WXApi.isAndroidValid) {
        //             WXApi.defServer = GameData.Share.UrlConfig.server
        //             WXApi.Url = WXApi.defServer
        //             cc.log("connect to :[", WXApi.defServer, "]")
        //             this.showRegUI()
        //             return
        //         }

        //         if (WXApi.channelID == 2) {
        //             this.loginBtn.active = true
        //         } else if (WXApi.channelID == 0) {
        //             Logger.exportWXData('create')
        //             this.checkScope()
        //         }
        //         else {
        //             this.login()
        //         }
        //     })
        // })
    }

    ttLogin() {
        if (WXApi.channelID != 2) {
            return
        }
        this.login()
    }

    login() {
        WXApi.BaseShare()
        WXApi.defServer = GameData.Share.UrlConfig.server
        WXApi.Url = WXApi.defServer
        cc.log("connect to :[", WXApi.defServer, "]")
        //WXApi.Code2TokeUrl = "/puzzlehero/Login" //old
        WXApi.Code2TokeUrl = "/fangkuaiWx/login"     //new 
        WXApi.Login((st, data) => {
            if (CC_WECHATGAME) {
                WXApi.sign = data.sign //登录成功标签
                WXApi.OpenId = data.openId
                WXApi.isValid = data.isValid//是否处于审核状态
                StaticData.PlayerInfo = data
                PlayerDataCrl.UpdateHeroInfo(data)
                this.hanldeShareData(data)

                console.log('登录成功 res：', data);
                WXApi.GetLaunchParam((para) => {
                    let fromid = para.query.from_id
                    if (fromid != null && fromid != undefined && fromid != "") {
                        WXApi.HttpPost("/fangkuaiWx/shareGame", { fromSign: fromid })
                    }

                    let channel_aid = para.query.channel_aid
                    if (channel_aid != null && channel_aid != undefined && channel_aid != "") {
                        WXApi.channel_aid = channel_aid
                    }
                    let is_share = para.query.is_share
                    if (is_share != null && is_share != undefined && is_share != "") {
                        WXApi.is_share = is_share
                    }

                    console.log('para.scene:', para.scene)
                    if (para.scene == 1089) {
                        //来自  我的小程序  入口
                        StaticData.startWithFavorite = true
                    } else {
                        StaticData.startWithFavorite = false
                    }

                    if (para.query.room_id != undefined && para.query.room_id != null) {
                        WXApi.room_id = para.query.room_id
                    }
                })

                Logger.exportWXData('startup')
                Logger.getAdData('icon')
                Logger.getAdData('drawer')

                Logger.recordTS(1)
                Logger.recordTS(2)

                if (WXApi.channelID != 0)
                    this.checkScope()
                else {
                    this.preloadGameMenu()
                }
            }
            else if (PlatformUtility.IsAndroid()) {
                WXApi.sign = data.sign //登录成功标签
                WXApi.OpenId = data.openId
                WXApi.isValid = data.isValid//是否处于审核状态
                StaticData.PlayerInfo = data
                PlayerDataCrl.UpdateHeroInfo(data)
                this.hanldeShareData(data)
                console.log('登录成功 res：', data);

                cc.director.loadScene("GameMenu")
            } else {
                cc.director.loadScene("GameMenu")
            }
        })
    }
    hanldeShareData(data) {
        if (!data.share) {
            return
        }
        console.log("handle share:", data)
        let share: any[] = JSON.parse(data.share)
        share.forEach(s => {
            WXApi.ShareLabel.push(s.desc)
            WXApi.ShareImg.push(s.img)
        })
    }

    checkScope() {
        if (CC_WECHATGAME) {
            wx.getSetting({
                success: (response) => {
                    if (!response.authSetting['scope.userInfo']) {
                        //没有授权
                        console.log('没有授权');
                        this.loginBtn.active = true
                        if (WXApi.channelID == 2) {
                            this.ttAuthorize()
                        } else {
                            this.createAuthBtn()
                        }
                    } else {
                        //已经授权
                        console.log('已经授权');
                        cc.director.loadScene("GameMenu")
                    }
                }
            })
        }
    }

    ttAuthorize() {
        wx.authorize({
            scope: 'scope.userInfo',
            success: (res) => {
                tt.getUserInfo({
                    async success(info) {
                        console.log(`getUserInfo调用成功${info.userInfo}`);
                        let basex = new BaseX()
                        let udata = { name: basex.encode(info.userInfo.nickName), pic: info.userInfo.avatarUrl, gender: 0 }
                        let rs = await WXApi.HttpPost("/fangkuaiWx/updateUserMsg", udata)  //new
                        if (rs.errcode == 200) {
                            PlayerDataCrl.UpdateHeroInfo(rs)
                        }
                        Logger.updateMsg(WXApi.OpenId, StaticData.PlayerInfo.nickname, StaticData.PlayerInfo.face)
                        cc.director.loadScene("GameMenu")
                    },
                    fail(res) {
                        console.log(`getUserInfo调用失败`);
                        cc.director.loadScene("GameMenu")
                    }
                })
            },
            fail: (res) => {
                cc.director.loadScene("GameMenu")
            }
        })
    }

    createAuthBtn() {

        Logger.recordTS(4)
        WXApi.CreateAuthorizeBtn(this.loginBtn, async (info) => {
            if (CC_WECHATGAME) {
                if (info.userInfo != null && info.userInfo != undefined) {
                    Logger.recordTS(6)
                    let basex = new BaseX()
                    let udata = { name: basex.encode(info.userInfo.nickName), pic: info.userInfo.avatarUrl, gender: 0 }
                    let rs = await WXApi.HttpPost("/fangkuaiWx/updateUserMsg", udata)  //new
                    if (rs.errcode == 200) {
                        PlayerDataCrl.UpdateHeroInfo(rs)
                    }
                    Logger.updateMsg(WXApi.OpenId, StaticData.PlayerInfo.nickname, StaticData.PlayerInfo.face)
                    cc.director.loadScene("GameMenu")
                } else {
                    Logger.recordTS(7)
                    cc.director.loadScene("GameMenu")
                }
            }
        })
    }

    showRegUI() {
        cc.loader.loadRes('ui/LoginUI', (err, res) => {
            let loginUI = cc.instantiate(res)
            cc.director.getScene().addChild(loginUI)
        })
    }

}




    // update (dt) {}

