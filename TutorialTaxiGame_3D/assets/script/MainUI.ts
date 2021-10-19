
/**
 * Zy.
 * 2020-09-01.
 * 主页UI.
 */

import { _decorator, Component, Node } from 'cc';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public show(...args: any[]) {

    }

    public hide() {
        
    }

    public onClickedStart() {
        CustomEventListener.emit(Constants.EventName.GAME_START);
    }

}
