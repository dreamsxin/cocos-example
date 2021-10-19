// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import HTTP from "./HTTP";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Requester extends cc.Component {

    @property
    Url :string="Game/Info";

    _FormData:string;
    _ON:Function;
    Wait(on:(sucess:boolean,result:string)=>void):Requester
    {
        
        this._ON=on;        return this;
    }
    Set(url:string):Requester
    { 
        this.Url=url;        return this;
    }
    SetForm(pamrams:string[]):Requester
    {
        this._FormData="";
        if(pamrams==null || pamrams.length<2)   return;

        for(var i=0;i<pamrams.length / 2 ;i++)
        {
            if(this._FormData!=null && this._FormData.length>1)
                this._FormData+="&";
            if(pamrams[i*2]!=null && pamrams[i*2].length>0)
            {
                if(pamrams[i*2+1]==null)
                    pamrams[i*2+1]="";
                this._FormData+=pamrams[i*2]+"="+pamrams[i*2+1];
            }

        }

        return this;
    }

    FullURL():string{return  this.Url.startsWith("http")?this.Url:    HTTP.DOMAIN+""+this.Url;}
    start()
    {
        this.scheduleOnce(this.__Init,0.1);
    }
    __Init()
    {
        let request = new XMLHttpRequest();
        request.timeout=HTTP.TIMEOUT;

        var url=this.FullURL();   

        request.open("POST", url, true);

        // setRequestHeader方法必须在  open()方法和 send() 方法之间调用。
        // 如果多次对同一个请求头赋值，只会生成一个合并了多个值的请求头。
        // 若使用的是cocos引擎，在原生平台需要设置此HTTP头部信息
        // xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");

        request.setRequestHeader("Authorization", "true");

        request.onerror = function (res) 
        {
            this._OnErr(res);
        }.bind(this);
        request.ontimeout=function()
        {
            this._OnErr("TIMEOUT");
        }.bind(this);
        request.onreadystatechange = function () 
        {
            console.log("[request.readyState="+request.readyState+"]" + "[request.status="+request.status+"]");

            if (request.readyState === 4 &&  (request.status >= 200 && request.status < 300)) 
            {
               this._OnSuccess(request.responseText);
            }
        }.bind(this);
        // 发送 obj  若发送 JSON str 则头部信息设为：xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        
        request.send(this._FormData);
        //request.send();
        return request;
    }
    _OnSuccess(str)
    {
        console.log("[HTTP OK:]"+this.FullURL()+"  =   "+str);
        this._ON?.call(this,true,str);
    }
    _OnErr(e)
    {     
        console.log("[HTP ERR:]"+this.FullURL()+"  =   "+e);
        this._ON?.call(this,false,e);
    }
    // update (dt) {}
}
