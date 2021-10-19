import WXApi from "../Lib/WXApi";
import UICrl from "../Lib/UI/UICrl";
import UIMgr from "../Lib/UI/UIMgr";
import BottomMenuCrl from "./BottomMenuCrl";
import MiddleAraeCrl from "./MiddleAraeCrl";
import StaticData from "../StaticData";
import { RewardBox } from "../Mod/PlayerData";
import GameData from "../GameData";
import Utility from "../Lib/Utility";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import OpenBoxCrl from "./OpenBoxCrl";
import SoundMgr from "../Lib/SoundMgr";
import Logger from "../LoggerCrl";
import BaseX from "../Lib/Base64";
import ChestInfoCrl from "./ChestInfoCrl";
import SearchingCrl from "./SearchingCrl";
import GameRecorder from "../Lib/GameRecorder";
import RankCrl from "./RankCrl";
import NetProecssCrl from "../Crl/Net/NetProcessCrl";
import GameSceneCrl from "../Crl/GameSceneCrl";
import AchievementUI from "./AchievementUI";
import RankUI from "./RankUI";
import PlatformUtility from "../Lib/PlatformUtility";
import CodeUI from "./CodeUI";
import HeroData from "../Mod/HeroData";
import DailyUI from "./DailyUI";
import MatchUI from "./MatchUI";
import FavoriteUI from "./FavoriteUI";
import GSLoading from "./GSLoading";


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
export default class GameMenuUI extends UICrl {

    public static Share: GameMenuUI = null

    bottomMenuCrl: BottomMenuCrl = null

    middleAraeCrl: MiddleAraeCrl = null

    coinLable: cc.Label = null

    keyLable: cc.Label = null

    diamondLabel: cc.Label = null

    userFace: cc.Sprite = null

    @property(cc.Node)
    coinFX: cc.Node = null
    @property(cc.Node)
    diamFX: cc.Node = null
    @property(cc.Node)
    keyFX: cc.Node = null

    @property(cc.Node)
    boxArea: cc.Node = null

    boxDTime: any[] = []

    @property([cc.Button])
    startMatchBtn: cc.Button[] = []

    @property(cc.Node)
    shareRecordBtn: cc.Node = null

    @property(cc.Node)
    moreOptionNode: cc.Node = null

    @property(cc.Node)
    rankNode: cc.Node = null

    @property(cc.Node)
    shopBtnNode: cc.Node = null
    @property(cc.Node)
    heroBtnNode: cc.Node = null
    @property(cc.Node)
    baseBtnNode: cc.Node = null
    @property(cc.Node)
    taskBtnNode: cc.Node = null
    @property(cc.Node)
    achieveBtnNode: cc.Node = null
    @property(cc.Node)
    signBtnNode: cc.Node = null
    @property(cc.Node)
    favBtnNode: cc.Node = null

    @property(cc.Node)
    teachMenuUI: cc.Node = null

    @property(cc.Node)
    heroTips: cc.Node = null

    @property(cc.Node)
    blockNode: cc.Node = null

    @property(cc.Node)
    loadingTips: cc.Node = null

    @property(cc.Node)
    gameDrawer: cc.Node = null
    @property(cc.Node)
    gameDrawerBase: cc.Node = null

    @property(cc.Sprite)
    moreGamePic: cc.Sprite = null

    @property(cc.Node)
    shareBattle: cc.Node = null


    stageNodes: cc.Node[] = []

    openBoxAction: boolean = false

    blockBtnCB: boolean = false

    process: any = null

    matchTime: number = 8

    navIconIndex: number = 0

    start() {

        Logger.exportWXData('login')

        //cc.log("param:", window)
        new NetProecssCrl()
        //console.log(Utility.range(100, 200))
        //console.log(Utility.range(100, 200))

        this.coinLable = this.node.getChildByName("PlayerInfo").getChildByName("coin").getComponentInChildren(cc.Label)
        this.keyLable = this.node.getChildByName("PlayerInfo").getChildByName("key").getComponentInChildren(cc.Label)
        this.diamondLabel = this.node.getChildByName("PlayerInfo").getChildByName("diam").getComponentInChildren(cc.Label)
        this.userFace = this.node.getChildByName("PlayerInfo").getChildByName("avatar").getChildByName("New Sprite").getComponent(cc.Sprite)

        this.startMatchBtn[0].interactable = false
        this.initAll()
        GameMenuUI.Share = this
        try {
            if (CC_PREVIEW) {
                this.startMatchBtn[1].node.active = true
            } else {
                this.startMatchBtn[1].node.active = false
            }
        } catch (e) {

        }
        //头条授权
        if (WXApi.channelID == 2) {
            WXApi.CreateTTAuthorize(async (info) => {
                if (info.userInfo != null && info.userInfo != undefined) {
                    let basex = new BaseX()
                    let udata = { name: basex.encode(info.userInfo.nickName), pic: info.userInfo.avatarUrl, gender: 0 }
                    let rs = await WXApi.HttpPost("/fangkuaiWx/updateUserMsg", udata)  //new
                    if (rs.errcode == 200) {
                        PlayerDataCrl.UpdateHeroInfo(rs)
                    }
                    Logger.updateMsg(WXApi.OpenId, StaticData.PlayerInfo.nickname, StaticData.PlayerInfo.face)
                    this.refrashUI()
                }
            });
            this.shareRecordBtn.active = true
        }

        this.schedule(this.changeNavIcon, 5)
    }

    onEnable() {
        //this.checkIsGuide()
        this.coinLable = this.node.getChildByName("PlayerInfo").getChildByName("coin").getComponentInChildren(cc.Label)
        this.keyLable = this.node.getChildByName("PlayerInfo").getChildByName("key").getComponentInChildren(cc.Label)
        this.diamondLabel = this.node.getChildByName("PlayerInfo").getChildByName("diam").getComponentInChildren(cc.Label)
        this.userFace = this.node.getChildByName("PlayerInfo").getChildByName("avatar").getChildByName("New Sprite").getComponent(cc.Sprite)
        this.refrashUI()
        //播放bgm
        SoundMgr.Share.PlayMusic("MainBGM", true)
        if (WXApi.channelID == 2) {
            GameRecorder.Share.recordStop()
        }

        this.heroTips.active = false
        if (WXApi.GetStorage('firstLose') == '1') {
            this.showHeroTips()
            WXApi.SetStorage('firstLose', 2)
        }

        if (WXApi.iconData.length > 0) {
            Utility.LoadImgAyns(WXApi.iconData[this.navIconIndex].source, this.moreGamePic)
        }

    }

    showHeroTips() {
        this.heroTips.active = true
        this.heroTips.getChildByName('Block').getChildByName('Cover').off('touchstart')
        this.heroTips.getChildByName('Block').getChildByName('Cover').on('touchstart', () => { this.heroTips.active = false }, this)
    }

    showFirstUI() {
        if (StaticData.PlayerInfo != null && StaticData.PlayerInfo.stepReceive >= 4) {
            // if (!StaticData.Invited && !WXApi.isValid && CC_WECHATGAME && !PlatformUtility.IsAndroid()) {
            //     StaticData.Invited = true
            //     UIMgr.Share.showUI("InvitUI", true)
            // }
            //公告
            // if (!StaticData.HadShowBoard) {
            //     UIMgr.Share.showUI('BoradUI', true)
            // }
            let pInfo: any = StaticData.PlayerInfo
            let data: any = pInfo.userSign
            let curDay: number = data.index
            let dayArr: any[] = data.state
            if (dayArr[curDay] == 0) {
                UIMgr.Share.showUI('DailyUI', true)
            }

            if (StaticData.PlayerInfo.nickname == null || StaticData.PlayerInfo.face == null) {
                UIMgr.Share.showUI('signUpUI', true)
            }
        }
    }

    shareRecorderBtnCB() {
        if (WXApi.channelID == 2) {
            GameRecorder.Share.shareVideo()
        }
    }

    shareBtnCB() {
        WXApi.OpenShare()
    }

    initAll() {
        this.handleInitUI()

    }

    hanldeShareData(data) {
        console.log("handle share:", data)
        let share: any[] = JSON.parse(data.share)
        share.forEach(s => {
            WXApi.ShareLabel.push(s.desc)
            WXApi.ShareImg.push(s.img)
        })

    }

    async handleInitUI() {

        //检查上次有没有强退
        WXApi.sign = CC_PREVIEW ? GameData.Share.UrlConfig.sign : WXApi.sign
        let msg: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
        if (msg.errcode == 200) {
            PlayerDataCrl.UpdateHeroInfo(msg)

            let exitGame: boolean = msg.preGame
            if (exitGame) {
                StaticData.PlayerInfo.score = StaticData.PlayerInfo.score - 1 < 0 ? 0 : StaticData.PlayerInfo.score - 1
                await WXApi.HttpPost("/fangkuaiWx/updateScore", { score: StaticData.PlayerInfo.score })
                await WXApi.HttpPost('/fangkuaiWx/gamePlay', {})
            }
            if (msg.startFromArena) {
                await WXApi.HttpPost("/fangkuaiWx/battleGameOver", { type: 0 })
                let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
                if (pi.errcode != 200) {
                    return
                }
                PlayerDataCrl.UpdateHeroInfo(pi)
            }
        }

        // if (!CC_WECHATGAME) {
        //     console.log('wxapi Url:', WXApi.Url)
        //     WXApi.sign = PlatformUtility.IsAndroid() || WXApi.isAndroidValid ? WXApi.sign : GameData.Share.UrlConfig.sign
        //     //await WXApi.HttpPost("/fangkuaiWx/updateScore", { score: 47 })   //测试用
        //     let data = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
        //     console.log("获取用户信息getUserMsg：", data);
        //     if (data.errcode == 200) {
        //         PlayerDataCrl.UpdateHeroInfo(data)
        //     }
        //     //this.hanldeShareData(data)
        // }


        //Logger.Login(WXApi.OpenId)

        this.bottomMenuCrl = this.node.getComponentInChildren(BottomMenuCrl)
        this.middleAraeCrl = this.node.getComponentInChildren(MiddleAraeCrl)
        this.bottomMenuCrl.menuCB = (idx, ins) => {
            cc.log("from menu:", idx)
            this.hideRedPoint(idx)
            this.middleAraeCrl.doShowIdxNode(idx, ins)
        }
        this.bottomMenuCrl.selectBottomIdx(2, true)
        this.refrashUI()
        this.loadShopUI()
        //this.loadRankUI()
        this.loadBaseUI()
        this.loadQuestUI()
        // if (!StaticData.Invited && !WXApi.isValid) {
        //     StaticData.Invited = true
        //     UIMgr.Share.showUI("InvitUI", true)
        // }

        //如果没有任务
        let pInfo: any = StaticData.PlayerInfo;
        // let rs = await WXApi.HttpPost('/fangkuaiWx/updateTask', { task: GameData.Share.getThreeTask() });
        //     console.log('updateTask: ', rs.task);
        //     if (rs.errcode == 200) {
        //         pInfo.task = rs.task;
        //     }
        if (pInfo.task.task == undefined) {
            let rs = await WXApi.HttpPost('/fangkuaiWx/updateTask', { task: GameData.Share.getThreeTask() });
            if (rs.errcode == 200) {
                pInfo.task = rs.task;
            }
        }

        cc.log("init data", StaticData.PlayerInfo)

        /* test quick start game */
        // this.startBtnCB()
        console.log('WXApi.GetStorage("tur"):', WXApi.GetStorage("tur"))

        // StaticData.Teaching = true
        // StaticData.PlayerInfo.guideStep = 3
        // StaticData.PlayerInfo.stepReceive = 3
        // this.startTeach()
        if (StaticData.PlayerInfo.guideStep < 3) {
            this.teachMenuUI.active = true
            //this.startTeach()
        }
        else {
            // if (!StaticData.Invited && !WXApi.isValid && CC_WECHATGAME && !PlatformUtility.IsAndroid()) {
            //     StaticData.Invited = true
            //     UIMgr.Share.showUI("InvitUI", true)
            // }
            //公告
            // if (!StaticData.HadShowBoard) {
            //     UIMgr.Share.showUI('BoradUI', true)
            // }
            let pInfo: any = StaticData.PlayerInfo
            let data: any = pInfo.userSign
            let curDay: number = data.index
            let dayArr: any[] = data.state
            if (dayArr[curDay] == 0) {
                UIMgr.Share.showUI('DailyUI', true)
            }

            // if (WXApi.GetStorage('signUp') != 1 && PlatformUtility.IsAndroid()) {
            //     UIMgr.Share.showUI('signUpUI', true)
            // }
            if (StaticData.PlayerInfo.nickname == null || StaticData.PlayerInfo.face == null) {
                UIMgr.Share.showUI('signUpUI', true)
            }
        }
        Logger.record(0)

        this.startMatchBtn[0].interactable = true
        //红点提示
        this.checkBtnTips()

        //注册页
        //UIMgr.Share.showUI('signUpUI', true)
        //by test 
        // WXApi.SetStorage("tur", "0")
        // StaticData.Teaching = true
        // StaticData.Teached = true
        // this.startTeach()
    }

    async checkIsGuide() {
        WXApi.sign = CC_PREVIEW ? GameData.Share.UrlConfig.sign : WXApi.sign
        let msg: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
        if (msg.errcode == 200) {
            PlayerDataCrl.UpdateHeroInfo(msg)
            if (StaticData.PlayerInfo.guideStep < 3) {
                this.teachMenuUI.active = true
            }
        }
    }

    hideRedPoint(id: number) {

        switch (Math.floor(id)) {
            case 0:
                this.shopBtnNode.getChildByName('tips').active = false
                break
            case 1:
                this.heroBtnNode.getChildByName('tips').active = false
                break
            case 2:
                break
            case 3:
                this.baseBtnNode.getChildByName('tips').active = false
                break
            case 4:
                this.taskBtnNode.getChildByName('tips').active = false
                break
        }
    }


    refrashUI() {
        if (StaticData.PlayerInfo == null) {
            return
        }

        let pInfo1: any = StaticData.PlayerInfo
        if (pInfo1.globalData.getFavourite == true || WXApi.channelID != 0) {
            this.favBtnNode.active = false
        }

        //SoundMgr.Share.PlayBackground("MainBGM")
        this.updatePlayerInfo()
        this.handleBoxShow()
        //this.updateRankInfo()
        //更新段位成就
        PlayerDataCrl.updateRankAchieve()
        //this.handleStageItem(StaticData.PlayerInfo.score)
        let pInfo: any = StaticData.PlayerInfo;
        this.handleStageItem(pInfo.grade)

        this.startMatchBtn.forEach(b => {
            b.interactable = true
        })

        // //红点提示
        // this.checkBtnTips()
    }

    async updateRankInfo() {
        let score = StaticData.PlayerInfo.score
        let randConfig = GameData.Share.getRankConfigByScore(score)
        for (let i = 0; i <= 24; i++) {
            this.rankNode.getChildByName(i.toString()).active = false
            if (randConfig.id == i) {
                this.rankNode.getChildByName(i.toString()).active = true
            }
        }
        if (this.rankNode.getChildByName('24').active) {
            let data = await WXApi.HttpPost("/fangkuaiWx/userRanking", {})
            if (data.errcode == 200) {
                let mydata: any = data.local
                this.rankNode.getChildByName('24').getChildByName('ranking').getComponent(cc.Label).string = '第' + mydata.index + '名'
            }
        }
        let starNode = this.rankNode.getChildByName('star')
        starNode.active = !this.rankNode.getChildByName('24').active && !this.rankNode.getChildByName('0').active
        starNode.getChildByName('2s').active = false
        starNode.getChildByName('3s').active = false
        starNode.getChildByName('4s').active = false
        starNode.getChildByName('5s').active = false
        let starNum = score - randConfig.dt
        if (score >= 1 && score < 7) {
            starNode.getChildByName('2s').active = true
            for (let i = 0; i < 2; i++) {
                starNode.getChildByName('2s').getChildByName(i.toString()).active = starNum > i
            }
        } else if (score >= 7 && score < 16) {
            starNode.getChildByName('3s').active = true
            for (let i = 0; i < 3; i++) {
                starNode.getChildByName('3s').getChildByName(i.toString()).active = starNum > i
            }
        } else if (score >= 16 && score < 28) {
            starNode.getChildByName('4s').active = true
            for (let i = 0; i < 4; i++) {
                starNode.getChildByName('4s').getChildByName(i.toString()).active = starNum > i
            }
        } else if (score >= 28 && score < 99) {
            starNode.getChildByName('5s').active = true
            for (let i = 0; i < 5; i++) {
                starNode.getChildByName('5s').getChildByName(i.toString()).active = starNum > i
            }
        }
    }

    updatePlayerInfo() {
        //是否有资源入账
        if (StaticData.PlayerInfo.coin > parseInt(this.coinLable.string)) {
            this.playResAni(1);
            SoundMgr.Share.PlaySound('getCoin')
        }
        if (StaticData.PlayerInfo.gold > parseInt(this.diamondLabel.string)) {
            this.playResAni(2);
            SoundMgr.Share.PlaySound('getGold')
        }
        if (StaticData.PlayerInfo.key > parseInt(this.keyLable.string)) {
            this.playResAni(3);
            SoundMgr.Share.PlaySound('getKey')
        }

        this.coinLable.string = StaticData.PlayerInfo.coin.toString()
        this.keyLable.string = StaticData.PlayerInfo.key.toString()
        this.diamondLabel.string = StaticData.PlayerInfo.gold.toString()
        Utility.LoadImgAyns(StaticData.PlayerInfo.face, this.userFace)
    }

    playResAni(index) {
        switch (index) {
            case 1:
                this.coinFX.getComponent(cc.Animation).play()
                break;
            case 2:
                this.diamFX.getComponent(cc.Animation).play()
                break;
            case 3:
                this.keyFX.getComponent(cc.Animation).play()
                break;
        }
    }

    async startTeach() {
        this.loadingTips.getComponent(GSLoading).initData(async () => {
            cc.director.loadScene("GameScene", () => {
                let crl = cc.director.getScene().getComponentInChildren(GameSceneCrl)
                SoundMgr.Share.StopMuisc('MainBGM')
                if (WXApi.channelID == 2) {
                    GameRecorder.Share.recordStart()
                }
            })
        })
    }

    setGradeLv() {
        let rConfig: any = GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score)
        let id: number = rConfig.lv
        if (id <= 1) {
            StaticData.StageLevel = 1
        } else if (id <= 3) {
            StaticData.StageLevel = 2
        } else if (id <= 5) {
            StaticData.StageLevel = 3
        } else if (id <= 6) {
            StaticData.StageLevel = 4
        } else {
            StaticData.StageLevel = 5
        }
    }

    enterGame(ouserdata?: any) {
        if (StaticData.GameStart) {
            return
        }

        this.loadingTips.getComponent(GSLoading).initData(async () => {
            this.blockNode.active = true
            let matchUI: MatchUI = await UIMgr.Share.showUI('MatchingUI', true) as MatchUI;
            await matchUI.doShow(ouserdata)
            this.blockNode.active = false

            StaticData.GameStart = true

            cc.director.loadScene("GameScene", () => {
                //WXApi.CloseAd()
                //this.setGradeLv()
                let crl = cc.director.getScene().getComponentInChildren(GameSceneCrl)
                if (ouserdata != null) {
                    crl.setupOpponentData(ouserdata)
                }
                SoundMgr.Share.StopMuisc('MainBGM')
                if (WXApi.channelID == 2) {
                    GameRecorder.Share.recordStart()
                }

            })
            UIMgr.Share.hideAll()
        })


    }


    async startBtnCB(event, signid) {
        //如果教程还没结束
        if (StaticData.PlayerInfo && StaticData.PlayerInfo.guideStep < 3)
            return
        //如果好友对战已经开始
        if (StaticData.startFromShareGame) return

        let btn: cc.Button = null
        if (event != null) {
            btn = event.target.getComponent(cc.Button)
            btn.interactable = false

            Logger.recordTS(13)
            this.enterGame()
            return
        }

        if (StaticData.startFromArena) {
            await WXApi.HttpPost('/fangkuaiWx/startFromArena', { type: true })
            let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
            if (pi.errcode != 200) {
                WXApi.tipsDialog(pi.info)
                return
            }
            PlayerDataCrl.UpdateHeroInfo(pi)
        }

        this.matchTime = Utility.GetRandom(8, 12)
        let search = await UIMgr.Share.showUI("SeachingUI", true) as SearchingCrl
        //WXApi.OpenAd(0, cc.winSize.height)  //banner
        let sTime = CC_PREVIEW ? 7 : 7
        let cb: Function = () => {
            NetProecssCrl.Share.doClose()
            search.node.active = false
            this.enterGame()
        }
        this.scheduleOnce(cb, this.matchTime)


        //this.enterGame()

        search.onClose = async () => {
            //WXApi.CloseAd()  //关闭banner
            NetProecssCrl.Share.doClose()
            if (btn != null) {
                btn.interactable = true
            }
            //this.unscheduleAllCallbacks()
            this.unschedule(cb)
            StaticData.startFromArena = false
            await WXApi.HttpPost('/fangkuaiWx/startFromArena', { type: false })
            let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
            if (pi.errcode != 200) {
                WXApi.tipsDialog(pi.info)
                return
            }
            PlayerDataCrl.UpdateHeroInfo(pi)
        }

        //黄金以下匹配AI
        // if (GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv < 3) {
        //     return
        // }

        await NetProecssCrl.Share.doConnect(signid == null ? WXApi.sign : signid)
        let userinfo: any = await NetProecssCrl.Share.handleSyncUserInfo()
        //this.unscheduleAllCallbacks()
        this.unschedule(cb)
        search.node.active = false
        this.enterGame(userinfo)

    }

    async gradeBtnCB() {
        await UIMgr.Share.showUI('RankUI', true) as RankUI;
    }

    async friendBtnCB() {
        WXApi.OpenAlert('敬请期待');
    }

    async rankBtnCB() {
        if (this.blockBtnCB) return
        this.blockBtnCB = true
        await UIMgr.Share.showUI('NRanklistUI', true) as RankCrl;
        this.blockBtnCB = false
    }


    async achieveBtnCB() {
        if (this.blockBtnCB) return
        this.blockBtnCB = true
        this.achieveBtnNode.getChildByName('tips').active = false
        await UIMgr.Share.showUI('AchievementUI', true) as AchievementUI;
        this.blockBtnCB = false
    }

    async favoriteBtnCB() {
        await UIMgr.Share.showUI('FavoriteUI', true) as FavoriteUI;
    }

    async codeBtnCB() {
        if (this.blockBtnCB) return
        this.blockBtnCB = true
        await UIMgr.Share.showUI('codeUI', true) as CodeUI;
        this.blockBtnCB = false
    }

    async signBtnCB() {
        if (this.blockBtnCB) return
        this.blockBtnCB = true
        this.signBtnNode.getChildByName('tips').active = false
        await UIMgr.Share.showUI('DailyUI', true) as DailyUI;
        this.blockBtnCB = false
    }

    async boardBtnCB() {
        if (this.blockBtnCB) return
        this.blockBtnCB = true
        await UIMgr.Share.showUI('BoradUI', true)
        this.blockBtnCB = false
    }

    async vipBtnCB() {
        if (this.blockBtnCB) return
        this.blockBtnCB = true
        await UIMgr.Share.showUI('VipUI', true)
        this.blockBtnCB = false
    }

    async freeBackCB() {
        await UIMgr.Share.showUI('FeeBackUI', true)
    }

    preViewService() {
        WXApi.preViewSVImage()
    }

    async quickBtnCB() {

    }

    shareGameCB() {
        this.shareBattle.active = true
    }

    //抽屉
    activeGameDrawer(event, data) {
        let btn: cc.Button = event.target.getComponent(cc.Button)
        btn.interactable = false
        this.gameDrawer.getChildByName('closeB').getComponent(cc.Button).interactable = false
        this.gameDrawerBase.getComponent(cc.Animation).off('finished')
        this.gameDrawerBase.getComponent(cc.Animation).on('finished', () => {
            btn.interactable = true
            this.gameDrawer.getChildByName('closeB').getComponent(cc.Button).interactable = true
        })

        if (this.gameDrawer.active) {
            this.gameDrawerBase.getComponent(cc.Animation).play('DrawerClose')
            this.scheduleOnce(() => {
                this.gameDrawer.active = false
            }, 1)
        } else {
            this.gameDrawer.active = true
            this.gameDrawerBase.getComponent(cc.Animation).play('DrawerOpen')
        }
    }

    changeNavIcon() {
        if (WXApi.iconData.length <= 0) {
            return
        }
        this.navIconIndex++
        if (this.navIconIndex >= WXApi.iconData.length) {
            this.navIconIndex = 0
        }

        Utility.LoadImgAyns(WXApi.iconData[this.navIconIndex].source, this.moreGamePic)

    }
    navCB() {
        if (WXApi.iconData.length <= 0) {
            return
        }
        WXApi.navigateApp(
            WXApi.iconData[this.navIconIndex].app_id,
            WXApi.iconData[this.navIconIndex].path,
            WXApi.iconData[this.navIconIndex].advertiser_id,
            'icon')
    }

    handleBoxShow() {
        this.boxDTime.length = 0
        let rboxs: RewardBox[] = StaticData.PlayerInfo.boxs

        this.boxArea.children.forEach(n => {
            n.off(cc.Node.EventType.TOUCH_END.toString())
            if (n.getChildByName("locked").getChildByName("rbox") != null) {
                n.getChildByName("locked").getChildByName("rbox").removeFromParent()
            }
            if (n.getChildByName("unlocked").getChildByName("rbox") != null) {
                n.getChildByName("unlocked").getChildByName("rbox").removeFromParent()
            }
            n.getChildByName("unlocked").active = false
            n.getChildByName("locked").active = false
            n.getChildByName("unlocking").active = false
        })
        for (let i = 0; i < rboxs.length; i++) {
            if (i > 3) {
                break
            }
            let boxitem = this.boxArea.children[i]

            let gettime = rboxs[i].gettime
            let opentime = rboxs[i].opentimeInv
            let now = new Date().getTime()
            let difftime = now - (gettime + opentime)
            cc.loader.loadRes("box/C" + (rboxs[i].level + 1), (err, res) => {
                let boxnode: cc.Node = cc.instantiate(res)
                boxnode.y -= 20
                boxnode.name = "rbox"
                //boxnode.zIndex = -1

                if (rboxs[i].unlock) {
                    if (difftime < 0) {
                        boxitem.getChildByName("unlocking").active = true
                        boxitem.getChildByName("unlocking").getChildByName("Mask").addChild(boxnode)
                        boxitem.getChildByName("unlocking").getChildByName("keys").getComponent(cc.Label).string = (rboxs[i].nkey).toString()
                        this.boxDTime.push({ time: (gettime + opentime), label: boxitem.getChildByName("unlocking").getChildByName("time").getComponent(cc.Label) })
                        boxitem.on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                            //增加2秒挡板
                            this.node.getChildByName('blockTouch').active = true
                            let chestInfo = (await UIMgr.Share.showUI("ChestInfo", true)) as ChestInfoCrl
                            chestInfo.showInfoBox(rboxs[i])
                            Logger.record(9)
                            this.scheduleOnce(() => { this.node.getChildByName('blockTouch').active = false }, 2)
                        })
                    } else {
                        boxitem.getChildByName("unlocking").active = false
                        boxitem.getChildByName("unlocked").active = true
                        boxitem.getChildByName("unlocked").addChild(boxnode)
                        boxnode.zIndex = -1
                        boxitem.on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                            boxitem.off(cc.Node.EventType.TOUCH_END.toString())
                            let ui = (await UIMgr.Share.showUI("GetUI")) as OpenBoxCrl
                            let rs = await WXApi.HttpPost("/fangkuaiWx/activeBox", { boxSign: rboxs[i].id })
                            ui.showBox(rboxs[i])
                            Logger.record(9)
                        })
                    }
                } else {
                    boxitem.getChildByName("locked").active = true
                    boxitem.getChildByName("locked").getChildByName("boxNode").addChild(boxnode)
                    boxitem.getChildByName("locked").getChildByName("time").getComponent(cc.Label).string = Math.floor(rboxs[i].opentimeInv / 60000).toString() + '分钟'
                    boxitem.on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                        //增加2秒挡板
                        this.node.getChildByName('blockTouch').active = true
                        let chestInfo = (await UIMgr.Share.showUI("ChestInfo", true)) as ChestInfoCrl
                        chestInfo.showInfoBox(rboxs[i])
                        Logger.record(9)
                        this.scheduleOnce(() => { this.node.getChildByName('blockTouch').active = false }, 2)
                    })
                }
            })
        }
    }



    handleBoxDTime() {
        if (!StaticData.PlayerInfo) return
        let box: RewardBox[] = [].concat(StaticData.PlayerInfo.boxs)
        this.boxDTime.forEach(bt => {
            let now = new Date().getTime()
            let difftime = now - bt.time
            // difftime = (60 * 60) * 2000
            // difftime -= 302000
            if (difftime < 0) {
                let hour = Math.floor(Math.abs(difftime / 1000 / 3600))
                let minm = Math.floor(Math.abs(((difftime / 1000) % 3600) / 60))
                let sec = Math.floor(Math.abs((difftime / 1000) % 60))
                bt.label.string = (hour < 10 ? "0" + hour : hour) + ":" +
                    (minm < 10 ? "0" + minm : minm) + ":" + (sec < 10 ? "0" + sec : sec)
            } else {
                difftime = box[this.boxDTime.indexOf(bt)].opentimeInv
                let hour = Math.floor(Math.abs(difftime / 1000 / 3600))
                let minm = Math.floor(Math.abs(((difftime / 1000) % 3600) / 60))
                let sec = Math.floor(Math.abs((difftime / 1000) % 60))
                bt.label.string = (hour < 10 ? "0" + hour : hour) + ":" +
                    (minm < 10 ? "0" + minm : minm) + ":" + (sec < 10 ? "0" + sec : sec)
                this.handleBoxShow()
            }
        })
    }

    update() {
        this.handleBoxDTime()

        if (!this.shareBattle.active) {
            if (WXApi.room_id != null && StaticData.PlayerInfo.guideStep >= 3) {
                this.shareBattle.active = true
            }
        }
    }

    handleStageItem(score: number) {
        let bg: any[] = GameData.Share.BattlegroundConfig
        let clevel: number[] = []
        for (let i = 1; i < bg.length; i++) {
            clevel.push(bg[i].unlock)
        }
        let par = this.node.getChildByName("middle").getChildByName("main").getChildByName("middle").getChildByName("Ground")
        this.stageNodes = par.children
        this.stageNodes.forEach(p => {
            p.active = false
        });
        for (let i = 0; i < clevel.length; i++) {
            if (score >= clevel[i]) {
                if (i > 0) {
                    this.stageNodes[i].children[0].active = false
                    StaticData.StageLevel = i + 1
                }
                this.stageNodes[(i - 1) < 0 ? 0 : (i - 1)].active = false
                this.stageNodes[i].active = true
            } else {
                this.stageNodes[i].getChildByName("locked").getChildByName("count").getComponent(cc.Label).string = (clevel[i] - score).toString()
            }
        }

    }

    selectStageCB(event, dir) {
        dir = Number(dir)
        let idx = 0
        for (let i = 0; i < this.stageNodes.length; i++) {
            if (this.stageNodes[i].active) {
                idx = i
            }
            this.stageNodes[i].active = false
        }

        if (dir > 0) {
            idx++
            if (idx >= this.stageNodes.length) {
                idx = 0
            }
        } else {
            idx--
            if (idx < 0) {
                idx = this.stageNodes.length - 1
            }
        }
        if (this.stageNodes[idx].children[0].active == true) {
        } else {
            StaticData.StageLevel = idx + 1
        }
        if (idx == 0) {
            StaticData.StageLevel = 1
        }
        this.stageNodes[idx].active = true
    }

    async invitBtnCB() {
        if (WXApi.isValid || PlatformUtility.IsAndroid()) {
            WXApi.OpenAlert('敬请期待！');
        } else {
            await UIMgr.Share.showUI("InvitUI", true)
        }
    }

    //more ui
    moreBtnCB() {
        this.moreOptionNode.active = true;
    }

    loadShopUI() {
        if (!WXApi.isAndroidValid) {
            cc.loader.loadRes("/ui/ShopUI", (err, res) => {
                let ui = cc.instantiate(res)
                this.node.getChildByName("middle").getChildByName("shop").addChild(ui)
            })
        } else {
            cc.loader.loadRes("/ui/ShopPayUI", (err, res) => {
                let ui = cc.instantiate(res)
                this.node.getChildByName("middle").getChildByName("shop").addChild(ui)
            })
        }
    }

    loadRankUI() {
        cc.loader.loadRes("/ui/RanklistUI", (err, res) => {
            let ui = cc.instantiate(res)
            this.node.getChildByName("middle").getChildByName("rank").addChild(ui)
        })
    }

    loadQuestUI() {
        cc.loader.loadRes("/ui/ArenaUI", (err, res) => {
            let ui = cc.instantiate(res)
            this.node.getChildByName("middle").getChildByName("task").addChild(ui)
        })
    }

    loadBaseUI() {
        cc.loader.loadRes("/ui/BaseUI", (err, res) => {
            let ui = cc.instantiate(res)
            this.node.getChildByName("middle").getChildByName("base").addChild(ui)
        })
    }

    async checkBtnTips() {
        let data: any = StaticData.PlayerInfo
        //商店
        let count = data.shop.box;
        let serverData = data.shop.resource;
        let vCount: number = 0
        let sCount: number = 0
        serverData.forEach(d => {
            if (d.type == 0) {
                vCount = d.count;
            } else if (d.type == 1) {
                sCount = d.count;
            }
        });
        this.shopBtnNode.getChildByName('tips').active = count < 2 || vCount < 2 || sCount < 1

        //英雄

        this.checkHeroTips()

        //基地
        let cData: any = data.coinField
        this.baseBtnNode.getChildByName('tips').active = cData.coin > 0
        //任务
        this.taskBtnNode.getChildByName('tips').active = false
        let taskArr: any[] = data.task.task
        if (taskArr) {
            for (var i = 0; i < taskArr.length; i++) {
                let count = taskArr[i].count
                let upCount = taskArr[i].upCount
                let finish = count >= upCount
                let get = taskArr[i].get

                if (finish && !get) {
                    this.taskBtnNode.getChildByName('tips').active = true
                    break
                }
            }
        }

        //成就
        this.achieveBtnNode.getChildByName('tips').active = false
        let achieveArr: any[] = []
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateAchievement', {})
        if (rs.errcode == 200) {
            achieveArr = rs.achievement
            for (let i = 0; i < achieveArr.length; i++) {
                let per = achieveArr[i].value ? achieveArr[i].value : 0
                let state = achieveArr[i].state
                let achieveConfig: any = GameData.Share.getAchieveConfigById(i)
                let isDone = per >= achieveConfig.amount
                if (isDone && !state) {
                    this.achieveBtnNode.getChildByName('tips').active = true
                    break
                }
            }
        }

        //签到
        this.signBtnNode.getChildByName('tips').active = false
        let dayID = data.userSign.index
        let dayArr = data.userSign.state
        for (let i = 0; i < dayID + 1; i++) {
            if (dayArr[i] < 2) {
                this.signBtnNode.getChildByName('tips').active = true
                break
            }
        }
    }

    checkHeroTips() {
        this.heroBtnNode.getChildByName('tips').active = false
        for (let i = 0; i < StaticData.PlayerInfo.heros.length; i++) {
            let herodata: HeroData = StaticData.PlayerInfo.heros[i]
            let pInfo: any = StaticData.PlayerInfo
            let bData: any = pInfo.baseField
            let boxCount: number = bData.boxCount[herodata.type - 1]
            let needBox: number = GameData.Share.getLvlExpData(herodata.level + 1, herodata.quality).block
            let hdConfig: any = GameData.Share.getHeroDataById(herodata.id)
            let canUnlock: boolean = GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv > hdConfig.rr
            if (herodata.curCards > 0 && herodata.curCards >= herodata.nextCards && StaticData.PlayerInfo.coin >= herodata.nextCoin && herodata.has &&
                boxCount >= needBox) {
                this.heroBtnNode.getChildByName('tips').active = true
                break
            } else if (!herodata.has && herodata.curCards > 0 && herodata.curCards >= herodata.nextCards && canUnlock) {
                this.heroBtnNode.getChildByName('tips').active = true
                break
            }
        }
    }


    onDisable() {
        WXApi.HideAuthorizeBtn(false)
    }
}
