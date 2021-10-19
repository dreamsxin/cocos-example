import { EventMgr } from "../../../base/common/EventManager";
import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import ClotheProxy from "../../data/ClotheProxy";
import { dataManager } from "../../data/DataManager";
import ClothCopyItemController from "../uiComponent/clothView/ClothCopyItemController";
import RenderList from "../uiComponent/common/RenderList";
import RenderListItem from "../uiComponent/common/RenderListItem";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothScoreTipsView extends UIView {


    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(cc.RichText)
    lb_tips: cc.RichText = null;

    @property(RenderList)
    renderList: RenderList = null;
    styles: any;

    init() {
        EventMgr.addEventListener(ClotheProxy.clothesWear, this.updateInfo, this);
    }

    onClose() {
        EventMgr.removeEventListener(ClotheProxy.clothesWear, this.updateInfo, this);
    }

    updateInfo() {
        let allClothes = dataManager.clotheProxy.cfgClothes;
        let showCloth = [];

        for (let index in allClothes) {
            let element = allClothes[index];
            let match = 0;
            for (let style of element.style_id) {
                if (style == this.styles[0]) {
                    match++;
                }
                else if (style == this.styles[1]) {
                    match++;
                }
            }
            if (match >= 2) {
                showCloth.push(element.id);
            }
        }

        this.renderList.data = showCloth;
        let str1 = dataManager.getAccessorieStyleData()[this.styles[0]].name_id;
        let str2 = dataManager.getAccessorieStyleData()[this.styles[1]].name_id;
        let str = dataManager.GetTextById(str1) + '、 ' + dataManager.GetTextById(str2);
        this.lb_tips.string = dataManager.GetTextById(153, str);


    }


    onOpen(uiid, styles) {
        if (!styles || styles.length < 2) {
            return;
        }

        this.styles = styles;
        this.updateInfo();

    }

    onClickCloseBtn() {
        this.closeSelf();
    }


}
