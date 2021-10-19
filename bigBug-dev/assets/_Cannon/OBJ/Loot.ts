// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseObj from "./BaseObj";
import UIPowerLooping from "../UI/UIPowerLooping";
import LootDroper from "./LootDroper";
import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loot extends cc.Component {

    @property
    RandomFactor: number = 100;

    @property
    Count: number = 6;

    @property(cc.Prefab)
    MOD:cc.Node =null;

    _Owner :BaseObj;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad () 
    {
        this._Owner=this.getComponent(BaseObj);
    }

    Drop()
    {
        if( Math.random()*100 <100-this.RandomFactor)
            return;


        GM.LEVEL.AddLoot(this.Count);

        LootDroper.ADD(GM.ACCLOOT.node).Set(this.MOD,this.Count).SetPos(this._Owner.GetWorldPosition(),GM.ACCLOOT.GetWorldPosition());
    }

    // update (dt) {}
}
