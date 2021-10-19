
import { _decorator, Component, Animation, v3, CCFloat, KeyCode, BoxCollider2D, PhysicsSystem2D, Contact2DType, Collider2D, IPhysics2DContact, Node, RigidBody2D, Sprite } from 'cc';
import { CollisionObject } from './CollisionObject';
import { GameControl } from './GameControl';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = Character
 * DateTime = Sun Sep 19 2021 09:18:30 GMT+0700 (Indochina Time)
 * Author = thien426
 * FileBasename = Character.ts
 * FileBasenameNoExtension = Character
 * URL = db://assets/Script/Character.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
enum CharacterStatus
{
    Idle,
    MoveLeft,
    MoveRight
}

enum PositionCollider
{
    Head,
    Body,
    Foot
}

@ccclass('Character')
export class Character extends Component 
{
    @property(Animation)
    moveAnimation: Animation;

    @property(CCFloat)
    jumpHeight: Number;

    @property(CCFloat)
    jumpDuration: Number;

    @property(CCFloat)
    speedMove: Number;

    @property(CollisionObject)
    collisionObject: CollisionObject;

    _status: CharacterStatus;

    _idle: string;
    _left: string;
    _right: string;

    _currentKey: KeyCode = KeyCode.NONE;
    _listKey: KeyCode[] = [];

    _isJumping: boolean = false;
    _remainingJumpTime: number = 0;
    _speedJump: number = 0;

    _isRight: boolean = false;

    start ()
    {
        var clips = this.moveAnimation.clips;
        this._idle = clips[CharacterStatus.Idle].name;
        this._left = clips[CharacterStatus.MoveLeft].name;
        this._right = clips[CharacterStatus.MoveRight].name;

        this.setCharacterStatus(CharacterStatus.Idle);

        if(PhysicsSystem2D.instance)
        {
            PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
            PhysicsSystem2D.instance.on(Contact2DType.END_CONTACT, this.onEndContact, this);
        }
    }

    onKeyDown(key: KeyCode)
    {
        if(key == KeyCode.ARROW_UP)
        {
            this.setupJump();
            return;
        }

        if(this._currentKey == key) return;
        
        switch (key) 
        {
            case KeyCode.ARROW_LEFT:
                this.setCharacterStatus(CharacterStatus.MoveLeft);
                this._currentKey = key;
                this._listKey.push(key);
                break;

            case KeyCode.ARROW_RIGHT:
                this.setCharacterStatus(CharacterStatus.MoveRight);
                this._currentKey = key;
                this._listKey.push(key);
                break;

            default:
                break;
        }
    }

    onKeyUp(key: KeyCode)
    {
        var index = this._listKey.indexOf(key);
        if(index < 0) return;

        this._listKey.splice(index, 1);
        
        if(this._listKey.length == 0)
        {
            this._currentKey = KeyCode.NONE;
            this.setCharacterStatus(CharacterStatus.Idle);
            return;
        }

        if(index != this._listKey.length) return;
        
        this.onKeyDown(this._listKey.pop());
    }

    setupJump()
    {
        if(this._isJumping) return;

        this._isJumping = true;
        this._remainingJumpTime = this.jumpDuration.valueOf();
        this._speedJump = this.jumpHeight.valueOf() / this.jumpDuration.valueOf();
    }

    setCharacterStatus(status: CharacterStatus)
    {
        if(this._status == status) return;
        this._status = status;

        switch (status) 
        {
            case CharacterStatus.Idle:
                this.moveAnimation.play(this._idle);
                break;
            
            case CharacterStatus.MoveLeft:
                this._isRight = false;
                this.moveAnimation.play(this._left);
                break;

            case CharacterStatus.MoveRight:
                this._isRight = true;
                this.moveAnimation.play(this._right);
                break;

            default:
                this.moveAnimation.play(this._idle);
                break;
        }
    }

    onJump(dt: number)
    {
        if(this._isJumping == false) return;

        var timeFall = Math.max(0, dt - this._remainingJumpTime);
        var timeJump = dt - timeFall;
        var deltaY = this._speedJump * (timeJump - timeFall);

        this._remainingJumpTime = this._remainingJumpTime - timeJump;

        var pos = v3(this.node.position);
        pos.y += deltaY;
        this.node.position = pos;
    }

    onMove(dt: number)
    {
        if(this._status == CharacterStatus.Idle) return;

        var director = this._isRight ? 1 : -1;
        var deltaX = director * this.speedMove.valueOf() * dt;

        var pos = v3(this.node.position);
        pos.x += deltaX;
        this.node.position = pos;
    }

    update(dt: number)
    {
        this.onJump(dt);
        this.onMove(dt);
    }

    onBeginContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        var otherLayer = otherCollider.node.layer;
        switch (selfCollider.tag) 
        {
            case PositionCollider.Head:
                if(otherLayer == 2) this._remainingJumpTime = 0;
                break;
        
            case PositionCollider.Foot:
                if(otherLayer == 2)
                {
                    this._isJumping = false;
                    this._remainingJumpTime = 0;
                }
                break;

            case PositionCollider.Body:
                if(otherLayer == 4)
                {
                    GameControl.instance.onCollectStar();
                    otherCollider.enabled = false;
                    otherCollider.getComponent(Sprite).enabled = false;
                }
                break;

            default:
                break;
        }
    }

    onEndContact (selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null)
    {
        var otherLayer = otherCollider.node.layer;
        switch (selfCollider.tag) 
        {
            case PositionCollider.Foot:
                if(otherLayer == 2) this._isJumping = true;
                break;
        
            default:
                break;
        }
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
