import StaticData from "../StaticData";
import GameMenuUI from "./GameMenuUI";
import WXApi from "../Lib/WXApi";
import { RewardBox } from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import OpenBoxCrl from "./OpenBoxCrl";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import Logger from "../LoggerCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TeachQuestUI extends cc.Component {

    @property(cc.Node)
    storyNode: cc.Node = null

    @property(cc.Node)
    menuNode: cc.Node = null

    @property(cc.Node)
    stepNodes: cc.Node[] = []

    touchStep: number = 0

    gettingBox: boolean = false

    canTouch: boolean = false

    onLoad() {
        //this.stepNodes[2].on('touchstart', (event)=>{this.stepCallback()}, this)
    }

    start() {

    }

    onEnable() {
        this.showStep(StaticData.PlayerInfo.guideStep)
    }

    showStep(step: number) {
        this.storyNode.active = false
        this.stepNodes.forEach(s => {
            s.active = false
        });
        if (step == 0) {
            if (!StaticData.isWin) {
                this.menuNode.getChildByName('StepFail').active = true
                return
            }
            this.storyNode.active = true
            Logger.recordTS(8)
            this.scheduleOnce(() => {
                Logger.recordTS(9)
                this.storyNode.on('touchstart', (event) => {
                    this.storyNode.active = false
                    this.stepNodes[0].active = true
                    Logger.recordTS(10)
                }, this)
                this.storyNode.getChildByName('Base').getComponent(cc.BlockInputEvents).destroy()
            }, 3.77)
        } else if (step == 1) {
            Logger.recordTS(12)
            this.stepNodes[1].active = true
        } else if (step == 2) {
            this.scheduleOnce(() => { this.canTouch = true }, 2)
            this.stepNodes[2].active = true
        }
    }

    async stepCallback() {
        if (this.touchStep >= 3) {
            await WXApi.HttpPost('/fangkuaiWx/setUserStep', { type: 0 })
            let msg: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            if (msg.errcode == 200) {
                PlayerDataCrl.UpdateHeroInfo(msg)
            }
            this.node.active = false
            StaticData.Teaching = false
            return
        }

        if (!this.canTouch) {
            return
        }

        this.stepNodes[2].children.forEach(s => {
            s.active = false
        });
        this.touchStep++
        this.stepNodes[2].children[this.touchStep].active = true
        this.canTouch = false
        this.scheduleOnce(() => { this.canTouch = true }, 2)
    }

    startTeach() {
        Logger.recordTS(24)
        console.log('startTeach')
        this.node.active = false
        StaticData.Teaching = true
        GameMenuUI.Share.startTeach()
    }

    async getBox() {
        if (this.gettingBox) return
        this.gettingBox = true

        Logger.recordTS(11)

        //打开高级宝箱
        let box = new RewardBox()
        box.coin = 50
        box.cards = [3]
        box.heros = [1]
        box.level = 6;
        box.opentimeInv = 0
        box.nkey = 0
        box.exLevel = 7

        let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
        ui.showBox(box)

        this.node.active = false

        await WXApi.HttpPost('/fangkuaiWx/setUserStep', { type: 1 })
        await WXApi.HttpPost('/fangkuaiWx/setUserStep', { type: 0 })
        let msg: any = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
        if (msg.errcode == 200) {
            PlayerDataCrl.UpdateHeroInfo(msg)
            GameMenuUI.Share.refrashUI()
        }

        this.showStep(StaticData.PlayerInfo.guideStep)
        this.gettingBox = false

    }

    update(dt) { }
}
