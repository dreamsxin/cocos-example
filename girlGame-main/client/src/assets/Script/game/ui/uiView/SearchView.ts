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

const { ccclass, property } = cc._decorator;

@ccclass
export default class SearchView extends UIView {

    public static instance: SearchView = null;

    @property(cc.Node)
    node_style: cc.Node = null;
    @property(cc.Node)
    node_name: cc.Node = null;
    @property(cc.Node)
    node_tags: cc.Node = null;

    @property(cc.EditBox)
    eb_name: cc.EditBox = null;
    @property(cc.Node)
    node_copy_style: cc.Node = null;


    @property(cc.Node)
    node_copy_tag: cc.Node = null;


    private styleList = null;
    private tagList = null;
    private searchType: number = 0;
    private styleCheckedArr = [];
    private tagCheckedArr = [];
    init() {
        SearchView.instance = this;
        this.initSearchTags();
    }
    onOpen() {
        this.showSearchNodeByType(0);
    }
    onClickToogle(e, index) {
        this.showSearchNodeByType(index);
    }
    showSearchNodeByType(type) {
        this.searchType = type;
        this.node_style.active = type == 0;
        this.node_name.active = type == 1;
        this.node_tags.active = type == 2;
    }
    initSearchTags() {
        this.styleList = new Array();
        this.tagList = new Array();
        for (var style in dataManager.getAccessorieStyleData()) {
            var _node = cc.instantiate(this.node_copy_style);
            _node.parent = this.node_copy_style.parent;
            _node.active = true;
            _node.getComponent(StyleCopyItem).initData(dataManager.getAccessorieStyleData()[style], this.onClickStyleHandle.bind(this));
            this.styleList.push(_node);
        }
        for (var tag in dataManager.getAccessorieTagData()) {
            var _node = cc.instantiate(this.node_copy_tag);
            _node.parent = this.node_copy_tag.parent;
            _node.active = true;
            _node.getComponent(TagCopyItem).initData(dataManager.getAccessorieTagData()[tag], this.onClickTagHandle.bind(this));
            this.tagList.push(_node);
        }
        this.eb_name.placeholder = dataManager.GetTextById(89);
    }
    onClickStyleHandle(node) {

        this.checkStyle(node);
    }
    onClickTagHandle(node) {

        this.checkTag(node);
    }

    checkStyle(node) {
        if (node.getComponent(StyleCopyItem).isChecked) {
            var index = -1;
            for (var i = 0; i < this.styleCheckedArr.length; i++) {
                if (this.styleCheckedArr[i].getComponent(StyleCopyItem).data.id == node.getComponent(StyleCopyItem).data.id) {
                    index = i;
                    break;

                }
            }

            if (index >= 0) {
                this.styleCheckedArr[index].getComponent(StyleCopyItem).updateCheckState(false);
                this.styleCheckedArr.splice(index, 1);
            }
        } else {

            node.getComponent(StyleCopyItem).updateCheckState(true);
            var index = -1;
            for (var i = 0; i < this.styleCheckedArr.length; i++) {
                if (this.styleCheckedArr[i].getComponent(StyleCopyItem).data.opposite_id == node.getComponent(StyleCopyItem).data.id) {
                    index = i;
                    break;

                }
            }

            if (index >= 0) {
                this.styleCheckedArr[index].getComponent(StyleCopyItem).updateCheckState(false);
                this.styleCheckedArr[index] = node

            } else {
                if (this.styleCheckedArr.length == 2) {
                    this.styleCheckedArr[0].getComponent(StyleCopyItem).updateCheckState(false);
                    this.styleCheckedArr.splice(0, 1);
                }
                this.styleCheckedArr.push(node);
            }
        }


    }
    checkTag(node) {
        if (node.getComponent(TagCopyItem).isChecked) {
            var index = -1;
            for (var i = 0; i < this.tagCheckedArr.length; i++) {
                if (this.tagCheckedArr[i].getComponent(TagCopyItem).data.id == node.getComponent(TagCopyItem).data.id) {
                    index = i;
                    break;

                }
            }

            if (index >= 0) {
                this.tagCheckedArr[index].getComponent(TagCopyItem).updateCheckState(false);
                this.tagCheckedArr.splice(index, 1);
            }
        } else {

            node.getComponent(TagCopyItem).updateCheckState(true);

            if (this.tagCheckedArr.length == 2) {
                this.tagCheckedArr[0].getComponent(TagCopyItem).updateCheckState(false);
                this.tagCheckedArr.splice(0, 1);
            }
            this.tagCheckedArr.push(node);

        }


    }
    onClickCloseBtn() {
        this.styleCheckedArr = null;
        this.tagCheckedArr = null;
        this.closeSelf();
    }
    onClickSearchBtn() {
        this.closeSelf();
    }
    onDestroy() {
        for (var i in this.styleList) {
            this.styleList[i].destroy();
        }
        this.styleList.splice(0)
        for (var i in this.tagList) {
            this.tagList[i].destroy();
        }
        this.tagList.splice(0)
        SearchView.instance = this;
    }
    onClose(): any {
        return this.searchType;
    }
}
