import Storage from "./dzpk_Storage";
import Sound from "./dzpk_Sound";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)  // 桌面头像数组
    tableHead: cc.Node[] = [];

    @property(cc.Node)  // 起始发牌位置
    startPos: cc.Node = null;
    @property(cc.Node)  // 卡牌(用于发牌动作)
    sendCard: cc.Node = null;
    @property(cc.Node)  // 筹码(用于下注动作)
    sendChip: cc.Node = null;
    @property(cc.Node)  // 桌子筹码底池
    tableChoumadi: cc.Node = null;
    @property(cc.Node)  // 弃牌节点
    FlodCardNode: cc.Node = null;


    timerCard: any = null;  // 发牌延时器
    timerChip: any = null;  // 下注延时器

    onLoad() {
    }

    // 桌面发牌动画
    SendCardAction(index, end) {  // index 玩家座位, end 动画终点
        this.timerCard = this.scheduleOnce(() => {
            // 起点
            let pos = this.startPos.getPosition();
            let pos2 = this.startPos.parent.convertToWorldSpaceAR(pos);
            let startPos = this.node.convertToNodeSpaceAR(pos2);

            // 终点
            let end1 = this.tableHead[index].convertToWorldSpaceAR(end);
            let end2 = this.node.convertToNodeSpaceAR(end1);

            // 克隆卡牌 并设为起点位置
            let poker = cc.instantiate(this.sendCard);
            poker.active = true;
            poker.setPosition(startPos);
            this.node.addChild(poker);

            poker.runAction(
                cc.sequence(
                    cc.moveTo(0.2, cc.v2(end2.x, end2.y)),  // 发牌移动时间
                    cc.callFunc(() => {
                        poker.destroy();
                    })
                )
            )
        }, 0.5)
    }

    // 玩家下注动画
    SendChipsAction(Seat) { 
         // start 动画起点, end 动画终点
        let start = this.tableHead[Seat].getChildByName("money").getPosition();
        let end = this.tableHead[Seat].getChildByName("dzpk_choumadi").getPosition();

        this.timerChip = this.scheduleOnce(() => {
            // 起点
            let pos1 = this.tableHead[Seat].convertToWorldSpaceAR(start);
            let pos2 = this.node.convertToNodeSpaceAR(pos1);

            // 终点
            let end1 = this.tableHead[Seat].convertToWorldSpaceAR(end);
            let end2 = this.node.convertToNodeSpaceAR(end1);

            // 克隆筹码
            let chip = cc.instantiate(this.sendChip);
            chip.active = true;
            chip.setPosition(pos2);
            this.node.addChild(chip);

            chip.runAction(
                cc.sequence(
                    cc.moveTo(0.2, cc.v2(end2.x, end2.y)),  // 筹码移动时间
                    cc.callFunc(() => {
                        chip.destroy();
                    })
                )
            )
        },0)
    }

    // 游戏变更筹码动画
    GameChangeChipsAnima() {
        for (let i = 0; i < Storage.RoomData.playerData.length; i ++) {
            if (Storage.RoomData.playerData[i] != null) {
                let Seat = Storage.SeatChange(Storage.RoomData.playerData[i].chair)
                // console.log("筹码动画关闭:",Seat)
                let choumadi = this.tableHead[Seat].getChildByName("dzpk_choumadi")
                choumadi.active = false
                if (Storage.RoomData.playerData[i].lunDownBets > 0) {
                    let start = choumadi.getPosition();
                    // 回收音效
                    Sound.PlayAudio(Sound.LoadAudio(11,"0"))
                    setTimeout(() => {
                        this.PlayerChipsSendPot(Seat,start)
                    }, 50);
                    setTimeout(() => {
                        this.PlayerChipsSendPot(Seat,start)
                    }, 100);
                }
            }
        }
    }

    // 玩家棋牌动作
    PlayerFoldPoker(index, start) {  // index 玩家座位,start 动画起点
        let end = cc.find("Canvas/roomScens/dzpk_zhuozi/FoldNode").getPosition();
        let playerCard: any = null
        if (index == 4) {
            playerCard = this.tableHead[index].getChildByName("card_1")
        }else {
            playerCard = this.tableHead[index].getChildByName("card")
        }
        this.timerChip = this.scheduleOnce(() => {
            // 起点
            let pos1 = this.tableHead[index].convertToWorldSpaceAR(start);
            let pos2 = this.node.convertToNodeSpaceAR(pos1);

            // 终点
            let end1 = this.FlodCardNode.getPosition();
            // let end2 = this.FlodCardNode.parent.convertToWorldSpaceAR(end1);
            // let endPos = this.node.convertToNodeSpaceAR(end2);

            // 克隆筹码
            let card = cc.instantiate(playerCard);
            card.active = true;
            card.setPosition(pos2);
            this.node.addChild(card);

            card.runAction(
                cc.sequence(
                    cc.moveTo(0.2, cc.v2(end1.x, end1.y)),  // 筹码移动时间
                    cc.callFunc(() => {
                        card.destroy();
                    })
                )
            )
        }, 0)
    }

    // 玩家棋牌动作
    EmojiChatAction(actSeat, goalSeat, actNum) {  // index 玩家座位,start 动画起点
        let start = this.tableHead[actSeat].getChildByName("image").getPosition();
        let end = this.tableHead[goalSeat].getChildByName("image").getPosition();
        let actAnima: any = null
        if (actNum == 21) {
            // actAnima = cc.find("Canvas/roomScens/playerInfo_Back/infoBack_01/chicken/chicken")
            actAnima = this.tableHead[goalSeat].getChildByName("emoj_Anima").getChildByName("jianjiaoji")
        }else if (actNum == 22) {
            // actAnima = cc.find("Canvas/roomScens/playerInfo_Back/infoBack_01/flower/flower")
            actAnima = this.tableHead[goalSeat].getChildByName("emoj_Anima").getChildByName("meiguihua")
        }else if (actNum == 23) {
            actAnima = cc.find("Canvas/roomScens/playerInfo_Back/infoBack_01/beer/pijiubei")
            // actAnima = this.tableHead[goalSeat].getChildByName("emoj_Anima").getChildByName("pijiubei")
        }else if (actNum == 24) {
            // actAnima = cc.find("Canvas/roomScens/playerInfo_Back/infoBack_01/tuoxie/tuoxie")
            actAnima = this.tableHead[goalSeat].getChildByName("emoj_Anima").getChildByName("tuoxie2")
        }
        this.timerChip = this.scheduleOnce(() => {
            // 起点
            let pos1 = this.tableHead[actSeat].convertToWorldSpaceAR(start);
            let pos2 = this.node.convertToNodeSpaceAR(pos1);

            // 终点
            let end1 = this.tableHead[goalSeat].convertToWorldSpaceAR(end);
            let end2 = this.node.convertToNodeSpaceAR(end1);

            // 克隆筹码
            let card = cc.instantiate(actAnima);
            card.active = true;
            card.setPosition(pos2);
            this.node.addChild(card);
            if (actNum == 24) {
                card.runAction(
                    cc.spawn(
                        cc.rotateTo(0.5,-1080),
                        cc.moveTo(0.4, cc.v2(end2.x, end2.y)),  // 筹码移动时间
                    ),
                )
                setTimeout(() => {
                    card.runAction(
                        cc.rotateTo(0.2,-1080),
                    )
                }, 400); 
                setTimeout(() => {
                    card.destroy()
                }, 1000);  
            }else {
                card.runAction(
                    cc.sequence(
                        cc.moveTo(0.4, cc.v2(end2.x, end2.y)),  // 筹码移动时间
                        cc.callFunc(() => {
                            card.destroy();
                        })
                    )
                )
            }
        }, 0.5)
    }

    // 玩家筹码到注池动画
    PlayerChipsSendPot(index, start) {  // index 玩家座位,start 动画起点
        this.timerChip = this.scheduleOnce(() => {
            // 起点
            let pos1 = this.tableHead[index].convertToWorldSpaceAR(start);
            let pos2 = this.node.convertToNodeSpaceAR(pos1);

            // 终点
            let end1 = this.tableChoumadi.getPosition();
            let end2 = this.tableChoumadi.parent.convertToWorldSpaceAR(end1);
            let endPos = this.node.convertToNodeSpaceAR(end2);

            // 克隆筹码
            let chip = cc.instantiate(this.sendChip);
            chip.active = true;
            chip.setPosition(pos2);
            this.node.addChild(chip);
            this.node.setSiblingIndex(8);

            chip.runAction(
                cc.sequence(
                    cc.moveTo(0.3, cc.v2(endPos.x, endPos.y)),  // 筹码移动时间
                    cc.callFunc(() => {
                        chip.destroy();
                    })
                )
            )
        },0)
    }

    // 注池筹码到玩家动画
    PotChipsSendWinner(index, end) {  // index 玩家座位,start 动画起点
        this.timerChip = this.scheduleOnce(() => {
            // 起点
            let pos = this.tableChoumadi.getPosition();
            let pos2 = this.tableChoumadi.parent.convertToWorldSpaceAR(pos);
            let startPos = this.node.convertToNodeSpaceAR(pos2);

            // 终点
            let end1 = this.tableHead[index].convertToWorldSpaceAR(end);
            let end2 = this.node.convertToNodeSpaceAR(end1);

            // 克隆筹码
            let chip = cc.instantiate(this.sendChip);
            chip.active = true;
            chip.setPosition(startPos);
            this.node.addChild(chip);

            chip.runAction(
                cc.sequence(
                    cc.moveTo(0.4, cc.v2(end2.x, end2.y)),  // 筹码移动时间
                    cc.callFunc(() => {
                        chip.destroy();
                    })
                )
            )
        },0)
    }

    // 玩家赢钱金币飘动
    WinMoneyShow(Seat, winMoney) { 
        // start 动画起点, end 动画终点
       let start = this.tableHead[Seat].getChildByName("money").getPosition();
       let end = this.tableHead[Seat].getChildByName("name").getPosition();
       let showMoney = this.tableHead[Seat].getChildByName("showMoney")
       showMoney.getComponent(cc.Label).string = Storage.ShowMoney(winMoney)

       this.timerChip = this.scheduleOnce(() => {
           // 起点
           let pos1 = this.tableHead[Seat].convertToWorldSpaceAR(start);
           let pos2 = this.node.convertToNodeSpaceAR(pos1);

           // 终点
           let end1 = this.tableHead[Seat].convertToWorldSpaceAR(end);
           let end2 = this.node.convertToNodeSpaceAR(end1);

           // 克隆显示金币
           let moneyAct = cc.instantiate(showMoney);
           moneyAct.active = true;
           moneyAct.setPosition(pos2);
           this.node.addChild(moneyAct);

           moneyAct.runAction(
               cc.sequence(
                   cc.moveTo(1.8, cc.v2(end2.x, end2.y)),  // 金币移动时间
                   cc.callFunc(() => {
                        moneyAct.destroy();
                   })
               )
           )
       }, 0.5)
    }

    onDestroy() {
        this.unschedule(this.timerCard);
        this.unschedule(this.timerChip);
    }
}


