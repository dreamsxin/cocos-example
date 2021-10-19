import PanelManager from "./PanelManager";

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

@ccclass
export default class Panel extends cc.Component {
    @property(cc.Button)
    public closeButton:cc.Button = null;
    onLoad(){
        this.closeButton.node.on("click", ()=>{
            PanelManager.ins.PopCurrent();
        })
    }
    public close(callback = null){
        this.node.scale = 1;
        cc.tween(this.node).to(0.3,{scale:0}).hide().call(callback).start();
    }
    public open(callback = null){
        this.node.scale = 0;
        cc.tween(this.node).show().to(0.3,{scale:1}).call(callback).start();
    }
}
