// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import { utils } from "../../../util/Utils";
import { resLoader } from "../../../base/res/ResLoader";
import { ResUtil } from "../../../base/res/ResUtil";
import PlayerObject from "../../actor/PlayerObject";
import { dataManager } from "../../data/DataManager";
import PlayerInfoItem from "../uiComponent/mianView/PlayerInfoItem";
import { EventMgr } from "../../../base/common/EventManager";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import SysDef from "../../../util/SysDef";
import MainBottomMenu from "../uiComponent/mianView/MainBottomMenu";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainView extends UIView {

    public static instance: MainView = null;


    @property(PlayerInfoItem)
    node_player_info: PlayerInfoItem = null;
    @property(cc.Node)
    node_spine: cc.Node = null;

    @property(cc.Node)
    node_center: cc.Node = null;

    @property(cc.Node)
    node_city_center: cc.Node = null;


    @property(cc.Node)
    node_city_Move: cc.Node = null;

    @property(cc.Node)
    node_hy: cc.Node = null;


    @property(cc.Node)
    node_chat: cc.Node = null;

    @property(MainBottomMenu)
    node_menu: MainBottomMenu = null;
    private startX = 0;

    private curMenuId: number = 0;


    init() {
        MainView.instance = this;
        /*
        this.node_city_Move.on(cc.Node.EventType.TOUCH_START, this.itemTouchStart, this);
        this.node_city_Move.on(cc.Node.EventType.TOUCH_MOVE, this.itemTouchMove, this);
        this.node_city_Move.on(cc.Node.EventType.TOUCH_CANCEL, this.itemTouchCancel, this);
        this.node_city_Move.on(cc.Node.EventType.TOUCH_END, this.itemTouchEnd, this);
        */
    }

    onOpen(fid, arg) {
        this.updateMenu(arg ? arg : 0);

    }

    onDestroy() {
        MainView.instance = null;
    }
    itemTouchStart(event) {
        this.startX = event.touch.getLocation().x;
        if (this.node_city_Move.x >= 80) {

            this.node_city_Move.x -= 1;
        } else if (this.node_city_Move.x <= -80) {

            this.node_city_Move.x += 1;
        }
    }
    itemTouchMove(event) {
        var endPos = event.touch.getLocation();

        var diff_x = endPos.x - this.startX;
        console.log(endPos);
        console.log(diff_x);
        if (this.node_city_Move.x <= 80 && this.node_city_Move.x >= -80) {

            this.node_city_Move.x += diff_x * 0.2;
            if (this.node_city_Move.x >= 80) {
                this.node_city_Move.x = 80;
            } else if (this.node_city_Move.x <= -80) {
                this.node_city_Move.x = -80;
            }
        }

    }
    itemTouchCancel() {

    }
    itemTouchEnd() {

    }
    updateMenu(_id) {
        this.curMenuId = _id;
        this.node_center.active = this.curMenuId == 0;
        this.node_city_center.active = this.curMenuId == 1;
        this.node_hy.active = this.curMenuId == 0;
        this.node_chat.active = this.curMenuId == 0;

        this.node_menu.checkStatus(this.curMenuId == 0 ? 2 : 0);
    }

    onClickClothe() {
        this.closeSelf();
        uiManager.open(UIID.UICloth);
    }

    onClickBuyCard() {
        this.closeSelf();
        uiManager.open(UIID.UIBuyCardView, 0);
    }

    onClickInCity() {
        this.updateMenu(1);
    }
    onClickOutCity() {
        utils.showCommingSoonTips();

    }
    onClickBagBtn() {

        uiManager.open(UIID.UIBagView);

    }
    onClickCommingSoon() {

        utils.showCommingSoonTips();
    }

    onClose() {

    }
}
