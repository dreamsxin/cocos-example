// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClothCopyItem from "./ClothCopyItem";
import { dataManager } from "../../../data/DataManager";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";
import RenderListItem from "../common/RenderListItem";
import UrlLoad from "../common/UrlLoad";
import MultiLabel from "../../../../util/MultiLabel";
import StyleCopyItem from "../searchView/StyleCopyItem";
import TagCopyItem from "../searchView/TagCopyItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothRenderItem extends RenderListItem {

    @property(StyleCopyItem)
    nodeStyle: StyleCopyItem = null;

    @property(TagCopyItem)
    nodeTags: TagCopyItem = null;

    @property(cc.Node)
    node_star: cc.Node = null;

    @property(UrlLoad)
    sprIcon: UrlLoad = null;

    @property(UrlLoad)
    sprBg: UrlLoad = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(MultiLabel)
    lb_dec: MultiLabel = null;

    @property(cc.Node)
    goodTag: cc.Node = null;
    @property(cc.Node)
    normalTag: cc.Node = null;
    starList: any = [];
    clothData: any = null;
    styleList: any = [];
    tagList: any = [];


    showData() {

        this.clothData = dataManager.getAccessorieData()[this.data];
        if (!this.clothData) {
            return;
        }
        if (this.lb_name) this.lb_name.string = dataManager.GetTextById(this.clothData.name_id);
        if (this.lb_dec) this.lb_dec.string = dataManager.GetTextById(this.clothData.describe_id);
        if (this.sprIcon) this.sprIcon.url = SysDef.dress_iconUrl + this.clothData.icon;
        this.updateStars();
        this.updateStyles();
        this.updateTags();
    }



    updateStars() {
        if (this.node_star == null)
            return;


        this.node_star.active = false;

        let more = this.clothData.quality - this.starList.length;
        for (let i = 0; i < more; i++) {
            let item = cc.instantiate(this.node_star);
            item.parent = this.node_star.parent;
            item.x = this.node_star.x + 25 * i;
            item.y = this.node_star.y;
            this.starList.push(item);
        }

        for (let i = 0; i < this.starList.length; i++) {
            this.starList[i].active = i < this.clothData.quality;
        }


    }

    updateStyles() {

        if (this.nodeStyle == null)
            return;

        this.nodeStyle.node.active = false;

        let more = this.clothData.style_id.length - this.styleList.length;

        for (let i = this.styleList.length; i < more; i++) {
            let item = cc.instantiate(this.nodeStyle.node);
            item.parent = this.nodeStyle.node.parent;
            item.x = this.nodeStyle.node.x;
            item.y = this.nodeStyle.node.y - 25 * i;
            item.active = true;

            /*
            resLoader.loadRes(SysDef.styleUrl + dataManager.getAccessorieStyleData()[this.clothData.main_style_id[i]].icon, cc.Texture2D, (err, res) => {
                item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
            })*/
            this.styleList.push(item);
        }

        for (let i = 0; i < this.styleList.length; i++) {
            this.styleList[i].active = i < this.clothData.style_id.length;
            if (this.styleList[i].active) {
                let bMain = false;
                if (this.clothData.main_style_id[0] === this.clothData.style_id[i]
                    || this.clothData.main_style_id[1] === this.clothData.style_id[i]) {
                    bMain = true;
                }
                this.styleList[i].getComponent(StyleCopyItem).updateInfo(this.clothData.style_id[i], this.clothData.style_num[i], bMain);
            }
        }

    }

    updateTags() {
        if (this.nodeTags == null)
            return;



        this.nodeTags.node.active = false;
        if (this.clothData.tag_id) {
            let more = this.clothData.tag_id.length - this.tagList.length;

            for (let i = this.tagList.length; i < more; i++) {
                let item = cc.instantiate(this.nodeTags.node);
                item.parent = this.nodeTags.node.parent;
                item.x = this.nodeTags.node.x;
                item.y = this.nodeTags.node.y - 25 * i;
                item.active = true;

                /*
                resLoader.loadRes(SysDef.styleUrl + dataManager.getAccessorieStyleData()[this.clothData.main_style_id[i]].icon, cc.Texture2D, (err, res) => {
                    item.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(res);
                })*/
                this.tagList.push(item);
            }
        }


        for (let i = 0; i < this.tagList.length; i++) {
            this.tagList[i].active = this.clothData.tag_id && i < this.clothData.tag_id.length;
            if (this.tagList[i].active) {
                this.tagList[i].getComponent(TagCopyItem).updateInfo(this.clothData.tag_id[i]);
            }
        }
    }

}

