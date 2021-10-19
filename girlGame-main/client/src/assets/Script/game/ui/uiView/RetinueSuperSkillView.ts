// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import RenderList from "../uiComponent/common/RenderList";
import RenderListItem from "../uiComponent/common/RenderListItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueSuperSkillView extends UIView {

    public static instance: RetinueSuperSkillView = null;

    @property(RenderList)
    labelList: RenderList = null;

    @property(RenderList)
    itemList: RenderList = null;

    init() {
        RetinueSuperSkillView.instance = this;
        this.initUI();
    }
    initUI() {
    }



    onDestroy() {

        RetinueSuperSkillView.instance = null;
    }
    onClickCloseBtn() {
        this.closeSelf();
    }

}
