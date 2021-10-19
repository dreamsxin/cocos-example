// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EX } from "../__Lib/EX";
import ACC from "./ACC";

const {ccclass, property} = cc._decorator;


export enum GameState
{
    gsNone=0,
    gsIniting=1,
    gsRuning=2,
    gsEnd=9,
}


@ccclass
export default class GMBase extends cc.Component {

    @property
    NowLevel: number=0;
    LevelTime:number;
    LevelScore:number;

    State=GameState.gsNone;
    EndResule=0;


    IsRuning(){return this.State== GameState.gsRuning;}

    start()
    {
        cc.director.getCollisionManager().enabled = true; //开启碰撞检测，默认为关闭
        //cc.director.getCollisionManager().enabledDebugDraw = true; //开启碰撞检测范围的绘制
        //cc.director.getCollisionManager().enabledDrawBoundingBox = true; //开启碰撞组件的包围盒绘制
        this.scheduleOnce(this.Init,0.2);
    }

    Init()
    {
        this.State=GameState.gsIniting;
        this.OnInit();

    }
    OnInit()
    {
        this.scheduleOnce(this.Begin,0.1);
    }

    Begin()
    {
        this.State=GameState.gsRuning;
        this.OnBegin();
       
    }
    OnBegin()
    {

    }
    _DoCommit(gold,time,score):GMBase
    {
        try
        {
            this.LevelTime = time;
            this.LevelScore = score;
    
            ACC.SAVING.Level++;
            ACC.SAVING.Gold+=gold;
            ACC.SAVE();
        }catch{}

        return this;
    }
    Success(f):GMBase
    {
        this.EndResule=f;
        this.State=GameState.gsEnd;
 
        this.OnSuccess(f);
        return this;
    }
    OnSuccess(f)
    {

    }
    Failed()
    {
        this.EndResule=-1;
        this.State=GameState.gsEnd;
        this.OnFailed();
    }
    OnFailed()
    {

    }



    SetNowLevel(levelid)
    {
        this.NowLevel=Number.parseInt(levelid);
    }
    GoLevelLast()
    {
        var name="sc_Level - "+ EX.PrefixInteger(this.NowLevel-1,3);

        cc.director.loadScene(name);
    }
    GoLevelNext()
    {
        var name="sc_Level - "+ EX.PrefixInteger(this.NowLevel+1,3);

        cc.director.loadScene(name);
    }
    GOLevelNow()
    {
        var name="sc_Level - "+ EX.PrefixInteger(this.NowLevel,3);

        cc.director.loadScene(name);
    }
}
