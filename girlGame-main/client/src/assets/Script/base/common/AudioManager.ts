import { resLoader } from "../res/ResLoader";
import { Log } from "../../util/Log";
import SysDef from "../../util/SysDef";
import { EventManager } from "./EventManager";

export default class AudioManager {
    // 背景音乐ID
    private audioBackgroundID: number = -1;
    private audioPlotBackgroundID: number = -1;
    private musicVol: number = 1;
    private effectVol: number = 1;

    /**
     * 通用方法
     */
    public PlayEffect(resName, loop = false): void {
        var url = resName;
        if (SysDef.isNeedRemote) {
            url = SysDef.getAudioEffectUrl(resName);
        }
        var self = this;
        resLoader.loadRes(url, function (error: Error, resources: any) {
            if (error != null || resources == null) {
                Log.log("---音效(" + resName + ")不存在---");
                return;
            }
            cc.audioEngine.playEffect(resources, loop);
        });
    }

    public PlayMusic(resName) {
        var url = resName;
        if (SysDef.isNeedRemote) {
            url = SysDef.getAudioMusicUrl(resName);
        }
        var self = this;
        resLoader.loadRes(url, function (error: Error, resources: any) {
            if (error != null || resources == null) {
                Log.log("---音效(" + resName + ")不存在---");
                return;
            }
            self.audioBackgroundID = cc.audioEngine.playMusic(resources, true);
        });

    }

    public PlayPlotMusic(resName) {
        var url = resName;
        if (SysDef.isNeedRemote) {
            url = SysDef.getAudioMusicUrl(resName);
        }
        var self = this;
        resLoader.loadRes(url, function (error: Error, resources: any) {
            if (error != null || resources == null) {
                Log.log("---音效(" + resName + ")不存在---");
                return;
            }
            self.audioPlotBackgroundID = cc.audioEngine.playMusic(resources, true);
        });

    }
    public stopPlotBGMusic() {
        cc.audioEngine.stop(this.audioPlotBackgroundID);
    }
    public SetMusicVol(vol) {
        this.musicVol = vol;
        cc.audioEngine.setMusicVolume(vol);
    }

    public SetEffectVol(vol) {
        this.effectVol = vol;
        cc.audioEngine.setEffectsVolume(vol);
    }

    public StopMusic(): void {
        cc.audioEngine.stopMusic();
    }

    public StopEffect(): void {
        cc.audioEngine.stopAllEffects();
    }
    public ResumeMusic(): void {

        cc.audioEngine.resumeMusic();
    }
    public ResumeEffect(): void {

        cc.audioEngine.resumeAllEffects();
    }
    public PauseMusic(): void {
        cc.audioEngine.pauseMusic();
    }
    public PauseEffect(): void {
        cc.audioEngine.pauseAllEffects();
    }

}

export let audioManager: AudioManager = new AudioManager();