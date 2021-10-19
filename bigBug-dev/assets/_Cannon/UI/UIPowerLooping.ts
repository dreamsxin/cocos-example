// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIOBJ from "../../__Lib/Base/UIOBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPowerLooping extends UIOBJ {


    @property (cc.Color)
    FROM:cc.Color=cc.Color.GREEN;
    @property (cc.Color)
    TO:cc.Color=cc.Color.ORANGE;

    @property(cc.Sprite)
    IMAGE: cc.Sprite = null;
    @property
    Speed: number= 1;
    @property
    Range: number= 0.3;

    @property(cc.Slider)
    LAST: cc.Slider = null;
    @property(cc.Slider)
    MARK: cc.Slider = null;
    @property(cc.Sprite)
    MARK_MIN: cc.Sprite = null;
    @property(cc.Sprite)
    MARK_MAX: cc.Sprite = null;
    __Last=0;
    __Marked=0;

    start () 
    {
        
    }
    OnShow()
    {
        super.OnShow();
        this.Reset();
    }
    __Runing=false;
    Reset():UIPowerLooping
    {
        this.__Runing=true;
        this.__Filling=0;
        return this;
    }
    Set(loopspeed,range)
    {
        this.Speed=loopspeed;
        this.Range=range;
        return this;
    }
    Now():number
    {
        this.__Last=this.__Filling;
        if(this.LAST!=null) this.LAST.progress =this.__Last;

        return this.__Filling;
    }

    __Filling:number=0;
    __Speeding=0;
    update (dt) 
    {
        if(!this.__Runing)   return;
        if(this.IMAGE==null)    return;
        
        
        var min = 0;
        var max=0.4;
        if(this.MARK!=null)
        {
            min=this.MARK.progress>this.Range?this.MARK.progress-this.Range:0;
            max=this.MARK.progress+this.Range>1?1:this.MARK.progress+this.Range;
        }
        



        if(this.MARK_MIN!=null)
        {
            this.MARK_MIN.node.x =(min-0.5)* 300;
        }

        if(this.MARK_MAX!=null)
        {
            this.MARK_MAX.node.x = (max-0.5)*300;
        }


        if(this.__Filling>max) this.__Speeding = this.Speed*(max-min)*-1;
        if(this.__Filling<min) this.__Speeding = this.Speed*(max-min);
       
        this.__Filling+=this.__Speeding*dt;



        this.IMAGE.fillRange=this.__Filling;  
        this.IMAGE.node.color=cc.Color.lerp(  this.IMAGE.node.color,this.FROM,this.TO,this.__Filling);
    }
}
