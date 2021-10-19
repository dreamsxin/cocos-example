/**
 * 章节表
 */
const DropPacket = require('./DropPacketModel');
const { logger } = require('./../../app');
const { CHAPTER } = require('./../../../datas/chapter');

const STAR_AWARDS_MAX = 3; // 最大宝箱数

class ChapterModel
{
    static getSectionIds(chapterId)
    {
        let ids = null, 
            chapterData = CHAPTER[chapterId];
        if ("undefined" !== typeof chapterData) {
            ids = chapterData['section_ids'];
        }
        
        return ids;
    }

    static getNeedStarTotal(chapterId, pos)
    {
        let chapterData = CHAPTER[chapterId], needStarTotal = 99999999;
        if ("undefined" !== typeof chapterData) {
            if (pos === 1) {
                needStarTotal = chapterData['stars_1st'];
            } else if (pos === 2) {
                needStarTotal = chapterData['stars_2nd'];
            } else if (pos === 3) {
                needStarTotal = chapterData['stars_3rd'];
            }
        }

        return needStarTotal;
    }

    static getStarAwardsByPos(chapterId, pos)
    {
        let chapterData = CHAPTER[chapterId], 
            bonus = [];
            /*
        if ("undefined" !== typeof chapterData) {
            if (starTotal >= chapterData['stars_3rd']) {
                bonus = DropPacket.getItemsByDropIds(chapterData['star_drops_3rd']);
            } else if (starTotal >= chapterData['stars_2nd']) {
                bonus = DropPacket.getItemsByDropIds(chapterData['star_drops_2nd']);
            } else if (starTotal >= chapterData['stars_1st']) {
                bonus = DropPacket.getItemsByDropIds(chapterData['star_drops_1st']);
            }
        }*/

        if ("undefined" !== typeof chapterData) {
            if (pos === 1) {
                bonus = chapterData['star_drops_1st'];
            } else if (pos === 2) {
                bonus = chapterData['star_drops_2nd'];
            } else if (pos === 3) {
                bonus = chapterData['star_drops_3rd'];
            }
        }

        return bonus;
    }
}

module.exports = ChapterModel;