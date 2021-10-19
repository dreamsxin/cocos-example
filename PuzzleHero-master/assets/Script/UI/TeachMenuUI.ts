import StaticData from "../StaticData";
import GameMenuUI from "./GameMenuUI";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import { RewardBox } from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import OpenBoxCrl from "./OpenBoxCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeachMenuUI extends cc.Component {
    @property(cc.Node)
    storyNode: cc.Node = null

    @property(cc.Node)
    stepNode: cc.Node[] = []

    gettingBounes: boolean = false

    onLoad() { }

    start() {

    }

    onEnable() {
        let step: number = 0
        step = StaticData.PlayerInfo.guideStep
        this.storyNode.active = step == 0
        this.storyNode.getComponent(cc.Button).interactable = false
        this.scheduleOnce(() => {
            this.storyNode.getComponent(cc.Button).interactable = true
            this.storyNode.getChildByName('Base').getComponent(cc.BlockInputEvents).enabled = false
        }, 3.8)
        if (this.storyNode.active) {
            this.storyNode.getComponent(cc.Animation).play()
        }
        this.initUI()
    }

    closeStory() {
        this.storyNode.active = false
    }

    closeCB() {
        this.node.active = false
    }

    initUI() {
        let step: number = 0
        let getCount: number = 0
        step = StaticData.PlayerInfo.guideStep
        getCount = StaticData.PlayerInfo.stepReceive
        let isDone: boolean = true
        for (let i = 0; i < this.stepNode.length; i++) {
            let tip = this.stepNode[i].getChildByName('rewardTips')
            let reward = this.stepNode[i].getChildByName('reward')
            let done = this.stepNode[i].getChildByName('isDone')
            tip.active = false
            reward.active = false
            done.active = false

            if (getCount <= i) {
                //未领取
                reward.active = true
                tip.active = i < step
                isDone = false
            } else {
                //已领取
                done.active = true
            }
            this.stepNode[i].getComponent(cc.Button).interactable = !done.active

            if (i > 0) {
                this.stepNode[i].active = this.stepNode[i - 1].getChildByName('isDone').active
            }
        }

        this.node.getChildByName('Menu').getChildByName('Done').active = isDone
    }

    async getBounes(event, data) {
        if (this.gettingBounes) return
        this.gettingBounes = true

        let step: number = 0
        let getCount: number = 0
        step = StaticData.PlayerInfo.guideStep
        getCount = StaticData.PlayerInfo.stepReceive
        let index: number = parseInt(data)
        if (step < index) {
            //未完成教程  点击进入教程
            this.node.active = false
            StaticData.Teaching = true
            GameMenuUI.Share.startTeach()
        } else {
            //已完成教程
            if (getCount < index) {
                //点击领取
                console.log('领取奖励')

                //打开高级宝箱
                let box = new RewardBox()
                box.coin = 50
                box.cards = [3]
                box.heros = [getCount + 1]
                box.level = 6;
                box.opentimeInv = 0
                box.nkey = 0

                let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
                ui.showBox(box)

                await WXApi.HttpPost('/fangkuaiWx/setUserStep', { type: 1 })
                let msg: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
                if (msg.errcode == 200) {
                    PlayerDataCrl.UpdateHeroInfo(msg)
                    GameMenuUI.Share.refrashUI()
                }
                this.initUI()
            }
        }

        this.gettingBounes = false
    }

    update(dt) { }
}
