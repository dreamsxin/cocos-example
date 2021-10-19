// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Comet from "./Comet";
import Constants from "./Constants";
import CustomEventListener from "./CustomEventListener";
import SpaceMap from "./map";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CometManager extends cc.Component {

    @property([cc.Node])
    comets = null

    @property
    intervalTime = 0

    private _starPoints = []
    onLoad () {
        CustomEventListener.on(Constants.EventName.GAME_START, this.gameStart, this)
        CustomEventListener.on(Constants.EventName.GAME_LOSE, this.gameEnd, this)
        CustomEventListener.on(Constants.EventName.GAME_OVER, this.gameEnd, this)
        CustomEventListener.on(Constants.EventName.GAME_PAUSE, this.gameEnd, this)
    }

    gameStart() {
        this.schedule(this.updateComet, this.intervalTime, cc.macro.REPEAT_FOREVER, 0)
    }

    gameEnd() {
        this.unschedule(this.updateComet)
    }

    onDestroy() {
        CustomEventListener.off(Constants.EventName.GAME_START, this.gameStart, this)
    }

    private _pool = []
    updateComet() {
        
    }
}
