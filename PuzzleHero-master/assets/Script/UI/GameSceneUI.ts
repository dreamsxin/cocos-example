import PlayerData from "../Mod/PlayerData";
import SoundMgr from "../Lib/SoundMgr";
import Utility from "../Lib/Utility";
import GameData from "../GameData";
import StaticData from "../StaticData";
import GameLogicCrl from "../Crl/GameLogicCrl";
import NetProecssCrl from "../Crl/Net/NetProcessCrl";
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
export default class GameSceneUI extends cc.Component {

    hpBar: cc.ProgressBar[] = []

    hpLabel: cc.Label[] = []

    playerNameLabel: cc.Label[] = []

    roundLogo: cc.Node[] = []

    roundLabel: cc.Label = null

    face: cc.Node[] = []

    skillTips: cc.Node = null

    atkCount: cc.Node = null

    timeoutBell: cc.Node = null

    giveUpUI: cc.Node = null

    bgNode: cc.Node = null

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        StaticData.IsGiveUp = false
        this.bgNode = cc.find('Canvas').getChildByName('BG')
        this.giveUpUI = this.node.getChildByName('giveUpConfirm')
        this.timeoutBell = cc.find('Canvas').getChildByName("timer")
        this.atkCount = this.node.getChildByName('player').getChildByName('atkconut')
        this.skillTips = this.node.getChildByName('SkillTips')
        this.roundLabel = this.node.getChildByName("round").getComponentInChildren(cc.Label)
        this.roundLabel.string = "0"
        let nodes = [this.node.getChildByName("player"), this.node.getChildByName("enemy")]
        for (let i = 0; i < nodes.length; i++) {
            this.hpBar.push(nodes[i].getChildByName("progressBar").getComponent(cc.ProgressBar))
            this.hpLabel.push(nodes[i].getChildByName("life").getComponent(cc.Label))
            this.playerNameLabel.push(nodes[i].getChildByName("name").getComponent(cc.Label))
            this.roundLogo.push(nodes[i].getChildByName("turn"))
            this.face.push(nodes[i].getChildByName("avatar").children[0])
        }
    }

    start() {
        SoundMgr.Share.PlaySound("BattleStart1")
    }

    //投降
    showGiveUpUI() {
        this.giveUpUI.active = !this.giveUpUI.active
    }
    async giveUpCB() {
        if (StaticData.GameOver) {
            this.showGiveUpUI()
            return
        }

        Logger.recordTS(21)
        this.showGiveUpUI()
        NetProecssCrl.Share.doClose()
        StaticData.GameOver = true
        GameLogicCrl.Share.isWin = false
        await GameLogicCrl.Share.territoryCrl.handleRoundEnd()
        StaticData.IsGiveUp = true
    }

    //显示技能提示
    showSkillTips(block: any) {
        if (block.blockSkill == -1) return
        this.skillTips.active = true
        let cConfig: any = GameData.Share.getSkillByTypeAndST(block.type, block.blockSkill)
        this.skillTips.getChildByName('sname').getComponent(cc.Label).string = cConfig.sn
        this.skillTips.getChildByName('sintro').getComponent(cc.Label).string = cConfig.d2
    }
    hideSkillTips() {
        this.skillTips.active = false
    }

    updateUserInfo(uinfi: PlayerData[]) {
        this.playerNameLabel[0].string = uinfi[0].nickname
        this.playerNameLabel[1].string = uinfi[1].nickname
        Utility.LoadImgAyns(uinfi[0].face, this.face[0].getComponent(cc.Sprite))
        Utility.LoadImgAyns(uinfi[1].face, this.face[1].getComponent(cc.Sprite))
    }

    showAtkCount(atk: number) {
        if (StaticData.Teaching || StaticData.AILimit) return
        if (!this.atkCount.active)
            this.atkCount.getComponent(cc.Animation).play()
        this.atkCount.active = true
        this.atkCount.getChildByName('atk').getComponent(cc.Label).string = atk.toString()
    }
    hideAtkCount() {
        this.atkCount.active = false
    }

    updateHp(pmod: PlayerData[]) {
        for (let i = 0; i < pmod.length; i++) {
            this.hpBar[i].progress = pmod[i].hp / pmod[i].maxHp
            if (this.hpLabel[i].string != "999") {
                let shp = Number(this.hpLabel[i].string)
                let thp = pmod[i].hp
                if (shp != thp) {
                    cc.loader.loadRes(`fx/${shp > thp ? "Damage" : "Heal"}`, (err, res) => {
                        let label: cc.Node = cc.instantiate(res)
                        label.getComponentInChildren(cc.Label).string = Math.abs(shp - thp).toString()
                        this.hpBar[i].node.parent.addChild(label)
                        let act1 = cc.delayTime(1)
                        let act2 = cc.removeSelf()
                        label.runAction(cc.sequence(act1, act2))
                        if (shp > thp) {
                            this.face[i].parent.getComponent(cc.Animation).play()
                        }
                    })
                }
            }

            this.hpLabel[i].string = pmod[i].hp.toString()
        }
    }

    updateRoundCount(round: number, pround: number) {
        this.roundLabel.string = round.toString()
        this.roundLogo[1].active = pround == 0 ? true : false
        this.roundLogo[0].active = pround == 1 ? true : false

        this.roundLogo.forEach(n => {
            if (n.active) {
                n.getComponent(cc.Animation).play()
            }
        })
    }

    showGetSkill(type: number, idx: number) {
        switch (type) {
            case 0:
                cc.loader.loadRes("fx/PDamage", (err, res) => {
                    let eff: cc.Node = cc.instantiate(res)
                    this.face[idx].parent.addChild(eff)
                    let act1 = cc.delayTime(1)
                    let act2 = cc.removeSelf()
                    eff.runAction(cc.sequence(act1, act2))
                })
                break;
            case 1:
                cc.loader.loadRes("fx/HealFx", (err, res) => {
                    let eff: cc.Node = cc.instantiate(res)
                    eff.zIndex = cc.macro.MAX_ZINDEX
                    this.face[idx].parent.addChild(eff)
                    let act1 = cc.delayTime(1)
                    let act2 = cc.removeSelf()
                    eff.runAction(cc.sequence(act1, act2))
                })
                break;
            case 2:
                cc.loader.loadRes("fx/PShield", (err, res) => {
                    let eff: cc.Node = cc.instantiate(res)
                    eff.zIndex = cc.macro.MAX_ZINDEX
                    this.face[idx].parent.addChild(eff)
                    eff.name = "PShield"
                })
                break;
            case 3:
                this.face[idx].parent.children.forEach(n => {
                    if (n.name == "PShield") {
                        n.removeFromParent()
                    }
                })
                break
            default:
                break;
        }
    }

    // update (dt) {}
}
