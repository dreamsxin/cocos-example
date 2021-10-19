/**
 * 抽卡表
 */
const { random } = require('./../../com/utility');
const { logger } = require('./../../app');
const { GACHA } = require('./../../../datas/gacha');

class GachaModel
{
    static randGacha(max=1)
    {
        const singleRand = (lis, randTotal) => {
            let total = 0;
            for (let v of lis) {
                var seed = random(1, randTotal - total);
                if (seed <= v.rand) {
                    return v.id;
                }

                total += v.rand;
            }

            return 0; // 正常概率不会出现这种情况
        }

        let rand_lis = [], ids = Object.keys(GACHA), result_lis = [], randTotal = 0;
        for (let id of ids) {
            let randVal = GACHA[id]['probability']*100;
            randTotal += randVal;
            rand_lis.push({ id: GACHA[id]['item_id'], rand: randVal });
        }

        for (let i = 0; i < max; i++) {
            result_lis.push(singleRand(rand_lis, randTotal));
        }
        
        return result_lis;
    }
}

module.exports = GachaModel;