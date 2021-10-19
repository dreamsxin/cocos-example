import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import BaseX from "../Lib/Base64";
import Utility from "../Lib/Utility";
import UIMgr from "../Lib/UI/UIMgr";
import GameData from "../GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ARankUI extends UICrl {

    @property(cc.Node)
    playerItem: cc.Node = null

    @property(cc.Node)
    listContent: cc.Node = null

    @property(cc.Node)
    selfItem: cc.Node = null


    onEnable() {
        cc.log("show rank")
        this.updateRankList()
    }

    start() {

    }

    closeCB() {
        this.close(true)
    }

    async updateRankList() {
        let idx = 0
        this.listContent.children.forEach(n => {
            if (idx != 0) {
                n.destroy()
            }
            idx++
        })
        let data = await WXApi.HttpPost("/fangkuaiWx/battleRank", {})
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

            newitem.getChildByName("score").getComponent(cc.Label).string = d.score
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
        this.selfItem.getChildByName("score").getComponent(cc.Label).string = mydata.score
        this.selfItem.getChildByName("name").getComponent(cc.Label).string = !new BaseX().decode(mydata.name) || '' ? mydata.name : new BaseX().decode(mydata.name)
        let face = this.selfItem.getChildByName("avatar").getChildByName("Sprite").getComponent(cc.Sprite)
        let tag = this.selfItem.getChildByName("tag").children

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
