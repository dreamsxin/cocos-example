// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreCopyItem extends RenderListItem {

    @property(MultiLabel)
    lb_style: MultiLabel = null;
    @property(MultiLabel)
    lb_score: MultiLabel = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    showData() {
        this.lb_score.string = this.data.score;
        this.lb_style.string = dataManager.clotheProxy.getStyleText(this.data.id);
    }
    // update (dt) {}
}
