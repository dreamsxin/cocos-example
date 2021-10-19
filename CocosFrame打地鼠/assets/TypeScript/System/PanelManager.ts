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
import Panel from "./Panel";
@ccclass
export default class PanelManager extends cc.Component {
    static ins:PanelManager = null;
    @property(cc.BlockInputEvents)
    private blockInput:cc.BlockInputEvents = null;
    private stack:Panel[] = [];
    onLoad(){
        PanelManager.ins = this;
        this.blockInput.node.active = false;
    }
    public Open(panelName:string, callback){
        this.OpenByPath(`Panel/${panelName}`, callback);
    }

    public OpenByPath(path:string, callback){
        cc.loader.loadRes(path, (err, prefab) => {
            var newNode:cc.Node = cc.instantiate(prefab);
            newNode.name = path.substr(path.lastIndexOf("/")+1);
            newNode.position = cc.Vec2.ZERO;
            let panel = newNode.getComponent(Panel);
            if(panel){
                //隐藏上个面板
                if(this.stack.length > 0){
                    let lastPanel = this.stack[this.stack.length-1];
                    lastPanel.close();
                }
                //打开新面板
                this.blockInput.node.active = true;
                this.blockInput.node.setSiblingIndex(this.node.childrenCount-1);
                this.node.addChild(panel.node, this.node.childrenCount-1);
                panel.open();
                this.stack.push(panel);
                callback(panel);
                this.printStack();
            }else{
                console.log("PanelManager: cannot find panel component on node : " + path);
            }
        });
    }
    public PopCurrent(){
        if(this.stack.length>0){
            let panel = this.stack.pop();
            panel.close(()=>{
                this.node.removeChild(panel.node);
            })
        }
        if(this.stack.length>0){
            let lastPanel = this.stack[this.stack.length-1];
            this.blockInput.node.setSiblingIndex(this.node.childrenCount-1);
            lastPanel.node.setSiblingIndex(this.node.childrenCount-1);
            lastPanel.open();
        }else{
            this.blockInput.node.active = false;
        }
        this.printStack();
    }
    public printStack(){
        let str = "PanelStack:"
        for(let i=0; i<this.node.childrenCount; i++){
            str += this.node.children[i].name+" >> ";
        }
        console.log(str);
    }
}
