import Constants from "./Constants";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CustomEventListener from "./CustomEventListener";
import GameScene from "./gameScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PauseUI extends cc.Component {

    @property(cc.Button)
    backButton:cc.Button = null

    @property(cc.Button)
    resetButton:cc.Button = null

    @property(cc.Button)
    returnButton:cc.Button = null
    // LIFE-CYCLE CALLBACKS:

    private _scene: GameScene= null
    setScene(s: GameScene) {
        this._scene = s
    }

    hide () {
        this.node.active = false
    }

    backButtonPressed() {
        this.hide()
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START)
    }

    show () {
        this.node.active = true
    }

    returnButtonPressed() {
        this.hide()
        cc.director.preloadScene('selectScene', ()=>{
            cc.director.loadScene('selectScene')
        })
    }

    resetButtonPressed() {
        this.hide()
        this._scene.resetGame()
    }
}
