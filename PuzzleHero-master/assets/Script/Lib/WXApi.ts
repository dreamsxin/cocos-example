
const { ccclass, property } = cc._decorator;
import Utility from "./Utility"
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameData from "../GameData";
import PlatformUtility from "./PlatformUtility";
import StaticData from "../StaticData";
import Logger from "../LoggerCrl";


@ccclass
export default class WXApi {
    //////
    // public static Appid: string = "";

    // public static Secret: string = "";
    public static httpPross: boolean = false
    public static sign: string = ""; //登录成功返回的标签    post时需要的请求参数
    public static isValid: boolean = false; //是否处于审核状态
    public static version: string = "2.0.8" //当前版本

    public static isAndroidValid = false; //是否安卓审核版本 

    public static isVibrate: boolean = true;//是否开启震动

    public static channelID: number = 0; // 0:微信(默认)  1：QQ  2：头条, 3:android
    public static isTaptap: boolean = false  //taptap

    public static channel_aid: string = ''
    public static is_share: string = ''
    public static iconData: any[] = []
    public static drawerData: any[] = []

    public static room_id: any = null

    public static defServer: string = "https://dev-game.ky311.com"

    public static defWsServer: string = "wss://socket-dev.ky311.com/wss"

    public static shareUrl: string = "https://dev-game.ky311.com"

    public static Ins: WXApi

    private static js_code: string = "";

    //must be
    public static Code2TokeUrl: string = "";

    //must be
    public static UserKVUrl: string = "";

    //must be
    public static Url: string = "";

    //must be
    public static Perfix: string = "";

    public static OpenId: string = "";

    public static SubCover: cc.Node

    public static WXSubCoverView: cc.WXSubContextView

    public static CloseFriendListBtn: cc.Node

    public static BlockLayer: cc.BlockInputEvents

    public static ShareLabel: string[] = []

    public static ShareImg: string[] = []

    public static CloseFriendListFun: Function = null

    public static AdBanner: any = null

    public static VidoesAd: any = null

    private static OnShowFun: Function = null

    public static OnVidoeFun: Function = null

    public static HasVidoeCloseFun: boolean = false

    public static GbtnAuthorize: any = null

    public static GbtnGameCircle: any = null

    public static shareTimeCheck: any = -1

    public static ShareFun: Function = null

    public static initBaseShare: boolean = false

    public static QuitFun: Function

    //短视频id   WX
    public static sUnitid: any = [
        /* REFRESH_TASK:  */'adunit-9f46b8156e090046',
        /* FREE_COIN:  */'adunit-084565a281f48573',
        /* REFRESH_HERO:  */'adunit-d740d95c9247cfd4',
        /* DAILY_COIN:  */'adunit-d9ea27c2c8caa1d0',
        /* DAILY_GOLD: */ 'adunit-c48d9c504f860297',
        /* DAILY_BOX:  */'adunit-b988c209f3097489',
        /* SPEED_BOX:  */'adunit-9832303c249073a8',
        /* DAILY_SIGN:  */'adunit-e2301679c6faf229',
        /* RESULT_BOX:  */'adunit-69b27ca18b04e8b0',
        /* RESULT_UPBOX: */ 'adunit-872bb20ab16b24af',
        'adunit-e58f243ec045400f',
        'adunit-72aacd0ef2241790'
    ]
    //长视频id   WX
    public static lUnitid: any = [
        /* REFRESH_TASK: */ 'adunit-1e62be76c4842d55',
        /* FREE_COIN:  */'adunit-01c05c831cfb7ee8',
        /* REFRESH_HERO: */ 'adunit-8e51d057a2f2dce3',
        /* DAILY_COIN: */ 'adunit-3bfe8e86730acfa8',
        /* DAILY_GOLD: */ 'adunit-6dd781db5f95a728',
        /* DAILY_BOX: */ 'adunit-31acc57c633f4351',
        /* SPEED_BOX: */ 'adunit-4539204ad0663590',
        /* DAILY_SIGN: */ 'adunit-8f6312ce68a15809',
        /* RESULT_BOX:  */'adunit-2bc541bd609b5ec2',
        /* RESULT_UPBOX: */ 'adunit-0c8e35687aeac472',
        'adunit-2890dcfed45baaac',
        'adunit-e13b05c89c5314c2'
    ]

    public static BaseShare() {
        if (CC_WECHATGAME) {
            //bind wxgame share function
            if (!WXApi.initBaseShare) {
                wx.showShareMenu()
                wx.onShareAppMessage(() => {
                    return WXApi.GetShareRandom("", { is_share: 1, channel_aid: this.channel_aid }, "", "")
                })
                WXApi.initBaseShare = true
            }

        }
    }

    public static setSubCover(cover: cc.Node) {
        WXApi.SubCover = cover
        WXApi.WXSubCoverView = WXApi.SubCover.getComponent(cc.WXSubContextView)
        WXApi.CloseFriendListBtn = WXApi.SubCover.getChildByName("CloseFLBtn")

        if (WXApi.CloseFriendListBtn != null) {
            WXApi.BlockLayer = WXApi.SubCover.addComponent(cc.BlockInputEvents)
            WXApi.CloseFriendListBtn.on(cc.Node.EventType.TOUCH_START.toString(), () => {
                WXApi.CloseFriendListSmall()
                if (WXApi.CloseFriendListFun != null) {
                    WXApi.CloseFriendListFun()
                }
            })
            WXApi.CloseFriendListBtn.active = false
            WXApi.BlockLayer.enabled = false
        }
        WXApi.BaseShare()

        WXApi.SubCover.active = false
        WXApi.CloseNearRank()
        WXApi.CloseFriendListSmall()
        WXApi.CloseOverStep()
    }


    public static GetLaunchPassVar(): any {
        if (CC_WECHATGAME) {
            return wx.getLaunchOptionsSync()
        } else {
            return null
        }
    }

    //Usually get fun(obj) obj.query
    public static GetLaunchParam(fun: Function) {
        if (CC_WECHATGAME) {
            WXApi.OnShowFun = fun
            fun(WXApi.GetLaunchPassVar())
            wx.onShow((para) => {
                //check share time
                if (WXApi.shareTimeCheck != -1) {
                    let check = Date.now() - WXApi.shareTimeCheck
                    if (check > 2000) {
                        if (WXApi.ShareFun != null) {
                            WXApi.ShareFun()
                            WXApi.ShareFun = null
                            //统计任务8
                            PlayerDataCrl.updateTask(8);
                        }
                    }
                    WXApi.shareTimeCheck = -1
                    Logger.exportWXData('share')
                }
                //check onshow Fun
                if (WXApi.OnShowFun != null) {
                    WXApi.OnShowFun(para)
                }
                console.log("wx on show")
            })
        }
    }

    public static SetQuitCB(fun: Function) {
        if (CC_WECHATGAME) {
            if (WXApi.QuitFun == null) {
                WXApi.QuitFun = fun
                wx.onHide(WXApi.QuitFun)
            }
        }
    }

    public static async CallTTLogin() {
        if (WXApi.GetStorage('ttSign')) {
            WXApi.sign = WXApi.GetStorage('ttSign')
            let userInfo: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            console.log('获取已有用户信息:', userInfo);
            if (userInfo.errcode == 200) {
                console.log('login res: ', userInfo);
                return userInfo
            }
        } else {
            console.log('游客登录')
            let resp: any = await WXApi.HttpPost("/fangkuaiWx/touristLogin", { channel: 0 })
            if (resp.errcode == 200) {
                WXApi.sign = resp.sign
                WXApi.SetStorage('ttSign', WXApi.sign)

                console.log('获取用户信息')
                let userInfo: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
                if (userInfo.errcode == 200) {
                    console.log('login res: ', userInfo);
                    return userInfo
                }
            }
        }
    }

    public static CallWXLogin(): Promise<string> {
        return new Promise((resolve, err) => {
            wx.login({
                success: ((res) => {
                    WXApi.js_code = res.code
                    console.log('login success:', res);
                    resolve()
                }),
                fail: () => {
                    console.error("err login")
                    resolve()
                }
            })
        })
    }

    /** return  status,openid by function
      @param callback(status,openid,data) return funtion
      @example WXApi.Login((status,openid,data)=>{
          ...
      })
     */
    public static async Login(callback: (b: boolean, data: any) => void) {
        let st = true
        let data = {}
        if (CC_WECHATGAME) {
            if (WXApi.OpenId == "") {

                await WXApi.CallWXLogin()
                console.log("WXApi.js_code: ", WXApi.js_code)
                let launchData = wx.getLaunchOptionsSync();
                let q: any = launchData.query
                let param = {
                    code: WXApi.js_code,
                    version: this.version,
                    params: launchData.query,
                    channel: this.channelID,
                    query: { channel_aid: q.channel_aid, is_share: q.is_share }
                }
                console.log('query:', q)
                if (WXApi.js_code == '') {
                    if (WXApi.GetStorage('ttSign')) {
                        WXApi.sign = WXApi.GetStorage('ttSign')
                        let userInfo: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
                        console.log('获取已有用户信息:', userInfo);
                        if (userInfo.errcode == 200) {
                            console.log('login res: ', userInfo);
                            data = userInfo
                        }
                    } else {
                        console.log('游客登录')
                        let resp: any = await WXApi.HttpPost("/fangkuaiWx/touristLogin", { channel: 0 })
                        if (resp.errcode == 200) {
                            WXApi.sign = resp.sign
                            WXApi.SetStorage('ttSign', WXApi.sign)

                            console.log('获取用户信息')
                            let userInfo: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
                            if (userInfo.errcode == 200) {
                                console.log('login res: ', userInfo);
                                data = userInfo
                            }
                        }
                    }
                    st = true
                } else {
                    let resp: any = await WXApi.HttpPost(WXApi.Code2TokeUrl, param)
                    console.log('login res: ', resp);
                    st = true
                    data = resp
                }
            }
        }
        if (PlatformUtility.IsAndroid()) {
            console.log('isAndroid!!!!!!')
            let resp: any = await WXApi.HttpPost("/fangkuaiWx/touristLogin", { sign: PlatformUtility.GetNativeUDID(), channel: Number(PlatformUtility.GetChannleID()) })
            //let resp: any = await WXApi.HttpPost("/fangkuaiWx/touristLogin", { sign: "ffffffff-e610-48ce-0557-afb7075c2874", channel: 1 })
            data = resp
        }
        console.log('callback(st, data)')
        callback(st, data)
    }

    public static GetUserInfo() {
        if (CC_WECHATGAME) {
            WXApi.PostMsg({
                Action: "GetUserInfo"
            })
        }
    }

    public static OpenShare(_title: string = "", param: any = {}, imgpath: string = "", anyis: string = "", shareCallBack?: Function) {
        if (CC_WECHATGAME) {

            wx.shareAppMessage(WXApi.GetShareRandom(_title, param, imgpath, anyis, shareCallBack))
            if (shareCallBack != null) {
                WXApi.ShareFun = shareCallBack
            }
            WXApi.shareTimeCheck = Date.now()

        } else {
            if (shareCallBack != null) {
                shareCallBack()
                //统计任务8
                PlayerDataCrl.updateTask(8);
            }
        }
    }


    public static SetStorage(key, value) {
        if (CC_WECHATGAME) {
            wx.setStorageSync(key, value)
        } else if (CC_BUILD) {
            cc.sys.localStorage.setItem(key, value)
        } else if (CC_PREVIEW) {
            cc.sys.localStorage[key] = value
        }

        // switch (key) {
        //     case CC_WECHATGAME:
        //         wx.setStorageSync(key, value)
        //         break
        //     case CC_PREVIEW:
        //         cc.log("set storage:", cc.sys.localStorage)
        //         cc.sys.localStorage[key] = value

        //         break
        //     case CC_BUILD:
        //         cc.sys.localStorage.setItem(key, value)
        //         break
        //     default:
        //         break
        // }

    }

    public static GetStorage(key) {
        // if (CC_WECHATGAME) {
        //     return wx.getStorageSync(key)
        // } else {
        //     return cc.sys.localStorage[key]
        // }
        // false true false true
        //console.trace()
        cc.log(cc.sys.localStorage)
        // switch (key) {

        //     case CC_WECHATGAME:
        //         return wx.getStorageSync(key)
        //         break
        //     case CC_PREVIEW:
        //         return cc.sys.localStorage[key]
        //         break
        //     case CC_BUILD:
        //         return cc.sys.localStorage.getItem(key)
        //         break


        // }
        if (CC_WECHATGAME) {
            return wx.getStorageSync(key)
        } else if (CC_BUILD) {
            return cc.sys.localStorage.getItem(key)
        } else if (CC_PREVIEW) {
            return cc.sys.localStorage[key]
        }

        return cc.sys.localStorage[key]

    }


    public static OpenOverStep(score: number) {
        if (CC_WECHATGAME) {
            WXApi.CloseNearRank()
            WXApi.CloseFriendListSmall()
            WXApi.SubCover.active = true
            WXApi.WXSubCoverView.enabled = false
            WXApi.SubCover.position = cc.Vec2.ZERO
            WXApi.SubCover.stopAllActions()
            let act1 = cc.moveBy(3, cc.v2(0, 40))
            let fun = cc.callFunc(() => {
                WXApi.SubCover.active = false
                WXApi.SubCover.position = cc.Vec2.ZERO
            })
            WXApi.PostMsg({ Action: "OpenOverStep", Score: score })
            WXApi.SubCover.runAction(cc.sequence(act1, fun))
            //only use in wechat
            WXApi.WXSubCoverView.update()
        }
    }

    public static OpenNearRank() {
        if (CC_WECHATGAME) {
            WXApi.SubCover.stopAllActions()
            WXApi.SubCover.position = cc.Vec2.ZERO
            WXApi.SubCover.active = true
            WXApi.WXSubCoverView.enabled = true
            WXApi.PostMsg({
                Action: "ShowNearRank",
                MyOpid: WXApi.OpenId,
            })
        }
    }



    public static OpenFriendListSmall(posy: number = 0, myopenid: string = "", refresh: boolean = false) {
        if (CC_WECHATGAME) {
            WXApi.SubCover.stopAllActions()
            WXApi.SubCover.position = cc.Vec2.ZERO
            if (WXApi.CloseFriendListBtn != null) {
                WXApi.CloseFriendListBtn.active = true
                WXApi.BlockLayer.enabled = true
            }
            WXApi.SubCover.active = true
            WXApi.WXSubCoverView.enabled = true

            WXApi.PostMsg({
                Action: "ShowFriendSmall",
                Posy: posy,
                MyOpid: WXApi.OpenId,
                Refresh: refresh
            })
        }
    }

    public static OpenRank4F(b: boolean = true) {
        if (CC_WECHATGAME) {
            if (b) {

                WXApi.SubCover.stopAllActions()
                WXApi.SubCover.position = cc.Vec2.ZERO
                WXApi.SubCover.active = true
                WXApi.WXSubCoverView.enabled = true
                this.PostMsg({ Action: "ShowRank4F" })
            } else {
                this.PostMsg({ Action: "CloseRank4F" })
            }
        }
    }

    public static CloseFriendListSmall() {
        if (CC_WECHATGAME) {
            if (WXApi.CloseFriendListBtn != null) {
                WXApi.CloseFriendListBtn.active = false
                WXApi.BlockLayer.enabled = false
            }
            this.PostMsg({ Action: "CloseFriendSmall" })
        }
    }

    public static CloseOverStep() {
        if (CC_WECHATGAME) {
            WXApi.PostMsg({ Action: "CloseOverStep" })
        }
    }

    public static CloseNearRank() {
        if (CC_WECHATGAME) {
            WXApi.PostMsg({ Action: "CloseNearRank" })
        }
    }


    public static GetShareRandom(title: string, param: any, imgpath: string = "", anyis: string, sharecallback?: Function) {
        let r = Utility.GetRandom(0, WXApi.ShareLabel.length)
        let _title = title === "" ? WXApi.ShareLabel[r] : title
        let _path = imgpath === "" ? WXApi.ShareImg[r] : imgpath
        return {
            title: _title,
            imageUrl: _path,
            query: Utility.parseObjUrlPara(param),
            ald_desc: anyis,
            success: (res) => {
                // if (sharecallback != null) {
                //     sharecallback()
                // }
            },
            fail: () => {
            }
        }
    }


    public static DoVibrate(isShort: boolean) {
        if (CC_WECHATGAME && this.isVibrate) {
            if (isShort) {
                wx.vibrateShort()
            } else {
                wx.vibrateLong()
            }
        }
    }

    public static OpenAd(vleft: number = 0, vtop: number = 0, vwidth: number = cc.winSize.width) {
        if (CC_WECHATGAME) {
            if (WXApi.AdBanner != null) {
                WXApi.AdBanner.show()
                //WXApi.showAd()
                return
            }

            let ad_id = GameData.Share.getAdUnitIdByChannel(WXApi.channelID).banner

            let phone = WXApi.GetSystemInfo()
            var w = phone.screenWidth / 2;
            var h = phone.screenHeight;
            WXApi.AdBanner = wx.createBannerAd({
                adUnitId: ad_id, style: {
                    left: vleft, top: vtop, width: vwidth
                }
            })

            WXApi.AdBanner.onError((errmsg, errcode) => {
                console.log(errmsg, errmsg)
            })


            WXApi.AdBanner.onResize(function (res) {
                if (WXApi.AdBanner != null && WXApi.AdBanner != undefined) {
                    let offh = WXApi.GetSystemInfo().model.indexOf("iPhone X") === 0 ? 10 : 0
                    WXApi.AdBanner.style.left = w - WXApi.AdBanner.style.realWidth / 2 + 0.1;
                    WXApi.AdBanner.style.top = h - WXApi.AdBanner.style.realHeight - offh
                    if (WXApi.channelID == 2) {
                        let winSize = cc.view.getFrameSize();
                        WXApi.AdBanner.style.top = winSize.height - res.height - offh;
                        WXApi.AdBanner.style.left = winSize.width / 2 - res.width / 2;
                        WXApi.AdBanner.style.width = winSize.width;
                    }
                    if (WXApi.channelID == 1)
                        WXApi.AdBanner.style.height = 200;
                }
            })
            //WXApi.AdBanner.show()
            WXApi.showAd()
        }

    }

    public static showAd() {
        if (CC_WECHATGAME) {
            WXApi.AdBanner.onLoad(function () {
                WXApi.AdBanner.show()
                    .then(() => {
                        console.log('广告显示成功');
                    })
                    .catch(err => {
                        console.log('广告组件出现问题', err);
                    })
            })
        }
    }

    public static CloseAd() {
        if (CC_WECHATGAME) {
            if (WXApi.AdBanner != null) {
                WXApi.AdBanner.hide()
                // WXApi.AdBanner = null
            }
        }
    }

    public static getUnitid(index: number) {
        let pInfo: any = StaticData.PlayerInfo
        console.log('videoTimes:', pInfo.videoTimes)
        if (pInfo.videoTimes > 5) {
            return WXApi.lUnitid[index]
        } else {
            return WXApi.sUnitid[index]
        }
    }

    public static OpenAdVideo(callback: Function, adid?: string, tips?: string) {
        WXApi.OnVidoeFun = callback
        let ad_id = ""
        if (adid == null) {
            ad_id = GameData.Share.getAdUnitIdByChannel(WXApi.channelID).video
        } else {
            ad_id = adid
        }
        //如果观看视频次数大于5次  则调用长视频
        // let pInfo: any = StaticData.PlayerInfo
        // if (pInfo.videoTimes > 5) { ad_id = GameData.Share.getAdUnitIdByChannel(WXApi.channelID).videoLong }

        if (CC_WECHATGAME) {


            // if (WXApi.VidoesAd == null || !WXApi.VidoesAd) {


            // }
            WXApi.VidoesAd = wx.createRewardedVideoAd({ adUnitId: ad_id })

            //关闭上一次的监听
            if (WXApi.VidoesAd) WXApi.VidoesAd.offClose()
            WXApi.VidoesAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励
                    WXApi.OnVidoeFun()

                    WXApi.HttpPost('/fangkuaiWx/videoPlay', {})
                    console.log("call vidoes close ok")
                    Logger.exportWXData('read')
                    Logger.recordTS(35)
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    WXApi.tipsDialog(tips)
                    console.log('播放中途退出，不下发游戏奖励')
                    Logger.recordTS(36)
                }
            })
            WXApi.VidoesAd.onError((errmsg, errcode) => {
                console.log(errmsg, errcode)
            })
            let isShow: boolean = true
            WXApi.VidoesAd.show().catch(err => {
                isShow = false
                WXApi.VidoesAd.load()
                    .then(() => { WXApi.VidoesAd.show(); isShow = true })
            })
            if (isShow) {
                Logger.exportWXData('readtry')
                Logger.recordTS(34)
            }
        } else if (CC_PREVIEW || WXApi.isAndroidValid) {
            WXApi.OnVidoeFun()
        } else if (PlatformUtility.IsAndroid()) {
            cc.game["lookAdDone"] = WXApi.OnVidoeFun
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "showVideoAd", "()V");
        }
    }

    public static OpenAlert(msg: string, dur: number = 1500, icon: boolean = false) {
        if (CC_WECHATGAME) {
            wx.showToast({
                title: msg,//提示文字
                duration: dur,//显示时长
                mask: true,//是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: icon ? 'success' : 'none', //图标，支持"success"、"loading"  
                success: function () { },//接口调用成功
                fail: function () { },  //接口调用失败的回调函数  
                complete: function () { } //接口调用结束的回调函数  
            })
        }
    }

    public static PostMsg(obj: any) {
        if (CC_WECHATGAME) {
            let openDataContext = wx.getOpenDataContext()
            openDataContext.postMessage(obj)
        }
    }



    public static CheckKeyCount(key: string, isAdd: boolean = true): number {
        let value = 0
        if (CC_WECHATGAME) {
            value = Number(wx.getStorageSync(key))
            if (isAdd) {
                value++
                wx.setStorageSync(key, value)
            }
        }
        return value

    }

    public static DoHttpPostAction(url: string, param: string, CB: (Text: string) => void) {
        let req: XMLHttpRequest = new XMLHttpRequest();
        req.open("POST", `${url}`, true);
        req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        req.onreadystatechange = () => {
            if (req.readyState == 4 && req.status == 200) {
                CB(req.responseText)
            } else if (req.readyState == 4) {
                cc.log("http error:", req.status, `${WXApi.Url}${url}`)
            }
        }
        req.onerror = () => {
            cc.log("web request error,try again")
            setTimeout(() => {
                WXApi.DoHttpPostAction(url, param, CB)
            }, 2000)
        }
        req.timeout = 5000
        req.ontimeout = () => {
            console.log('请求超时')
            WXApi.DoHttpPostAction(url, param, CB)
        }

        req.send(param)
    }


    /** Post get api data
      @param url api
      @param obj{key:value,...}
      @return data
      @example HttpPost("/api/xxx/xxx....",{},fun)
    */
    public static HttpPost(url: string, obj: any, server: string = ""): Promise<any> {

        return new Promise((resolve, err) => {
            let posturl = ""
            if (server == "") {
                posturl = `${WXApi.Url}${url}`
            } else {
                posturl = `${server}${url}`
            }
            if (server == "") {
                // if (WXApi.OpenId != "" && obj.open_id == undefined) {
                //     obj.open_id = WXApi.OpenId
                // }
                if (WXApi.sign != "" && obj.sign == undefined && url.search('login') == -1) {
                    obj.sign = WXApi.sign
                }
            }
            let param = ""
            // if (server == "") {
            //     param = Utility.parseObjUrlPara(obj)
            // } else {
            //     param = JSON.stringify(obj)
            // }

            if (obj.version == undefined) obj.version = WXApi.version

            param = JSON.stringify(obj)
            console.log(param);
            console.log(posturl);
            WXApi.DoHttpPostAction(posturl, param, (context) => {
                if (context == undefined || context == "{}") {
                    resolve(null)
                    return
                }

                let jobj = JSON.parse(context);
                let st = jobj.errcode == 200 ? true : false
                if (!st) {
                    console.log("url:" + url + " errcode:" + jobj.errcode + " err msg:", jobj)
                    resolve(jobj)
                }
                resolve(jobj)
            })


            // let req: XMLHttpRequest = new XMLHttpRequest();
            // if (server == "") {
            //     req.open("POST", `${WXApi.Url}${url}`, true);

            // } else {
            //     req.open("POST", `${server}${url}`, true);
            // }
            // req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            // req.onreadystatechange = () => {
            //     if (req.readyState == 4 && req.status == 200) {
            //         let jobj = JSON.parse(req.responseText);
            //         let st = jobj.code == 0 ? true : false
            //         if (!st) {
            //             console.log("url:" + url + " err msg:", jobj)
            //             resolve(jobj)
            //         }
            //         resolve(jobj)
            //     } else if (req.readyState == 4) {
            //         cc.log("http error:", req.status, `${WXApi.Url}${url}`)
            //         err(`http://"${WXApi.Url}${url}  status:${req.status}`)
            //     }
            // }
            // req.onerror = () => {
            //     cc.log("web request error,try again")
            //     setTimeout(() => {
            //         if (server != "") {
            //             return
            //         }
            //         WXApi.HttpPost(url, obj, server)
            //     }, 2000)
            // }
            // if (server == "") {
            //     if (WXApi.OpenId != "" && obj.open_id == undefined) {
            //         obj.open_id = WXApi.OpenId
            //     }
            // }
            // if (server == "") {
            //     req.send(Utility.parseObjUrlPara(obj))
            // } else {
            //     req.send(JSON.stringify(obj))
            // }
        })
    }

    public static HideAuthorizeBtn(b: boolean) {
        if (CC_WECHATGAME) {
            console.log("authbtn do act")
            if (WXApi.GbtnAuthorize == null) {
                return
            }
            if (b == false) {
                console.log("authbtn hide")
                WXApi.GbtnAuthorize.hide()
            } else {
                console.log("authbtn show")
                WXApi.GbtnAuthorize.show()
            }
        }
    }

    public static CreateGameCircle(btnNode: cc.Node) {
        if (CC_WECHATGAME) {
            let btnSize = cc.size(btnNode.width + 10, btnNode.height + 10);
            let frameSize = cc.view.getFrameSize();
            let winSize = cc.director.getWinSize();


            let BtnPos = btnNode.convertToWorldSpace(cc.Vec2.ZERO)
            let left = (BtnPos.x) / winSize.width * frameSize.width;
            let tox = (frameSize.height / winSize.height)
            if (winSize.height - frameSize.height > 520) {
                tox += 0.1
            }

            let top = (winSize.height - BtnPos.y - btnSize.height) * tox
            let width = btnSize.width / winSize.width * frameSize.width;

            let height = btnSize.height / winSize.height * frameSize.height;

            WXApi.GbtnGameCircle = wx.createGameClubButton({
                type: "text",
                //type: "icon",
                text: "",
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height
                }
            })
        }
    }

    //头条授权
    public static CreateTTAuthorize(fun: (userinfo) => void) {
        //检查是否授权
        console.log('检查是否授权');
        if (!CC_WECHATGAME) {
            return;
        }
        wx.getSetting({
            success: (response) => {
                if (!response.authSetting['scope.userInfo']) {
                    //没有授权
                    console.log('没有授权');
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success: (res) => {
                            wx.getUserInfo({
                                success: (res) => {
                                    console.log('成功授权：', res);
                                    fun(res)
                                }
                            })
                        }
                    })
                } else {
                    //已经授权
                    console.log('已经授权');
                }
            }
        })
    }

    public static CreateAuthorizeBtn(btnNode: cc.Node, fun: (userinfo) => void, remove: boolean = true) {
        if (this.channelID == 2) return
        if (CC_WECHATGAME) {

            if (WXApi.GbtnAuthorize != null) {
                WXApi.GbtnAuthorize.show()
                return
            }

            let btnSize = cc.size(btnNode.width + 10, btnNode.height + 10);
            let frameSize = cc.view.getFrameSize();
            let winSize = cc.director.getWinSize();


            let BtnPos = btnNode.convertToWorldSpace(cc.Vec2.ZERO)
            let left = (BtnPos.x) / winSize.width * frameSize.width;
            let tox = (frameSize.height / winSize.height)
            if (winSize.width / winSize.height < 0.5) {
                //tox -= 0.1
            }
            //console.log(winSize.height, frameSize.height, winSize.width / winSize.height ,"tox:",tox)
            let top = (winSize.height - BtnPos.y - btnSize.height) * tox
            let width = btnSize.width / winSize.width * frameSize.width;

            let height = btnSize.height / winSize.height * frameSize.height;

            let btnAuthorize = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: left,
                    top: top,
                    width: width,
                    height: height,
                    lineHeight: 0,
                    backgroundColor: '',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })
            WXApi.GbtnAuthorize = btnAuthorize

            btnAuthorize.onTap((uinfo) => {
                if (remove) {
                    btnAuthorize.destroy()
                    console.log("auth btn remove")
                } else {
                    btnAuthorize.hide()
                }

                console.log('click authorzeBtn')
                Logger.exportWXData('pullauth')
                Logger.recordTS(5)
                console.log(uinfo)
                if (uinfo) {
                    fun(uinfo)
                } else {
                    wx.showToast({ title: "授权按钮失败触发失败" });
                    fun(null)
                }

            });
        } else {
            btnNode.on(cc.Node.EventType.TOUCH_START.toString(), () => {
                fun({})
            })

        }
    }



    public static GetSystemInfo() {
        if (CC_WECHATGAME) {
            return wx.getSystemInfoSync();
        }
    }

    public static OpenGameBox(appid: string = "wx524ca1b464e21034") {
        if (CC_WECHATGAME) {
            wx.navigateToMiniProgram({ appId: appid })
        }
    }

    public static setWXFrameRate(r: number) {
        if (CC_WECHATGAME) {
            wx.setPreferredFramesPerSecond(r)
        } else {
            cc.game.setFrameRate(r)
        }
    }

    public static CopyToClipboard(str: string) {
        if (CC_WECHATGAME) {
            wx.setClipboardData({
                data: str, //公众号id
                success: function (res) {
                    wx.getClipboardData({
                        success: function (res) {
                            console.log("复制成功：", res.data)
                        }
                    });
                }
            })
        }
    }

    //提示文本
    public static tipsDialog(str: string) {
        let s = cc.director.getScene()
        if (s.getChildByName('Warning')) {
            return
        }
        cc.loader.loadRes('ui/Warning', (err, res) => {
            let n: cc.Node = cc.instantiate(res)
            n.getChildByName('New Label').getComponent(cc.Label).string = str
            n.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2)
            s.addChild(n)
            let delay = cc.delayTime(2)
            let rs = cc.removeSelf()
            n.runAction(cc.sequence(delay, rs))
        });
    }

    public static showFreeMoneyUI() {
        let s = cc.director.getScene()
        if (s.getChildByName('FreeMoney')) {
            return
        }
        cc.loader.loadRes('ui/FreeMoney', (err, res) => {
            let n: cc.Node = cc.instantiate(res)
            n.position = cc.v2(cc.winSize.width / 2, cc.winSize.height / 2)
            n.getComponent('FreeMoneyUI').initData()
            //s.addChild(n)
        });
    }

    public static serviceImg: any[] = [
        "https://gamecdn.xunyi.online/mengwu/fangkuaiBattle/serviceImg/service1.png",
        "https://gamecdn.xunyi.online/mengwu/fangkuaiBattle/serviceImg/service2.png"
    ]
    public static preViewSVImage() {
        if (CC_WECHATGAME && WXApi.channelID == 0) {
            let r = Utility.GetRandom(0, WXApi.serviceImg.length - 1)
            wx.previewImage({
                current: WXApi.serviceImg[r], // 当前显示图片的http链接
                urls: WXApi.serviceImg // 需要预览的图片http链接列表
            })
        }
    }

    public static navigateApp(appid, path?: string, ad_id?: string, vals?: string, next_appid?: string, next_path?: string) {
        if (CC_WECHATGAME) {
            Logger.exportAdType('click', vals, ad_id)
            wx.navigateToMiniProgram({
                appId: appid,
                path: path,
                extraData: {
                    next_appid: next_appid,
                    next_path: next_path
                },
                success(res) {
                    // 打开成功
                    Logger.exportAdType('jump', vals, ad_id)
                    Logger.recordTS(37)
                },
                fail(res) {
                    // 打开失败

                }
            })
        }
    }
}
