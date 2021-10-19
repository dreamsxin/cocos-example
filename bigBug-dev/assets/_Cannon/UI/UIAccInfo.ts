// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ACC from "../ACC";
import GM from "../GM";
import UIOBJ from "../../__Lib/Base/UIOBJ";
import UIAdmin from "../../__Lib/Base/UIAdmin";
import SYS from "../../__Lib/SYS";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIAccInfo extends UIAdmin 
{

    @property(cc.Label)
    uiGold: cc.Label = null;

    @property(cc.Label)
    uiAccid: cc.Label = null;

    OnAdmin()
    {
        if(this.uiAccid!=null)
        {
            this.uiAccid.string=ACC.ACCID;
            this.uiAccid.node.active=true;
        }
            
    }

    start () 
    {
        GM.ACCLOOT = this;
    }
    _passed =0;
    update (dt) 
    {
        this._passed+=dt;
        if(this._passed<0.5)    return;
        this._passed=0;
        
        if(this.uiGold!=null && ACC.SAVING!=null)
        {
            this.uiGold.string =ACC.SAVING.Gold.toString();
        }
    }
}
