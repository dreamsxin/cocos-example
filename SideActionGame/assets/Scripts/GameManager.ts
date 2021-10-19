// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html




declare global {
    interface Window {
        actionIntervalTestValue : number
    }
  }



import GameUIController from "./GameUIController";
import ScoreUIController from "./ScoreUIController"
import Monster from "./Monster";
import Player from "./Player";
import SoundController from "./SoundController";
const {ccclass, property} = cc._decorator;



enum DIRECTION {
    LEFT = -1,
    RIGHT = 1,
}
@ccclass
export default class GameManager extends cc.Component {


    _soundController : SoundController = null!;


    feverFinishDelay = 0.3;
    gameRestartDelay = 1;


    actionInterval : number = 0.1;



    _menuUI : cc.Node = null!;
    _btnDiff : cc.Node[] = [];

    _gameUI : GameUIController = null!;
    _scoreUI : ScoreUIController = null!;


    _monsterDistance : number = 64;


    //InGame Value
    _difficulty : number = 0;
    _score = 0;
    _fever = 0;
    _comboCount : number= 0;
    _maxCombo : number = 0;
    _timeCount : number = 30;
    _maxTimeCount : number = 30;
    // _health = 3;
    _feverPerScore = 99;
    _insaneTimer = 0.2;
    _feverMode : boolean = false;

    _blockInput : boolean = true;
    _blockInputFeverFinish : boolean = true;


    player : Player = null!;
    @property(cc.Prefab)
    monsterPrefab : cc.Prefab = null!;



    //GameNode
    _monsterDirectionArray : number[] = [];
    _monsterArr : Monster[] = [];

    _monsterCount : number = 4;

    onLoad(){
        this.initMenu();

        this._gameUI = cc.find("GameUI").getComponent(GameUIController);
        this._scoreUI = cc.find("ScoreUI").getComponent(ScoreUIController);

        this._soundController = cc.find("SoundController").getComponent(SoundController);

        this.player = cc.find("Player" , this.node ).getComponent(Player);
    }



    start(){
        // this.showResult();
        this.showMain();


        // this.schedule( this.runCheat );
    }




    initMenu(){
        this._menuUI = cc.find("MenuUI");

        this._menuUI.active = true;
        cc.find( "lbEasy"   , this._menuUI ).on('click' , this.startGame.bind( this , 0) , this );  
        cc.find( "lbHard"   , this._menuUI ).on('click' , this.startGame.bind( this , 1) , this );  
        cc.find( "lbHell"   , this._menuUI ).on('click' , this.startGame.bind( this , 2) , this );  
        cc.find( "lbInsane" , this._menuUI ).on('click' , this.startGame.bind( this , 3) , this );

    }

    showMain(){
        this.resetGame();
        this._gameUI.node.active = false;
        this._menuUI.active = true;
        this._scoreUI.node.active = false;
        this._soundController.playMusic(0, true);
    }

    showResult(){
        this._gameUI.node.active = false;
        this._menuUI.active = false;
        this._scoreUI.node.active = true;
        this._scoreUI.showResult(this._score, this._maxCombo );
    }

    restartGame(){
        this.resetGame();
        this.startGame( this._difficulty );

    }



    startGame( diff : number ){
        this._soundController.playMusic(1 , true);


        let actioninterval = Number(window.actionIntervalTestValue);
        if ( this.actionInterval !== actioninterval && isNaN( actioninterval) === false ){
            this.actionInterval = actioninterval;
        }

        this._gameUI.node.active = true;
        this._menuUI.active = false;
        this._scoreUI.node.active = false;



        this._difficulty = diff;


        this._gameUI.initializeGame();
        // this._gameUI.updateHealth(      this._health );
        this._gameUI.updateFever(       this._fever);
        this._gameUI.updateRemainTime(  this._timeCount / this._maxTimeCount);
        this._gameUI.updateScore(       this._score );
        this._gameUI.updateCombo(       this._comboCount );


        for ( let i = 0 ; i < this._monsterCount ; i ++ ){
            this.makeNewMonster();
        }




        let countDown = 1;
        this._gameUI.startCountDown( countDown  , ()=>{
            // this.setInsaneTimer();
            this._blockInput = false;
            this._blockInputFeverFinish = false;
            this.schedule( this._updateTimeCount  );
        });
    }


    resetGame(){
        // this._difficulty = 0;
        this._score = 0;
        this._fever = 0;
        this._timeCount = this._maxTimeCount;
        // this._health = 3;
        this._feverPerScore = 10;
        this._comboCount = 0;
        this._maxCombo = 0;

        this._monsterDirectionArray.length = 0;
        this._monsterArr.forEach( element =>{
            element.node.removeFromParent();
        })
        this._monsterArr.length = 0;
    }

    _updateTimeCount(dt : number ){
        // this._timeCount--;
        this._timeCount -= dt;
        this._gameUI.updateRemainTime( this._timeCount / this._maxTimeCount );
        if ( this._timeCount <= 0 ){
            this.gameOver();
        }
    }

    leftAction(){
        if ( this._blockInput === true  || this._blockInputFeverFinish === true ) return;

        if ( this._feverMode && this._monsterDirectionArray[0] === DIRECTION.LEFT){
            this.player.leftAction();
            this.attackMonster();
        }
        else if (this._feverMode && this._monsterDirectionArray[0] === DIRECTION.RIGHT){
            this.player.rightAction();
            this.attackMonster();
        }
        else if ( this._monsterDirectionArray[0] === DIRECTION.LEFT ){
            this.player.leftAction();
            this.attackMonster();
        }
        else {
            this.player.leftAction();
            this.playerDamaged();
        }
    }

    rightAction(){
        if ( this._blockInput === true  || this._blockInputFeverFinish === true ) return;

        if ( this._feverMode && this._monsterDirectionArray[0] === DIRECTION.LEFT){
            this.player.leftAction();
            this.attackMonster();
        }
        else if (this._feverMode && this._monsterDirectionArray[0] === DIRECTION.RIGHT){
            this.player.rightAction();
            this.attackMonster();
        }
        else if ( this._monsterDirectionArray[0] === DIRECTION.RIGHT || this._feverMode ){
            this.player.rightAction();
            this.attackMonster();
        }
        else {
            this.player.rightAction();
            this.playerDamaged();
        }
    }


    attackMonster(){
        // let atkEffectRnd = Math.floor(Math.random() * 6);
        this._soundController.playEffect(3);
        if ( this._monsterArr.length === 0 ) return; 

        if ( this._monsterArr[0].damaged( this._feverMode )  ){
            this._monsterDirectionArray.splice(0,1);
            this._monsterArr.splice(0,1);
            this.moveToCenter();
            this.makeNewMonster();
            this.score();
            this.addFever();
            this.setInsaneTimer();
        }

        this._maxCombo = this._maxCombo > this._comboCount ? this._maxCombo : this._comboCount;
        this._gameUI.updateCombo(       this._comboCount++ );
    }

    moveToCenter(){

        for( let i = 0 ; i < this._monsterDirectionArray.length ; i ++ ){
            let targetPos = cc.v2((i + 1) * this._monsterDistance *  this._monsterDirectionArray[i] , 0);
            cc.tween( this._monsterArr[i].node )
            .to( this.actionInterval , { position : targetPos})
            .start();
        }


    }

    makeNewMonster(){
        let pos = Math.floor(Math.random() * 2);
        if ( pos === 0 ) pos = -1;
        this._monsterDirectionArray.push( pos );



        let index = this._monsterDirectionArray.length;
        let monster = cc.instantiate(this.monsterPrefab);


        let moveTargetPos = cc.v2(index  * this._monsterDistance *  pos , 0 );
        monster.setPosition( this._monsterDistance * 6 *  pos , 0 );

        cc.tween( monster )
        .to( 0.3 , {position : moveTargetPos} )
        .start();

        this.node.addChild( monster );

        this._monsterArr.push(monster.getComponent(Monster));

        monster.getComponent(Monster).init( pos === DIRECTION.LEFT , this._difficulty);
    }

    setInsaneTimer(){
        if ( this._difficulty === 3)
            this._monsterArr[0].startInsaneTimer();
    }


    score(){
        this._score++;
        this._gameUI.updateScore( this._score );
    }

    addFever(){
        if ( this._feverMode === true ) return;
        this._fever += 1 / this._feverPerScore;


        this._gameUI.updateFever( this._fever );
        if ( this._fever >= 1) {
            this.feverOn();
        }
    }

    feverOn(){
        this._feverMode = true;
        this._gameUI.setFeverMode();
        this.unschedule( this._updateTimeCount );

        // this._timeCount--;
        // this._updateTimeCount();

        this.schedule( this._updateFever  );
    }



    playerDamaged(){
        this._soundController.playEffect(2);
        this.player.damaged(this._monsterDirectionArray[0] === DIRECTION.LEFT);
        this._timeCount -= 5;

        this._comboCount = 0;
        this._gameUI.updateCombo(       this._comboCount );
    }


    gameOver(){
        this._blockInputFeverFinish = true;
        this._blockInput = true;
        this._monsterArr[0].pauseTimer();
        this._gameUI.gameOver();
        this.unschedule( this._updateTimeCount );
        this.unschedule( this._updateFever );
        setTimeout( ()=>{
            this.showResult();
        } , 1500 );
    }




    _updateFever( dt : number){
        this._fever -= dt * 0.4;
        this._gameUI.updateFever( this._fever );
        if ( this._fever <= 0){
            this.unschedule( this._updateFever );
            this.finishFever();
        }
    }

    finishFever(){
        cc.log("fever finished" , "block inpug");
        this._feverMode = false;
        this._blockInputFeverFinish = true;


        //몬스터 싹 날리기
        this._monsterArr.forEach( element =>{
            element.damaged( true );
        });
        this._monsterDirectionArray.length = 0;
        this._monsterArr.length = 0;
        //



        this._gameUI.finishFeverMode( this.feverFinishDelay , this.gameRestartDelay );




        cc.tween( this.node )
        .delay( this.feverFinishDelay )
        .call(()=>{
            for ( let i = 0 ; i < this._monsterCount ; i ++ ){
                this.makeNewMonster();
            }
        })
        .delay( this.gameRestartDelay )
        .call( ()=>{
            this.schedule( this._updateTimeCount );
            this._blockInputFeverFinish = false;
            this.setInsaneTimer();
        })
        .start();
    }



    runCheat(){
        if ( this._monsterDirectionArray.length === 0 ) return;

        if ( this._monsterDirectionArray[0] === DIRECTION.LEFT )
            this.leftAction();
        else 
            this.rightAction();

    }
}
