import UICrl from "../Lib/UI/UICrl";
import StaticData from "../StaticData";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FavoriteUI extends UICrl {

    @property(cc.Button)
    getBtn: cc.Button = null

    getting: boolean = false

    start() {

    }

    onEnable() {
        let pInfo: any = StaticData.PlayerInfo
        this.getBtn.interactable = StaticData.startWithFavorite && pInfo.globalData.getFavourite != true
    }

    async getBounes() {
        if (this.getting)
            return

        this.getting = true

        await WXApi.HttpPost('/fangkuaiWx/updateGlobalData', { getFavourite: true })
        let gb: any = await WXApi.HttpPost('/fangkuaiWx/updateGold', { gold: StaticData.PlayerInfo.gold + 300 })
        if (gb.errcode == 200) {
            this.getBtn.interactable = false
            WXApi.SetStorage('favorite', 1)
        }
        let rs = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();

        this.getting = false
        StaticData.startWithFavorite = false
        this.close()
    }

    // update (dt) {}
}
