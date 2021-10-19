// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {UIView} from "../../../base/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemDetailsView extends UIView {

    public static instance:ItemDetailsView=null;


    init(){
        ItemDetailsView.instance = this;
        this.initUI();
    }
    initUI(){
    }



    onDestroy(){

        ItemDetailsView.instance = null;
    }
    onClickCloseBtn(){
        this.closeSelf();
    }

}
