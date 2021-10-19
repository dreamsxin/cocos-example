// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {UIView} from "../../../base/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemExploreView extends UIView {

    public static instance:ItemExploreView=null;


    init(){
        ItemExploreView.instance = this;
        this.initUI();
    }
    initUI(){
    }



    onDestroy(){

        ItemExploreView.instance = null;
    }
    onClickCloseBtn(){
        this.closeSelf();
    }

}
