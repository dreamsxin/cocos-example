import StaticData from "../StaticData";
import HeroInfoUI from "./HeroInfoUI";
import HeroData from "../Mod/HeroData";
import WXApi from "../Lib/WXApi";
import GameData from "../GameData";
import Utility from "../Lib/Utility";

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
export default class HeroUI extends cc.Component {

    @property([cc.Node])
    teamNodes: cc.Node[] = []

    @property(cc.Node)
    heroInfoNode: cc.Node = null

    @property(cc.Node)
    heroPoolNode: cc.Node = null

    @property(cc.Node)
    teamNode: cc.Node = null

    heroPoolIns: boolean = false


    public static Share: HeroUI = null
    //@property(cc)

    onEnable() {
        this.updateInfo()
        this.heroInfoNode.active = false
    }

    start() {
        HeroUI.Share = this
    }

    updateInfo() {
        if (StaticData.PlayerInfo == null) {
            return
        }
        let teamdata = StaticData.PlayerInfo.heros.filter(hero => {
            return hero.use
        })
        teamdata = teamdata.sort((n1, n2) => n1.type - n2.type)
        for (let i = 0; i < teamdata.length; i++) {
            this.updateItem(this.teamNodes[i], teamdata[i])
        }
        let idx = 0

        let hDataArr: HeroData[] = [].concat(StaticData.PlayerInfo.heros)
        //hDataArr.sort((h1, h2) => h1.quality - h2.quality)
        hDataArr = Utility.arrInsert(hDataArr, hDataArr.splice(16, 4), 4)
        hDataArr = Utility.arrInsert(hDataArr, hDataArr.splice(20, 4), 12)
        hDataArr = Utility.arrInsert(hDataArr, hDataArr.splice(24, 4), 20)
        console.log('hdataarr:', hDataArr)

        hDataArr.forEach(hero => {
            let node: cc.Node = null
            if (!this.heroPoolIns) {
                node = cc.instantiate(this.teamNodes[hero.type - 1])
                this.heroPoolNode.addChild(node)
            } else {
                node = this.heroPoolNode.children[idx]
                idx++
            }
            this.updateItem(node, hero)
        })
        cc.log("update hero list")
        this.heroPoolIns = true

    }

    private updateItem(parentNode: cc.Node, herodata: HeroData) {
        let node: cc.Node = parentNode.getChildByName('rootNode')
        parentNode.off(cc.Node.EventType.TOUCH_END.toString())
        let herohere = node.getChildByName("herohere")
        if (herohere.getChildByName("H" + herodata.id) == null) {
            cc.loader.loadRes("character/avatar/H" + herodata.id, (err, res) => {
                node.getChildByName("herohere").removeAllChildren()
                let heronode: cc.Node = cc.instantiate(res)
                heronode.position = cc.Vec2.ZERO
                // heronode.children[0].active = false
                // heronode.children[4].active = false
                // heronode.children[5].active = false
                heronode.getChildByName('full').active = false
                if (!herodata.has) {
                    heronode.getChildByName('avatar').color = new cc.Color(40, 40, 40)
                } else {
                    heronode.getChildByName('avatar').color = cc.Color.WHITE
                }

                node.getChildByName("herohere").addChild(heronode)
            })
        } else {
            if (!herodata.has) {
                herohere.getChildByName("H" + herodata.id).getChildByName('avatar').color = new cc.Color(40, 40, 40)
            } else {
                herohere.getChildByName("H" + herodata.id).getChildByName('avatar').color = cc.Color.WHITE
            }
        }
        if (!herodata.has) {
            node.getChildByName("isLock").active = true
        } else {
            node.getChildByName("isLock").active = false
        }
        let p = 0
        p = herodata.curCards / herodata.nextCards
        try {
            node.getChildByName("progressBar").getChildByName("c").getComponent(cc.Label).string = herodata.curCards.toString()
        } catch (e) {
            cc.log("err hero ui", herodata)
        }
        node.getChildByName("progressBar").getChildByName("r").getComponent(cc.Label).string = herodata.nextCards.toString()

        //是否足够方块
        let pInfo: any = StaticData.PlayerInfo
        let bData: any = pInfo.baseField
        let boxCount: number = bData.boxCount[herodata.type - 1]
        let needBox: number = GameData.Share.getLvlExpData(herodata.level + 1, herodata.quality).block

        if (herodata.curCards > 0 && herodata.curCards >= herodata.nextCards && StaticData.PlayerInfo.coin >= herodata.nextCoin && herodata.has/*  && boxCount >= needBox */) {
            node.getChildByName("enoughtips").active = true
        } else {
            node.getChildByName("enoughtips").active = false
            if (herodata.ulockC != null) {
                node.getChildByName("progressBar").getChildByName("r").getComponent(cc.Label).string = herodata.ulockC.toString()
                p = herodata.curCards / herodata.ulockC
            }
        }
        p = p > 1 ? 1 : p
        node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = p
        node.getChildByName("name").getComponent(cc.Label).string = herodata.name
        node.getChildByName("atkbase").getComponentInChildren(cc.Label).string = herodata.atk.toString()

        node.getChildByName("quality").children.forEach(n => {
            n.active = false
        })
        node.getChildByName("quality").children[herodata.quality].active = true

        parentNode.on(cc.Node.EventType.TOUCH_END.toString(), (() => {
            this.heroInfoNode.getComponent(HeroInfoUI).updateInfo(herodata)
            this.heroInfoNode.active = true

            //this.updateInfo()
        }))


    }

    sharkCard(type: number) {
        this.teamNodes[type].getChildByName('rootNode').getChildByName('Confirm').active = true
        this.teamNodes[type].getChildByName('rootNode').getChildByName('Confirm').getComponent(cc.Animation).play()
        this.scheduleOnce(() => { this.teamNodes[type].getChildByName('rootNode').getChildByName('Confirm').active = false }, 0.5)
    }

    update(dt) {
        let maxY: number = cc.winSize.height
        this.heroPoolNode.children.forEach((h) => {
            if (h.convertToWorldSpaceAR(cc.Vec2.ZERO).y < -75 || h.convertToWorldSpaceAR(cc.Vec2.ZERO).y > maxY) {
                h.getChildByName('rootNode').active = false
            } else {
                h.getChildByName('rootNode').active = true
            }
        })

        if (this.teamNode.convertToWorldSpaceAR(cc.Vec2.ZERO).y > maxY + 50) {
            this.teamNode.children.forEach((t) => {
                t.active = false
            })
        } else {
            this.teamNode.children.forEach((t) => {
                t.active = true
            })
        }
    }
}
