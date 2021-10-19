// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { dataManager } from "../../data/DataManager";
import { resLoader } from "../../../base/res/ResLoader";
import SysDef from "../../../util/SysDef";
import { utils } from "../../../util/Utils";
import formatStr = cc.js.formatStr;
import urlLoad from "../uiComponent/common/UrlLoad";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothBuyView extends UIView {

    public static instance: ClothBuyView = null;


    @property(cc.Node)
    node_star: cc.Node = null;

    @property(urlLoad)
    spr_icon: urlLoad = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(MultiLabel)
    lb_price: MultiLabel = null;

    @property(MultiLabel)
    lb_num: MultiLabel = null;


    private starList = [];


    private num = 0;
    private price = 0;

    init() {
        ClothBuyView.instance = this;
    }
    onOpen(fromUI: number, ...args) {
        var data = args[0];
        this.initStars(data);
        this.lb_name.string = data.clothId;
        this.price = 100;
        this.updateClothNum(1);

    }
    updateClothNum(num) {
        if (num < 1)
            num = 1;
        this.num = num;
        this.lb_num.string = num;
        this.lb_price.string = num * this.price + "";
    }
    initStars(data) {
        for (var i = 0; i < 5; i++) {
            var item = cc.instantiate(ClothBuyView.instance.node_star);
            item.parent = ClothBuyView.instance.node_star.parent;
            item.x = ClothBuyView.instance.node_star.x + 25 * i;
            item.y = ClothBuyView.instance.node_star.y;
            if (i < dataManager.getAccessorieData()[data.clothId].quality)
                item.active = true;
            ClothBuyView.instance.starList.push(item);
        }
    }
    onDestroy() {

        for (var i = 0; i < ClothBuyView.instance.starList.length; i++) {
            ClothBuyView.instance.starList[i].destroy();
        }
        ClothBuyView.instance.starList.splice(0);
        ClothBuyView.instance = null;
    }
    onClickCloseBtn() {
        this.closeSelf();
    }

    onClickAddBtn() {
        this.updateClothNum(this.num + 1);

    }
    onClickMinusBtn() {

        this.updateClothNum(this.num - 1);
    }


    onClickBuyBtn() {

        utils.showConfirmView(dataManager.GetTextById(125, this.num * this.price, this.num, this.lb_name.string), null);
    }
}
