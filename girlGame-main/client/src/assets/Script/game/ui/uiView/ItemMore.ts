// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import { utils } from "../../../util/Utils";
import RenderList from "../uiComponent/common/RenderList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemMore extends UIView {



    @property(RenderList)
    renderList: RenderList = null;

    onOpen(uiid, itemDatas) {
        if (itemDatas) {
            this.renderList.data = itemDatas;
        }
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

    onDestroy() {

    }

}
