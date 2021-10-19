// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CSBase from "./CSBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CSTween extends CSBase {

    @property
    From: cc.Vec2 = cc.Vec2.ZERO;

    @property
    TO: cc.Vec2 = cc.Vec2.ZERO;

    @property
    ForceFrom: boolean = false;

}
