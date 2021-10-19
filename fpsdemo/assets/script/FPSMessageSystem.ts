
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum FPSMessageEnum {
    ReloadComplete,
    ReloadStart,
    Stand,
}

@ccclass('FPSMessageSystem')
export class FPSMessageSystem extends Component {
    sendMessage(message: FPSMessageEnum, content?: any) {
        let components = this.node.components;
        for (let item of components) {
            let comp = (item as any);
            comp.onMessage && comp.onMessage(message, content);
        }
    }
}