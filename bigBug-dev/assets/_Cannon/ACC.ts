// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HTTP from "../__Lib/HTTP/HTTP";
import GM from "./GM";
import Level from "./Level/Level";
import INI from "../__Lib/INI/Ini";
import SYS from "../__Lib/SYS";

const {ccclass, property} = cc._decorator;
export class ACCSaving 
{
    Level:number=1;
    Gold:number=0;
    constructor(_ini:string)
    {
        this.FromIni(  _ini);
    }


    SetLevel(level:number):ACCSaving
    {
        this.Level= level;
        return this;
    }
    SetGold(gold:number):ACCSaving
    {
        this.Gold=gold;
        return this;
    }

    FromIni( _ini:string)
    {
        var json =  INI.IniToJson(_ini);

        var data= INI.FromJsonString( json);
        try
        {
            this.Level =Number.parseInt(data.level)  ;
        }catch{}

        try
        {
            this.Gold =Number.parseInt(data.gold);
        }catch{}


    }
    ToIni():string
    {
        return "level="+this.Level.toFixed(0) 
             +",gold="+this.Gold.toFixed(0);
    }



}

@ccclass
export default class ACC extends cc.Component {

    @property
    AccID:string="";

    @property 
    URL_Record_Get:string="Saving/Get_JS";
    @property
    URL_Record_Set:string="Saving/Up";


    static ACCID:string;
    static SAVING:ACCSaving;

    static LOADOK:boolean=false;
    static _Instance;
    onLoad()
    {      
        ACC._Instance=this;
        cc.game.addPersistRootNode(this.node);

        // if(this.ForRandomDebug)
        //     this.ACCID="acc"+(100*Math.random()).toFixed(0);
    }

    start()
    {
        this.scheduleOnce(this._Init,0.1);
    }
    _Init()
    {
        this.AccID = SYS.NOWACC;
        ACC.ACCID =this.AccID ;

        this._ReadFromWeb(()=>
        {
            ACC.LOADOK=true;
        });
    }  

    _ReadFromWeb(on:()=>void)
    {

        
        //Saving/Get_JS?_game=SpeedJumper&_name=Leveling&_acc=acc
        HTTP.Request(this.URL_Record_Get,this.node)
            .SetForm(["_acc",this.AccID,"_game",GM.GAMENAME,"_name","saving"]).Wait(( (sucess,r)=>
            {

                this._OnSavingLoad(r);
       
                on?.call(this);

            } ).bind(this));
            
    }
    _OnSavingLoad(saving)
    {
        try
        {
            var info= JSON.parse(saving);
            ACC.SAVING=new ACCSaving(info.saving);
            
            if(this.AccID==null || this.AccID.length<1)
            {
                this.AccID = info.acc;   
                ACC.ACCID =this.AccID ;
                SYS.SAVE(this.AccID);             
            }
        }catch{}


    }
    _SaveToWeb(_saving)
    {
        //_game=Bigbug&_name=saving&_acc=acc&_saving=level1
        HTTP.Request(this.URL_Record_Set,this.node)
            .SetForm(["_acc",this.AccID,"_game",GM.GAMENAME,"_name","saving","_saving",_saving]).Wait(( (sucess,r)=>
            {

            } ).bind(this));
    }
    _Dosave()
    {
        var _saving=ACC.SAVING.ToIni();
        this._SaveToWeb(_saving);
    }

    TrySave()
    {
        this.unschedule(this._Dosave);
        this.scheduleOnce(this._Dosave,0.2);
    }

    static  SAVE()
    {
        ACC._Instance?.TrySave();
    }

}
