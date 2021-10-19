/**
 * 配装任务表
 */
const AccessorieModel = require('./AccessorieModel');
const { logger } = require('./../../app');
const { ACCESSORIE_TASK } = require('./../../../datas/accessorie_task');

class AccessorieTaskModel
{
    static STYLES()
    {
        return {
            TRADITION: 1, //传统
            ELEGANT: 2, //风雅
            PLAIN: 3, //质朴
            PLAYFUL: 4, //俏皮
            GENTLE: 5, //温婉
            FRESH: 6, //清新
            FOREIGN: 7, //异域
            LIVELY: 8, //活泼
            LUXURY: 9, //华贵
            MODESTY: 10, //端庄
            HEROIC: 11, //英气
            CARESSING: 12 //妩媚
        }
    }

    // 获取评星风格
    static getRatingStylesWeight(taskId)
    {
        let styleObj = {};
        let accessorieTaskData = ACCESSORIE_TASK[taskId];
        if ("undefined" !== typeof accessorieTaskData) {
            let styleIds = accessorieTaskData['style_id'],
                styleVals = accessorieTaskData['style_persent'];

            for (let i = 0; i < styleIds.length; i++) {
                styleObj[styleIds[i]] = styleVals[i];
            }
        } else {
            logger.Warn("[AccessorieTaskModel.getRatingStyles] Cannot find accessorie task data: taskId=%d", taskId);
        }

        return styleObj;
    }

    // 获取评分分段
    static getGrade(taskId)
    {
        let accessorieTaskData = ACCESSORIE_TASK[taskId];
        if ("undefined" !== typeof accessorieTaskData) {
            return accessorieTaskData['grade'];
        } else {
            logger.Warn("[AccessorieTaskModel.getGrade] Cannot find accessorie task data: taskId=%d", taskId);
            return [0, 0, 0];
        }
    }

    // 获取配装副本评分
    static getRatingStar(taskId, accessorieIds)
    {
        let ratingData = AccessorieTaskModel.getRatingStylesWeight(taskId); // 获取副本的风格加成数据

        let styleObj = {};
        // 初期化风格列表（共12总）
        for (let i = 1; i <= 12; i++) {
            styleObj[i] = 0;
        }
        
        for (let accessorieId of accessorieIds) {
            if (accessorieId > 0) {
                styleObj = AccessorieModel.getStyleScoreByRatingData(styleObj, accessorieId, ratingData);
            }
        }

        let scoreTotal = 0, styleScoreLis = [], styleIds = Object.keys(styleObj);
        for (let styleId of styleIds) {
            scoreTotal += styleObj[styleId];
            styleScoreLis.push({ id: styleId, score: styleObj[styleId] });
        }

        let grade = AccessorieTaskModel.getGrade(taskId);
        for (let i = (grade.length - 1); i >= 0; i--) {
            var score = grade[i];
            if (scoreTotal >= score) {
                return [(i + 1), scoreTotal, styleScoreLis];
            }
        }

        return [0, scoreTotal, styleScoreLis];
    }

    static getAwardList(taskId, star)
    {
        let lis = [];

        if (star < 1 || star > 3) {
            return lis;
        }

        let accessorieTaskData = ACCESSORIE_TASK[taskId];
        if ("undefined" !== typeof accessorieTaskData) {
            lis.push(accessorieTaskData['award'][star-1]);
        }

        return lis;
    }
}

module.exports = AccessorieTaskModel;