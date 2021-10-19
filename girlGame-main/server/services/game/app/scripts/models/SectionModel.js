/**
 * 副本（关卡）章节表
 */
const { logger } = require('./../../app');
const { SECTION } = require('./../../../datas/section');

class SectionModel
{
    // 任务类型
    static TASK_TYPES()
    {
        return {
            STORY: 0, // 剧情任务
            ACCESSORIE: 1, // 配装任务
            FIGHT: 2 // 战斗任务
        }
    }

    // 获取副本解锁数据
    static getUnlockData(questId)
    {
        let questData = SECTION[questId];
        if ("undefined" === typeof questData) {
            logger.Warn("[SectionModel.getUnlockConditionData] Cannot find quest: questId=%d", questId);
            return null;
        } else {
            return {
                unlock_type: questData['unlock_type'],
                cond_type: questData['unlock_condition_type'] ? questData['unlock_condition_type'] : 0,
                cond_value: questData['unlock_condition'] ? questData['unlock_condition'] : 0
            }
        }
    }

    // 获取任务数据
    static getTaskData(questId)
    {
        let questData = SECTION[questId];
        if ("undefined" === typeof questData) {
            logger.Warn("[SectionModel.getUnlockConditionData] Cannot find quest: questId=%d", questId);
            return null;
        } else {
            let taskId, taskType;
            if ("number" === typeof questData['task_accessorie']) {
                // 配装任务
                taskType = SectionModel.TASK_TYPES().ACCESSORIE;
                taskId = questData['task_accessorie'];
            } else if ("number" === typeof questData['task_fight']) {
                // 战斗任务
                taskType = SectionModel.TASK_TYPES().FIGHT;
                taskId = questData['task_fight'];
            } else {
                taskType = SectionModel.TASK_TYPES().STORY;
                taskId = 0;
            }

            return {
                type: taskType,
                id: taskId
            }
        }
    }
}

module.exports = SectionModel;