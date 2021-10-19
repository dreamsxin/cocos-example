import UICrl from "../Lib/UI/UICrl";
import HeroData from "../Mod/HeroData";
import SoundMgr from "../Lib/SoundMgr";
import GameData from "../GameData";
import StaticData from "../StaticData";
import PlayerData from "../Mod/PlayerData";
import UIMgr from "../Lib/UI/UIMgr";
import GameMenuUI from "./GameMenuUI";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ResultAUI extends UICrl {
    @property([cc.Node])
    rsNode: cc.Node[] = []

    @property([cc.Label])
    playeNames: cc.Label[] = []

    @property([cc.Node])
    heroNodes: cc.Node[] = []

    @property(cc.Node)
    okBtn: cc.Node = null


    start() {

    }

    onEnable() {

    }

    async showResult(iswin: boolean, playerdata: PlayerData[]) {
        StaticData.GameStart = false
        this.okBtn.active = false
        cc.director.preloadScene("GameMenu", () => { }, () => {
            this.okBtn.active = true
        })

        if (iswin) {
            this.rsNode[0].active = true
            this.rsNode[1].active = false
            SoundMgr.Share.PlaySound("Victory")
        } else {
            this.rsNode[0].active = false
            this.rsNode[1].active = true
            SoundMgr.Share.PlaySound("Defeat")
        }

        let type: number = iswin ? 1 : 0
        await WXApi.HttpPost("/fangkuaiWx/battleGameOver", { type: type })
        let pi = await WXApi.HttpPost('/fangkuaiWx/getUserMsg', {})
        if (pi.errcode == 200) {
            PlayerDataCrl.UpdateHeroInfo(pi)
        }

        this.playeNames[0].string = playerdata[0].nickname
        this.playeNames[1].string = playerdata[1].nickname
        let heros: HeroData[] = [].concat(playerdata[0].heros).concat(playerdata[1].heros)

        for (let i = 0; i < heros.length; i++) {
            cc.loader.loadRes("character/avatar/H" + heros[i].id, (err, res) => {
                let hobj: cc.Node = cc.instantiate(res)
                hobj.getChildByName('full').active = false
                this.heroNodes[i].getChildByName("herohere").removeAllChildren()
                this.heroNodes[i].getChildByName("herohere").addChild(hobj)
            })
        }
    }

    closeCB() {
        StaticData.GameOver = false

        cc.director.loadScene("GameMenu", async () => {
            if (StaticData.startFromShareGame) {
                WXApi.room_id = StaticData.tempRoomid
            }
            this.close(true)
            let mc: GameMenuUI = await UIMgr.Share.showUI("MainUI") as GameMenuUI
            if (StaticData.startFromArena)
                mc.bottomMenuCrl.selectBottomIdx(3, true)
            StaticData.startFromArena = false
            StaticData.startFromShareGame = false
        })
    }

    // update (dt) {}
}
