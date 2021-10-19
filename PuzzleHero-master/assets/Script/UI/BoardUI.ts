import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import StaticData from "../StaticData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardUI extends UICrl {

    @property(cc.Label)
    title: cc.Label = null

    @property(cc.Label)
    content: cc.Label = null

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onEnable() {
        this.getBoardContent()
    }

    async getBoardContent() {
        let rs = await WXApi.HttpPost('/fangkuaiWx/gameNotice', {})
        if (rs.errcode != 200) {
            WXApi.tipsDialog(rs.info)
            this.close()
            return
        }

        this.title.string = rs.title
        let c: string = rs.content.replace(/n/g, "\n")
        this.content.string = c
        StaticData.HadShowBoard = true
    }


    // update (dt) {}
}
