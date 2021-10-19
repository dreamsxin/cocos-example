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
import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import PlayerProxy from "../../../data/PlayerProxy";
import {utils} from "../../../../util/Utils";

const { ccclass, property } = cc._decorator;

export enum PlayerResourceType {
    Gold,
    Diamond,
    Vitality

}
@ccclass
export default class PlayerResourceItem extends cc.Component {

    @property(MultiLabel)
    lb_res: MultiLabel = null;
    @property({ type: cc.Enum(PlayerResourceType) })
    type: PlayerResourceType = PlayerResourceType.Gold;


    onLoad() {
        EventMgr.addEventListener(PlayerProxy.infoUpdate, this.updatePlayerResource, this);
    }

    onDestroy() {
        EventMgr.removeEventListener(PlayerProxy.infoUpdate, this.updatePlayerResource, this);
    }

    onClickAddBtn() {
        switch (this.type) {
            case PlayerResourceType.Diamond:
                break;
            case PlayerResourceType.Gold:
                break;
            case PlayerResourceType.Vitality:
                break;
        }
    }

    updatePlayerResource() {
        switch (this.type) {
            case PlayerResourceType.Diamond:
                this.lb_res.string = utils.getGoldNumberStr( dataManager.playerProxy.data.diamond );
                break;
            case PlayerResourceType.Gold:
                this.lb_res.string = utils.getGoldNumberStr( dataManager.playerProxy.data.gold );
                break;
            case PlayerResourceType.Vitality:
                this.lb_res.string = dataManager.playerProxy.data.vitality_val + '';
                break;
        }
    }
}
