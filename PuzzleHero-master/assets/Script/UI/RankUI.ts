import UICrl from "../Lib/UI/UICrl";
import UIMgr from "../Lib/UI/UIMgr";
import StaticData from "../StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RankUI extends UICrl {

    @property(cc.Node)
    content: cc.Node = null

    @property(cc.Node)
    moreInfo: cc.Node = null

    @property(cc.ScrollView)
    sView: cc.ScrollView = null

    start() {

    }

    onEnable() {
        this.content.children.forEach(item => {
            item.active = true
            item.getChildByName('infoB').off('touchend')
            item.getChildByName('infoB').on('touchend', () => { this.clickInfoCB(this.content.children.indexOf(item)) }, this)
        })
        this.initData()
    }

    closeCB() {
        this.node.active = false
        UIMgr.Share.showUI("MainUI")
    }

    initData() {
        let pInfo: any = StaticData.PlayerInfo
        let score = pInfo.score
        if (score < 7) this.sView.scrollToPercentVertical(0 / 6, 0.1)
        else if (score < 16) this.sView.scrollToPercentVertical(1 / 6, 0.1)
        else if (score < 28) this.sView.scrollToPercentVertical(2 / 6, 0.1)
        else if (score < 48) this.sView.scrollToPercentVertical(3 / 6, 0.1)
        else if (score < 74) this.sView.scrollToPercentVertical(4 / 6, 0.1)
        else if (score < 99) this.sView.scrollToPercentVertical(5 / 6, 0.1)
        else this.sView.scrollToPercentVertical(6 / 6, 0.1)
    }

    clickInfoCB(id: number) {
        this.moreInfo.active = true
        this.moreInfo.getChildByName('showInfo').children.forEach(c => {
            c.active = false
        });
        this.moreInfo.getChildByName('showInfo').children[id].active = true
    }

    closeMoreInfoCB() {
        this.moreInfo.active = false
    }

    update(dt) { }
}
