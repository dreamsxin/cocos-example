// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import { UIManager, uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import { dataManager } from "../../data/DataManager";
import ClothChoosetypeItem from "../uiComponent/clothView/ClothChoosetypeItem";
import MultiLabel from "../../../util/MultiLabel";
import { NodePool } from "../../../base/res/NodePool";
import ClothCopyItem from "../uiComponent/clothView/ClothCopyItem";
import ScrollViewPlus from "../uiComponent/common/ScrollViewPlus";
import ToggleCopyItem from "../uiComponent/clothView/ToggleCopyItem";
import { resLoader } from "../../../base/res/ResLoader";
import { ResUtil } from "../../../base/res/ResUtil";
import PlayerObject from "../../actor/PlayerObject";
import { utils } from "../../../util/Utils";
import { ClothData } from "../../data/PlayerProxy";
import ClothBgController from "../uiComponent/clothView/ClothBgController";
import ClothSaveTipsItem from "../uiComponent/clothView/ClothSaveTipsItem";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import ClothMainCopyItem from "../uiComponent/clothView/ClothMainCopyItem";
import SysDef from "../../../util/SysDef";
import RoleSpine from "../uiComponent/common/RoleSpine";
import ClotheProxy, { ClotheData } from "../../data/ClotheProxy";
import { EventMgr } from "../../../base/common/EventManager";
import StoryProxy from "../../data/StoryProxy";
import StyleCopyItem from "../uiComponent/searchView/StyleCopyItem";
import TagCopyItem from "../uiComponent/searchView/TagCopyItem";
import UrlLoad from "../uiComponent/common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothView extends UIView {

    public static instance: ClothView = null;

    @property(cc.Node)
    node_score_tips: cc.Node = null;

    @property(cc.Node)
    node_yg: cc.Node = null;


    @property(cc.Node)
    node_hzl: cc.Node = null;


    @property([StyleCopyItem])
    styleCopyItem: StyleCopyItem[] = [];

    @property(TagCopyItem)
    tagCopyItem: TagCopyItem = null;


    @property(cc.Node)
    node_search: cc.Node = null;

    @property(MultiLabel)
    lb_search: MultiLabel = null;

    @property(cc.Node)
    node_rotate_btn: cc.Node = null;

    @property(cc.Node)
    node_move_btns: cc.Node = null;

    @property(cc.Node)
    node_save_tips: cc.Node = null;

    @property(cc.Node)
    node_clothBgController: cc.Node = null;

    @property(UrlLoad)
    spr_bg: UrlLoad = null;

    @property(cc.Node)
    node_move_top_left: cc.Node = null;

    @property(cc.Node)
    node_move_left: cc.Node = null;

    @property(cc.Node)
    node_move_right: cc.Node = null;

    @property(cc.Node)
    node_move_bottom_left: cc.Node = null;

    @property(cc.Node)
    node_move_bottom_right: cc.Node = null;

    @property(RoleSpine)
    node_spine: RoleSpine = null;

    @property(cc.Node)
    node_choose_types: cc.Node = null;

    @property(cc.Node)
    node_copy_type_item: cc.Node = null;

    @property(cc.Node)
    node_choose_type_menu: cc.Node = null;

    @property(cc.Node)
    node_toggles: cc.Node = null;

    @property(cc.Node)
    node_copy_toggle_item: cc.Node = null;


    @property(cc.Node)
    node_copy_cloth_item: cc.Node = null;

    @property(ClothCopyItemController)
    clothCopyItemController: ClothCopyItemController = null;


    private togglePool: NodePool = null;
    private toggles = null;

    private clothPool: NodePool = null;
    private clothes = null;
    // LIFE-CYCLE CALLBACKS:
    private clothData = null;

    private wardrobesData = null;

    private allCheckedSpine = null;

    private isRotated: boolean = false;
    private currentQuestId: number = 0;
    private curClothe: number[];
    // onLoad () {}

    init() {
        ClothView.instance = this;

        this.togglePool = new NodePool();
        this.togglePool.init(this.node_copy_toggle_item);
        this.togglePool.setWaterMark(3);
        this.toggles = new Array();
        this.clothPool = new NodePool();
        this.clothPool.init(this.node_copy_cloth_item);
        this.clothPool.setWaterMark(5);
        this.clothes = new Array();


        this.clothData = dataManager.clotheProxy.bagData;
        this.wardrobesData = utils.deepClone(this.clothData);
        this.allCheckedSpine = [];
        this.clothCopyItemController.init(this.onClickClothItem.bind(this));


        this.curClothe = [];
        for (let k of dataManager.clotheProxy.clothesWear) {
            this.curClothe.push(k);
        }

        this.node_choose_type_menu.active = false;


        EventMgr.addEventListener(ClotheProxy.clothesPKresult, this.gotoResult, this);
    }

    onDestroy() {
        ClothView.instance = null;

        EventMgr.removeEventListener(ClotheProxy.clothesPKresult, this.gotoResult, this);
    }

    initUI() {
        this.initClothTypes();

        this.node_score_tips.active = this.currentQuestId > 0;
        this.node_yg.active = this.currentQuestId == 0;
        this.node_hzl.active = this.currentQuestId == 0;

        //酷装评分标签及风格提示
        if (this.node_score_tips.active) {
            let taskData = dataManager.storyProxy.getSectionTask(this.currentQuestId);

            let cfg = dataManager.getAccessorieStyleData();
            this.styleCopyItem[0].getComponent(StyleCopyItem).initData(cfg[taskData.style_id[0]], null);
            this.styleCopyItem[1].getComponent(StyleCopyItem).initData(cfg[taskData.style_id[1]], null);

            cfg = dataManager.getAccessorieTagData();
            this.tagCopyItem.node.active = taskData.label_id;
            if (taskData.label_id) {
                this.tagCopyItem.getComponent(TagCopyItem).initData(cfg[taskData.label_id], null);
            }
        }

    }

    onOpen(form, mode: number) {

        this.currentQuestId = mode ? mode : 0;
        this.initUI();
    }

    initClothTypes() {
        for (var bigType in dataManager.getAccessorieFirstTypeData()) {
            let arr1 = [];
            let data = dataManager.getAccessorieFirstTypeData()[bigType];
            var copyTypeItem = cc.instantiate(this.node_copy_type_item).getComponent(ClothChoosetypeItem);
            copyTypeItem.updateInfo(data);
            copyTypeItem.setCallBack(this.onClickClothTypeItem.bind(this));
            copyTypeItem.node.parent = this.node_choose_types;
            copyTypeItem.node.x = this.node_copy_type_item.x;
            copyTypeItem.node.y = this.node_copy_type_item.y - 140 * (parseInt(data.id) - 1);
            copyTypeItem.node.active = true;
            if (data.second_type_ids) {
                for (var j = 0; j < data.second_type_ids.length; j++) {
                    var arr2 = new Array();
                    arr1.push(arr2);
                }
            } else {
                var arr2 = new Array();
                arr1.push(arr2);
            }
            this.allCheckedSpine.push(arr1);
        }

    }

    onClickClothTypeItem(data) {
        this.showClothMenu(data.id, data.second_type_ids);
    }

    showClothTypeMenu() {

        this.node_choose_types.active = true;
        this.node_choose_type_menu.active = false;
        for (var i = 0; i < this.toggles.length; i++) {
            this.togglePool.freeNode(this.toggles[i]);
        }
        this.toggles.splice(0);
        this.node_toggles.active = false;


        for (var i = 0; i < this.clothes.length; i++) {
            this.clothPool.freeNode(this.clothes[i]);
        }
        this.clothes.splice(0);
    }


    showClothMenu(fd, types) {

        this.node_choose_types.active = false;
        this.node_choose_type_menu.active = true;
        if (types) {
            for (var i = 0; i < types.length; i++) {
                let data = dataManager.getAccessorieSecondTypeData()[types[i]];
                var copyToggle = this.togglePool.getNode();
                if (i == 0) {
                    copyToggle.getComponent(cc.Toggle).isChecked = true;
                } else {
                    copyToggle.getComponent(cc.Toggle).isChecked = false;
                }
                copyToggle.parent = this.node_toggles;
                copyToggle.x = 0;
                copyToggle.y = -90 * i;
                copyToggle.active = true;
                copyToggle.getComponent(ToggleCopyItem).initData(i, fd, types[i], data.name_id);
                this.toggles.push(copyToggle);

                this.node_toggles.active = true;
            }

            this.clothCopyItemController.updateAllItems(this.getCurrentDatas(fd - 1, 0), this.curClothe);
        } else {
            this.clothCopyItemController.updateAllItems(this.getCurrentDatas(fd - 1, -1), this.curClothe);
        }

    }

    changeToggleValue(target) {
        var item = target.getComponent(ToggleCopyItem);
        this.clothCopyItemController.updateAllItems(this.getCurrentDatas(item.first_type - 1, item.index), this.curClothe);
    }

    getCurrentDatas(ft, st) {
        if (st >= 0) {
            return this.wardrobesData[ft][st];

        } else {
            return this.wardrobesData[ft][0];
        }

    }



    updateClotheData(clothId: any) {

        dataManager.clotheProxy.updateClotheData(clothId, this.curClothe);
        //刷新
        this.node_spine.data = this.curClothe;
    }


    preview(isShow) {
        this.node_spine.node.stopAllActions();
        this.node_move_left.stopAllActions();
        this.node_move_top_left.stopAllActions();
        this.node_move_right.stopAllActions();
        this.node_move_bottom_left.stopAllActions();
        this.node_move_bottom_right.stopAllActions();
        this.node_score_tips.stopAllActions();
        if (isShow) {
            var scale = cc.scaleTo(0.2, 0.56);
            var moveleft = cc.moveTo(0.2, cc.v2(0, 0));
            var movetopleft = cc.moveTo(0.2, cc.v2(0, 0));
            var moveright = cc.moveTo(0.2, cc.v2(0, 0));
            var movebottomleft = cc.moveTo(0.2, cc.v2(0, 0));
            var movebottomright = cc.moveTo(0.2, cc.v2(0, 0));
            var moveTop = cc.moveTo(0.2, cc.v2(0, 0));
        } else {
            var scale = cc.scaleTo(0.2, 0.84);
            var moveleft = cc.moveTo(0.2, cc.v2(-200, 0));
            var movetopleft = cc.moveTo(0.2, cc.v2(0, 200));
            var moveright = cc.moveTo(0.2, cc.v2(200, 0));
            var movebottomleft = cc.moveTo(0.2, cc.v2(-500, 0));
            var movebottomright = cc.moveTo(0.2, cc.v2(300, 0));
            var moveTop = cc.moveTo(0.2, cc.v2(0, 300));
        }
        this.node_spine.node.runAction(scale);
        this.node_move_left.runAction(moveleft);
        this.node_move_top_left.runAction(movetopleft);
        this.node_move_right.runAction(moveright);
        this.node_move_bottom_left.runAction(movebottomleft);
        this.node_move_bottom_right.runAction(movebottomright);
        this.node_score_tips.runAction(moveTop);
    }

    gotoResult() {
        if (this.currentQuestId) {
            uiManager.open(UIID.UIClothScoreResult, { clothes: this.curClothe, questId: this.currentQuestId });
            this.closeSelf();
        }
    }

    onClickSave() {
        if (!this.currentQuestId) {

            let data = new ClotheData();
            data.update(this.curClothe);
            if (data.checkTip()) {
                this.node_save_tips.getComponent(ClothSaveTipsItem).playTip(() => {

                });
                dataManager.clotheProxy.changeClothCmd(data);
            }

        } else {
            //酷装评分
            let data = new ClotheData();
            data.update(this.curClothe);
            if (data.checkTip()) {
                this.node_save_tips.getComponent(ClothSaveTipsItem).playTip(() => {
                    dataManager.clotheProxy.changeSectionClothCmd(this.currentQuestId, data);
                });
            }
        }

    }

    onClickResumeSpines() {

        this.curClothe = [];
        for (let k of dataManager.clotheProxy.clothesWear) {
            this.curClothe.push(k);
        }
        this.node_spine.data = dataManager.clotheProxy.clothesWear;

    }

    onClickClothItem(node, data) {

        if (node) {
            node.getComponent(ClothMainCopyItem).clickUpdate();
        }

        this.updateClotheData(data);

    }



    onClickPreview() {
        this.preview(false);
    }

    onClickBackGround() {
        this.showClothTypeMenu();
        this.preview(true);

    }
    onClickSearchBtn() {
        utils.showCommingSoonTips();
        // uiManager.open(UIID.UISearch)
    }
    onClickBgBtn() {
        this.node_clothBgController.getComponent(ClothBgController).updateBgMenu(true);
    }
    onClickRotateBtn() {
        this.isRotated = !this.isRotated;
        this.node_move_btns.stopAllActions();
        this.node_rotate_btn.stopAllActions();

        if (this.isRotated) {
            var rotate = cc.rotateTo(0.2, 180);
            var move = cc.moveTo(0.2, cc.v2(-400, 0));
        } else {
            var rotate = cc.rotateTo(0.2, 0);
            var move = cc.moveTo(0.2, cc.v2(0, 0));
        }
        this.node_rotate_btn.runAction(rotate);
        this.node_move_btns.runAction(move);

    }
    updateClothBgImage(sf) {
        this.spr_bg.url = sf;
    }
    onClickBack() {

        this.togglePool.destory();
        this.clothPool.destory();
        this.closeSelf();
        if (this.currentQuestId) {
            uiManager.open(UIID.UIChapter, this.currentQuestId);
        } else {
            uiManager.open(UIID.UIMain);
        }
    }

    // update (dt) {}
    onTop(preID: number, args: any) {

        if (preID == UIID.UISearch) {
            this.ShowSearchRst(args);
        }
    }
    ShowSearchRst(args) {
        this.node_search.active = true;
        this.lb_search.string = args;
    }
    onClickSearchCloseBtn() {
        this.node_search.active = false;
    }

    onClickAmeoireBtn() {
        uiManager.open(UIID.UIClothArmoire);
    }

    onClickHuazhuangluBtn() {
        utils.showTips(dataManager.GetTextById(397));
    }

    onClickStoreBtn() {
        utils.showTips(dataManager.GetTextById(397));
        //uiManager.open(UIID.UIClothStore);
    }
    onClickScoreTipsBtn() {


        let taskData = dataManager.storyProxy.getSectionTask(this.currentQuestId);

        uiManager.open(UIID.UIClothScoreTips, taskData.style_id);
    }
}
