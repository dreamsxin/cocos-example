import UICrl from "../Lib/UI/UICrl";
import { RewardBox } from "../Mod/PlayerData";
import GameData from "../GameData";
import UIMgr from "../Lib/UI/UIMgr";
import WXApi from "../Lib/WXApi";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import Logger from "../LoggerCrl";
import SoundMgr from "../Lib/SoundMgr";
import Utility from "../Lib/Utility";
import HeroData from "../Mod/HeroData";
import StaticData from "../StaticData";
import GameMenuUI from "./GameMenuUI";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class OpenBoxCrl extends UICrl {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    @property(cc.Node)
    itemsNode: cc.Node = null

    @property(cc.Node)
    getItem: cc.Node = null

    @property([cc.Node])
    boxsOpenType: cc.Node[] = []

    showCount: number = 0
    heroLength: number = 0

    onEnable() {
        this.node.getChildByName('step 1').active = true
        this.node.off(cc.Node.EventType.TOUCH_END.toString())
        this.itemsNode.removeAllChildren()
        let randNum = Utility.GetRandom(0, 4);
        SoundMgr.Share.PlaySound('C' + randNum.toString());
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END.toString())
    }

    start() {

    }

    showBox(box: RewardBox, fromDailyUI: boolean = false) {
        console.log('box info:', box);
        //统计任务7
        PlayerDataCrl.updateTask(7);

        //this.node.off(cc.Node.EventType.TOUCH_END.toString())
        let item = this.node.getChildByName("simple")
        let c = box.heros.filter(n => n > 0)
        let newitem = cc.instantiate(item)
        this.updateItem(newitem, box.coin, 0)
        this.itemsNode.addChild(newitem)
        this.boxsOpenType.forEach(box => {
            box.active = false
        })
        if (box.exLevel == -1) {
            this.boxsOpenType[box.level].active = true
            this.boxsOpenType[box.level].parent.getComponent(cc.Animation).play()
        } else {
            this.boxsOpenType[box.exLevel - 1].active = true
            this.boxsOpenType[box.exLevel - 1].parent.getComponent(cc.Animation).play()
        }

        for (let i = 0; i < c.length; i++) {
            let newitem = cc.instantiate(item)
            this.itemsNode.addChild(newitem)
            newitem.active = false;
            this.updateItem(newitem, box.cards[i], box.heros[i])
        }

        this.heroLength = 0
        this.showCount = c.length + 1

        this.scheduleOnce(() => {
            //弹出一个奖励 （金币）
            this.showCount--
            this.changeGetItem(box.coin, 0)
            //监听  点击弹出奖励
            this.node.on(cc.Node.EventType.TOUCH_END.toString(), async () => {
                if (this.node.getChildByName('bounesItem')) this.node.getChildByName('bounesItem').removeFromParent()
                if (this.showCount > 0) {
                    //弹出一个奖励
                    this.showCount--
                    this.changeGetItem(box.cards[this.heroLength], box.heros[this.heroLength])
                    this.heroLength++
                } else {
                    //显示所有奖励
                    this.node.getChildByName('step 1').active = false
                    this.node.getChildByName('total').active = true;
                    this.itemsNode.children.forEach(n => {
                        n.active = true
                    })
                    this.node.off(cc.Node.EventType.TOUCH_END.toString())
                    let data = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
                    if (data.errcode == 200) {
                        PlayerDataCrl.UpdateHeroInfo(data)
                    }

                    this.node.on(cc.Node.EventType.TOUCH_END.toString(), () => {
                        UIMgr.Share.showUI("MainUI")
                        GameMenuUI.Share.checkIsGuide()
                        Logger.record(1)
                        if (fromDailyUI) UIMgr.Share.showUI("DailyUI", true)
                    })
                }
            })
        }, 1.3)


        // this.scheduleOnce(() => {
        //     this.itemsNode.scale = 0
        //     let act1 = cc.scaleTo(0.3, 1)
        //     this.itemsNode.runAction(act1)
        //     for (let i = 0; i < c.length; i++) {
        //         let newitem = cc.instantiate(item)
        //         this.itemsNode.addChild(newitem)
        //         this.updateItem(newitem, box.cards[i], box.heros[i])
        //     }
        //     this.itemsNode.children.forEach(n => {
        //         n.active = true
        //     })
        //     this.scheduleOnce(async () => {
        //         let data = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
        //         if (data.errcode == 200) {
        //             PlayerDataCrl.UpdateHeroInfo(data)
        //         }

        //         this.node.on(cc.Node.EventType.TOUCH_END.toString(), () => {
        //             UIMgr.Share.showUI("MainUI")
        //             Logger.record(1)
        //         })
        //     }, 2)
        // }, 1.3)
    }

    changeGetItem(count: number, hid: number = 0) {
        let bounesItem = cc.instantiate(this.getItem)
        bounesItem.name = 'bounesItem'
        this.node.addChild(bounesItem)
        bounesItem.getChildByName('cardRemain').getComponent(cc.Label).string = this.showCount.toString()
        bounesItem.getChildByName('cardRemain').active = true
        bounesItem.getChildByName('icon').active = true
        let cardFlip = bounesItem.getChildByName('cardfilp')
        let item = bounesItem.getChildByName('item')

        //let hdata = GameData.Share.getHeroDataById(hid)
        let hdata: HeroData = null;
        let pInfo: any = StaticData.PlayerInfo;
        for (let i = 0; i < pInfo.heros.length; i++) {
            if (pInfo.heros[i].id == hid) {
                hdata = pInfo.heros[i];
                break;
            }
        }
        if (hid == 0) {
            cardFlip.children[0].active = true
            item.children[0].active = true
            item.children[0].getChildByName('amount').getComponent(cc.Label).string = count.toString()
            item.children[0].getChildByName('Pcoin').getComponent(cc.Label).string = (pInfo.coin/*  + count */).toString()
        } else {
            cardFlip.children[hdata.quality + 1].active = true;
            let node = item.children[hdata.quality + 1]
            node.active = true
            let bg: cc.Node[] = [node.getChildByName("rh"), node.getChildByName("gh"), node.getChildByName("bh"), node.getChildByName("yh")]

            bg.filter(b => {
                b.active = false
            })
            bg[hdata.type - 1].active = true
            let hpoint = node.getChildByName("herohere")
            cc.loader.loadRes("character/avatar/H" + hid, (err, res) => {
                let hobj: cc.Node = cc.instantiate(res)
                // hobj.children[0].active = false
                // hobj.children[4].active = false
                // hobj.children[5].active = false
                hobj.getChildByName('full').active = false
                hpoint.addChild(hobj)
            })
            node.getChildByName("name").getComponent(cc.Label).string = hdata.name
            node.getChildByName("amount").getComponent(cc.Label).string = count.toString()
            node.getChildByName("lvl").getComponent(cc.Label).string = hdata.level.toString()
            node.getChildByName("current").getComponent(cc.Label).string = (hdata.curCards + count).toString()
            node.getChildByName("request").getComponent(cc.Label).string = hdata.nextCards.toString()
            node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = (hdata.curCards + count) / hdata.nextCards
            //node.getChildByName("canlvlup").active = hdata.curCards + count >= hdata.nextCards
            let bData: any = pInfo.baseField
            let boxCount: number = bData.boxCount[hdata.type - 1]
            let needBox: number = GameData.Share.getLvlExpData(hdata.level + 1, hdata.quality).block
            if (hdata.curCards > 0 && hdata.curCards >= hdata.nextCards && StaticData.PlayerInfo.coin >= hdata.nextCoin && hdata.has/*  && boxCount >= needBox */) {
                node.getChildByName("canlvlup").active = true
            } else {
                node.getChildByName("canlvlup").active = false
            }

            //长震动
            if (hdata.quality >= 2) WXApi.DoVibrate(false)
        }
        bounesItem.getComponent(cc.Animation).play()
    }

    updateItem(item: cc.Node, count: number, hid: number = 0) {
        item.children.filter(n => {
            n.active = false
        })
        let hdata = GameData.Share.getHeroDataById(hid)
        if (hid == 0) {
            item.children[0].active = true
            item.children[0].getChildByName("amount").getComponent(cc.Label).string = count.toString()
        } else {
            let node = item.children[hdata.quality + 1]
            node.active = true
            let bg: cc.Node[] = [node.getChildByName("rh"), node.getChildByName("gh"), node.getChildByName("bh"), node.getChildByName("yh")]

            bg.filter(b => {
                b.active = false
            })
            bg[hdata.type - 1].active = true
            let hpoint = node.getChildByName("herohere")
            cc.loader.loadRes("character/avatar/H" + hid, (err, res) => {
                let hobj: cc.Node = cc.instantiate(res)
                // hobj.children[0].active = false
                // hobj.children[4].active = false
                // hobj.children[5].active = false
                hobj.getChildByName('full').active = false
                hpoint.addChild(hobj)
            })
            node.getChildByName("name").getComponent(cc.Label).string = hdata.name
            node.getChildByName("amount").getComponent(cc.Label).string = count.toString()
        }
    }

    // update (dt) {}
}
