import Scene from "../System/Scene";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Navigator  from "../System/Navigator";
import SceneManager, { ShiftAnima } from "../System/SceneManager";
@ccclass
export default class FightScene extends Scene {
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        Navigator.ins.onBackClick = ()=>{
            SceneManager.ins.Back(ShiftAnima.moveDownShift);
        }
    }

    

    // update (dt) {}
}
