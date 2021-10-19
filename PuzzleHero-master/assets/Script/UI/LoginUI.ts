import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginUI extends cc.Component {

    @property(cc.Node)
    loginNode: cc.Node = null

    @property(cc.Node)
    regNode: cc.Node = null

    onLoad() { }

    start() {

    }

    async loginCB() {
        this.loginNode.getChildByName('tips').active = false
        let name = this.loginNode.getChildByName('userName').getComponent(cc.EditBox).string
        let passWord = this.loginNode.getChildByName('password').getComponent(cc.EditBox).string

        if (name == '' || passWord == '') {
            this.loginNode.getChildByName('tips').active = true
            this.loginNode.getChildByName('tips').getComponent(cc.Label).string = '账号或密码不能为空'
            return
        }

        let rs: any = await WXApi.HttpPost('/fangkuaiWx/userLogin', {
            name: name,
            password: passWord
        })
        if (rs.errcode == 200) {
            PlayerDataCrl.UpdateHeroInfo(rs)
            cc.director.loadScene("GameMenu")
        } else {
            this.loginNode.getChildByName('tips').active = true
            this.loginNode.getChildByName('tips').getComponent(cc.Label).string = rs.info
        }
    }

    regUICrl() {
        this.regNode.active = !this.regNode.active
    }

    async regCB() {
        this.regNode.getChildByName('tips').active = false
        let name = this.regNode.getChildByName('userName').getComponent(cc.EditBox).string
        let passWord = this.regNode.getChildByName('password').getComponent(cc.EditBox).string
        let passWordV = this.regNode.getChildByName('passwordV').getComponent(cc.EditBox).string

        if (name == '' || passWord == '' || passWordV == '') {
            this.regNode.getChildByName('tips').active = true
            this.regNode.getChildByName('tips').getComponent(cc.Label).string = '账号或密码不能为空'
            return
        }
        if (passWord != passWordV) {
            this.regNode.getChildByName('tips').active = true
            this.regNode.getChildByName('tips').getComponent(cc.Label).string = '两次输入的密码不一致'
            return
        }

        let rs: any = await WXApi.HttpPost('/fangkuaiWx/userReg', {
            name: name,
            password: passWord
        })
        if (rs.errcode == 200) {
            WXApi.tipsDialog('注册成功')
            this.regUICrl()
        } else {
            this.regNode.getChildByName('tips').active = true
            this.regNode.getChildByName('tips').getComponent(cc.Label).string = rs.info
        }
    }

    editchange(str: string, ed, data) {
        let id: number = Math.floor(data)
        str = str.replace(/[^0-9a-zA-Z]/ig, "");
        ed.string = str
    }

    editBegin() {
        // console.log('begin')
        // this.loginNode.y = 158.063 - 300
        // this.regNode.y = 0 - 300
    }

    editEnd() {
        // console.log('end')
        // this.loginNode.y = 158.063
        // this.regNode.y = 0
    }

    // update (dt) {}
}
