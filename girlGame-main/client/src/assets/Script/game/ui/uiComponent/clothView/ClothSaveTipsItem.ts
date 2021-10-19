// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClothSaveTipsItem extends cc.Component {

    public playTip(callback) {
        this.node.stopAllActions();
        let action1 = cc.fadeIn(0.5);
        let action2 = cc.delayTime(0.5);
        let action3= cc.fadeOut(0.5);

        let action = cc.sequence(action1, action2, action3,cc.callFunc(callback));
        this.node.runAction(action);
    }

}
