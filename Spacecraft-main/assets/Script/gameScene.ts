import Comet from "./Comet";
import Constants from "./Constants";
import CustomEventListener from "./CustomEventListener";
import JoyStick from "./JoyStick";
import SpaceMap from "./map";
import MapManager from "./MapManager";
import PauseUI from "./PauseUI";
import ResultUI from "./ResultUI";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Ship from "./Ship";
import Star from "./Star";
import Target from "./target";

const {ccclass, property} = cc._decorator;

enum GameState {
    LOADING = 'loading',
    LOADED = 'loaded',
    PLAYING = 'playing',
    PAUSE = 'pause'
}

@ccclass
export default class GameScene extends cc.Component {

    @property(cc.Prefab)
    ship = null

    @property(cc.Prefab)
    target = null

    @property(MapManager)
    mapManager = null

    @property(cc.Node)
    gameLayer = null

    @property([cc.Sprite])
    targets = []

    @property([Star])
    stars = []
    
    @property(cc.Label)
    targetLabel = null

    @property(cc.Label)
    levelLabel = null

    @property(JoyStick)
    stick = null

    @property(cc.Prefab)
    resultPrefab = null

    @property(cc.Node)
    resultUI = null

    @property(cc.Node)
    targetLayer = null

    @property(cc.Node)
    camera = null

    private _selectedStage = 1
    private _targetsNum = 0
    private _shipNode: cc.Node = null
    public gameState = GameState.LOADING

    private _targetIndex = 0
    private _ship: Ship = null
    private _useTime = 0

    onLoad() {
        this.gameState = GameState.LOADING
        let manager = cc.director.getPhysicsManager()
        manager.enabled = true

        this.resetGame()

        CustomEventListener.on(Constants.EventName.GAME_START, this.gameStart, this)
        CustomEventListener.on(Constants.EventName.GAME_PAUSE, this.gamePause, this)
        CustomEventListener.on(Constants.EventName.GAME_LOSE, this.gameLose, this)
        CustomEventListener.on(Constants.EventName.GAME_OVER, this.gameOver, this)
        CustomEventListener.on(Constants.EventName.GAME_RESET, this.resetGame, this)
    }

    onDestroy() {
        CustomEventListener.off(Constants.EventName.GAME_START, this.gameStart, this)
        CustomEventListener.off(Constants.EventName.GAME_PAUSE, this.gamePause, this)
        CustomEventListener.off(Constants.EventName.GAME_LOSE, this.gameLose, this)
        CustomEventListener.off(Constants.EventName.GAME_OVER, this.gameOver, this)
        CustomEventListener.off(Constants.EventName.GAME_RESET, this.resetGame, this)
    }

    start () {
    }

    gameStart() {
        this.gameState = GameState.PLAYING
    }

    pauseButtonPressed () {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_PAUSE)
        let r: ResultUI = this.resultUI.getComponent(ResultUI)
        r.show()
    }

    gameContinue() {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_START)
    }

    gamePause() {
        this.gameState = GameState.PAUSE
    }

    gameOver() {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_PAUSE)
        let p: ResultUI = this.resultUI.getComponent(ResultUI)
        p.show(1, this._targetIndex, this._useTime)
    }

    gameLose() {
        CustomEventListener.dispatchEvent(Constants.EventName.GAME_PAUSE)

        let p: ResultUI = this.resultUI.getComponent(ResultUI)
        p.show(-1)
    }

    resetGame () {   
        this._selectedStage = parseInt(cc.sys.localStorage.getItem('selectedStage')) || 1
        this.levelLabel.string = `LEVEL:${this._selectedStage}`
        this._targetIndex = 0
        this._useTime = 0
        this._targetsNum = 0
        this.reloadMap(this._selectedStage-1)

        this.scheduleOnce(function(){
            CustomEventListener.dispatchEvent(Constants.EventName.GAME_START)
        }, 0.5)
    }

    private _starDistance = cc.v2()
    private _starTarget = cc.v2()

    private _k = 0.1
    private _fk = 0.8
    update(dt) {
        if (this.gameState != GameState.PLAYING) return
        this._useTime += dt
        // 油门开度
        let f = this.stick.stickV2.mag()/this.stick.radius_max
        if (f < 0.02) f = 0
        // 尾焰长度 / 粒子发射速度
        this._ship.updateEngine(f)
        if (f > 0){
            // 油门速度
            cc.Vec2.add(this._ship.speed, this.stick.stickV2.mul(dt*f*this._fk), this._ship.speed)
            let angle = this.stick.stickV2.signAngle(cc.v2(1,0))
            this._shipNode.angle = -angle / Math.PI * 180 -90
        }
        let angle = this._shipNode.angle
        let old_angle = 0
        if (this._ship.speed.mag()>0) {
            old_angle = -this._ship.speed.signAngle(cc.v2(1,0))/Math.PI * 180 -90
        }

        // 引力
        if (this.stars.length>0) {
            for (let i = 0; i < this.stars.length; i++) {
                const starNode: cc.Node= this.stars[i];
                const star: Star = starNode.getComponent(Star)
                // 判断距离
                this._starDistance.x = starNode.position.x - this._shipNode.position.x
                this._starDistance.y = starNode.position.y - this._shipNode.position.y
                const distance = this._starDistance.mag()
                if ( distance< star.range) {
                    this._starTarget = this._starDistance.normalizeSelf()
                    const a = star.getAByDistance(distance)
                    cc.Vec2.add(this._ship.speed, this._starTarget.mul(dt * a), this._ship.speed)
                    if (f === 0 && old_angle !== 0){
                        let new_angle = -this._ship.speed.signAngle(cc.v2(1,0))/ Math.PI * 180 -90
                        this._shipNode.angle = angle-old_angle+new_angle
                    }
                }


                for (let j = 0; j < this.mapManager.currMap.comets.length; j++) {
                    const cometNode = this.mapManager.currMap.comets[j];
                    const comet = cometNode.getComponent(Comet)
                    this._starDistance.x = starNode.position.x - cometNode.position.x
                    this._starDistance.y = starNode.position.y - cometNode.position.y
                    const distance = this._starDistance.mag()
                    if ( distance< star.range) {
                        this._starTarget = this._starDistance.normalizeSelf()
                        const a = star.getAByDistance(distance)
                        cc.Vec2.add(comet.speed, this._starTarget.mul(dt * a), comet.speed)
                        let angle = comet.speed.signAngle(cc.v2(1,0))
                        cometNode.angle = -angle / Math.PI * 180 -90
                        // if (distance < star.size/2) {
                        //     cometNode.removeFromParent()
                        //     comet.playing = false
                        // }
                    }
                }
            }
        }

        // if (this._ship.speed.mag()>0) {
        //     this._ship.move(dt)
        // }
    }

    reloadMap(stage: number ){
        this.gameState = GameState.LOADING
        this.mapManager.loadMap(stage)

        const map: SpaceMap = this.mapManager.currMap.getComponent(SpaceMap)
        map.reset()
        this.resetTargets(map);

        this.stars.length = 0
        for (let i = 0; i < map.stars.length; i++) {
            this.stars.push(map.stars[i])
        }

        if (this._shipNode) {
            this._shipNode.removeFromParent()
            this._shipNode = null
        }

        this._shipNode = cc.instantiate(this.ship)
        this._shipNode.setParent(this.gameLayer)
        this._ship = this._shipNode.getComponent(Ship)
        this._ship.setCamera(this.camera)
        let _s = this
        this._ship.contactCallBack((selfCollider, otherCollider)=>{
            let group1 = selfCollider.node.group
            let group2 = otherCollider.node.group

            if((group1==='ship' && group2 === 'frame')||(group2==='ship' && group1 === 'frame')){
                this.gameLose()
                return
            }
            if((group1==='ship' && group2 === 'target')||(group2==='ship' && group1 === 'target')){
                if (group1==='ship')
                {
                    _s.mapManager.currMap.targetAchieve(otherCollider.node)
                } else {
                    _s.mapManager.currMap.targetAchieve(selfCollider.node)
                }
                _s.targets[this._targetIndex].getComponent(Target).selected(true)
                _s._targetIndex++
                if ((_s.mapManager.currMap.endNode === null || _s.mapManager.currMap.endNode.active===false) && _s._targetIndex === _s._targetsNum){
                    this.gameOver()
                }
                return
            }
            if((group1 === 'ship' && group2 === 'base')||(group2 === 'ship' && group1 === 'base')  ){
                _s.mapManager.currMap.EndAchieve()
                this.gameOver()
                return
            }
            console.log(group1, group2)
        })
        this.mapManager.setShipStartPos(this._shipNode)
        this.gameState = GameState.LOADED
    }

    private resetTargets(map: SpaceMap) {
        this._targetsNum = map.targetNodes.length;
        if (this._targetsNum > 0) {
            this.targetLabel.node.active = false;
            let num = this.targets.length;
            for (let i = 0; i < this._targetsNum; i++) {
                let n: cc.Node = null;
                if (i < num) {
                    n = this.targets[i];
                } else {
                    n = cc.instantiate(this.target);
                    this.targets.push(n);
                }
                n.active = true;
                n.setParent(this.targetLayer);
                const t: Target = n.getComponent(Target);
                t.selected(false);
            }
        } else {
            this.targetLabel.active = true;
            for (let i = 0; i < this.targets.length; i++) {
                const item = this.targets[i];
                item.active = false;
            }
        }
    }

    resetButtonPressed () {
        this.resetGame()
    }
    // update (dt) {}
}
