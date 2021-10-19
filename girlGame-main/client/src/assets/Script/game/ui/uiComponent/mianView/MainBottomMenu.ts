// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../../base/ui/UIView";
import { uiManager } from "../../../../base/ui/UIManager";
import { UIID } from "../../UIConfig";
import { utils } from "../../../../util/Utils";
import MainBottomMenuItem from "./MainBottomMenuItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainBottomMenu extends cc.Component {


    @property(UIView)
    node_View: UIView = null;

    @property(cc.Node)
    node_btns: cc.Node[] = [];
    private lastIndex = -1;

    onLoad() {
        // if(this.node_View.UIid == UIID.UIMain)
        // {
        //     this.onClickFunc(null,2);
        // }else if(this.node_View.UIid == UIID.UIRetinue)
        // {
        //     this.onClickFunc(null,1);
        // }
    }
    onClickFunc(target, arg) {
        var curIndex = parseInt(arg);
        if (this.lastIndex != curIndex) {
            switch (curIndex) {
                case 0:
                    this.onClickBag();
                    break;
                case 1:
                    this.onClickRetinueBtn();
                    break;
                case 2:
                    this.onClickHouse();
                    break;
                case 3:
                    this.onClickCounterBtn();
                    return;
                case 4:
                    this.onClickBattleBtn();
                    return;
                case 5:
                    this.onClickPlotBtn();
                    return;

            }
            this.checkStatus(curIndex);

        }

    }
    checkStatus(index) {
        if (this.lastIndex >= 0)
            this.node_btns[this.lastIndex].getComponent("MainBottomMenuItem").onClickFunc(false);
        this.node_btns[index].getComponent("MainBottomMenuItem").onClickFunc(true);
        this.lastIndex = index;

    }
    onClickPlotBtn() {
        uiManager.open(UIID.UIChapter)
    }
    onClickCounterBtn() {
        uiManager.open(UIID.UIWorkshop);

        //utils.showCommingSoonTips();
    }

    onClickRetinueBtn() {
        uiManager.open(UIID.UIRetinue);
    }

    onClickBattleBtn() {

        utils.showCommingSoonTips();
    }

    onClickBag() {
        // uiManager.open(UIID.UIBagView);
        uiManager.open(UIID.UIMain, 1);
    }

    onClickHouse() {
        uiManager.open(UIID.UIMain, 0);
    }


}
