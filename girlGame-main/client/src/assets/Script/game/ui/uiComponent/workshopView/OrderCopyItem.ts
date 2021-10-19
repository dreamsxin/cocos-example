// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { uiManager } from "../../../../base/ui/UIManager";
import MultiLabel from "../../../../util/MultiLabel";
import { dataManager } from "../../../data/DataManager";
import { UIID } from "../../UIConfig";
import ClothCopyItem from "../clothView/ClothCopyItem";
import IconItem from "../common/IconItem";
import RenderList from "../common/RenderList";
import RenderListItem from "../common/RenderListItem";
import RetinueStars from "../retinueView/RetinueStars";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OrderCopyItem extends RenderListItem {


    @property(MultiLabel)
    lblName: MultiLabel = null;



    @property([cc.Node])
    nodesGo: cc.Node[] = [];

    @property(RetinueStars)
    star: RetinueStars = null;


    @property(RenderList)
    items: RenderList = null;



    showData() {
        let order = dataManager.allDatas.order_task[this.data.id];
        if (!order) {
            return;
        }
        this.lblName.string = dataManager.GetTextById(order.name_id);
        this.nodesGo.forEach(element => {
            element.active = this.data.status === 0;
        });
        this.star.star = order.star_num;


        var rwd = [];
        for (var index in order.reward_packet) {
            var dropData = dataManager.getDropPkgData()[order.reward_packet[index]];
            var item = {
                id: dropData.packet[0],
                count: dropData.packet[1]
            }
            rwd.push(item)
        }

        this.items.data = rwd;
        this.data.rwd = rwd;
    }

    onClickGo() {
        if (this.data.status === 0) {
            uiManager.open(UIID.UIOrderDesc, this.data);
        }
    }

}
