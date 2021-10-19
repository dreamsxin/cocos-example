

cc.Class({
    extends: cc.Component,

    properties: {
        txt_se: cc.Node,
        txt_bgm: cc.Node,
        versionlabel: cc.Label,
        phonebindbtn: cc.Node,
        alipaybindbtn: cc.Node,
        yinhangkabindbtn: cc.Node,

        musictoggle: cc.Toggle,
        audiotoggle: cc.Toggle,

        headimg: cc.Sprite,
        goldlabel: cc.Label,
        nicklabel: cc.Label,
        idlabel: cc.Label,
        phonelabel: cc.Label,
        alipaylabel: cc.Label,
        yinghangkalabel: cc.Label,
    },

    onLoad() {
        this.num0 = 0
        this.num1 = 0
        let str = "版本m:" + (hqq.localStorage.getGlobal().versionKey || "1.0.0")
        if (cc.sys.isNative && cc.sys.os != "Windows" && hqq.reflect.getClipboard()) {
            str += "\n剪切板：" + hqq.reflect.getClipboard()
        }
        if (hqq.app.reginIpData) {
            str += "\n注册ip-api:" + hqq.app.reginIpData.query + ",地址:" + hqq.app.reginIpData.regionName
        }
        if (hqq.app.reginIpData2) {
            str += "\n注册ipinfo:" + hqq.app.reginIpData2.ip + "地址:" + hqq.app.reginIpData2.region
        }
        if (hqq.gameGlobal.ipapiData) {
            str += "\n登陆ip-api:" + hqq.gameGlobal.ipapiData.query + ",地址" + hqq.gameGlobal.ipapiData.regionName
        }
        if (hqq.gameGlobal.ipinfoData) {
            str += "\n登陆ipinfo:" + hqq.gameGlobal.ipinfoData.ip + ",地址" + hqq.gameGlobal.ipinfoData.region
        }
        this.versionlabel.string = str
        if (cc.Button.prototype.setSoundEffect) {
            this.txt_bgm.getComponent(cc.Button).setSoundEffect(false)
            this.txt_se.getComponent(cc.Button).setSoundEffect(false)
        }
        this.alipaybindbtn.active = false
    },

    start() {
    },

    init(data) {
        let player = hqq.gameGlobal.player
        hqq.commonTools.loadHeadRes(player.headurl, this.headimg)
        this.goldlabel.string = player.gold.toString().replace(".", "/")
        this.nicklabel.string = player.nick
        this.idlabel.string = player.id
        if (player.phonenum) {
            this.phonelabel.string = player.phonenum
            this.phonelabel.node.color = new cc.Color(225, 225, 225)
            this.phonebindbtn.active = false
        }
        if (player.alipay) {
            this.alipaylabel.string = player.alipay.substring(0, 2) + "** **** **" + player.alipay.substring(player.alipay.length - 2, player.alipay.length)
            this.alipaylabel.node.color = new cc.Color(225, 225, 225)
            // this.alipaybindbtn.active = false
        }
        if (player.yinhangka) {
            let kahaostr = player.yinhangka.toString()
            this.yinghangkalabel.string = "**** **** **** " + kahaostr.substring(kahaostr.length - 4, kahaostr.length)
            this.yinghangkalabel.node.color = new cc.Color(225, 225, 225)
            this.yinhangkabindbtn.active = false
        }
        hqq.audioMgr && hqq.audioMgr.bgIsOpen ? this.musictoggle.check() : this.musictoggle.uncheck()
        hqq.audioMgr && hqq.audioMgr.effectIsOpen ? this.audiotoggle.check() : this.audiotoggle.uncheck()
        hqq.eventMgr.register(hqq.eventMgr.refreshPlayerinfo, "hallPersonLayer", this.setPlayerInfo.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.getPayInfo, "hallPersonLayer", this.getPayInfo.bind(this))
        this.getPayInfo(); // 存在解绑的情况，所以每次进来都重新拉取一次支付宝和银行卡信息
    },

    getPayInfo() {
        let endurl = "/api/with_draw/index?user_id=" + hqq.gameGlobal.pay.user_id
        endurl += "&token=e40f01afbb1b9ae3dd6747ced5bca532&package_id=" + hqq.gameGlobal.pay.package_id
        endurl += "&version=1"
        let callback = (data) => {
            if (data && data.status == 0) {
                let list = data.data.list
                let isNoAlipay = true
                let isNotyinhang = true
                for (let i = 0; i < list.length; i++) {
                    if (list[i].type == "3") {
                        hqq.gameGlobal.player.yinhangka = JSON.parse(list[i].info).card_num
                        let kahaostr = hqq.gameGlobal.player.yinhangka.toString()
                        this.yinghangkalabel.string = kahaostr.substring(0, 3) + "* **** **** " + kahaostr.substring(kahaostr.length - 4, kahaostr.length)
                        this.yinghangkalabel.node.color = new cc.Color(225, 225, 225)
                        this.yinhangkabindbtn.active = false
                        isNotyinhang = false
                    } else if (list[i].type == "2") {
                        hqq.gameGlobal.player.alipay = JSON.parse(list[i].info).account_card
                        let alistr = hqq.gameGlobal.player.alipay
                        this.alipaylabel.string = alistr.substring(0, 2) + "** **** **" + alistr.substring(alistr.length - 2, alistr.length)
                        this.alipaylabel.node.color = new cc.Color(225, 225, 225)
                        // this.alipaybindbtn.active = false
                        isNoAlipay = false
                    }
                }
                if (isNoAlipay) {
                    this.alipaylabel.string = "暂未绑定支付宝"
                    this.alipaylabel.node.color = new cc.Color(152, 152, 152)
                    // this.alipaybindbtn.active = true
                }
                if (isNotyinhang) {
                    this.yinghangkalabel.string = "暂未绑定银行卡"
                    this.yinghangkalabel.node.color = new cc.Color(152, 152, 152)
                    this.yinhangkabindbtn.active = true
                }
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "修改失败:" + data.msg)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err, forcejump, readyState)
        }
        if (hqq.gameGlobal.pay.pay_host == "") {
            hqq.logMgr.time("最快的pay地址")
            let qcallback = (data, url) => {
                hqq.logMgr.timeEnd("最快的pay地址", url)
                hqq.gameGlobal.pay.pay_host = url;
                hqq.http.sendXMLHttpRequest({
                    method: "GET",
                    urlto: url,
                    endurl: endurl,
                    callback: callback,
                    failcallback: failcallback,
                    needJsonParse: true,
                });
            }
            hqq.http.requestFastestUrlLine({
                urllist: hqq.app.remoteSeverinfo.pay_host,
                endurl: "/checked",
                callback: qcallback,
                needJsonParse: false,
            })
        } else {
            hqq.http.sendXMLHttpRequest({
                method: "GET",
                urlto: hqq.gameGlobal.pay.pay_host,
                endurl: endurl,
                callback: callback,
                failcallback: failcallback,
                needJsonParse: true,
            });
        }
    },

    setPlayerInfo(msg) {
        if (msg.game_nick) {
            this.nicklabel.string = msg.game_nick
        }
        if (msg.game_gold || msg.game_gold == 0) {
            this.goldlabel.string = msg.game_gold.toString().replace(".", "/")
        }
        if (msg.game_img) {
            hqq.commonTools.loadHeadRes(msg.game_img, this.headimg)
        }
        if (msg.phone_number) {
            this.phonelabel.string = msg.phone_number
            this.phonelabel.node.color = new cc.Color(225, 225, 225)
            this.phonebindbtn.active = false
        } else if (msg.ischangeAccount) {
            this.phonelabel.string = "暂未绑定手机"
            this.phonelabel.node.color = new cc.Color(152, 152, 152)
            this.phonebindbtn.active = true
        }
        if (msg.alipay) {
            this.alipaylabel.string = msg.alipay.substring(0, 2) + "** **** **" + msg.alipay.substring(msg.alipay.length - 2, msg.alipay.length)
            this.alipaylabel.node.color = new cc.Color(225, 225, 225)
            // this.alipaybindbtn.active = false
        }
        if (msg.yinhangka) {
            this.yinghangkalabel.string = "**** **** **** " + msg.yinhangka.substring(msg.yinhangka.length - 4, msg.yinhangka.length)
            this.yinghangkalabel.node.color = new cc.Color(225, 225, 225)
            this.yinhangkabindbtn.active = false
        }
        if (msg.ischangeAccount) {
            this.idlabel.string = msg.id
            if (!msg.alipay || !msg.yinhangka) {
                this.getPayInfo();
            }
        }
    },

    onClickExit() {
        // cc.log("关闭")
        this.node.removeFromParent(true)
    },

    onClickChangeHeadImg() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 1 })
    },

    onClickNick() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 3 })
    },

    onClickCopy() {
        if (hqq.reflect) {
            if (hqq.reflect.setClipboard(this.idlabel.string)) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "复制id成功")
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "复制id失败")
            }
        }
    },

    obnClickPhoneBind() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showBiglayer, 3)
    },

    onClickAlipayBind() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 2 })
    },

    onClickYinHangKaBind() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showBiglayer, 2)
    },

    onClickChangeAccount() {
        hqq.eventMgr.dispatch(hqq.eventMgr.showSamlllayer, { type: 4 })
    },

    onClickMusic(event) {
        hqq.audioMgr && hqq.audioMgr.setBgState(event.isChecked)
    },

    onClickAudio(event) {
        hqq.audioMgr && hqq.audioMgr.setEffectState(event.isChecked)
    },

    onClicktxt_se() {
        this.num0++
        if (this.num0 > 10 && this.num1 > 10) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showConsole, null)
        }
    },
    onClicktxt_bgm() {
        this.num1++
        if (this.num0 > 10 && this.num1 > 10) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showConsole, null)
        }
    },

    onclickDownApk() {
        hqq.app.idDownApk = true
        cc.director.loadScene('loading')
    },

    // update (dt) {},

    onEnable() {
        hqq.eventMgr.register(hqq.eventMgr.refreshPlayerinfo, "hallPersonLayer", this.setPlayerInfo.bind(this))
        hqq.eventMgr.register(hqq.eventMgr.getPayInfo, "hallPersonLayer", this.getPayInfo.bind(this))
    },

    onDisable() {
        hqq.eventMgr.unregister(hqq.eventMgr.getPayInfo, "hallPersonLayer")
        hqq.eventMgr.unregister(hqq.eventMgr.refreshPlayerinfo, "hallPersonLayer")
    },

    onDestroy() {
        hqq.eventMgr.unregister(hqq.eventMgr.getPayInfo, "hallPersonLayer")
        hqq.eventMgr.unregister(hqq.eventMgr.refreshPlayerinfo, "hallPersonLayer")
    },
});
