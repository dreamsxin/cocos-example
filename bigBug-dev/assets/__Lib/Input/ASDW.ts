// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export namespace NL.Input
{
    const {ccclass, property} = cc._decorator;

    @ccclass
    export  class ASDW extends cc.Component {
    
        @property
        SpeedAD:number =10;
        @property
        SpeedWS:number =10;
    
        start () 
        {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKey, this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyOff, this);
        }


        LEFT=false;
        RIGHT=false;
        UP=false;
        DOWN=false;

        onKey (event) 
        {      

            switch(event.keyCode)
            {            
                case cc.macro.KEY.a:         
                this.LEFT=true;
                     break;   
                case cc.macro.KEY.d:         
                this.RIGHT=true;
                        break;   
                case cc.macro.KEY.s:         
                this.DOWN=true;
                          break;   
                case cc.macro.KEY.w:         
                this.UP=true;
                        break;   
            }    

           
        }  
        onKeyOff(event)
        {
            switch(event.keyCode)
            {            
                case cc.macro.KEY.a:         
                this.LEFT=false;
                     break;   
                case cc.macro.KEY.d:         
                this.RIGHT=false;
                        break;   
                case cc.macro.KEY.s:         
                this.DOWN=false;
                          break;   
                case cc.macro.KEY.w:         
                this.UP=false;
                        break;   
            }   

        }
         update (dt) 
         {

            let dx=0;let dy=0;

            if(this.LEFT)
                dx-=this.SpeedAD;
            if(this.RIGHT)
                dx+=this.SpeedAD;    

            if(this.UP)
                dy+=this.SpeedWS;
            if(this.DOWN)
                dy-=this.SpeedWS;    


            this.node.position= this.node.position.add(cc.v3(dx*dt,dy*dt,0));

         }
    }
}

