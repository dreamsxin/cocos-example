// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {UIView} from "../../../base/ui/UIView";
import {uiManager} from "../../../base/ui/UIManager";
import {dataManager} from "../../data/DataManager";
import StyleCopyItem from "../uiComponent/searchView/StyleCopyItem";
import TagCopyItem from "../uiComponent/searchView/TagCopyItem";
import ClothChoosetypeItem from "../uiComponent/clothView/ClothChoosetypeItem";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import ClothTagController from "../uiComponent/clothView/ClothTagController";
import {utils} from "../../../util/Utils";
import ToggleCopyItem from "../uiComponent/clothView/ToggleCopyItem";
import ClothStoreCopyItem from "../uiComponent/clothView/ClothStoreCopyItem";
import MultiLabel from "../../../util/MultiLabel";
import {resLoader} from "../../../base/res/ResLoader";
import SysDef from "../../../util/SysDef";
import {UIID} from "../UIConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AccessView extends UIView {

    public static instance:AccessView=null;

    @property(ClothCopyItemController)
    accessCopyItemController:ClothCopyItemController = null;

    init(){
        AccessView.instance = this;
        this.initUI();
    }
    initUI(){
        this.accessCopyItemController.init();
    }



    onDestroy(){

        AccessView.instance = null;
    }
    onClickCloseBtn(){
        this.closeSelf();
    }

}
