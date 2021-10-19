// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import RenderList from "../uiComponent/common/RenderList";
import TipsItem from "../uiComponent/common/TipsItem";
import { dataManager } from "../../data/DataManager";
import { ItemType } from "../../data/BagProxy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRetinuePreview extends UIView {

    //随从界面 need fix
    @property(RenderList)
    orangeList: RenderList = null;

    @property(RenderList)
    purpleList: RenderList = null;

    @property(RenderList)
    blueList: RenderList = null;


    @property(cc.Node)
    nodeOrange: cc.Node = null;

    @property(cc.Node)
    nodePurple: cc.Node = null;

    @property(cc.Node)
    nodeBlue: cc.Node = null;

    private index = -1;
    private tag: number = -1;

    init() {
        this.updateInfoUI();
    }

    onDestroy() {


    }


    onEnable() {


    }



    updateInfoUI() {

        let checkTag = function (tag, data): boolean {
            switch (tag) {
                case 0:
                    //战士
                    if (data.here_type == 1 || data.here_type == 2) {
                        return true;
                    }
                    break;
                case 1:
                    //输出
                    if (data.here_type == 3 || data.here_type == 4) {
                        return true;
                    }
                    break;
                case 2:
                    //控制
                    if (data.here_type == 5 || data.here_type == 6) {
                        return true;
                    }
                    break;
                case 3:
                    //辅助
                    if (data.here_type == 7 || data.here_type == 8) {
                        return true;
                    }
                    break;
                default:
                    //默认
                    return true;

            }

            return false;
        }

        let allCard = dataManager.retinueProxy.getAllData();
        let orange = [];
        let purple = [];
        let blue = [];

        for (let index in allCard) {
            let level = allCard[index].starLevel;
            switch (level) {
                case 1:
                    if (checkTag(this.tag, allCard[index])) {
                        blue.push(allCard[index]);
                    }

                    break;
                case 2:

                    if (checkTag(this.tag, allCard[index])) {
                        purple.push(allCard[index]);
                    }
                    break;
                case 3:
                    if (checkTag(this.tag, allCard[index])) {
                        orange.push(allCard[index]);
                    }

                    break;
            }
        }

        this.orangeList.data = orange;
        this.purpleList.data = purple;
        this.blueList.data = blue;

        this.nodeOrange.active = orange.length > 0;
        this.nodePurple.active = purple.length > 0;
        this.nodeBlue.active = blue.length > 0;
    }

    onClickHeroTag(com, data) {

        if (this.tag != parseInt(data)) {
            this.tag = parseInt(data);
            this.updateInfoUI();
        }
    }


    onClickCloseBtn() {
        this.closeSelf();
    }


}
