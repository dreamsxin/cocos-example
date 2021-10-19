// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TipsItem extends cc.Component {

    @property(cc.RichText)
    rlb_tips: cc.RichText = null;

    public playTip(message: string,completeBack) {
        this.node.stopAllActions();
        this.rlb_tips.string = message;
        this.reset();
        let action0 = cc.moveTo(0.4, 0, 400);
        let action1 = cc.fadeIn(0.2);
        let action2 = cc.spawn(action0, action1);
        let action3 = cc.delayTime(0.5);
        let action4 = cc.fadeOut(0.3);
        let callback = cc.callFunc(
          completeBack
        );

        let action = cc.sequence(action2, action3, action4, callback);
        this.node.runAction(action);
    }


    private reset() {
        this.node.setPosition(0, 200);
        this.node.opacity = 255;
    }
}
