import UICrl from "./UICrl";

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
export default class UIMgr extends cc.Component {

    public static Share: UIMgr

    resPath: string = ""

    uiList: UICrl[] = []

    currentUI: UICrl

    onLoad() {
        cc.log("UIMgr on load")
        cc.game.addPersistRootNode(this.node)
        UIMgr.Share = this
        this.resPath = "ui"
    }

    private showAct(node: cc.Node): void {
        node.active = true
        node.scale = 0
        let act1 = cc.scaleTo(0.1, 1)
        act1.easing(cc.easeExponentialInOut())
        node.runAction(act1)
    }

    async showUI(name, pop = false): Promise<UICrl> {
        
        return new Promise(async (resolve, serr) => {
            let ui = await this.getUI(name, pop)
            ui.node.active = true
            resolve(ui)
        })

    }

    getUI(name: string, pop = false): Promise<UICrl> {
        return new Promise((resolve, serr) => {
            let ui: UICrl = null

            for (let i = 0; i < this.uiList.length; i++) {
                if (this.uiList[i].node.name == name) {
                    ui = this.uiList[i]
                } else {
                    if (!pop) {
                        this.uiList[i].node.active = false
                    }
                }
            }
            if (ui != null) {
                cc.log("read from Mem:", name)
                resolve(ui)
                return;
            }
            cc.loader.loadRes(`${this.resPath}/${name}`, (err, res) => {
                if (!err) {
                    let ui: cc.Node = cc.instantiate(res)
                    ui.name = name
                    let comp = ui.getComponent(UICrl)
                    if (comp == null) {
                        console.error("the prefab no UICrl")
                    }
                    //this.uiList.push(ui.getComponent(UICrl))
                    this.node.addChild(ui)
                    resolve(ui.getComponent(UICrl))
                    cc.log("read from Res", name)
                } else {
                    console.log(err)
                }
            })
        })

    }


    hideAll() {
        for (let i = 0; i < this.uiList.length; i++) {
            this.uiList[i].node.active = false
        }
    }

    handlerEvent(comp, fun) {
        let crl = this.node.getComponentInChildren(comp)
        if (crl != null) {
            crl[fun]()
        }
    }
}
