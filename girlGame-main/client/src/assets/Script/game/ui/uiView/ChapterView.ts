// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import View = cc.View;
import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { NodePool } from "../../../base/res/NodePool";
import { dataManager } from "../../data/DataManager";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import { BoxStatus, utils } from "../../../util/Utils";
import { UIManager, uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import SectionCopyItem from "../uiComponent/plotView/ChapterCopyItem";
import RenderListItem from "../uiComponent/common/RenderListItem";
import RenderList from "../uiComponent/common/RenderList";
import { EventMgr } from "../../../base/common/EventManager";
import StoryProxy from "../../data/StoryProxy";
import ChapterRecallTextItem from "../uiComponent/plotView/ChapterRecallTextItem";
import RedDot from "../uiComponent/common/RedDot";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChapterView extends UIView {

    public static instance: ChapterView = null;

    @property(cc.Node)
    node_center: cc.Node = null;

    @property(MultiLabel)
    lb_chapter_title: MultiLabel = null;

    @property(MultiLabel)
    lb_chapter_desc: MultiLabel = null;

    @property(RenderList)
    chapterCopyList: RenderList = null;

    @property(cc.Node)
    btn_pre_chapter: cc.Node = null;

    @property(cc.Node)
    btn_next_chapter: cc.Node = null;

    @property(cc.Node)
    node_animation: cc.Node = null;

    @property(MultiLabel)
    lb_chapter_index: MultiLabel = null;

    @property(MultiLabel)
    lb_chapter_name: MultiLabel = null;

    @property(MultiLabel)
    lbAllStarNum: MultiLabel = null;

    @property(RenderList)
    starRwdList: RenderList = null;



    private chapterId = 0;
    private isNewSection = false;
    curStoryData: any;
    maxChapterId = 1;


    // LIFE-CYCLE CALLBACKS:
    init() {
        ChapterView.instance = this;

        EventMgr.addEventListener(StoryProxy.infoUpdate, this.updateChapterUI, this);
        EventMgr.addEventListener(StoryProxy.boxUpdate, this.updateChapterRewardUI, this);

    }

    onDestroy() {
        ChapterView.instance = null;
        EventMgr.removeEventListener(StoryProxy.infoUpdate, this.updateChapterUI, this);
        EventMgr.removeEventListener(StoryProxy.boxUpdate, this.updateChapterRewardUI, this);
    }

    onOpen(uid, questId: number) {
        if (questId > 0) {
            this.curStoryData = dataManager.storyProxy.getSectionData(questId);
        } else {
            this.curStoryData = dataManager.storyProxy.curStoryData;
        }
        this.maxChapterId  = dataManager.storyProxy.curStoryData.chapterId;
        this.initUI();
    }

    initUI() {

        this.chapterId = this.curStoryData.chapterId;
        this.isNewSection = true;
        if(cc.sys.localStorage.getItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name)){
            if(parseInt(cc.sys.localStorage.getItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name))<dataManager.storyProxy.curStoryData.chapterId){
                if(dataManager.storyProxy.curStoryData.chapterId>1 && dataManager.storyProxy.curStoryData.sectionId == 1)
                {

                    this.isNewSection = false;
                }
            }else {

                this.isNewSection = false;
            }
        }else {

            cc.sys.localStorage.setItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name,1);
        }

        if(!this.isNewSection && dataManager.storyProxy.curStoryData.chapterId>1 && dataManager.storyProxy.curStoryData.sectionId == 1 && parseInt(cc.sys.localStorage.getItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name))<dataManager.storyProxy.curStoryData.chapterId)
        {
            this.chapterId = dataManager.storyProxy.curStoryData.chapterId-1;
        }else {
            this.chapterId = this.curStoryData.chapterId;
        }


        this.updateAllUI();


    }


    updateAllUI() {

        let data = dataManager.storyProxy.getChapterData(this.chapterId);

        this.lb_chapter_index.string = dataManager.GetTextById(360, dataManager.GetChineseTextByNum(this.chapterId));
        this.lb_chapter_name.string = dataManager.GetTextById(data.name);
        this.lb_chapter_desc.string = dataManager.GetTextById(data.name_desc);
        this.lb_chapter_title.string = this.lb_chapter_index.string + ' ' + this.lb_chapter_name.string;

        this.updateChapterUI();
        this.updateChapterRewardUI();
        if (this.isNewSection) {
            this.node_animation.active = true;
            utils.showNodeEffect(this.node_animation, 0,()=>{

                this.isNewSection = false;
                this.node_animation.active = false;
            });
        } else {
            this.node_animation.active = false;
        }
    }
    checkNextChapter()
    {
       var ids =  dataManager.storyProxy.getChapterData(this.chapterId ).section_ids;
       if(ids && ids[ids.length-1].star >0){
           return true;
       }
       return false;

    }

    updateChapterUI() {
        if (dataManager.storyProxy.getChapterData(this.chapterId - 1))
            this.btn_pre_chapter.active = true;
        else
            this.btn_pre_chapter.active = false
        if (dataManager.storyProxy.getChapterData(this.chapterId + 1) && (this.chapterId<this.maxChapterId || this.checkNextChapter()))
            this.btn_next_chapter.active = true;
        else
            this.btn_next_chapter.active = false;


        this.chapterCopyList.data = dataManager.storyProxy.getSectionDataByChapter(this.chapterId);
        let scroll = this.chapterCopyList.scrollView;
        if(dataManager.storyProxy.curStoryData.chapterId>1 && dataManager.storyProxy.curStoryData.sectionId == 1 && this.chapterId == (dataManager.storyProxy.curStoryData.chapterId - 1)&& !this.isNewSection)
        {
            setTimeout(
                ()=>{
                    scroll.scrollToPercentHorizontal(parseInt(cc.sys.localStorage.getItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name))<dataManager.storyProxy.curStoryData.chapterId?1:0);
                },50);
        }else {
            if (this.chapterId === this.curStoryData.chapterId) {
                scroll.scrollToPercentHorizontal((this.curStoryData.sectionId - 2) / (this.chapterCopyList.data.length - 4));

            }
            else {
                scroll.scrollToPercentHorizontal(0);

            }

        }

        this.updateRedDot();
    }

    updateChapterRewardUI() {
        this.lbAllStarNum.string = dataManager.storyProxy.starChapter[this.chapterId] + '';
        this.starRwdList.data = dataManager.storyProxy.starawards.get(this.chapterId);
    }

    updateRedDot() {
        RedDot.change('preChapter', false);
        RedDot.change('nextChapter', false);

        if (this.btn_pre_chapter.active) {
            for (let k = 1; k < this.chapterId; k++) {
                let rwdList = dataManager.storyProxy.starawards.get(k);
                let bShow = false;
                for (let boxData of rwdList) {
                    if (boxData.status === BoxStatus.CanOpen) {
                        RedDot.change('preChapter', true);
                        bShow = true;
                        break;
                    }
                }
                if (bShow) {
                    break;
                }
            }
        }

        if (this.btn_next_chapter.active) {
            for (let k = this.chapterId + 1; k <= dataManager.storyProxy.starawards.size; k++) {
                let rwdList = dataManager.storyProxy.starawards.get(k);
                for (let boxData of rwdList) {
                    if (boxData.status === BoxStatus.CanOpen) {
                        RedDot.change('nextChapter', true);
                        return;
                    }
                }
            }
        }
    }

    onClickStarItem(node, data) {
        // uiManager.open(UIID.UIDropItem);

    }

    onClickPreSectionBtn() {

        if (this.chapterId > 1) {
            this.chapterId -= 1;
            this.updateAllUI();
        }

    }

    onClickNextSectionBtn() {
        this.chapterId += 1;
        if(dataManager.storyProxy.curStoryData.chapterId>1 && dataManager.storyProxy.curStoryData.sectionId == 1 && parseInt(cc.sys.localStorage.getItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name))<dataManager.storyProxy.curStoryData.chapterId)
        {

            cc.sys.localStorage.setItem("zhimeng_chapter_show_index_"+dataManager.playerProxy.data.name,dataManager.storyProxy.curStoryData.chapterId);
            this.isNewSection = true;
        }
        this.updateAllUI();
    }



    updateCurSection() {
        this.chapterId++;
        if (this.chapterId >= dataManager.storyProxy.getChapterData(this.chapterId).chapter_ids.length) {
            this.chapterId++;
            this.chapterId = 0;

            this.node_animation.active = true;
            utils.showNodeEffect(this.node_animation, 0,()=>{
                this.node_animation.active = false;});
        }
        this.updateAllUI();
    }

    onClickLeftBtn() {
        // let scroll = this.chapterCopyList.scrollView;
        // scroll.scrollToTopLeft();

        this.onClickPreSectionBtn();



    }

    onClickRightBtn() {
        // let scroll = this.chapterCopyList.scrollView;
        // scroll.scrollToRight();
        this.onClickNextSectionBtn();
    }

    onClickCloseBtn() {
        this.closeSelf();
        uiManager.open(UIID.UIMain)
    }
    onClickMemoryBtn() {

        uiManager.open(UIID.UIMemory)
    }

    onTop() {

    }






    // update (dt) {}
}