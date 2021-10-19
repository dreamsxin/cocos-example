/**
 * 随从突破表
 */
const { logger } = require('./../../app');
const { 
    HERO_STEP, 
    INDEX_HERO_STEP_ROLE_ID 
} = require('./../../../datas/hero_step');
const ModelHelper = require('./ModelHelper');

class HeroStepModel
{
    static getStepData(heroId, nextStepValue)
    {
        let ids = INDEX_HERO_STEP_ROLE_ID[heroId], 
            stepData = null;
        if ("undefined" === typeof ids) {
            logger.Warn("[HeroStepModel.getStepData] Cannot find index data: heroId=%d", heroId);
        } else if (nextStepValue > ids.length) {
            logger.Warn("[HeroStepModel.getStepData] Step is great than max: heroId=%d, nextStepValue=%d", heroId, nextStepValue);
        } else {
            for (let id of ids) {
                if (HERO_STEP[id]['stepnum'] === nextStepValue) {
                    // 找到数据
                    let STEP_NODE = HERO_STEP[id];
                    stepData = {
                        step_max: ids.length,
                        need_level: STEP_NODE['need_level'],
                        cost_items: ModelHelper.getItemList(STEP_NODE['costitemid'], STEP_NODE['costitemnum']),
                        properties: ModelHelper.getHeroProperties(STEP_NODE['propertiesid'], STEP_NODE['properties']),
                        ext_properties: ModelHelper.getHeroAttrObject(),
                        ext_energy: 0,
                        next_skill_id: 0
                    };

                    // 额外属性加成
                    if (STEP_NODE['extra_type'] === 1) {
                        // 属性加成
                        stepData['ext_properties'] = ModelHelper.getHeroProperties(STEP_NODE['extra_id'], STEP_NODE['extra_num']);
                    } else if (STEP_NODE['extra_type'] === 2) {
                        // 技能提升
                        stepData['next_skill_id'] = STEP_NODE['extra_id'].length > 0 ? STEP_NODE['extra_id'][0] : 0;
                    } else if (STEP_NODE['extra_type'] === 3) {
                        // 增加初始士气
                        stepData['ext_energy'] = STEP_NODE['extra_num'].length > 0 ? STEP_NODE['extra_num'][0] : 0;
                    }

                    break;
                }
            }
        }

        return stepData;
    }
}

module.exports = HeroStepModel;