import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";

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
export default class VipUI extends UICrl {

    @property(cc.Node)
    getBtnNode: cc.Node = null

    @property(cc.Node)
    actingNode: cc.Node = null

    vipTime: number = 0
    getting: boolean = false

    // onLoad () {}

    start() {

    }

    onEnable() {
        this.checkIsVip()
    }

    async checkIsVip() {
        let rs: any = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        if (rs.errcode != 200) {
            this.close()
            return
        }

        this.vipTime = rs.vipTimeout
        if (this.vipTime > 0) {
            this.schedule(this.decTime, 1)
        }

        this.initData()
    }

    decTime() {
        this.vipTime--
        if (this.vipTime < 0) {
            this.vipTime = 0
        }
        let d: number = Math.floor(this.vipTime / 60)
        if (d <= 0 && this.vipTime > 0) {
            d = 1
        }
        this.actingNode.getChildByName('remind').getComponent(cc.Label).string = '剩余' + d.toString() + '分钟'
        if (this.vipTime <= 0) {
            this.unschedule(this.decTime)
            this.checkIsVip()
        }

    }

    initData() {
        let isVip: boolean = false
        isVip = this.vipTime > 0

        this.getBtnNode.active = !isVip
        this.actingNode.active = isVip

        let d: number = Math.floor(this.vipTime / 60)
        if (d <= 0 && this.vipTime > 0) {
            d = 1
        }
        this.actingNode.getChildByName('remind').getComponent(cc.Label).string = '剩余' + d.toString() + '分钟'
    }

    getVipCB() {
        if (this.getting) return
        this.getting = true
        WXApi.OpenAdVideo(async () => {
            await WXApi.HttpPost('/fangkuaiWx/getVIP', {})
            this.checkIsVip()
        })
        this.getting = false
    }

    // update (dt) {}
}
