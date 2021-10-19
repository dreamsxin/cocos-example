
import { _decorator, Component, Node, SpriteFrame, systemEvent, SystemEvent, KeyCode, Vec3, Prefab, instantiate, CCInteger, UITransform, UIComponent, UIModelComponent } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = GamePlay
 * DateTime = Wed Sep 08 2021 14:26:45 GMT+0530 (India Standard Time)
 * Author = alokraj0024
 * FileBasename = gamePlay.ts
 * FileBasenameNoExtension = gamePlay
 * URL = db://assets/scripts/gamePlay.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('GamePlay')
export class GamePlay extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    // GENERATE A RANDOM NUMBER IN RANGE
    // Math.floor(Math.random() * (max - min + 1)) + min;

    @property(Node)
    cactus : Node = null;

    @property(Prefab)
    cactusPrefab : Prefab[] = [];

    @property(Number)
    maxNoOfObstacles = 0;

    vecX : any;
    arrayOfObstacles : any =  [];
    dinoBoundingBox : any;
    obsBoundingBox : any;
    time = 0;
    popTime = 50;
    usedObstacles : any = [];
    i = -1;


    // Intersection2D.rectRect(
    //     container.getComponent(UITransform)?.getBoundingBoxToWorld(),
    //     this.dragable.item.getComponent(UITransform)?.getBoundingBoxToWorld()!
    //     );


    /*moveObstacle(obs)
    {
        let i=-1;
        let a = setInterval(() => {
            obs.setPosition(new Vec3(this.vecX.x+(--i*20),this.vecX.y,this.vecX.z));
            if(obs.getPosition().x < -500)
            {
                this.arrayOfObstacles.push(obs);
                obs.setPosition(new Vec3(548.527,-193.655,1));
                i=-1;
                clearInterval(a);
                console.log('stopped the scheduler');
            }
        },90);
    }*/

    startTheGame()
    {
        // let i=-1;

        this.addAndMoveObstacles();
        this.schedule(this.addAndMoveObstacles,0.1);
    }

    addAndMoveObstacles(){

        this.time++;

        if(this.popTime == this.time){
            this.time = 0;
            let popped = this.arrayOfObstacles.shift();
            popped.setPosition(new Vec3(548.527,-193.655,1));
            this.usedObstacles.push(popped);
            // this.obsBoundingBox = popped.getComponent(UITransform).getBoundingBoxToWorld();
            // console.log(`${this.dinoBoundingBox} ${this.obsBoundingBox}`);
            //pop one obstacle from unsed and add to used ostacles.
        }
        this.updatePosOfUsedObstacles();
    }

    updatePosOfUsedObstacles(){

        //if(usedObs.length >0){
        
        if(this.usedObstacles.length > 0)
        {
            this.usedObstacles.forEach(element =>
                {
                    console.log('for each called');
                    element.setPosition(new Vec3(element.getPosition().x-10,-193.655,1))
                    if(element.getPosition.x < -500)
                    {
                        element.setPosition(new Vec3(548.527,-193.655,1));
                        this.arrayOfObstacles.push(element);
                    }
                });
        }
        //if position is out of screen add to un used obstacles.
    }

    start () {
        this.vecX = this.cactus.getPosition();

        for(let i=0;i<this.maxNoOfObstacles;i++)
        {
            let j = Math.floor(Math.random() * (this.cactusPrefab.length-1 - 0 + 1)) + 0;
            
            this.arrayOfObstacles[i] = instantiate(this.cactusPrefab[j]);
            this.node.addChild(this.arrayOfObstacles[i]);
            this.arrayOfObstacles[i].setPosition(new Vec3(548.527,-193.655,1));
        }

        this.dinoBoundingBox = this.node.getChildByName('DinoStart').getComponent(UITransform).getBoundingBoxToWorld();
        //console.log(this.arrayOfObstacles);
    }

    onLoad()
    {
        this.node.on(Node.EventType.MOUSE_DOWN,this.startTheGame,this);
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
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
