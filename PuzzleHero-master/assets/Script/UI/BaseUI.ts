import StaticData from "../StaticData";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameData from "../GameData";
import GameMenuUI from "./GameMenuUI";
import { RewardBox } from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import OpenBoxCrl from "./OpenBoxCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaseUI extends cc.Component {

    @property(cc.Node)
    baseMentNode: cc.Node = null

    @property(cc.Node)
    coinNode: cc.Node = null

    // @property(cc.Node)
    // shopNode: cc.Node = null

    @property(cc.Node)
    baseInfo: cc.Node = null

    @property(cc.Node)
    goldInfo: cc.Node = null


    @property(cc.Node)
    cCoin: cc.Node = null
    @property(cc.Node)
    cCoinUp: cc.Node = null
    @property(cc.Node)
    nCoin: cc.Node = null
    @property(cc.Node)
    nCoinUp: cc.Node = null
    @property(cc.Node)
    coinUpgrade: cc.Node = null


    coinUpdateTime: number = 1080
    shopUpdateTime: number = 6 * 3600

    getingCoin: boolean = false
    updateingCoin: boolean = false
    getingBounes: boolean = false

    onLoad() { }

    start() {

    }

    onEnable() {
        this.schedule(this.decCoinTime, 1)
        this.schedule(this.decShopTime, 1)

        this.initBase()
        this.initCoin()
        //this.initShop()
        this.initFightBounes()
    }

    initBase() {
        let pInfo: any = StaticData.PlayerInfo;
        let bData: any = pInfo.baseField;

        let hpLabel = this.baseMentNode.getChildByName('bhp').getComponent(cc.Label)
        let baseBar = this.baseMentNode.getChildByName('progressBar').getComponent(cc.ProgressBar)
        let thislvl = this.baseMentNode.getChildByName('thislvl').getComponent(cc.Label)
        let expc = baseBar.node.getChildByName('expc').getComponent(cc.Label)
        let expr = baseBar.node.getChildByName('expr').getComponent(cc.Label)
        let car = this.baseMentNode.getChildByName('BaseIcon').getChildByName('car')

        let rBar = this.baseMentNode.getChildByName('rl')
        let gBar = this.baseMentNode.getChildByName('gl')
        let bBar = this.baseMentNode.getChildByName('bl')
        let yBar = this.baseMentNode.getChildByName('yl')

        let rNum = rBar.getChildByName('limit').getComponent(cc.Label)
        let gNum = gBar.getChildByName('limit').getComponent(cc.Label)
        let bNum = bBar.getChildByName('limit').getComponent(cc.Label)
        let yNum = yBar.getChildByName('limit').getComponent(cc.Label)

        hpLabel.string = pInfo.hp
        baseBar.progress = bData.expCount / bData.upCount
        expc.string = bData.expCount
        expr.string = bData.upCount
        thislvl.string = bData.level
        let boxArr: any[] = bData.boxCount
        rNum.string = bData.boxUpCount//boxArr[0]
        gNum.string = bData.boxUpCount//boxArr[1]
        bNum.string = bData.boxUpCount//boxArr[2]
        yNum.string = bData.boxUpCount//boxArr[3]

        car.children.forEach(n => {
            n.active = false
        });
        let carIndex: any = Math.floor((bData.level - 1) / 3)
        if (bData.level >= 13) carIndex = 4
        car.children[carIndex].active = true

        this.initBaseInfo()
    }
    initBaseInfo() {
        let pInfo: any = StaticData.PlayerInfo;
        let bData: any = pInfo.baseField;

        this.baseInfo.getChildByName('baseLvl').getComponent(cc.Label).string = bData.level
        //当前
        this.baseInfo.getChildByName('thisLable').getChildByName('hp').getComponent(cc.Label).string = pInfo.hp
        this.baseInfo.getChildByName('thisLable').getChildByName('r').getComponent(cc.Label).string = bData.boxUpCount
        this.baseInfo.getChildByName('thisLable').getChildByName('g').getComponent(cc.Label).string = bData.boxUpCount
        this.baseInfo.getChildByName('thisLable').getChildByName('b').getComponent(cc.Label).string = bData.boxUpCount
        this.baseInfo.getChildByName('thisLable').getChildByName('y').getComponent(cc.Label).string = bData.boxUpCount
        //下一级
        let nData: any = GameData.Share.getBasementConfig(bData.level + 1)
        console.log('nData:', bData.level + 1)
        this.baseInfo.getChildByName('nextLable').getChildByName('hp').getComponent(cc.Label).string = nData.hp
        this.baseInfo.getChildByName('nextLable').getChildByName('r').getComponent(cc.Label).string = nData.colorB
        this.baseInfo.getChildByName('nextLable').getChildByName('g').getComponent(cc.Label).string = nData.colorB
        this.baseInfo.getChildByName('nextLable').getChildByName('b').getComponent(cc.Label).string = nData.colorB
        this.baseInfo.getChildByName('nextLable').getChildByName('y').getComponent(cc.Label).string = nData.colorB

        this.baseInfo.getChildByName('this').getComponent(cc.Label).string = bData.level
        this.baseInfo.getChildByName('next').getComponent(cc.Label).string = bData.level + 1
        this.baseInfo.getChildByName('count').getComponent(cc.Label).string = bData.expCount
        this.baseInfo.getChildByName('request').getComponent(cc.Label).string = bData.upCount

        this.baseInfo.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = bData.expCount / bData.upCount

        let car = this.baseInfo.getChildByName('BaseIcon').getChildByName('car')
        car.children.forEach(n => {
            n.active = false
        });
        let carIndex: any = Math.floor((bData.level - 1) / 3)
        if (bData.level >= 13) carIndex = 4
        car.children[carIndex].active = true
    }

    initCoin() {
        let pInfo: any = StaticData.PlayerInfo;
        let cData: any = pInfo.coinField;

        let thislvl = this.coinNode.getChildByName('thislvl').getComponent(cc.Label)
        let amount = this.coinNode.getChildByName('amount').getComponent(cc.Label)

        thislvl.string = cData.level;
        amount.string = cData.coin;

        this.coinNode.getChildByName('get').getComponent(cc.Button).interactable = cData.coin > 0

        this.coinUpdateTime = Math.floor((cData.updateTime + 1080000 - new Date().getTime()) / 1000)

        console.log('this.coinUpdateTime:', this.coinUpdateTime)

        this.goldInfo.getChildByName('baseLvl').getComponent(cc.Label).string = cData.level
        this.coinNode.getChildByName('limit').getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level).cap
        this.coinNode.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = cData.coin / GameData.Share.getMineConfigByLv(cData.level).cap
        this.cCoin.getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level).cap
        this.cCoinUp.getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level).cap
        this.nCoin.getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).cap
        this.nCoinUp.getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).cap

        this.coinUpgrade.getChildByName('c').getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).cr
        this.coinUpgrade.getChildByName('r').getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).br
        this.coinUpgrade.getChildByName('g').getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).br
        this.coinUpgrade.getChildByName('b').getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).br
        this.coinUpgrade.getChildByName('y').getComponent(cc.Label).string = GameData.Share.getMineConfigByLv(cData.level + 1).br

        if (cData.coin >= GameData.Share.getMineConfigByLv(cData.level).cap) {
            this.coinNode.getChildByName('collecting').getComponent(cc.Animation).stop()
        } else {
            this.coinNode.getChildByName('collecting').getComponent(cc.Animation).play()
        }

        this.goldInfo.getChildByName('upgrade').active = cData.level < 10
    }
    async decCoinTime() {
        if (!this.node.active) {
            return
        }

        this.coinUpdateTime--
        if (this.coinUpdateTime < 0) {
            let rs = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            if (rs.errcode == 200) {
                PlayerDataCrl.UpdateHeroInfo(rs)
                GameMenuUI.Share.refrashUI();
            }
            this.initCoin()
        }
    }
    controlBaseInfo() {
        this.baseInfo.active = !this.baseInfo.active;
    }

    controlCoinInfo() {
        this.goldInfo.active = !this.goldInfo.active;
    }

    async getCoinCB() {
        if (this.getingCoin) return
        this.getingCoin = true

        let rs = await WXApi.HttpPost("/fangkuaiWx/receiveCoin", {})
        if (rs.errcode == 200) {
            PlayerDataCrl.UpdateHeroInfo(rs)
            GameMenuUI.Share.refrashUI();
        } else {
            WXApi.tipsDialog(rs.info)
        }
        this.initCoin()
        this.getingCoin = false
    }

    async updateCoinLevel() {
        if (this.updateingCoin) return
        this.updateingCoin = true

        let cb: Function = async () => {
            let rs = await WXApi.HttpPost("/fangkuaiWx/updateCoinLevel", { channel: WXApi.channelID })
            if (rs.errcode == 200) {

                this.goldInfo.getChildByName('lvlup').getComponent(cc.Animation).play()

                PlayerDataCrl.UpdateHeroInfo(rs)
                GameMenuUI.Share.refrashUI();
            } else {
                //WXApi.tipsDialog(rs.info)
                // if (rs.info == "升级所需金币不足") {
                //     WXApi.showFreeMoneyUI()
                // }
            }
            this.initCoin()
        }
        WXApi.OpenAdVideo(cb, null, '升级失败!请完整观看视频')

        this.updateingCoin = false
    }

    // initShop() {
    //     let pInfo: any = StaticData.PlayerInfo;
    //     let sData: any = pInfo.smallShop;
    //     for (let i = 0; i < sData.goodsList.length; i++) {
    //         let gNode = this.shopNode.getChildByName('G' + (i + 1))
    //         let amount = gNode.getChildByName('amount').getComponent(cc.Label)
    //         let buy = gNode.getChildByName('buy')
    //         let done = gNode.getChildByName('done')

    //         let index = sData.goodsList[i].index
    //         let got = sData.goodsList[i].got
    //         let shopConfig = GameData.Share.getBaseShopById(index)
    //         let item = shopConfig.item
    //         let resource = shopConfig.resource
    //         gNode.getChildByName('item').children.forEach(n => {
    //             n.active = false
    //         });
    //         switch (item) {
    //             case 'coin':
    //                 gNode.getChildByName('item').getChildByName('c').active = true
    //                 break;
    //             case 'key':
    //                 gNode.getChildByName('item').getChildByName('k').active = true
    //                 break;
    //             case 'red':
    //                 gNode.getChildByName('item').getChildByName('r').active = true
    //                 break;
    //             case 'green':
    //                 gNode.getChildByName('item').getChildByName('g').active = true
    //                 break;
    //             case 'blue':
    //                 gNode.getChildByName('item').getChildByName('b').active = true
    //                 break;
    //             case 'yellow':
    //                 gNode.getChildByName('item').getChildByName('y').active = true
    //                 break;
    //         }
    //         for (var j = 1; j < gNode.getChildByName('buy').childrenCount; j++) {
    //             gNode.getChildByName('buy').children[j].active = false
    //         }
    //         switch (resource) {
    //             case 'coin':
    //                 gNode.getChildByName('buy').getChildByName('c').active = true
    //                 break;
    //             case 'gold':
    //                 gNode.getChildByName('buy').getChildByName('d').active = true
    //                 break;
    //             case 'red':
    //                 gNode.getChildByName('buy').getChildByName('r').active = true
    //                 break;
    //             case 'green':
    //                 gNode.getChildByName('buy').getChildByName('g').active = true
    //                 break;
    //             case 'blue':
    //                 gNode.getChildByName('buy').getChildByName('b').active = true
    //                 break;
    //             case 'yellow':
    //                 gNode.getChildByName('buy').getChildByName('y').active = true
    //                 break;
    //         }

    //         amount.string = shopConfig.amount
    //         buy.getChildByName('price').getComponent(cc.Label).string = shopConfig.price
    //         done.active = got
    //         buy.active = !got
    //     }

    //     this.shopUpdateTime = Math.floor((sData.updateTime + (3600000 * 6) - new Date().getTime()) / 1000)
    // }

    initFightBounes() {
        let pInfo: any = StaticData.PlayerInfo
        let count: number = pInfo.flushGrade > 5 ? 5 : pInfo.flushGrade

        let questNode: cc.Node = this.node.getChildByName('quest')
        let bar: cc.ProgressBar = questNode.getChildByName('progressBar').getComponent(cc.ProgressBar)
        let cNum: cc.Label = questNode.getChildByName('progressBar').getChildByName('amount').getComponent(cc.Label)
        let getBtn: cc.Button = questNode.getChildByName('get').getComponent(cc.Button)

        bar.progress = count / 5
        cNum.string = count.toString()
        getBtn.interactable = count >= 5
    }

    async getBounes() {
        if (this.getingBounes) return
        this.getingBounes = true

        //请求服务器
        let data = await WXApi.HttpPost("/fangkuaiWx/buyBox", {
            coin: 0,
            gold: 0,
            boxId: 2,
            source: 3
        })
        if (data.errcode != 200) {
            this.getingBounes = false
            return;
        }
        await WXApi.HttpPost('/fangkuaiWx/resetFlushGrade', {})

        let boxData = data.property;
        //打开高级宝箱
        let box = new RewardBox()
        box.coin = boxData.coin
        box.cards = boxData.card
        box.heros = boxData.hero
        box.level = 1;
        box.opentimeInv = Number(boxData.opentime)
        box.nkey = Number(boxData.key)
        box.exLevel = 6
        let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
        ui.showBox(box)
        PlayerDataCrl.UpdateHeroInfo(data)
        GameMenuUI.Share.refrashUI();
        this.initFightBounes()
        this.getingBounes = false
    }


    async buyCoin(event, data) {
        this.node.getChildByName('blockTouch').active = true
        let id = parseInt(data)
        let pInfo: any = StaticData.PlayerInfo;
        let sData: any = pInfo.smallShop;
        let index = 1
        index = sData.goodsList[id].index
        let rs = await WXApi.HttpPost("/fangkuaiWx/smallShopGet", { index: index })
        if (rs.errcode == 200) {
            let rs1 = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            PlayerDataCrl.UpdateHeroInfo(rs1)
            GameMenuUI.Share.refrashUI()
        } else {
            WXApi.tipsDialog(rs.info)
        }
        this.node.getChildByName('blockTouch').active = false
        this.initBase()
        //this.initShop()
    }

    decShopTime() {
        this.shopUpdateTime--
        if (this.shopUpdateTime <= 0) {
            this.refreshShop()
        }
    }

    async refreshShop() {
        let rs = await WXApi.HttpPost("/fangkuaiWx/smallShopFlush", {})
        if (rs.errcode == 200) {
            let rs1 = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            PlayerDataCrl.UpdateHeroInfo(rs1)
            GameMenuUI.Share.refrashUI()
        }
        //this.initShop()
    }

    shopRefreshBtnCB() {
        WXApi.OpenAdVideo(() => {
            this.refreshShop()
        })
    }

    update(dt) {
        // if (this.shopUpdateTime >= 0) {
        //     var time: number = this.shopUpdateTime;
        //     var h = Math.floor(time / 3600);
        //     var m = Math.floor((time - h * 3600) / 60);
        //     var s = Math.floor(time - h * 3600 - m * 60);
        //     var hStr = h.toString();
        //     var mStr = m.toString();
        //     var sStr = s.toString();
        //     if (h < 10) {
        //         hStr = '0' + hStr;
        //     }
        //     if (m < 10) {
        //         mStr = '0' + mStr;
        //     }
        //     if (s < 10) {
        //         sStr = '0' + sStr;
        //     }
        //     this.shopNode.getChildByName('time').getComponent(cc.Label).string = hStr + ':' + mStr + ':' + sStr;
        // }
    }
}
