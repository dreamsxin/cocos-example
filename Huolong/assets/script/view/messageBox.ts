import { Button, Component, Label, Layout, UITransform, _decorator } from 'cc'

const { ccclass, property, type } = _decorator;

@ccclass('MessageBox')
export default class MessageBox extends Component {
    @type(Label)
    labelContent: Label = null
    @type(Button)
    btnLeft: Button = null
    @type(Label)
    labelBtnLeft: Label = null
    @type(Button)
    btnMiddle: Button = null
    @type(Label)
    labelBtnMiddle: Label = null
    @type(Button)
    btnRight: Button = null
    @type(Label)
    labelBtnRight: Label = null

    @property({ visible: false })
    leftCallback: Function = null
    @property({ visible: false })
    rightCallback: Function = null

    onLoad() {
        this.btnLeft.node.on(UITransform.EventType.TOUCH_END, this.onLeft.bind(this))
        this.btnMiddle.node.on(UITransform.EventType.TOUCH_END, this.onLeft.bind(this))
        this.btnRight.node.on(UITransform.EventType.TOUCH_END, this.onRight.bind(this))
    }

    start() {

    }

    // update (dt) {},

    startShow(text: string, leftLabel: string = "确定", leftCallback: Function = null, rightLabel: string = null, rightCallback: Function = null) {
        this.labelContent.string = text
        if (rightLabel != null) {
            this.btnLeft.node.active = true
            this.btnRight.node.active = true
            this.btnMiddle.node.active = false
            this.labelBtnLeft.string = leftLabel
            this.labelBtnRight.string = rightLabel
        } else {
            this.btnLeft.node.active = false
            this.btnRight.node.active = false
            this.btnMiddle.node.active = true
            this.labelBtnMiddle.string = leftLabel
        }
        this.leftCallback = leftCallback
        this.rightCallback = rightCallback
    }

    onLeft() {
        this.node.removeFromParent()
        if (this.leftCallback) {
            this.leftCallback()
        }
    }

    onRight() {
        this.node.removeFromParent()
        if (this.rightCallback) {
            this.rightCallback()
        }
    }
}
