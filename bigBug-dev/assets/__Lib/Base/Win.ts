// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIOBJ from "./UIOBJ";

const {ccclass, property} = cc._decorator;
export enum WinResult
{
    wrNone=0,
    wrOK=1,
    wrNo=2,
}
@ccclass
export default class Win extends UIOBJ 
{
    WinResult:WinResult= WinResult.wrNo;

    MSGCall(event,cmd )
    {
        this._ONMsg?.call(this,this,cmd);

        this.OnMsgCall(cmd);
    }

    OnMsgCall(cmd )
    {

        switch (cmd)
        {
            case "OK": this.OK();break;
            case "NO": this.NO();break;
        }
        
    }
    _ONMsg :Function;
    WaitMsg(on:(Win,msg)=>void):Win
    {
        this._ONMsg=on;
        return this;
    }
    OK()
    {
        this.WinResult=WinResult.wrOK;
        this.Close();
    }
    NO()
    {
        this.WinResult=WinResult.wrNo;
        this.Close();
    }


    OnClose()
    {

        if(this._ONClose!=null)
            this._ONClose(this);

        super.OnDead();
    }
    _ONClose :Function;
    WaitClose(on:(Win)=>void):Win
    {
        this._ONClose=on;
        return this;
    }
}
