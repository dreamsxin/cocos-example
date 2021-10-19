import UICrl from "../Lib/UI/UICrl";
import GameData from "../GameData";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";
import BaseX from "../Lib/Base64";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SignUpUI extends UICrl {

    @property(cc.Node)
    avatarNode: cc.Node = null

    @property(cc.EditBox)
    edbox: cc.EditBox = null

    chooseID: number = 0

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.initData()
    }

    onEnable() {

    }

    initData() {
        for (let i = 0; i < this.avatarNode.childrenCount; i++) {
            this.avatarNode.children[i].getChildByName('isSelect').active = false
            this.avatarNode.children[i].on('touchend', () => { this.selectIcon(i) }, this)
        }
        this.selectIcon(0)
    }

    selectIcon(id: number) {
        for (let i = 0; i < this.avatarNode.childrenCount; i++) {
            this.avatarNode.children[i].getChildByName('isSelect').active = i == id
        }
        this.chooseID = id + 1
    }

    randomName() {
        this.edbox.string = GameData.Share.getRandomName()
    }

    async submitInfo() {
        if (!this.edbox.string || this.edbox.string == '') {
            WXApi.tipsDialog('请输入您的称呼')
            return
        }
        let name: string = new BaseX().encode(this.edbox.string)
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateUserMsg', {
            name: name,
            pic: 'https://gamecdn.xunyi.online/mengwu/fangkuaiBattle/playerImg/img' + this.chooseID + '.png',
            gender: 0
        })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            return
        }
        WXApi.tipsDialog('信息更新成功')
        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI()
        WXApi.SetStorage('signUp', 1)
        this.close()
    }

    // update (dt) {}
}
