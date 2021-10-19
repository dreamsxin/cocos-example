import UICrl from "../Lib/UI/UICrl";
import UIMgr from "../Lib/UI/UIMgr";
import StaticData from "../StaticData";
import GameData from "../GameData";
import Utility from "../Lib/Utility";
import WXApi from "../Lib/WXApi";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankResultUI extends UICrl {

    @property(cc.Node)
    starNode: cc.Node = null

    @property(cc.Node)
    sN2: cc.Node = null
    @property(cc.Node)
    sN3: cc.Node = null
    @property(cc.Node)
    sN4: cc.Node = null
    @property(cc.Node)
    sN5: cc.Node = null

    @property(cc.Node)
    curIcon: cc.Node = null
    @property(cc.Node)
    nextIcon: cc.Node = null
    @property(cc.Node)
    curText: cc.Node = null
    @property(cc.Node)
    nextText: cc.Node = null
    @property(cc.Label)
    curLv: cc.Label = null
    @property(cc.Label)
    nextLv: cc.Label = null

    @property(cc.Sprite)
    icon: cc.Sprite = null

    @property(cc.Node)
    rankProtected: cc.Node = null

    @property(cc.Node)
    scoreNode: cc.Node = null

    onLoad() {

    }
    start() {

    }

    onEnable() {
        let pInfo: any = StaticData.PlayerInfo
        // pInfo.score = 17
        // pInfo.winTimes = 3
        // if (pInfo.winTimes >= 3) {
        //     this.initData(pInfo.winTimes, pInfo.score - 1)
        // } else {
        //     this.initData(pInfo.winTimes, pInfo.score)
        // }
        this.initData(pInfo.winTimes, pInfo.score)
    }

    closeCB() {
        cc.director.loadScene("GameMenu", () => {
            this.node.active = false
            UIMgr.Share.showUI("MainUI")
        })
    }

    async initData(wt, score) {
        let battleData: any = GameData.Share.getBattleGroundByGrade(StaticData.StageLevel)

        let data = await WXApi.HttpPost("/fangkuaiWx/userRanking", { channel: WXApi.channelID })
        let predata: any = data.preUser
        let mydata: any = data.local
        if (mydata.index <= 1)
            this.icon.node.parent.active = false
        else {
            let url: string = predata.pic
            Utility.LoadImgAyns(url, this.icon)
        }

        let isWin: boolean = wt > 0
        let isContinueWin: boolean = wt >= 3
        let nextScore = score
        let thisScore = nextScore
        if (isWin) {
            thisScore = thisScore - battleData.winScore < 0 ? 0 : thisScore - battleData.winScore
            this.levelUp(nextScore, thisScore)
        } else {
            thisScore += battleData.winScore
            this.levelDown(thisScore, nextScore)
        }
        //await this.changeInfo(isWin, nextScore)

        // let pInfo: any = StaticData.PlayerInfo
        // if (isContinueWin && nextScore < pInfo.score) {
        //     this.node.getChildByName('widget').getChildByName('winningStreak').active = true
        //     this.initData(wt, nextScore + battleData.winScore)
        // }

        StaticData.LevelProtected = false
    }

    waitFun(t) {
        return new Promise(async (resolve, reject) => {
            this.scheduleOnce(() => {
                resolve()
            }, t)

        })
    }

    async changeInfo(isWin, score) {
        return new Promise(async (resolve, reject) => {
            if (isWin) {
                let rankConfig: any = GameData.Share.getRankConfigByScore(score)

                let ctextId = GameData.Share.getRankConfigByScore(score - 1).lv - 1 < 0 ? 0 : GameData.Share.getRankConfigByScore(score - 1).lv - 1
                let ntextId = rankConfig.lv - 1 < 0 ? 0 : rankConfig.lv - 1
                this.curText.children.forEach(c => {
                    c.active = false
                });
                this.curText.getChildByName(ctextId.toString()).active = true
                this.nextText.children.forEach(c => {
                    c.active = false
                });
                this.nextText.getChildByName(ntextId.toString()).active = true

                this.curLv.string = GameData.Share.getRankConfigByScore(score - 1).t
                this.nextLv.string = GameData.Share.getRankConfigByScore(score).t
                this.curLv.node.color = new cc.Color(
                    GameData.Share.getRankConfigByScore(score - 1).r,
                    GameData.Share.getRankConfigByScore(score - 1).g,
                    GameData.Share.getRankConfigByScore(score - 1).b, 255)
                this.nextLv.node.color = new cc.Color(
                    GameData.Share.getRankConfigByScore(score).r,
                    GameData.Share.getRankConfigByScore(score).g,
                    GameData.Share.getRankConfigByScore(score).b, 255)


                if (rankConfig.lv > GameData.Share.getRankConfigByScore(score - 1).lv) {
                    let nindex = rankConfig.lv - 1 < 0 ? 0 : rankConfig.lv - 1
                    let cindex = nindex - 1 < 0 ? 0 : nindex - 1
                    console.log('nindex:', nindex)
                    console.log('cindex:', cindex)
                    this.curIcon.children.forEach(c => {
                        c.active = false
                    });
                    this.curIcon.getChildByName(cindex.toString()).active = true
                    this.nextIcon.children.forEach(c => {
                        c.active = false
                    });
                    this.nextIcon.getChildByName(nindex.toString()).active = true
                    this.node.getComponent(cc.Animation).play('rankUP')

                    await this.waitFun(2)
                } else {
                    let cindex = rankConfig.lv - 1 < 0 ? 0 : rankConfig.lv - 1
                    this.nextIcon.children.forEach(c => {
                        c.active = false
                    });
                    this.nextIcon.getChildByName(cindex.toString()).active = true
                    this.curIcon.active = false

                    await this.waitFun(1)
                }

                this.starNode.active = true
                if (score >= 99)
                    this.starNode.active = false

            } else {
                let rankConfig: any = GameData.Share.getRankConfigByScore(score)

                let ctextId = GameData.Share.getRankConfigByScore(score + 1).lv - 1 < 0 ? 0 : GameData.Share.getRankConfigByScore(score + 1).lv - 1
                let ntextId = rankConfig.lv - 1 < 0 ? 0 : rankConfig.lv - 1
                this.curText.children.forEach(c => {
                    c.active = false
                });
                this.curText.getChildByName(ctextId.toString()).active = true
                this.nextText.children.forEach(c => {
                    c.active = false
                });
                this.nextText.getChildByName(ntextId.toString()).active = true

                this.curLv.string = GameData.Share.getRankConfigByScore(score + 1).t
                this.nextLv.string = GameData.Share.getRankConfigByScore(score).t
                this.curLv.node.color = new cc.Color(
                    GameData.Share.getRankConfigByScore(score + 1).r,
                    GameData.Share.getRankConfigByScore(score + 1).g,
                    GameData.Share.getRankConfigByScore(score + 1).b, 255)
                this.nextLv.node.color = new cc.Color(
                    GameData.Share.getRankConfigByScore(score).r,
                    GameData.Share.getRankConfigByScore(score).g,
                    GameData.Share.getRankConfigByScore(score).b, 255)


                if (StaticData.LevelProtected) {
                    console.log('段位保护1')
                    this.curIcon.active = false
                    this.curLv.node.active = false
                    this.curText.active = false
                }
                this.rankProtected.active = StaticData.LevelProtected

                if (rankConfig.lv < GameData.Share.getRankConfigByScore(score + 1).lv) {
                    let cindex = rankConfig.lv
                    let nindex = cindex - 1 < 0 ? 0 : cindex - 1
                    this.curIcon.children.forEach(c => {
                        c.active = false
                    });
                    this.curIcon.getChildByName(cindex.toString()).active = true
                    this.nextIcon.children.forEach(c => {
                        c.active = false
                    });
                    this.nextIcon.getChildByName(nindex.toString()).active = true

                    if (!StaticData.LevelProtected) {
                        this.node.getComponent(cc.Animation).play('rankDOWN')

                        await this.waitFun(2)
                    }

                } else {
                    let cindex = rankConfig.lv - 1 < 0 ? 0 : rankConfig.lv - 1
                    this.nextIcon.children.forEach(c => {
                        c.active = false
                    });
                    this.nextIcon.getChildByName(cindex.toString()).active = true
                    this.curIcon.active = false
                    if (!StaticData.LevelProtected) {
                        await this.waitFun(1)
                    }
                }

                this.starNode.active = true
                if (score <= 0)
                    this.starNode.active = false
            }
            resolve()
        })


    }

    levelUp(nextScore, thisScore) {
        this.scoreNode.active = true
        this.scoreNode.getChildByName('next').getComponent(cc.Label).string = (nextScore).toString()
        this.scoreNode.getChildByName('this').getComponent(cc.Label).string = (thisScore).toString()
        console.log('LegendADD', nextScore)
        this.scoreNode.getComponent(cc.Animation).play('LegendADD')
        return

        let rankConfig: any = GameData.Share.getRankConfigByScore(nextScore)
        let starNum: number = rankConfig.starNum
        let star: number = nextScore - rankConfig.dt

        this.scoreNode.active = false
        if (starNum == 0) {
            if (nextScore == 99) {
                this.starNode.removeAllChildren()
                let sNode = cc.instantiate(this['sN5'])
                this.starNode.addChild(sNode)
                sNode.active = true
                for (let i = 0; i < 5; i++) {
                    sNode.getChildByName(i.toString()).active = true
                }
                this.scheduleOnce(() => { this.starNode.removeAllChildren() }, 1.5)
            }

            if (nextScore >= 99) {
                this.scoreNode.active = true
                this.scoreNode.getChildByName('next').getComponent(cc.Label).string = (nextScore - 98).toString()
                this.scoreNode.getChildByName('this').getComponent(cc.Label).string = (nextScore - 99).toString()
                console.log('LegendADD', nextScore)
                this.scoreNode.getComponent(cc.Animation).play('LegendADD')
            }
            return
        }
        this.starNode.removeAllChildren()
        let sNode = cc.instantiate(this['sN' + starNum])
        this.starNode.addChild(sNode)
        sNode.active = true
        for (let i = 0; i < starNum; i++) {
            sNode.getChildByName(i.toString()).active = star > i
        }
        sNode.getChildByName((star - 1).toString()).active = true;
        sNode.getChildByName((star - 1).toString()).getComponent(cc.Animation).play('getstar')
    }

    levelDown(thisScore, nextScore) {
        this.scoreNode.active = true
        this.scoreNode.getChildByName('next').getComponent(cc.Label).string = nextScore.toString()
        this.scoreNode.getChildByName('this').getComponent(cc.Label).string = thisScore.toString()
        console.log('LegendREDUCE', thisScore, nextScore)
        this.scoreNode.getComponent(cc.Animation).play('LegendREDUCE')
        return

        let rankConfig: any = GameData.Share.getRankConfigByScore(thisScore)
        let starNum: number = rankConfig.starNum
        let star: number = thisScore - rankConfig.dt

        this.scoreNode.active = false
        if (starNum == 0) {
            if (nextScore > 0 && nextScore < 99) {
                this.starNode.removeAllChildren()
                let sNode = cc.instantiate(this['sN5'])
                this.starNode.addChild(sNode)
                sNode.active = true
                for (let i = 0; i < 5; i++) {
                    sNode.getChildByName(i.toString()).active = true
                }
            }

            if (nextScore >= 99) {
                this.scoreNode.active = true
                this.scoreNode.getChildByName('next').getComponent(cc.Label).string = (nextScore - 98).toString()
                this.scoreNode.getChildByName('this').getComponent(cc.Label).string = (nextScore + 1 - 98).toString()
                console.log('LegendREDUCE', thisScore, nextScore)
                this.scoreNode.getComponent(cc.Animation).play('LegendREDUCE')
            }

            return
        }

        //是否段位保护
        if (StaticData.LevelProtected) {
            console.log('段位保护')
            let rankConfig: any = GameData.Share.getRankConfigByScore(nextScore)
            let starNum: number = rankConfig.starNum
            let star: number = nextScore - rankConfig.dt

            if (starNum == 0) {
                return
            }

            this.starNode.removeAllChildren()
            let sNode = cc.instantiate(this['sN' + starNum])
            this.starNode.addChild(sNode)
            sNode.active = true
            for (let i = 0; i < starNum; i++) {
                sNode.getChildByName(i.toString()).active = star > i
            }
            return
        }

        this.starNode.removeAllChildren()
        let sNode = cc.instantiate(this['sN' + starNum])
        this.starNode.addChild(sNode)
        sNode.active = true
        for (let i = 0; i < starNum; i++) {
            sNode.getChildByName(i.toString()).active = star > i
        }
        sNode.getChildByName((star - 1).toString()).active = true

        sNode.getChildByName((star - 1).toString()).getComponent(cc.Animation).play('losestar')

        this.scheduleOnce(() => {
            if (star - 1 <= 0) {
                let rankConfig: any = GameData.Share.getRankConfigByScore(nextScore)
                let starNum: number = rankConfig.starNum
                let star: number = nextScore - rankConfig.dt

                if (starNum == 0) {
                    return
                }

                this.starNode.removeAllChildren()
                let sNode = cc.instantiate(this['sN' + starNum])
                this.starNode.addChild(sNode)
                sNode.active = true
                for (let i = 0; i < starNum; i++) {
                    sNode.getChildByName(i.toString()).active = star > i
                }
            }
        }, 1.5)
    }

    update(dt) { }
}
