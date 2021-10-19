// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Comet from "./Comet";
import Ship from "./Ship";
import Target from "./target";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SpaceMap extends cc.Component {

    @property(cc.Node)
    startNode = null

    @property(cc.Node)
    endNode = null

    @property(cc.Vec2)
    startSpeed = cc.v2()

    @property([cc.Node])
    targetNodes = []
    // LIFE-CYCLE CALLBACKS:
    @property([cc.Node])
    stars = []
    // LIFE-CYCLE CALLBACKS:

    @property([cc.Node])
    comets = []

    // onLoad () {}
    private _targetIndex = 0

    onLoad() {
        this._targetIndex = 0
        this.showTarget()
    }


    start () {
        this.startNode.zIndex = 101
    }

    reset() {
        this._targetIndex = 0
    }


    showTarget() {
        for (let i = 0; i < this.targetNodes.length; i++) {
            this.targetNodes[i].active = true
            const target = this.targetNodes[i].getComponent(Target)
            target.selected()
        }
    }

    targetAchieve(node: cc.Node) {
        if(this.targetNodes.indexOf(node)>=0){
            node.active = false
        }
    }

    EndAchieve(){
        if (this.endNode && this.endNode.active)
            this.endNode.color = cc.Color.GREEN
    }
    // update (dt) {}
}
