// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import UrlLoad from "../common/UrlLoad";
import RenderListItem from "../common/RenderListItem";
import SysDef from "../../../../util/SysDef";
import { dataManager } from "../../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleBullet extends RenderListItem {

    @property(UrlLoad)
    spine: UrlLoad = null;
    onLoad() {


    }

    showData() {
        this.spine.animation = 'animation';
        let bulletID = this._data.bulletID;
        let url = dataManager.getEffectSpineUrl(bulletID);
        if (url) {
            this.spine.url = SysDef.getEffectUrl(url);
        }
        else {
            console.error('BattleBullet  ' + bulletID + '  null');
        }
    }

    onDestroy() {

    }

}
