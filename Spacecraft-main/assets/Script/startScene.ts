// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Ship from "./Ship";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StartScene extends cc.Component {

    @property(cc.Prefab)
    ship:cc.Prefab = null

    @property(cc.Node)
    garage = null

    @property(cc.Node)
    resetButton = null

    private _ship:Ship = null
    onLoad() {
        

        var s = cc.instantiate(this.ship)
        this._ship = s.getComponent(Ship)
        this._ship.width = this.garage.width
        s.setParent(this.garage)

        const rb:cc.Button = this.resetButton.getComponent(cc.Button)
        rb.interactable = cc.sys.localStorage.length > 0
        this.resetButton.getComponentInChildren(cc.Label).node.color = cc.sys.localStorage.length == 0 ? cc.Color.GRAY : cc.Color.WHITE
    }

    public startButtonPressed () {
        this._ship.updateEngine(1)
        this.scheduleOnce(function(){
            cc.director.preloadScene('selectScene', ()=> {
                cc.director.loadScene('selectScene')
            })
        }, 1)
    }

    public resetButtonPressed () {
        cc.sys.localStorage.clear()
        const rb:cc.Button = this.resetButton.getComponent(cc.Button)
        rb.interactable = cc.sys.localStorage.length > 0
        this.resetButton.getComponentInChildren(cc.Label).node.color = cc.sys.localStorage.length == 0 ? cc.Color.GRAY : cc.Color.WHITE
    }

    // update (dt) {}
}
