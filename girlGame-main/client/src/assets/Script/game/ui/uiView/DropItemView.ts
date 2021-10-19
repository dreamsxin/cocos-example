// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import { uiManager } from "../../../base/ui/UIManager";
import { dataManager } from "../../data/DataManager";
import StyleCopyItem from "../uiComponent/searchView/StyleCopyItem";
import TagCopyItem from "../uiComponent/searchView/TagCopyItem";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import ClothTagController from "../uiComponent/clothView/ClothTagController";
import ClothDecomposeCopyItem from "../uiComponent/clothView/ClothDecomposeCopyItem";
import { utils } from "../../../util/Utils";
import RenderListItem from "../uiComponent/common/RenderListItem";
import RenderList from "../uiComponent/common/RenderList";
import MultiLabel from "../../../util/MultiLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DropItemView extends UIView {



    @property(RenderList)
    list: RenderList = null;


    @property(MultiLabel)
    lb_title: MultiLabel = null;


    onOpen(uiid, args) {
        this.list.data = args[0];
        if(args[1]){
            this.lb_title.string = dataManager.GetTextById(408);
        }else {

            this.lb_title.string = dataManager.GetTextById(123);
        }
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

    onDestroy() {

    }

}
