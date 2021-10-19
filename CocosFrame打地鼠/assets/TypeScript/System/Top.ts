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
import {Util} from "../System/Util";

@ccclass
export default class Top extends cc.Component {
    static ins:Top = null;
    onLoad(){
        Top.ins = this;
    }
    public Toast(text:string){
        Util.instantPrefab("TopLayer/Toast", (toast:cc.Node)=>{
            toast.getComponentInChildren(cc.Label).string = text;
            this.node.addChild(toast);
            toast.opacity = 0;
            cc.tween(toast)
                .to(0.1, {opacity:255} )
                .delay(1.5)
                .to(0.1, {opacity:0} )
                .call(()=>{
                    this.node.removeChild(toast);
                }
            ).start();
        });
    }
}
