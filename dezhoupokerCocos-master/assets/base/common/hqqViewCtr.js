
let hqqViewCtr = {
    parentNode: null,
    netpanelIndex: cc.macro.MAX_ZINDEX - 17,
    noticelayerIndex: cc.macro.MAX_ZINDEX - 16,
    registerlayerIndex: cc.macro.MAX_ZINDEX - 15,
    personlayerIndex: cc.macro.MAX_ZINDEX - 14,
    bigsublayerIndex: cc.macro.MAX_ZINDEX - 13,
    smallsublayerIndex: cc.macro.MAX_ZINDEX - 12,
    congratulationIndex: cc.macro.MAX_ZINDEX - 11, // 恭喜获得金币层级
    consoleIndex: cc.macro.MAX_ZINDEX - 10,
    tipPanelIndex: cc.macro.MAX_ZINDEX - 1,

    config: {
        smallsublayer: { path: "base/prefab/smallsublayer", scriptName: "hallPSubsLayer" },
        bigsublayer: { path: "hall/prefab/bigsublayer", scriptName: "hallPSubbLayer" },
        tippanel: { path: "base/prefab/tippanel", scriptName: "hallTipPanel" },
        registerlayer: { path: "hall/prefab/registerlayer", scriptName: "hallRegisterLayer" },
        personallayer: { path: "hall/prefab/personallayer", scriptName: "hallPersonLayer" },
        noticelayer: { path: "hall/prefab/noticelayer", scriptName: "hallNoticeLayer" },
        congratulation: { path: "hall/prefab/congratulation", scriptName: "hallCongratulation" },
        downtip: { path: "hall/prefab/downtip", scriptName: "hallDownTip" },
        console: { path: "hall/prefab/Console", scriptName: "hqqConsole" },
        ioswebtip: { path: "base/prefab/ioswebtip", scriptName: "ioswebtip" },
        iostiplayer: { path: "base/prefab/iostiplayer", scriptName: "iostiplayer" },
        netpanel: { path: "base/prefab/netpanel", scriptName: "hqqNetPanel" },
        netnode: { path: "base/prefab/netnode", scriptName: "hqqNetNode" },
        hby: { path: "hall/prefab/hbylayer", scriptName: "hallHBY" },
    },
    setParentNode(node) {
        this.parentNode = node;
    },

    showLayer(path, script, data, zindex, ispersist) {
        zindex = zindex || 1000
        let nodename = path.substring(path.lastIndexOf('/') + 1)
        if (cc.director.getScene().getChildByName(nodename)) {
            if (nodename == "tippanel" || nodename == "downtip") {
                let child = cc.director.getScene().getChildByName(nodename)
                child.getComponent(script).init(data)
            }
        } else {
            cc.resources.load(path, cc.Prefab, (err, prefab) => {
                if (err) {
                    console.log(err)
                    hqq.logMgr.logerror(err)
                    return
                }
                let node = cc.instantiate(prefab)
                if (data && data.position) {
                    node.setPosition(data.position)
                }
                if (data && data.scale) {
                    node.scaleX = data.scale
                    node.scaleY = data.scale
                } else if (cc.view._orientation == cc.macro.ORIENTATION_PORTRAIT && nodename == "smallsublayer") {
                    let scale = cc.winSize.width * 1.4 / node.width
                    node.scaleX = scale
                    node.scaleY = scale
                }
                if (data && data.parent) {
                    data.parent.addChild(node, zindex)
                } else if (this.parentNode) {
                    this.parentNode.addChild(node, zindex)
                } else {
                    cc.director.getScene().addChild(node, zindex)
                }
                node.getComponent(script).init(data)
                if (ispersist) {
                    cc.game.addPersistRootNode(node);
                }
            })
        }
    },
    init() {
        hqq.eventMgr.register(hqq.eventMgr.showSamlllayer, "hqqViewCtr", this.showSmallsublayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showBiglayer, "hqqViewCtr", this.showBigsublayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showTip, "hqqViewCtr", this.showTippanel.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showRegister, "hqqViewCtr", this.showRegisterlayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showPerson, "hqqViewCtr", this.showPersonallayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showNotice, "hqqViewCtr", this.showNoticelayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showCongratulation, "hqqViewCtr", this.showCongratulation.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showPayScene, "hqqViewCtr", this.showPayScene.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showDownTip, "hqqViewCtr", this.showDownTip.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showConsole, "hqqViewCtr", this.showConsole.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showIosWebTip, "hqqViewCtr", this.showIosWebTip.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showIosTipLayer, "hqqViewCtr", this.showIosTipLayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showLineChoiceLayer, "hqqViewCtr", this.showLineChoiceLayer.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showNetStateNode, "hqqViewCtr", this.showNetStateNode.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.showHBYLayer, "hqqViewCtr", this.showHBYLayer.bind(this))
        return this
    },
    showSmallsublayer(data) {
        let path = this.config.smallsublayer.path
        let scriptname = this.config.smallsublayer.scriptName
        this.showLayer(path, scriptname, data, this.smallsublayerIndex)
    },
    showBigsublayer(data) {
        let path = this.config.bigsublayer.path
        let scriptname = this.config.bigsublayer.scriptName
        this.showLayer(path, scriptname, data, this.bigsublayerIndex)
    },
    showTippanel(data) {
        let path = this.config.tippanel.path
        let scriptname = this.config.tippanel.scriptName
        this.showLayer(path, scriptname, data, this.tipPanelIndex)
    },
    showRegisterlayer(data) {
        let path = this.config.registerlayer.path
        let scriptname = this.config.registerlayer.scriptName
        this.showLayer(path, scriptname, data, this.registerlayerIndex)
    },
    showPersonallayer(data) {
        let path = this.config.personallayer.path
        let scriptname = this.config.personallayer.scriptName
        this.showLayer(path, scriptname, data, this.personlayerIndex)
    },
    showNoticelayer(data) {
        let path = this.config.noticelayer.path
        let scriptname = this.config.noticelayer.scriptName
        this.showLayer(path, scriptname, data, this.noticelayerIndex)
    },
    showCongratulation(data) {
        let path = this.config.congratulation.path
        let scriptname = this.config.congratulation.scriptName
        this.showLayer(path, scriptname, data, this.congratulationIndex)
    },
    showPayScene(data) {
        if (hqq.gameGlobal.pay.pay_host == "") {
            hqq.logMgr.time("最快的pay地址")
            let callback = (mdata, url) => {
                hqq.logMgr.timeEnd("最快的pay地址", url)
                hqq.gameGlobal.pay.pay_host = url;
                if (hqq.subModel.pay.lanchscene != "") {
                    hqq.gameGlobal.pay.from_scene = data
                    cc.director.preloadScene(hqq.subModel.pay.lanchscene, () => {
                        cc.director.loadScene(hqq.subModel.pay.lanchscene);
                    })
                } else {
                    console.log("请配置充值场景")
                }
            }
            hqq.http.requestFastestUrlLine({
                urllist: hqq.app.remoteSeverinfo.pay_host,
                endurl: "/checked",
                callback: callback,
                needJsonParse: false,
            })
        } else {
            if (hqq.subModel.pay.lanchscene != "") {
                hqq.gameGlobal.pay.from_scene = data
                cc.director.preloadScene(hqq.subModel.pay.lanchscene, () => {
                    cc.director.loadScene(hqq.subModel.pay.lanchscene);
                })
            } else {
                console.log("请配置充值场景")
            }
        }
    },
    showDownTip(data) {
        let path = this.config.downtip.path
        let scriptname = this.config.downtip.scriptName
        this.showLayer(path, scriptname, data, this.tipPanelIndex)
    },
    showConsole(data) {
        let path = this.config.console.path
        let scriptname = this.config.console.scriptName
        this.showLayer(path, scriptname, data, this.consoleIndex)
    },
    showIosWebTip(data) {
        let path = this.config.ioswebtip.path
        let scriptname = this.config.ioswebtip.scriptName
        this.showLayer(path, scriptname, data, this.tipPanelIndex, true)
    },
    showIosTipLayer(data) {
        let path = this.config.iostiplayer.path
        let scriptname = this.config.iostiplayer.scriptName
        this.showLayer(path, scriptname, data, this.tipPanelIndex)
    },
    showLineChoiceLayer(data) {
        hqq.app.hasLineChoiceLayer = true
        let path = this.config.netpanel.path
        let scriptname = this.config.netpanel.scriptName
        this.showLayer(path, scriptname, data, this.netpanelIndex)
    },
    showNetStateNode(data) {
        let path = this.config.netnode.path
        let scriptname = this.config.netnode.scriptName
        this.showLayer(path, scriptname, data, this.netpanelIndex)
    },
    showHBYLayer(data) {
        let path = this.config.hby.path
        let scriptname = this.config.hby.scriptName
        this.showLayer(path, scriptname, data, this.netpanelIndex)
    },
}
module.exports = hqqViewCtr