// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIOBJ from "./UIOBJ";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {

    @property (cc.Node)
    Root:cc.Node=null;

    static _Instance:UI;
    onLoad()
    {
        UI._Instance=this;
        if(this.Root==null)
            this.Root=this.node;
    }


    static   CreateWindow<T extends UIOBJ>(mod:T):T
    {
        if(mod==null)      return null;

        var  _ob=  cc.instantiate<T>(mod);
        _ob.setParent(UI._Instance==null?cc.director.getScene():  UI._Instance.Root);

        return _ob ;
    }
}
