import HeroData from "./HeroData";

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
export class RewardBox {
    heros: number[] = []
    cards: number[] = []
    coin: number = 0
    nkey: number = 0
    opentimeInv: number = 0
    gettime: number = 0
    level: number = 0
    id: string = ""
    speedTimes: number = 0
    exLevel: number = -1
    unlock: boolean = false
}


@ccclass
export default class PlayerData {

    maxHp: number = 100

    hp: number = this.maxHp

    nickname: string = ""

    useHero: number[] = []

    heros: HeroData[] = []

    shield: number = 0

    coin: number = 0

    gold: number = 0

    face: string = ""

    key: number = 0

    boxs: RewardBox[] = []

    score: number = 0

    guideStep: number = 0

    stepReceive: number = 0

    // onLoad () {}
    start() {

    }

    // update (dt) {}
}
