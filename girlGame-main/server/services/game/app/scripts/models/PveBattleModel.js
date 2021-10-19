/**
 * 副本战斗表
 */
const { logger } = require('./../../app');
const { PVE_BATTLE } = require('./../../../datas/pve_battle');

class PveBattleModel
{
    // 获取NPC布阵
    static getNpcEmbattle(taskId)
    {
        let pveBattleData = PVE_BATTLE[taskId];
        if ("undefined" !== typeof pveBattleData) {
            return pveBattleData['npc'];
        } else {
            return [0, 0, 0, 0, 0, 0];
        }
    }

    // 根据战斗剩余血量百分比获取评星
    static getRatingStar(taskId, hpRate)
    {
        let pveBattleData = PVE_BATTLE[taskId];
        if ("undefined" !== typeof pveBattleData) {
            for (let i = (pveBattleData['star_level'].length - 1); i >= 0; i--) {
                var score = pveBattleData['star_level'][i];
                if (hpRate >= score) {
                    return (i + 1);
                }
            }
        } else {
            return 0;
        }
    }

    // 获取奖励
    static getAwardList(taskId)
    {
        let lis = [];
        let pveBattleData = PVE_BATTLE[taskId];
        if ("undefined" !== typeof pveBattleData) {
            lis = lis.concat(pveBattleData['award']);
        }

        return lis;
    }
}

module.exports = PveBattleModel;