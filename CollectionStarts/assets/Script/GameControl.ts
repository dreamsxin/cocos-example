
import { _decorator, Component, Node, SystemEvent, systemEvent, EventKeyboard, Label, CCInteger } from 'cc';
import { Character } from './Character';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GameControl
 * DateTime = Sun Sep 19 2021 09:35:42 GMT+0700 (Indochina Time)
 * Author = thien426
 * FileBasename = GameControl.ts
 * FileBasenameNoExtension = GameControl
 * URL = db://assets/Script/GameControl.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('GameControl')
export class GameControl extends Component 
{
    // [1]
    // dummy = '';

    static instance: GameControl;

    @property(Character)
    character: Character;

    @property(Label)
    score: Label;

    @property(CCInteger)
    starScore: number;

    _totalScore: number;

    start () 
    {
        GameControl.instance = this;

        this._totalScore = 0;
        this.score.string = this._totalScore.toString();

        systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onDestroy()
    {
        systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyUp(event: EventKeyboard)
    {
        this.character.onKeyUp(event.keyCode);
    }

    onKeyDown(event: EventKeyboard)
    {
        this.character.onKeyDown(event.keyCode);
    }

    public onCollectStar()
    {
        this._totalScore += this.starScore;
        this.score.string = this._totalScore.toString();
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
