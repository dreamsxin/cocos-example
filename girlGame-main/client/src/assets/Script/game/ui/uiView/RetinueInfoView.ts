// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { dataManager } from "../../data/DataManager";
import RenderList from "../uiComponent/common/RenderList";
import RetinueLiveItem from "../uiComponent/retinueView/RetinueLiveItem";
import RetinueSkillItem from "../uiComponent/retinueView/RetinueSkillItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueInfoView extends UIView {

    @property(MultiLabel)
    lblName: MultiLabel = null;

    @property(MultiLabel)
    lblType: MultiLabel = null;

    @property(MultiLabel)
    lblLevel: MultiLabel = null;

    @property(MultiLabel)
    lblBreak: MultiLabel = null;

    @property(MultiLabel)
    lblDec: MultiLabel = null;

    @property(RenderList)
    statusList: RenderList = null;

    @property(MultiLabel)
    lblBreakName: MultiLabel = null;
    @property(MultiLabel)
    lblBreakBreak: MultiLabel = null;
    @property(cc.RichText)
    lblBreakResult: cc.RichText = null;

    @property(RetinueLiveItem)
    liveItem: RetinueLiveItem = null;

    @property([RetinueSkillItem])
    skillItems: RetinueSkillItem[] = [];




    private data = null;
    init(args) {

        this.data = args.retinue;

    }

    onLoad() {
        this.initUI();
    }

    initUI() {
        let data = this.data;

        this.lblName.string = dataManager.GetTextById(data.name_id);

        this.lblType.string = '【' + dataManager.retinueProxy.getTypeText(data.here_type) + '】';

        this.lblLevel.string = data.level + '';
        this.lblBreak.string = data.step + '';

        this.lblDec.string = dataManager.GetTextById(data.describe);

        //属性
        let curStatus = data.status;
        let status = [];
        for (let index = 0; index < curStatus.length; index++) {
            status.push({ num: curStatus[index], propertiesid: index + 1 });
        }
        this.statusList.data = status;
        //突破    
        this.scheduleOnce(this.showBreakText, 0);
        this.liveItem.data = data;

        this.skillItems[0].data = { step: data.step, skill: dataManager.skillProxy.getData(data.skill[1]) };
        this.skillItems[1].data = { step: data.step, skill: dataManager.skillProxy.getData(data.skill[2]) };



    }

    showBreakText() {
        //<color=#00ff00>Rich</c><color=#0fffff>Text</color>
        let data = this.data;
        let curBreakStatus = dataManager.retinueProxy.getAllBreakStatus(data.id);


        let strName = '';
        let strBreak = '';
        let strResult = '';

        let breakColorStart = '<color=#5DC382>';
        let unbreakColorStart = '<color=#C36B5D>';
        let strBreakResult1 = '【' + dataManager.GetTextById(404) + '】';
        let strBreakResult2 = '【' + dataManager.GetTextById(405) + '】';



        for (let index = 0; index < curBreakStatus.length; index++) {
            let addStr = '';
            let result = strBreakResult2;
            let cfg = curBreakStatus[index];
            let start = unbreakColorStart;
            if (index < data.step) {
                start = breakColorStart;
                result = strBreakResult1;
            }

            let end = '(' + dataManager.GetTextById(214) + (index + 1) + dataManager.GetTextById(288) + ')\n';

            switch (cfg.extra_type) {
                case 1:
                    //属性
                    addStr = dataManager.retinueProxy.getStatusText(cfg.extra_id[0]) + '+' + cfg.extra_num;

                    break;
                case 2:
                    //技能
                    let skillData = dataManager.skillProxy.getData(cfg.extra_id[0]);
                    let decStr = '';
                    if (skillData.skill_level === 1) {
                        decStr = dataManager.GetTextById(290);
                    } else {
                        decStr = '+1';
                    }
                    addStr = dataManager.GetTextById(skillData.name) + decStr;

                    break;
                case 3:
                    //初始士气
                    addStr = dataManager.GetTextById(289) + '+' + cfg.extra_num;

                    break;

            }

            strName += addStr + '\n';
            strBreak += end;

            strResult += start + result + '</color>\n';
        }

        this.lblBreakName.string = strName;
        this.lblBreakBreak.string = strBreak;
        this.lblBreakResult.string = strResult;
    }

    onDestroy() {
    }

    onClickCloseBtn() {
        this.closeSelf();
    }

}
