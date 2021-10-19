import BlockCrl from "./BlockCrl";
import StaticData from "../StaticData";
import TerritoryAssiCrl, { DBlock } from "./TerritoryAssiCrl";
import Utility from "../Lib/Utility";
import GameSceneCrl from "./GameSceneCrl";
import GameLogicCrl from "./GameLogicCrl";
import EventString from "../EventString";
import GameData from "../GameData";
import TerritorySkillCrl from "./TerritorySkillCrl";
import SoundMgr from "../Lib/SoundMgr";
import PlayerData from "../Mod/PlayerData";
import Logger from "../LoggerCrl";
import NetProecssCrl from "./Net/NetProcessCrl";
import UIMgr from "../Lib/UI/UIMgr";
import ResultUICrl from "../UI/ResultUICrl";
import ResultAUI from "../UI/ResultAUI";

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
export default class TerritoryCrl extends TerritorySkillCrl {
    timeout: number = 20

    isTimeout: boolean = false


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // this.genFirstBlocks()
        Logger.record(4)
    }

    genAllBlocks() {
        return new Promise(async (resolve, reerr) => {

            //let blocks = await GameLogicCrl.Share.genStartBlocks(StaticData.testMats)
            let blocks = await GameLogicCrl.Share.genStartBlocks()
            let anblocks = await GameLogicCrl.Share.genStartBlocks()

            GameLogicCrl.Share.blockMats = blocks.concat(anblocks)
            for (let i = 0; i < anblocks.length; i++) {
                anblocks[i].node.y += 450
                anblocks[i].mxtPos.y += 5
                anblocks[i].updateMpPos()
            }

            resolve()
        })
    }




    async handleGameCoreProcess(isEnemy: boolean = false) {
        return new Promise(async (exitprocess, reject) => {
            this.exitProcess = exitprocess

            if (this.timeout <= 1) {
                exitprocess()
                return
            }

            let destroyblocks: DBlock = await this.handleDestroyBlocks()

            this.releaseSelect()
            if (destroyblocks.c > 0) {
                if (GameLogicCrl.Share.roundPlayer == 0) {
                    GameLogicCrl.Share.blockT4Count[destroyblocks.t - 1] += destroyblocks.c
                }
                GameLogicCrl.Share.playerOpt.canOpt = false

                GameLogicCrl.Share.gameSceneUI.timeoutBell.active = false
                this.unschedule(this.handleCDTimeout)

                //block skill
                //await this.handleSkillFirst(destroyblocks)

                //makeup hero
                let blockhero: BlockCrl = await GameLogicCrl.Share.makupHero(destroyblocks)

                //fix falldown
                //await this.handleBlocksFall(isEnemy)

                await this.handleBlocksFall()

                await this.handleSkillFirst(destroyblocks, blockhero)
                await this.handleBlocksFall()
                await this.handleSkillSecond(blockhero, destroyblocks)
                //fix empty block
                await GameLogicCrl.Share.handleGenEmptyBlock(isEnemy)

                //genskillBlock
                await this.handleGenSkillBlock(destroyblocks)
                //hero attak
                await this.handleHeroAttack(isEnemy)

                //before end skill
                await this.handleSkillBeforeRoundEnd()

                //fix falldown
                await this.handleBlocksFall()
                //fix empty block
                await GameLogicCrl.Share.handleGenEmptyBlock(isEnemy)


                this.removeIceSkill()
                //do next round
                await this.handleRoundEnd()

                await this.handleSkillRoundEnd()
                cc.log("sync seed:", GameLogicCrl.Share.randomSeed)
                exitprocess()
            }
        })
    }

    handleCheckTouchEnd(isEnemy: boolean = false) {
        if (this.isTimeout) {
            this.releaseSelect()
            return
        }

        this.handleGameCoreProcess(isEnemy)
    }

    handleGenSkillBlock(dblock: DBlock) {
        return new Promise((resolve, er) => {
            if (dblock.c < 3) {
                resolve()
                return
            }
            let type = dblock.t
            let isenemy = GameLogicCrl.Share.roundPlayer == 0 ? false : true
            let idx = 0
            let blocks = GameLogicCrl.Share.blockMats.filter(b => {
                return b.type == type && (isenemy ? b.mxtPos.y > 4 : b.mxtPos.y < 5) && b.hid < 0 && b.blockSkill < 0
            })
            if (dblock.setupPos != null) {
                blocks = GameLogicCrl.Share.blockMats.filter(b => b.mxtPos.equals(dblock.setupPos) && dblock.t == b.type)
            }
            if (blocks.length < 1) {
                blocks = GameLogicCrl.Share.blockMats.filter(b => {
                    return (isenemy ? b.mxtPos.y > 4 : b.mxtPos.y < 5) && b.hid < 0 && b.blockSkill < 0
                })
                idx = GameLogicCrl.Share.syncRandom(0, blocks.length - 1)
                this.genOneSkillBlock(type, dblock.sb, blocks[idx], resolve)
            } else {
                blocks[idx].showSkillBlock(dblock.sb)
                resolve()
            }
        })
    }


    handleHeroAttack(isEnemy: boolean) {
        return new Promise(async (resolve, err) => {
            if (StaticData.IsGiveUp) {
                resolve()
                return
            }
            if (GameLogicCrl.Share.firstRound) {
                GameLogicCrl.Share.firstRound = false
                resolve()
                return
            }
            let blocks = GameLogicCrl.Share.blockMats
            let atks: BlockCrl[] = []
            let defs: BlockCrl[] = []
            blocks.forEach(b => {
                if (b.hid > -1) {
                    if (b.mxtPos.y < 5) {
                        atks.push(b)
                    } else {
                        defs.push(b)
                    }
                }
            })
            //Enemy Swap
            if (isEnemy) {
                let _atks = atks
                atks = defs
                defs = _atks
            }
            atks = atks.sort((a, b) => b.hp - a.hp)
            defs = defs.sort((a, b) => b.hp - a.hp)
            await this.heroAttack(atks, defs, isEnemy)
            resolve()
        })
    }



    handleDestroyBlocks(): Promise<DBlock> {
        return new Promise(async (resolve, err) => {
            let re = new DBlock()
            let quene: any[] = []

            if (this.preLinkList.length > 2) {
                for (let i = 0; i < this.preLinkList.length; i++) {
                    let block = this.preLinkList[i]
                    if (i == this.preLinkList.length - 1) {
                        re.p = block.mxtPos.clone()
                        re.t = block.type
                    }
                    re.dbpos.push(block.mxtPos.clone())

                    if (block.hp > 0) {
                        re.hp += block.hp
                    }
                    re.c++

                    if (block.blockSkill > -1 && !block.node.getChildByName('prohibitFX')) {
                        //排除重复技能
                        if ((block.type == 2 && block.blockSkill == 5) || (block.type == 3 && block.blockSkill == 5)) {
                            if (re.skillblock.indexOf(block.blockSkill) < 0) {
                                re.skillblock.push(block.blockSkill)
                                re.sbpos.push(block.mxtPos)
                            }
                        } else {
                            re.skillblock.push(block.blockSkill)
                            re.sbpos.push(block.mxtPos)
                        }
                    }
                    /* 如果连接消除有技能的英雄   则加上此英雄中的技能 */
                    else if (block.heroSkills.length > 0) {
                        for (let j = 0; j < block.heroSkills.length; j++) {
                            if (block.type == 3 && block.heroSkills[j] == 1 && block.shield <= 0 && block.hid == 7) {
                                //排除护盾技能
                                continue
                            }
                            let hd: any = GameData.Share.getHeroDataById(block.hid)
                            if (hd.st == 0) {
                                //排除瞬发型
                                continue
                            }

                            if (re.skillblock.indexOf(block.heroSkills[j]) < 0)
                                re.skillblock.push(block.heroSkills[j])
                        }
                    }
                    /*end */
                    quene.push(this.removeBlocksMats(block))
                }
                this.preLinkList.length = 0
            } else {
                resolve(re)
                return
            }
            if (re.t > 4) {
                re.t = GameLogicCrl.Share.syncRandom(1, 4)
            }
            let hdata = GameLogicCrl.Share.playerData[GameLogicCrl.Share.roundPlayer].heros[re.t - 1]
            re.hid = hdata.id
            re.sb = hdata.sb
            Promise.all(quene).then(() => {
                SoundMgr.Share.PlaySound("match")
                this.getMySkillBlocks().forEach((b) => {
                    if (b.node.getChildByName('prohibitFX')) {
                        b.node.getChildByName('prohibitFX').removeFromParent()
                    }
                })
                resolve(re)
            }
            )
        })
    }
    handleBlocksFall() {

        return new Promise((resolve, reject) => {
            let diry: number = GameLogicCrl.Share.roundPlayer == 0 ? -1 : 1
            let actlist: any[] = []
            GameLogicCrl.Share.blockMats.forEach(b => {
                let fv = 0
                let fallcount = 0
                while (true) {
                    fv += diry
                    let nexty = b.mxtPos.y + fv
                    if (nexty < 0 || nexty > 9) {
                        break
                    }
                    if (this.getBlockByMpos(cc.v2(b.mxtPos.x, nexty)) == null) {
                        fallcount += diry
                    }
                }
                if (fallcount != 0) {
                    actlist.push({ "fset": fallcount, "b": b })
                }
            })
            actlist.forEach(obj => {
                let b = obj.b
                b.mxtPos.y += obj.fset
                let tpos = GameLogicCrl.Share.tranMxpToPos(b.mxtPos)
                b.updateImage()
                let act1 = cc.moveTo(0.5, tpos).easing(cc.easeBackOut())
                b.node.runAction(act1)
            })
            let t = actlist.length > 0 ? 0.5 : 0
            this.scheduleOnce(() => {
                resolve()
            }, t)
        })


    }

    handleCDTimeout() {
        if (!StaticData.startFromArena)
            return

        this.timeout--
        if (this.timeout <= 0) {
            GameLogicCrl.Share.gameSceneUI.timeoutBell.active = false
            this.releaseSelect()
            this.hideAtkCount()
            this.isTimeout = true
            this.handleRoundEnd()
            cc.log("is timeout:", this.timeout)

        } else if (this.timeout > 0) {
            GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponentInChildren(cc.Label).string = this.timeout.toFixed()
        }
    }


    handleRoundEnd() {
        return new Promise(async (resolve, reerr) => {

            this.unschedule(this.handleCDTimeout)

            if (StaticData.IsGiveUp) {
                StaticData.IsGiveUp = false
                resolve()
                return
            }
            if (StaticData.GameOver) {
                if (this.exitProcess) {
                    this.exitProcess()
                }
                cc.log("game over")
                if (!StaticData.startFromArena) {
                    let rs = (await UIMgr.Share.showUI("ResultUI")) as ResultUICrl
                    rs.showResult(GameLogicCrl.Share.isWin, GameLogicCrl.Share.playerData)
                } else {
                    let rs = (await UIMgr.Share.showUI("ResultAUI")) as ResultAUI
                    rs.showResult(GameLogicCrl.Share.isWin, GameLogicCrl.Share.playerData)
                }
                resolve()
                return
            }

            GameLogicCrl.Share.gameSceneUI.updateRoundCount(++GameLogicCrl.Share.roundCount, GameLogicCrl.Share.roundPlayer)
            switch (GameLogicCrl.Share.roundPlayer) {
                case 0:
                    GameLogicCrl.Share.roundPlayer = 1
                    await this.handleDiePath()
                    Math.random() > 0.7 ? await this.genAtypeBlock() : ""
                    GameLogicCrl.Share.playerOpt.canOpt = false
                    GameLogicCrl.Share.aiEnemyCrl.doMyRound()

                    if (StaticData.startFromArena) {
                        GameLogicCrl.Share.gameSceneUI.timeoutBell.active = true
                        this.timeout = 20
                        this.isTimeout = false
                        GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponent(cc.Animation).play()
                        this.schedule(this.handleCDTimeout, 1, 20);
                    }
                    break;
                case 1:
                    GameLogicCrl.Share.roundPlayer = 0
                    await this.handleDiePath()
                    Math.random() > 0.7 ? await this.genAtypeBlock() : ""
                    GameLogicCrl.Share.playerOpt.canOpt = true
                    if (StaticData.startFromArena) {
                        GameLogicCrl.Share.gameSceneUI.timeoutBell.active = true
                        this.timeout = 20
                        this.isTimeout = false
                        GameLogicCrl.Share.gameSceneUI.timeoutBell.getComponent(cc.Animation).play()
                        this.schedule(this.handleCDTimeout, 1, 20);
                    }

                default:
                    break;

            }
            let sidx = 0
            GameLogicCrl.Share.playerData.forEach(p => {
                if (p.shield > 0) {
                    p.shield--
                }
                if (p.shield < 1) {
                    GameLogicCrl.Share.gameSceneUI.showGetSkill(3, sidx)
                }
                sidx++
            })
            resolve()
        })

    }

}
