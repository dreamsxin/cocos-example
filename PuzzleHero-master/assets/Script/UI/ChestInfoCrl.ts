import UICrl from "../Lib/UI/UICrl";
import PlayerData, { RewardBox } from "../Mod/PlayerData";
import GameData from "../GameData";
import OpenBoxCrl from "./OpenBoxCrl";
import UIMgr from "../Lib/UI/UIMgr";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import StaticData from "../StaticData";
import GameMenuUI from "./GameMenuUI";
import Logger from "../LoggerCrl";

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
export default class ChestInfoCrl extends UICrl {

    @property([cc.Label])
    coinLabel: cc.Label[] = []

    @property([cc.Label])
    heroLabel: cc.Label[] = []

    @property([cc.Label])
    perLabel: cc.Label[] = []

    @property(cc.Label)
    needKeys: cc.Label = null

    @property(cc.Label)
    countDownTime: cc.Label = null

    @property(cc.Node)
    unlockNode: cc.Node = null

    @property(cc.Label)
    speedTime: cc.Label = null

    needGold: number = 999

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    curBox: RewardBox

    start() {
        // cc.log("chest open run")
    }

    showInfoBox(data: RewardBox) {
        this.curBox = data
        let chests = this.node.getChildByName("chest").children
        for (let i = 0; i < chests.length; i++) {
            if (data.level == i) {
                chests[i].active = true
                let coin = GameData.Share.BoxConfig[i].coin
                let cards = GameData.Share.BoxConfig[i].heros
                this.coinLabel[0].string = coin[0]
                this.coinLabel[1].string = coin[1]
                let idxlabel = 0
                for (let j = 0; j < cards.length; j++) {
                    // this.heroLabel[idxlabel++].string = cards[j][0].toString()
                    // this.heroLabel[idxlabel++].string = cards[j][1].toString()
                    this.perLabel[idxlabel++].string = cards[j][0].toString() + '%'
                }
                this.needKeys.string = (data.nkey).toFixed()
                this.node.getChildByName('directKey').getChildByName('rk').getComponent(cc.Label).string = (data.nkey).toFixed()
                this.needGold = data.nkey
                this.speedTime.string = data.speedTimes.toString()
                let now = new Date().getTime()
                let difftime = now - (this.curBox.gettime + this.curBox.opentimeInv)
                if (data.unlock) {
                    //已经解锁
                    this.unlockNode.active = true
                    if (difftime < 0) {
                        //正在倒计时
                        this.unlockNode.getChildByName('open').active = false
                    } else {
                        //倒计时结束
                        this.unlockNode.getChildByName('open').active = true
                    }
                } else {
                    //未解锁
                    this.unlockNode.active = false
                    //其他宝箱是否在解锁中
                    let otherUnlocking: boolean = false
                    for (let i = 0; i < StaticData.PlayerInfo.boxs.length; i++) {
                        if (StaticData.PlayerInfo.boxs[i].id == data.id) continue
                        if (StaticData.PlayerInfo.boxs[i].unlock) {
                            otherUnlocking = true
                            break
                        }
                    }
                    this.node.getChildByName('tips').active = otherUnlocking
                }

            } else {
                chests[i].active = false
            }
        }
        cc.log(data)
    }

    update(dt) {
        if (!this.unlockNode.active) {
            return
        }
        if (this.curBox != null) {
            let now = new Date().getTime()
            let difftime = now - (this.curBox.gettime + this.curBox.opentimeInv)
            if (difftime < 0) {
                let hour = Math.floor(Math.abs((difftime / 1000 / 60 / 60)))
                let minm = Math.floor(Math.abs(((difftime / 1000) % 3600) / 60))
                let sec = Math.floor(Math.abs((difftime / 1000) % 60))
                this.countDownTime.string = (hour < 10 ? "0" + hour : hour) + ":" +
                    (minm < 10 ? "0" + minm : minm) + ":" + (sec < 10 ? "0" + sec : sec)
            } else {
                if (this.unlockNode.getChildByName('open').active == false)
                    this.showInfoBox(this.curBox)
            }
        }
    }

    async openBtn() {
        let ui = (await UIMgr.Share.showUI("GetUI")) as OpenBoxCrl
        let rs = await WXApi.HttpPost("/fangkuaiWx/activeBox", { boxSign: this.curBox.id })
        ui.showBox(this.curBox)
    }

    async cutTimeBtn(event, type) {
        type = Number(type)
        switch (type) {
            case 0:
                let data = await WXApi.HttpPost("/fangkuaiWx/speedBox", { boxSign: this.curBox.id, type: 2 })
                if (data.errcode == 200) {
                    let ui = (await UIMgr.Share.showUI("GetUI")) as OpenBoxCrl
                    await WXApi.HttpPost("/fangkuaiWx/activeBox", { boxSign: this.curBox.id })
                    ui.showBox(this.curBox)
                } else {
                    WXApi.tipsDialog(data.info)
                }
                Logger.record(11)
                break;
            case 1:
                if (this.curBox.speedTimes > 10) {
                    return
                }
                WXApi.OpenAdVideo(async () => {
                    let data = await WXApi.HttpPost("/fangkuaiWx/speedBox", { boxSign: this.curBox.id, type: 0 })
                    if (data.errcode == 200) {
                        StaticData.PlayerInfo.boxs.forEach(box => {
                            cc.log(box.id, data.box.boxSign)
                            if (box.id == data.box.boxSign) {
                                box.opentimeInv = data.box.opentime
                                box.speedTimes = data.box.speedTimes
                                this.showInfoBox(this.curBox)
                                GameMenuUI.Share.handleBoxShow()
                                return
                            }
                        })
                    }
                    Logger.record(12)
                }, WXApi.getUnitid(6))
                break;
            default:
                break;
        }
    }

    async openBoxWithGold(event, data) {
        let btn: cc.Button = event.target.getComponent(cc.Button)
        btn.interactable = false

        this.cutTimeBtn(null, 0)

        // let glod: number = StaticData.PlayerInfo.gold
        // if (glod < this.needGold) {
        //     WXApi.tipsDialog('钻石不足！')
        //     return
        // }

        // let rs = await WXApi.HttpPost('/fangkuaiWx/updateGold', {
        //     gold: StaticData.PlayerInfo.gold - this.needGold
        // })
        // if (rs.errcode != 200) {
        //     btn.interactable = true
        //     return
        // }
        // PlayerDataCrl.UpdateHeroInfo(rs)
        // GameMenuUI.Share.refrashUI();

        // this.openBtn()

        this.scheduleOnce(() => { btn.interactable = true }, 2)


    }

    async startUnlock(event, data) {
        let btn: cc.Button = event.target.getComponent(cc.Button)
        btn.interactable = false
        let rs: any = await WXApi.HttpPost('/fangkuaiWx/boxCountDown', { boxSign: this.curBox.id, version: WXApi.version })
        if (rs.errcode != 200) {
            btn.interactable = true
            return
        }
        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();

        this.close(true)

        btn.interactable = true
    }
}
