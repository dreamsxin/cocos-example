// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import {resLoader} from "../../../../base/res/ResLoader";
import {dataManager} from "../../../data/DataManager";
import SysDef from "../../../../util/SysDef";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClothChoosetypeItem extends cc.Component {

    @property(cc.Sprite)
    spr_icon: cc.Sprite = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(cc.Node)
    node_new:cc.Node = null;

    private curData:Object=null
    private isNew:boolean=false;
    private callback:Function=null;

    updateInfo(data,isNew=false)
    {
        var self = this;
        self.curData = data
        this.updateState(isNew);
        // resLoader.loadRes(data.icon,cc.Texture2D,(err,res)=>{
        //     if(err!=null)
        //         return;
        //     self.spr_icon.spriteFrame = new cc.SpriteFrame(res);
        // })
        this.lb_name.string = dataManager.GetTextById(data.name_id);

    }
    setCallBack(callback)
    {
        this.callback = callback;
    }
    updateState(isNew)
    {
        this.isNew = isNew;
        this.node_new.active = this.isNew;
    }
    onClickTypeItem(){
        this.callback(this.curData);
    }
}
