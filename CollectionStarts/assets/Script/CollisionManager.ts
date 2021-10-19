
import { _decorator, Component, Node, math, v3 } from 'cc';
import { CollisionObject, CollisionType } from './CollisionObject';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CollisionManager
 * DateTime = Sat Oct 02 2021 11:35:26 GMT+0700 (Indochina Time)
 * Author = thien426
 * FileBasename = CollisionManager.ts
 * FileBasenameNoExtension = CollisionManager
 * URL = db://assets/Script/CollisionManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('CollisionManager')
export class CollisionManager extends Component 
{
    // [1]
    // dummy = '';

    static instance: CollisionManager;

    _collisionMaxtrix: Array<Array<boolean>>;
    _collisionDynamic: Array<CollisionObject> = new Array();
    _collisionStatic: Array<CollisionObject> = new Array();

    onEnable()
    {
        CollisionManager.instance = this;
    }

    start() 
    {
        var character = CollisionType.Character;
        var ground = CollisionType.Ground;
        var star = CollisionType.Star;
        var length = CollisionType.Length;

        this._collisionMaxtrix = new Array(length);
        for (let i = 0; i < length; i++)
        {
            this._collisionMaxtrix[i] = new Array(length);
            for (let j = 0; j < length; j++)
            {
                this._collisionMaxtrix[i][j] = false;
            }
        }

        var characterCollison = this._collisionMaxtrix[character];
        characterCollison[ground] = true;
        characterCollison[star] = true;
    }

    public registerObject(obj: CollisionObject)
    {
        if(obj.isDynamic)
        {
            var index = this._collisionDynamic.indexOf(obj);
            if(index < 0) this._collisionDynamic.push(obj);
        } 
        else
        {
            var index = this._collisionStatic.indexOf(obj);
            if(index < 0) this._collisionStatic.push(obj);
        }
    }

    public unRegisterObject(obj: CollisionObject)
    {
        if(obj.isDynamic)
        {
            var index = this._collisionDynamic.indexOf(obj);
            if(index >= 0) this._collisionDynamic.splice(index, 1);
        } 
        else
        {
            let index = this._collisionStatic.indexOf(obj);
            if(index >= 0) this._collisionStatic.splice(index, 1)
        }
    }

    lateUpdate(dt: number)
    {
        this.onCheckCollision();
    }

    onCheckCollision()
    {
        var lengthDynamic = this._collisionDynamic.length;
        var lengthStatic = this._collisionStatic.length;

        for(let i = 0; i < lengthDynamic; i++)
        {
            var selfCollider = this._collisionDynamic[i];
            var maxtrix = this._collisionMaxtrix[selfCollider.GetType()];
            var selfRect = selfCollider.getBoundingBox();

            for(let j = 0; j < lengthStatic; j++)
            {
                var otherCollider = this._collisionStatic[j];
                if(maxtrix[otherCollider.GetType()] == false) continue;

                var otherRect = otherCollider.getBoundingBox();
                if(this.isCollision(selfRect, otherRect) == false) continue;

                selfCollider.onCallBackCollision();
                otherCollider.onCallBackCollision();

                this.onResetPosition(selfCollider, selfRect, otherRect);
            }

            selfCollider.SetPreviousRect();
        }
    }

    isCollision(rect_1: math.Rect, rect_2: math.Rect): boolean
    {
        return(rect_1.yMax >= rect_2.yMin && 
            rect_2.yMax >= rect_1.yMin &&
            rect_1.xMax >= rect_2.xMin &&
            rect_2.xMax >= rect_1.xMin);
    }

    onResetPosition(dynamicCollision: CollisionObject,dynamicRect: math.Rect, rect_2: math.Rect)
    {
        if(dynamicRect.yMax == rect_2.yMin || 
            dynamicRect.yMin == rect_2.yMax ||
            dynamicRect.xMax == rect_2.xMin ||
            dynamicRect.xMin == rect_2.xMax) return;

        var previousRect = dynamicCollision.GetPreviousRect();
        var dynamicPosition = v3(dynamicCollision.node.position);

        if(previousRect.xMax < rect_2.xMin)
        {
            var xMax = rect_2.xMin;
            dynamicPosition.x -= dynamicRect.xMax - xMax;
        }  
        else if(previousRect.xMin > rect_2.xMax)
        {
            var xMin = rect_2.xMax;
            dynamicPosition.x += xMin - dynamicRect.xMin;
        }

        if(previousRect.yMax < rect_2.yMin)
        {
            var yMax = rect_2.yMin;
            dynamicPosition.y -= dynamicRect.yMax - yMax;
        }
        else if(previousRect.yMin > rect_2.yMax)
        {
            var yMin = rect_2.yMax;
            dynamicPosition.y += yMin - dynamicRect.yMin;
        }

        dynamicCollision.SetPosition(dynamicPosition);
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
