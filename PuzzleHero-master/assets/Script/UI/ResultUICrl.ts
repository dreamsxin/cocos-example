import UICrl from "../Lib/UI/UICrl";
import PlayerData, { RewardBox } from "../Mod/PlayerData";
import HeroData from "../Mod/HeroData";
import UIMgr from "../Lib/UI/UIMgr";
import StaticData from "../StaticData";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import SoundMgr from "../Lib/SoundMgr";
import Logger from "../LoggerCrl";
import GameLogicCrl from "../Crl/GameLogicCrl";
import GameData from "../GameData";

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
export default class ResultUICrl extends UICrl {


    @property([cc.Node])
    rsNode: cc.Node[] = []

    @property([cc.Label])
    playeNames: cc.Label[] = []
    // LIFE-CYCLE CALLBACKS:

    @property([cc.Node])
    heroNodes: cc.Node[] = []

    @property(cc.Node)
    rewardNode: cc.Node = null


    @property(cc.Node)
    okBtn: cc.Node = null


    @property(cc.Node)
    uplevelBoxBtn: cc.Node = null
    @property(cc.Node)
    noAdUpplevelBoxBtn: cc.Node = null

    @property(cc.Node)
    getBoxBtn: cc.Node = null

    @property(cc.Node)
    boxLevelUpNode: cc.Node = null

    @property([cc.Node])
    boxLevelItem: cc.Node[] = []

    curBoxSign: string = ""

    curBoxLevel: number = 0
    // onLoad () {}

    @property([cc.Label])
    pLabel: cc.Label[] = []

    start() {
        Logger.record(5)
    }

    async showResult(iswin: boolean, playerdata: PlayerData[]) {

        StaticData.GameStart = false
        this.okBtn.active = false
        if (StaticData.Teaching) {
            StaticData.StageLevel = 1
            this.rsNode[0].getChildByName("increase").active = false
        } else {
            console.log('lose:', WXApi.GetStorage('firstLose'))
            if (WXApi.GetStorage('firstLose') != '1' && WXApi.GetStorage('firstLose') != '2' && !iswin) {
                WXApi.SetStorage('firstLose', 1)
            }
        }
        cc.director.preloadScene("GameMenu", () => { }, () => {
            //this.okBtn.active = true
        })

        await WXApi.HttpPost('/fangkuaiWx/gamePlay', {})

        let battleData: any = GameData.Share.getBattleGroundByGrade(StaticData.StageLevel)

        //统计任务0
        PlayerDataCrl.updateTask(0);
        //统计任务1
        if (iswin) PlayerDataCrl.updateTask(1);
        //统计任务3
        if (GameLogicCrl.Share.blockT4Count.length > 0)
            PlayerDataCrl.updateTask(3, GameLogicCrl.Share.blockT4Count[0]);
        //统计任务4
        if (GameLogicCrl.Share.blockT4Count.length > 1)
            PlayerDataCrl.updateTask(4, GameLogicCrl.Share.blockT4Count[1]);
        //统计任务5
        if (GameLogicCrl.Share.blockT4Count.length > 2)
            PlayerDataCrl.updateTask(5, GameLogicCrl.Share.blockT4Count[2]);
        //统计任务6
        if (GameLogicCrl.Share.blockT4Count.length > 3)
            PlayerDataCrl.updateTask(6, GameLogicCrl.Share.blockT4Count[3]);

        this.uplevelBoxBtn.active = false
        this.noAdUpplevelBoxBtn.active = false

        if (iswin) {
            this.rsNode[0].active = true
            this.rsNode[1].active = false
            SoundMgr.Share.PlaySound("Victory")
            Logger.record(7)

            //this.uplevelBoxBtn.active = true
            this.getBoxBtn.active = false
        } else {
            this.rsNode[0].active = false
            this.rsNode[1].active = true
            SoundMgr.Share.PlaySound("Defeat")
            //this.uplevelBoxBtn.active = false
            this.getBoxBtn.active = true
        }
        this.playeNames[0].string = playerdata[0].nickname
        this.playeNames[1].string = playerdata[1].nickname
        let heros: HeroData[] = [].concat(playerdata[0].heros).concat(playerdata[1].heros)

        for (let i = 0; i < heros.length; i++) {
            cc.loader.loadRes("character/avatar/H" + heros[i].id, (err, res) => {
                let hobj: cc.Node = cc.instantiate(res)
                // hobj.children[0].active = false
                // hobj.children[4].active = false
                // hobj.children[5].active = false
                hobj.getChildByName('full').active = false
                this.heroNodes[i].getChildByName("herohere").removeAllChildren()
                this.heroNodes[i].getChildByName("herohere").addChild(hobj)
            })
        }
        this.rewardNode.active = false
        if (iswin) {
            console.log('玩家剩余血量：', playerdata[0].hp)
            let arr: any[] = []
            if (playerdata[0].hp <= 50) arr.push({ index: 15, value: 1 })
            if (playerdata[0].hp <= 30) arr.push({ index: 16, value: 1 })
            if (playerdata[0].hp <= 10) arr.push({ index: 17, value: 1 })
            arr.push({ index: 18, value: playerdata[0].hp })
            arr.push({ index: 19, value: playerdata[0].hp })
            arr.push({ index: 20, value: playerdata[0].hp })
            PlayerDataCrl.updateAchievement(arr)

            //增加奖杯
            if (!StaticData.Teaching) {
                await WXApi.HttpPost("/fangkuaiWx/updateScore", { score: StaticData.PlayerInfo.score + battleData.winScore })
                this.addCoin()
            }

            let boxs = this.rewardNode.children.filter(box => {
                if (box.name.indexOf("C") > -1) {
                    box.active = false
                    return true
                } else {
                    return false
                }
            })
            let rss = await WXApi.HttpPost("/fangkuaiWx/getBox", { level: StaticData.StageLevel, channel: WXApi.channelID })
            let bcrs = await WXApi.HttpPost("/fangkuaiWx/updateBoxCount", { value: GameLogicCrl.Share.blockT4Count })
            if (bcrs.errcode == 200) {
                PlayerDataCrl.UpdateHeroInfo(bcrs)
            }
            if (rss.errcode == 200) {
                let boxlevel = rss.boxLevel
                boxs[boxlevel].active = true
                this.curBoxSign = rss.boxSign
                this.curBoxLevel = rss.boxlevel
                this.rewardNode.active = true

                if (bcrs.grade < 2) {
                    //前1次胜利不需要看广告
                    this.uplevelBoxBtn.active = false
                    this.noAdUpplevelBoxBtn.active = true
                } else {
                    //胜利超过1次
                    this.uplevelBoxBtn.active = true
                    this.noAdUpplevelBoxBtn.active = false
                }
            } else {
                this.uplevelBoxBtn.active = false
                this.getBoxBtn.active = false
                this.rewardNode.active = false
            }

            this.node.getChildByName('isFull').active = !this.rewardNode.active

            // let data = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            // if (data.errcode == 200) {
            //     PlayerDataCrl.UpdateHeroInfo(data)
            // }

            // this.rewardNode.children.forEach(c => {
            //     if (c.active) {
            //         this.node.getChildByName('isFull').active = true
            //     }
            // });

        } else {
            //段位保护  黄金以上才扣分
            // StaticData.LevelProtected = GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv < 3
            // if (StaticData.PlayerInfo.score >= 100) {
            //     StaticData.PlayerInfo.score = StaticData.PlayerInfo.score - battleData.winScore < 0 ? 0 : StaticData.PlayerInfo.score - battleData.winScore
            // }
            StaticData.PlayerInfo.score = StaticData.PlayerInfo.score - battleData.winScore < 0 ? 0 : StaticData.PlayerInfo.score - battleData.winScore

            if (StaticData.PlayerInfo.score < 0) {
                StaticData.PlayerInfo.score = 0
            }
            if (!StaticData.Teaching)
                await WXApi.HttpPost("/fangkuaiWx/updateScore", { score: StaticData.PlayerInfo.score })
            for (let i = 0; i < GameLogicCrl.Share.blockT4Count.length; i++) {
                GameLogicCrl.Share.blockT4Count[i] = Math.round(GameLogicCrl.Share.blockT4Count[i] / 2)
            }
            let rs = await WXApi.HttpPost("/fangkuaiWx/updateBoxCount", { value: GameLogicCrl.Share.blockT4Count })
            if (rs.errcode == 200) {
                PlayerDataCrl.UpdateHeroInfo(rs)
            }
        }
        for (let i = 0; i < this.pLabel.length; i++) {
            this.pLabel[i].string = "+" + GameLogicCrl.Share.blockT4Count[i].toString()
        }

        this.okBtn.active = true
        let pInfo: any = StaticData.PlayerInfo
        if (pInfo.grade < 2 && iswin && !this.node.getChildByName('isFull').active)
            this.okBtn.active = false

        //StaticData.Teaching = false
    }

    async addCoin() {
        //let lv: number = GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv
        let lv: number = StaticData.StageLevel
        let v: number = GameData.Share.getBattleGroundByGrade(lv).winCoin
        // switch (lv) {
        //     case 0:
        //         v = 5
        //         break
        //     case 1:
        //         v = 5
        //         break
        //     case 2:
        //         v = 10
        //         break
        //     case 3:
        //         v = 15
        //         break
        //     case 4:
        //         v = 20
        //         break
        //     case 5:
        //         v = 25
        //         break
        //     case 6:
        //         v = 30
        //         break
        //     case 7:
        //         v = 40
        //         break
        // }
        this.node.getChildByName('Resource').getChildByName('C').active = true
        this.node.getChildByName('Resource').getChildByName('C').getChildByName('coin').getComponent(cc.Label).string = v.toString()
        await WXApi.HttpPost("/fangkuaiWx/updateCoin", { coin: StaticData.PlayerInfo.coin + v })
    }

    videoLevelUpBox(event, data) {
        let cb: any = async () => {
            Logger.recordTS(23)
            let rs = await WXApi.HttpPost("/fangkuaiWx/updateBox", { boxSign: this.curBoxSign })
            //if (CC_WECHATGAME) {
            this.uplevelBoxBtn.active = false
            this.noAdUpplevelBoxBtn.active = false
            // }
            PlayerDataCrl.UpdateHeroBox(rs.box)
            this.boxLevelUpNode.active = true
            this.boxLevelItem.forEach(box => {
                box.active = false
            })
            this.boxLevelItem[Number(rs.box.level) - 1].active = true

            let boxs = this.rewardNode.children.filter(box => {
                if (box.name.indexOf("C") > -1) {
                    box.active = false
                    return true
                } else {
                    return false
                }
            })
            boxs[rs.box.level].active = true
        }
        //视频升级
        if (parseInt(data) == 0) {
            WXApi.OpenAdVideo(cb, WXApi.getUnitid(9))
        }
        //直接升级 
        else {
            cb()

            this.okBtn.active = true
        }

    }

    closeBoxLevelUpCB() {
        this.boxLevelUpNode.active = false
    }

    videoGetBoxCB() {
        WXApi.OpenAdVideo(async () => {
            Logger.recordTS(22)
            let rs = await WXApi.HttpPost("/fangkuaiWx/getBox", { level: StaticData.StageLevel, channel: WXApi.channelID })
            let boxlevel = rs.boxLevel
            let data = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            if (data.errcode == 200) {
                PlayerDataCrl.UpdateHeroInfo(data)
            }

            let boxs = this.rewardNode.children.filter(box => {
                if (box.name.indexOf("C") > -1) {
                    box.active = false
                    return true
                } else {
                    return false
                }
            })
            boxs[boxlevel].active = true
            this.rewardNode.active = true
            this.getBoxBtn.active = false
        }, WXApi.getUnitid(8))
        //WXApi.OpenShare()
    }

    okBtnCB() {
        StaticData.GameOver = false

        if (StaticData.Teaching) {
            StaticData.Teaching = false
            cc.director.loadScene("GameMenu", () => {
                this.close()
                Logger.record(1)
                UIMgr.Share.showUI("MainUI")
            })
        } else {
            this.close()
            Logger.record(1)
            UIMgr.Share.showUI("RankResultUI")
        }
    }

    // update (dt) {}
}
