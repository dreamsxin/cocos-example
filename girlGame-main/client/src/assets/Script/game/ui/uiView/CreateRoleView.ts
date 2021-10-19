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
import MultiLabel from "../../../util/MultiLabel";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import ChooseItem from "../uiComponent/clothView/ChooseItem";
import { ResUtil } from "../../../base/res/ResUtil";
import { resLoader } from "../../../base/res/ResLoader";
import PlayerObject from "../../actor/PlayerObject";
import { dataManager } from "../../data/DataManager";
import SysDef from "../../../util/SysDef";
import EditBox = cc.EditBox;
import { EventMgr } from "../../../base/common/EventManager";
import RoleSpine from "../uiComponent/common/RoleSpine";
import ClotheProxy, { ClotheData } from "../../data/ClotheProxy";
import PlayerProxy from "../../data/PlayerProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CreateRoleView extends UIView {



    @property(cc.Node)
    node_bg: cc.Node = null;
    @property(RoleSpine)
    node_spine: RoleSpine = null;

    @property(cc.Node)
    node_name: cc.Node = null;

    @property(cc.Node)
    node_choose: cc.Node = null;

    @property(cc.Node)
    node_confirm: cc.Node = null;


    @property(EditBox)
    ed_name: EditBox = null;

    @property({ type: [ChooseItem] })
    choose_items: ChooseItem[] = [];


    private curStep: number = 0;

    private curChooseType: number = -1;
    private typeDatas = [[], [], []];
    clothIndex: number = 0;

    init() {

        EventMgr.addEventListener(PlayerProxy.infoUpdate, this.CreateRoleCallBack, this);
        EventMgr.addEventListener(ClotheProxy.clothesWear, this.SetBasicClothCallBack, this);

    }

    onEnable() {
        this.initItems();
    }

    onDestroy() {
        EventMgr.removeEventListener(PlayerProxy.infoUpdate, this.CreateRoleCallBack, this);
        EventMgr.removeEventListener(ClotheProxy.clothesWear, this.SetBasicClothCallBack, this);
    }

    initItems() {

        let cfgData = dataManager.getCreateRoleData();

        for (var em in cfgData) {
            this.typeDatas[cfgData[em].type - 1].push(cfgData[em]);
        }
        for (var i = 0; i < this.choose_items.length; i++) {
            this.choose_items[i].init(i, this.typeDatas[i], this.onClickChosseCopyItem.bind(this));
        }

        let data = [];
        data.push(this.typeDatas[0][0].clothe);
        data.push(this.typeDatas[1][0].clothe);
        data.push(this.typeDatas[2][0].clothe);

        this.node_spine.data = data;


    }

    updateUI(step) {
        this.curStep = step;
        this.node_name.active = this.curStep == 0;
        this.node_choose.active = this.curStep == 1;
        this.node_confirm.active = this.curStep == 2;
    }
    onClickBg() {
        if(this.curStep == 1){
            for (var i = 0; i < this.choose_items.length; i++) {
                this.choose_items[i].updateShowMenu(false);
            }
            this.curChooseType = -1;
            this.zoomOut();
        }

    }
    onClickChosseItem(e) {
        for (var i = 0; i < this.choose_items.length; i++) {
            this.choose_items[i].updateShowMenu(false);
        }
        var item = e.target.parent.getComponent(ChooseItem);
        item.updateShowMenu(true);
        if (item.id == this.curChooseType)
            return;
        this.curChooseType = item.id;
        if (item.id != 2) {

            this.zoomIn()
        } else {
            this.zoomOut();
        }
    }
    onClickChosseCopyItem(data) {
        let arr = this.node_spine.data;
        dataManager.clotheProxy.updateClotheData(data.clothe, arr, false);
        this.node_spine.data = arr;
    }
    zoomIn() {
        this.node_bg.stopAllActions();
        this.node_spine.node.stopAllActions();
        let action0 = cc.moveTo(0.4, 0, -300);
        let action1 = cc.scaleTo(0.4, 1.2, 1.2);
        let action2 = cc.spawn(action0, action1);
        this.node_spine.node.runAction(action2);
        let action3 = cc.scaleTo(0.4, 1.4, 1.4);
        this.node_bg.runAction(action3);
    }
    zoomOut() {
        this.node_bg.stopAllActions();
        this.node_spine.node.stopAllActions();
        let action0 = cc.moveTo(0.4, 0, -100);
        let action1 = cc.scaleTo(0.4, 0.56, 0.56);
        let action2 = cc.spawn(action0, action1);
        this.node_spine.node.runAction(action2);
        let action3 = cc.scaleTo(0.4, 1, 1);
        this.node_bg.runAction(action3);

    }
    onClickRandomName() {
        this.ed_name.string = utils.getRandomName();

    }
    onClickConfirmName() {
        dataManager.playerProxy.PlayerCreateRoleRequest(this.ed_name.string);
    }
    CreateRoleCallBack() {
        utils.showTips(dataManager.GetTextById(394));
        this.updateUI(1);
        for (var i = 0; i < this.choose_items.length; i++) {
            this.choose_items[i].updateShowMenu(false);
        }
        var item = this.choose_items[0];
        item.updateShowMenu(true);
        if (item.id == this.curChooseType)
            return;
        this.curChooseType = item.id;
        if (item.id != 2) {

            this.zoomIn()
        } else {
            this.zoomOut();
        }
    }
    SetBasicClothCallBack() {
        if (this.clothIndex == 1) {
            //重新设置衣服后退出
            uiManager.closeAll();
            uiManager.open(UIID.UIMain);
        }
        this.clothIndex++;
    }
    onClickConfirmSpine() {

        this.updateUI(2);
        this.onClickBg();
    }
    onClickCancelSpine() {

        this.updateUI(1);
    }

    onClickConfirmEnd() {
        let data = new ClotheData();
        data.update(this.node_spine.data);
        dataManager.clotheProxy.changeClothCmd(data);
    }

    onOpen() {
        this.updateUI(0);
        this.ed_name.string = utils.getRandomName();
    }

    onClose() {

    }

    update(dt) {

    }
}
