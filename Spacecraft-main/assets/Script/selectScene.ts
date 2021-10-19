// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameData from "./Data/GameData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectScene extends cc.Component {

    @property(cc.Node)
    selectLayer = null

    @property(cc.Prefab)
    levelButtonPrefab = null
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        for (let i = 0; i < GameData.maxLevel; i++) {
            const node = cc.instantiate(this.levelButtonPrefab)
            node.setParent(this.selectLayer)
            let js = node.getComponent('selectItem')
            js.setParameter(i+1)
        }
    }


    start () {
    }

    backButtonPressed() {
        cc.director.preloadScene('startScene', ()=>{
            cc.director.loadScene('startScene')
        })
    }
    // update (dt) {}
}
