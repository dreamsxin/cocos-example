import Constants from "./Constants";
import CustomEventListener from "./CustomEventListener";
import GameData from "./Data/GameData";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameScene from "./gameScene";
import Target from "./target";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResultUI extends cc.Component {

    @property(cc.Label)
    resultLabel = null

    @property(cc.Button)
    nextButton = null
    @property(cc.Button)
    backButton = null

    private _level = 0

    hide () {
        this.node.active = false
    }

    nextButtonPressed() {
        this.hide()
        cc.sys.localStorage.setItem('selectedStage', this._level+1)
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_RESET)
    }

    show (result: number = 0, targets: number = 0, useTime: number = 0) {
        this.node.active = true
        this.resultLabel.string = result==0?'PAUSE':(result==1?'MISSION COMPLETE':'MISSION FAILED')
        this.backButton.node.active = false
        this.nextButton.node.active= false
        if (result === 0) {
            this.backButton.node.active = true
        }
        if (result===1)  {
            this._level = parseInt(cc.sys.localStorage.getItem('selectedStage'))
            if (this._level+1 <= GameData.maxLevel) {
                this.nextButton.node.active = true
            }
            let star = parseInt(cc.sys.localStorage.getItem('levelTargetNum'+this._level)) || 0
            if (star < targets) {
                cc.sys.localStorage.setItem('levelTargetNum'+this._level, targets)
            }
            let finished = parseInt(cc.sys.localStorage.getItem('finishStageNum')) || 1
            if (finished<this._level+1)
                cc.sys.localStorage.setItem('finishStageNum', this._level+1)
        }
    }

    returnButtonPressed() {
        this.hide()
        cc.director.preloadScene('selectScene', ()=>{
            cc.director.loadScene('selectScene')
        })
    }

    backButtonPressed() {
        this.hide()
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START)
    }

    resetButtonPressed() {
        this.hide()
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_PAUSE)
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_RESET)
    }
}
