const data_models = require('./../../defs/data.models');
const { DataHelper } = require('./../../com/helpers');
const { logger } = require('./../../app');
const PveBattleModel = require('./../models/PveBattleModel');
const SectionModel = require('./../models/SectionModel');
const ChapterModel = require('./../models/ChapterModel');
const DropPacketModel = require('./../models/DropPacketModel');
const { Item } = require('./../controllers/ItemController');
const AccessorieTaskModel = require('./../models/AccessorieTaskModel');

//（1）需要记录解锁副本ID
class Quest
{
    constructor(playerId)
    {
        this.player_id_ = playerId;
        this.tblname_ = "player_quests";
        this.data_ = null;
    }

    load(cb)
    {
        DataHelper.getTableFieldValue(this.tblname_, { player_id: this.player_id_ }, {
            player_id: 'string', unlock_data: 'string', star_award_data: 'string'
        }, questData => {
            if (questData) {
                this.data_ = questData;
                this.toFieldJSON();
                cb(true);
            } else {
                // 需要新建
                let model = data_models[this.tblname_](), 
                    saveData = {}, 
                    fields = Object.keys(model);
                model['player_id'] = this.player_id_;

                for (let field of fields) {
                    saveData[field] = model[field];
                }
                saveData['unlock_data'] = JSON.stringify(model['unlock_data']);
                saveData['star_award_data'] = JSON.stringify(model['star_award_data']);

                this.data_ = model;

                DataHelper.newTable(this.tblname_, { player_id: this.player_id_ }, saveData, (ok) => {
                    cb(ok);
                });
            }
        });
    }

    save(cb)
    {
        if (this.data_ !== null) {
            this.toFieldString();
            DataHelper.setTableFieldValue(this.tblname_, { player_id: this.player_id_ }, this.data_, (ret) => {
                cb(ret);
            });
        } else {
            cb(false);
        }
    }

    toFieldJSON()
    {
        try {
            this.data_['unlock_data'] = JSON.parse(this.data_['unlock_data']);
            if (this.data_['star_award_data'] === null) {
                this.data_['star_award_data'] = [];
            } else {
                this.data_['star_award_data'] = JSON.parse(this.data_['star_award_data']);
            }
        } catch (e) {
            logger.Warn("[Quest.toFieldJSON] Parse field to json failed:", e);
        }
    }

    toFieldString()
    {
        this.data_['unlock_data'] = JSON.stringify(this.data_['unlock_data']);
        this.data_['star_award_data'] = JSON.stringify(this.data_['star_award_data']);
    }

    getUnlockData()
    {
        return this.data_['unlock_data'];
    }

    addUnlockData(node) // node = { id, star }
    {
        this.data_['unlock_data'].push(node);
    }

    setUnlockData(questId, newStar)
    {
        let ret = false;
        for (let i = 0; i < this.data_['unlock_data'].length; i++) {
            if (this.data_['unlock_data'][i].id === questId) {
                if (this.data_['unlock_data'][i].star < newStar) {
                    this.data_['unlock_data'][i].star = newStar;
                    ret = true;
                }
                return [this.data_['unlock_data'][i], ret];
            }
        }

        return [null, ret];
    }

    getStarAwardData()
    {
        return this.data_['star_award_data'];
    }

    addStarAwardData(node)
    {
        this.data_['star_award_data'].push(node);
    }

    // 判断星级宝箱是否已领取
    checkReward(chapterId, pos)
    {
        for (let award_record of this.data_['star_award_data']) {
            if (award_record['id'] === chapterId && award_record['pos'] === pos) {
                return true;
            } 
        }

        return false;
    }

    // 获取该章节评星总数
    getStarTotalByChapterId(chapterId)
    {
        let o = {};
        for (let node of this.data_['unlock_data']) {
            o[node['id']] = node['star'];
        }

        let starTotal = 0,
            sectionIds = ChapterModel.getSectionIds(chapterId);
        for (let sectionId of sectionIds) {
            if ("number" === typeof o[sectionId]) {
                starTotal += o[sectionId];
            }
        }

        return starTotal;
    }

    checkNeedStar(chapterId, pos)
    {
        let needStarTotal = ChapterModel.getNeedStarTotal(chapterId, pos),
            currStarTotal = this.getStarTotalByChapterId(chapterId);
        return currStarTotal >= needStarTotal;
    }

    getStarAwards(chapterId, pos)
    {
        let star_awards_lis = ChapterModel.getStarAwardsByPos(chapterId, pos);
        if (star_awards_lis.length > 0) {
            let lis = DropPacketModel.getItemsByDropIds(star_awards_lis);
            return [Item.categoryItem(lis), lis];
        } else {
            return [null, null];
        }
    }

    // 判断副本是否已解锁
    checkQuestUnlock(questId)
    {
        for (let v of this.data_['unlock_data']) {
            if (v['id'] === questId) {
                return true; // 已解锁
            }
        }

        return false;
    }

    static verifyUnlockConditon(questId)
    {
        let unlockData = SectionModel.getUnlockData(questId);
        return [true, null] // [success, errCode];
    }

    static isStoryQuest(type)
    {
        return type === SectionModel.TASK_TYPES().STORY;
    }

    static isFightQuest(type)
    {
        return type === SectionModel.TASK_TYPES().FIGHT;
    }

    static isClothingQuest(type)
    {
        return type === SectionModel.TASK_TYPES().ACCESSORIE;
    }

    static getTaskData(questId)
    {
        return SectionModel.getTaskData(questId);
    }

    // 副本战斗相关
    static getBattleRatingStar(taskId, hpRate)
    {
        return PveBattleModel.getRatingStar(taskId, hpRate);
    }

    static getAwards(taskId)
    {
        let award_lis = PveBattleModel.getAwardList(taskId);
        let lis = DropPacketModel.getItemsByDropIds(award_lis);
        return [Item.categoryItem(lis), lis];
    }

    // 副本配装相关
    static getClothingRatingStar(taskId, accessorieIds)
    {
        return AccessorieTaskModel.getRatingStar(taskId, accessorieIds);
    }

    static getClothingAwards(taskId, ratingStar)
    {
        let award_lis = AccessorieTaskModel.getAwardList(taskId, ratingStar);
        let lis = DropPacketModel.getItemsByDropIds(award_lis);
        return [Item.categoryItem(lis), lis];
    }
}

module.exports = {
    Quest
}