// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GM from "../GM";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPowerButton extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Sprite)
    CDing:cc.Sprite =null;

    @property(cc.Sprite)
    ICON:cc.Sprite =null;
    onLoad () 
    {
       // this._Button=this.getComponent(cc.Button);
        this.node.on(cc.Node.EventType.TOUCH_START,this.onMouseDown,this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseUp, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
    }
    //_Button:cc.Button;
    start () 
    {
        
    }
    onMouseDown()
    {
        if(GM.CANNON==null || GM.CANNON.WaitPercemt()>0) return;

 
    }
    onMouseUp()
    {
        if(GM.CANNON==null || GM.CANNON.WaitPercemt()>0) return;

    }
    update (dt)
    {
        if(this.CDing!=null && GM.CANNON!=null)
            this.CDing.fillRange =GM.CANNON.WaitPercemt();

        if(this.ICON!=null && GM.CANNON!=null)
            this.ICON.spriteFrame=GM.CANNON._NowShooter.ICON;
    }
}
