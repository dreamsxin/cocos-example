import MoleBase from "./MoleBase";
import ParticleSystem from "../../Game/ParticleSystem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BucketMole extends MoleBase {
    @property(ParticleSystem)
    knockStar:ParticleSystem = null;
    onLoad () {
        super.onLoad();
        this.view.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    onDestroy(){
        this.view.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    private onTouch(){
        this.Knock();
    }
    public Show(time = 0){
        this.view.resumeSystemEvents(true);
        this.animation.play("Show");

    }
    public Hide(){
        this.view.pauseSystemEvents(true);
        this.animation.play("Hide");
    }
    public Knock(){
        this.animation.play("Beaten");
        this.knockStar.play();
    }
}