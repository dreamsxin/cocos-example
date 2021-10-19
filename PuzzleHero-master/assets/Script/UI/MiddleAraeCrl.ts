// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiddleAraeCrl extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    curShowidx: number = -1

    curNode: cc.Node = null
    nextNode: cc.Node = null


    doShowIdxNode(idx: number, ins: boolean = false) {
        if (idx == this.curShowidx) {
            return
        }
        if (this.curNode != null && this.nextNode != null) {
            this.nextNode.stopAllActions()
            this.curNode.stopAllActions()
            this.nextNode.position = cc.Vec2.ZERO
            this.curNode.active = false
            this.nextNode = null
            this.curNode = null
        }
      
        this.curNode = this.node.children[this.curShowidx]
        this.nextNode = this.node.children[idx]


        for (let i = 0; i < this.node.children.length; i++) {
            if (i == this.curShowidx) {
                this.node.children[i].active = true
            } else {
                this.node.children[i].active = false
            }
        }

        if (this.curNode != null) {
            let act1 = cc.moveTo(0.2, cc.v2((idx > this.curShowidx ? -640 : 640), 0))
            this.curNode.runAction(act1)
            let cid = this.curShowidx
            this.nextNode.active = true
            this.scheduleOnce(() => {
                this.nextNode.x = idx > cid ? 640 : -640
                let act2 = cc.moveTo(0.2, cc.v2(0, 0)).easing(cc.easeBackOut())
                let done = cc.callFunc(() => {
                    this.curNode = null
                    this.nextNode = null
                })
                this.nextNode.runAction(cc.sequence(act2, done))
            }, 0.01)
        } else {
            this.nextNode.active = true
        }
        this.curShowidx = idx
    }

    start() {

    }

    // update (dt) {}
}
