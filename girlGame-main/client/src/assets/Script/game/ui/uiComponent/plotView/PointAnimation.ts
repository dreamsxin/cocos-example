// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {uiUtils} from "../../../../util/UIUtils";
import {utils} from "../../../../util/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PointAnimation extends cc.Component {



    start() {
        // this.playAnimation();


    }

    playAnimation() {
        for (var i in this.node.children) {
            var call = cc.callFunc(()=>{
                this.node.children[i].opacity = 255;
                this.node.children[i].position.x = -10+(10*parseInt(i));
            })
            var action1 = cc.delayTime(parseInt(i) * 0.5);
            var action2 = cc.moveTo(0.25, cc.v2(25, 5));
            var action3 = cc.fadeOut(0.25);
            var action4 = cc.delayTime((this.node.childrenCount - parseInt(i) - 1) * 0.5);
            this.node.children[i].runAction(cc.repeatForever(cc.sequence(call,action1, action2, action3, action4)));
        }

    }
    // update (dt) {}
}
