import Scene from "../System/Scene";
import Planet from "../Game/planet";
import { Util } from "../System/Util";
import Moon from "../Game/Moon";
import Panel from "../System/Panel";
import PanelManager from "../System/PanelManager";
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScene extends Scene {
    @property(Planet)
    public moon:Moon = null;
    @property(cc.Button)
    public gameOverBtn:cc.Button = null;

    private lastCenterPlanet:Planet = null;
    public planets:Planet[] = null;
    public onLoad(){
        this.planets = this.node.getComponentsInChildren(Planet);
        this.planets.splice(this.planets.indexOf(this.moon), 1);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)  
        this.gameOverBtn.node.on("click", this.onGameOverBtnTap, this)      
    }
    public onDestroy(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)  
        this.gameOverBtn.node.off("click", this.onGameOverBtnTap, this)  
    }
    public start(){
        let planet = this.planets[Util.randomIdx(this.planets.length)];
        this.moon.radian = 0;
        this.moon.node.x = planet.node.x;
        this.moon.node.y = planet.node.y + planet.range * 0.8;
        this.moon.RotatAround(planet.node);
        this.lastCenterPlanet = planet;
    }
    public update(){
        let target = null;
        for(let i=0, len=this.planets.length; i<len; i++){
            let planet = this.planets[i];
            if(planet === this.lastCenterPlanet){
                continue;
            }
            let magSqr = this.moon.node.position.sub(planet.node.position).magSqr();
            if(magSqr < Math.pow(planet.range, 2)){
                target = planet;
                break;
            }
        }
        if(target){
            this.moon.captured(target);
            this.lastCenterPlanet = target;
        }
    }
    private touchStartPos = null;
    private onTouchStart(e:cc.Event.EventTouch){
        this.touchStartPos = e.getLocation();
        cc.director.getScheduler().setTimeScale(0.15)
        this.moon.aim();
    }
    private onTouchMove(e:cc.Event.EventTouch){
        let dir = e.getLocation().sub(this.touchStartPos);
        this.moon.setArrowDir(Util.angle(dir)+180);
    }
    private onTouchEnd(e:cc.Event.EventTouch){
        let dir = e.getLocation().sub(this.touchStartPos);
        cc.director.getScheduler().setTimeScale(1)
        this.moon.launch();
    }
    private onGameOverBtnTap(){
        this.OpenPanel("GameOverPanel",(panel:Panel)=>{
            
        });
    }
}
