cc.Class({
    extends: cc.Component,

    properties: {
        subtitle: cc.Sprite,
        subtime: cc.Label,
        subtxt: cc.Label,
        subscroll: cc.ScrollView,
        email: cc.SpriteFrame,
        notice: cc.SpriteFrame,

        gonggaobtn: cc.Button,
        emailbtn: cc.Button,
        deletbtn: cc.Node,
        sublayer: cc.Node,
        item: cc.Node,
        noticescroll: cc.ScrollView,
        eamilscroll: cc.ScrollView,

        hasreadframe: cc.SpriteFrame,
        noreadframe: cc.SpriteFrame,

        ehasreadframe: cc.SpriteFrame,
        enoreadframe: cc.SpriteFrame,

        subnoticeframe: cc.SpriteFrame,
        subemailframe: cc.SpriteFrame,

    },

    onLoad() {
        this.subData = null

        // this.noticedata = hqq.commonTools.jsonCopy(hqq.gameGlobal.noticeList)
        this.noticedata = hqq.gameGlobal.noticeList
        this.emaildata = []

        this.noticeItemList = []
        this.emailItemList = []

        // this.initEmailScroll()
        this.initNoticeScroll()

        this.onClickGongGao()
    },

    start() {

    },

    init() {

    },

    initNoticeScroll() {
        this.noticeItemList = []
        this.noticescroll.content.removeAllChildren()
        this.noticescroll.content.height = (this.item.height + 16) * this.noticedata.length + 44
        for (let i = 0; i < this.noticedata.length; i++) {
            let mitem = cc.instantiate(this.item)
            let readstate = mitem.getChildByName("readstate").getComponent(cc.Sprite)
            readstate.spriteFrame = this.noticedata[i].isread ? this.hasreadframe : this.noreadframe;
            let time = mitem.getChildByName("time").getComponent(cc.Label)
            let notice = mitem.getChildByName("notice")
            notice.active = true
            let email = mitem.getChildByName("email")
            email.active = false
            let title = notice.getChildByName("title").getComponent(cc.Label)
            title.string = this.noticedata[i].title
            this.noticedata[i].strtime = hqq.commonTools.formatDateToStr(this.noticedata[i].create_time)
            time.string = this.noticedata[i].strtime
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "hallNoticeLayer";
            clickEventHandler.customEventData = this.noticedata[i];
            clickEventHandler.handler = "onClickReadItem";
            let btn = notice.getChildByName("btn").getComponent(cc.Button);
            btn.clickEvents.push(clickEventHandler);
            mitem.setPosition(0, -(0.5 + i) * (mitem.height + 16) - 22)
            mitem.active = true
            this.noticescroll.content.addChild(mitem)
            this.noticeItemList.push(mitem)
        }
    },

    initEmailScroll() {
        this.emailItemList = []
        this.eamilscroll.content.removeAllChildren()
        this.eamilscroll.content.height = (this.item.height + 16) * this.emaildata.length + 44
        for (let i = 0; i < this.emaildata.length; i++) {
            let mitem = cc.instantiate(this.item)
            let readstate = mitem.getChildByName("readstate").getComponent(cc.Sprite)
            readstate.spriteFrame = this.emaildata[i].isread ? this.hasreadframe : this.noreadframe;
            let time = mitem.getChildByName("time").getComponent(cc.Label)
            let notice = mitem.getChildByName("notice")
            notice.active = false
            let email = mitem.getChildByName("email")
            email.active = true
            let title = email.getChildByName("title").getComponent(cc.Label)
            title.string = this.emaildata[i].title
            this.emaildata[i].strtime = hqq.commonTools.formatDateToStr(this.emaildata[i].create_time)
            time.string = this.emaildata[i].strtime
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "hallNoticeLayer";
            clickEventHandler.customEventData = this.emaildata[i];
            clickEventHandler.handler = "onClickReadItem";
            let btnnode = email.getChildByName("btn")
            let btnsprite = btnnode.getComponent(cc.Sprite)
            btnsprite.spriteFrame = this.emaildata[i].isread ? this.ehasreadframe : this.enoreadframe;
            let btn = btnnode.getComponent(cc.Button);
            btn.clickEvents.push(clickEventHandler);
            mitem.setPosition(0, -(0.5 + i) * (mitem.height + 16) - 22)
            mitem.active = true
            this.eamilscroll.content.addChild(mitem)
            this.emailItemList.push(mitem)
        }
    },

    onClickExit() {
        this.node.removeFromParent(true)
    },

    onClickGongGao() {
        // cc.log("公告")
        this.gonggaobtn.interactable = false
        this.emailbtn.interactable = true
        this.noticescroll.node.active = true
        this.eamilscroll.node.active = false
        this.deletbtn.active = false
    },

    onClickYouJian(event, custom) {
        return
        // cc.log("邮件")
        this.emaildata[custom.key].isread = 1
        this.noticeItemList[custom.key].getChildByName("readstate").getComponent(cc.Sprite).spriteFrame = this.emaildata[custom.key].isread ? this.hasreadframe : this.noreadframe;
        this.emailItemList[custom.key].getChildByName("email").getChildByName("btn").getComponent(cc.Sprite).spriteFrame = this.emaildata[custom.key].isread ? this.ehasreadframe : this.enoreadframe;
        this.gonggaobtn.interactable = true
        this.emailbtn.interactable = false
        this.noticescroll.node.active = false
        this.eamilscroll.node.active = true
        this.deletbtn.active = true
    },

    onClickReadItem(event, custom) {
        // cc.log("点击", custom)
        this.noticedata[custom.key].isread = 1
        this.noticeItemList[custom.key].getChildByName("readstate").getComponent(cc.Sprite).spriteFrame = this.noticedata[custom.key].isread ? this.hasreadframe : this.noreadframe;
        this.sublayer.active = true
        this.initSubLayer(custom)
        this.checkIsAllRead()
        // let noticehistory = hqq.localStorage.getGlobal().noticeKey
        // if (!noticehistory) {
        //     noticehistory = []
        // }
        // noticehistory.push(custom.create_time)
        // if (noticehistory.length > 200) {
        //     noticehistory.splice(0, 150)
        // }
        // hqq.localStorage.globalSet('noticeKey', noticehistory)
    },

    checkIsAllRead() {
        for (let i = 0; i < this.noticedata.length; i++) {
            if (this.noticedata[i].isread == 0) {
                return
            }
        }
        hqq.eventMgr.dispatch(hqq.eventMgr.refreshHallTips, { hidenoticetip: true })
    },

    onClieckDeleteHasRead() {
        this.emaildata.shift()
        this.initEmailScroll()
    },

    onClickSubClose() {
        this.sublayer.active = false
    },

    onClickDelete() {
        if (this.subData.type == 2) {
            let deleteNotice = hqq.localStorage.getGlobal().noticeDeleteKey
            if (!deleteNotice) {
                deleteNotice = []
            }
            deleteNotice.push(this.subData.create_time)
            if (deleteNotice.length > 200) {
                deleteNotice.splice(0, 150)
            }
            hqq.localStorage.globalSet('noticeDeleteKey', deleteNotice)
            for (let i = 0; i < this.noticedata.length; i++) {
                if (this.noticedata[i].key == this.subData.key) {
                    this.noticedata.splice(i, 1)
                    for (let j = 0; j < this.noticedata.length; j++) {
                        this.noticedata[j].key = j
                    }
                    this.initNoticeScroll()
                    this.onClickSubClose()
                    return
                }
            }
        }
    },

    initSubLayer(custom, isemail) {
        this.subData = custom
        this.subtime.node.active = isemail
        if (isemail) {
            this.subtime.string = custom.strtime
            this.subtitle.spriteFrame = this.email
        } else {
            this.subtitle.spriteFrame = this.notice
        }
        this.subtxt.string = custom.words
        if (cc.ENGINE_VERSION == "2.1.3") {
            this.subtxt._updateRenderData(true) // 2.1.3
        } else {
            // this.subtxt._lazyUpdateRenderData(true) // 2.2.2
            this.subtxt._forceUpdateRenderData(true) // 2.2.2
        }
        this.subscroll.content.height = this.subtime.node.height + this.subtxt.node.height
    }

    // update (dt) {},
});
