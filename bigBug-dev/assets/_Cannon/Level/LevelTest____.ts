// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LevelTest____ extends cc.Component {


    _OWner :GM;
    onLoad()
    {
        this._OWner=this.node.getComponent(GM);
        if(this._OWner==null)   return;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this._OnDebugKey, this);
    }
    _OnDebugKey(event)
    {
            switch(event.keyCode)
            {            
                case cc.macro.KEY.end:         
                    this._OWner.Success(2);
                     break;   
                case cc.macro.KEY.home:         
                    this._OWner.Failed();
                    break;       
            }
    }
}
