// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIOBJ from "../../__Lib/Base/UIOBJ";
import Win from "../../__Lib/Base/Win";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinSuccess extends Win {

    @property(cc.Button)
    btOK: cc.Button = null;
    @property(cc.Button)
    btRetry: cc.Button = null;

    @property(cc.Label)
    uiTime: cc.Label = null;
    @property(cc.Label)
    uiScore: cc.Label = null;
    @property(cc.Label)
    uiGold: cc.Label = null;
    @property
    text: string = 'hello';




    // LIFE-CYCLE CALLBACKS:

    private  __EndResult:number;
    Set(result:number):WinSuccess
    {
        this.__EndResult =result;
        return this;
    }
    SetScore(score:number,time:number,gold:number):WinSuccess
    {
        if(this.uiTime!=null) this.uiTime.string = time.toFixed(0);
        if(this.uiScore!=null) this.uiScore.string = score.toFixed(0);
        if(this.uiGold!=null) this.uiGold.string = gold.toFixed(0);
        return this;
    }
    OnShow()
    {
        super.OnShow();
    }


    // OnMsgCall(m)
    // {
    //     if(m=="OK")  this._DoNext();
   
    //     if(m=="RETRY") this._DoReplay();
    // }
    // _DoNext()
    // {

    // }
    // _DoReplay()
    // {
    //     var now=cc.director.getScene().name;
    //     cc.director.loadScene(now);

    // }
    // update (dt) {}
}
