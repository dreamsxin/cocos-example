// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { uiManager } from "../../../../base/ui/UIManager";
import MultiLabel from "../../../../util/MultiLabel";
import { utils } from "../../../../util/Utils";
import { dataManager } from "../../../data/DataManager";
import { UIID } from "../../UIConfig";
import RenderListItem from "../common/RenderListItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChapterCopyItem extends RenderListItem {


    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(MultiLabel)
    lbLockname: MultiLabel = null;

    @property(MultiLabel)
    lb_index: MultiLabel = null;

    @property(MultiLabel)
    lb_cur_name: MultiLabel = null;

    @property({ type: [cc.Node] })
    node_stars: cc.Node[] = [];

    @property(cc.Node)
    node_pos: cc.Node = null;

    @property(cc.Node)
    node_pass: cc.Node = null;

    @property(cc.Node)
    node_cur: cc.Node = null;

    @property(cc.Node)
    node_lock: cc.Node = null;




    @property(cc.Node)
    node_fight: cc.Node = null;
    @property(cc.Node)
    node_cloth: cc.Node = null;

    @property(cc.Node)
    node_text: cc.Node = null;


    @property(cc.Node)
    node_tili: cc.Node = null;
    private isClicked = false;
    // onLoad () {}

    showData() {
        this.isClicked = false;

        this.lb_name.string = dataManager.GetTextById(this.data.name);
        this.lb_cur_name.string = dataManager.GetTextById(this.data.name);
        this.lb_index.string = this.data.chapterId + "-" + this.data.sectionId;
        this.lbLockname.string = dataManager.GetTextById(this.data.name);
        // if(this.data.star>0)
        //     this.lb_index.node.getComponent(cc.LabelOutline).color = new cc.Color(100,83,50,255);
        // else
        //     this.lb_index.node.getComponent(cc.LabelOutline).color = new cc.Color(166,105,115,255);
        this.node_cur.active = this.data == dataManager.storyProxy.curStoryData;
        this.lb_name.node.active = this.data.star > 0;
        this.lb_cur_name.node.active = this.node_cur.active;
        this.node_pass.active = this.data.star > 0;
        this.node_lock.active = this.data.star === 0 && !this.node_cur.active;
        this.node_pos.y = this.data.id % 2 == 0 ? -200 : 0;
        this.node_cloth.active = this.data.task_accessorie && !this.node_lock.active ? true : false;
        this.node_fight.active = this.data.task_fight && !this.node_lock.active? true : false;

        this.initStars();

        //this.node.angle = this.data.id;

    }

    initStars() {
        for (var i = 0; i < this.node_stars.length; i++) {
            this.node_stars[i].active = false;
            if (i < this.data.star) {
                this.node_stars[i].active = true;
            }
        }
    }

    onClickSectionItem(node, data) {

        if (this.data.star === 0 && this.data !== dataManager.storyProxy.curStoryData) {
            utils.showTips(dataManager.GetTextById(291));
        } else {
            if(this.isClicked)
                return;

            this.isClicked = true;
            if (this.data.task_accessorie || this.data.task_fight) {
                if(dataManager.playerProxy.data.vitality_val < 5)
                {
                    utils.showTips(dataManager.GetTextById(409));
                    return;
                }
                this.node_tili.stopAllActions();
                this.node_tili.y = 80;
                this.node_tili.opacity =0;
                var fadein = cc.fadeIn(0.3);
                var move = cc.moveTo(0.3,0,160);
                var fadeout = cc.fadeOut(0.2);
                var sp =cc.spawn(fadein,move);
                var cb =cc.callFunc(()=>{

                    this.isClicked = false;
                    if (!this.data.before_action_id) {
                        if (this.data.task_accessorie) {
                            //暂无换装，直接结算
                            uiManager.open(UIID.UICloth, this.data.id);
                            //dataManager.storyProxy.sendOverCmd(this.data.id);
                        } else if (this.data.task_fight) {
                            uiManager.open(UIID.UIBattle, this.data);
                        }
                    } else {
                        uiManager.open(UIID.UIPlot, { data: this.data });
                    }

                    uiManager.close(uiManager.getUI(UIID.UIChapter));
                });
                var sq = cc.sequence(sp,fadeout,cb);
                this.node_tili.runAction(sq);
            }else {
                // if (!this.data.before_action_id) {
                //     if (this.data.task_accessorie) {
                //         //暂无换装，直接结算
                //         uiManager.open(UIID.UICloth, this.data.id);
                //         //dataManager.storyProxy.sendOverCmd(this.data.id);
                //     } else if (this.data.task_fight) {
                //         uiManager.open(UIID.UIBattle, this.data);
                //     }
                // } else {

                this.isClicked = false;
                uiManager.open(UIID.UIPlot, { data: this.data });

                uiManager.close(uiManager.getUI(UIID.UIChapter));
                // }
            }

        }
    }
}
