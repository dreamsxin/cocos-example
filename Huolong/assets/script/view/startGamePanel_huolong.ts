
import { _decorator, Component, Node } from 'cc';
const { ccclass, property, type } = _decorator;

@ccclass('StartGamePanelHuolong')
export class StartGamePanelHuolong extends Component {

    @type(Node)
    layout_page1: Node

    @type(Node)
    layout_page2: Node

    start() {
        // [3]
    }
}

