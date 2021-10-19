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
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import { dataManager } from "../../data/DataManager";
import SectionMemoryCopyItem from "../uiComponent/plotView/SectionMemoryCopyItem";
import RenderList from "../uiComponent/common/RenderList";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MemoryView extends UIView {



    @property(RenderList)
    renderList: RenderList = null;
    chapters: any[];
    chapter = -1;



    init() {

        let datas = dataManager.storyProxy.getAllChapterData();
        this.chapters = [];

        let chapter = dataManager.storyProxy.curStoryData.chapterId;
        if (dataManager.storyProxy.curStoryData.id.sectionId === 1) {
            chapter--;
        }
        if (chapter < 0) {
            chapter = 1;
        }


        for (let index in datas) {
            if (parseInt(index) > chapter) {
                break;
            }
            this.chapters.push(datas[index]);
        }

        this.renderList.data = this.chapters;
        this.onClickItemBtn(null,this.chapters[chapter-1]);
    }

    onOpen() {
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

    onClickItemBtn(touch, data) {
        if (data.id < 100) {
            if (this.chapter === data.id) {
                this.renderList.data = this.chapters;
                this.chapter = -1;
                return;
            }
            this.chapter = data.id;
            let allDatas = [];
            let sections = dataManager.storyProxy.getSectionDataByChapter(data.id);
            for (let i = 0; i < data.id; i++) {
                allDatas.push(this.chapters[i]);
            }

            for (let index in sections) {
                if (sections[index].id >= dataManager.storyProxy.curStoryData.id) {
                    break;
                }
                if (sections[index].before_action_id || sections[index].after_action_id) {
                    allDatas.push(sections[index]);
                }
            }

            for (let i = data.id; i < this.chapters.length; i++) {
                allDatas.push(this.chapters[i]);
            }

            this.renderList.data = allDatas;
        } else {
            if (data.before_action_id ) {
                uiManager.open(UIID.UIPlot, { data: data, bAfter: false, bInMemory: true });
            }else if( data.after_action_id)
            {

                uiManager.open(UIID.UIPlot, { data: data, bAfter: true, bInMemory: true });
            }

        }
    }

    onDestroy() {
        this.chapters = [];
    }
    // update (dt) {}
}
