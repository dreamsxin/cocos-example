
import { _decorator, Component, Node, Prefab, TiledTile, systemEvent, SystemEvent, TiledMap, tween, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Bgload
 * DateTime = Mon Sep 13 2021 16:54:56 GMT+0530 (India Standard Time)
 * Author = chandan_krishnani
 * FileBasename = bgload.ts
 * FileBasenameNoExtension = bgload
 * URL = db://assets/Typescript/bgload.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('Bgload')
export class Bgload extends Component {
    // [1]
    // dummy = '';
  

    // [2]
    // @property
    // serializableDummy = 0;
  

    start () {
        console.log(this.node.width);
        console.log(this.node.getComponent(TiledMap).getTileSize());
        this.node.on(Node.EventType.TOUCH_START,function(touch:any,event:any)
        {
            let abc:any=Math.floor(touch.getUILocation().x/16);
            console.log(abc);
            console.log(Math.floor(touch.getUILocation().y/16));
     

        },this);
        
       
        
       
        // [3]
    }
   
    update()
    {
       
    }

    
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */
