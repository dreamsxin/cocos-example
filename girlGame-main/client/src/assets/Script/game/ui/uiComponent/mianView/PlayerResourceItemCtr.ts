// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import PlayerResoureItem from "./PlayerResourceItem";
import { EventMgr } from "../../../../base/common/EventManager";
import EventID from "../../../event/EventID";
import PlayerProxy from "../../../data/PlayerProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerResourceItemCtr extends cc.Component {

    @property(PlayerResoureItem)
    diamondItem: PlayerResoureItem = null;
    @property(PlayerResoureItem)
    goldItem: PlayerResoureItem = null;
    @property(PlayerResoureItem)
    tiliItem: PlayerResoureItem = null;

    onLoad() {
        this.updatePlayerResourceItems();
        EventMgr.addEventListener(PlayerProxy.infoUpdate, this.updatePlayerResourceItems, this);
    }
    updatePlayerResourceItems() {
        if (this.diamondItem != null) {
            this.diamondItem.updatePlayerResource();
        }
        if (this.goldItem != null) {
            this.goldItem.updatePlayerResource();
        }
        if (this.tiliItem != null) {
            this.tiliItem.updatePlayerResource();
        }


    }

    onDestroy() {
        EventMgr.removeEventListener(PlayerProxy.infoUpdate, this.updatePlayerResourceItems, this);
    }

}
