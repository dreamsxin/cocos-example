import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import GameMenuUI from "./GameMenuUI";
import Logger from "../LoggerCrl";

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
export default class InvitCrl extends UICrl {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.ProgressBar)
    prossBar: cc.ProgressBar = null

    @property([cc.Node])
    rewardBtns: cc.Node[] = []

    @property(cc.Label)
    prossLabel: cc.Label = null

    @property(cc.Node)
    rewardNode: cc.Node = null

    start() {
        if (!CC_WECHATGAME) {
            this.close()
        }
    }

    onEnable() {
        if (CC_WECHATGAME) {
            this.updateShareInfo()
        }
    }

    async updateShareInfo() {
        let rs = await WXApi.HttpPost("/fangkuaiWx/shareGame", {})
        let time = 0
        let count = 0
        let getstime = [1, 2, 3, 5]
        let getgold = [100, 150, 300, 600]
        if (rs.errcode == 200) {
            time = rs.times
            count = rs.haveGotGoldTimes
            cc.log(time, count)
            this.prossBar.progress = (time / 5)
            this.prossLabel.string = time.toString()
            for (let i = 0; i < this.rewardBtns.length; i++) {
                let btn = this.rewardBtns[i]
                btn.off(cc.Node.EventType.TOUCH_END.toString())
                let ud = btn.getChildByName("ud")
                ud.active = false
                let done = btn.getChildByName("done")
                done.active = false
                let empty = btn.getChildByName("empty")
                empty.active = false
                if (time >= getstime[i] && count < i + 1) {
                    done.active = true
                    btn.on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                        let rs = await WXApi.HttpPost("/fangkuaiWx/updateGold", { gold: getgold[i] + StaticData.PlayerInfo.gold, source: 1 })
                        if (rs.errcode == 200) {
                            StaticData.PlayerInfo.gold += getgold[i]
                            GameMenuUI.Share.refrashUI()
                            this.updateShareInfo()
                        }
                        this.rewardNode.active = true
                        this.rewardNode.children.forEach(node => {
                            node.active = false
                        })
                        this.rewardNode.children[0].active = true
                        this.rewardNode.children[i + 1].active = true
                    })
                }
                if (time < getstime[i]) {
                    ud.active = true
                }
                if (time >= getstime[i] && count >= i + 1) {
                    empty.active = true
                }
            }

        }
    }

    shareBtnCB() {
        Logger.recordTS(14)
        WXApi.OpenShare("", { from_id: WXApi.sign, is_share: 1, channel_aid: WXApi.channel_aid }, "", "", () => {
            console.log("share call back")
        })
    }

    closeRewardNode() {
        this.rewardNode.active = false
    }


    // update (dt) {}
}
