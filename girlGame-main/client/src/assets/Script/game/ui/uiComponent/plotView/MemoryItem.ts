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
import RenderListItem from "../common/RenderListItem";
import ChapterMemoryCopyItem from "./ChapterMemoryCopyItem";
import SectionMemoryCopyItem from "./SectionMemoryCopyItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MemoryItem extends RenderListItem {

    @property(ChapterMemoryCopyItem)
    chapterCopy: ChapterMemoryCopyItem = null;

    @property(SectionMemoryCopyItem)
    sectionCopy: SectionMemoryCopyItem = null;

    // onLoad () {}

    showData() {
        this.chapterCopy.node.active = false;
        this.sectionCopy.node.active = false;

        if (this.data.id < 100) {
            this.chapterCopy.data = (this.data);
            this.chapterCopy.node.active = true;
        } else {
            this.sectionCopy.updateInfo(this.data.id);
            this.sectionCopy.node.active = true;
        }
    }
}
