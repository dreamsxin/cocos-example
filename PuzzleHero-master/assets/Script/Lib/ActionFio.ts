import Utility from "./Utility";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActionAdv {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start() {
    //     let act1 = cc.fadeIn(0.5)
    //     let act2 = cc.fadeOut(0.5)

    //     let seq = cc.sequence(act1, act2)
    //     this.node.runAction(cc.repeatForever(seq))
    // }

    // update (dt) {}


    public static Shock(node: cc.Node) {
        let sp = node.position
        let acts: any[] = []

        for (let i = 0; i < 30; i++) {
            acts.push(cc.moveBy(0.05,Utility.GetRandomNeg(0, 10), Utility.GetRandomNeg(0, 10)))
        }
        acts.push(cc.moveTo(0.02, sp))
        let seq = cc.sequence(acts)
        node.runAction(seq)
    }
}
