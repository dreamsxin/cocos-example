// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { resLoader } from "../../../../base/res/ResLoader";
import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import { EventMgr } from "../../../../base/common/EventManager";
import EventID from "../../../event/EventID";
import UrlLoad from "../common/UrlLoad";
import RenderListItem from "../common/RenderListItem";
import { uiUtils } from "../../../../util/UIUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScrollList extends cc.Component {

    @property([RenderListItem])
    renderItems: RenderListItem[] = [];


    @property(cc.Boolean)
    bToRight: Boolean = true;

    private posArr = [];
    private widthArr = [];
    datas: any;

    init(data) {
        this.datas = data;
        for (let item of this.renderItems) {
            this.posArr.push(item.node.position);
            this.widthArr.push(item.node.width);
        }
        this.reset();
    }

    changeData(deltaTime, datas) {

        this.renderItems[0].node.stopAllActions();
        // var move =cc.moveBy(deltaTime, this.posArr[0].x - this.posArr[1].x, 0);
        var fadeOut = cc.fadeOut(deltaTime/2);
        var call = cc.callFunc(()=>{
            let len = this.renderItems.length;
            for (let index = 1; index < len; index++) {

                this.renderItems[index].node.stopAllActions();
                if(index == 1){
                    var m1 = cc.moveTo(deltaTime, this.posArr[index - 1]);
                    var s1 = cc.scaleTo(deltaTime,1.05);
                    var s2 = cc.scaleTo(deltaTime/2,1);
                    var sp1 = cc.spawn(m1,s1);
                    var seq1 = cc.sequence(sp1,s2);
                    this.renderItems[index].node.runAction(seq1);
                }else {

                    this.renderItems[index].node.runAction(cc.moveTo(deltaTime, this.posArr[index - 1]));
                }
            }
        });

        var seq = cc.sequence(fadeOut,call);
        this.renderItems[0].node.runAction(seq);
        //
        // this.renderItems[1].node.runAction(cc.scaleTo(deltaTime, this.widthArr[0] / this.widthArr[1]));

        this.unscheduleAllCallbacks();
        this.scheduleOnce(this.reset, deltaTime*2);

        this.datas = datas;
    }

    reset() {
        let len = this.renderItems.length;
        for (let index = 0; index < len; index++) {
            if (this.datas[index]) {
                var icon = "";
                if(!this.datas[index].isNpc)
                {
                    icon = dataManager.getHeroData()[this.datas[index].id].icon;
                }else {

                    icon = dataManager.getNpcData()[this.datas[index].id].icon;
                }
                var data = {isNpc:this.datas[index].isNpc,icon:icon,isBattleBg:true};
                this.renderItems[index].data = data;
            }
            else {
                this.renderItems[index].data = null;
            }
            this.renderItems[index].node.position = this.posArr[index];
            this.renderItems[index].node.scale = index==0?1:0.9;
            this.renderItems[index].node.stopAllActions();
        }

    }

}
