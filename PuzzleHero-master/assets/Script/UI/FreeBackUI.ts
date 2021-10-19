import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeBackUI extends UICrl {

    // onLoad () {}

    start() {

    }

    onEnable() {

    }

    navigateToHelper() {
        if (CC_WECHATGAME && WXApi.channelID == 0) {
            wx.openCustomerServiceConversation({
                showMessageCard: true,
                sendMessageTitle: '有可领取的物品,点击领取!',
                sendMessagePath: '',
                sendMessageImg: 'https://gamecdn.xunyi.online/mengwu/fangkuaiBattle/serviceImg/serviceShare.png',
                success: async () => {
                    let pInfo: any = StaticData.PlayerInfo
                    if (pInfo.globalData.getService == undefined || pInfo.globalData.getService == null) {
                        await WXApi.HttpPost('/fangkuaiWx/updateGlobalData', { getService: true })
                        await WXApi.HttpPost('/fangkuaiWx/updateGold', { gold: StaticData.PlayerInfo.gold + 200 })
                        let rs = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
                        PlayerDataCrl.UpdateHeroInfo(rs)
                        GameMenuUI.Share.refrashUI();
                    }

                    this.close()
                }
            })
        }

    }

    // update (dt) {}
}
