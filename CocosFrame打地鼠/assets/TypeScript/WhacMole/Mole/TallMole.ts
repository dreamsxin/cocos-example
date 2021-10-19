import MoleBase from "./MoleBase";

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
export default class TallMole extends MoleBase {
    onLoad () {
        this.sprite.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    onDestroy(){
        this.sprite.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    private onTouch(){
        this.Knock();
        if(this.onKnocked){
            this.onKnocked();
        }
    }
    public Show(time = 0){
        let height = this.hp * 30 + 40;
        super.Show(time, height);
    }
    public Knock(){
        super.Knock();
        if(this.hp == 0){
            this.sprite.pauseSystemEvents(true);
            cc.tween(this.sprite).to(0.1, {height:15}).start();
        }else{
            let height = this.hp * 30 + 40;
            cc.tween(this.sprite).to(0.1, {height:height}).start();
        }
    }
}