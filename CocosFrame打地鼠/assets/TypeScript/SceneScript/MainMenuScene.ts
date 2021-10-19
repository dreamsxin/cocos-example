import Scene from "../System/Scene";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import SceneManager from "../System/SceneManager"
import PanelManager from "../System/PanelManager"
import { DB } from "../System/DataBind";
import MessageBox from "./MessageBox";
import {Util} from "../System/Util";
import Top from "../System/Top";
import Moon from "../Game/Moon";
@ccclass
export default class MainMenuScene extends Scene {
    @property(cc.Button)
    optionButton: cc.Button = null;
    @property(cc.Button)
    rankButton: cc.Button = null;
    @property(cc.Button)
    wikiButton: cc.Button = null;

    @property(cc.Node)
    zoomNode: cc.Node = null;
    @property(cc.Node)
    startMapNode: cc.Node = null;
    @property(cc.Node)
    titleNode: cc.Label = null;
    @property(cc.Node)
    cascadeOpacity:cc.Node = null;
    @property(cc.Node)
    noOpacity:cc.Node = null;
     
    @property(cc.Button)
    zoomOutBtn: cc.Button = null;
    @property(cc.Button)
    startBtn: cc.Button = null;
    @property(cc.Graphics)
    graphics: cc.Graphics = null;


    private lastPos = null;
    private starNode = null;
    private moonNode = null;
    onLoad () {
        this.Bind("archives",(archives:any[])=>{
            if(!archives && archives.length == 0){
                return;
            }
            console.log(JSON.stringify(archives));
            this.instantPrefab("archive",(prefab)=>{
                for(let i=0; i<archives.length;i++){
                    let archive = archives[i];
                    var newNode:cc.Node = cc.instantiate(prefab);
                    newNode.name = archive.name;
                    newNode.position = cc.v2(archive.x, archive.y);
                    newNode.getComponentInChildren(cc.Animation).play("ZoomIn");
                    newNode.on("click", this.onClickArchive, this)
                    this.cascadeOpacity.addChild(newNode);
                }
            })
            this.zoomOutBtn.node.getComponentInChildren(cc.Animation).play("ZoomOut");
        })
        this.optionButton.node.on("click",()=>{
            
        })
        this.rankButton.node.on("click",()=>{
            
        })
        this.wikiButton.node.on("click",()=>{
            
        })
        this.zoomOutBtn.node.on("click",()=>{
            this.zoomOut();
        })
        this.startBtn.node.on("click", this.onStartBtnTap, this)
        this.zoomOutBtn.node.active = false;
        this.startBtn.node.active = false;
    }
    private onClickArchive(e:cc.Event){
        this.zoomIn(e.target);
    }
    private zoomIn(node:cc.Node){
        this.cascadeOpacity.pauseSystemEvents(true);
        let pos:any = node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        pos = this.zoomNode.convertToNodeSpace(pos);
        Util.setAnchor(this.zoomNode, pos.x/640, pos.y/1136);
        this.lastPos = this.zoomNode.position;
        this.noOpacity.position = cc.Vec2.ZERO;
        cc.tween(this.zoomNode).to(1, {scale:100, position:cc.Vec2.ZERO}, { easing: 'circIn'}).start();
        cc.tween(this.cascadeOpacity).to(1, {opacity:0}).hide().start();
        cc.tween(this.titleNode).to(1, {position:cc.v2(0, 640)}).call(()=>{
            this.zoomOutBtn.node.active = true;
            this.startBtn.node.active = true;
        }).start();
        this.initStartMap();
        cc.tween(this.startMapNode).show().set({opacity:0}).to(1, {opacity:255}).start();
    }
    private zoomOut(){
        this.cascadeOpacity.resumeSystemEvents(true);
        this.zoomOutBtn.node.active = false;
        this.startBtn.node.active = false;
        cc.tween(this.zoomNode).to(1, {scale:1, position:this.lastPos}, { easing: 'circOut'}).start();
        cc.tween(this.cascadeOpacity).show().to(1, {opacity:255}).start();
        cc.tween(this.titleNode).to(1, {position:cc.v2(0, 300)}).start();
        cc.tween(this.startMapNode).to(1, {opacity:0}).hide().start();
    }
    private initStartMap(){
        this.startMapNode.removeAllChildren();
        let starMap = DB.Get("starMap");
        let stars:{x,y,id}[] = starMap.stars;
        let links:number[][] = starMap.links;
        let curStarId:number = starMap.curStarId;
        this.instantPrefab("star",(prefab)=>{
            let map = new Map<number,cc.Node>();
            for(let i=0; i<stars.length;i++){
                let star = stars[i];
                var newNode:cc.Node = cc.instantiate(prefab);
                newNode.position = cc.v2(star.x, star.y);
                newNode.name = "star"+star.id;
                newNode.getComponentInChildren(cc.Label).string = star.id;
                map.set(star.id, newNode);
                this.startMapNode.addChild(newNode);
                newNode.on("click", this.onStarTap, this, false);
            }
            let graphics = this.startMapNode.getComponent(cc.Graphics);
            graphics.lineWidth = 3;
            for(let i=0; i<links.length;i++){
                let link = links[i];
                let node0 = map.get(link[0]);
                let node1 = map.get(link[1]);
                graphics.moveTo(node0.position.x, node0.position.y);
                graphics.lineTo(node1.position.x, node1.position.y);
                graphics.stroke();
            }
            this.instantPrefab("moon",(prefab)=>{
                var newNode:cc.Node = cc.instantiate(prefab);
                this.startMapNode.addChild(newNode);
                this.moonNode = newNode;
                this.setStar(map.get(curStarId));
            });
        })
    }
    private onStarTap(e:cc.Event){
        this.setStar(e.target);
    }
    private setStar(starNode:cc.Node){
        if(this.starNode != starNode){
            console.log(starNode);
            this.starNode = starNode;
            this.moonNode.position = cc.v2(starNode.position.x+50, starNode.position.y);
            this.moonNode.getComponent(Moon).RotatAround(starNode);
            let motion = this.moonNode.getComponent(cc.MotionStreak);
            cc.tween(motion).set({fadeTime:0}).to(1, {fadeTime:1}).start();
        }
    }
    private onStartBtnTap(){
        SceneManager.ins.Enter("GameScene");
    }
}
