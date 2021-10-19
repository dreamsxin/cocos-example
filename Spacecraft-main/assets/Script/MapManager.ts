// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import SpaceMap from "./map";
import Ship from "./Ship";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapManager extends cc.Component {

    @property([cc.Prefab])
    maps = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public currMapNode: cc.Node = null
    public currMap: SpaceMap = null

    loadMap(stage: number) {
        if (this.currMapNode) {
            this.currMapNode.removeFromParent()
            this.currMapNode = null
        }
        this.currMapNode = cc.instantiate(this.maps[stage])
        this.currMapNode.parent = this.node
        this.currMap = this.currMapNode.getComponent(SpaceMap)
    }

    setShipStartPos(ship:cc.Node) {
        ship.position = this.currMap.startNode.position
        ship.angle = this.currMap.startNode.angle
        ship.getComponent(Ship).speed = this.currMap.startSpeed
        // cc.follow(ship, cc.rect(0,0,1280, 960))
        // this.node.runAction(cc.follow(ship, cc.rect(0, 0,1280, 960)))
    }
    // update (dt) {}
}
