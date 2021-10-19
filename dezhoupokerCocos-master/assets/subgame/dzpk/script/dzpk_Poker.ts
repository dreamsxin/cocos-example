import Stoarge from "./dzpk_Storage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    Poker_num: cc.Node = null;

    @property(cc.Node)
    poker_JQK: cc.Node = null;

    @property(cc.Node)
    poker_back: cc.Node = null;

    onLoad () {
        // this.InitPoker(Stoarge.random(1,52));
    }

    start() {

    }

    ClearPoker() {
        this.Poker_num.getChildByName("poker-zhi").getComponent(cc.Sprite).spriteFrame = null
        this.Poker_num.getChildByName("poker-xiaotu").getComponent(cc.Sprite).spriteFrame = null
        this.Poker_num.getChildByName("poker-datu").getComponent(cc.Sprite).spriteFrame = null

        this.poker_JQK.getChildByName("poker-zhi").getComponent(cc.Sprite).spriteFrame = null
        this.poker_JQK.getChildByName("poker-xiaotu").getComponent(cc.Sprite).spriteFrame = null
        this.poker_JQK.getChildByName("poker-datu").getComponent(cc.Sprite).spriteFrame = null
    }

    InitPoker(value: number) {
        console.log("牌型數據：",value)
        let cardBool: boolean = false;
        let card: number = value % 13
        
        // 判断激活A-10还是JQK
        if (card > 0 && card <= 10) {
            cardBool = true;
        } else {
            cardBool = false;
        }

        // 获取小图花色
        let xiaotu = this.getCardColor(value)
        // 获取牌值
        let cardValue = this.getCardValue(value, xiaotu)

        if (cardBool) {
            this.Poker_num.active = true
            let poker_zhi: cc.Node = this.Poker_num.getChildByName("poker-zhi");
            Stoarge.loadSpriteFrame(poker_zhi,cardValue)

            let poker_xiaotu: cc.Node = this.Poker_num.getChildByName("poker-xiaotu");
            Stoarge.loadSpriteFrame(poker_xiaotu,xiaotu)

            let poker_datu: cc.Node = this.Poker_num.getChildByName("poker-datu");
            Stoarge.loadSpriteFrame(poker_datu,xiaotu)
        } else {
            this.poker_JQK.active = true

            let datu: string = '';
            switch (card) {
                case 11: datu = xiaotu + '_j'; break;
                case 12: datu = xiaotu + '_q'; break;
                case 0: datu = xiaotu + '_k'; break;
            }
            let poker_zhi: cc.Node = this.poker_JQK.getChildByName("poker-zhi");
            Stoarge.loadSpriteFrame(poker_zhi,cardValue)

            let poker_xiaotu: cc.Node = this.poker_JQK.getChildByName("poker-xiaotu");
            Stoarge.loadSpriteFrame(poker_xiaotu,xiaotu)

            let poker_datu: cc.Node = this.poker_JQK.getChildByName("poker-datu");
            Stoarge.loadSpriteFrame(poker_datu,datu)
        }
    }

    /**
  * 得到牌面
  * @param num 1-13方片 14-26 梅花 27-39红心 40-52黑桃  代表不同值 color 代表颜色，片面值分红色，黑色
  * @param colorss 传 getcardcolor() 得到的值 也就是四种牌型（黑红梅方）
  */
    getCardValue(num: number, color: string) {
        var colorName: string = '';
        switch (color) {
            case "poker/fang": colorName = 'hong'; break;
            case "poker/mei": colorName = "hei"; break;
            case "poker/hong": colorName = "hong"; break;
            case "poker/hei": colorName = "hei"; break;
        }
        var str: string = "";

        let count = 0;

        if (num >= 13) {
            count = num % 13;
        } else {
            count = num;
        }

        switch (count) {
            case 1: str = "poker/poker_" + count + "_" + colorName; break;
            case 2: str = "poker/poker_" + count + "_" + colorName; break;
            case 3: str = "poker/poker_" + count + "_" + colorName; break;
            case 4: str = "poker/poker_" + count + "_" + colorName; break;
            case 5: str = "poker/poker_" + count + "_" + colorName; break;
            case 6: str = "poker/poker_" + count + "_" + colorName; break;
            case 7: str = "poker/poker_" + count + "_" + colorName; break;
            case 8: str = "poker/poker_" + count + "_" + colorName; break;
            case 9: str = "poker/poker_" + count + "_" + colorName; break;
            case 10: str = "poker/poker_" + count + "_" + colorName; break;
            case 11: str = "poker/poker_" + count + "_" + colorName; break;
            case 12: str = "poker/poker_" + count + "_" + colorName; break;
            case 0: str = "poker/poker_13_" + colorName; break;
        }
        return str
    }

    /**
     * 根据传来的数字 区分牌面花色
     * @param num  1-13方片 14-26 梅花 27-39红心 40-52黑桃
     */
    getCardColor(num: number) {
        //上取整 区分花色
        let cardcolor = Math.ceil(num / 13);
        var xiaotu: string = '';
        switch (cardcolor) {
            case 1: xiaotu = "poker/fang"; break;
            case 2: xiaotu = "poker/mei"; break;
            case 3: xiaotu = "poker/hong"; break;
            case 4: xiaotu = "poker/hei"; break;
        }
        return xiaotu;
    }

    cardAnimaRight(card: cc.Node) {  // 主要处理玩家手牌
        let time: number;
        time = 0.15  // 翻牌时间

        let scaler = card.getScale(cc.v2());
        if (scaler.x != 1 || scaler.y != 1) {
            scaler.x = 1
            scaler.y = 1
        }
        let s2r = cc.scaleTo(time, 0, 1.2)
        let sk2r = cc.skewTo(time, 0, -5)
        let spawn1r = cc.spawn(s2r, sk2r)
        let call = cc.callFunc(() => {
            // card.getComponent('hh_pocker').backVisible(false); 
        })
        let _s2r = cc.scaleTo(time, scaler.x, scaler.y);
        let _sk2r = cc.skewTo(time, 0, 0)
        let spawn2r = cc.spawn(_s2r, _sk2r)
        let seqr = cc.sequence(spawn1r, call, spawn2r)
        card.runAction(seqr);
    }

    cardAnimaLeft(card: cc.Node) {  // 主要处理桌面纸牌
        let time: number;
        time = 0.13

        let scale = card.getScale(cc.v2());
        if (scale.x != 1 || scale.y != 1) {
            scale.x = 1
            scale.y = 1
        }
        let s2 = cc.scaleTo(time, 0, scale.y) 
        let sk2 = cc.skewTo(time, 0, -5)
        let spawn1 = cc.spawn(s2, sk2)
        let _s2 = cc.scaleTo(time, scale.x, scale.y);
        let _sk2 = cc.skewTo(time, 0, 0)
        let spawn2 = cc.spawn(_s2, _sk2)
        let call = cc.callFunc(() => {
            // card.getComponent('hh_pocker').backVisible(false);
        })
        let seq = cc.sequence(spawn1, call, spawn2)
        card.runAction(seq);
    }
    // update (dt) {}
}
