import HeroData from "../Mod/HeroData";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import HeroUI from "./HeroUI";
import BlockCrl from "../Crl/BlockCrl";
import SoundMgr from "../Lib/SoundMgr";
import GameMenuUI from "./GameMenuUI";
import GameData from "../GameData";
import UIMgr from "../Lib/UI/UIMgr";

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
export default class HeroInfoUI extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.ProgressBar)
    cardBar: cc.ProgressBar = null

    @property(cc.Label)
    heroName: cc.Label = null

    @property(cc.Node)
    qualityNode: cc.Node = null

    @property(cc.Label)
    atkLabel: cc.Label = null

    @property(cc.Label)
    cardc: cc.Label = null

    @property(cc.Label)
    cardr: cc.Label = null

    @property(cc.Label)
    nextAtk: cc.Label = null

    @property([cc.Node])
    useBtn: cc.Node[] = []

    @property(cc.Label)
    desc1: cc.Label = null

    @property(cc.Label)
    desc2: cc.Label = null

    @property(cc.Node)
    typeNodes: cc.Node = null

    @property(cc.Node)
    heroNode: cc.Node = null

    @property(cc.Label)
    needBlock: cc.Label = null

    @property(cc.Label)
    nextBaseExp: cc.Label = null

    @property(cc.Label)
    needCard: cc.Label = null

    @property(cc.Label)
    needCoin: cc.Label = null

    @property(cc.Node)
    upGradeNode: cc.Node = null

    @property(cc.Node)
    unlockNode: cc.Node = null

    @property(cc.Label)
    unlockCardLabel: cc.Label = null

    @property(cc.Label)
    snameLabel: cc.Label = null

    @property(cc.Node)
    isLockNode: cc.Node = null

    @property(cc.Node)
    rankRequest: cc.Node = null

    start() {

    }

    async updateInfo(heroData: HeroData) {
        this.unlockNode.off(cc.Node.EventType.TOUCH_END.toString())
        this.useBtn[0].off(cc.Node.EventType.TOUCH_END.toString())
        this.heroName.string = heroData.name
        this.atkLabel.string = heroData.atk.toString()
        let types = this.typeNodes.children.filter(n => { return n.name == "r" || n.name == "g" || n.name == "b" || n.name == "y" })

        let pinfo: any = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        this.upGradeNode.getChildByName('adIcon').active = heroData.level >= pinfo.updateLevel
        console.log('hdata lv:', heroData.level, pinfo.updateLevel)

        let quene: any[] = []

        console.log('types:', types)
        for (let i = 0; i < types.length; i++) {
            let doLoad = async () => {
                await new Promise((resolve, err) => {
                    if (i == heroData.type - 1) {
                        types[i].active = true
                        this.upGradeNode.getChildByName('blockIcon').children[i].active = true;
                        types[i].getChildByName("skillbase").removeAllChildren()
                        cc.loader.loadRes("block/b" + heroData.type, (err, res) => {
                            let block: BlockCrl = cc.instantiate(res).addComponent(BlockCrl)
                            block.node.getChildByName("block").removeComponent(cc.Animation)
                            types[i].getChildByName("skillbase").addChild(block.node)
                            block.showSkillBlock(heroData.sb, false)
                            resolve()
                        })
                        //拥有方块数量
                        let pInfo: any = StaticData.PlayerInfo;
                        let bData: any = pInfo.baseField;
                        let boxCount: number = bData.boxCount[i]
                        let boxUpCount: number = bData.boxUpCount
                        types[i].getComponentInChildren(cc.ProgressBar).progress = boxCount / boxUpCount;
                        types[i].getComponentInChildren(cc.ProgressBar)
                            .node.getChildByName('amount').getComponent(cc.Label).string = boxCount.toString();
                    } else {
                        types[i].active = false
                        this.upGradeNode.getChildByName('blockIcon').children[i].active = false;
                        resolve()
                    }
                })
            }
            quene.push(doLoad())
        }
        let doQuene = () => {
            return new Promise((resolve, err) => {
                Promise.all(quene).then(() => { resolve() })
            })
        }
        await doQuene()

        this.cardc.string = heroData.curCards.toString()
        this.cardr.string = heroData.nextCards.toString()
        this.cardBar.progress = heroData.curCards / heroData.nextCards
        this.desc1.string = heroData.d1
        this.desc2.string = heroData.d2
        this.snameLabel.string = heroData.sn
        this.qualityNode.children.forEach(n => n.active = false)
        this.qualityNode.children[heroData.quality].active = true
        cc.loader.loadRes("character/avatar/H" + heroData.id, (err, res) => {
            this.heroNode.removeAllChildren()
            let obj: cc.Node = cc.instantiate(res)
            // obj.children[0].active = false
            // obj.children[4].active = false
            // obj.children[5].active = false
            obj.getChildByName('avatar').active = false
            this.heroNode.addChild(obj)
        })
        let nextLvlExpData: any = GameData.Share.getLvlExpData(heroData.level + 1, heroData.quality);
        //nhero.level + (3 * nhero.quality)
        this.nextAtk.string = nextLvlExpData.power
        this.nextBaseExp.string = nextLvlExpData.base
        this.needCard.string = nextLvlExpData.card
        this.needCoin.string = nextLvlExpData.coin
        this.needBlock.string = nextLvlExpData.block
        this.useBtn[0].active = heroData.use ? false : true
        this.useBtn[1].active = heroData.use ? true : false

        if (heroData.has) {
            this.upGradeNode.off(cc.Node.EventType.TOUCH_END.toString())
            this.upGradeNode.active = true
            this.unlockNode.active = false

            this.useBtn[0].on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                //let rs = await WXApi.HttpPost("/puzzlehero/HeroInfo", { m: 1, hid: heroData.id })
                //英雄上阵
                let rs = await WXApi.HttpPost("/fangkuaiWx/updateCurrentHero", { heroId: heroData.id })
                if (rs.errcode != 200) {
                    WXApi.tipsDialog(rs.info)
                    return
                }
                PlayerDataCrl.UpdateHeroInfo(rs)
                StaticData.PlayerInfo.heros.forEach(hero => {
                    if (hero.id == heroData.id) {
                        this.updateInfo(hero)
                    }
                })
                HeroUI.Share.updateInfo()

                this.closeBtnCB()
                let sv: cc.ScrollView = this.node.parent.getChildByName('scrollview').getComponent(cc.ScrollView)
                sv.scrollToTop(1)
                this.scheduleOnce(() => {
                    HeroUI.Share.sharkCard(heroData.type - 1)
                }, 0.5)
            })
            this.isLockNode.active = false
            //this.rankRequest.active = false
            this.upGradeNode.on(cc.Node.EventType.TOUCH_END.toString(), () => {
                let cb: Function = async () => {
                    //let rs = await WXApi.HttpPost("/puzzlehero/HeroInfo", { m: 1, hid: heroData.id })
                    let needCard = heroData.nextCards
                    let needCoin = heroData.nextCoin

                    if (StaticData.PlayerInfo.coin < needCoin) {
                        WXApi.showFreeMoneyUI()
                        return
                    }

                    // if (heroData.curCards < needCard) {
                    //     WXApi.OpenAlert("没有足够卡片")
                    //     return
                    // }
                    //英雄升级
                    let p: any = { heroId: heroData.id, channel: WXApi.channelID };
                    if (WXApi.isAndroidValid) p = { heroId: heroData.id, version: 'app' };
                    let data = await WXApi.HttpPost("/fangkuaiWx/activeHero", p)
                    if (data.errcode != 200) {
                        WXApi.tipsDialog(data.info)
                        return;
                    }
                    PlayerDataCrl.UpdateHeroInfo(data)
                    GameMenuUI.Share.refrashUI()
                    HeroUI.Share.updateInfo();
                    StaticData.PlayerInfo.heros.forEach(hero => {
                        if (hero.id == heroData.id) {
                            // this.isLockNode.active = false
                            // let newlock = cc.instantiate(this.isLockNode)
                            // newlock.position = this.isLockNode.position
                            // newlock.active = true
                            // this.isLockNode.parent.addChild(newlock)
                            // newlock.getComponent(cc.Animation).play()
                            // this.scheduleOnce(() => {
                            //     //newlock.removeFromParent()

                            // }, 1)
                            this.updateInfo(hero)
                            HeroUI.Share.updateInfo()
                            cc.loader.loadRes("fx/lvlup", (err, res) => {
                                cc.log(err)
                                let lvlup: cc.Node = cc.instantiate(res)
                                lvlup.scale = 2.5
                                lvlup.position = this.isLockNode.position
                                this.node.addChild(lvlup)
                                let dely = cc.delayTime(1)
                                let del = cc.removeSelf()
                                lvlup.runAction(cc.sequence(dely, del))
                                SoundMgr.Share.PlaySound("lvlup")
                            })
                        }
                    })
                }
                let pInfo: any = StaticData.PlayerInfo

                if (heroData.level >= pInfo.updateLevel) {
                    WXApi.OpenAdVideo(cb, null, '升级失败!请完整观看视频')
                } else {
                    cb()
                }
            })

        } else {
            this.upGradeNode.active = false
            this.unlockNode.active = true
            this.useBtn[0].active = false
            this.useBtn[1].active = false
            this.isLockNode.active = true
            // this.rankRequest.active = true
            // let rr: any = GameData.Share.getHeroDataById(heroData.id)
            // let rNode = this.rankRequest.getChildByName('rank')
            // for (let i = 0; i < rNode.childrenCount; i++) {
            //     rNode.children[i].active = (i + 1) == rr.rr
            // }

            this.unlockCardLabel.string = heroData.ulockC.toString()
            this.cardr.string = heroData.ulockC.toString()
            this.cardBar.progress = heroData.curCards / heroData.ulockC;
            this.unlockNode.on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                //英雄解锁
                let rs = await WXApi.HttpPost("/fangkuaiWx/activeHero", { heroId: heroData.id, channel: WXApi.channelID/* , card: heroData.ulockC  */ })
                if (rs.errcode == 200) {
                    //let data = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
                    let data = rs;
                    PlayerDataCrl.UpdateHeroInfo(data)
                    GameMenuUI.Share.refrashUI()
                    StaticData.PlayerInfo.heros.forEach(hero => {
                        if (hero.id == heroData.id) {
                            this.isLockNode.active = false
                            //this.rankRequest.active = false
                            let newlock = cc.instantiate(this.isLockNode)
                            newlock.position = this.isLockNode.position
                            newlock.active = true
                            this.isLockNode.parent.addChild(newlock)
                            newlock.getComponent(cc.Animation).play()
                            this.scheduleOnce(() => {
                                newlock.removeFromParent()
                                this.updateInfo(hero)
                                HeroUI.Share.updateInfo()
                            }, 1)

                        }
                    })
                } else {
                    WXApi.tipsDialog(rs.info)
                }
            })
        }
    }



    closeBtnCB() {
        this.node.active = false
    }

    // update (dt) {}
}
