import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeMoneyUI extends cc.Component {

    onLoad() {
        //this.initData()
    }

    start() {

    }

    onEnable() {

    }

    async initData() {
        let rs: any = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        if (rs.errcode != 200) {
            WXApi.tipsDialog('金币不足')
            this.node.destroy()
            return
        }
        let cancelCount: number = rs.dateCancel
        let getCount: number = rs.dateGet

        if (cancelCount >= 3 || getCount >= 3) {
            WXApi.tipsDialog('金币不足')
            this.node.destroy()
            return
        }

        StaticData.FMShowCount++
        if (StaticData.FMHadCancel) {
            if (StaticData.FMShowCount < 6) {
                WXApi.tipsDialog('金币不足')
                this.node.destroy()
                return
            } else {
                StaticData.FMShowCount = 0
            }
        }

        cc.director.getScene().addChild(this.node)

        StaticData.FMHadCancel = false

        this.getComponent(cc.Animation).play()
    }

    getBounes() {
        WXApi.OpenAdVideo(async () => {
            let rs: any = await WXApi.HttpPost('/fangkuaiWx/updateCoin', { coin: StaticData.PlayerInfo.coin + 300 })
            if (rs.errcode == 200) {
                let gb: any = await WXApi.HttpPost('/fangkuaiWx/dateGet', {})
                PlayerDataCrl.UpdateHeroInfo(rs)
                GameMenuUI.Share.refrashUI();
                this.node.removeFromParent()
            }
        }, WXApi.getUnitid(1))
    }

    closeCB() {
        WXApi.HttpPost('/fangkuaiWx/dateCancel', {})
        StaticData.FMHadCancel = true
        this.node.removeFromParent()
    }

    //update(dt) { }
}
