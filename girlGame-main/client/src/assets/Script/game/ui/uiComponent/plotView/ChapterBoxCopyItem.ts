// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MultiLabel from "../../../../util/MultiLabel";
import RenderListItem from "../common/RenderListItem";
import { BoxStatus } from "../../../../util/Utils";
import { shaderUtils } from "../../../../util/ShaderUtils";
import BoxCopyItem from "../common/BoxCopyItem";
import { dataManager } from "../../../data/DataManager";
import {uiManager} from "../../../../base/ui/UIManager";
import {UIID} from "../../UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChapterBoxCopyItem extends BoxCopyItem {




    @property(MultiLabel)
    lblStar: MultiLabel = null;

    showData() {
        super.showData();

        this.nodeNormal.stopAllActions();
        this.lblStar.string = this.data.star + '';
        if(this.data.status == BoxStatus.CanOpen){
            var scaleUp = cc.scaleTo(0.2,0.9,1.1);
            // var moveUp = cc.moveTo(0.2,0,10);
            var scaleDowm = cc.scaleTo(0.2,1.1,0.9);
            // var moveDown = cc.moveTo(0.2,0,0);
            var scale = cc.scaleTo(0.1,1,1);
            var delay = cc.delayTime(1);
           // var sp1=  cc.spawn(scaleUp,moveUp);
           // var sp2=  cc.spawn(scaleDowm,moveDown);

            this.nodeNormal.runAction(cc.repeatForever(  cc.sequence(scaleUp,scaleDowm,scale,delay)));
        }
    }

    onClickBox() {
        super.onClickBox();
        switch (this.data.status) {
            case BoxStatus.Default:
                var rwd = [];
                for(var index in this.data.rwd){
                    var dropData = dataManager.getDropPkgData()[this.data.rwd[index]];
                    var item = {
                        id:dropData.packet[0],
                        count:0
                    }
                    rwd.push(item)
                }
                uiManager.open(UIID.UIDropItem, [rwd,true]);
                break;
            case BoxStatus.CanOpen:

                this.nodeNormal.stopAllActions();
                dataManager.storyProxy.sendOpenBoxCmd(this.data.id, this.data.pos);
                break;
        }
    }
}
