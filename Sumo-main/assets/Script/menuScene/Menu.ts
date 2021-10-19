
import { _decorator, Component, Node, log } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Menu')
export class Menu extends Component {

    start() {
    }

    onPlayClicked() {
        log('Start Game');
    }

}