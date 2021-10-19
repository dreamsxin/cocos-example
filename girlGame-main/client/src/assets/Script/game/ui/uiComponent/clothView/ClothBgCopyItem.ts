// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


import MultiLabel from "../../../../util/MultiLabel";
import ClothView from "../../uiView/ClothView";
import { dataManager } from "../../../data/DataManager";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";
import RenderListItem from "../common/RenderListItem";
import UrlLoad from "../common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothBgCopyItem extends RenderListItem {

    @property(cc.Node)
    node_mask: cc.Node = null;

    @property(UrlLoad)
    spr_icon: UrlLoad = null;



    @property(MultiLabel)
    lb_name: MultiLabel = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    private callBack = null;
    private isChecked = false;

    showData() {

        this.isChecked = this.data.isChecked;
        this.lb_name.string = dataManager.GetTextById(dataManager.getAccessorieBgData()[this.data.id].name_id);
        this.spr_icon.url = SysDef.dress_bgUrl + dataManager.getAccessorieBgData()[this.data.id].icon;
    }
    setCallBack(callback) {

        this.callBack = callback;
    }
    onClickHandle() {
        this.isChecked = !this.isChecked;
        this.data.isChecked = this.isChecked;
        this.callBack(this.data);
        ClothView.instance.updateClothBgImage(this.spr_icon.url)
    }
    /**
     * 本Item进入ScrollView的时候回调
     */
    onEnterSrcollView() {
        this.node.opacity = 255;
        this._loadAndShowPic();
    }

    /**
     * 本Item离开ScrollView的时候回调
     */
    onExitScrollView() {
        this.node.opacity = 0;
    }

    /**
     * 加载并展示图片
     */
    private _loadAndShowPic() {
        console.log(this.lb_name.string)
    }
}
