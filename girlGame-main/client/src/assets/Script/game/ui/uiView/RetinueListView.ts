// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventMgr } from "../../../base/common/EventManager";
import { UIView } from "../../../base/ui/UIView";
import { dataManager } from "../../data/DataManager";
import RetinueProxy from "../../data/RetinueProxy";
import RenderList from "../uiComponent/common/RenderList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueListView extends UIView {

    public static instance: RetinueListView = null;

    @property(RenderList)
    retinueList: RenderList = null;

    @property(cc.Toggle)
    tglHide: cc.Toggle = null;


    @property(cc.Node)
    nodeTip: cc.Node = null;
    retinue: any;
    pos: any;

    init() {
        EventMgr.addEventListener(RetinueProxy.infoUpdate, this.onClickCloseBtn, this);
    }

    onDestroy() {

        EventMgr.removeEventListener(RetinueProxy.infoUpdate, this.onClickCloseBtn, this);
    }

    onOpen(uiid, data) {

        this.retinue = data.retinue;
        this.pos = data.pos;
        this.initUI();
    }
    initUI() {

        this.toggleHide();

    }

    toggleHide() {

        let datas = null;
        if (this.tglHide.isChecked) {
            datas = dataManager.retinueProxy.getUnBattleData();
            if (datas) datas.sort((a, b) => {
                return b.power - a.power;
            })
        } else {
            datas = dataManager.retinueProxy.getUnLockData();
            /*
            if (datas) datas.sort((a, b) => {
                if (b.pos - a.pos == 0) {
                    return b.power - a.power;
                }
                else if (b.pos > 0 && a.pos > 0) {
                    return b.power - a.power;
                }
                return a.pos - b.pos;
            })*/
            if (datas) datas.sort((a, b) => {
                return b.power - a.power;
            })
        }

        this.nodeTip.active = !datas || datas.length === 0;

        for (let i = 0; i < datas.length;) {
            datas[i].replacePos = this.pos;
            if (this.retinue && datas[i].id === this.retinue.id) {
                datas.splice(i, 1);
                continue;
            } else {
                i++;
            }
        }

        this.retinueList.data = datas;
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

}
