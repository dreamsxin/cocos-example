// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Cannon from "./OBJ/Cannon";
import Level from "./Level/Level";
import WinSuccess from "./UI/WinSuccess";
import UI from "../__Lib/Base/UI";
import { EX } from "../__Lib/EX";
import WinLevel from "./UI/WinLevel";
import WinControl from "./UI/WinControl";
import UILevelWind from "./Level/UILevelWind";
import Home from "./OBJ/Home";
import Win from "../__Lib/Base/Win";
import Follow from "../__Lib/Base/Follow";
import GMBase from "./GMBase";
import LevelTest____ from "./Level/LevelTest____";
import OBJ from "../__Lib/Base/OBJ";
import WinFire from "./UI/WinFire";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GM extends GMBase 
{

    @property(Follow)
    MainCamera: Follow = null;

    @property
    text: string = 'hello';

    @property (cc.Prefab)
    Mod_WinLevel:WinLevel=null;
    
    @property (cc.Prefab)
    Mod_WinControl:WinControl=null;

    @property (cc.Prefab)
    Mod_WinFire:WinFire=null;

    @property (cc.Prefab)
    Mod_Wind:UILevelWind=null;

    @property (cc.Prefab)
    Mod_WinSuccess:WinSuccess=null;
    @property (cc.Prefab)
    Mod_WinFaild:Win=null;

    @property (cc.Prefab)
    Mod_EFF_BGM:cc.Node=null;

    static GAMENAME="BigBug";
    static  CAMERA:Follow;
    static  LEVEL: Level = null;
    static  CANNON: Cannon = null;
    static  HOME   :Home=null;
    static G =500;
    static W =0;
    static  WA_MAX =1000;
    static CONTROLTIME=15;
    static INCONTROLING=false;
    static ACCLOOT:OBJ;
    
    static WA(stable:number,hy:number):cc.Vec2
    {
        var xx=  GM.WA_MAX*(GM.W/10)*(1- stable/(100+stable));

        return cc.v2(xx,0);
    }

    // LIFE-CYCLE CALLBACKS:
    _Win_Fire :WinFire;
    static  _Instance:GM;
    onLoad () 
    {
        GM._Instance=this;
        GM.G=-500;
        GM.CAMERA=this.MainCamera;

        this.node.addComponent(LevelTest____);
    }
    OnInit()
    {
        if(GM.LEVEL==null || GM.CANNON==null|| GM.HOME==null)   
        {
            return;
        }

        super.OnInit();

        this.SetNowLevel(GM.LEVEL.ID);

        UI.CreateWindow<WinLevel>(this.Mod_WinLevel);
        
        UI.CreateWindow<UILevelWind>(this.Mod_Wind);
        UI.CreateWindow<WinControl>(this.Mod_WinControl);

        this._Win_Fire= UI.CreateWindow<WinFire>(this.Mod_WinFire)?.getComponent(WinFire);
        this._Win_Fire?.Close();

        if(this.Mod_EFF_BGM!=null)
        {
            cc.instantiate(this.Mod_EFF_BGM).setParent(cc.director.getScene());
        }
    }
    OnBegin()
    {
        GM.LEVEL.Begin().WaitEnd((level,result)=>
            {
                if(!this.IsRuning()) return;
                this.Success(result);
            });

        GM.CANNON.Begin().WaitShoot(oo=>
            {
              if(!this.IsRuning()) return;
               if(oo!=null)
               {
                    GM.CAMERA?.Follow(oo);
               }     
               this._Win_Fire?.Close();

            }).WaitWaiting(w=>
            {
                if(!this.IsRuning()) return;
                this._DoEnemyTime();

            }).WaitWaitingOver(w=>
            {
                if(!this.IsRuning()) return;
                this._DoPlayTime();
            });    
        
        GM.HOME.WaitDead(w=>
            {
                if(!this.IsRuning()) return;
                this.Failed();
            });


    }

    _DoPlayTime()
    {
        GM.INCONTROLING=true;
        this._Win_Fire.Show();
        GM.CAMERA?.PosTo(GM.CANNON.GetWorldPosition().add(cc.v2(0,-500)));
    }
    _DoEnemyTime()
    {
        GM.INCONTROLING=false;
    }

    OnSuccess(f)
    {
        super.OnSuccess(f);

        var _golded = GM.LEVEL._Golding;
        var _timed = GM.LEVEL._Lifing;
        var _scored =GM.LEVEL.ScoreOf();

        

        
        if(this.Mod_WinSuccess!=null)
        {
            var win = UI.CreateWindow<WinSuccess>(this.Mod_WinSuccess);
            this.Mod_WinFaild=null;
            if(win!=null && win.getComponent(WinSuccess)!=null)
                win.getComponent(WinSuccess)?.Set(f).SetScore(_scored,_timed,_golded).WaitMsg((w,m)=>
                    {
                        if(m=="OK")  
                        {
                            this._DoCommit(_golded,_timed,_scored);
                            this.GoLevelNext();                           
                        }
   
                        if(m=="RETRY") this.GOLevelNow();

                    }).Show();
        }
    }
    OnFailed()
    {
        super.OnFailed();
        if(this.Mod_WinFaild!=null)
        {
            var win = UI.CreateWindow<Win>(this.Mod_WinFaild);
            this.Mod_WinSuccess=null;
            if(win!=null && win.getComponent(Win)!=null)
                win.getComponent(Win)?.WaitMsg((w,m)=>
                    {
     
                        if(m=="RETRY") this.GOLevelNow();

                    }).Show();
        }
    }
    // update (dt) {}
}
