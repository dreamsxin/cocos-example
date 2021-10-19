// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CAudio from "../../common/CAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeSelectLevelItem extends cc.Component {

    @property(cc.Label)
    text: cc.Label = null;


    @property(cc.Node)
    coin: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:


    onLoad() {
      
    }

    start() {

    }
}
