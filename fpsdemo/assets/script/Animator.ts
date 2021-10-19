
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Animator')
export abstract class Animator extends Component {
    protected fsm: any = null!;
    public abstract initStateMachine(): void;
    
    public play(transitionsName: string, param?: any) {
        this.fsm[transitionsName](param);
    }
}
