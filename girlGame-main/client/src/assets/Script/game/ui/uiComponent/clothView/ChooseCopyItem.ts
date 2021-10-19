// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {resLoader} from "../../../../base/res/ResLoader";
import {dataManager} from "../../../data/DataManager";
import SysDef from "../../../../util/SysDef";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ChooseCopyItem extends cc.Component {

    @property(cc.Node)
    node_active: cc.Node = null;

    @property(cc.Sprite)
    spr_icon: cc.Sprite = null;
    // LIFE-CYCLE CALLBACKS:

    private tagID:number=-1;

    private callBack=null;
    private data=null;
    start () {

    }
    init(id,data,callback){
        this.callBack = callback;
        this.data = data;
        this.node_active.active =false;
        this.tagID = id;
        var self = this;
        resLoader.loadRes(SysDef.getCreateRoleUrl(this.data.icon),cc.Texture2D,(error,res)=>{
            let sf = new cc.SpriteFrame(res);
            this.spr_icon.spriteFrame = sf;
        })
    }
    onClickHandle()
    {
        this.callBack(this.data);
    }
    updateState(st)
    {
            this.node_active.active = st;
    }
    getTagId():number{
        return  this.tagID;
    }
    // update (dt) {}
}
