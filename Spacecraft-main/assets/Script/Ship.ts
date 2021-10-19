import Comet from "./Comet";
import Constants from "./Constants";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CustomEventListener from "./CustomEventListener";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ship extends Comet{

    @property(cc.ParticleSystem)
    fire: cc.ParticleSystem = null

    @property
    width = 15

    private _scale = 1
    private _engineScale = 0
    public callBack: Function = null
    private _camera:cc.Node = null


    onLoad () {

        this.node.width = this.width
        this.node.height = this.width*2
        this._scale = this.width / 15

        const phy:cc.PhysicsBoxCollider = this.getComponent(cc.PhysicsBoxCollider)
        phy.size = cc.size(this.width, this.width*2)
    }

    start() {
        CustomEventListener.on(Constants.EventName.GAME_START, this.gameStart, this)
        CustomEventListener.on(Constants.EventName.GAME_PAUSE, this.gamePause, this)
        CustomEventListener.on(Constants.EventName.GAME_OVER, this.gamePause, this)
        CustomEventListener.on(Constants.EventName.GAME_LOSE, this.gamePause, this)
    }

    gameLose() {
        this.playing = false
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_LOSE)
    }
    private _engineState = false
    updateEngine(f: number = 0) {
        this._engineScale = f > 1 ? 1: ( f < 0 ? 0 : f )
        if (this._engineScale == 0 ) {
            if (this._engineState) {
                this.fire.stopSystem()
                this._engineState = false
            }
        } else {
            this.fire.posVar = cc.v2(this.node.width/this._scale>15?this.node.width/this._scale-15:0,0)
            this.fire.life = f* 0.2
            this.fire.lifeVar = f* 0.2
            this.fire.speed = f * 200 + 100*this._scale
            if(!this._engineState) {
                this.fire.resetSystem()
                this._engineState = true
            }
        }
    }

    update(dt) {
        if(this._camera) {
            this._camera.setPosition(this.node.position)
            // cc.Camera.
        }
        super.update(dt)
    }
    setCamera(c: cc.Node) {
        this._camera = c
    }
    onBeginContact( contact, selfCollider, otherCollider){
        if(selfCollider.tag == 0 && otherCollider.tag == 0){
            //cc.log("onBeginContact...");  //碰撞开始
            this.contactFunction(selfCollider, otherCollider);
        }
    }

　　onEndContact (contact, selfCollider, otherCollider){
        //cc.log("onEndContact...");//碰撞结束 
    }

　　onPreSolve(contact, selfCollider, otherCollider){
        //cc.log("onPreSolve...");//碰撞持续,接触时被调用
    }

　　onPostSolve (contact, selfCollider, otherCollider){
        //cc.log("onPostSolve...");//碰撞接触更新完后调用,可以获得冲量信息
    }

    //碰撞监听
    contactFunction (selfCollider, otherCollider){
        if( this.playing){

            if (this.callBack)
                this.callBack(selfCollider, otherCollider);
        }
    }

    contactCallBack (callBack){
        this.callBack = callBack;
    }

}
