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
export default class Pool extends cc.Component {
    @property(cc.Node)
    prefab: cc.Node = null;
    onLoad(){
        this.node.active = false;
    }
    public getInstance(parentNode:cc.Node = null):cc.Node{
        if(this.node.childrenCount > 1){
            let node = this.node.children[1];
            this.node.removeChild(node);
            if(parentNode){
                parentNode.addChild(node);
            }
            
            return node;
        }
        var node:cc.Node = cc.instantiate(this.prefab);
        this.node.removeChild(node);
        if(parentNode){
            parentNode.addChild(node);
        }
        node.name = this.prefab.name;
        node.position = cc.Vec2.ZERO;
        return node;
    }
    public returnInstance(node:cc.Node){
        node.parent.removeChild(node);
        this.node.addChild(node);
    }
}
