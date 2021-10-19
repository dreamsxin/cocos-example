
/**
 * Zy.
 * 2020-08-20.
 * 地图管理.
 */

import { _decorator, Component, Node } from 'cc';
import { GameMap } from './GameMap';
const { ccclass, property } = _decorator;

@ccclass('MapManager')
export class MapManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    public currentPath: Node[] = [];
    public maxProgress = 0;

    start() {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public resetMap() {
        const currentMap = this.node.children[0].getComponent(GameMap);
        this.currentPath = currentMap.path;
        this.maxProgress = currentMap.maxProgress;
    }
}
