import PlayerOpt from "./PlayerOptCrl";
import TerritoryCrl from "./TerritoryCrl";
import StaticData from "../StaticData";
import Utility from "../Lib/Utility";
import AIEnemyCrl from "./AIEnemyCrl";
import PlayerData from "../Mod/PlayerData";
import GameSceneUI from "../UI/GameSceneUI";
import EventString from "../EventString";
import WXApi from "../Lib/WXApi";
import GameData from "../GameData";
import BaseX from "../Lib/Base64";
import TerritoyTeachBaseCrl from "./TerritoyTeachBaseCrl";
import GamelogicBase from "./GameLogicBase";
import TerritoryPVPCrl from "./TerritoryPVPCrl";
import NetProecssCrl from "./Net/NetProcessCrl";
import SoundMgr from "../Lib/SoundMgr";
import GameSceneCrl from "./GameSceneCrl";

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
export default class GameLogicCrl extends GamelogicBase {

    public static Share: GameLogicCrl



    initPlayerFaceData() {
        if (StaticData.PlayerInfo.face != null) {
            try {
                this.playerData[0].face = StaticData.PlayerInfo.face
                this.playerData[0].nickname = StaticData.PlayerInfo.nickname
            } catch (e) {
                console.log("err err err err ", e)
            }
        }
    }

    setupTeachCrl() {
        return new Promise(async (resolve, reject) => {
            this.territoryCrl = this.node.addComponent(TerritoyTeachBaseCrl)
            await this.territoryCrl["startTeach"]()
            resolve()
        })

    }

    setupPvAICrl() {
        this.territoryCrl = this.node.addComponent(TerritoryCrl)

    }

    setupPvpCrl() {
        return new Promise(async (resolve, reject) => {
            this.territoryCrl = this.node.addComponent(TerritoryPVPCrl)
            let roundata = await NetProecssCrl.Share.handleSyncSeedAround()
            resolve(roundata)
        })

    }


    initTeachData() {
        this.aiEnemyCrl = this.node.addComponent(AIEnemyCrl)
        let tempherodata = JSON.parse(JSON.stringify(GameData.Share.CharacterConfig))
        this.playerData[0].heros = tempherodata.filter(hero => {
            hero.atk = 1
            if (hero.type == 3)
                return hero.sb == 1
            else
                return hero.sb == 0
        })
        this.playerData[1].heros = tempherodata.filter(hero => {
            hero.atk = 1
            return hero.sb == 1
        })
        this.playerData[0].heros = this.playerData[0].heros.sort((n1, n2) => n1.type - n2.type)
        this.playerData[1].heros = this.playerData[1].heros.sort((n1, n2) => n1.type - n2.type)
        this.playerData[0].hp = 30
        this.playerData[1].hp = 15
        this.playerData[0].maxHp = this.playerData[0].hp
        this.playerData[1].maxHp = this.playerData[1].hp
        this.playerData[1].nickname = "阿萨辛"
        this.roundPlayer = 1
        this.gameSceneUI.updateUserInfo(this.playerData)
    }

    initOpponentAINpc() {
        return new Promise(async (resolve, reerr) => {
            this.aiEnemyCrl = this.node.addComponent(AIEnemyCrl)
            this.playerData[1].heros = this.aiEnemyCrl.configHero(this.playerData[0].heros)
            let aatck = 0
            this.playerData[1].heros.forEach(h => aatck += h.atk)
            //nhero.level + (3 * nhero.quality)
            // this.playerData[1].hp = (aatck - 4) * 2 + 30
            // this.playerData[1].maxHp = this.playerData[1].hp
            //** end */

            /* */
            // let pInfo: any = StaticData.PlayerInfo
            // let baseLV: number = pInfo.baseField.level
            // let dw: number = GameData.Share.getRankConfigByScore(StaticData.PlayerInfo.score).lv
            // if (dw <= 2) {
            //     baseLV = baseLV - 1 < 1 ? 1 : baseLV - 1
            // } else if (dw <= 4) {

            // } else {
            //     let dt = Utility.GetRandom(0, 1, true)
            //     baseLV = baseLV + dt > 13 ? 13 : baseLV + dt
            // }
            // let hpNum: number = Number(GameData.Share.getBasementConfig(baseLV).hp)
            // this.playerData[1].hp = hpNum
            /* */

            let sLv: number = StaticData.StageLevel
            let bgConfig: any = GameData.Share.getBattleGroundByGrade(sLv)
            let bArr: any[] = bgConfig.enemyHP
            let pInfo: any = StaticData.PlayerInfo
            let baseLV: number = pInfo.baseField.level
            baseLV = baseLV + bArr[Utility.GetRandom(0, bArr.length - 1)] < 1 ? 1 : baseLV + bArr[Utility.GetRandom(0, bArr.length - 1)]
            let hpNum: number = Number(GameData.Share.getBasementConfig(baseLV).hp)
            this.playerData[1].hp = hpNum
            if (StaticData.startFromArena) {
                let pInfo: any = StaticData.PlayerInfo
                let arenaData: any = pInfo.arenaData
                this.playerData[1].hp = arenaData.baseHp
            }
            this.playerData[1].maxHp = this.playerData[1].hp
            //let rs = await WXApi.HttpPost("/fangkuaiWx/getOtherUserInfo", {})
            let rs = StaticData.otherUserInfo
            if (rs.errcode == 200) {
                if (rs.nickname != "" && rs.nickname != null && rs.nickname != undefined) {
                    this.playerData[1].nickname = new BaseX().decode(rs.nickname)
                    this.playerData[1].face = rs.face
                    this.gameSceneUI.updateUserInfo(this.playerData)
                }
            }
            // if (!StaticData.Teaching) {
            this.roundPlayer = Utility.GetRandom(0, 1)
            //}
            resolve()
        })
    }


    initPlayerData() {
        this.playerData[0].heros = StaticData.PlayerInfo.heros.filter(hero => {
            return hero.use == true
        })
        this.playerData[0].heros = this.playerData[0].heros.sort((n1, n2) => {
            return n1.type - n2.type
        })
        this.playerData[0].hp = StaticData.PlayerInfo.hp
        this.playerData[0].maxHp = StaticData.PlayerInfo.hp

        //设置竞技场属性
        if (StaticData.startFromArena) {
            let pInfo: any = StaticData.PlayerInfo
            let arenaData: any = pInfo.arenaData
            for (let i = 0; i < 4; i++) {
                let id: number = arenaData.currentArr[i]
                this.playerData[0].heros[i] = GameData.Share.getHeroDataById(id)
                this.playerData[0].heros[i].atk = arenaData.heroAtkArr[i]
            }
            this.playerData[0].hp = arenaData.baseHp
            this.playerData[0].maxHp = arenaData.baseHp
        }
        //好友对战
        else if (StaticData.startFromShareGame) {
            this.playerData[0].heros.forEach((h) => {
                h.atk = 3
            })
            this.playerData[0].hp = 90
            this.playerData[0].maxHp = 90
        }
    }



    onLoad() {
        GameLogicCrl.Share = this
        this.playerData = [new PlayerData(), new PlayerData()]
        this.initPlayerFaceData()
        this.gameSceneUI = cc.find("Canvas").getComponentInChildren(GameSceneUI)
        this.gamePanel = this.node.parent.getChildByName("PlayerPanel")
        this.gameSceneUI.face.forEach(n => {
            let tranp = n.convertToWorldSpaceAR(cc.Vec2.ZERO)
            tranp = this.gamePanel.convertToNodeSpaceAR(tranp)
            this.basePoint.push(tranp)
        })
        this.playerOpt = this.node.addComponent(PlayerOpt)
        this.playerOpt.optNode = this.gamePanel
        this.node.on(EventString.AttackEvent, this.handleAttackEvent.bind(this))
        this.node.on(EventString.HealingEvent, this.handleHealingEvent.bind(this))
        this.node.on(EventString.ShieldEvent, this.handleShieldEvent.bind(this))
    }

    showSKillTips(index: number) {
        this.gameSceneUI.showSkillTips(this.blockMats[index])
    }
    hideSKillTips() {
        this.gameSceneUI.hideSkillTips()
    }

    showAtkCount(atk: number) {
        this.gameSceneUI.showAtkCount(atk)
    }
    hideAtkCount() {
        this.gameSceneUI.hideAtkCount()
    }

    handleAttackEvent(event) {
        let data = event.getUserData()
        let isEmeny = this.roundPlayer == 0 ? false : true
        let costHp = data[0]
        let isSkill = data[1]
        if (this.playerData[isEmeny ? 0 : 1].shield > 0) {
            return
        }
        this.playerData[isEmeny ? 0 : 1].hp -= costHp

        //屏幕抖动
        if (costHp > this.playerData[isEmeny ? 0 : 1].maxHp * 0.1)
            this.gameSceneUI.bgNode.getComponent(cc.Animation).play()

        if (isEmeny) {
            WXApi.DoVibrate(true)
        }
        //this.playerData[1].hp = 0
        if (this.playerData[isEmeny ? 0 : 1].hp <= 0) {
            //this.playerData[isEmeny ? 0 : 1].hp = 0
            this.isWin = isEmeny ? false : true
            StaticData.GameOver = true
        }

        this.gameSceneUI.updateHp(this.playerData)
        if (isSkill) {
            this.gameSceneUI.showGetSkill(0, isEmeny ? 0 : 1)
        }
        if (data.length > 2) {
            this.playSkillSound(data[2][0], data[2][1])
        }
    }

    handleHealingEvent(event) {
        let data = event.getUserData()
        let hp = data[0]
        this.playerData[this.roundPlayer].hp += hp
        this.gameSceneUI.updateHp(this.playerData)
        this.gameSceneUI.showGetSkill(1, this.roundPlayer)
        if (data.length > 1) {
            this.playSkillSound(data[1][0], data[1][1])
        }
    }

    handleShieldEvent(event) {
        this.playerData[this.roundPlayer].shield = 2
        cc.log("get a shield")
        this.gameSceneUI.showGetSkill(2, this.roundPlayer)

    }

    playSkillSound(type: number, sb: number) {
        let ss = GameData.Share.getHeroDataByTypeSB(type, sb).ss
        SoundMgr.Share.PlaySound(ss)
    }
}
