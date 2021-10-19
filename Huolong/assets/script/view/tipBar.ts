import { Component, Label, Layout, _decorator } from "cc"

const { ccclass, property, type } = _decorator;

@ccclass('TipBar')
export default class TipBar extends Component {
    @type(Label)
    content: Label = null

    @property({ visible: false })
    showedTime: number = 0

    onLoad() {
    }

    start() {
        this.showedTime = 0
    }

    update(dt: number) {
        this.showedTime += dt
        if (this.showedTime > 3) {
            this.node.removeFromParent()
        }
    }

    setContent(text: string) {
        this.content.string = text
    }
}
