// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class JoyStick extends cc.Component {

    @property(cc.Node)
    stick = null

    @property(cc.Node)
    stickNode = null

    @property
    radius_max = 80

    public stickV2 = cc.v2()

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onEventStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onEventMove, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEventCancel, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEventEnd, this)
    }
    // update (dt) {}

    private _center = cc.v2()
    onEventStart (event: cc.Event.EventTouch) {
        this.stickNode.active = true
        this._center = this.node.convertToNodeSpaceAR(event.touch.getLocation())
        this.stickNode.setPosition(this._center)
    }

    onEventMove(event: cc.Event.EventTouch) {
        let pos = this.stickNode.convertToNodeSpaceAR(event.touch.getLocation())
        let scale = 1
        if (this.radius_max > 0) {
            if(pos.mag()>this.radius_max) scale = this.radius_max/pos.mag()
        }
        if(scale > 0.01) {
            this.stickV2 = cc.v2(pos.x*scale, pos.y*scale)
        } else {
            this.stickV2 = cc.v2()
        }
        this.stick.setPosition(this.stickV2)
    }

    onEventCancel(event: cc.Event.EventTouch) {
        this.stickV2 = cc.v2()
        this.stick.setPosition(cc.v2())
        this.stickNode.active = false
    }

    onEventEnd(event: cc.Event.EventTouch) {
        this.stickV2 = cc.v2()
        this.stick.setPosition(cc.v2())
        this.stickNode.active = false
    }
}
