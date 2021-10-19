import UICrl from "../Lib/UI/UICrl";
import StaticData from "../StaticData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverUI extends UICrl {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        //cc.log("gameover")

       
    }



    againBtnCB() {
        StaticData.GameOver = false
        cc.director.loadScene("GameScene")
        this.close()
    }

    // update (dt) {}
}
