// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Constants from "./Constants";
import CustomEventListener from "./CustomEventListener";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Comet extends cc.Component {


    @property(cc.Vec2)
    speed = cc.v2(0, 0)
    // LIFE-CYCLE CALLBACKS:

    public playing = false
    public finishCallBack: Function = null
    start () {
        CustomEventListener.on(Constants.EventName.GAME_START, this.gameStart, this)
        CustomEventListener.on(Constants.EventName.GAME_PAUSE, this.gamePause, this)
    }
    onDestroy () {
        CustomEventListener.on(Constants.EventName.GAME_START, this.gameStart, this)
        CustomEventListener.on(Constants.EventName.GAME_PAUSE, this.gamePause, this)
        if (this.finishCallBack) {
            this.finishCallBack()
        }
    }

    gameStart() {
        this.playing = true
    }
    gamePause() {
        this.playing = false
    }
    update (dt) {
        if(this.playing && this.speed.mag()!=0){
            let distance = this.speed.mul(dt)
            let pos = this.node.position
            pos.x += distance.x
            pos.y += distance.y
            this.node.position = pos
        }
    }


}
