import StaticData from "../StaticData";
import GameData from "../GameData";
import BlockCrl from "../Crl/BlockCrl";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";
import UIMgr from "../Lib/UI/UIMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ArenaUI extends cc.Component {

    @property(cc.Node)
    stepNode1: cc.Node = null
    @property(cc.Node)
    stepNode2: cc.Node = null
    @property(cc.Node)
    stepNode3: cc.Node = null

    @property(cc.Node)
    getUpgrade: cc.Node = null

    @property(cc.Node)
    giveUpConfirm: cc.Node = null

    @property(cc.Node)
    blockNode: cc.Node = null

    @property(cc.Node)
    sNode: cc.Node[] = []
    @property(cc.Node)
    hNode: cc.Node[] = []

    @property(cc.Node)
    ruleNode: cc.Node = null


    weekBounes: number = 0

    tempAtkArr: number[] = [1, 1, 1, 1]

    start() {

    }

    onEnable() {
        this.initData()
    }

    initData() {
        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        let state: number = arenaData.state
        let startFA: boolean = arenaData.startFromArean
        let selectArr: any[] = arenaData.selectArr
        let currentArr: any[] = arenaData.currentArr
        let heroAtkArr: any[] = arenaData.heroAtkArr
        let winTimes: number = arenaData.winTimes
        let defeatedTimes: number = arenaData.defeatedTimes
        let maxDefeatedTimes: number = arenaData.maxDefeatedTimes
        let challengeOver: boolean = arenaData.challengeOver
        let baseHp: number = arenaData.baseHp
        let ticket: number = arenaData.ticket
        let flushTime: number = arenaData.flushTime
        let grade: number = arenaData.grade

        this.stepNode1.active = false
        this.stepNode2.active = false
        this.stepNode3.active = false
        if (state == 0) {
            this.stepNode1.active = true
            this.initStep1()
        } else if (state == 1) {
            this.stepNode2.active = true
            this.initStep2()
        } else if (state == 2) {
            this.stepNode3.active = true
            this.initStep3()
        }

    }

    async initStep1() {
        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        this.stepNode1.getChildByName('Ticket').getComponent(cc.Label).string = arenaData.ticket
        this.stepNode1.getChildByName('playB').active = arenaData.ticket > 0
        this.stepNode1.getChildByName('addB').active = arenaData.ticket <= 0
        this.stepNode1.getChildByName('weekPrize').active = !arenaData.gotGift && arenaData.lastWeekRank > 0

        // let rs: any = await WXApi.HttpPost('/fangkuaiWx/battleRank', {})
        // if (rs.errcode != 200) {
        //     WXApi.tipsDialog(rs.info)
        //     return
        // }
        let bounes: number = 888
        let bId: number = 0
        let index: number = arenaData.lastWeekRank
        if (index > 50) {
            bounes = 888
            bId = 0
        } else if (index > 40 && index <= 50) {
            bounes = 1888
            bId = 1
        } else if (index > 30 && index <= 40) {
            bounes = 3666
            bId = 2
        } else if (index > 20 && index <= 30) {
            bounes = 4800
            bId = 3
        } else if (index > 10 && index <= 20) {
            bounes = 6666
            bId = 4
        } else if (index > 0 && index <= 10) {
            bounes = 8888
            bId = 5
        }
        this.weekBounes = bounes
        this.stepNode1.getChildByName('weekPrize').getChildByName('icon').children.forEach(i => {
            i.active = false
        })
        this.stepNode1.getChildByName('weekPrize').getChildByName('icon').children[bId].active = true
    }
    showRank() {
        UIMgr.Share.showUI('ARanklistUI', true)
    }
    async getWeekBounes() {
        this.blockNode.active = true
        await WXApi.HttpPost('/fangkuaiWx/getArenaGift', {})
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateCoin', {
            coin: StaticData.PlayerInfo.coin + this.weekBounes,
        })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.blockNode.active = false
            return
        }
        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();

        this.initStep1()
        this.blockNode.active = false
    }
    async useTicket() {
        this.blockNode.active = true
        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        if (arenaData.ticket > 0) {
            let rs: any = await WXApi.HttpPost('/fangkuaiWx/updateTicket', {})
            if (rs.errcode != 200) {
                WXApi.tipsDialog(rs.info)
                this.blockNode.active = false
                return
            }

            let cs: any = await WXApi.HttpPost('/fangkuaiWx/changeArenaState', { state: 1 })
            if (cs.errcode != 200) {
                WXApi.tipsDialog(cs.info)
                this.blockNode.active = false
                return
            }

            let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
            if (pi.errcode != 200) {
                WXApi.tipsDialog(pi.info)
                this.blockNode.active = false
                return
            }
            PlayerDataCrl.UpdateHeroInfo(pi)

            this.playCross(() => {
                this.stepNode1.active = false
                this.initStep2()
                this.blockNode.active = false
            })
        } else {
            if (arenaData.videoTimes >= 5) {
                WXApi.tipsDialog('今天观看次数已达到上限')
                this.blockNode.active = false
                return
            }

            WXApi.OpenAdVideo(async () => {
                let cs: any = await WXApi.HttpPost('/fangkuaiWx/changeArenaState', { state: 1 })
                if (cs.errcode != 200) {
                    WXApi.tipsDialog(cs.info)
                    this.blockNode.active = false
                    return
                }

                let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
                if (pi.errcode != 200) {
                    WXApi.tipsDialog(pi.info)
                    this.blockNode.active = false
                    return
                }
                PlayerDataCrl.UpdateHeroInfo(pi)

                await WXApi.HttpPost('/fangkuaiWx/arenaVideoTimes', {})

                this.playCross(() => {
                    this.stepNode1.active = false
                    this.initStep2()
                    this.blockNode.active = false
                })
            }, WXApi.getUnitid(10))

            this.scheduleOnce(() => {
                this.blockNode.active = false
            }, 1)
        }
    }


    async initStep2() {
        this.stepNode2.active = true
        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        let selectArr: any[] = arenaData.selectArr
        let currentArr: any[] = arenaData.currentArr
        let heroAtkArr: any[] = arenaData.heroAtkArr


        //let sNode: cc.Node[] = this.stepNode2.children.filter(n => { return n.name == 'SR' || n.name == 'SG' || n.name == 'SB' || n.name == 'SY' })
        //let hNode: cc.Node[] = this.stepNode2.children.filter(n => { return n.name == 'H1' || n.name == 'H2' })

        for (let i = 0; i < currentArr.length; i++) {
            this.sNode[i].active = true
            this.sNode[i].getChildByName('r').getChildByName('atk').getComponentInChildren(cc.Label).string = heroAtkArr[i]
            //显示已选择英雄
            cc.loader.loadRes("character/avatar/H" + currentArr[i], (err, res) => {
                this.sNode[i].getChildByName('heroHere').removeAllChildren()
                let obj: cc.Node = cc.instantiate(res)
                obj.getChildByName('full').active = false
                this.sNode[i].getChildByName('heroHere').addChild(obj)
            })
        }

        if (currentArr.length > 0) {
            let delay = async () => {
                await new Promise((rs, err) => {
                    this.scheduleOnce(() => {
                        rs()
                    }, 0.58)
                })
            }
            await delay()
        } else if (currentArr.length <= 0) {
            for (let i = 0; i < 4; i++) {
                this.sNode[i].active = false
            }
        }

        if (currentArr.length >= 4) {
            //已选完英雄
            let rs: any = await WXApi.HttpPost('/fangkuaiWx/changeArenaState', { state: 2 })
            let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
            if (pi.errcode != 200) {
                WXApi.tipsDialog(pi.info)
                this.blockNode.active = false
                return
            }
            PlayerDataCrl.UpdateHeroInfo(pi)
            this.playCross(() => {
                this.initData()
                this.blockNode.active = false
            })
            return
        }

        for (let i = 0; i < this.hNode.length; i++) {
            let sArr: any[] = selectArr[currentArr.length]
            let id = sArr[i]
            //初始化信息
            this.hNode[i].getChildByName('heroName').getComponent(cc.Label).string = GameData.Share.getHeroDataById(id).name
            this.hNode[i].getChildByName('skillName').getComponent(cc.Label).string = GameData.Share.getHeroDataById(id).sn
            this.hNode[i].getChildByName('skillInfo').getComponent(cc.Label).string = GameData.Share.getHeroDataById(id).d2
            //添加英雄头像
            cc.loader.loadRes("character/avatar/H" + id, (err, res) => {
                this.hNode[i].getChildByName('heroHere').removeAllChildren()
                let obj: cc.Node = cc.instantiate(res)
                obj.getChildByName('full').active = false
                this.hNode[i].getChildByName('heroHere').addChild(obj)
            })
            //添加技能图标
            cc.loader.loadRes("block/b" + (currentArr.length + 1), (err, res) => {
                this.hNode[i].getChildByName('skillHere').removeAllChildren()
                let block: BlockCrl = cc.instantiate(res).addComponent(BlockCrl)
                block.node.getChildByName("block").removeComponent(cc.Animation)
                this.hNode[i].getChildByName('skillHere').addChild(block.node)
                block.showSkillBlock(Math.floor((id - 1) / 4), false)
            })
            //显示边框
            this.hNode[i].getChildByName('cover').children.forEach(c => {
                c.active = false
            })
            this.hNode[i].getChildByName('cover').children[currentArr.length].active = true
        }

        this.hNode[0].x = 600
        this.hNode[0].opacity = 255
        this.hNode[0].scale = 1
        this.hNode[1].x = 910
        this.hNode[1].opacity = 255
        this.hNode[1].scale = 1
        this.stepNode2.getComponent(cc.Animation).play('ArenaCardIN', 0)
        this.scheduleOnce(() => { this.blockNode.active = false }, 0.42)
    }
    async selectHero(event, data) {
        this.blockNode.active = true

        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        let selectArr: any[] = arenaData.selectArr
        let currentArr: any[] = arenaData.currentArr
        let heroAtkArr: any[] = arenaData.heroAtkArr

        let id: number = parseInt(data)
        let rs: any = await WXApi.HttpPost('/fangkuaiWx/selectHero', { id: selectArr[currentArr.length][id] })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.blockNode.active = false
            return
        }

        let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        if (pi.errcode != 200) {
            WXApi.tipsDialog(pi.info)
            this.blockNode.active = false
            return
        }
        PlayerDataCrl.UpdateHeroInfo(pi)

        this.stepNode2.getComponent(cc.Animation).play('SelectH' + (id + 1))

        this.scheduleOnce(() => {
            this.initStep2()
        }, 1.17)
    }

    initStep3() {
        this.stepNode3.active = true
        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        let state: number = arenaData.state
        let startFA: boolean = arenaData.startFromArean
        let selectArr: any[] = arenaData.selectArr
        let currentArr: any[] = arenaData.currentArr
        let heroAtkArr: any[] = arenaData.heroAtkArr
        let winTimes: number = arenaData.winTimes
        let defeatedTimes: number = arenaData.defeatedTimes
        let maxDefeatedTimes: number = arenaData.maxDefeatedTimes
        let challengeOver: boolean = arenaData.challengeOver
        let baseHp: number = arenaData.baseHp
        let ticket: number = arenaData.ticket
        let flushTime: number = arenaData.flushTime


        //初始化奖金   胜场
        winTimes = winTimes > 15 ? 15 : winTimes
        for (let i = 2; i < this.stepNode3.getChildByName('PLayout').getChildByName('prize').childrenCount; i++) {
            this.stepNode3.getChildByName('PLayout').getChildByName('prize').children[i].active = false
            if (i < this.stepNode3.getChildByName('PLayout').getChildByName('Nprize').childrenCount)
                this.stepNode3.getChildByName('PLayout').getChildByName('Nprize').children[i].active = false
        }
        this.stepNode3.getChildByName('PLayout').getChildByName('prize').getChildByName(winTimes.toString()).active = true
        this.stepNode3.getChildByName('PLayout').getChildByName('Nprize').active = winTimes < 15
        if (this.stepNode3.getChildByName('PLayout').getChildByName('Nprize').active)
            this.stepNode3.getChildByName('PLayout').getChildByName('Nprize').getChildByName((winTimes + 1).toString()).active = true

        this.stepNode3.getChildByName('winCount').getComponent(cc.Label).string = winTimes.toString()
        //初始化血量
        this.stepNode3.getChildByName('HP').getComponent(cc.Label).string = baseHp.toString()
        //初始化已选英雄
        let hArr: cc.Node[] = this.stepNode3.children.filter(c => { return c.name == 'R' || c.name == 'G' || c.name == 'B' || c.name == 'Y' })
        for (let i = 0; i < currentArr.length; i++) {
            hArr[i].getChildByName('atk').getComponent(cc.Label).string = heroAtkArr[i]
            if (heroAtkArr[i] != this.tempAtkArr[i]) {
                hArr[i].getComponent(cc.Animation).play()
            }
            //显示已选择英雄
            cc.loader.loadRes("character/avatar/H" + currentArr[i], (err, res) => {
                hArr[i].getChildByName('heroHere').removeAllChildren()
                let obj: cc.Node = cc.instantiate(res)
                obj.getChildByName('full').active = false
                hArr[i].getChildByName('heroHere').addChild(obj)
            })
        }
        //初始化失败场数
        let chanceNode: cc.Node = this.stepNode3.getChildByName('chance')
        chanceNode.children[3].children[0].active = false
        chanceNode.children[3].children[1].active = false
        chanceNode.children[3].getChildByName('watched').active = maxDefeatedTimes == 4
        for (let i = 0; i < maxDefeatedTimes; i++) {
            chanceNode.children[i].getChildByName('isUsed').active = i < defeatedTimes
        }
        //初始化按钮
        let playB: cc.Node = this.stepNode3.getChildByName('playB')
        let moreB: cc.Node = this.stepNode3.getChildByName('moreB')
        let getB: cc.Node = this.stepNode3.getChildByName('getB')
        let upgradeB: cc.Node = this.stepNode3.getChildByName('upgradeB')
        playB.active = false
        moreB.active = false
        getB.active = false
        upgradeB.active = false

        this.stepNode3.getChildByName('giveUpB').active = !challengeOver

        //上一局是否胜利
        let isWin: boolean = arenaData.lastState

        if (isWin && !arenaData.updateAtk && !challengeOver) {
            upgradeB.active = true
        } else {
            if (challengeOver) {
                getB.active = true
            } else {
                if (maxDefeatedTimes >= 4) {
                    if (defeatedTimes >= 4) {
                        getB.active = true
                    } else {
                        playB.active = true
                    }
                } else {
                    if (defeatedTimes >= 3) {
                        moreB.active = true
                    } else {
                        playB.active = true
                    }
                }
            }
        }

        this.tempAtkArr = heroAtkArr
    }
    activeGiveUp() {
        this.node.getChildByName('giveUpConfirm').active = !this.node.getChildByName('giveUpConfirm').active
    }
    async giveUpCB() {
        this.blockNode.active = true
        let rs: any = await WXApi.HttpPost('/fangkuaiWx/challengeOver', {})
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.blockNode.active = false
            return
        }
        let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        if (pi.errcode != 200) {
            WXApi.tipsDialog(pi.info)
            this.blockNode.active = false
            return
        }
        PlayerDataCrl.UpdateHeroInfo(pi)

        this.activeGiveUp()
        this.initStep3()
        this.blockNode.active = false
    }
    playCB() {
        StaticData.startFromArena = true
        GameMenuUI.Share.startBtnCB(null, null)
    }
    moreCB() {
        this.blockNode.active = true

        WXApi.OpenAdVideo(async () => {
            let rs: any = await WXApi.HttpPost('/fangkuaiWx/addMaxDT', {})
            if (rs.errcode != 200) {
                WXApi.tipsDialog(rs.info)
                this.blockNode.active = false
                return
            }
            let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
            if (pi.errcode != 200) {
                WXApi.tipsDialog(pi.info)
                this.blockNode.active = false
                return
            }
            PlayerDataCrl.UpdateHeroInfo(pi)
            this.initStep3()
        }, WXApi.getUnitid(10))

        this.scheduleOnce(() => {
            this.blockNode.active = false
        }, 2)
    }
    activeUpgrade() {
        this.node.getChildByName('getUpgrade').active = !this.node.getChildByName('getUpgrade').active
    }
    async upgradeCB(event, data) {
        this.blockNode.active = true
        let id: number = parseInt(data)
        if (id == 0) {
            let rs: any = await WXApi.HttpPost('/fangkuaiWx/addHeroAtk', {})
            if (rs.errcode != 200) {
                WXApi.tipsDialog(rs.info)
                this.blockNode.active = false
                return
            }
        } else if (id == 1) {
            let rs: any = await WXApi.HttpPost('/fangkuaiWx/addBaseHp', {})
            if (rs.errcode != 200) {
                WXApi.tipsDialog(rs.info)
                this.blockNode.active = false
                return
            }
        }
        let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        if (pi.errcode != 200) {
            WXApi.tipsDialog(pi.info)
            this.blockNode.active = false
            return
        }
        PlayerDataCrl.UpdateHeroInfo(pi)
        this.activeUpgrade()
        this.initStep3()
        this.blockNode.active = false
    }

    async getCB() {
        this.blockNode.active = true
        let pInfo: any = StaticData.PlayerInfo
        let arenaData: any = pInfo.arenaData

        let bounes: number = 50
        let wt: number = arenaData.winTimes > 15 ? 15 : arenaData.winTimes
        switch (wt) {
            case 0:
                bounes = 50
                break
            case 1:
                bounes = 150
                break
            case 2:
                bounes = 200
                break
            case 3:
                bounes = 280
                break
            case 4:
                bounes = 360
                break
            case 5:
                bounes = 420
                break
            case 6:
                bounes = 500
                break
            case 7:
                bounes = 580
                break
            case 8:
                bounes = 680
                break
            case 9:
                bounes = 780
                break
            case 10:
                bounes = 880
                break
            case 11:
                bounes = 980
                break
            case 12:
                bounes = 1280
                break
            case 13:
                bounes = 1680
                break
            case 14:
                bounes = 1980
                break
            case 15:
                bounes = 2800
                break
        }

        await WXApi.HttpPost('/fangkuaiWx/initAreanaData', {})

        let rs = await WXApi.HttpPost('/fangkuaiWx/updateCoin', {
            coin: StaticData.PlayerInfo.coin + bounes,
        })
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.blockNode.active = false
            return
        }

        PlayerDataCrl.UpdateHeroInfo(rs)
        GameMenuUI.Share.refrashUI();

        this.scheduleOnce(() => {
            this.playCross(() => {
                this.initData()
                this.blockNode.active = false
            })
        }, 1)
    }

    playCross(cb: any) {
        this.node.getChildByName('crossFX').getComponent(cc.Animation).play()
        this.scheduleOnce(cb, 0.5)
    }

    activeRule() {
        this.ruleNode.active = !this.ruleNode.active
    }

    update(dt) { }
}
