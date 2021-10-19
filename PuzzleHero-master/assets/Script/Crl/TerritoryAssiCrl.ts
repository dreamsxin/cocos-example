import BlockCrl from "./BlockCrl";
import StaticData from "../StaticData";
import Utility from "../Lib/Utility";
import GameLogicCrl from "./GameLogicCrl";
import EventString from "../EventString";
import SoundMgr from "../Lib/SoundMgr";
import GameData from "../GameData";

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

export class DBlock {
    //{ p: null, c: 0, t: 0, hp: 0, sb: 0, hid: 0, sskill: 0, dbpos: [] }

    //pos
    p: cc.Vec2 = null
    //count
    c: number = 0
    //main type(color)
    t: number = 0

    sb: number = 0
    //hero hp
    hp: number = 0

    dbpos: cc.Vec2[] = []

    //hero id
    hid: number = 0

    //skillblocksSubType
    skillblock: number[] = []

    sbpos: cc.Vec2[] = []

    setupPos: cc.Vec2 = null

}

export class GBlock {
    x: number = 0
    y: number = 0
    t: number = 0
}

@ccclass
export default class TerritoryAssiCrl extends cc.Component {


    exitProcess: any = null

    linkCount: number = 0

    linkList: BlockCrl[] = []
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    preFLinkBlock: BlockCrl = null

    preCLinkBlock: BlockCrl = null

    preLinkList: BlockCrl[] = []

    preCanLinkList: BlockCrl[] = []

    preCurLinkType: number = -1

    isNpc: boolean = false

    roundBlocks: BlockCrl[] = []

    skillBlock: BlockCrl = null

    isKillDef: boolean = false

    getBlockByMpos(p: cc.Vec2) {
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            if (GameLogicCrl.Share.blockMats[i].mxtPos.equals(p)) {
                return GameLogicCrl.Share.blockMats[i]
            }
        }
        return null
    }

    showAtkCount() {
        if (this.preLinkList.length >= 3) {
            let atk = 0
            for (let i = 0; i < this.preLinkList.length; i++) {
                let pInfo: any = StaticData.PlayerInfo
                let ch: any[] = pInfo.currentHero
                let hs: any[] = [].concat(pInfo.heros)
                hs.sort((a, b) => a.id - b.id)
                atk += this.preLinkList[i].hp
                atk += hs[ch[this.preLinkList[i].type - 1] - 1].atk
            }
            GameLogicCrl.Share.showAtkCount(atk)
        } else {
            this.hideAtkCount()
        }
    }

    hideAtkCount() {
        GameLogicCrl.Share.hideAtkCount()
    }

    showSkillTips(p: cc.Vec2) {
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            if (GameLogicCrl.Share.blockMats[i].mxtPos.y > 4) {
                continue
            }
            let dis = Math.abs(Utility.GetDistance(p, GameLogicCrl.Share.blockMats[i].node.position))
            if (dis < 30 && GameLogicCrl.Share.blockMats[i].blockSkill != -1) {
                this.skillBlock = GameLogicCrl.Share.blockMats[i]
                GameLogicCrl.Share.showSKillTips(i)
            }
        }
    }
    checkHideSkillTips(p: cc.Vec2) {
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            if (GameLogicCrl.Share.blockMats[i].mxtPos.y > 4 || !this.skillBlock) {
                continue
            }
            let dis = Math.abs(Utility.GetDistance(p, this.skillBlock.node.position))
            if (dis >= 30) {
                this.hideSkillTips()
            }
        }
    }

    hideSkillTips() {
        this.skillBlock = null
        GameLogicCrl.Share.hideSKillTips()
    }

    handleCheckTouch(p: cc.Vec2) {
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            if (GameLogicCrl.Share.blockMats[i].mxtPos.y > 4) {
                continue
            }
            let dis = Math.abs(Utility.GetDistance(p, GameLogicCrl.Share.blockMats[i].node.position))
            if (dis < 30) {
                if (this.preFLinkBlock == null) {
                    this.preFLinkBlock = GameLogicCrl.Share.blockMats[i]
                }
                if (this.preCLinkBlock == null) {
                    GameLogicCrl.Share.blockMats[i].showSelect()
                    this.preLinkList.push(GameLogicCrl.Share.blockMats[i])
                    this.preCLinkBlock = GameLogicCrl.Share.blockMats[i]
                    break
                } else if (this.preCLinkBlock != null && this.preCLinkBlock != GameLogicCrl.Share.blockMats[i]
                    && ((this.preCLinkBlock.atype && this.preCurLinkType == -1) ||
                        this.preCLinkBlock.type == GameLogicCrl.Share.blockMats[i].type)) {
                    let dirs = StaticData.Dirs
                    let isnear: boolean = false
                    for (let j = 0; j < dirs.length; j++) {
                        let p = this.preCLinkBlock.mxtPos.add(dirs[j])
                        if (p.equals(GameLogicCrl.Share.blockMats[i].mxtPos)) {
                            isnear = true
                            break
                        }
                    }
                    let idx = this.preLinkList.indexOf(GameLogicCrl.Share.blockMats[i])
                    if (idx < 0) {
                        if (isnear) {
                            GameLogicCrl.Share.blockMats[i].showSelect()
                            this.preLinkList.push(GameLogicCrl.Share.blockMats[i])
                            this.preCLinkBlock = GameLogicCrl.Share.blockMats[i]
                            break
                        }

                    } else {
                        this.handleUnSelect(idx)
                        this.preCLinkBlock = GameLogicCrl.Share.blockMats[i]
                        break
                    }
                }
            }
        }
        if (this.preCLinkBlock != null && !this.preCLinkBlock.atype) {
            this.preCurLinkType = this.preCLinkBlock.type
            this.updateAllABlockType()
            this.handleCheckPreLink(this.preCLinkBlock)
            this.preCanLinkList = this.preCanLinkList.filter(n => n.type == this.preCurLinkType)
            this.handleShowCanLink()
        }
    }

    handleUnSelect(sidx: number) {
        for (let i = sidx + 1; i < this.preLinkList.length; i++) {
            this.preLinkList[i].showSelect(false)
        }
        this.preLinkList.length = sidx + 1
    }

    handleCheckPreLink(block: BlockCrl) {
        if (block.mxtPos.y > 4) {
            return
        }
        let dirs = StaticData.Dirs
        this.preCanLinkList.push(block)
        let is_f_all = false
        if (this.preFLinkBlock == block && block.atype) {
            is_f_all = true
        }
        if (!block.atype) {
            this.preCurLinkType = block.type
            this.updateAllABlockType()
        }
        for (let i = 0; i < dirs.length; i++) {
            let nextb = this.getBlockByMpos(block.mxtPos.add(dirs[i]))
            if (nextb != null) {
                if ((nextb.atype == true || nextb.type == block.type || is_f_all)
                    && this.preCanLinkList.indexOf(nextb) < 0) {
                    this.handleCheckPreLink(nextb)
                }
            }
        }
    }

    handleShowCanLink() {
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            if (this.preCanLinkList.indexOf(GameLogicCrl.Share.blockMats[i]) < 0) {
                GameLogicCrl.Share.blockMats[i].showDark(true)
            } else {
                GameLogicCrl.Share.blockMats[i].showDark(false)
            }
        }
    }

    removeBlocksMats(block: BlockCrl, dl: number = 0.5) {
        return new Promise((resolve, err) => {
            cc.loader.loadRes("fx/cleanFX", (err, res) => {
                let expi: cc.Node = cc.instantiate(res)
                expi.position = block.node.position
                block.node.parent.addChild(expi)
                block.node.removeFromParent()
                this.scheduleOnce(() => {
                    expi.destroy()
                    resolve()
                }, dl)
            })

            Utility.DelListItem(GameLogicCrl.Share.blockMats, block)
        })

    }

    genOneSkillBlock(type: number, skill: number, block: BlockCrl, next: any) {
        Utility.DelListItem(GameLogicCrl.Share.blockMats, block)
        let par = block.node.parent
        cc.loader.loadRes("block/b" + type, (err, res) => {
            block.node.removeFromParent()
            let newb: BlockCrl = cc.instantiate(res).addComponent(BlockCrl)
            newb.node.position = block.node.position
            newb.mxtPos = block.mxtPos
            newb.type = type
            par.addChild(newb.node)
            newb.showSkillBlock(skill)
            GameLogicCrl.Share.blockMats.push(newb)
            next()
        })
    }

    handleDiePath() {
        return new Promise(async (resolve, ererr) => {
            let isdiepath = this.checkDiePath()
            cc.log("is die path:", isdiepath)
            //cc.log([].concat(GameLogicCrl.Share.blockMats))
            if (isdiepath) {
                await this.genAtypeBlock()
                await this.handleDiePath()
            }
            resolve()
        })

    }

    genAtypeBlock() {
        return new Promise(async (resolve, reerr) => {
            let blocks = this.getMyBlocksExHero()
            let tblock = blocks[GameLogicCrl.Share.syncRandom(0, blocks.length - 1)]
            let newp = tblock.mxtPos.clone()
            await GameLogicCrl.Share.territoryCrl.removeBlocksMats(tblock, 0.5)
            let newblock = await GameLogicCrl.Share.genBlock(5, newp, true)
            GameLogicCrl.Share.blockMats.push(newblock)
            resolve()
        })

    }

    checkDiePath() {
        let diepath = true
        this.roundBlocks = GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y < 5) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y > 4) {
                return true
            }
        })
        let curtemps: BlockCrl[] = []
        let idx = 0
        let tblock: BlockCrl = null
        tblock = this.roundBlocks[idx]
        while (tblock != null) {
            let stoploop = false
            let dirs = StaticData.Dirs
            let haslink = false
            for (let i = 0; i < dirs.length; i++) {
                let next = this.getRoundBlockByMpos(tblock.mxtPos.add(dirs[i]))
                if (next != null) {
                    if (next.atype) {
                        next.type = tblock.type
                    }
                    if ((next.type == tblock.type) && curtemps.indexOf(next) < 0) {
                        if (curtemps.length < 1) {
                            curtemps.push(tblock)
                        }
                        tblock = next
                        haslink = true
                        curtemps.push(next)
                        if (curtemps.length > 2) {
                            stoploop = true
                        }
                        break
                    }
                }
            }
            if (stoploop) {
                diepath = false
                break;
            }
            if (!haslink) {
                curtemps.length = 0
                idx++
                tblock = this.roundBlocks[idx]
            }
        }
        return diepath
    }

    updateAllABlockType() {
        GameLogicCrl.Share.blockMats.forEach(n => {
            if (n.atype) {
                n.type = this.preCurLinkType
            }
        })
    }

    getRoundBlockByMpos(p: cc.Vec2) {
        for (let i = 0; i < this.roundBlocks.length; i++) {
            if (this.roundBlocks[i].mxtPos.equals(p)) {
                return this.roundBlocks[i]
            }
        }
        return null
    }

    releaseSelect() {
        for (let i = 0; i < this.preLinkList.length; i++) {
            this.preLinkList[i].showSelect(false)
        }
        this.preCLinkBlock = null
        this.preFLinkBlock = null
        this.preLinkList.length = 0
        this.preCanLinkList.length = 0
        this.preCurLinkType = -1
        for (let i = 0; i < GameLogicCrl.Share.blockMats.length; i++) {
            GameLogicCrl.Share.blockMats[i].showDark(false)
            GameLogicCrl.Share.blockMats[i].atype ? GameLogicCrl.Share.blockMats[i].type = 0 : ""
        }
    }

    getMyBlocks() {
        this.roundBlocks = GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y < 5) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y > 4) {
                return true
            }
        })
        return this.roundBlocks
    }

    getMyBlocksExHero() {
        this.roundBlocks = GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y < 5 && b.hid == -1) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y > 4 && b.hid == -1) {
                return true
            }
        })
        return this.roundBlocks
    }

    getMyHero() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y < 5 && b.hid != -1) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y > 4 && b.hid != -1) {
                return true
            }
        })
    }

    getOpSkillBlocks() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y < 5 && b.blockSkill != -1) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y > 4 && b.blockSkill != -1) {
                return true
            }
        })
    }
    getMySkillBlocks() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y < 5 && b.blockSkill != -1) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y > 4 && b.blockSkill != -1) {
                return true
            }
        })
    }

    getOpponentHero() {
        return GameLogicCrl.Share.blockMats.filter(b => {
            if (GameLogicCrl.Share.roundPlayer == 1 && b.mxtPos.y < 5 && b.hid != -1) {
                return true
            } else if (GameLogicCrl.Share.roundPlayer == 0 && b.mxtPos.y > 4 && b.hid != -1) {
                return true
            }
        })
    }

    getCanLinkBlocks() {
        let allLink: any[] = []
        let myBlocks: BlockCrl[] = this.getMyBlocks().filter(b => { return !b.atype })
        let curChain: BlockCrl[] = []
        let tempArr: BlockCrl[] = []

        let checkCanLink = (block: BlockCrl) => {
            if (curChain.indexOf(block) < 0 && tempArr.indexOf(block) < 0) {
                let dirs = StaticData.Dirs
                curChain.push(block)
                for (let i = 0; i < dirs.length; i++) {
                    let d = dirs[i]
                    let nextb = this.getBlockByPos(block.mxtPos.add(d))
                    if (nextb != null) {
                        if (nextb.atype) {
                            nextb.type = block.type
                        }
                        if (nextb.type == block.type) {
                            if (curChain.indexOf(nextb) < 0) {
                                //curChain.push(nextb)
                                checkCanLink(nextb)
                            }
                        }
                    }
                }
            }
        }

        for (let i = 0; i < myBlocks.length; i++) {
            curChain.splice(0, curChain.length)
            if (tempArr.indexOf(myBlocks[i]) >= 0) {
                continue
            }
            checkCanLink(myBlocks[i])
            tempArr = tempArr.concat(curChain)
            if (curChain.length >= 3)
                allLink.push([].concat(curChain))
        }

        return allLink
    }

    getBlockByPos(p) {
        let myBlocks: BlockCrl[] = this.getMyBlocksExHero()
        for (let i = 0; i < myBlocks.length; i++) {
            if (myBlocks[i].mxtPos.equals(p)) {
                return myBlocks[i]
            }
        }
        return null
    }

    handleSKillDestroyBlocks(dbs: BlockCrl[]): Promise<DBlock> {
        return new Promise(async (resolve, err) => {
            let re = new DBlock()
            let quene: any[] = []

            if (dbs.length > 2) {
                for (let i = 0; i < dbs.length; i++) {
                    let block = dbs[i]
                    if (i == dbs.length - 1) {
                        re.p = block.mxtPos.clone()
                        re.t = block.type
                    }
                    re.dbpos.push(block.mxtPos.clone())

                    if (block.hp > 0) {
                        re.hp += block.hp
                    }
                    re.c++
                    quene.push(this.removeBlocksMats(block))
                }
                dbs.length = 0
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
                resolve(re)
            }
            )
        })
    }

}
