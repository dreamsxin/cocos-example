// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import BaseObj from "./BaseObj";
import { LiveState } from "../../__Lib/Base/LiveObj";

const {ccclass, property} = cc._decorator;

export enum UnitState
{
    usIdea=0,
    usMoving=1,
}
@ccclass
export default class Unit extends BaseObj 
{

    @property(sp.Skeleton)
    AM: sp.Skeleton = null;



    @property(cc.Sprite)
    uiMovingCD: cc.Sprite = null;

    @property
    Speed: number = 5;
    @property
    MoveLife: number =2;

    @property
    MoveWait: number =5;


    UnitState :UnitState= UnitState.usIdea;
  
    onLoad()
    {
        super.onLoad();
        if(this.AM==null)
            this.AM=this.node.getComponentInChildren(sp.Skeleton);
    }
    _Ideaing(dt)
    {
        this._MovingWaiting-=dt;
        if(this._MovingWaiting<=0)
        {
            this.Move();
            return;
        }
        if(this.uiMovingCD!=null) 
        {
            this.uiMovingCD.node.parent.active=true;
            this.uiMovingCD.fillRange = this._MovingWaiting/this.MoveWait;
        }
    }
    Idea()
    {
        this.UnitState= UnitState.usIdea;
        this._MovingWaiting =this.MoveWait;
        this.AM?.clearTrack(0);
        this.AM?.setAnimation(0,"Idle",true);
    }
    Move()
    {



        this.UnitState= UnitState.usMoving; 
        this._MovingLife =this.MoveLife;
        this.AM?.clearTrack(0);
        this.AM?.setAnimation(0,"Walk",true);
    }



    _MovingLife =0;
    _MovingWaiting=0;
    _Moving(dt)
    {
        this._MovingLife-=dt;
        if(this._MovingLife<=0)
        {
            this.Idea();
            return;
        }
        this.node.position= this.node.position.add(cc.v3(-1*this.Speed*dt,0,0));

        if(this.uiMovingCD!=null && this.uiMovingCD.node.parent.activeInHierarchy) 
            this.uiMovingCD.node.parent.active=false;
    }
    update (dt) 
    {
        super.update(dt);

        if(this.State!=LiveState.osLiving ) return;



        if(this.UnitState== UnitState.usIdea)
            this._Ideaing(dt);
        else if(this.UnitState== UnitState.usMoving)
            this._Moving(dt);

    }
}
