// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class INI 
{
    private    _DATA;


    ToIni():string
    {
        return "";
    }
    





    static  FromJsonString(str):any
    {
        var OB=null;
        
        try {
            OB =JSON.parse(str);
        } catch (error) {
            
        }
        return OB;
    }
    static  IniToJson(str:string):string
    {
        var json= this.ReplaceAll(str," ","");
        
        json="{\""+this.ReplaceAll(str,"=","\":\"");

        json=this.ReplaceAll(json,",","\";\"");

        json+="\"}";

        json=this.ReplaceAll(json,";",",");

        return json;

    }

    private static ReplaceAll(str:string ,old,newc):string
    {
        if(str==null) return "";

        var i=str.search(old);
        while( i>=0)
        {
            str =str.replace(old,newc);
            i=str.search(old);
        }
        return str;
    }

}
