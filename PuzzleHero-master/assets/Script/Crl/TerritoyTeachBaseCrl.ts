import TerritoryCrl from "./TerritoryCrl";
import Logger from "../LoggerCrl";
import TeachBaseCrl from "../UI/TeachBaseCrl";
import UIMgr from "../Lib/UI/UIMgr";
import GameLogicCrl from "./GameLogicCrl";
import { DBlock } from "./TerritoryAssiCrl";
import BlockCrl from "./BlockCrl";
import GameSceneCrl from "./GameSceneCrl";
import GameData from "../GameData";
import StaticData from "../StaticData";

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
export default class TerritoyTeachBaseCrl extends TerritoryCrl {

    globalStep: number = 0

    teachConfig: any[] = []

    diagStep: number = 0

    teachStep: number = 0

    teachUI: TeachBaseCrl

    public static Share: TerritoyTeachBaseCrl = null

    optStep: number = 0

    skillStep: number = 0

    genBlockConfig: any[] = []

    gensBlockConfig: any[] = []

    firstGenBlockConfig: any[] = []



    start() {
        TerritoyTeachBaseCrl.Share = this
        cc.log("this is tur")
        Logger.record(2)
        //GameLogicCrl.Share.firstRound = false
    }




    startTeach() {
        return new Promise(async (resolve, reject) => {
            let pInfo: any = StaticData.PlayerInfo
            this.globalStep = pInfo.guideStep
            this.teachStep = 0
            this.optStep = 0
            this.skillStep = 0
            //this.teachUI = (await UIMgr.Share.showUI("Teach" + (this.globalStep + 1) + "UI")) as TeachBaseCrl
            this.teachUI = (await UIMgr.Share.showUI("TeachNewUI")) as TeachBaseCrl
            this.teachUI.node.active = false
            this.teachConfig = JSON.parse(JSON.stringify(GameData.Share.TeachConfig2))
            this.firstGenBlockConfig = GameData.Share.TeachConfig2[this.globalStep]["gameMatrix"]
            resolve()
        })

        // cc.log(this.firstGenBlockConfig)

        // this.firstGenBlockConfig = JSON
        //test start 9
        // this.teachUI.showPage(9)
    }


    genAllBlocks() {
        return new Promise(async (resolve, reject) => {
            this.refrash()
            let minemx = this.firstGenBlockConfig[0]["player"]
            let enmmx = this.firstGenBlockConfig[1]["enemy"]
            cc.log(this.firstGenBlockConfig[0])
            let blocks1 = await GameLogicCrl.Share.genStartBlocks(minemx)
            let blocks2 = await GameLogicCrl.Share.genStartBlocks(enmmx)
            GameLogicCrl.Share.blockMats = blocks1.concat(blocks2)
            for (let i = 0; i < blocks2.length; i++) {
                blocks2[i].node.y += 450
                blocks2[i].mxtPos.y += 5
                blocks2[i].updateMpPos()
            }
            resolve()
        })
    }

    refrash() {
        GameLogicCrl.Share.gamePanel.removeAllChildren()
        GameLogicCrl.Share.blockMats.length = 0
    }


    async handleCheckTouchEnd(isEnemy: boolean = false) {
        let check = this.doStep()
        if (!check) {
            return
        }
        this.teachUI.hidePage()
        let destroyblocks: DBlock = await this.handleDestroyBlocks()
        this.releaseSelect()
        if (destroyblocks.c > 0) {
            if (GameLogicCrl.Share.roundPlayer == 0) {
                GameLogicCrl.Share.blockT4Count[destroyblocks.t - 1] += destroyblocks.c
            }
            GameLogicCrl.Share.playerOpt.canOpt = false

            //block skill
            await this.handleSkillFirst(destroyblocks)

            //makeup hero
            let blockhero: BlockCrl = await GameLogicCrl.Share.makupHero(destroyblocks)

            await this.handleSkillSecond(blockhero, destroyblocks)
            //fix falldown
            await this.handleBlocksFall()
            //fix empty block

            await GameSceneCrl.Share.gameLogicCrl.handleGenEmptyBlock(isEnemy, this.getCurGenBlock())

            await this.handleGenSkillBlock(this.getCurSkillBlock(destroyblocks))

            //hero attak
            await this.handleHeroAttack(isEnemy)
            //fix falldown
            await this.handleBlocksFall()
            //fix empty block
            await GameLogicCrl.Share.handleGenEmptyBlock(isEnemy, this.getCurGenBlock())
            //do next round

            await this.handleRoundEnd()

            // this.handlePageTo()
        }

    }

    handleRoundEnd() {
        return new Promise(async (resolve, reject) => {
            if (StaticData.GameOver) {
                await this.teachUI.showPage()
                resolve()
                StaticData.GameOver = false
                return
            }
            this.recordTeach()
            GameLogicCrl.Share.gameSceneUI.updateRoundCount(++GameLogicCrl.Share.roundCount, GameLogicCrl.Share.roundPlayer)
            switch (GameLogicCrl.Share.roundPlayer) {
                case 0:
                    GameLogicCrl.Share.roundPlayer = 1
                    await this.handleDiePath()
                    Math.random() > 0.7 ? await this.genAtypeBlock() : ""
                    GameLogicCrl.Share.playerOpt.canOpt = false
                    await this.teachUI.showPage()
                    GameLogicCrl.Share.aiEnemyCrl.doMyRound()
                    break;
                case 1:
                    GameLogicCrl.Share.roundPlayer = 0
                    await this.handleDiePath()
                    Math.random() > 0.7 ? await this.genAtypeBlock() : ""
                    GameLogicCrl.Share.playerOpt.canOpt = true
                    await this.teachUI.showPage()
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

    recordTeach() {
        let c: number = GameLogicCrl.Share.roundCount
        if (c > 6) return

        switch (c) {
            case 0:
                Logger.recordTS(25)
                break
            case 1:
                Logger.recordTS(26)
                break
            case 2:
                Logger.recordTS(27)
                break
            case 3:
                Logger.recordTS(28)
                break
            case 4:
                Logger.recordTS(29)
                break
            case 5:
                Logger.recordTS(30)
                break
            case 6:
                Logger.recordTS(31)
                break
        }
    }


    async genAtypeBlock() {
        //overwrite
    }

    doStep() {
        let check = true
        if (!StaticData.Teaching) return true
        let correc: cc.Vec2[] = this.getCurOptLink()

        cc.log(correc, "opt step:", this.optStep)
        if (this.preLinkList.length != correc.length) {
            check = false
        }
        if (check) {
            for (let i = 0; i < this.preLinkList.length; i++) {
                if (!correc[i].equals(this.preLinkList[i].mxtPos)) {
                    check = false
                }
            }
        }

        if (!check) {
            this.releaseSelect()
        } else {
            this.teachConfig[this.globalStep]["link"].splice(0, 1)
        }
        if (this.teachUI.isTeachEnd()) {
            check = true
        }

        return check
    }

    // async doInitPart2() {
    //     GameLogicCrl.Share.gamePanel.removeAllChildren()
    //     GameLogicCrl.Share.blockMats.length = 0
    //     this.teachStep = 9
    //     this.teachUI.showPage(this.teachStep)
    //     GameLogicCrl.Share.playerData[0].hp = 30
    //     GameLogicCrl.Share.playerData[1].hp = 30
    //     GameLogicCrl.Share.gameSceneUI.updateHp(GameLogicCrl.Share.playerData)
    //     GameLogicCrl.Share.playerData[0].heros[0].atk = 2
    //     await this.genAllBlocks()
    //     await this.handleRoundEnd()
    // }


    getCurOptLink() {
        let repos: cc.Vec2[] = []
        let data = this.teachConfig[this.globalStep]["link"][0]
        cc.log("will be go", data)
        for (let i = 0; i < data.length; i++) {
            repos.push(cc.v2(data[i].x, data[i].y))
        }
        return repos
    }


    getCurGenBlock() {
        let re = this.teachConfig[this.globalStep]["genBlock"][0]
        this.teachConfig[this.globalStep]["genBlock"].splice(0, 1)
        return re
    }

    getCurSkillBlock(destroyblocks) {
        let re = this.teachConfig[this.globalStep]['gensBlock'][0]
        if (re == undefined) {
            return destroyblocks
        }
        this.teachConfig[this.globalStep]['gensBlock'].splice(0, 1)

        if (re.length > 0) {
            destroyblocks.setupPos = cc.v2(re[0].x, re[0].y)
            destroyblocks.t = re[0].t
        } else {
            destroyblocks.c = 1
        }

        return destroyblocks
    }


    // update (dt) {}
}
