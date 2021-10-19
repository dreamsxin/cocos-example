// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Comet from "./Comet";
import Ship from "./Ship";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Target extends Comet {

    @property
    mass = -1

    @property
    distance = -1


    onLoad() {
    }


    public selected(s: boolean = false) {
        this.node.color = s ? cc.Color.GREEN: cc.Color.YELLOW
    }

    public checkTarget(s:Ship) {

    }

    update (dt) {
        super.update(dt)
    }
}
