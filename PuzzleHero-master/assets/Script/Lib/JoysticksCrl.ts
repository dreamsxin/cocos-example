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
export default class JoysticksCrl extends cc.Component {

    @property(cc.Node)
    stickbg: cc.Node = null

    @property(cc.Node)
    sticks: cc.Node = null

    centerPos: cc.Vec2

    endPos: cc.Vec2

    maxRadius: number

    outData: (v: cc.Vec2, ag: number) => void

    stopData: () => void

    keyDownFun: (event: any) => void

    keepOut: boolean = false

    touchOn: boolean = false

    onLoad() {
        if (this.stickbg != null) {
            this.maxRadius = this.stickbg.width / 2
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.handleTStart.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.handleTMove.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_END, this.handleTEnd.bind(this))
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.handleTEnd.bind(this))
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.handleKeyDown.bind(this))

    }

    inputCenter(pos: cc.Vec2) {
        this.centerPos = pos
        this.stickbg.position = this.stickbg.getParent().convertToNodeSpaceAR(pos)
        if (this.sticks != null) {
            this.sticks.position = cc.Vec2.ZERO
        }
    }

    inputData(pos: cc.Vec2) {
        this.touchOn = true
        let dispos = pos.sub(this.centerPos)
        if (this.sticks != null) {
            this.sticks.position = dispos.mag() > this.maxRadius ?
                dispos.normalize().mul(this.maxRadius) : dispos
        }
        if (this.outData != null) {
            this.outData(dispos.normalize(), Utility.Get2PToDeg(this.centerPos, pos))
        }
    }



    private handleTStart(event) {
        if (this.stickbg != null) {
            this.stickbg.active = true
        }
        this.inputCenter(event.getLocation())
    }

    private handleTMove(event) {
        this.touchOn = true
        this.endPos = event.getLocation()
    }


    private handleTEnd(event) {
        this.touchOn = false
        if (this.stopData != null) {
            this.stopData()
        }
        if (this.stickbg != null) {
            this.stickbg.active = false
        }
    }

    private handleKeyDown(event) {
        if (this.keyDownFun != null) {
            this.keyDownFun(event)
        }
    }

    update(dt) {
        if (this.touchOn) {
            this.inputData(this.endPos)
        }
    }

    // update (dt) {}
}
