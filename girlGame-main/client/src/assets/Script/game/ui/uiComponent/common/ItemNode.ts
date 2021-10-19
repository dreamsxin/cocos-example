// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventMgr } from "../../../../base/common/EventManager";
import { uiManager } from "../../../../base/ui/UIManager";
import MultiLabel from "../../../../util/MultiLabel";
import SysDef from "../../../../util/SysDef";
import { utils } from "../../../../util/Utils";
import BagProxy from "../../../data/BagProxy";
import { dataManager } from "../../../data/DataManager";
import UrlLoad from "./UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemNode extends cc.Component {

    @property(MultiLabel)
    lbRes: MultiLabel = null;

    @property(UrlLoad)
    urlIcon: UrlLoad = null;

    @property(cc.Integer)
    id: number = 0;

    onLoad() {
        EventMgr.addEventListener(BagProxy.infoUpdate, this.updateResource, this);

        this.setItemID(this.id);
    }

    setItemID(id) {
        this.id = id;

        let data = dataManager.bagProxy.getItem(this.id);
        if (!data) {
            cc.error('ItemNode id =' + this.id + ' not exsit');
            return;
        }
        this.urlIcon.url = SysDef.getItemIcon(data);
        this.updateResource();
    }

    onDestroy() {
        EventMgr.removeEventListener(BagProxy.infoUpdate, this.updateResource, this);
    }

    onClickAddBtn() {
        utils.showTips(dataManager.GetTextById(397));
    }

    updateResource() {
        let data = dataManager.bagProxy.getItem(this.id);
        if (!data) {
            cc.error('ItemNode id =' + this.id + ' not exsit');
            return;
        }
        this.lbRes.string = data.count ? data.count : 0 + '';
    }
}
