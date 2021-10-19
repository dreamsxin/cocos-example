import GameData from "../GameData";
import { RewardBox } from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import OpenBoxCrl from "./OpenBoxCrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";
import Logger from "../LoggerCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShopUI extends cc.Component {

    @property(cc.Node)
    isBuy: cc.Node = null; //购买成功提示界面
    @property(cc.Node)
    hTips: cc.Node = null;//英雄提示
    @property(cc.Node)
    kTips: cc.Node = null;//钥匙提示
    @property(cc.Node)
    dTips: cc.Node = null;//钻石提示
    @property(cc.Node)
    rTips: cc.Node = null;//
    @property(cc.Node)
    gTips: cc.Node = null;//
    @property(cc.Node)
    bTips: cc.Node = null;//
    @property(cc.Node)
    yTips: cc.Node = null;//

    //每日
    @property(cc.Node)
    daily_getBtn: cc.Node = null;//每日 获取按钮
    @property(cc.Node)
    daily_moreBtn: cc.Node = null;//每日 视频获取按钮
    @property(cc.Node)
    daily_doneBtn: cc.Node = null;//每日 售罄按钮
    dailyBoxCount: number = 2;

    //英雄酒馆
    @property(cc.Node)
    node_hero1: cc.Node = null;//英雄酒馆  英雄1节点
    @property(cc.Node)
    node_hero2: cc.Node = null;//英雄酒馆  英雄2节点
    @property(cc.Node)
    node_hero3: cc.Node = null;//英雄酒馆  英雄3节点
    @property(cc.Label)
    hero_refreshTime: cc.Label = null;//英雄酒馆  刷新时间
    refreshTime: number = 0;//刷新时间

    //宝箱库
    @property(cc.Node)
    node_box1: cc.Node = null;//宝箱库 宝箱节点1
    @property(cc.Node)
    node_box2: cc.Node = null;//宝箱库 宝箱节点2
    @property(cc.Node)
    node_box3: cc.Node = null;//宝箱库 宝箱节点3

    //每日资源
    @property(cc.Node)
    node_dRes1: cc.Node = null;//每日资源 节点1
    @property(cc.Node)
    node_dRes2: cc.Node = null;//每日资源 节点2
    @property(cc.Node)
    node_dRes3: cc.Node = null;//每日资源 节点3
    @property(cc.Node)
    node_dRes4: cc.Node = null;//每日资源 节点4
    @property(cc.Node)
    node_dRes5: cc.Node = null;//每日资源 节点5
    @property(cc.Node)
    node_dRes6: cc.Node = null;//每日资源 节点6
    videoCount: number = 2;
    shareCount: number = 1;
    redCount: number = 1;
    greenCount: number = 1;
    blueCount: number = 1;
    yellowCount: number = 1;

    buyingDB: boolean = false
    buyingHero: boolean = false
    buyingBox: boolean = false
    buyingDR: boolean = false
    buyingD: boolean = false
    refreshing: boolean = false

    onLoad() {

    }

    onEnable() {

    }

    start() {
        this.isBuy.on(cc.Node.EventType.TOUCH_END.toString(), () => {
            this.isBuy.active = false;
        })
        this.initDailyBox();
        this.initHero();
        this.initDailyRes();

        this.schedule(this.updateRefreshTime, 1);
    }

    //初始化每日宝箱
    initDailyBox() {
        this.daily_getBtn.active = false;
        this.daily_moreBtn.active = false;
        this.daily_doneBtn.active = false;
        let data: any = StaticData.PlayerInfo;
        let count = data.shop.box;
        switch (count) {
            case 0:
                this.daily_getBtn.active = true;
                break;
            case 1:
                this.daily_moreBtn.active = true;
                break;
            case 2:
                this.daily_doneBtn.active = true;
                break;
        }
        this.dailyBoxCount = 2 - count;
    }
    //初始化英雄酒馆
    initHero() {
        let data: any = StaticData.PlayerInfo;
        let serverData: any[] = data.shop.heros;

        //刷新时间
        let t = data.shop.flushTimestamp - new Date().getTime();
        this.refreshTime = Math.floor(t / 1000);
        //this.hero_refreshTime.string = Math.floor(data.shop.flushTimestamp / 1000).toString();

        serverData.forEach(sd => {
            let hNode: cc.Node = null;
            let index = serverData.indexOf(sd);
            switch (index) {
                case 0:
                    hNode = this.node_hero1;
                    break;
                case 1:
                    hNode = this.node_hero2;
                    break;
                case 2:
                    hNode = this.node_hero3;
                    break;
            }

            let heroHere = hNode.getChildByName('heroHere');
            heroHere.removeAllChildren();
            let name = hNode.getChildByName('name');
            let amount = hNode.getChildByName('amount');
            let buyBtn = hNode.getChildByName('buy');
            let doneBtn = hNode.getChildByName('done');
            let costStr = buyBtn.getChildByName('price');

            let hData = GameData.Share.getHeroDataById(sd.heroId);
            cc.loader.loadRes('character/avatar/H' + sd.heroId, (err, res) => {
                let heronode: cc.Node = cc.instantiate(res)
                //heronode.position = cc.v2(0, -10);
                // heronode.children[0].active = false
                // heronode.children[4].active = false
                // heronode.children[5].active = false
                heronode.getChildByName('full').active = false
                heroHere.addChild(heronode);
            });
            name.getComponent(cc.Label).string = hData.name;
            amount.getComponent(cc.Label).string = sd.count;
            costStr.getComponent(cc.Label).string = sd.coin;
            buyBtn.active = sd.got == 0;
            doneBtn.active = sd.got != 0;
            //处理史诗  传说
            if (index == 2) {
                let q = hData.quality;
                hNode.getChildByName('r0').active = q == 2;
                hNode.getChildByName('r1').active = q == 3;
                costStr.getComponent(cc.Label).string = sd.gold;
            }
        })

    }
    //初始化宝箱库
    initBox() {

    }
    //初始化每日资源
    initDailyRes() {
        let data: any = StaticData.PlayerInfo;
        let serverData = data.shop.resource;
        let vCount = this.node_dRes1.getChildByName('get').getChildByName('count');
        let sCount = this.node_dRes2.getChildByName('get').getChildByName('count');
        let rCount = this.node_dRes3.getChildByName('get').getChildByName('count');
        let gCount = this.node_dRes4.getChildByName('get').getChildByName('count');
        let bCount = this.node_dRes5.getChildByName('get').getChildByName('count');
        let yCount = this.node_dRes6.getChildByName('get').getChildByName('count');

        serverData.forEach(d => {
            if (d.type == 0) {
                this.videoCount = 5 - d.count < 0 ? 0 : 5 - d.count
            } else if (d.type == 2) {
                this.shareCount = 5 - d.count < 0 ? 0 : 5 - d.count
            } else if (d.type == 3) {
                this.redCount = 1 - d.count < 0 ? 0 : 1 - d.count
            } else if (d.type == 4) {
                this.greenCount = 1 - d.count < 0 ? 0 : 1 - d.count
            } else if (d.type == 5) {
                this.blueCount = 1 - d.count < 0 ? 0 : 1 - d.count
            } else if (d.type == 6) {
                this.yellowCount = 1 - d.count < 0 ? 0 : 1 - d.count
            }
        });
        vCount.getComponent(cc.Label).string = this.videoCount.toString();
        sCount.getComponent(cc.Label).string = this.shareCount.toString();
        rCount.getComponent(cc.Label).string = this.redCount.toString();
        gCount.getComponent(cc.Label).string = this.greenCount.toString();
        bCount.getComponent(cc.Label).string = this.blueCount.toString();
        yCount.getComponent(cc.Label).string = this.yellowCount.toString();

        let videoNode = this.node_dRes2.getChildByName('get').getChildByName('videoNode');
        let shareNode = this.node_dRes2.getChildByName('get').getChildByName('shareNode');
        videoNode.active = true//WXApi.isValid;
        shareNode.active = false//!WXApi.isValid;

        // let vBtn = this.node_dRes1.getChildByName('get').getComponent(cc.Button);
        // let sBtn = this.node_dRes2.getChildByName('get').getComponent(cc.Button);
        // vBtn.interactable = this.videoCount > 0;
        // sBtn.interactable = this.shareCount > 0;
        this.node_dRes1.getChildByName('get').getComponent(cc.Button).interactable = this.videoCount > 0;
        this.node_dRes2.getChildByName('get').getComponent(cc.Button).interactable = this.shareCount > 0;
        this.node_dRes3.getChildByName('get').getComponent(cc.Button).interactable = this.redCount > 0;
        this.node_dRes4.getChildByName('get').getComponent(cc.Button).interactable = this.greenCount > 0;
        this.node_dRes5.getChildByName('get').getComponent(cc.Button).interactable = this.blueCount > 0;
        this.node_dRes6.getChildByName('get').getComponent(cc.Button).interactable = this.yellowCount > 0;


        this.buyingDR = false
    }

    //点击每日宝箱
    async clickDailyBox() {
        if (this.dailyBoxCount <= 0 || this.buyingDB) {
            return;
        }
        this.buyingDB = true

        let cb = async function () {
            //请求服务器
            let data = await WXApi.HttpPost("/fangkuaiWx/buyBox", {
                coin: 0,
                gold: 0,
                boxId: 1,
                source: 1
            })
            if (data.errcode != 200) {
                WXApi.tipsDialog(data.info)
                this.buyingDB = false
                return
            }

            let boxData = data.property;
            console.log('打开每日箱子:', data);

            switch (this.dailyBoxCount) {
                case 2:
                    Logger.record(17);
                    Logger.recordTS(19)
                    break;
                case 1:
                    Logger.record(18);
                    Logger.recordTS(20)
                    break;
            }
            //打开高级宝箱
            let box = new RewardBox()
            box.coin = boxData.coin
            box.cards = boxData.card
            box.heros = boxData.hero
            box.level = 1;
            box.opentimeInv = Number(boxData.opentime)
            box.nkey = Number(boxData.key)
            box.exLevel = 8

            let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
            ui.showBox(box)

            PlayerDataCrl.UpdateHeroInfo(data)
            GameMenuUI.Share.refrashUI();

            this.initDailyBox();
            this.buyingDB = false
        }.bind(this);
        if (this.dailyBoxCount == 2) {
            //直接打开
            cb();
        } else if (this.dailyBoxCount == 1) {
            //播放视频
            WXApi.OpenAdVideo(cb, WXApi.getUnitid(5));
            this.buyingDB = false
        }
    }

    //点击购买英雄碎片
    async clickHeroCards(event, data) {
        if (this.buyingHero) return
        this.buyingHero = true

        let id = Math.floor(data);
        let pData: any = StaticData.PlayerInfo;

        if (StaticData.PlayerInfo.coin < pData.shop.heros[id - 1].coin) {
            WXApi.showFreeMoneyUI()
            this.buyingHero = false
            return
        }

        //向服务器请求购买
        let rs = await WXApi.HttpPost('/fangkuaiWx/buyHero', {
            coin: pData.shop.heros[id - 1].coin,
            gold: pData.shop.heros[id - 1].gold,
            heroId: pData.shop.heros[id - 1].heroId,
        });
        let resp = rs.errcode == 200;
        if (!resp) {
            WXApi.tipsDialog(rs.info)
            this.buyingHero = false
            return
        }

        console.log('购买英雄卡片：', rs);
        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();

        //请求成功  展示物品
        this.showBuyTips(1)

        let serverData: any[] = pData.shop.heros;
        cc.loader.loadRes('character/avatar/H' + serverData[id - 1].heroId, (err, res) => {
            let heronode: cc.Node = cc.instantiate(res)
            // heronode.position = cc.v2(0, -10);
            // heronode.children[0].active = false
            // heronode.children[4].active = false
            // heronode.children[5].active = false
            heronode.getChildByName('full').active = false
            this.hTips.getChildByName('heroHere').removeAllChildren();
            this.hTips.getChildByName('heroHere').addChild(heronode);
        });
        let hData = GameData.Share.getHeroDataById(serverData[id - 1].heroId);
        this.hTips.getChildByName('name').getComponent(cc.Label).string = hData.name;
        this.hTips.getChildByName('amount').getComponent(cc.Label).string = serverData[id - 1].count;
        let rNode = this.hTips.getChildByName('rank');
        for (let i = 0; i < 4; i++) {
            rNode.children[i].active = i == hData.quality;
        }

        //刷新界面
        this.initHero();
        this.buyingHero = false
    }

    //刷新英雄酒馆
    async refreshHero() {
        if (this.refreshing) return
        this.refreshing = true
        //播放视频
        WXApi.OpenAdVideo(async () => {
            let rs = await WXApi.HttpPost('/fangkuaiWx/flushShopHero', {});
            if (rs.errcode != 200) {
                WXApi.tipsDialog(rs.info)
                this.refreshing = false
                return
            }
            PlayerDataCrl.UpdateHeroInfo(rs)
            GameMenuUI.Share.refrashUI();
            this.initHero();
            Logger.record(19);
            this.refreshing = false
        }, WXApi.getUnitid(2));

        this.refreshing = false
    }

    //点击宝箱库
    async clickBox(event, data) {
        if (this.buyingBox) return
        this.buyingBox = true

        let id = Math.floor(data);
        let c = 0;
        let g = 0;
        let bId = id + 1;
        switch (id) {
            case 1:
                c = 1000;
                g = 0;
                break;
            case 2:
                c = 0;
                g = 300;
                break;
            case 3:
                c = 0;
                g = 1200;
                break;
        }

        if (StaticData.PlayerInfo.coin < c) {
            WXApi.showFreeMoneyUI()
            this.buyingBox = false
            return
        }

        //请求服务器
        let rs = await WXApi.HttpPost("/fangkuaiWx/buyBox", {
            coin: c,
            gold: g,
            boxId: bId,
            source: 2
        })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.buyingBox = false
            return;
        }

        let boxData = rs.property;
        console.log('打开宝箱库:', rs);
        let box = new RewardBox()
        box.coin = boxData.coin
        box.cards = boxData.card
        box.heros = boxData.hero
        box.level = id + 1;
        box.opentimeInv = Number(boxData.opentime)
        box.nkey = Number(boxData.key)

        let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
        ui.showBox(box)

        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();
        this.buyingBox = false
    }

    //点击购买钻石
    async clickBuyDiamond(event, data) {
        if (this.buyingD) return
        this.buyingD = true

        let id = Math.floor(data);
        let gold = 80;
        switch (id) {
            case 1:
                gold = 80;
                break;
            case 2:
                gold = 500;
                break;
            case 3:
                gold = 1200;
                break;
            case 4:
                gold = 2500;
                break;
            case 5:
                gold = 6500;
                break;
            case 6:
                gold = 14000;
                break;
        }
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateGold', {
            gold: StaticData.PlayerInfo.gold + gold
        })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.buyingD = false
            return
        }
        //请求成功  展示物品
        this.showBuyTips(3)

        this.dTips.getChildByName('New Label').getComponent(cc.Label).string = '钻石x' + gold.toString();

        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();
        this.buyingD = false
    }

    //点击每日资源
    async clickDailyRes(event, data) {
        if (this.buyingDR) return
        this.buyingDR = true

        let id = Math.floor(data);
        if (id == 1) {
            if (this.videoCount <= 0) return;
            //播放视频
            WXApi.OpenAdVideo(async () => {
                // let rs = await WXApi.HttpPost('/fangkuaiWx/updateDateResource', { resourceType: 1 })
                // if (rs.errcode != 200) {
                //     WXApi.tipsDialog(rs.info)
                //     return
                // }
                Logger.recordTS(17)
                let rs = await WXApi.HttpPost('/fangkuaiWx/updateGold', {
                    gold: StaticData.PlayerInfo.gold + 60,
                    source: 0
                })
                if (rs.errcode != 200) {
                    WXApi.tipsDialog(rs.info)
                    this.buyingDR = false
                    return
                }
                //请求成功  展示物品
                this.showBuyTips(3)
                this.dTips.getChildByName('New Label').getComponent(cc.Label).string = '钻石 x 60';

                PlayerDataCrl.UpdateHeroInfo(rs)
                GameMenuUI.Share.refrashUI();
                this.initDailyRes();
                Logger.record(20);
            }, WXApi.getUnitid(4));
        } else if (id == 2) {
            if (this.shareCount <= 0) return;

            if (true/* WXApi.isValid */) {
                //播放视频
                WXApi.OpenAdVideo(async () => {
                    Logger.recordTS(18)
                    let rs = await WXApi.HttpPost('/fangkuaiWx/updateDateResource', { resourceType: 2 })
                    if (rs.errcode != 200) {
                        WXApi.tipsDialog(rs.info)
                        return
                    }
                    rs = await WXApi.HttpPost('/fangkuaiWx/updateCoin', {
                        coin: StaticData.PlayerInfo.coin + 200,
                    })
                    if (rs.errcode != 200) {
                        WXApi.tipsDialog(rs.info)
                        this.buyingDR = false
                        return
                    }
                    //请求成功  展示物品
                    this.showBuyTips(2)

                    StaticData.PlayerInfo = rs
                    PlayerDataCrl.UpdateHeroInfo(rs)
                    GameMenuUI.Share.refrashUI();
                    this.initDailyRes();
                    Logger.record(21);
                }, WXApi.getUnitid(3));
            } else {
                //分享
                WXApi.OpenShare('', {}, '', '', async () => {
                    let rs = await WXApi.HttpPost('/fangkuaiWx/updateKey', {
                        key: StaticData.PlayerInfo.key + 50,
                        source: 0
                    })
                    if (rs.errcode != 200) {
                        WXApi.tipsDialog(rs.info)
                        this.buyingDR = false
                        return
                    }
                    //请求成功  展示物品
                    this.showBuyTips(2)

                    StaticData.PlayerInfo = rs
                    PlayerDataCrl.UpdateHeroInfo(rs)
                    GameMenuUI.Share.refrashUI();
                    this.initDailyRes();
                    Logger.record(21);
                })
            }
        } else {
            WXApi.OpenAdVideo(async () => {
                let rs = await WXApi.HttpPost('/fangkuaiWx/updateDateResource', { resourceType: id })
                if (rs.errcode != 200) {
                    WXApi.tipsDialog(rs.info)
                    return
                }
                let arr: any[] = [0, 0, 0, 0]
                arr[id - 3] = 50
                rs = await WXApi.HttpPost("/fangkuaiWx/updateBoxCount", { value: arr })
                if (rs.errcode != 200) {
                    WXApi.tipsDialog(rs.info)
                    this.buyingDR = false
                    return
                }
                //请求成功  展示物品
                this.showBuyTips(id + 1)

                StaticData.PlayerInfo = rs
                PlayerDataCrl.UpdateHeroInfo(rs)
                GameMenuUI.Share.refrashUI();
                this.initDailyRes();
            })

        }

        this.buyingDR = false
    }

    showBuyTips(id: number) {
        this.isBuy.active = true;
        for (let i = 1; i < this.isBuy.childrenCount; i++) {
            this.isBuy.children[i].active = id == i
        }
    }

    updateRefreshTime() {
        if (this.refreshTime <= 0) {
            //刷新
            let cb = async () => {
                let rs = await WXApi.HttpPost('/fangkuaiWx/flushShopHero', {});
                if (rs.errcode != 200) {
                    WXApi.tipsDialog(rs.info)
                    return
                }
                PlayerDataCrl.UpdateHeroInfo(rs)
                GameMenuUI.Share.refrashUI();
                this.initHero();
                Logger.record(19);
            }
            cb();
            return;
        }
        this.refreshTime--;
    }

    update(dt) {
        if (this.refreshTime > 0) {
            var time: number = this.refreshTime;
            var h = Math.floor(time / 3600);
            var m = Math.floor((time - h * 3600) / 60);
            var s = Math.floor(time - h * 3600 - m * 60);
            var hStr = h.toString();
            var mStr = m.toString();
            var sStr = s.toString();
            if (h < 10) {
                hStr = '0' + hStr;
            }
            if (m < 10) {
                mStr = '0' + mStr;
            }
            if (s < 10) {
                sStr = '0' + sStr;
            }
            this.hero_refreshTime.string = hStr + ':' + mStr + ':' + sStr;
        }
    }
}
