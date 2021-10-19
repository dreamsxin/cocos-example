// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import ClothCopyItem from "../clothView/ClothCopyItem";
import ChooseItem from "../clothView/ChooseItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChapterMemoryCopyItem extends ClothCopyItem {



    @property(cc.Node)
    node_complete: cc.Node = null;

    // onLoad () {}

    start() {

    }
    updateInfo() {

        this.lb_name.string = dataManager.GetTextById(360, dataManager.GetChineseTextByNum(this.data.id)) + ' ' + dataManager.GetTextById(this.data.name);

        this.node_complete.opacity = this.data.id < dataManager.storyProxy.curStoryData.chapterId ? 255 : 0;
    }
    clickUpdate(st) {
        // this.isChecked = st;
        // this.node_checked.active = this.isChecked;
    }
}
