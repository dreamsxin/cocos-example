import GameLogicCrl from "./GameLogicCrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";
import PlayerData from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import MatchUI from "../UI/MatchUI";
import Logger from "../LoggerCrl";
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
export default class GameSceneCrl extends cc.Component {

    public static Share: GameSceneCrl

    gameLogicCrl: GameLogicCrl = null

    opponentData: PlayerData = null

    setupOpponentData(data: any) {
        this.opponentData = new PlayerData()
        this.opponentData.nickname = data.nickname
        this.opponentData.face = data.face
        this.opponentData.heros = data.heros
        this.opponentData.hp = data.hp
        this.opponentData.maxHp = data.hp
        if (StaticData.startFromArena) {
            console.log("setupOpponentData:", data)
            let arenaData: any = data.arenaData
            for (let i = 0; i < 4; i++) {
                let id: number = arenaData.currentArr[i]
                this.opponentData.heros[i] = GameData.Share.getHeroDataById(id)
                this.opponentData.heros[i].atk = arenaData.heroAtkArr[i]
            }
            this.opponentData.hp = arenaData.baseHp
            this.opponentData.maxHp = arenaData.baseHp
        }
    }


    start() {
        GameSceneCrl.Share = this
        this.handleStartLogic()
        cc.log("gamescene start")
    }

    async handleStartLogic() {
        Logger.record(8)
        //random seed :1563340279874

        this.gameLogicCrl = this.node.addComponent(GameLogicCrl)
        // if (WXApi.GetStorage("tur") == "1") {
        //     StaticData.Teaching = false
        // } else {
        //     WXApi.SetStorage("tur", "1")
        //     StaticData.StageLevel = 1
        // }
        if (StaticData.PlayerInfo.guideStep >= 3) {
            StaticData.Teaching = false
        } else {
            StaticData.StageLevel = 1
        }
        let seed = new Date().getTime()
        this.gameLogicCrl.randomSeed = seed

        this.gameLogicCrl.initPlayerData()
        if (StaticData.Teaching) {
            cc.find('Canvas').getChildByName('GameSecenUI').getChildByName('giveUp').active = false

            this.gameLogicCrl.initTeachData()
            await this.gameLogicCrl.setupTeachCrl()
            await this.gameLogicCrl.readyToStart()
        } else {
            WXApi.HttpPost('/fangkuaiWx/gamePlay', {})

            if (this.opponentData == null) {
                // ai mode
                await this.gameLogicCrl.initOpponentAINpc()
                this.gameLogicCrl.setupPvAICrl()
            } else {
                // pvp mode
                this.gameLogicCrl.playerData[1] = this.opponentData
                let aroundseed: any = await this.gameLogicCrl.setupPvpCrl()
                this.gameLogicCrl.roundPlayer = aroundseed.around
                this.gameLogicCrl.randomSeed = aroundseed.seed
            }
            cc.log("global seed:", this.gameLogicCrl.randomSeed)
            //let matchUI = (await UIMgr.Share.showUI("MatchingUI") as MatchUI)
            //await matchUI.doShow()
            await this.gameLogicCrl.readyToStart()

        }



    }

}
