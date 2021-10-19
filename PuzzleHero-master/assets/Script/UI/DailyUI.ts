import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";
import { RewardBox } from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import OpenBoxCrl from "./OpenBoxCrl";
import Logger from "../LoggerCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyUI extends UICrl {

    @property(cc.Node)
    dailyNode: cc.Node = null

    @property(cc.Node)
    getNode: cc.Node = null

    getingBounes: boolean = false

    // onLoad () {}

    start() {
        this.getNode.on('touchend', () => { this.getNode.active = false }, this)
    }

    onEnable() {
        this.updateInfo()
    }

    async updateInfo() {
        let pInfo: any = StaticData.PlayerInfo

        let data: any = pInfo.userSign
        let curDay: number = data.index
        let dayArr: any[] = data.state

        for (let i = 0; i < this.dailyNode.childrenCount; i++) {
            let item = this.dailyNode.children[i]
            let not = item.getChildByName('not')
            let done = item.getChildByName('done')
            let signB = item.getChildByName('signB')
            let moreB = item.getChildByName('moreB')
            let resignB = item.getChildByName('resignB')

            not.active = false
            done.active = false
            signB.active = false
            moreB.active = false
            resignB.active = false

            signB.off('touchend')
            moreB.off('touchend')
            resignB.off('touchend')
            signB.on('touchend', () => { this.getBounes(i, 0) }, this)
            moreB.on('touchend', () => { this.getBounes(i, 1) }, this)
            resignB.on('touchend', () => { this.getBounes(i, 2) }, this)

            //state:签到次数
            let state = dayArr[i]
            switch (state) {
                case 0:
                    if (i < curDay) {
                        let preID = i - 1
                        if (i == 0) {
                            resignB.active = true
                        } else if (preID >= 0) {
                            if (dayArr[preID] >= 2) {
                                resignB.active = true
                            } else {
                                not.active = true
                            }
                        }
                    } else if (i == curDay) {
                        signB.active = true
                    } else {
                        not.active = true
                    }
                    break
                case 1:
                    if (i < curDay) {
                        moreB.active = true
                    } else if (i == curDay) {
                        moreB.active = true
                    } else {
                        not.active = true
                    }
                    break
                case 2:
                    if (i < curDay) {
                        done.active = true
                    } else if (i == curDay) {
                        done.active = true
                    } else {
                        not.active = true
                    }
                    break
            }
        }
    }

    //type:  0:正常签到  1：再来一份   2：补签
    getBounes(id: number, type: number) {
        if (this.getingBounes) return
        this.getingBounes = true

        let cb = async () => {
            if (id == 0 || id == 3 || id == 4 || id == 5) {
                let g = 50
                if (id == 3) g = 100
                else if (id == 4) g = 150
                else if (id == 5) g = 200
                await WXApi.HttpPost('/fangkuaiWx/updateGold', { gold: StaticData.PlayerInfo.gold + g })
                this.showBounesTips(id)
            } else {
                let boxID = 2
                if (id == 2) boxID = 3
                else if (id == 6) boxID = 4
                //请求服务器
                let rs = await WXApi.HttpPost("/fangkuaiWx/buyBox", {
                    coin: 0,
                    gold: 0,
                    boxId: boxID,
                    source: 5
                })
                if (rs.errcode != 200) {
                    WXApi.tipsDialog(rs.info)
                    this.getingBounes = false
                    return;
                }

                let boxData = rs.property;
                console.log('打开宝箱库:', rs);
                let box = new RewardBox()
                box.coin = boxData.coin
                box.cards = boxData.card
                box.heros = boxData.hero
                box.level = boxID;
                box.opentimeInv = Number(boxData.opentime)
                box.nkey = Number(boxData.key)

                let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
                ui.showBox(box, true)
            }

            console.log('type: ', type)
            let t = (type == 0 || type == 2) ? 1 : 2
            if (type == 0)
                Logger.recordTS(15)
            else if (type == 1)
                Logger.recordTS(16)
            console.log('t: ', t)
            let updateSign = await WXApi.HttpPost('/fangkuaiWx/userSign', { index: id, type: t })
            if (updateSign.errcode != 200) WXApi.tipsDialog(updateSign.info)

            let rs = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
            if (rs.errcode != 200) {
                WXApi.tipsDialog(rs.info)
                this.getingBounes = false
                return
            }
            PlayerDataCrl.UpdateHeroInfo(rs)
            GameMenuUI.Share.refrashUI();

            this.updateInfo()
            this.getingBounes = false
        }

        if (type == 0)
            cb()
        else {
            WXApi.OpenAdVideo(cb, WXApi.getUnitid(7))
            this.getingBounes = false
        }


        //this.getingBounes = false
    }

    showBounesTips(id: number) {
        this.getNode.active = true
        this.getNode.getChildByName('d1').active = false
        this.getNode.getChildByName('d4').active = false
        this.getNode.getChildByName('d5').active = false
        this.getNode.getChildByName('d6').active = false

        this.getNode.getChildByName('d' + (id + 1)).active = true
    }

    // update (dt) {}
}
