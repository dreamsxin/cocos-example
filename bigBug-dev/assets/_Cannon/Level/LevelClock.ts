// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClockObj from "../OBJ/ClockObj";
import { EX } from "../../__Lib/EX";


export class ActionObj 
{
    Obj:ClockObj;
    Waiting:number;
    constructor(obj:ClockObj,waiting:number)
    {
        this.Obj=obj;
        this.Waiting=waiting;
    }
    Update(dt:number):ActionObj
    {
        this.Waiting-=dt;
        return this;
    }


}


const {ccclass, property} = cc._decorator;
@ccclass
export default class LevelClock extends cc.Component {

    _ObjArr:Array<ActionObj>;


    Add(obj:ClockObj,waiting:number):LevelClock
    {
        if(this._ObjArr==null)
            this._ObjArr=new Array<ActionObj>();

        for(let i=0;i<this._ObjArr.length;i++)
        {
            if(this._ObjArr[i]!=null && this._ObjArr[i].Obj==obj)
            {
                this._ObjArr[i].Waiting+=waiting;
                return this;
            }

        }


        this._ObjArr.push(new ActionObj(obj,waiting));

        return this;
    }

    _OneTurn(who:ClockObj)
    {

        if(this._ONClock!=null)  this._ONClock(who);
    }

    _ONClock:(who:ClockObj)=>void;

    Wait(callback: (who:ClockObj)=>void):LevelClock
    {
        this._ONClock=callback;
        return this;
    }
    _Runing:boolean;
    Run():LevelClock
    {
        this._Runing =true; return this;
    }
    Pause():LevelClock
    {
        this._Runing =false; return this;
    }
    update(dt)
    {
        if(!this._Runing)
            return;

        if(this._ObjArr==null || this._ObjArr.length<1)
            return;



        for(let i=0;i<this._ObjArr.length;i++)
        {
            let who =this._ObjArr[i];
            if(who==null || who.Obj==null ||who.Obj.node==null|| !who.Obj.node.activeInHierarchy)
            {
                EX.ListRemove(this._ObjArr,who);
                continue;
            }
            if(who!=null && who.Obj!=null && who.Update(dt).Waiting<=0) 
            {

                who.Obj.DoTurn().WaitTrunOver( (w=>
                    {
                        this.Run();   
                        this.Add(w,w.NowWaitime);
                        
                    }).bind(this));
                this.Pause();    
                return;    
            }

        }
    }
}
