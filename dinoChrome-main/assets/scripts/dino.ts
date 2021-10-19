
import { _decorator, Component, Node, systemEvent, SystemEventType, SystemEvent, tween, Vec3, UITransform, KeyCode, Tween, Enum, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Dino
 * DateTime = Wed Sep 08 2021 10:48:41 GMT+0530 (India Standard Time)
 * Author = alokraj0024
 * FileBasename = dino.ts
 * FileBasenameNoExtension = dino
 * URL = db://assets/scripts/dino.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

 enum HURDLES
 {
     SMALL_CACTUS=1,
     MID_CACTUS,
     LARGE_CACTUS
 }


@ccclass('Dino')
export class Dino extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    jumpTween : any; 
    initPos : any;
    moveRoad : any;

    @property({type: Enum(HURDLES)})
    hurdleType = [];

    @property(SpriteFrame)
    hurdle_image = [];

    moveUp(event)
    {
        switch(event.keyCode)
        {
            case KeyCode.SPACE:
                if(this.node.position.y == this.initPos.y)
                {
                    this.jumpTween.start();
                }
        }
    }

    start () {
        this.jumpTween = tween(this.node)
                    .by(0.6,{position : new Vec3(0,180,1)},{easing: "smooth"})
                    .by(0.6,{position : new Vec3(0,-180,1)},{easing: "smooth"});
        this.initPos = this.node.getPosition();
    }
    onLoad()
    {
        systemEvent.on(SystemEvent.EventType.KEY_DOWN,this.moveUp,this);
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
