import PlayerOpt from "./PlayerOptCrl";
import TerritoryCrl from "./TerritoryCrl";
import AIEnemyCrl from "./AIEnemyCrl";
import BlockCrl from "./BlockCrl";
import PlayerData from "../Mod/PlayerData";
import GameSceneUI from "../UI/GameSceneUI";
import GameLogicCrl from "./GameLogicCrl";
import { DBlock, GBlock } from "./TerritoryAssiCrl";
import StaticData from "../StaticData";
import Utility from "../Lib/Utility";
import GameData from "../GameData";
import HeroData from "../Mod/HeroData";
import PlayerDataCrl from "../Mod/PlayerDataCrl";

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
export default class GamelogicBase extends cc.Component {

    randomSeed: number = 0

    playerOpt: PlayerOpt = null

    gamePanel: cc.Node = null

    territoryCrl: TerritoryCrl = null

    aiEnemyCrl: AIEnemyCrl = null

    blockMats: BlockCrl[] = []


    //0==player 1==enemy
    roundPlayer: number = 1

    firstRound: boolean = true

    playerData: PlayerData[] = []

    gameSceneUI: GameSceneUI = null

    roundCount: number = 0

    basePoint: cc.Vec2[] = []

    isWin: boolean = false

    blockT4Count: number[] = [0, 0, 0, 0]

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    readyToStart() {
        return new Promise(async (resolve, reerr) => {
            this.blockT4Count = [0, 0, 0, 0]
            this.node.parent.getChildByName("BG").children.forEach(n => n.active = false)
            this.node.parent.getChildByName("BG").children[(StaticData.StageLevel - 1) < 0 ? 0 : (StaticData.StageLevel - 1)].active = true
            this.gameSceneUI.updateHp(this.playerData)
            this.gameSceneUI.updateUserInfo(this.playerData)
            this.playerOpt.playerTerritoryCrl = this.territoryCrl
            await this.territoryCrl.genAllBlocks()
            //await this.handleTestFunction()
            await this.territoryCrl.handleRoundEnd()
            resolve()
        })
    }


    hanletestFunctionMakeHero(p: cc.Vec2, type: number, heroskill: number[], hp: number = 1, count: number = 2) {
        return new Promise(async (resolve, reerr) => {
            let block = this.getBlockByMpos(p)
            await GameLogicCrl.Share.territoryCrl.removeBlocksMats(block, 0.5)
            let d1 = new DBlock()
            d1.t = type
            d1.p = block.mxtPos
            d1.hp = hp
            d1.c = count
            d1.skillblock = heroskill
            await GameLogicCrl.Share.makupHero(d1)
            resolve()
        })
    }

    handleTestFunction() {
        return new Promise(async (resolve, err) => {

            // await this.hanletestFunctionMakeHero(cc.v2(4, 5), 1, [0])
            // await this.hanletestFunctionMakeHero(cc.v2(2, 6), 1, [0])
            // await this.hanletestFunctionMakeHero(cc.v2(3, 7), 1, [0])
            // await this.hanletestFunctionMakeHero(cc.v2(1, 8), 1, [0])
            // await this.hanletestFunctionMakeHero(cc.v2(0, 8), 1, [0])

            // block = this.getBlockByMpos(cc.v2(2, 9))
            // d1.p = block.mxtPos = block.mxtPos
            // await GameLogicCrl.Share.territoryCrl.removeBlocksMats(block, 0.5)
            // await GameLogicCrl.Share.makupHero(d1)
            // await GameLogicCrl.Share.territoryCrl.genOneSkillBlock(1, 1, this.getBlockByMpos(cc.v2(0, 0)), () => {
            //     resolve()
            // })
            let block = this.getBlockByMpos(cc.v2(0, 0))
            // await GameLogicCrl.Share.territoryCrl.removeBlocksMats(block, 0.5)
            // let newblock = await GameLogicCrl.Share.genBlock(5, cc.v2(0, 0), true)
            // GameLogicCrl.Share.blockMats.push(newblock

            await GameLogicCrl.Share.territoryCrl.genOneSkillBlock(1, 2, block, () => {

            })
            // await GameLogicCrl.Share.territoryCrl.genOneSkillBlock(3, 0, this.getBlockByMpos(cc.v2(2, 0)), () => {

            // })
            await this.territoryCrl.genAtypeBlock()
            //await this.territoryCrl.genAtypeBlock()
            resolve()
        })
    }

    getBlockByMpos(p: cc.Vec2) {
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            if (GameLogicCrl.Share.blockMats[i].mxtPos.equals(p)) {
                return GameLogicCrl.Share.blockMats[i]
            }
        }
        return null
    }

    loadBlockToScene(type: string, node: cc.Node): Promise<cc.Node> {
        return new Promise((resolve, reerr) => {
            cc.loader.loadRes("block/" + type, (err, res) => {
                if (!err) {
                    let obj = cc.instantiate(res)
                    node.addChild(obj)
                    resolve(obj)
                } else {
                    cc.log(err)
                }
            })
        })
    }

    async  genBlock(btype, p, active = true) {
        let block: BlockCrl = (await this.loadBlockToScene("b" + btype, this.gamePanel)).addComponent(BlockCrl)
        block.mxtPos = p
        if (btype == 5) {
            block.atype = true
        }
        block.type = btype
        block.node.active = active
        block.updateMpPos()
        block.node.position = this.tranMxpToPos(block.mxtPos)
        return block
    }



    tranMxpToPos(mxtpos: cc.Vec2): cc.Vec2 {
        let tpos = mxtpos.mul(60 + StaticData.BlockSpacing).add(cc.v2(30, 30))
        if (mxtpos.y > 4) {
            tpos.y += 25
        }
        return tpos
    }



    handleGenEmptyBlock(ieenemy: Boolean, gblock?: GBlock[]) {
        return new Promise(async (resolve, err) => {
            let xx = 0
            let yy = 0
            let elist: cc.Vec2[] = []
            for (let i = 0; i < StaticData.MatsSize * 2; i++) {
                if (i != 0 && i % 5 == 0) {
                    yy++
                    xx = 0
                }
                let p = cc.v2(xx, yy)
                if (this.getBlockByMpos(p) == null) {
                    elist.push(p)
                }
                xx++
            }


            if (ieenemy) {
                elist = elist.sort((e1, e2) => e2.y - e1.y)
            }
            let quene: any[] = []
            for (let i = 0; i < elist.length; i++) {
                let type = this.syncRandom(1, 4)
                //if (ieenemy && CC_PREVIEW) type = 4 //测试用
                if (gblock != null) {
                    let gt = gblock.filter((g => g.x == elist[i].x && g.y == elist[i].y))
                    if (gt.length > 0) {
                        type = gt[0].t
                    }

                }
                quene.push(this.genBlock(type, elist[i], false))
            }
            let _groupline: number[] = []
            let _gblocks: BlockCrl[] = []
            let srcy = -1
            await new Promise((genresolve, reject) => {
                Promise.all(quene).then((er: BlockCrl[]) => {
                    er.forEach(b => {
                        if (_groupline.indexOf((b.mxtPos.y)) < 0) {
                            _groupline.push(b.mxtPos.y)
                        }
                    })
                    _gblocks = er
                    // newer.forEach(b => {
                    //     cell.push(b)
                    //     if (b.mxtPos.y != srcy || newer.indexOf(b) == newer.length - 1) {
                    //         _gblocks.push([].concat(cell))
                    //         cell.length = 0
                    //         srcy = b.mxtPos.y
                    //     }
                    // })
                    genresolve()
                })
            })
            GameLogicCrl.Share.blockMats = GameLogicCrl.Share.blockMats.concat(_gblocks)
            let blockquene: any[] = []
            let dtt = 0.1
            let mt = 0.4
            _groupline.forEach(l => {
                let bs = _gblocks.filter((b) => b.mxtPos.y == l)

                bs.forEach(b => {
                    b.node.active = true
                    let moveq = new Promise((movedone, reject) => {

                        let tp = b.node.y
                        b.node.y = !ieenemy ? 1200 : -500

                        let act1 = cc.moveTo(mt, cc.v2(b.node.x, tp)).easing(cc.easeBackOut())
                        let dely = cc.delayTime(dtt)
                        let done = cc.callFunc(() => {
                            movedone()
                        })
                        b.node.runAction(cc.sequence(dely, act1, done))
                    })
                    blockquene.push(moveq)
                })
                dtt += 0.1
            })
            Promise.all(blockquene).then(() => {
                resolve()
            })



            // for (let i = 0; i < er.length; i++) {
            //     er[i].node.active = true
            //     let sy = er[i].node.y
            //     if (!ieenemy) {
            //         er[i].node.y = 1200
            //     } else {
            //         er[i].node.y = -500
            //     }
            //     let act1 = cc.moveTo(0.5, cc.v2(er[i].node.x, sy)).easing(cc.easeBackOut())
            //     er[i].node.runAction(act1)
            // }


        })
    }

    syncRandom(min: number, max: number) {
        let i = Utility.range(min, max, this.randomSeed)
        this.randomSeed += 3
        return i
    }

    makupHero(dblocks: DBlock, round?: number): Promise<BlockCrl> {
        if (this.roundPlayer == 0) {
            //统计任务2
            PlayerDataCrl.updateTask(2);
        }

        let hero: HeroData = null
        if (round != null) {
            hero = this.playerData[round].heros[dblocks.t - 1]
        } else {
            hero = this.playerData[this.roundPlayer].heros[dblocks.t - 1]
        }
        return new Promise((resolve, err) => {
            let hid = hero.id
            cc.loader.loadRes("character/H" + hid, async (err, res) => {
                if (!err) {
                    let hdata = GameData.Share.getHeroDataById(hero.id)
                    let obj: cc.Node = cc.instantiate(res)
                    let block = obj.addComponent(BlockCrl)
                    block.mxtPos = dblocks.p
                    block.type = dblocks.t
                    if (dblocks.skillblock.length > 0) {
                        block.blockSkill = dblocks.skillblock[0]
                    }
                    block.blockSkill = -1
                    block.hp = dblocks.c * hero.atk
                    block.hp += dblocks.hp
                    block.maxHp = block.hp
                    block.hid = hero.id
                    //block.heroSkills = [].concat(dblocks.skillblock.filter(n => n > 0))
                    let sArr: number[] = []
                    dblocks.skillblock.forEach(n => {
                        if (n > 0 && sArr.indexOf(n) < 0) {
                            sArr.push(n)
                        }else if(block.type == 1 && n == 6){
                            sArr.push(n)
                        }
                    });
                    block.heroSkills = sArr
                    cc.log("makeup heroskill: ", block.heroSkills)
                    block.sounds = [hdata.gs, hdata.ss, hdata.hs, hdata.ds]
                    block.node.position = this.tranMxpToPos(block.mxtPos)
                    block.updateImage()
                    block.updateHp()
                    this.addPersistentSkillFx(block.type, block.heroSkills, block.node)
                    this.blockMats.push(block)
                    this.gamePanel.addChild(block.node)
                    resolve(block)
                }
            })
        })
    }
    //添加常驻技能特效
    async addPersistentSkillFx(type: number, skill: number[], node: cc.Node) {
        for (let i = 0; i < skill.length; i++) {
            let dir: string = ''
            if (type == 1) {
                if (skill[i] == 2) {
                    dir = 'fx/HeroSkill/BloodThirstyFX'
                }
                else if (skill[i] == 3) {
                    dir = 'fx/HeroSkill/FireFX'
                }
            }
            else if (type == 2) {
                if (skill[i] == 2) {
                    dir = 'fx/HeroSkill/SustainedHealFX'
                }
            }
            else if (type == 3) {
                if (skill[i] == 3) {
                    dir = 'fx/HeroSkill/TheangelFX'
                }
                else if (skill[i] == 4) {
                    dir = 'fx/HeroSkill/intercomFX'
                }
            }
            else if (type == 4) {
                if (skill[i] == 2) {
                    dir = 'fx/HeroSkill/PowerFX'
                }
            }

            if (dir == '') continue
            await this.createSkillFx(dir, node)
        }
    }
    createSkillFx(dir: string, node: cc.Node) {
        return new Promise((resolve, err) => {
            cc.loader.loadRes(dir, (err, res) => {
                let aura: cc.Node = cc.instantiate(res)
                aura.position = cc.Vec2.ZERO
                node.addChild(aura)
                resolve()
            })
        })
    }

    getRandomBaseBlock() {
        StaticData.BaseTypes[24] = this.syncRandom(1, 4)
        let list = []
        for (let i = 0; i < 24 + 1; i++) {
            list.push(i)
        }
        let rlen = list.length - 1
        for (let i = rlen; i > -1; i--) {
            //let ridx = Math.round(Math.random() * rlen)
            let ridx = this.syncRandom(0, rlen)
            let _v1 = list[i]
            list[i] = list[ridx]
            list[ridx] = _v1
        }
        let rl = []
        for (let i = 0; i < list.length; i++) {
            rl.push(StaticData.BaseTypes[list[i]])
        }
        return rl
    }

    genStartBlocks(mx?: number[]): Promise<BlockCrl[]> {
        return new Promise((resolve, erre) => {
            let quene: any[] = []
            let lt = this.getRandomBaseBlock()
            if (mx) {
                lt = mx
            }
            let line = 0
            let x = 0

            for (let i = 0; i < StaticData.MatsSize; i++) {
                if (i % StaticData.MaxRow == 0 && i != 0) {
                    line++
                    x = 0
                }
                let btype = lt[i]
                let p = cc.v2(x, line)
                quene.push(this.genBlock(btype, p))
                x++
            }
            Promise.all(quene).then((objs) => {
                resolve(objs)
            })
        })
    }




    // update (dt) {}
}
