// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundController extends cc.Component {

    @property( cc.AudioClip)
    audioClipArray : cc.AudioClip[] = [];

    _current : number = -1;
    _currentEffect : number = -1;

    _currentEffectName : number = -1;


    

    onLoad(){
        cc.game.addPersistRootNode(this.node);

    }

    // setAudioClip ( name : string , clip : cc.AudioClip) {
    //     this.audioClipArray[ name ] = clip;
    // }

    initializeSound(){
        // this.initSoundSetting();
    }

    initSoundSetting(){
        let _localStorage = cc.find("LocalStorage").getComponent('LocalStorage');

        let effect =  _localStorage.getItem( 'effect');
        let music =  _localStorage.getItem( 'music');

        cc.log('SoundController.ts(51)' , effect, music );
       if ( effect === false )
           cc.audioEngine.setEffectsVolume(0);
       else 
           cc.audioEngine.setEffectsVolume(1);

       if ( music === false )
           cc.audioEngine.setMusicVolume(0);
       else 
           cc.audioEngine.setMusicVolume(1);
    }

    playMusic( audioIndex : number, loop? : boolean ,  finishCallback? : ()=>void){

        let _loop = !!loop ;
        if ( this.audioClipArray[audioIndex] instanceof cc.AudioClip ){
            this._current = cc.audioEngine.playMusic( this.audioClipArray[audioIndex], _loop);
            if ( typeof finishCallback === 'function' )
                cc.audioEngine.setFinishCallback( this._current, finishCallback );
            return this._current;
        }
        cc.error('SoundController.ts(64)' , "play music fail " , audioIndex );
        return -1;

    }

    stopMusic(){
        cc.audioEngine.stopEffect(this._current);
        this._current = -1;
    }


    playEffect( audioIndex : number, loop? : boolean ,  finishCallback? : ()=>void){
        if ( this._currentEffectName === audioIndex ) return -1;
        this._currentEffectName =audioIndex;
        setTimeout( ()=>{
            this._currentEffectName = -1;
        },1);

        let _loop = !!loop ;
        if ( this.audioClipArray[audioIndex] instanceof cc.AudioClip ){
            this._currentEffect = cc.audioEngine.playEffect( this.audioClipArray[audioIndex], _loop);
            if ( typeof finishCallback === 'function' )
                cc.audioEngine.setFinishCallback( this._currentEffect, finishCallback );
            return this._currentEffect;
        }
        else {
            cc.error('SoundController.ts(64)' , "play effect fail " , audioIndex );
            return -1;
        }
    }

    stopEffect( effect? : number){
        let stopEffect = effect ? effect : this._currentEffect;
        cc.audioEngine.stopEffect(stopEffect);
        this._currentEffect = -1;
    }


    setMusicVolume( volume : number ){
        cc.audioEngine.setMusicVolume(volume);
    }

    setEffectVolume( volume : number ){
        cc.audioEngine.setEffectsVolume(volume);
    }
}
