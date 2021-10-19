
/**
 * Zy.
 * 2020-08-30.
 * 音频管理.
 */

import { _decorator, loader, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager {
    
    public static playMusic(name: string) {
        const path = `audio/music/${name}`;
        loader.loadRes(path, AudioClip, (err, audio: AudioClip) => {
            if (err || !audio) { return console.log(`===> load ${path} error: ${err}, audio: `, audio); }
            audio.setLoop(true);
            audio.play();
        });
    }
    
    public static playSound(name: string) {
        const path = `audio/sound/${name}`;
        loader.loadRes(path, AudioClip, (err, audio: AudioClip) => {
            if (err || !audio) { return console.log(`===> load ${path} error: ${err}, audio: `, audio); }
            audio.setLoop(false);
            audio.playOneShot(1);
        });
    }

}
