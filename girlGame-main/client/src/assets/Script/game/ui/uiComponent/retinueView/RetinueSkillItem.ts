// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import SysDef from "../../../../util/SysDef";
import { utils } from "../../../../util/Utils";
import { dataManager } from "../../../data/DataManager";
import { SkillType } from "../../../data/SkillProxy";
import RenderListItem from "../common/RenderListItem";
import UrlLoad from "../common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueSkillItem extends RenderListItem {

    @property(MultiLabel)
    lblDec: MultiLabel = null;

    @property(MultiLabel)
    lblName: MultiLabel = null;

    @property(MultiLabel)
    lblLvTip: MultiLabel = null;

    @property(MultiLabel)
    lblLv: MultiLabel = null;

    @property(UrlLoad)
    spUrl: UrlLoad = null;

    showData() {
        if (!this._data) {
            return;
        }
        let skill = this.data.skill;

        this.lblName.string = dataManager.GetTextById(skill.name);
        if (skill.skill_type != SkillType.Passivity) {
            this.lblName.string = '【' + dataManager.GetTextById(359) + '】' + dataManager.GetTextById(skill.name);
        }

        let curSkill = utils.deepClone(skill);
        let buff = dataManager.allDatas.skill_effect[skill.buff_id];
        if (buff) {
            curSkill.propertiesvaluepercent = buff.propertiesvaluepercent + '%';
        }
        if (curSkill.probability) {
            curSkill.probability += '%';
        }
        if (curSkill.condition_percent) {
            curSkill.condition_percent += '%';
        }
        if (curSkill.damage_value) {
            curSkill.damage_value += '%';
        }
        if (curSkill.effect_value) {
            curSkill.effect_value += '%';
        }

        this.lblDec.string = dataManager.GetTextById(skill.skill_describe_id, curSkill);
        this.spUrl.url = SysDef.getSkillIconUrl(skill.skill_icon);


        if (skill.unlock_condition && this.data.step < skill.unlock_condition) {
            this.lblLvTip.string = dataManager.GetTextById(214) + skill.unlock_condition + dataManager.GetTextById(288);
            this.lblLv.string = '';
        } else {
            this.lblLv.string = '' + skill.skill_level;
            this.lblLvTip.string = dataManager.GetTextById(132);
        }
    }

    onDestroy() {

    }
}
