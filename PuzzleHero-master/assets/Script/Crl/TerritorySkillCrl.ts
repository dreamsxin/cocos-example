import TerritoryAssiCrl, { DBlock } from "./TerritoryAssiCrl";
import BlockCrl from "./BlockCrl";
import Utility from "../Lib/Utility";
import GameLogicCrl from "./GameLogicCrl";
import EventString from "../EventString";
import StaticData from "../StaticData";
import GameData from "../GameData";
import SoundMgr from "../Lib/SoundMgr";
import HeroData from "../Mod/HeroData";
import ActionAdv from "../Lib/ActionFio";
import GameSceneUI from "../UI/GameSceneUI";
import GameSceneCrl from "./GameSceneCrl";
import PlayerData from "../Mod/PlayerData";

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
export default class TerritorySkillCrl extends TerritoryAssiCrl {


    handleSkillsFromFirst(subkill, lastblocks: DBlock, mHero: BlockCrl) {

        let skilltype = Number(lastblocks.t + "" + subkill)
        let count = lastblocks.c
        let hp = lastblocks.hp
        // let skillsound = GameData.Share.getHeroDataById(lastblocks.hid).ss
        // SoundMgr.Share.PlaySound(skillsound)
        return new Promise(async (resolve, error) => {
            switch (skilltype) {
                case 10:
                    let onerows: BlockCrl[] = []
                    let mxx: cc.Vec2 = lastblocks.sbpos[0]
                    //lastblocks.sbpos.splice(lastblocks.sbpos.indexOf(mxx), 1)
                    let blocks = GameLogicCrl.Share.blockMats
                    for (let i = 0; i < blocks.length; i++) {
                        if (blocks[i].mxtPos.x == mxx.x && blocks[i].hid < 0) {
                            onerows.push(blocks[i])
                        }
                    }
                    onerows = onerows.sort((n1, n2) => {
                        return n1.node.y - n2.node.y
                    })
                    let delquene = []
                    for (let i = 0; i < onerows.length; i++) {
                        let acta = async () => {
                            await new Promise((resolve, ererr) => {
                                cc.loader.loadRes("fx/BreakB", (err, res) => {
                                    let bb: cc.Node = cc.instantiate(res)
                                    GameLogicCrl.Share.gamePanel.addChild(bb)
                                    bb.position = onerows[i].node.position
                                    let act1 = cc.delayTime(0.15)
                                    let act11 = cc.callFunc(() => {
                                        resolve()
                                    })
                                    let act3 = cc.delayTime(0.15)
                                    let act2 = cc.removeSelf()
                                    bb.runAction(cc.sequence(act1, act11, act3, act2))
                                })
                            })
                            await this.removeBlocksMats(onerows[i])
                        }
                        delquene.push(acta())
                    }
                    this.playSkillSound(1, 0)
                    await new Promise((resolve, reerr) => {
                        Promise.all(delquene).then(() => {
                            resolve()
                        })
                    })
                    break;
                case 11:
                    for (let i = 0; i < 2; i++) {
                        try {
                            this.playSkillSound(1, 1)
                            let freeblock = this.getFreeBlock()
                            let ninjablocks = new DBlock()
                            ninjablocks.hp = 0
                            ninjablocks.p = freeblock[GameLogicCrl.Share.syncRandom(0, freeblock.length)].mxtPos
                            await this.removeBlocksMats(this.getBlockByMpos(ninjablocks.p), 0.1)
                            ninjablocks.c = 1
                            ninjablocks.t = lastblocks.t
                            //ninjablocks.skillblock = lastblocks.skillblock
                            await GameLogicCrl.Share.makupHero(ninjablocks)
                        } catch (e) {

                        }
                    }
                    break
                case 20:
                    //this.playSkillSound(2, 0)
                    let hero = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer].heros[lastblocks.t - 1]
                    hp = Math.round((hero.atk * count * 0.5))
                    let event1 = new cc.Event.EventCustom(EventString.HealingEvent, true)
                    event1.setUserData([hp, [2, 0]])
                    this.node.dispatchEvent(event1)
                    break
                case 23:
                    let heros: BlockCrl[] = this.getAllHeros()
                    heros.splice(heros.indexOf(mHero), 1)
                    let quene: any[] = []
                    heros.forEach(hero => {
                        let doact = () => {
                            return new Promise((resolve, reerr) => {
                                cc.loader.loadRes("fx/HeroSkill/PowerDown", (err, res) => {
                                    this.playSkillSound(2, 3)
                                    let eff: cc.Node = cc.instantiate(res)
                                    hero.node.addChild(eff)
                                    let costhp = Math.round(hero.hp * 0.2)
                                    hero.hp = costhp < 1 ? 1 : costhp
                                    hero.updateHp()
                                    let dely = cc.delayTime(0.5)
                                    let remove = cc.removeSelf()
                                    let call = cc.callFunc(() => {
                                        resolve()
                                    })
                                    eff.runAction(cc.sequence(dely, remove, call))
                                })

                            })
                        }
                        quene.push(doact())
                    })
                    let alldo = () => {
                        return new Promise((resolve, reerr) => {
                            Promise.all(quene).then(() => {
                                resolve()
                            })
                        })
                    }
                    await alldo()
                    break
                case 24:
                    console.log('show skill 24')
                    let allLink: any[] = this.getCanLinkBlocks()
                    let removeArr: any[] = []
                    if (allLink.length <= 0) {
                        break
                    } else if (allLink.length == 1) {
                        removeArr.push([].concat(allLink[0]))
                    } else if (allLink.length == 2) {
                        removeArr.push([].concat(allLink[0]))
                        removeArr.push([].concat(allLink[1]))
                    } else {
                        // let shuffleArr: any[] = [].concat(Utility.shuffleArr(allLink))
                        // removeArr.push([].concat(shuffleArr[0]))
                        // removeArr.push([].concat(shuffleArr[1]))
                        removeArr.push([].concat(allLink[0]))
                        removeArr.push([].concat(allLink[1]))
                    }
                    let queneArr: any[] = []
                    removeArr.forEach(a => {
                        a.forEach(b => {
                            if (b.blockSkill == -1 && b.hid == -1) {
                                let q: any = async () => {
                                    await new Promise(async (rs, er) => {
                                        cc.loader.loadRes('fx/HeroSkill/SmashFX', (err, res) => {
                                            let f: cc.Node = cc.instantiate(res)
                                            f.parent = GameLogicCrl.Share.gamePanel
                                            f.position = b.node.position
                                            let dl = cc.delayTime(f.getComponent(cc.Animation).getClips()[0].duration)
                                            let rm = cc.removeSelf()
                                            f.runAction(cc.sequence(dl, rm))
                                        })
                                        await this.removeBlocksMats(b)
                                        rs()
                                    })
                                }
                                queneArr.push(q())
                            }
                        });
                    });
                    this.playSkillSound(2, 4)
                    let doQ = () => {
                        return new Promise((resolve, reerr) => {
                            Promise.all(queneArr).then(() => {
                                resolve()
                            })
                        })
                    }
                    await doQ()
                    break
                case 30:
                    //this.playSkillSound(3, 0)
                    let event2 = new cc.Event.EventCustom(EventString.ShieldEvent, true)
                    event2.setUserData([hp])
                    this.node.dispatchEvent(event2)
                    break
                case 40:
                    //this.playSkillSound(4, 0)
                    hero = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer].heros[lastblocks.t - 1]
                    let costhp = Math.round((hero.atk * count * 0.5))
                    let event3 = new cc.Event.EventCustom(EventString.AttackEvent, true)
                    event3.setUserData([costhp, true, [4, 0]])
                    this.node.dispatchEvent(event3)
                    break
                case 21:
                    this.playSkillSound(2, 1)
                    hero = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer].heros[lastblocks.t - 1]
                    hp = Math.round((hero.atk * count * 0.30))
                    this.handleMineHeros(hero => {
                        hero.showHeal(hp)
                    })
                    break
                case 41:
                    let enheros = this.getEnemyHeros()
                    if (enheros.length < 1) {
                        break
                    }
                    hero = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer].heros[lastblocks.t - 1]
                    let enhero = enheros[GameLogicCrl.Share.syncRandom(0, enheros.length - 1)]
                    costhp = Math.round((hero.atk * count * 0.40))
                    //减伤
                    let hurt: number = enhero.deciInjury ? Math.floor(costhp / 2) : costhp
                    enhero.hp -= hurt
                    let fun = () => {
                        return new Promise((resolve, err) => {
                            cc.loader.loadRes("fx/PDamage", (err, res) => {
                                this.playSkillSound(4, 1)
                                let eff: cc.Node = cc.instantiate(res)
                                eff.position = enhero.node.position
                                enhero.node.parent.addChild(eff)
                                eff.zIndex = cc.macro.MAX_ZINDEX
                                let act1 = cc.delayTime(1)
                                let act11 = cc.callFunc(() => {
                                    resolve()
                                })
                                let act2 = cc.removeSelf()
                                eff.runAction(cc.sequence(act1, act11, act2))
                            })
                        })
                    }
                    if (enhero.hp <= 0) {
                        await fun()
                        await enhero.showDie(costhp)
                        await this.removeBlocksMats(enhero)
                    } else {
                        await fun()
                        enhero.showHurt(hurt)
                    }
                    enhero.updateHp()
                    break
                case 43:
                    enheros = this.getEnemyHeros()
                    if (enheros.length < 1) {
                        break
                    }
                    hero = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer].heros[lastblocks.t - 1]
                    costhp = Math.round((hero.atk * count * 0.5))
                    quene = []
                    for (let i = 0; i < enheros.length; i++) {
                        let enh = enheros[i]
                        let pm = new Promise((resolve, ererr) => {
                            cc.loader.loadRes("fx/HeroSkill/Thunder", (err, res) => {
                                this.playSkillSound(4, 3)
                                let eff: cc.Node = cc.instantiate(res)
                                let dely = cc.delayTime(1.12)
                                let remove = cc.removeSelf()
                                let fun = cc.callFunc(() => {
                                    resolve()
                                })
                                enh.node.addChild(eff)
                                eff.runAction(cc.sequence(dely, remove, fun))
                            })
                        })
                        quene.push(pm)
                    }

                    await new Promise((resolve, reerr) => {
                        Promise.all(quene).then(
                            () => {
                                resolve()
                            }
                        )
                    })
                    let allquene = []
                    for (let i = 0; i < enheros.length; i++) {
                        let act = new Promise(async (resolve, reerr) => {
                            //减伤
                            let hurt: number = enheros[i].deciInjury ? Math.floor(costhp / 2) : costhp
                            enheros[i].hp -= hurt
                            if (enheros[i].hp > 0) {
                                enheros[i].showHurt(hurt)
                                enheros[i].updateHp()
                            } else {
                                await enheros[i].showDie(costhp)
                                await this.removeBlocksMats(enheros[i])
                                await this.handleSkillHurt(enheros[i])
                            }
                            resolve()
                        })
                        allquene.push(act)
                    }
                    await new Promise((resolve, reerr) => {
                        Promise.all(allquene).then(() => {
                            resolve()
                        })
                    })

                    break
                case 44:
                    console.log('show skill 44')
                    let opSkillBlocks: BlockCrl[] = this.getOpSkillBlocks()
                    console.log('show opskillbs:', opSkillBlocks)
                    opSkillBlocks.forEach(async (b) => {
                        let myBS: BlockCrl[] = this.getMyBlocksExHero()
                        let t: number = b.type
                        let tB: BlockCrl[] = myBS.filter((mb) => { return mb.type == t })
                        if (tB.length <= 0) {
                            tB = myBS
                        }
                        //let transB: BlockCrl = tB[Math.floor(Math.random() * tB.length)]
                        let transB: BlockCrl = tB[GameLogicCrl.Share.syncRandom(0, tB.length - 1)]
                        for (let i = 0; i < 2; i++) {
                            let p1 = b.node.position
                            let p2 = transB.node.position
                            cc.loader.loadRes('fx/HeroSkill/SmokeFX', (err, res) => {
                                let f: cc.Node = cc.instantiate(res)
                                if (i == 0) {
                                    f.parent = GameLogicCrl.Share.gamePanel
                                    f.position = p1
                                } else {
                                    f.parent = GameLogicCrl.Share.gamePanel
                                    f.position = p2
                                }
                                let dl = cc.delayTime(f.getComponent(cc.Animation).getClips()[0].duration)
                                let rm = cc.removeSelf()
                                f.runAction(cc.sequence(dl, rm))
                            })
                        }
                        b.mxtPos = transB.mxtPos
                        b.node.position = transB.node.position
                        b.updateImage()
                        this.playSkillSound(4, 4)
                        await this.removeBlocksMats(transB)
                    })
                    break
                case 15:
                    {
                        let atked: BlockCrl[] = []
                        let opH: BlockCrl[] = this.getOpponentHero()
                        opH.forEach((h) => {
                            cc.loader.loadRes('fx/HeroSkill/FeverFX', (err, res) => {
                                let f: cc.Node = cc.instantiate(res)
                                h.node.addChild(f)
                            })
                        })
                        this.playSkillSound(1, 5)
                        await this.heroSkillAttack(atked, opH, GameLogicCrl.Share.roundPlayer == 1)
                        this.getOpponentHero().forEach((h) => {
                            if (h.node.getChildByName('FeverFX')) {
                                h.node.getChildByName('FeverFX').removeFromParent()
                            }
                        })
                    }
                    break
                case 25:
                    {
                        let ob: BlockCrl[] = this.getOpponentHero()
                        let cb: Function = () => {
                            return new Promise((rs, rj) => {
                                cc.loader.loadRes('fx/HeroSkill/IceBlastFX', (err, res) => {
                                    let f: cc.Node = cc.instantiate(res)
                                    GameLogicCrl.Share.gamePanel.addChild(f)
                                    let pos: cc.Vec2 = GameLogicCrl.Share.roundPlayer == 1 ? cc.v2(2, 2) : cc.v2(2, 7)
                                    f.position = GameLogicCrl.Share.tranMxpToPos(pos)

                                    this.playSkillSound(2, 5)
                                    this.scheduleOnce(() => {
                                        ob.forEach((b) => {
                                            cc.loader.loadRes('fx/HeroSkill/FrozenFX', (err, res) => {
                                                let f: cc.Node = cc.instantiate(res)
                                                b.node.addChild(f)
                                            })
                                        })
                                    }, 0.3)
                                    this.scheduleOnce(() => {
                                        f.removeFromParent()
                                        rs()
                                    }, 0.5)
                                })
                            })
                        }
                        await cb()
                    }

                    break
                case 35:
                    {
                        let ob: BlockCrl[] = this.getOpSkillBlocks()
                        ob.forEach((b) => {
                            cc.loader.loadRes('fx/HeroSkill/prohibitFX', (err, res) => {
                                let f: cc.Node = cc.instantiate(res)
                                b.node.addChild(f)
                                this.playSkillSound(3, 5)
                            })
                        })
                    }
                    break
                case 45:
                    {
                        let opH: BlockCrl[] = this.getOpponentHero()
                        if (opH.length <= 0) break
                        opH.sort((a, b) => a.hp - b.hp)
                        let rH: BlockCrl = opH[0]
                        let cb: Function = () => {
                            return new Promise((rs, rj) => {
                                cc.loader.loadRes('fx/HeroSkill/ufoFX', (err, res) => {
                                    let f: cc.Node = cc.instantiate(res)
                                    GameLogicCrl.Share.gamePanel.addChild(f, 999999)
                                    f.position = GameLogicCrl.Share.tranMxpToPos(rH.mxtPos)

                                    this.playSkillSound(4, 5)
                                    this.scheduleOnce(() => { this.removeBlocksMats(rH) }, 0.5)
                                    this.scheduleOnce(() => {
                                        f.removeFromParent()
                                        rs()
                                    }, 1.17)
                                })
                            })
                        }
                        await cb()
                    }
                    break
                default:
                    break;
            }
            resolve()
        })
    }

    //one time 
    handleSkillFirst(lastblocks: DBlock, mHero: BlockCrl) {
        return new Promise(async (resolve, err) => {

            if (lastblocks.skillblock.length < 1) {
                resolve()
                return
            }
            // let skillsound = GameData.Share.getHeroDataById(lastblocks.hid).ss
            // SoundMgr.Share.PlaySound(skillsound)

            for (let i = 0; i < lastblocks.skillblock.length; i++) {
                let sbs = lastblocks.skillblock[i]
                await this.handleSkillsFromFirst(sbs, lastblocks, mHero)
                if (lastblocks.sbpos.length > 0)
                    lastblocks.sbpos.splice(0, 1)
            }
            resolve()
        })
    }

    handleSkillFromSecond(hero: BlockCrl, skill: number, lastblocks: DBlock) {
        return new Promise(async (resolve, err) => {
            cc.log("heroinfo", hero.hid, skill)
            let type = Number(hero.type + "" + skill)
            switch (type) {
                case 31:
                    hero.shield = 1
                    cc.loader.loadRes("fx/HShield", (err, res) => {
                        this.playSkillSound(3, 1)
                        let shield: cc.Node = cc.instantiate(res)
                        shield.position = cc.Vec2.ZERO
                        shield.name = "bshield"
                        hero.node.addChild(shield)
                    })
                    cc.log("solder skill")
                    break;

                case 32:
                    cc.log("ash skill")
                    let edgedir = GameLogicCrl.Share.roundPlayer == 0 ? -1 : 1
                    let myheros = this.getMyHero().sort((n1, n2) => edgedir == -1 ? (n1.mxtPos.y - n2.mxtPos.y) : (n2.mxtPos.y - n1.mxtPos.y))
                    let quene = []
                    myheros.forEach(hero => {
                        let offset = hero.mxtPos.y
                        cc.log("hero:", hero.mxtPos)
                        let descblock: BlockCrl = null
                        let descpos: cc.Vec2 = null

                        while (true) {
                            offset += edgedir
                            if (offset < 0 || offset > 9) {
                                break
                            }
                            let check = this.getBlockByMpos(cc.v2(hero.mxtPos.x, offset))
                            if (check != null && check.hid == -1) {
                                descblock = check
                                descpos = cc.v2(hero.mxtPos.x, offset)
                            }
                            if (check == null) {
                                descpos = cc.v2(hero.mxtPos.x, offset)
                            }

                        }
                        cc.log("descblock:", descblock)
                        if (descpos != null) {
                            if (descblock != null) {
                                descblock.mxtPos = hero.mxtPos.clone()
                                descblock.node.position = GameLogicCrl.Share.tranMxpToPos(descblock.mxtPos)
                                //   let act1 = cc.moveTo(0.1, GameLogicCrl.Share.tranMxpToPos(descblock.mxtPos))
                                //   descblock.node.runAction(act1)
                            }
                            hero.mxtPos = descpos
                            let qu = new Promise((resolve, reerr) => {
                                let act1 = cc.moveTo(0.12, GameLogicCrl.Share.tranMxpToPos(hero.mxtPos))
                                let act2 = cc.callFunc(() => {
                                    resolve()
                                })
                                hero.node.runAction(cc.sequence(act1, act2))

                                cc.loader.loadRes("fx/HeroSkill/Fallback", (err, res) => {
                                    this.playSkillSound(3, 2)
                                    let eff: cc.Node = cc.instantiate(res)
                                    eff.position = cc.Vec2.ZERO
                                    hero.node.addChild(eff)
                                    let act1 = cc.delayTime(0.5)
                                    let act2 = cc.removeSelf()
                                    eff.runAction(cc.sequence(act1, act2))
                                })
                            })
                            quene.push(qu)
                        }
                    })
                    await new Promise((resolve, reerr) => {
                        Promise.all(quene).then(() => {
                            resolve()
                        })
                    })
                    break

                case 16:
                    {
                        let myH: BlockCrl[] = this.getMyHero()
                        if (myH.length <= 0) break
                        myH.sort((a, b) => a.hp - b.hp)

                        let cb: Function = () => {
                            return new Promise((rs, er) => {
                                cc.loader.loadRes("fx/HeroSkill/deathFX", async (err, res) => {
                                    this.playSkillSound(1, 6)
                                    let eff: cc.Node = cc.instantiate(res)
                                    eff.position = GameLogicCrl.Share.tranMxpToPos(myH[0].mxtPos)
                                    GameLogicCrl.Share.gamePanel.addChild(eff)
                                    await this.removeBlocksMats(myH[0])
                                    let tp: cc.Vec2 = GameLogicCrl.Share.basePoint[GameLogicCrl.Share.roundPlayer]
                                    let act1 = cc.delayTime(0.2)
                                    let act2 = cc.moveTo(0.5, tp)
                                    let act3 = cc.callFunc(() => {
                                        let player: PlayerData = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer]
                                        let hp = player.maxHp * 0.25
                                        let event1 = new cc.Event.EventCustom(EventString.HealingEvent, true)
                                        event1.setUserData([hp, [1, 6]])
                                        this.node.dispatchEvent(event1)
                                        eff.removeFromParent()
                                        rs()
                                    })
                                    let act4 = cc.sequence(act1, act2.easing(cc.easeIn(3)), act3)
                                    eff.runAction(act4)
                                })
                            })
                        }
                        await cb()
                    }
                    break
                case 26:
                    {
                        hero.antiInjury = true
                        cc.loader.loadRes("fx/HeroSkill/thorns", async (err, res) => {
                            this.playSkillSound(2, 6)
                            let eff: cc.Node = cc.instantiate(res)
                            hero.node.addChild(eff)
                        })
                    }
                    break
                case 36:
                    {
                        hero.deciInjury = true
                        cc.loader.loadRes("fx/HeroSkill/shieldFX", async (err, res) => {
                            this.playSkillSound(3, 6)
                            let eff: cc.Node = cc.instantiate(res)
                            hero.node.addChild(eff)
                        })
                    }
                    break
                case 46:
                    {
                        hero.oneKill = true
                        cc.loader.loadRes("fx/HeroSkill/agentsFX", async (err, res) => {
                            this.playSkillSound(4, 6)
                            let eff: cc.Node = cc.instantiate(res)
                            hero.node.addChild(eff)
                        })
                    }
                    break
            }
            resolve()
        })
    }


    handleSkillSecond(heroblock: BlockCrl, lastblocks: DBlock) {
        return new Promise(async (resolve, err) => {
            if (lastblocks.skillblock.length < 1) {
                resolve()
                return
            }
            console.log('heroblock.heroSkills:', heroblock.heroSkills)
            for (let i = 0; i < heroblock.heroSkills.length; i++) {
                await this.handleSkillFromSecond(heroblock, heroblock.heroSkills[i], lastblocks)
            }
            resolve()
        })
    }

    handleSkillFromRoundEnd(heroBlock: BlockCrl, skill: number) {
        return new Promise(async (resolve, reerr) => {
            let type = Number(heroBlock.type + "" + skill)
            cc.log("roundend skill", type)
            switch (type) {
                case 22:
                    let event2 = new cc.Event.EventCustom(EventString.HealingEvent, true)
                    event2.setUserData([Math.round(heroBlock.hp * 0.50), [2, 2]])
                    this.node.dispatchEvent(event2)
                    cc.log("mehic mac skill")
                    break
                case 42:
                    let cpos = heroBlock.mxtPos
                    this.handleMineHeros((hero) => {
                        let dirs = StaticData.Dirs
                        for (let i = 0; i < dirs.length; i++) {
                            if (hero.mxtPos.equals(cpos.add(dirs[i])) == true && !hero.mxtPos.equals(cpos)) {
                                hero.showHeal(Math.round(heroBlock.hp * 0.50))
                            }
                        }
                    })
                    cc.loader.loadRes("fx/aura", (err, res) => {
                        this.playSkillSound(4, 2)
                        let aura: cc.Node = cc.instantiate(res)
                        aura.position = heroBlock.node.position
                        heroBlock.node.parent.addChild(aura)
                        let act1 = cc.delayTime(1)
                        let act2 = cc.removeSelf()
                        aura.runAction(cc.sequence(act1, act2))
                    })
                    cc.log("cpos:", cpos, "kmen skill heal the heros")
                    break
            }
            resolve()
        })
    }

    handleSkillBeforeRoundEnd() {
        return new Promise(async (resolve, reerr) => {
            let heros = this.getMineHeros()
            for (let i = 0; i < heros.length; i++) {
                let hero = heros[i]
                for (let j = 0; j < hero.heroSkills.length; j++) {
                    await this.handleSkillFromBeforeRoundEnd(hero, hero.heroSkills[j])
                }
            }
            resolve()
        })
    }
    handleSkillFromBeforeRoundEnd(heroBlock: BlockCrl, skill: number) {
        return new Promise(async (resolve, reerr) => {
            let type = Number(heroBlock.type + "" + skill)
            cc.log("roundend skill", type)
            switch (type) {
                case 14:
                    console.log('show 14 skill')
                    let oHeroData: BlockCrl[] = this.getOpponentHero()
                    if (oHeroData.length > 0) {
                        oHeroData = oHeroData.sort((a, b) => b.hp - a.hp)
                        let bestHero: BlockCrl = oHeroData[0]

                        let changeBS: BlockCrl[] = []
                        let myBS: BlockCrl[] = this.getMyBlocksExHero()
                        let searchCount: number = 1
                        while (changeBS.length <= 0) {
                            myBS.forEach((b) => {
                                if (b.mxtPos.y == heroBlock.mxtPos.y) {
                                    if (b.mxtPos.x == heroBlock.mxtPos.x - searchCount || b.mxtPos.x == heroBlock.mxtPos.x + searchCount) {
                                        changeBS.push(b)
                                    }
                                }
                                if (b.mxtPos.x == heroBlock.mxtPos.x) {
                                    if (b.mxtPos.y == heroBlock.mxtPos.y - searchCount || b.mxtPos.y == heroBlock.mxtPos.y + searchCount) {
                                        changeBS.push(b)
                                    }
                                }
                            })
                            searchCount++
                        }
                        let changeCB: any = () => {
                            //let nearB: BlockCrl = changeBS[Math.floor(Math.random() * changeBS.length)]
                            let nearB: BlockCrl = changeBS[GameLogicCrl.Share.syncRandom(0, changeBS.length - 1)]
                            bestHero.mxtPos = nearB.mxtPos
                            bestHero.node.position = GameLogicCrl.Share.tranMxpToPos(bestHero.mxtPos)
                            bestHero.updateImage()
                            this.removeBlocksMats(nearB)
                        }
                        let cb: any = () => {
                            return new Promise((rs, er) => {
                                cc.loader.loadRes('fx/HeroSkill/SeduceFX', (err, res) => {
                                    let f: cc.Node = cc.instantiate(res)
                                    f.parent = bestHero.node
                                    let dl = cc.delayTime(f.getComponentInChildren(cc.Animation).getClips()[0].duration)
                                    let rm = cc.removeSelf()
                                    let cbf = cc.callFunc(() => {
                                        changeCB()
                                        rs()
                                    })
                                    f.runAction(cc.sequence(dl, rm, cbf))
                                })
                            })
                        }
                        this.playSkillSound(1, 4)
                        await cb()
                    }
                    heroBlock.heroSkills.splice(heroBlock.heroSkills.indexOf(skill), 1)
                    break
                case 34:
                    let allLink: any[] = this.getCanLinkBlocks()
                    if (allLink.length <= 0) break
                    //let removeArr: BlockCrl[] = allLink[Math.floor(Math.random() * allLink.length)]
                    let removeArr: BlockCrl[] = allLink[GameLogicCrl.Share.syncRandom(0, allLink.length - 1)]

                    if (removeArr.length <= 0) break
                    let p: cc.Vec2 = removeArr[0].mxtPos.clone()

                    let destroyblocks: DBlock = await this.handleSKillDestroyBlocks(removeArr)
                    destroyblocks.p = p
                    await GameLogicCrl.Share.makupHero(destroyblocks)

                    let quene: any[] = []
                    removeArr.forEach((r) => {
                        let q: any = async () => {
                            await new Promise(async (rs, er) => {
                                await this.removeBlocksMats(r)
                                rs()
                            })
                        }
                        quene.push(q())
                    })
                    this.playSkillSound(3, 4)
                    await new Promise((rs, er) => {
                        Promise.all(quene).then(() => {
                            if (heroBlock.node.getChildByName('intercomFX'))
                                heroBlock.node.getChildByName('intercomFX').removeFromParent()
                            rs()
                        })
                    })
                    heroBlock.heroSkills.splice(heroBlock.heroSkills.indexOf(skill), 1)
                    break
            }
            resolve()
        })
    }

    handleSkillRoundEnd() {
        return new Promise(async (resolve, reerr) => {
            let fitvalue = [[2, 2], [4, 2]]
            let heros = this.getMineHeros()
            for (let i = 0; i < heros.length; i++) {
                let hero = heros[i]
                for (let j = 0; j < hero.heroSkills.length; j++) {
                    for (let k = 0; k < fitvalue.length; k++) {
                        if (hero.type == fitvalue[k][0] && hero.heroSkills[j] == fitvalue[k][1]) {
                            await this.handleSkillFromRoundEnd(hero, fitvalue[k][1])
                        }
                    }
                }
            }
            resolve()
        })
    }


    handleSkillFromAttack(heroblock: BlockCrl, skill: number, defs?: BlockCrl[]) {
        return new Promise(async (resolve, reerr) => {
            let type = Number(heroblock.type + "" + skill)
            switch (type) {
                case 12:
                    if (this.isKillDef) {
                        this.playSkillSound(1, 2)
                        await heroblock.showHeal(Math.round(heroblock.hp / 2))
                    }
                    break
                case 13:
                    if (defs != null && defs.length > 0) {
                        let atk = heroblock
                        let isEnemy = GameLogicCrl.Share.roundPlayer == 0 ? false : true
                        let tp = GameLogicCrl.Share.basePoint[isEnemy ? 0 : 1]
                        let costHp: number = 0
                        await heroblock.showAckSkill(defs[0].node.position, GameLogicCrl.Share.gamePanel)
                        this.playSkillSound(1, 3)
                        //减伤
                        let hurt: number = defs[0].deciInjury ? Math.floor(atk.hp / 2) : atk.hp
                        defs[0].hp -= hurt
                        let antiInjury: boolean = defs[0].antiInjury
                        if (defs[0].hp <= 0 || atk.oneKill) {
                            let sp = defs[0].node.position
                            costHp = Math.abs(defs[0].hp)
                            if (costHp >= 0) {
                                defs[0].showDie(atk.hp - costHp)
                                if (costHp > 0 && !atk.oneKill) {
                                    await atk.showAckSkill(tp, GameLogicCrl.Share.gamePanel, sp)
                                    let event = new cc.Event.EventCustom(EventString.AttackEvent, true)
                                    event.setUserData([costHp, false, [1, 3]])
                                    this.node.dispatchEvent(event)
                                }
                                await this.removeBlocksMats(defs[0])
                                await this.handleSkillHurt(defs[0])
                            }
                            Utility.DelListItem(defs, defs[0])
                        } else {
                            defs[0].updateHp()
                            await defs[0].showHurt(hurt)
                        }
                        //反伤
                        if (antiInjury) {
                            heroblock.hp -= Math.floor(heroblock.hp / 2)
                            heroblock.updateHp()
                            await heroblock.showHurt(heroblock.hp)
                        }
                    }
                    break
                default:
                    break;
            }
            resolve()
        })
    }

    handleSkillAttack(heroblock: BlockCrl, defs?: BlockCrl[]) {
        return new Promise(async (resolve, reerr) => {
            for (let i = 0; i < heroblock.heroSkills.length; i++) {
                await this.handleSkillFromAttack(heroblock, heroblock.heroSkills[i], defs)
            }
            resolve()
        })
    }

    handleSkillHurt(heroblock: BlockCrl) {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < heroblock.heroSkills.length; i++) {
                await this.handleSkillFromHurt(heroblock, heroblock.heroSkills[i])
            }
            resolve()
        })
    }

    handleSkillFromHurt(heroblock: BlockCrl, skillid?: number) {
        return new Promise(async (resolve, reerr) => {
            let type = Number(heroblock.type + "" + skillid)
            switch (type) {
                case 33:
                    if (heroblock.hp <= 0) {
                        let d1 = new DBlock()
                        d1.t = 3
                        d1.p = heroblock.mxtPos
                        d1.hp = Math.floor(heroblock.maxHp / 2) < 1 ? 1 : Math.floor(heroblock.maxHp / 2) //10
                        d1.c = 0
                        d1.skillblock = [3]
                        let hero = await GameLogicCrl.Share.makupHero(d1, GameLogicCrl.Share.roundPlayer == 0 ? 1 : 0)
                        await new Promise((resolve, reerr) => {
                            cc.loader.loadRes("fx/HeroSkill/Reborn", (err, res) => {
                                this.playSkillSound(3, 3)
                                let eff: cc.Node = cc.instantiate(res)
                                hero.node.addChild(eff)
                                let dely = cc.delayTime(0.5)
                                let remove = cc.removeSelf()
                                let fun = cc.callFunc(() => {
                                    resolve()
                                })
                                eff.runAction(cc.sequence(dely, remove, fun))
                            })
                        })
                    }
                    break
                default:
                    break
            }

            resolve()
        })
    }

    heroSkillAttack(atked: BlockCrl[], allH: BlockCrl[], isEnemy: boolean = false) {
        return new Promise(async (resolve, err) => {
            if (StaticData.IsGiveUp) {
                resolve()
                return
            }
            if (allH.length > 0) {
                let atks: BlockCrl[] = []
                let defs: BlockCrl[] = []
                for (let i = 0; i < allH.length; i++) {
                    if (atked.indexOf(allH[i]) < 0) {
                        atks.push(allH[i])
                        atked.push(allH[i])
                        break
                    }
                }
                if (atks.length <= 0) {
                    resolve()
                    return
                }
                for (let i = 0; i < allH.length; i++) {
                    if (atks.indexOf(allH[i]) < 0) {
                        defs.push(allH[i])
                        break
                    }
                }

                let tp = GameLogicCrl.Share.basePoint[isEnemy ? 0 : 1]
                let costHp: number = 0
                if (allH.length >= 2) {
                    if (defs[0].mxtPos.y > atks[0].mxtPos.y) {
                        atks[0].flipImage()
                        atks[0].scheduleOnce(() => { atks[0].flipImage() }, 1)
                    }
                    await atks[0].showAckSkill(defs[0].node.position, GameLogicCrl.Share.gamePanel)
                    if (defs[0].shield > 0) {
                        defs[0].shield--
                        if (defs[0].node.getChildByName("bshield") != null) {
                            defs[0].node.getChildByName("bshield").removeFromParent()
                        }
                    } else {
                        //* */take care insert skill handle
                        // this.handleSkillAttack(atks[0])
                        //
                        //减伤
                        let hurt: number = defs[0].deciInjury ? Math.floor(atks[0].hp / 2) : atks[0].hp
                        defs[0].hp -= hurt
                        let antiInjury: boolean = defs[0].antiInjury
                        if (defs[0].hp <= 0 || atks[0].oneKill) {
                            this.isKillDef = true
                            let sp = defs[0].node.position
                            costHp = Math.abs(defs[0].hp)
                            if (costHp >= 0) {
                                defs[0].showDie(atks[0].hp - costHp)
                                if (costHp > 0 && !atks[0].oneKill) {
                                    await atks[0].showAckSkill(tp, GameLogicCrl.Share.gamePanel, sp)
                                    let event = new cc.Event.EventCustom(EventString.AttackEvent, true)
                                    event.setUserData([costHp, false])
                                    this.node.dispatchEvent(event)
                                }
                                await this.removeBlocksMats(defs[0])
                                await this.handleSkillHurt(defs[0])
                            }
                            Utility.DelListItem(allH, defs[0])
                        } else {
                            defs[0].updateHp()
                            await defs[0].showHurt(hurt)
                        }

                        //反伤
                        if (antiInjury) {
                            atks[0].hp -= Math.floor(atks[0].hp / 2)
                            atks[0].updateHp()
                            await atks[0].showHurt(atks[0].hp)
                        }
                    }
                } else {
                    atks[0].flipImage()
                    atks[0].scheduleOnce(() => { atks[0].flipImage() }, 1)
                    await atks[0].showAckSkill(tp, GameLogicCrl.Share.gamePanel)
                    costHp = Math.floor(atks[0].hp / 2)
                    let event = new cc.Event.EventCustom(EventString.AttackEvent, true)
                    event.setUserData([costHp, false])
                    this.node.dispatchEvent(event)
                }
                await this.handleSkillAttack(atks[0], defs)
                this.isKillDef = false
                //Utility.DelListItem(allH, atks[0])
                await this.heroSkillAttack(atked, allH, isEnemy)
            }
            resolve()
        })
    }

    heroAttack(atks: BlockCrl[], defs: BlockCrl[], isEnemy: boolean = false) {
        return new Promise(async (resolve, err) => {
            if (StaticData.IsGiveUp) {
                resolve()
                return
            }
            if (atks.length > 0) {
                for (let i = 0; i < atks.length; i++) {
                    if (atks[i].node.getChildByName('FrozenFX')) {
                        //atks[i].node.getChildByName('FrozenFX').removeFromParent()
                        Utility.DelListItem(atks, atks[i])
                        await this.heroAttack(atks, defs, isEnemy)
                        resolve()
                        return
                    }
                }

                let tp = GameLogicCrl.Share.basePoint[isEnemy ? 0 : 1]
                let costHp: number = 0
                if (defs.length > 0) {
                    await atks[0].showAckSkill(defs[0].node.position, GameLogicCrl.Share.gamePanel)
                    if (defs[0].shield > 0) {
                        defs[0].shield--
                        if (defs[0].node.getChildByName("bshield") != null) {
                            defs[0].node.getChildByName("bshield").removeFromParent()
                        }
                    } else {
                        //* */take care insert skill handle
                        // this.handleSkillAttack(atks[0])
                        //
                        //减伤
                        let hurt: number = defs[0].deciInjury ? Math.floor(atks[0].hp / 2) : atks[0].hp
                        defs[0].hp -= hurt
                        let antiInjury: boolean = defs[0].antiInjury
                        if (defs[0].hp <= 0 || atks[0].oneKill) {
                            this.isKillDef = true
                            let sp = defs[0].node.position
                            costHp = Math.abs(defs[0].hp)
                            if (costHp >= 0) {
                                defs[0].showDie(atks[0].hp - costHp)
                                if (costHp > 0 && !atks[0].oneKill) {
                                    await atks[0].showAckSkill(tp, GameLogicCrl.Share.gamePanel, sp)
                                    let event = new cc.Event.EventCustom(EventString.AttackEvent, true)
                                    event.setUserData([costHp, false])
                                    this.node.dispatchEvent(event)
                                }
                                await this.removeBlocksMats(defs[0])
                                await this.handleSkillHurt(defs[0])
                            }
                            Utility.DelListItem(defs, defs[0])
                        } else {
                            defs[0].updateHp()
                            await defs[0].showHurt(hurt)
                        }
                        //反伤
                        if (antiInjury) {
                            atks[0].hp -= Math.floor(atks[0].hp / 2)
                            atks[0].updateHp()
                            await atks[0].showHurt(atks[0].hp)
                        }
                    }
                } else {
                    await atks[0].showAckSkill(tp, GameLogicCrl.Share.gamePanel)
                    costHp = atks[0].hp
                    let event = new cc.Event.EventCustom(EventString.AttackEvent, true)
                    event.setUserData([costHp, false])
                    this.node.dispatchEvent(event)
                }
                await this.handleSkillAttack(atks[0], defs)
                this.isKillDef = false
                Utility.DelListItem(atks, atks[0])
                await this.heroAttack(atks, defs, isEnemy)
            }
            resolve()
        })
    }

    getFreeBlock() {
        let blocks = this.getMineBlocks().filter(b => {
            if (b.hid == -1) {
                return true
            }
        })
        return blocks
    }

    getMineBlocks() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            let round = GameLogicCrl.Share.roundPlayer
            if ((round == 0 ? b.mxtPos.y < 5 : b.mxtPos.y > 4)) {
                return true
            }
        })
    }

    getMineHeros() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            let round = GameLogicCrl.Share.roundPlayer
            if ((round == 0 ? b.mxtPos.y < 5 : b.mxtPos.y > 4) && b.hid != -1) {
                return true
            }
        })
    }

    handleMineHeros(fun: (hero: BlockCrl) => void) {
        GameLogicCrl.Share.blockMats.forEach(b => {
            let round = GameLogicCrl.Share.roundPlayer
            if ((round == 0 ? b.mxtPos.y < 5 : b.mxtPos.y > 4) && b.hid != -1) {
                fun(b)
            }
        })
    }

    handleAllHeros(fun: (hero: BlockCrl) => void) {
        GameLogicCrl.Share.blockMats.forEach(b => {
            if (b.hid != -1) {
                fun(b)
            }
        })
    }

    getAllHeros() {
        return GameLogicCrl.Share.blockMats.filter(h => h.hid != -1)
    }

    getEnemyHeros() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            let round = GameLogicCrl.Share.roundPlayer
            if ((round == 0 ? b.mxtPos.y > 4 : b.mxtPos.y < 5) && b.hid != -1) {
                return true
            }
        })
    }

    playSkillSound(type: number, sb: number) {
        let ss = GameData.Share.getHeroDataByTypeSB(type, sb).ss
        SoundMgr.Share.PlaySound(ss)
    }

    removeIceSkill() {
        this.getMyHero().forEach((h) => {
            if (h.node.getChildByName('FrozenFX')) {
                h.node.getChildByName('FrozenFX').removeFromParent()
            }
        })
    }

}
