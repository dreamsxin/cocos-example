// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import { uiManager } from "../../../../base/ui/UIManager";
import { UIID } from "../../UIConfig";
import RenderListItem from "../common/RenderListItem";
import UrlLoad from "../common/UrlLoad";
import { dataManager } from "../../../data/DataManager";
import { utils } from "../../../../util/Utils";
import { uiUtils } from "../../../../util/UIUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class WorkshopCopyItem extends RenderListItem {

    @property(MultiLabel)
    lblCount: MultiLabel = null;

    @property(MultiLabel)
    lblTime: MultiLabel = null;

    @property(cc.Node)
    nodeBuild: cc.Node = null;

    @property(cc.Node)
    nodeTime: cc.Node = null;

    @property(UrlLoad)
    urlIcon: UrlLoad = null;

    @property(cc.Node)
    nodeTips: cc.Node = null;
    item: any;

    start() {

    }

    onClickCounterDescBtn() {
        if (this.data.count === 0) {
            uiManager.open(UIID.UIWorkshopDesc, this.data);
        } else {
            dataManager.workshopProxy.sendCollectCmd(this.data.type);
        }
    }

    showData() {

        this.item = this.data.id;

        this.urlIcon.url = dataManager.bagProxy.getItemIcon(this.item);

        if (Math.floor(this.data.etime / 1000) > dataManager.systemProxy.second) {
            this.lblTime.node.parent.opacity = 255;
            uiUtils.countDown(Math.floor(this.data.etime / 1000), this.lblTime, this.workEnd.bind(this), '', 0, 0);

            this.lblCount.string = dataManager.GetTextById(130) + ':' + this.data.count;
        } else {
            this.workEnd();
        }

        this.lblCount.node.parent.active = this.data.count !== 0;

    }

    workEnd() {

        let cfg = dataManager.workshopProxy.getCfgByWorkId(this.data.type);

        this.data.count += cfg[2];


        if (this.data.count >= cfg[3]) {
            //满了
            this.lblTime.node.parent.opacity = 0;
        } else {
            this.lblTime.node.parent.opacity = 255;
            this.data.etime += cfg[1] * 60000;
            uiUtils.countDown(Math.floor(this.data.etime / 1000), this.lblTime, this.workEnd.bind(this), '', 0, 0);
        }

        this.lblCount.string = dataManager.GetTextById(130) + ':' + this.data.count;
    }
    // update (dt) {}
}
