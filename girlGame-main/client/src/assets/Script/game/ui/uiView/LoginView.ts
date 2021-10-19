// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { gameFlowManager } from "../../flow/GameFlowManager";
import { dataManager } from "../../data/DataManager";
import { uiManager } from "../../../base/ui/UIManager";
import { utils } from "../../../util/Utils";
import { netManager, NetManager } from "../../../base/network/NetManager";
import SysDef from "../../../util/SysDef";
import { Account } from "../../netMsg/Account";
import { EventMgr } from "../../../base/common/EventManager";
import PlayerProxy from "../../data/PlayerProxy";
import { UIID } from "../UIConfig";

export class LoginData {
    openid: string = "";

}
const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends UIView {

    public static instance: LoginView = null;
    @property({ type: cc.Button })
    btn_left: cc.Button = null;

    @property({ type: cc.Button })
    btn_right: cc.Button = null;

    @property({ type: MultiLabel })
    lb_left: MultiLabel = null;

    @property({ type: MultiLabel })
    lb_right: MultiLabel = null;

    @property({ type: cc.EditBox })
    eb_account: cc.EditBox = null;

    @property({ type: cc.EditBox })
    eb_pwd: cc.EditBox = null;

    @property({ type: cc.EditBox })
    eb_confirm: cc.EditBox = null;

    private currentState: number = -1;//0:login 1:regist

    init() {

        //这里临时，在获取到玩家信息后就进入游戏
        EventMgr.addEventListener(PlayerProxy.infoUpdate, this.login, this);


        LoginView.instance = this;
        this.eb_account.placeholder = dataManager.GetTextById(6);
        this.eb_pwd.placeholder = dataManager.GetTextById(7);
        this.eb_confirm.placeholder = dataManager.GetTextById(8);
        this.openLogin();
    }

    onOpen() {
    }
    onClose() {
        LoginView.instance = null;
        EventMgr.removeEventListener(PlayerProxy.infoUpdate, this.login, this);
    }
    btnClickLeft(event, customEventData) {
        if (this.currentState == 0) {//open regist
            this.openRegist();
        } else if (this.currentState == 1) {//back
            this.openLogin();
        }
    }

    btnClickRight(event, customEventData) {
        if (this.currentState == 0) {//login
            this.sendLogin();
        } else if (this.currentState == 1) {//regist
            this.sendRegist();
        }
    }

    openRegist() {
        this.currentState = 1;
        this.lb_left.string = dataManager.GetTextById(10);
        this.lb_right.string = dataManager.GetTextById(2);
        this.eb_account.string = '';
        this.eb_pwd.string = '';
        this.eb_confirm.string = '';
        this.eb_confirm.node.active = this.currentState == 1;
    }

    openLogin() {
        this.lb_left.string = dataManager.GetTextById(2);
        this.lb_right.string = dataManager.GetTextById(1);
        this.eb_account.string = utils.getLocalData('zmaccount');
        this.eb_pwd.string = utils.getLocalData('zmpwd');
        this.eb_confirm.string = '';
        this.currentState = 0;
        this.eb_confirm.node.active = this.currentState == 1;
    }

    sendLogin() {

        let account = this.eb_account.string;
        // let password = this.eb_pwd.string;
        if (account == "") {
            utils.showTips(dataManager.GetTextById(11));
            return;

        }


        utils.saveLocalData('zmaccount', account);
        var obj = new Account.LoginRequest();
        obj.openid = account;
        NetManager.httpPost(SysDef.getLoginUrl(), JSON.stringify(obj), this.responseLogin);
        // if(account == utils.getLocalData('zmaccount') ){
        //
        //     utils.showTips(dataManager.GetTextById(16));
        //     gameFlowManager.loginAccountServerFlow.waitStaus = true;
        // }else {
        //     utils.showTips(dataManager.GetTextById(13));
        // }
    }
    responseLogin(rsp) {

        var loginRsp: Account.LoginResponse = rsp as Account.LoginResponse;
        netManager.wsIP = loginRsp.ip;
        netManager.wsPort = loginRsp.port;
        netManager.wstoken = loginRsp.token;


        netManager.connect({ url: "ws://" + netManager.wsIP + ":" + netManager.wsPort }, () => {
            dataManager.playerProxy.PlayerLoginRequest();
        });
        utils.showTips(dataManager.GetTextById(16));
    }
    sendRegist() {
        let account = this.eb_account.string;
        let password = this.eb_pwd.string;
        let confirm = this.eb_confirm.string;
        if (account == "" || password == "") {
            utils.showTips(dataManager.GetTextById(11));
            return;

        }
        if (password != confirm) {
            utils.showTips(dataManager.GetTextById(12));
            return;
        }
        if (account == utils.getLocalData('zmaccount') && password == utils.getLocalData('zmpwd')) {
            utils.showTips(dataManager.GetTextById(14));


        } else {
            utils.showTips(dataManager.GetTextById(15));
            utils.saveLocalData('zmaccount', account);
            utils.saveLocalData('zmpwd', password);
            this.openLogin()
        }
    }

    login() {
        this.closeSelf();
        uiManager.open(UIID.UIMain);
    }
    // update (dt) {}
}
