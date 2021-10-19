// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property
    size = 100

    @property
    density = 1

    public range = 0
    public mass = 0
    private _k = 10
    onLoad() {
        this.range = 500*this.size
        this.mass =  this.size * this.size * this.size * this.density

        this.node.width = this.size
        this.node.height = this.size

        let col = this.node.getComponent(cc.PhysicsCircleCollider)
        col.radius = this.size/2-5
    }

    getAByDistance(d: number) {
        if (d>this.range) return 0
        return this._k * this.mass / d / d
    }
}
