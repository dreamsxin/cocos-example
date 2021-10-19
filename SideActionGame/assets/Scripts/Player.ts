// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    _animation : cc.Animation = null!
    _animationName : string[] = [
        'character_idle',
        'character_attack_01',
        'character_attack_02',
        'character_attack_03',
        'character_damaged'
    ];

    //테스트용 임시 변수
    _baseScale : number = 1;
    _currentAtkAnim : number = 1;


    _gameManager : GameManager = null!;

    _atkAnimationInterval : number = 0.2;
    _actionTimeout : number = -1;

    onLoad(){
        this._animation = cc.find('character' , this.node).getComponent(cc.Animation);
        this._animation.on( 'finished' , this.onAnimFinishedCallback, this);

        this._gameManager = cc.find("GameManager").getComponent(GameManager);
    }

    leftAction(){
        this.node.scaleX = this._baseScale * -1;

        this._playAtkAnim();
    }

    rightAction(){
        this.node.scaleX = this._baseScale;
        this._playAtkAnim();
    }

    _playAtkAnim(){


        clearTimeout(this._actionTimeout);
        this._actionTimeout = -1;
        let animState = this._animation.play(this._animationName[ this._currentAtkAnim ] );
        animState.speed = 0.1 / this._gameManager.actionInterval ;


        this._currentAtkAnim++;
        if ( this._currentAtkAnim > 3 ){
            this._currentAtkAnim = 1;
        }
    }

    onAnimFinishedCallback(){
        this._animation.play( this._animationName[0] );
        this.scheduleOnce( ()=>{
            this._currentAtkAnim = 1;
            this._actionTimeout = -1;
        } , (this._gameManager.actionInterval ) * 1000);
    }

    damaged( dirLeft : boolean ){

        setTimeout( ()=>{
            if ( dirLeft )
                this.node.scaleX = this._baseScale * -1;
            else 
                this.node.scaleX = this._baseScale;
            let animState = this._animation.play(this._animationName[ 4] );
            this._currentAtkAnim = 1;
        } , 150);

    }
}
