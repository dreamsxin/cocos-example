import UICrl from "../Lib/UI/UICrl";
import HeroData from "../Mod/HeroData";
import GameLogicCrl from "../Crl/GameLogicCrl";
import Utility from "../Lib/Utility";
import StaticData from "../StaticData";
import WXApi from "../Lib/WXApi";
import BaseX from "../Lib/Base64";
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

@ccclass
export default class MatchUI extends UICrl {


    @property([cc.Node])
    heroNodes: cc.Node[] = []

    @property([cc.Label])
    nameLabel: cc.Label[] = []
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property([cc.Node])
    faceNode: cc.Node[] = []


    start() {

    }

    onEnable() {

    }

    doShow(pvpData?: any) {
        return new Promise(async (resolve, reject) => {
            StaticData.getAIData(pvpData)
            //let playerdata = GameLogicCrl.Share.playerData

            let playerdata: any[] = []
            playerdata.push({ nickname: '', face: '', heros: [] })
            playerdata.push({ nickname: '', face: '', heros: [] })

            playerdata[0].nickname = StaticData.PlayerInfo.nickname
            playerdata[0].face = StaticData.PlayerInfo.face
            let herodata: HeroData[] = StaticData.PlayerInfo.heros.filter(hero => {
                return hero.use == true
            })
            herodata = herodata.sort((n1, n2) => {
                return n1.type - n2.type
            })
            playerdata[0].heros = herodata
            //设置竞技场属性
            if (StaticData.startFromArena) {
                let pInfo: any = StaticData.PlayerInfo
                let arenaData: any = pInfo.arenaData
                for (let i = 0; i < 4; i++) {
                    let id: number = arenaData.currentArr[i]
                    playerdata[0].heros[i].id = id
                    playerdata[0].heros[i].quality = GameData.Share.getHeroDataById(id).quality
                    playerdata[0].heros[i].atk = arenaData.heroAtkArr[i]
                }
            }

            let rs = await WXApi.HttpPost("/fangkuaiWx/getOtherUserInfo", {})
            if (rs.errcode == 200) {
                if (rs.nickname != "" && rs.nickname != null && rs.nickname != undefined) {
                    playerdata[1].nickname = new BaseX().decode(rs.nickname)
                    playerdata[1].face = rs.face
                }
                StaticData.otherUserInfo = rs
            }
            playerdata[1].heros = StaticData.AIHeroData
            if (StaticData.startFromArena && pvpData) {
                playerdata[1].nickname = pvpData.nickname
                playerdata[1].face = pvpData.face
            } else if (StaticData.startFromShareGame && pvpData) {
                playerdata[1].nickname = pvpData.nickname
                playerdata[1].face = pvpData.face
            }

            for (let i = 0; i < this.nameLabel.length; i++) {
                this.nameLabel[i].string = playerdata[i].nickname
                Utility.LoadImgAyns(playerdata[i].face, this.faceNode[i].getComponent(cc.Sprite))
            }
            let heros: HeroData[] = [].concat(playerdata[0].heros).concat(playerdata[1].heros)
            let heroquene: any[] = []
            for (let i = 0; i < heros.length; i++) {
                let loadhero = new Promise((resolve, reject) => {
                    cc.loader.loadRes("character/avatar/H" + heros[i].id, (err, res) => {
                        let hobj: cc.Node = cc.instantiate(res)
                        hobj.getChildByName('full').active = false
                        this.heroNodes[i].getChildByName("herohere").removeAllChildren()
                        this.heroNodes[i].getChildByName("herohere").addChild(hobj)
                        resolve()
                    })
                })
                heroquene.push(loadhero)
            }

            await new Promise((resolve, reject) => {
                Promise.all(heroquene).then(() => {
                    resolve()
                })
            })
            this.scheduleOnce(() => {
                this.close(true)
                resolve()
            }, 3)

        })
    }

    // update (dt) {}
}
