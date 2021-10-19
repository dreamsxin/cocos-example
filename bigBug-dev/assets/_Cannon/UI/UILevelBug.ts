// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";
import UIAdmin from "../../__Lib/Base/UIAdmin";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UILevelBug extends UIAdmin {

    // LIFE-CYCLE CALLBACKS:
    OnAdmin()
    {
        GM._Instance.GoLevelLast();
    }

}
