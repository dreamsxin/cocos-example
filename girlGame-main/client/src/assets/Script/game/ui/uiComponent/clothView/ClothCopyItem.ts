// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import ClothChoosetypeItem from "./ClothChoosetypeItem";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";
import RenderListItem from "../common/RenderListItem";
import UrlLoad from "../common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothCopyItem extends RenderListItem {


    @property(cc.Node)
    node_tag: cc.Node = null;

    @property(cc.Node)
    node_checked: cc.Node = null;

    @property(cc.Node)
    node_star: cc.Node = null;

    @property(UrlLoad)
    spr_icon: UrlLoad = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    public callBack = null;
    public isChecked = false;
    private starList = [];
    protected tagList = [];

    showData() {
        this.onDestroy();
        this.initStars();
        this.initTags();
        this.updateInfo();
    }

    setChecked(isChecked: boolean) {
    }


    updateInfo() {

    }
    initStars() {
        if (this.node_star == null)
            return;

        let data = dataManager.getAccessorieData()[this.data];

        for (var i = 0; i < data.quality; i++) {
            var item = cc.instantiate(this.node_star);
            item.parent = this.node_star.parent;
            item.x = this.node_star.x + 25 * i;
            item.y = this.node_star.y;
            this.starList.push(item);
        }
    }
    initTags() {
        if (this.node_tag == null)
            return;
        for (var i = 0; i < dataManager.getAccessorieData()[this.data].style_id.length; i++) {
            var item = cc.instantiate(this.node_tag);
            item.parent = this.node_tag.parent;
            item.x = this.node_tag.x;
            item.y = this.node_tag.y - 25 * i;
            item.active = true;
            resLoader.loadRes(SysDef.styleUrl + dataManager.getAccessorieStyleData()[dataManager.getAccessorieData()[this.data].style_id[i]].icon, cc.Texture2D, (err, res) => {
                item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            })
            this.tagList.push(item);
        }
    }
    setCallBack(callback) {

        this.callBack = callback;
    }
    onClickHandle() {
        if (this.callBack)
            this.callBack(this.node, this.data);
    }
    clickUpdate(st) {

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
    }
    onDestroy() {
        for (var i = 0; i < this.starList.length; i++) {
            this.starList[i].destroy();
        }
        this.starList.splice(0);
        for (var i = 0; i < this.tagList.length; i++) {
            this.tagList[i].destroy();
        }
        this.tagList.splice(0);
    }
}
