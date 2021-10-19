import Scene from "../System/Scene";
import MoleBase from "./Mole/MoleBase";
import Hammer from "./Hammer";
import ParticleSystem from "../Game/ParticleSystem";

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
export default class WhacMoleScene extends Scene {

    @property(cc.Label)
    scoreLabel: cc.Label = null;
    @property(cc.Button)
    button: cc.Button = null;
    @property(cc.Button)
    playBtn: cc.Button = null;
    @property(Hammer)
    hammer: Hammer = null;
    @property(ParticleSystem)
    particleSystem: ParticleSystem = null;

    private audioSource: cc.AudioSource = null;
    private score:number=0;
    private moles:MoleBase[] = [];
    private timer = 0;
    private idx = 0;
    private steps = [];
    private conf:{default,list:{t,i,d?,j?,h?,hp?}[]} = null;
    private playing:boolean = false;
    onLoad(){
        this.audioSource = this.getComponent(cc.AudioSource);
        this.moles = this.getComponentsInChildren(MoleBase);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        let func = this.onKnocked.bind(this);
        cc.loader.loadRes('Conf/Level.json', (err, object)=> {
            this.conf = object.json.level1;
        });
        this.button.node.on("click",()=>{
            this.restart();
        }, this)

        this.playBtn.node.on("click",()=>{
            this.particleSystem.play();
        }, this)
    }
    restart(){
        this.playing = true;
        this.audioSource.play();
        this.score = 0;
        this.idx = 0;
        this.timer = 0;
        this.scoreLabel.string = "0";
        this.moles.forEach((hole)=>{
            hole.Hide();
        })
    }
    onKnocked(){
        this.score++;
        this.scoreLabel.string = this.score.toString();
    }
    onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouch, this);
    }
    private onTouch(evt :cc.Event.EventTouch){
        this.hammer.Knock(this.node.convertTouchToNodeSpaceAR(evt.touch));
    }
    update(dt){
        if(!this.playing){
            return;
        }
        this.timer += dt;
        if(this.idx < this.conf.list.length){
            let step = this.conf.list[this.idx];
            if(this.timer > step.t-0.5){
                this.idx++;
                let j = (step.j!=undefined) ? step.j : this.conf.default.j;
                let hp = (step.hp!=undefined) ? step.hp : this.conf.default.hp;
                
                this.moles[step.i].Show(j);
                this.steps.push(step);
            }
        }else{

        }
        //检查需要隐藏的地鼠
        let closeList = [];
        for(let i=0; i<this.steps.length; i++){
            let step = this.steps[i];
            let d = (step.d!=undefined) ? step.d : this.conf.default.d;
            if(this.timer > step.t+d-0.5){
                closeList.push(step);
            }
        }
        for(let i=0; i<closeList.length; i++){
            let step = closeList[i];
            this.steps.splice(this.steps.indexOf(step), 1);
            let h = (step.h!=undefined) ? step.h : this.conf.default.h;
            this.moles[step.i].Hide();
        }
    }
}
