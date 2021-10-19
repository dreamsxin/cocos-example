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
export default class HeroData {
    id: number
    name: string
    type: number
    atk: number
    quality: number
    level: number
    use: boolean = false
    has: boolean
    nextCards: number = 0
    nextCoin: number = 0
    curCards: number = 0
    sn: string = ""
    d1: string = ""
    d2: string = ""
    ulockC: number = 0
    gs: string = ""
    ss: string = ""
    hs: string = ""
    sb: number = 0
    ds: string[] = []
}
