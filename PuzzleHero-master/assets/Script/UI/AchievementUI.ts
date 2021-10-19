import WXApi from "../Lib/WXApi";
import GameData from "../GameData";
import UIMgr from "../Lib/UI/UIMgr";
import UICrl from "../Lib/UI/UICrl";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AchievementUI extends UICrl {

    @property(cc.Node)
    prefabItem: cc.Node = null

    @property(cc.Node)
    content: cc.Node = null

    achieveArr: any[] = []

    doneCount: number = 0
    indexCount: number = 0

    getingBounes: boolean = false

    totalLength: number = 0
    updateCount: number = 0

    httpEnd: boolean = false

    start() {

    }

    onEnable() {

        this.initData()
    }

    closeCB() {
        this.close()
    }

    async initData() {
        this.doneCount = 0
        this.indexCount = 0
        this.updateCount = 0
        this.totalLength = 24
        this.httpEnd = false

        let rs = await WXApi.HttpPost('/fangkuaiWx/updateAchievement', {})
        console.log('achievement:', rs)
        if (rs.errcode == 200) {
            this.httpEnd = true
            this.achieveArr = rs.achievement
            console.log(this.achieveArr)
            //this.totalLength = this.achieveArr.length
            this.content.removeAllChildren()
            this.updateItem()
        } else {
            WXApi.tipsDialog(rs.info)
            this.close()
            return
        }

        // this.node.getChildByName('doneCount').getComponent(cc.Label).string = this.doneCount.toString()
        // this.node.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = this.doneCount / 31
    }

    updateItem() {
        let item = cc.instantiate(this.prefabItem)
        item.parent = this.content
        item.active = true

        let state = this.achieveArr[this.updateCount].state
        let per = this.achieveArr[this.updateCount].value ? this.achieveArr[this.updateCount].value : 0
        this.achieveArr[this.updateCount].id = this.updateCount

        let isDone = item.getChildByName('state').getChildByName('isDone')
        let name = item.getChildByName('name').getComponent(cc.Label)
        let intro = item.getChildByName('intro').getComponent(cc.Label)
        let pb = item.getChildByName('progressBar').getComponent(cc.ProgressBar)
        let count = pb.node.getChildByName('count').getComponent(cc.Label)
        let request = pb.node.getChildByName('request').getComponent(cc.Label)
        let reward = item.getChildByName('reward')
        let rewardAmount = reward.getChildByName('amount').getComponent(cc.Label)
        let get = item.getChildByName('get')
        let getAmount = get.getChildByName('amount').getComponent(cc.Label)
        let finish = item.getChildByName('finish')

        let achieveConfig: any = GameData.Share.getAchieveConfigById(this.updateCount)

        isDone.active = per >= achieveConfig.amount
        name.string = achieveConfig.name
        intro.string = achieveConfig.intro
        pb.progress = per / achieveConfig.amount
        count.string = per > achieveConfig.amount ? achieveConfig.amount : per
        request.string = achieveConfig.amount
        reward.active = !isDone.active
        rewardAmount.string = achieveConfig.bounes
        get.active = isDone.active && !state
        getAmount.string = achieveConfig.bounes
        finish.active = isDone.active && state

        if (per >= achieveConfig.amount) this.doneCount++

        let id: number = 0
        id = this.updateCount
        get.off('touchend')
        get.on('touchend', () => { this.getBounes(id) }, this)

        this.updateCount++
    }

    sortItem() {
        this.content.children.forEach(item => {
            let isDone = item.getChildByName('state').getChildByName('isDone')
            let finish = item.getChildByName('finish')

            if (isDone.active && !finish.active) {
                item.zIndex = this.indexCount
                this.indexCount++
            }
        });
        this.content.children.forEach(item => {
            let isDone = item.getChildByName('state').getChildByName('isDone')
            let finish = item.getChildByName('finish')

            if (!isDone.active) {
                item.zIndex = this.indexCount
                this.indexCount++
            }
        });
        this.content.children.forEach(item => {
            let isDone = item.getChildByName('state').getChildByName('isDone')
            let finish = item.getChildByName('finish')

            if (finish.active) {
                item.zIndex = this.indexCount
                this.indexCount++
            }
        });
    }

    async getBounes(id) {
        if (this.getingBounes || this.updateCount < this.totalLength) {
            return
        }
        console.log(id)
        this.getingBounes = true
        let rs = await WXApi.HttpPost('/fangkuaiWx/getAchievement', { index: id })

        if (rs.errcode == 200) {
            this.doneCount = 0
            this.indexCount = 0
            this.initData()

            let rs1 = await WXApi.HttpPost("/fangkuaiWx/getUserMsg", {})
            if (rs1.errcode == 200) {
                PlayerDataCrl.UpdateHeroInfo(rs1)
                GameMenuUI.Share.refrashUI();
            } else {
                WXApi.tipsDialog(rs.info)
            }
        } else {
            WXApi.tipsDialog(rs.info)
        }

        this.getingBounes = false
    }

    update(dt) {
        if (this.updateCount <= this.totalLength && this.httpEnd) {
            this.updateItem()

            if (this.updateCount == this.totalLength) {
                this.sortItem()
                this.node.getChildByName('doneCount').getComponent(cc.Label).string = this.doneCount.toString()
                this.node.getChildByName('progressBar').getComponent(cc.ProgressBar).progress = this.doneCount / 31
                this.httpEnd = false
            }
        }
    }
}
