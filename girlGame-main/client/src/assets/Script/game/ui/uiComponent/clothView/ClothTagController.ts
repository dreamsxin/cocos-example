// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {dataManager} from "../../../data/DataManager";
import ClothChoosetypeItem from "./ClothChoosetypeItem";
import ToggleCopyItem from "./ToggleCopyItem";
import ClothTagItem from "./ClothTagItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ClothTagController extends cc.Component {

    @property(cc.Node)
    node_copy_tag: cc.Node = null;

    private node_list = [];
    // LIFE-CYCLE CALLBACKS:

    private srv=null;
    // onLoad () {}
    onLoad()
    {
    }
    initClothTypes(callback)
    {
        this.srv = this.node.getComponent(cc.ScrollView);
        this.node_list.splice(0);
        for(var bigType in dataManager.getAccessorieFirstTypeData())
        {
            let data = dataManager.getAccessorieFirstTypeData()[bigType];
            var item = cc.instantiate(this.node_copy_tag).getComponent(ClothTagItem);
            item.initData(data,callback);
            item.node.parent =  this.srv.content;
            item.node.active = true;
            item.getComponent(cc.Toggle).isChecked = this.node_list.length == 0;
            if(this.node_list.length==0){

                callback(data);
            }
            this.node_list.push(item);
        }
    }
    onDestroy(){
        for (var i in this.node_list){
            this.node_list[i].destroy();
        }
        this.node_list.splice(0);
    }
}
