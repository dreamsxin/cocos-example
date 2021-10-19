// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


//ID	类型	各种属性	技能目标	属性值（百分比）	特效
//id	type	properties	target	propertiesvaluepercent	effectId


import { EventMgr } from "../../base/common/EventManager";
import { netManager, NetManager } from "../../base/network/NetManager";
import { NetNode } from "../../base/network/NetNode";
import { BoxStatus } from "../../util/Utils";
import NetMsgID from "../netMsg/NetMsgID";
import { dataManager } from "./DataManager";
const { ccclass, property } = cc._decorator;

@ccclass
export default class StoryProxy {



    private sectionData = null;
    private chapterData = null;
    sectionId: number = 1;
    chapterId: number = 1;
    /**
     * 最新章节
     */
    curStoryData: any = null;
    static infoUpdate: string = 'StoryProxy_infoUpdate';
    static boxUpdate: string = 'StoryProxy_boxUpdate';
    /**
     * 章节宝箱
     */
    starawards: any;
    /**
     * 章节总星数
     */
    starChapter = [];


    public ctor() {



        NetNode.subscribe('quest.info', this.infoBack, this);
        NetNode.subscribe('starawards.info', this.starawardsBack, this);


        this.chapterData = dataManager.allDatas.chapter;
        this.sectionData = [];
        let cfgSection = dataManager.allDatas.section;

        for (let index in this.chapterData) {
            let k = 1;
            for (let num of this.chapterData[index].section_ids) {
                if (!cfgSection[num]) {
                    console.error('sectionIndex = null  ' + num);
                }
                cfgSection[num].chapterId = parseInt(index);
                cfgSection[num].sectionId = k;

                this.sectionData[num] = cfgSection[num];
                k++;
            }
        }


        for (let index in this.sectionData) {
            this.sectionData[index].star = 0;
            this.sectionData[index].curStar = 0;
            this.sectionData[index].isFirst = true;
            if (!this.curStoryData) {
                this.curStoryData = this.sectionData[index];
            }
        }

        this.starawards = new Map();

        for (let index in this.chapterData) {
            let data = this.chapterData[index];

            let newData: { id: number; star: any; rwd: any; pos: number; status: BoxStatus; }[] = [];
            newData.push({
                id: parseInt(index),
                star: data.stars_1st,
                rwd: data.star_drops_1st,
                pos: 1,
                status: BoxStatus.Default
            });
            newData.push({
                id: parseInt(index),
                star: data.stars_2nd,
                rwd: data.star_drops_2nd,
                pos: 2,
                status: BoxStatus.Default
            });
            newData.push({
                id: parseInt(index),
                star: data.stars_3rd,
                rwd: data.star_drops_3rd,
                pos: 3,
                status: BoxStatus.Default
            });

            this.starawards.set(parseInt(index), newData);
        }

        for (let i = 0; i < this.starawards.size; i++) {
            this.starChapter[i] = 0;
        }
    }



    public clearData() {

        this.curStoryData = null;
        this.sectionData = null;
        this.starawards = null;
        this.starChapter = null;
    }

    private starawardsBack(serverData) {

        if (!serverData || serverData.length === 0) {
            return;
        }

        serverData.forEach(element => {
            let data = this.starawards.get(element.id);
            if (data) {
                data[element.pos - 1].status = BoxStatus.Opened;
            }
        });

        dataManager.systemProxy.floatReward();

        EventMgr.raiseEvent(StoryProxy.boxUpdate);
    }



    private infoBack(serverData) {
        if (!serverData || serverData.length === 0) {
            return;
        }

        serverData.forEach(element => {
            let data = this.sectionData[element.id];
            if (data) {
                data.star = element.star ? element.star : 0;
                data.curStar = element.curStar ? element.curStar : 0;
                data.isFirst = element.isFirst ? element.isFirst : false;
            }
            //计算所有章节总星数
            let chapter = data.chapterId;
            this.starChapter[chapter] += data.star;
        });

        //更新宝箱状态
        this.starawards.forEach((data, id) => {
            data.forEach(element => {
                if (element.star <= this.starChapter[id] && element.status === BoxStatus.Default) {
                    element.status = BoxStatus.CanOpen;
                }
            });
        });

        for (let index in this.sectionData) {
            if (this.sectionData[index].star == 0) {
                this.curStoryData = this.sectionData[index];
                break;
            }
        }

        EventMgr.raiseEvent(StoryProxy.infoUpdate);

    }

    sendOverCmd(storyId: number) {
        let req = {
            questId: storyId
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Story_END, req);
    }

    sendOpenBoxCmd(chapterId: number, pos: number) {
        let req = {
            chapterId: chapterId,
            pos: pos
        };

        netManager.sendCmd(NetMsgID.NetMsgID_Story_Box, req);
    }

    /**
     * 章
    */

    public getAllChapterData() {
        return this.chapterData;
    }

    public getChapterData(chapterId: number) {
        return this.chapterData[chapterId];
    }

    /**
     * 节
    */

    public getSectionData(sectionId: number) {
        return this.sectionData[sectionId];
    }

    public getSectionTask(sectionId: number) {
        return dataManager.allDatas.accessorie_task[this.sectionData[sectionId].task_accessorie];
    }

    public getSectionDataByChapter(chapterId: number) {

        let k = [];
        for (let index in this.sectionData) {
            if (this.sectionData[index].chapterId === chapterId) {
                k.push(this.sectionData[index]);
            }
            else {
                if (k.length > 0) {
                    break;
                }
            }
        }
        return k;
    }

    getActionData(id) {
        return dataManager.allDatas.action[id];
    }
}


