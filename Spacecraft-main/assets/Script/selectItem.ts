// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SelectItem extends cc.Component {

    @property(cc.Label)
    levelNumLabel = null

    @property([cc.Sprite])
    targets = []

    @property(cc.Sprite)
    locked = null

    @property(cc.Button)
    clickButton = null

    private _level = 0

    onLoad() {
    }

    setParameter(l: number) {
        this._level = l
        this.levelNumLabel.string = `${l}`

        let targetNum = parseInt(cc.sys.localStorage.getItem('levelTargetNum'+l)) || 0
        for (let i = 0; i < 3; i++) {
            if (i+1<=targetNum) {
                this.targets[i].node.color = cc.Color.GREEN
            } else {
                this.targets[i].node.color = cc.Color.GRAY
            }
        }

        let finishStage = parseInt(cc.sys.localStorage.getItem('finishStageNum')) || 1
        if (l <= finishStage) {
            this.locked.node.active = false
        } else {
            this.locked.node.active = true
        }
    }

    selectButtonPressed(event, customEventData) {
        cc.sys.localStorage.setItem('selectedStage', this._level)
        cc.director.preloadScene('gameScene', ()=>{
            cc.director.loadScene('gameScene')
        })

    }
}
