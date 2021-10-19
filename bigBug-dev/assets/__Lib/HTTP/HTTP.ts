// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Requester from "./Requester";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HTTP extends cc.Component {

    static TIMEOUT=15000;
    static DOMAIN:string="https://game.ice909.com/";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start ()
    {

    }
    static  Request(url:string,node:cc.Node):Requester
    {
        if(node==null)  return null;

        return node.addComponent(Requester).Set(url);
    }
    // update (dt) {}
}
