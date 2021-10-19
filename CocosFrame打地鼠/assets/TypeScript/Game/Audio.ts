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
export default class AudioWarp extends cc.Component {

    @property(cc.AudioClip)
    clip: cc.AudioClip = null;
    id = null;
    loop:boolean = false;
    volume:number = 1;
    onLoad () {
    }
    play(){
        if(this.id!=null){
            this.stop();
        }
        this.id = cc.audioEngine.play(this.clip, this.loop,this.volume);
    }
    stop(){
        cc.audioEngine.stop(this.id);
    }
    pause(){
        cc.audioEngine.pause(this.id);
    }
    resume(){
        cc.audioEngine.resume(this.id);
    }
    setFinishCallback(callback){
        cc.audioEngine.setFinishCallback(this.id, callback);
    }
    getDuration(){
        return cc.audioEngine.getDuration(this.id);
    }
    setCurrentTime(time){
        cc.audioEngine.setCurrentTime(this.id, time);
    }
    getCurrentTime(){
        return cc.audioEngine.getCurrentTime(this.id);
    }
}
