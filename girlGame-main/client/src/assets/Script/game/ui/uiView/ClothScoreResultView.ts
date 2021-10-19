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
import ClothChoosetypeItem from "../uiComponent/clothView/ClothChoosetypeItem";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import ClothTagController from "../uiComponent/clothView/ClothTagController";
import { utils } from "../../../util/Utils";
import ToggleCopyItem from "../uiComponent/clothView/ToggleCopyItem";
import ClothStoreCopyItem from "../uiComponent/clothView/ClothStoreCopyItem";
import MultiLabel from "../../../util/MultiLabel";
import { resLoader } from "../../../base/res/ResLoader";
import SysDef from "../../../util/SysDef";
import { UIID } from "../UIConfig";
import RoleSpine from "../uiComponent/common/RoleSpine";
import RenderListItem from "../uiComponent/common/RenderListItem";
import { uiUtils } from "../../../util/UIUtils";
import { EventMgr } from "../../../base/common/EventManager";
import ClotheProxy from "../../data/ClotheProxy";
import Skeleton = sp.spine.Skeleton;

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothScoreResultView extends UIView {




    @property(RoleSpine)
    roleSpine: RoleSpine = null;


    @property(cc.Node)
    node_animation: cc.Node = null;

    @property(cc.Node)
    node_result: cc.Node = null;

    @property(cc.Node)
    node_normal: cc.Node = null;

    @property(cc.Node)
    node_excellent: cc.Node = null;

    @property(cc.Node)
    node_perfect: cc.Node = null;

    @property(cc.Node)
    node_active_normal: cc.Node = null;
    @property(cc.Node)
    node_active_excellent: cc.Node = null;
    @property(cc.Node)
    node_active_perfect: cc.Node = null;

    @property(cc.Node)
    node_effect: cc.Node = null;

    @property(cc.Node)
    node_score_copy_item: cc.Node = null;

    @property(cc.Sprite)
    spr_result: cc.Sprite = null;

    @property(MultiLabel)
    lb_score: MultiLabel = null;

    @property(MultiLabel)
    lbNow: MultiLabel = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Node)
    nodeResults: cc.Node[] = [];

    @property(cc.Node)
    nodeStar: cc.Node = null;

    @property(cc.Node)
    node_fly_effect: cc.Node = null;
    @property(cc.Node)
    node_bz: cc.Node = null;


    currentQuestId: number;
    allScoreItems: any[];
    data: any;
    stroyData: any;
    taskData: any;


    init() {


        //EventMgr.addEventListener(ClotheProxy.clothesPKresult, this.initUI, this);


        this.allScoreItems = [];
    }

    onDestroy() {
        //EventMgr.removeEventListener(ClotheProxy.clothesPKresult, this.initUI, this);
    }

    initUI() {

        this.data = dataManager.clotheProxy.clothePKResult;

        this.data.styles.sort((a, b) => {
            return b.score - a.score;
        })

        this.stroyData = dataManager.storyProxy.getSectionData(this.currentQuestId);
        this.taskData = dataManager.allDatas.accessorie_task[this.stroyData.task_accessorie];

        this.node_animation.active = true;
        this.node_result.active = false;

        this.schedule(this.initScoreItems, 0.3);

        this.progressBar.progress = 0;
    }

    onOpen(form: number, data: { clothes: any; questId: number; }) {

        this.roleSpine.data = data.clothes;
        this.currentQuestId = data.questId;

        this.node_animation.active = true;
        this.node_result.active = false;

        this.initUI();
    }

    initScoreItems() {

        let index = this.allScoreItems.length;
        let changdu = 200;

        var node = cc.instantiate(this.node_score_copy_item);
        node.parent = this.node_score_copy_item.parent;
        node.position = cc.v3(changdu * Math.cos(index * 60 * Math.PI / 180), changdu * Math.sin(index * 60 * Math.PI / 180), 0);
        node.active = true;
        node.getComponent(RenderListItem).data = this.data.styles[index];

        this.allScoreItems.push(node);

        if (this.allScoreItems.length === 6) {
            this.unschedule(this.initScoreItems);
            for (let item of this.allScoreItems) {
                let move = cc.moveTo(0.5, 0, 0);
                let hide = cc.hide();
                item.runAction(cc.sequence(move, hide, cc.callFunc(this.showFlyEffect, this)));
            }
        }
    }
    showFlyEffect() {
        this.node_bz.active = true;
        this.node_fly_effect.active = true;
        this.node_fly_effect.scale = 0;
        this.node_bz.getComponent(sp.Skeleton).setAnimation(0, 'animation', false);
        var delay = cc.delayTime(0.5);
        var call = cc.callFunc(() => {
            this.node_fly_effect.scale = 1;
        });
        let move = cc.moveTo(1.5, cc.v2(60,-120));
        this.node_fly_effect.runAction(cc.sequence(delay, call, move, cc.callFunc(this.showProgress, this)));
    }
    showProgress() {

        this.node_fly_effect.active = false;
        let progress = 0;

        switch (this.stroyData.curStar) {
            case 0:
                progress = this.data.score / this.taskData.grade[0] * 0.4;
                break;
            case 1:
                progress = this.data.score / this.taskData.grade[1] * 0.6;
                break;
            case 2:
                progress = this.data.score / this.taskData.grade[2] * 0.8;
                break;
            case 3:
                progress = this.data.score / this.taskData.grade[2];
                break;

        }
        if (progress > 1)
            progress = 1;
        uiUtils.showPrgChange(this.progressBar, 0, progress, () => {
            this.node_effect.y = this.progressBar.node.height * this.progressBar.progress;
            if (this.progressBar.progress >= 0.95) {

                this.node_effect.x = - 6;
            }
            this.node_active_normal.active = this.progressBar.progress > 0.4;
            this.node_active_excellent.active = this.progressBar.progress > 0.6;
            this.node_active_perfect.active = this.progressBar.progress > 0.8;
            switch (this.stroyData.curStar) {
                case 1:


                    this.node_active_normal.scale = 1.2;
                    break;
                case 2:

                    this.node_active_excellent.scale = 1.2;
                    break;
                case 3:

                    this.node_active_perfect.scale = 1.2;
                    break;
            }

        }, this.showLight.bind(this));
    }

    showLight() {
        for (let i = 0; i < this.nodeStar.children.length; i++) {
            this.nodeStar.children[i].active = i < this.stroyData.curStar;
        }


        this.scheduleOnce(this.showResult, 1);
    }

    showResult() {
        this.node_animation.active = false;
        this.node_result.active = true;
        for (let index = 0; index < 4; index++) {
            this.nodeResults[index].active = this.stroyData.curStar === index;
        }
        this.lb_score.string = dataManager.GetTextById(165) + this.data.score;

        dataManager.systemProxy.floatReward();
    }

    onClickDetailsBtn() {
        uiManager.open(UIID.UIClothScoreDetails, this.data);
        // this.closeSelf();
    }



    onClickCloseBtn() {
        this.closeSelf();
        let curStoryData = dataManager.storyProxy.getSectionData(this.currentQuestId);
        if (curStoryData.curStar === 0) {
            //输

            uiManager.open(UIID.UIChapter);
        } else {
            if (curStoryData.after_action_id) {
                uiManager.open(UIID.UIPlot, { data: curStoryData, bAfter: true });
            } else {

                uiManager.open(UIID.UIChapter, curStoryData.id);
            }
        }

    }

}
