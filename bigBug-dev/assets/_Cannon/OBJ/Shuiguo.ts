// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseObj from "./BaseObj";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shuiguo extends BaseObj {

    @property(cc.Label)
    uiHPPoint: cc.Label = null;

    update(dt)
    {
        super.update(dt);

        if(this.uiHPPoint!=null)
        {
            this.uiHPPoint.string = this.NowHP.toFixed(0);
        }
    }
}
