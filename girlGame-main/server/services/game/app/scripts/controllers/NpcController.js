const { logger } = require('./../../app');
const NpcInfoModel = require('./../models/NpcInfoModel');
const PveBattleModel = require('./../models/PveBattleModel');

class Npc
{
    constructor(npcIds)
    {
        this.data_ = {};
        for (let npcId of npcIds) {
            if (npcId > 0) {
                this.data_[npcId] = NpcInfoModel.getNpcData(npcId);
            }
        }
    }

    static getEmbattle(taskId)
    {
        return PveBattleModel.getNpcEmbattle(taskId);
    }

    getLevel(npcId)
    {
        return this.data_[npcId]['level'];
    }

    getEnergy(npcId)
    {
        return 0;
    }

    getAttrAtk(npcId)
    {
        return this.data_[npcId]['atk'];
    }

    getAttrDef(npcId)
    {
        return this.data_[npcId]['def'];
    }
    
    getAttrHp(npcId)
    {
        return this.data_[npcId]['hp'];
    }

    getAttrDex(npcId)
    {
        return this.data_[npcId]['dex'];
    }

    getAttrCritical(npcId)
    {
        return this.data_[npcId]['critical'];
    }

    getAttrSta(npcId)
    {
        return this.data_[npcId]['sta'];
    }

    getAttrAcc(npcId)
    {
        return this.data_[npcId]['acc'];
    }

    getAttrEva(npcId)
    {
        return this.data_[npcId]['eva'];
    }

    getNormalSkillId(npcId)
    {
        return this.data_[npcId]['skills'][0];
    }

    getActiveSkillId(npcId)
    {
        return this.data_[npcId]['skills'][1];
    }

    getPassiveSkillId(npcId)
    {
        return this.data_[npcId]['skills'][2];
    }
}

module.exports = {
    Npc
}