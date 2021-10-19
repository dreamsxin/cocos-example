// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Panel from "../System/Panel"
import PanelManager from "../System/PanelManager"
@ccclass
export default class MessageBox extends Panel {
    @property(cc.Button)
    public okButton:cc.Button = null;
    @property(cc.Button)
    public cancelButton:cc.Button = null;
    @property(cc.Label)
    public label:cc.Label = null;
    onLoad(){
        super.onLoad();
    }
}
