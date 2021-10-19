
/**
 * Zy.
 * 2020-08-20.
 * 游戏地图.
 */

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameMap')
export class GameMap extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({ type: [Node], tooltip: "路径点." })
    path: Node[] = [];

    public maxProgress = 2;

    start() {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
