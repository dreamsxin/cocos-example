// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { uiManager } from "../../../base/ui/UIManager";
import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { shaderUtils } from "../../../util/ShaderUtils";
import { uiUtils } from "../../../util/UIUtils";
import { utils } from "../../../util/Utils";
import { dataManager } from "../../data/DataManager";
import RenderList from "../uiComponent/common/RenderList";
import { UIID } from "../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleResultView extends UIView {



    @property(cc.Animation)
    winAni: cc.Animation = null;

    @property(cc.Node)
    baseNode: cc.Node = null;


    @property(cc.Node)
    nodeWinPic: cc.Node = null;

    @property(cc.Node)
    nodeLossPic: cc.Node = null;

    @property([cc.Node])
    nodeFlowers: cc.Node[] = [];

    @property(cc.Node)
    nodeBottom: cc.Node = null;

    @property(RenderList)
    resList: RenderList = null;

    @property(cc.Node)
    nodeLevelUp: cc.Node = null;

    @property(MultiLabel)
    lblLevel: MultiLabel = null;

    @property(cc.ProgressBar)
    barExp: cc.ProgressBar = null;

    private result = null;
    sectionData: any;

    private isAnimationEnd = false;
    onOpen(id, data) {

        this.sectionData = data;


        this.result = dataManager.battleRetinueProxy.result;
        this.isAnimationEnd = false;
        this.initUI();
    }
    initUI() {
        if (this.result && !this.result.win) {
            shaderUtils.setNodeGray(this.baseNode);
            this.nodeWinPic.active = false;
            this.nodeLossPic.active = true;
            this.nodeBottom.active = false;
            this.isAnimationEnd = true;


        } else {
            shaderUtils.setNodeNormal(this.baseNode);
            this.nodeLossPic.active = false;
            this.nodeWinPic.active = true;
            this.nodeBottom.active = true;

            this.updateStar();
            this.updateItems();
            // this.updateExpBar();
            this.winAni.play("battleResult");
            this.winAni.on(cc.Animation.EventType.FINISHED,()=>{
                this.updateExpBar();});

        }

    }

    updateStar() {

        this.nodeFlowers.forEach(function (node) {
            node.active = false;
        })
        if (this.result && this.result.win) {
            //显示星数
            switch (this.result.star) {
                case 1:
                    this.nodeFlowers[0].active = true;
                    break;
                case 2:
                    this.nodeFlowers[0].active = true;
                    this.nodeFlowers[1].active = true;
                    break;
                case 3:
                    this.nodeFlowers[0].active = true;
                    this.nodeFlowers[1].active = true;
                    this.nodeFlowers[2].active = true;
                    break;
            }
        }
    }

    updateItems() {

        if (this.result && !this.result.win) {
            return;
        }

        this.resList.data = this.result.reward;
    }

    updateExpBar() {
        this.isAnimationEnd = true;
        let curlevel = dataManager.playerProxy.data.level;
        let curExp = dataManager.playerProxy.getTotalExp(dataManager.playerProxy.data.exp, curlevel);

        let preExp = curExp;
        for (let data of this.result.reward) {
            if (data.id === 4) {
                //经验
                preExp = curExp - data.count;
                break;
            }
        }

        this.nodeLevelUp.active = false;

        if (preExp < curExp) {

            let preLv = dataManager.playerProxy.getLevelByExp(preExp);

            this.lblLevel.string = dataManager.GetTextById(238) + preLv;

            let pre = dataManager.playerProxy.getProgressExp(preExp);
            let cur = dataManager.playerProxy.getProgressExp(curExp);


            if (curlevel === preLv) {
                uiUtils.showPrgChange(this.barExp, pre, cur);
            } else {
                uiUtils.showPrgChange(this.barExp, pre, curlevel - preLv + cur, this.showlvUp.bind(this));
            }
        } else {
            //没有经验增加
            this.lblLevel.string = dataManager.GetTextById(238) + curlevel;

            let cur = dataManager.playerProxy.getProgressExp(curExp);

            this.barExp.progress = cur;
        }

    }

    showlvUp() {
        this.nodeLevelUp.active = true;

        this.lblLevel.string = dataManager.GetTextById(238) + dataManager.playerProxy.data.level;
    }

    onDestroy() {


    }
    onClickCloseBtn() {
        if(this.isAnimationEnd)
        {
            uiManager.close(uiManager.getUI(UIID.UIBattle));
            this.closeSelf();
            if(this.sectionData.star==0){

                uiManager.open(UIID.UIChapter);
            }else {
                if (this.result && this.result.win && this.sectionData.after_action_id) {
                    uiManager.open(UIID.UIPlot, { data: this.sectionData, bAfter: true });
                }
                else  {
                    uiManager.open(UIID.UIChapter, this.sectionData.id);
                }
            }


        }else {
            this.winAni.stop();
            this.winAni.play("battleResult",this.winAni.defaultClip.duration);
        }

    }

}
