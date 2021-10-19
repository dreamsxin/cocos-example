import TerritoryCrl from "./TerritoryCrl";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerOpt extends cc.Component {

    optNode: cc.Node

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    canOpt: boolean = true

    playerTerritoryCrl: TerritoryCrl = null

    start() {
        this.optNode.on(cc.Node.EventType.TOUCH_START.toString(), (event: cc.Event.EventTouch) => {
            if (!this.canOpt) return

            let cp = this.optNode.convertToNodeSpace(event.getLocation())
            this.playerTerritoryCrl.handleCheckTouch(cp)
            this.playerTerritoryCrl.showSkillTips(cp)
        })
        this.optNode.on(cc.Node.EventType.TOUCH_MOVE.toString(), (event: cc.Event.EventTouch) => {
            if (!this.canOpt) return
            let cp = this.optNode.convertToNodeSpace(event.getLocation())
            this.playerTerritoryCrl.handleCheckTouch(cp)
            this.playerTerritoryCrl.checkHideSkillTips(cp)
            this.playerTerritoryCrl.showAtkCount()
            
        })
        this.optNode.on(cc.Node.EventType.TOUCH_END.toString(), (event: cc.Event.EventTouch) => {
            if (!this.canOpt) return
            this.playerTerritoryCrl.handleCheckTouchEnd()
            this.playerTerritoryCrl.hideSkillTips()
            this.playerTerritoryCrl.hideAtkCount()

        })
        this.optNode.on(cc.Node.EventType.TOUCH_CANCEL.toString(), (event: cc.Event.EventTouch) => {
            if (!this.canOpt) return
            this.playerTerritoryCrl.handleCheckTouchEnd()
            this.playerTerritoryCrl.hideSkillTips()
            this.playerTerritoryCrl.hideAtkCount()
            

        })
    }

    // update (dt) {}
}
