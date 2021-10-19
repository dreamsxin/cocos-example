// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { NetNode } from "../../base/network/NetNode";
import { dataManager } from "./DataManager";

const { ccclass } = cc._decorator;

@ccclass
export default class LoginProxy {


    ctor() {

        NetNode.subscribe('login.loginAccount', this.loginCallback, this);

    }

    clearData() {

    }

    sendLogin() {

    }

    loginCallback() {

    }

    loginOut() {
        /*
        n.utils._isExit = !0;
        i.Config.token = "";
        i.Config.uid = 0;
        i.Config.account = "";
        n.utils.clearLayer();
        localcache.clearData();
        facade.eachBean("clearData");
        cc.director.loadScene("LoginScene");
        l.playerProxy.userData = null;
        */

        dataManager.clearData();
        return !0;
    };



}
