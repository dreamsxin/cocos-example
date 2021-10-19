import WXApi from "../Lib/WXApi";
import SoundMgr from "../Lib/SoundMgr";
import StaticData from "../StaticData";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoreOptionUI extends cc.Component {

    @property(cc.Node)
    vibrateNode: cc.Node = null

    @property(cc.Node)
    soundNode: cc.Node = null
    //by test
   

    onLoad() { 

        
    }

    start() {
        //by test
       
        this.node.on('touchend', () => {
            this.node.active = false;
        });
    }

    //邮箱
    mailCallback() {
        WXApi.OpenAlert('敬请期待！');
    }
    //问题反馈
    questionCallback() {
        WXApi.OpenAlert('敬请期待！');
    }
    //玩法说明
    introduceCallback() {
        WXApi.SetStorage("tur", "0")
        StaticData.Teaching = true
        StaticData.Teached = true
        GameMenuUI.Share.startTeach()
        this.node.active = false;
        // WXApi.OpenAlert('敬请期待！');
    }
    //震动开关
    vibrateCallback() {
        WXApi.isVibrate = !WXApi.isVibrate;
        this.vibrateNode.getChildByName('on').active = WXApi.isVibrate;
        this.vibrateNode.getChildByName('off').active = !WXApi.isVibrate;
    }
    //音效开关
    soundCallback() {
        SoundMgr.MuteSW();
        this.soundNode.getChildByName('on').active = !SoundMgr.IsMute;
        this.soundNode.getChildByName('off').active = SoundMgr.IsMute;

        if (!SoundMgr.IsMute) {
            //播放bgm
            SoundMgr.Share.PlayMusic("MainBGM", true)
        }
    }

    update(dt) { }
}
