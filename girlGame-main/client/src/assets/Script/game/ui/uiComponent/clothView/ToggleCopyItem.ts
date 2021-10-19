// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import {dataManager} from "../../../data/DataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ToggleCopyItem extends cc.Component {

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    public first_type:number=-1;
    public second_type:number=-1;
    public index:number = 0;

    initData(index,fd,sd,name)
    {
        this.index = index;
        this.lb_name.string = dataManager.GetTextById(name);
        this.first_type = fd;
        this.second_type = sd;
    }
}
