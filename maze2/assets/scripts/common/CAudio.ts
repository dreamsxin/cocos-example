// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CAudio extends cc.Component {
    static init(){
        
    }

    /** 播放按键音效 */
    static playKeyTone() {
        cc.resources.load("audio/popup", cc.AudioClip, (error, assets: cc.AudioClip) => {
            if (error) cc.error(error);
            cc.audioEngine.playEffect(assets, false);
        })
    }
    /** 播放成功音效 */
    static playSuccess() {
        cc.resources.load("audio/success", cc.AudioClip, (error, assets: cc.AudioClip) => {
            if (error) cc.error(error);
            cc.audioEngine.playEffect(assets, false);
        })
    }
     /** 播放返回音效 */
     static playBack() {
        // cc.resources.load("audio/back", cc.AudioClip, (error, assets: cc.AudioClip) => {
        //     if (error) cc.error(error);
        //     cc.audioEngine.playEffect(assets, false);
        // })
    }

    static playBgm(){
    }

    //按键音
    onPlayKeyTone(){
        CAudio.playKeyTone();
    }

    /** 关闭音效 */
    static closeAudio() {
        cc.audioEngine.setMusicVolume(0);
        cc.audioEngine.setEffectsVolume(0);
    }
    /** 打开音乐 */
    static openAudio() {
        cc.audioEngine.setMusicVolume(1);
        cc.audioEngine.setEffectsVolume(1);
    }
}
