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
import { uiManager } from "../../../../base/ui/UIManager";
import { UIID } from "../../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SectionMemoryCopyItem extends cc.Component {

    @property(MultiLabel)
    lb_name: MultiLabel = null;
    private sectionId = 0;
    // onLoad () {}

    start() {

    }
    updateInfo(id) {
        this.sectionId = id;
        let data = dataManager.storyProxy.getSectionData(id);
        this.lb_name.string = data.chapterId + '-' + data.sectionId + ' ' + dataManager.GetTextById(data.name);

    }

}
