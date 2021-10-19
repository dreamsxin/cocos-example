import StaticData from "../StaticData";
import GameData from "../GameData";
import HeroData from "./HeroData";
import { RewardBox } from "./PlayerData";
import BaseX from "../Lib/Base64";
import WXApi from "../Lib/WXApi";

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
export default class PlayerDataCrl {

    public static UpdateHeroBox(boxd: any) {
        StaticData.PlayerInfo.boxs.forEach(box => {
            if (box.id == boxd.boxSign) {
                box.id = boxd.boxSign
                box.coin = boxd.coin
                box.cards = boxd.card
                box.heros = boxd.hero
                box.opentimeInv = Number(boxd.opentime)
                box.gettime = Number(boxd.addTime)
                box.nkey = Number(boxd.key)
                box.level = Number(boxd.level)
                box.speedTimes = Number(boxd.speedTimes)
            }
        })
    }

    public static UpdateHeroInfo(data: any) {
        // let pinfo: any = data[0]
        // let hinfo: any[] = data[1]
        // let binfo: any[] = data[2]
        // let ithero: number[] = JSON.parse(pinfo.current_hero)
        // let ohero: number[] = JSON.parse(pinfo.heros)
        // let lhero: number[] = JSON.parse(pinfo.hlevel)
        //cc.log("get net", JSON.stringify(data))
        let pinfo: any = data
        let binfo: any[] = data.box
        let userthero: any[] = data.currentHero
        let ohero: any = data.heros
        console.log('data:', JSON.stringify(ohero));
        StaticData.PlayerInfo = pinfo
        StaticData.PlayerInfo.guideStep = pinfo.step
        StaticData.PlayerInfo.stepReceive = pinfo.stepReceive
        WXApi.sign = pinfo.sign
        console.log('pinfo:', pinfo);
        if (StaticData.PlayerInfo.nickname != null) {
            StaticData.PlayerInfo.nickname = new BaseX().decode(StaticData.PlayerInfo.nickname)
        }
        StaticData.PlayerInfo.useHero = userthero
        let hp = 0
        let aatck = 0
        StaticData.PlayerInfo.heros = []
        StaticData.PlayerInfo.heros.length = 0
        let allhero = GameData.Share.CharacterConfig
        cc.log("cur use hero", StaticData.PlayerInfo.useHero, userthero)
        allhero.forEach(hdata => {
            let nhero = new HeroData()
            nhero = JSON.parse(JSON.stringify(hdata))
            let hasheroinfo = ohero[hdata.id.toString()]
            if (hasheroinfo != null && hasheroinfo != undefined && hasheroinfo.state == 1) {
                nhero.has = true
            }
            //let idx = ohero.indexOf(data.id)

            nhero.nextCards = 0
            nhero.nextCoin = 0
            if (nhero.has) {
                nhero.level = hasheroinfo.level
                //let tempAtk = nhero.level + (3 * nhero.quality)
                //nhero.nextCards = nhero.level * (nhero.level + 0)
                //nhero.nextCoin = nhero.level * 5 * (nhero.quality * nhero.level + 1)
                //nhero.nextCoin = tempAtk * 10 * (nhero.quality * tempAtk + 1)
                let lvlExpData: any = GameData.Share.getLvlExpData(nhero.level + 1, nhero.quality);
                nhero.nextCoin = lvlExpData.coin;
                nhero.nextCards = lvlExpData.card

                if (userthero.indexOf(nhero.id) > -1) {
                    nhero.use = true
                    cc.log("is use hero")
                }
            } else {
                nhero.ulockC = nhero.quality + 2
                nhero.level = 1
            }
            nhero.curCards = 0


            //判断id是否在集合内
            let hf = ohero[hdata.id.toString()]
            if (hf) {
                nhero.curCards = hf.count;
            }

            // hinfo.forEach(info => {
            //     if (info.hid == data.id) {
            //         nhero.curCards = info.count
            //     }
            // })

            let lvlExpData: any = GameData.Share.getLvlExpData(nhero.level, nhero.quality);
            //nhero.atk = nhero.level + (3 * nhero.quality)
            nhero.atk = lvlExpData.power;
            if (nhero.use) {
                aatck += nhero.atk
            }
            StaticData.PlayerInfo.heros.push(nhero)
        })

        //hp = (aatck - 4) * 8 + 30
        if (pinfo.baseField.blood) {
            hp = pinfo.baseField.blood;
        } else {
            hp = 30
        }

        StaticData.PlayerInfo.hp = hp
        StaticData.PlayerInfo.maxHp = hp
        if (binfo != null) {
            StaticData.PlayerInfo.boxs = []
            StaticData.PlayerInfo.boxs.length = 0
            console.log('binfo:', binfo);
            binfo.forEach(boxd => {
                let box = new RewardBox()
                box.id = boxd.boxSign
                box.coin = boxd.coin
                // box.cards = JSON.parse(boxd.card)
                // box.heros = JSON.parse(boxd.hero)
                box.cards = boxd.card
                box.heros = boxd.hero
                box.opentimeInv = Number(boxd.opentime)
                box.gettime = Number(boxd.addTime)
                box.nkey = Number(boxd.key)
                box.level = Number(boxd.level)
                box.speedTimes = Number(boxd.speedTimes)
                box.unlock = Boolean(boxd.unlock)
                StaticData.PlayerInfo.boxs.push(box)
            })
        }
    }

    //统计任务
    public static updateTask(id: number, value: number = 1) {
        let pInfo: any = StaticData.PlayerInfo;
        for (var i = 0; i < 3; i++) {
            let index = pInfo.task.task[i].id;
            if (index == id && pInfo.task.task[i].count < pInfo.task.task[i].upCount) {
                pInfo.task.task[i].count += value;

                WXApi.HttpPost('/fangkuaiWx/updateTask', pInfo.task);
                break;
            }
        }
    }

    //统计成就
    public static updateAchievement(arr: any[]) {
        WXApi.HttpPost('/fangkuaiWx/updateAchievement', { indexMap: arr })
    }
    public static updateRankAchieve() {
        let arr: any[] = []
        let pInfo: any = StaticData.PlayerInfo;
        if (pInfo.score >= 1) arr.push({ index: 24, value: 1 })
        if (pInfo.score >= 7) arr.push({ index: 25, value: 1 })
        if (pInfo.score >= 16) arr.push({ index: 26, value: 1 })
        if (pInfo.score >= 28) arr.push({ index: 27, value: 1 })
        if (pInfo.score >= 48) arr.push({ index: 28, value: 1 })
        if (pInfo.score >= 74) arr.push({ index: 29, value: 1 })
        if (pInfo.score >= 99) arr.push({ index: 30, value: 1 })
        this.updateAchievement(arr)
    }
    //统计英雄存活成就
    public static updateHAlive(count: number) {
        let arr: any[] = []
        arr.push({ index: 12, value: count })
        arr.push({ index: 13, value: count })
        arr.push({ index: 14, value: count })
        this.updateAchievement(arr)
    }

    start() {

    }
}
