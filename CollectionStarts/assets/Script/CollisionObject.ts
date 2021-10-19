
import { _decorator, Component, Node, CCBoolean, UITransform, math, Vec3, CCInteger, Enum } from 'cc';
import { CollisionManager } from './CollisionManager';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CollisionObject
 * DateTime = Sat Oct 02 2021 11:49:40 GMT+0700 (Indochina Time)
 * Author = thien426
 * FileBasename = CollisionObject.ts
 * FileBasenameNoExtension = CollisionObject
 * URL = db://assets/Script/CollisionObject.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */

export enum CollisionType
{
    Character,
    Ground,
    Star,
    Length
}
 
@ccclass('CollisionObject')
export class CollisionObject extends Component 
{
    @property(CCBoolean)
    isDynamic: Boolean = false || true;

    @property(CCBoolean)
    isDestroy: Boolean = false || true;

    @property({type: Enum(CollisionType)})
    type: CollisionType = CollisionType.Length;

    _uiTransform: UITransform;
    _previousRect: math.Rect;
    _type: number;

    start() 
    {
        if(this.node.name.includes("Character")) 
        {
            this._type = CollisionType.Character;
        }
        else if(this.node.name.includes("Ground")) 
        {
            this._type = CollisionType.Ground;
        }
        else if(this.node.name.includes("Star"))
        {
            this._type = CollisionType.Star;
        }
        else
        {
            return;
        }

        this._uiTransform = this.node.getComponent(UITransform);
        if(this._uiTransform == null) return;

        this._previousRect = this._uiTransform.getBoundingBox();

        CollisionManager.instance.registerObject(this);
    }

    public getBoundingBox(): math.Rect
    {
        return this._uiTransform.getBoundingBox();
    }

    public onCallBackCollision()
    {
        if(this.isDestroy == false) return;

        CollisionManager.instance.unRegisterObject(this);

        this.node.destroy();
    }

    public SetPreviousRect()
    {
        this._previousRect = this._uiTransform.getBoundingBox();
    }

    public GetPreviousRect(): math.Rect
    {
        return this._previousRect;
    }

    public SetPosition(position: Vec3)
    {
        this.node.position = position;
    }

    public GetType(): number
    {
        return this._type;
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
