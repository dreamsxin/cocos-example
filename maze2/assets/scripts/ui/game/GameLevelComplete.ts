// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CAction from "../../common/CAction";
import { getSecondToMinute } from "../../components/Utils";
import GlobalGame from "../../global/GlobalGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLevelComplete extends cc.Component {

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;


    /** 显示过关时间和当前关卡 */
    showLabel() {
        let level = GlobalGame.getCurrentLevel();
        let timestamp = GlobalGame.getCurrentTime();
        this.timeLabel.string = getSecondToMinute(timestamp,true);
        this.levelLabel.string = level.toString() + " / 10";
    }

    onEnable() {
        this.showLabel();
    }

    // update (dt) {}

    //下一关
    onNextLevel() {
        let level = GlobalGame.getCurrentLevel();
        GlobalGame.setCurrentLevel(level + 1);
        CAction.onScene('game')
    }
    //返回首页
    onBackHome() {
        CAction.onScene('home')
    }
}
