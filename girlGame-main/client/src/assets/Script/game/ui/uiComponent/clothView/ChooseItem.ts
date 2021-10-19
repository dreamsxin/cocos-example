// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import ChooseCopyItem from "./ChooseCopyItem";
import { dataManager } from "../../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChooseItem extends cc.Component {

    @property(cc.Node)
    node_menu: cc.Node = null;

    @property(cc.Node)
    node_menu_bg: cc.Node = null;

    @property(cc.Node)
    node_copy: cc.Node = null;

    private copyitems: ChooseCopyItem[] = [];

    private col: number = 4;

    private lastChooseId: number = -1;

    public isChecked: boolean = false;
    public id: number = 0;
    private dataList = [];
    private callBack = null;
    start() {

    }
    init(id, dataList, callback) {
        this.dataList = dataList;
        var num = dataList.length;
        this.id = id;
        this.copyitems.splice(0);
        this.node_menu_bg.width = 120 * Math.ceil(num / this.col);
        this.node_menu_bg.height = 110 * (this.col <= num ? this.col : Math.floor(num % this.col)) +10;
        for (var i = 0; i < num; i++) {
            var copyNode: cc.Node = cc.instantiate(this.node_copy);
            copyNode.active = true;
            copyNode.parent = this.node_menu;
            copyNode.x = -100 * Math.floor(i / this.col);
            copyNode.y = -60-i*10 - 100 * Math.floor(i % this.col);
            var copyitem = copyNode.getComponent(ChooseCopyItem);
            copyitem.init(i, dataList[i], callback);
            this.copyitems.push(copyitem);
            this.callBack = callback;

        }
    }
    onClickCopyItem(e) {
        var curId = e.target.getComponent(ChooseCopyItem).getTagId();
        if (this.lastChooseId == curId) {
            e.target.getComponent(ChooseCopyItem).updateState(false);
            this.lastChooseId = -1;
        } else {
            if (this.lastChooseId >= 0) {
                this.copyitems[this.lastChooseId].updateState(false);
            }
            e.target.getComponent(ChooseCopyItem).updateState(true);
            this.lastChooseId = curId;
        }


    }
    updateShowMenu(st) {
        this.isChecked = st;
        this.node_menu.active = st;
    }
    // update (dt) {}
}
