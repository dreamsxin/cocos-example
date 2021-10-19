import TerritoryCrl from "./TerritoryCrl";
import BlockCrl from "./BlockCrl";
import GameLogicCrl from "./GameLogicCrl";
import StaticData from "../StaticData";
import GameData from "../GameData";
import HeroData from "../Mod/HeroData";
import Utility from "../Lib/Utility";
import TerritoyTeachBaseCrl from "./TerritoyTeachBaseCrl";



const { ccclass, property } = cc._decorator;



@ccclass
export default class AIEnemyCrl extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    myBlocks: BlockCrl[] = []

    allLink: Array<Array<BlockCrl>> = new Array<Array<BlockCrl>>()

    curChain: BlockCrl[] = []

    hasCheckBlock: BlockCrl[] = []

    bestLink: any[] = []

    curLoop: number = 0


    onLoad() {
        cc.log("ai ready")
    }

    doMyRound() {
        this.doSortOutMyBlocks()
    }

    configHero(herodata: HeroData[]) {
        return StaticData.AIHeroData

        let hdata: HeroData[] = []

        herodata.forEach((hd) => {
            hdata.push(JSON.parse(JSON.stringify(hd)))
        })
        hdata.forEach(hd => {

            // let dw = GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv
            // let q = hd.quality
            // if (dw <= 2) {
            //     q = q - 1 < 1 ? 1 : q - 1
            // } else if (dw <= 3) {

            // } else {
            //     let dt = Utility.GetRandom(-1, 1, true)
            //     q = q + dt
            //     q = q < 0 ? 0 : q
            //     q = q > 3 ? 3 : q
            // }

            let sLv: number = StaticData.StageLevel
            let bgConfig: any = GameData.Share.getBattleGroundByGrade(sLv)
            let qArr: any[] = bgConfig.enmeyQ

            let q = hd.quality
            q = qArr[Utility.GetRandom(0, qArr.length - 1)]

            let t = hd.type
            let selflevel = hd.level

            let nherodata: HeroData = null
            nherodata = GameData.Share.getHDataByTQ(t, q)
            // if (StaticData.StageLevel < 2) {
            //     nherodata = GameData.Share.getHeroRDataByType(t, 1)
            // } else {
            //     nherodata = GameData.Share.getHeroRDataByType(t)
            // }
            hd.id = nherodata.id
            hd.name = nherodata.name
            hd.quality = nherodata.quality
            hd.sb = nherodata.sb

            let aArr: any[] = bgConfig.enemyAtk
            hd.atk += aArr[Utility.GetRandom(0, aArr.length - 1)]
            hd.atk = hd.atk < 1 ? 1 : hd.atk

            // if (dw <= 2) {
            //     hd.atk = hd.atk - 1 < 1 ? 1 : hd.atk - 1

            // } else if (dw <= 3) {

            // } else if (dw <= 5) {
            //     let dt = Utility.GetRandom(0, 1, true)
            //     hd.atk = hd.atk + dt > 27 ? 27 : hd.atk + dt
            // } else {
            //     let dt = Utility.GetRandom(0, 2, true)
            //     hd.atk = hd.atk + dt > 27 ? 27 : hd.atk + dt
            // }

        })
        return hdata

    }

    doSortOutMyBlocks() {
        this.myBlocks.length = 0
        if (!StaticData.Teaching) {
            for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
                let block = GameLogicCrl.Share.blockMats[i]
                if (block.mxtPos.y > 4) {
                    this.myBlocks.push(block)
                }
            }
            this.handleCheckLink()
        } else {

            let selectblock: BlockCrl[] = []
            let select = TerritoyTeachBaseCrl.Share.getCurOptLink()
            select.forEach(sel => {
                selectblock.push(GameLogicCrl.Share.getBlockByMpos(cc.v2(sel.x, sel.y)))

            })
            cc.log("ai do select from config", select)
            this.scheduleOnce(() => {
                selectblock.forEach(sb => {
                    sb.showSelect()
                })

                this.scheduleOnce(() => {
                    GameLogicCrl.Share.territoryCrl.preLinkList = selectblock
                    GameLogicCrl.Share.territoryCrl.handleCheckTouchEnd(true)
                }, 1)
            }, 2)


            //TerritoyTeachBaseCrl.Share.
        }
    }

    handleCheckLink() {

        this.allLink.length = 0

        this.curLoop = 0
        for (let i = 0; i < this.myBlocks.length; i++) {
            this.curChain.length = 0
            this.checkChain(false, this.myBlocks[i])
            if (this.curChain.length > 2) {
                // cc.log("--------------------------------head is:", this.curChain[0].mxtPos,false)
                this.allLink.push([].concat(this.curChain))
            }
            this.curChain.length = 0
            this.checkChain(true, this.myBlocks[i])
            if (this.curChain.length > 2) {
                //cc.log("--------------------------------head is:", this.curChain[0].mxtPos,true)
                this.allLink.push([].concat(this.curChain))
            }
        }
        //cc.log(this.allLink)
        //cc.log("loop count:", this.curloop)
        this.handleBestChioces()
    }

    checkChain(r: boolean, block: BlockCrl, lblock?: BlockCrl) {

        let dirs = StaticData.Dirs
        if (r == true) {
            dirs = dirs.reverse()
        }
        this.curChain.push(block)
        for (let i = 0; i < dirs.length; i++) {
            let d = dirs[i]
            let nextb = this.getBlockXY(block.mxtPos.add(d))
            if (nextb != null) {
                if (nextb.atype) {
                    nextb.type = block.type
                }
                if (nextb.type == block.type) {
                    if (this.curChain.indexOf(nextb) < 0) {
                        this.checkChain(r, nextb, block)
                        break
                    }
                }
            }
        }
    }





    handleBestChioces() {
        let targetlink: Array<BlockCrl> = []
        this.allLink.sort((n1, n2) => n2.length - n1.length)

        let smartlink: Array<Array<BlockCrl>> = new Array<Array<BlockCrl>>()
        this.allLink.forEach(link => {
            if (link.filter(b => b.blockSkill != -1).length > 0)
                smartlink.push(link)
        })
        cc.log("smartlink:", smartlink)
        if (smartlink.length > 0) {
            let comp = this.allLink[0].length - smartlink[0].length
            if (comp < 2) {
                targetlink = smartlink[0]
                cc.log("skill first")
            } else {
                targetlink = this.allLink[0]
                cc.log("mount first")
            }

        } else {
            targetlink = this.allLink[0]
        }


        // cc.log("lost beford", this.allLink[goodidx].length)
        this.lostIQ(targetlink)
        //  cc.log("lost after", this.allLink[goodidx].length)
        let checkdiff: boolean = false

        let srctype: number = -1
        let bt = targetlink[0].type
        targetlink.forEach(b => {
            if (!b.atype) {
                srctype = b.type
            }
        })
        targetlink.forEach(b => {
            b.type = srctype
        })

        let dt = Utility.GetRandom(1, 2)
        // if (CC_WECHATGAME) {
        //     dt = Utility.GetRandom(2, 5)
        // }


        this.scheduleOnce(async () => {
            let quene: any[] = []
            let sTime: number = 0
            targetlink.forEach(b => {
                let doS = async () => {
                    return new Promise((rs, err) => {
                        this.scheduleOnce(() => {
                            b.showSelect()
                            rs()
                        }, sTime)
                        sTime += 0.2
                    })
                }
                quene.push(doS())
            })

            let doQuene = () => {
                return new Promise((resolve, err) => {
                    Promise.all(quene).then(() => {
                        this.scheduleOnce(() => {
                            //let links = targetlink.sort((n1, n2) => n1.mxtPos.y - n2.mxtPos.y)
                            //GameLogicCrl.Share.territoryCrl.preLinkList = links
                            GameLogicCrl.Share.territoryCrl.preLinkList = targetlink
                            GameLogicCrl.Share.territoryCrl.handleCheckTouchEnd(true)
                        }, 1)
                        resolve()
                    })
                })
            }
            await doQuene()
        }, dt)

    }

    getBlockXY(p) {
        for (let i = 0; i < this.myBlocks.length; i++) {
            if (this.myBlocks[i].mxtPos.equals(p)) {
                this.curLoop++
                return this.myBlocks[i]
            }
        }
        return null
    }

    lostIQ(blocks: Array<BlockCrl>) {
        // if (GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv < 3) {
        //     cc.log("lost IQ active")
        //     if (blocks.length > 5) {
        //         blocks.splice(0, 2)
        //     } else if (blocks.length == 5) {
        //         // if (StaticData.StageLevel == 1) {
        //         blocks.splice(0, 1)
        //         // }
        //     }
        // }

        let pInfo: any = StaticData.PlayerInfo
        if (pInfo.grade != 0 && pInfo.grade % 5 == 0 && !StaticData.AILimit)
            return

        if (StaticData.startFromArena)
            return

        if (StaticData.AILimit) {
            if (blocks.length > 3) {
                blocks.splice(3, blocks.length - 3)
            }
        } else {
            if (StaticData.PlayerInfo.score <= 50) {
                cc.log("lost IQ active")
                blocks.reverse()
                if (blocks.length > 5) {
                    blocks.splice(0, 2)
                } else if (blocks.length == 5) {
                    // if (StaticData.StageLevel == 1) {
                    blocks.splice(0, 1)
                    // }
                }
            }
        }
    }
}
