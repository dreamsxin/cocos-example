import UICrl from "../Lib/UI/UICrl";
import UIMgr from "../Lib/UI/UIMgr";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";
import PlatformUtility from "../Lib/PlatformUtility";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CodeUI extends UICrl {

    @property(cc.Node)
    edBox: cc.Node = null

    start() {

    }

    closeCB() {
        this.node.active = false
        UIMgr.Share.showUI("MainUI")
    }

    onEnable() {
        this.edBox.getComponent(cc.EditBox).string = ''
    }

    async submitCB() {
        let code = this.edBox.getComponent(cc.EditBox).string
        cc.log('code:', code)
        if (!code || code == '') {
            WXApi.tipsDialog('请输入兑换码')
            return
        }
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateGold', {
            code: code,
            source: 2
        })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            return
        }
        WXApi.tipsDialog(rs.info)
        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();
    }

    copyGroup() {
        PlatformUtility.CopyToClipboard('728233618')
        WXApi.tipsDialog('复制成功')
    }


    editBegin() {
        // console.log('begin')
        // this.node.y = 568 - 300
    }

    editEnd() {
        // console.log('end')
        // this.node.y = 568
    }

    update(dt) { }
}
