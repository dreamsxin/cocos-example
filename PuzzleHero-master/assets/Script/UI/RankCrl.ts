import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import BaseX from "../Lib/Base64";
import Utility from "../Lib/Utility";
import UIMgr from "../Lib/UI/UIMgr";
import GameData from "../GameData";

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
export default class RankCrl extends UICrl {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.Node)
    playerItem: cc.Node = null

    @property(cc.Node)
    listContent: cc.Node = null

    @property(cc.Node)
    selfItem: cc.Node = null


    onEnable() {
        cc.log("show rank")
        this.updateRankList()

        WXApi.OpenAd(0, cc.winSize.height)
    }

    start() {

    }

    closeCB() {
        WXApi.CloseAd()
        this.close()
        //UIMgr.Share.showUI("MainUI")
    }

    async updateRankList() {

        let idx = 0
        this.listContent.children.forEach(n => {
            if (idx != 0) {
                n.destroy()
            }
            idx++
        })
        let data = await WXApi.HttpPost("/fangkuaiWx/userRanking", { channel: WXApi.channelID })
        console.log(data)
        let listdata: any[] = data.list
        let mydata: any = data.local
        for (let i = 0; i < listdata.length; i++) {
            let d = listdata[i]
            let newitem = null
            if (i > 0) {
                newitem = cc.instantiate(this.playerItem)
                this.listContent.addChild(newitem)
            } else {
                newitem = this.playerItem
            }

            newitem.getChildByName("rank").getComponent(cc.Label).string = (i + 1).toFixed()
            /// newitem.getChildByName("name").getComponent(cc.Label).string = d.
            newitem.getChildByName("name").getComponent(cc.Label).string = !new BaseX().decode(d.name) || '' ? d.name : new BaseX().decode(d.name)
            let face = newitem.getChildByName("avatar").getChildByName("Sprite").getComponent(cc.Sprite)
            Utility.LoadImgAyns(d.pic, face)
            let tag = newitem.getChildByName("tag").children
            tag.forEach(t => {
                t.active = false
            })
            if (i < 3) {
                tag[i].active = true
            } else {
                tag[3].active = true
            }

            newitem.getChildByName("star").getComponent(cc.Label).string = d.score
            // let pIv = GameData.Share.getRankConfigByScore(d.score).lv - 1 < 0 ? 0 : GameData.Share.getRankConfigByScore(d.score).lv - 1
            // newitem.getChildByName('rankLabel').getComponent(cc.Label).string = GameData.Share.getRankConfigByScore(d.score).t
            // newitem.getChildByName('rankLabel').color = new cc.Color(
            //     GameData.Share.getRankConfigByScore(d.score).r,
            //     GameData.Share.getRankConfigByScore(d.score).g,
            //     GameData.Share.getRankConfigByScore(d.score).b, 255)
            // let rankIconNode: cc.Node = newitem.getChildByName('rankIcon')
            // for (let j = 0; j < rankIconNode.childrenCount; j++) {
            //     rankIconNode.children[j].active = j == pIv
            // }
            // newitem.getChildByName('star').active = d.score > 98
            // if (newitem.getChildByName('star').active)
            //     newitem.getChildByName('star').getComponent(cc.Label).string = d.score - 98
        }
        if (listdata.length < 1) {
            this.playerItem.active = false
        }
        let index = mydata.index
        cc.log('myData:', mydata)
        if (index < 1) {
            this.selfItem.active = false
            return
        }
        this.selfItem.getChildByName("rank").getComponent(cc.Label).string = mydata.index
        this.selfItem.getChildByName("star").getComponent(cc.Label).string = mydata.score
        this.selfItem.getChildByName("name").getComponent(cc.Label).string = !new BaseX().decode(mydata.name) || '' ? mydata.name : new BaseX().decode(mydata.name)
        let face = this.selfItem.getChildByName("avatar").getChildByName("Sprite").getComponent(cc.Sprite)
        let tag = this.selfItem.getChildByName("tag").children

        // let pIv = GameData.Share.getRankConfigByScore(d.score).lv - 1 < 0 ? 0 : GameData.Share.getRankConfigByScore(mydata.score).lv - 1
        // this.selfItem.getChildByName('rankLabel').getComponent(cc.Label).string = GameData.Share.getRankConfigByScore(mydata.score).t
        // this.selfItem.getChildByName('rankLabel').color = new cc.Color(
        //     GameData.Share.getRankConfigByScore(mydata.score).r,
        //     GameData.Share.getRankConfigByScore(mydata.score).g,
        //     GameData.Share.getRankConfigByScore(mydata.score).b, 255)
        // let rankIconNode: cc.Node = this.selfItem.getChildByName('rankIcon')
        // for (let j = 0; j < rankIconNode.childrenCount; j++) {
        //     rankIconNode.children[j].active = j == pIv
        // }
        // this.selfItem.getChildByName('star').active = mydata.score > 98
        // if (this.selfItem.getChildByName('star').active)
        //     this.selfItem.getChildByName('star').getComponent(cc.Label).string = (mydata.score - 98).toString()

        tag.forEach(t => {
            t.active = false
        })
        if (index < 3) {
            tag[index - 1].active = true
        } else {
            tag[3].active = true
        }

        Utility.LoadImgAyns(mydata.pic, face)

    }

    // update (dt) {}
}
