import { Component, Label, Layout, _decorator } from "cc";

const { ccclass, property, type } = _decorator;

@ccclass('WaitingBar')
export default class WaitingBar extends Component {
    @type(Label)
    content: Label = null

    onLoad() {
    }

    start() {
    }

    // update(dt){},

    setContent(text: string) {
        this.content.string = text
    }
}
