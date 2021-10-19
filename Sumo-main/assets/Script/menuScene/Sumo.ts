
import { _decorator, Component, Node, systemEvent, SystemEvent, log } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Sumo
 * DateTime = Sun Sep 26 2021 01:21:34 GMT+0530 (India Standard Time)
 * Author = shashankA
 * FileBasename = Sumo.ts
 * FileBasenameNoExtension = Sumo
 * URL = db://assets/Script/Sumo.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

@ccclass('Sumo')
export class Sumo extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    start(){

        // systemEvent.on(SystemEvent.EventType.TOUCH_START, this.touchStart, this);
        // systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.touchMove, this);
    }

    touchStart(touch: Touch){
        log
    }

    getSumoNode() {
        return this.node;
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
