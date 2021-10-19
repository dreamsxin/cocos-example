// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUIController extends cc.Component {


    _gameManager : GameManager = null!;

    _gameUI : cc.Node = null;
    _lbScore    : cc.Label = null!;

    _lbGameOver : cc.Node = null!;
    _btnMain : cc.Node = null;
    _lbReady : cc.Node = null!;
    _lbGo : cc.Node = null!;
    _lbFever    : cc.Node = null!;
    _lbFeverFinish : cc.Node = null!;
    _feverGauge : cc.ProgressBar = null!;



    _progTime : cc.ProgressBar = null!;
    // _lbTime     : cc.Label = null!;
    // _heartContainer : cc.Node = null!;


    _lbCombo : cc.Label = null!;

    @property(cc.Prefab)
    heartPrefab : cc.Prefab = null!;

    onLoad () {
        this._gameManager       = cc.find("GameManager").getComponent(GameManager);


        this._gameUI            = this.node;
        this._lbScore           = cc.find("lbScore", this._gameUI).getComponent(cc.Label);
        this._lbGameOver        = cc.find("lbGameOver", this._gameUI);
        this._lbReady           = cc.find("lbReady", this._gameUI);
        this._lbGo              = cc.find("lbGo", this._gameUI);
        this._lbFever           = cc.find("lbFever", this._gameUI);
        this._feverGauge        = cc.find("feverGauge", this._gameUI).getComponent(cc.ProgressBar);
        this._progTime          = cc.find("gameTimer" , this._gameUI ).getComponent(cc.ProgressBar ); 
        this._btnMain           = cc.find("lbGameOver/btnMain" , this._gameUI );
        this._lbFeverFinish     = cc.find("lbFeverFinish", this._gameUI);
        this._lbCombo           = cc.find("comboUI/lbCombo", this._gameUI).getComponent(cc.Label);


        this._lbScore.node.active    = true;
        this._progTime.node.active     = true;
        this._lbGameOver.active      = false;
        this._lbFever.active         = false;
        this._lbGo.active            = false;
        this._lbReady.active         = false;
        this._feverGauge.node.active = true;

    }



    initializeGame(){
        this._lbScore.node.active    = true;
        this._progTime.node.active     = true;
        this._lbGameOver.active      = false;
        this._lbFever.active         = false;
        this._lbFeverFinish.active   = false;
        this._lbGo.active            = false;
        this._lbReady.active         = false;
        this._feverGauge.node.active = true;



        // this._heartContainer.active = true;
        // this._heartContainer.removeAllChildren();


        // let heart = cc.instantiate(this.heartPrefab);
        // this._heartContainer.addChild(heart);
        // heart = cc.instantiate(this.heartPrefab);
        // this._heartContainer.addChild(heart);
        // heart = cc.instantiate(this.heartPrefab);
        // this._heartContainer.addChild(heart);
    }

    startCountDown( countDown : number , gameStartCallback : ()=>void){
        cc.tween(this.node)
        .call(()=>{
            this._lbReady.active = true;
        })
        .delay(countDown)
        .call(()=>{
            this._lbReady.active = false;
            this._lbGo.active = true;
            gameStartCallback();
        })
        .delay(0.4)
        .call(()=>{
            this._lbGo.active = false;
        })
        .start();
    }


    // updateHealth( health : number ){
    //     if ( health < 0) cc.warn( "health below 0 " , health );
    //     for( let i = 0 ; i < this._heartContainer.children.length ; i ++ ){
    //         if ( i < health )
    //             this._heartContainer.children[i].active = true;
    //         else 
    //             this._heartContainer.children[i].active = false;
    //     }
    // }

    updateRemainTime( time : number ){
        // this._lbTime.string = time + "";
        this._progTime.progress = time;
    }

    updateScore( score : number ){
        this._lbScore.string = score +"";
    }

    updateFever( fever : number ){
        this._feverGauge.progress = fever;
    }


    setFeverMode( ){
        this._lbFever.active = true;
        this._lbFever.opacity = 255;
    }

    finishFeverMode(feverFinishDelay,gameRestartDelay){
        this._lbFeverFinish.active = true;
        cc.tween( this._lbFever )
        .to( feverFinishDelay , {opacity : 0})
        .delay( gameRestartDelay )
        .call( ()=>{
            this._lbFeverFinish.active = false;
        })
        .start();
    }


    gameOver(){
        this._lbGameOver.active = true;
    }

    updateCombo( count : number ){
        if ( count === 0 ){
            this._lbCombo.node.parent.active = false;
        }
        else {
            this._lbCombo.node.parent.active = true;
        }

        this._lbCombo.string = count + "\nCombo";
    }
}
