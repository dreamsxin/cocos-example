// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SectionAnimation extends cc.Component {


    private maxHeight = 278;
    private tempHeight = 100;
    private maxLbHeight = 100;
    private tempLbHeight = 0;
    private isPlay = false;
    private speed = 300;


    start() {
        this.maxHeight = this.node.height;
        this.isPlay = true;
        this.tempHeight = 100;
        this.node.opacity = 0;
        var fade = cc.fadeIn(0.3);
        this.node.runAction(fade);
    }

    playAnimation(dt) {
        if (this.isPlay) {
            if (this.tempHeight < this.maxHeight) {
                this.tempHeight += dt * this.speed;
                this.node.height = this.tempHeight;
                if (this.tempHeight > 140) {
                    this.tempLbHeight += dt * this.speed;
                    this.node.children[0].height = this.tempLbHeight;
                }
                if (this.tempHeight >= this.maxHeight) {
                    this.isPlay = false;
                    this.node.height = this.maxHeight;
                }
            }
        }


    }
    update(dt) {
        // this.playAnimation(dt);
    }
}
