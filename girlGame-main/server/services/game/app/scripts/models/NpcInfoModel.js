
/**
 * NPC信息表
 */
const { logger } = require('./../../app');
const { NPC_INFO } = require('./../../../datas/npc_info');

class NpcInfoModel
{
    // 获取NPC数据
    static getNpcData(npcId)
    {
        let npcObj = {
            level: 1,
            atk: 0,
            def: 0,
            hp: 0,
            dex: 0,
            critical: 0,
            sta: 0,
            acc: 0,
            eva: 0,
            skills: [0, 0, 0]
        }, npcData = NPC_INFO[npcId];
        if ("undefined" !== typeof npcData) {
            npcObj['level'] = npcData['level'] ? npcData['level'] : 1;
            npcObj['atk'] = npcData['damage'];
            npcObj['def'] = npcData['armor'];
            npcObj['hp'] = npcData['hp'];
            npcObj['dex'] = npcData['speed'];
            npcObj['critical'] = npcData['critical_strike'];
            npcObj['sta'] = npcData['resilience'];
            npcObj['acc'] = npcData['hit_rate'];
            npcObj['eva'] = npcData['dodge'];
            for (let i = 0; i < npcData['skill'].length; i++) {
                npcObj['skills'][i] = npcData['skill'][i];
            }
        } else {
            logger.Warn("[NpcInfoModel.getNpcData] Cannot find npc data: npcId=%d", npcId);
        }

        return npcObj;
    }
}

module.exports = NpcInfoModel;