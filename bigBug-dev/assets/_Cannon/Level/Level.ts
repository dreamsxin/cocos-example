// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Hatcher from "./Hatcher";
import LevelClock from "./LevelClock";
import ClockObj from "../OBJ/ClockObj";
import Cannon from "../OBJ/Cannon";
import GM from "../GM";
import Enemy from "../OBJ/Enemy";
import LevelWind from "./LevelWind";
import { EX } from "../../__Lib/EX";
import UIOBJ from "../../__Lib/Base/UIOBJ";
import UI from "../../__Lib/Base/UI";
import WinSuccess from "../UI/WinSuccess";
import SYS from "../../__Lib/SYS";




    const {ccclass, property} = cc._decorator;

    @ccclass
    export default class Level extends cc.Component {
    
        @property
        ID:number=1;

        @property
        Life:number=180;
        @property
        BaseScore:number=200;

        @property
        WindForce:number =100;
        @property
        WindStable:number =100;




        _CLOCK:LevelClock;
        _MY :Cannon;

        _Lifing=0;
        _Runing=false;
        _Golding=0;
        _Enmes:Array<Enemy>;
        _Wind :LevelWind;


        

        // 关卡成绩  基础分（BaseScore）* 时间奖励银子  m= 8*d/(1+d)
        ScoreOf()
        {

            var d=1-this.Progress();      
            return d<0? this.BaseScore: this.BaseScore* (8*d/(1+d));
         }


        start () 
        {
            GM.LEVEL = this;
            
            //this._CLOCK =this.getComponent(LevelClock);
            this._Wind =this.getComponent(LevelWind);

            this._MY =this.getComponentInChildren(Cannon);
            this._Wind =this.getComponent(LevelWind);


            GM.LEVEL=this;
        }
        _OnAddObj(who)
        {
            if(who==null)   return;
            
            // if(this._CLOCK!=null )
            //     this._CLOCK.Add(who,1);
            let _enm:Enemy = who.getComponent(Enemy);
  
            if(_enm!=null)
            {
                this._Enmes.push(
                    _enm.WaitDead((w=>
                    {
                    EX.ListRemove(this._Enmes,w);

                    }).bind(this))
                    );

            }





        }
        Begin():Level
        {
            
            this.scheduleOnce(this._DoBegin,0.1);
            return this;
        }

        _DoBegin()
        {
            //this._Golding = Math.ceil( 3+5*Math.random());

            this._Enmes=new Array<Enemy>();
            if( this._MY !=null)
            {
                this._MY.Name="MY";
                this._OnAddObj(this._MY);
            }



            let _hatches =this.getComponentsInChildren(Hatcher);

            _hatches?.forEach((hhh)=>
            {
                hhh.Live().WaitHatch(this._OnAddObj.bind(this) );
            })


            // if(this._CLOCK!=null)
            // {
            //     this._CLOCK.Wait((who:ClockObj)=>
            //     {
            //         who.DoTurn();
            //     }).Run();
            // }

            this._Lifing=0;
            this._Runing=true;
            if(this._Wind!=null)
            {
                this._Wind.Set(this.WindForce,this.WindStable).Reset();
            }
        }



        EndResult=0;
        End(result)
        {
            this.EndResult =result;
       

            this._Runing=false;

            SYS.PLAYSuccess();

            this.scheduleOnce(this._DoEndCallBack,0.5);
        }

        _DoEndCallBack()
        {
            this._OnEnd?.call(this,this,this.EndResult);
        }
            


        _OnEnd:Function;
        WaitEnd(on:(level:Level,result:number)=>void):Level
        {
            this._OnEnd =on;
            return this;
        }

        Name():string {return "第"+this.ID.toString()+"关"; }
        Progress():number  {  return this._Runing?this._Lifing/this.Life:0;     }
        GetEnemyCount() { return  this._Enmes==null?0:this._Enmes.length;  }
        
       
        private __Passcheck=0;
        update(dt)
        {
            if(!this._Runing)      return;

            this._Lifing+=dt;

            if(this._Lifing>this.Life)
                this._Lifing=this.Life;

            this.__Passcheck+=dt;

            if(this.__Passcheck<1)
                return;

            this.__Passcheck=0;

            var _end =this._CheckEnd();
            if(_end !=0)
            {
                this.End(_end);
            }
            
        }
        Winding():number { return this._Wind==null?0:this._Wind.Now;}

        private  _CheckEnd():number
        {
            if(this._Lifing>this.Life)
            {
                return this._Enmes.length<=0?1:0;
            }else
            {
                let _hatches =this.getComponentsInChildren(Hatcher);

                return (_hatches==null || _hatches.length<  1) &&  this._Enmes.length<=0  ?2:0;
            }
        }

        AddLoot(count)
        {
            this._Golding+=count;
        }
    }


