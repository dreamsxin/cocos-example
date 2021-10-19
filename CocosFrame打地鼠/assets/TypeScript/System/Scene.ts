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
import {DB} from "./DataBind";
import PanelManager from "./PanelManager";
import { Util } from "./Util";
@ccclass
export default class Scene extends DB.DataBindComponent {
    @property
    public autoDestroy = true;
    @property
    public showBack:boolean = true;
    @property
    public showHome:boolean = true;
    @property
    public showEnergyBar:boolean = true;
    
    public navigatorItem:string[] = [];
    //打开一个面板，从场景所在文件夹查找prefab
    public OpenPanel(panelName:string, callback){
        PanelManager.ins.OpenByPath(`Scene/${this.node.name}/${panelName}`, callback);
    }
    //读取一个prefab，从场景所在文件夹查找prefab
    public instantPrefab(name:string, callback){
        Util.instantPrefab(`Scene/${this.node.name}/${name}`,callback);
    }
}
