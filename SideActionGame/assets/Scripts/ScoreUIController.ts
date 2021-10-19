// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameManager from "./GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _gameManager : GameManager = null!;
    _lbScore : cc.Label = null!;
    _lbCombo : cc.Label = null!;
    _lbLife : cc.Label = null!;
    _lbTotal : cc.Label = null!;


    _btnMain : cc.Node = null!;
    _btnRetry : cc.Node = null!;

    _targetLabel : cc.Label = null!;

    _counter : number = 20;
    _countingTime : number = 1;


    _score : number = 0;
    _combo : number = 0;
    // _life : number = 0;

    onLoad(){

        this._gameManager       = cc.find("GameManager").getComponent(GameManager);


        this._lbScore = cc.find("lbScore2" , this.node ).getComponent(cc.Label );
        this._lbCombo = cc.find("lbCombo2" , this.node ).getComponent(cc.Label );
        this._lbLife  = cc.find("lbLife2" , this.node ).getComponent(cc.Label );
        this._lbTotal = cc.find("lbTotal2" , this.node ).getComponent(cc.Label );
        


        this._btnMain = cc.find( "btnMain" , this.node );
        this._btnRetry = cc.find( "btnRetry" , this.node );


        this._btnMain.active = false;
        this._btnRetry.active = false;


        this._btnMain.on('click', this._gameManager.showMain , this._gameManager );
        this._btnRetry.on('click', this._gameManager.restartGame , this._gameManager );

        this.node.on('click' , this._skipCounting , this );
    }


    showResult( score : number , combo : number){

        this._score = score;
        this._combo = combo;
        // this._life = life;

        this._lbScore.string = "";
        this._lbCombo.string = "";
        this._lbLife.string = "";
        this._lbTotal.string = "";

        cc.tween( this.node )
        .call( ()=>{
            this._labelCounting( this._lbScore , 0 , score );
            this._labelCounting( this._lbTotal , 0 , score );
        })
        .delay(this._countingTime + 0.5)
        .call( ()=>{
            this._labelCounting( this._lbCombo , 0 , combo );
            this._labelCounting( this._lbTotal , score ,  score + combo  );
        })
        .delay(this._countingTime + 0.5)
        // .call( ()=>{
        //     this._labelCounting( this._lbLife , 0 , life );
        //     this._labelCounting( this._lbTotal , score + combo  , score + combo + life );
        // })
        // .delay(this._countingTime + 0.5)
        .call(()=>{
            this._showRetry();
        })
        .start();
    }

    _labelCounting( label : cc.Label , start : number , end : number ){


        let dt = this._countingTime / this._counter;
    
        let currNum = start;
        let dcount = (end - start) / this._counter;

    
        label.schedule( ()=>{ 
            currNum += dcount;
            label.string = Math.round(currNum).toString();
        }, 
        dt, 
        this._counter -1);
    }

    _skipCounting(){
        cc.director.getActionManager().removeAllActionsFromTarget(this.node , true);
        this._lbScore.unscheduleAllCallbacks();
        this._lbLife.unscheduleAllCallbacks();
        this._lbCombo.unscheduleAllCallbacks();
        this._lbTotal.unscheduleAllCallbacks();

        this._lbScore.string = this._score.toString();
        this._lbCombo.string = this._combo.toString();
        // this._lbLife.string = this._life.toString();

        this._lbTotal.string = ( this._score + this._combo ).toString();
        this._showRetry();
    }

    _showRetry(){
        this._btnMain.active = true;
        this._btnRetry.active = true;
    }
}
