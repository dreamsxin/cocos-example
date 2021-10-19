
const { ccclass, property } = cc._decorator;

@ccclass
export default class GSLoading extends cc.Component {

    @property(cc.ProgressBar)
    loadBar: cc.ProgressBar = null

    // onLoad () {}

    start() {

    }

    onEnable() {

    }

    initData(cb: any) {
        this.loadBar.progress = 0
        this.node.active = true
        cc.director.preloadScene("GameScene", (c, ac) => {
            this.loadBar.progress = c / ac
        }, () => {
            this.node.active = false
            cb()
        })
    }

    // update (dt) {}
}
