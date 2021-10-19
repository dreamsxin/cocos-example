

cc.Class({
    extends: cc.Component,

    properties: {
        back: cc.Node,
        exitbtn: cc.Node,
        ensurebtn: cc.Button,
        resetpass: cc.Node,
        bindyinhangka: cc.Node,
        officelogin: cc.Node,

        captchaimg1: cc.Sprite,
        captchaimg2: cc.Sprite,
        BankSelectItem: cc.Prefab,
        selectKaihushengContent: cc.Node,
        selectKaihushiContent: cc.Node,
        selectKaihuhangContent: cc.Node,
    },

    onLoad() {
        this.cities = {
            '北京': ['北京'],
            '天津': ['天津'],
            '河北': [
                '石家庄', '唐山', '秦皇岛', '邢台', '保定', '张家口', '承德', '沧州', '廊坊', '衡水'
            ],
            '山西': [
                '太原', '大同', '阳泉', '长治', '晋城', '朔州', '晋中', '运城', '忻州', '临汾', '吕梁'
            ],
            '内蒙古': [
                '呼和浩特', '包头', '乌海', '赤峰', '通辽', '鄂尔多斯', '呼伦贝尔', '巴彦淖尔', '乌兰察布', '兴安', '锡林郭勒', '阿拉善'
            ],
            '辽宁': [
                '沈阳', '大连', '鞍山', '抚顺', '本溪', '丹东', '锦州', '营口', '阜新', '辽阳', '盘锦', '铁岭', '朝阳', '葫芦岛'
            ],
            '吉林': [
                '长春', '吉林', '四平', '辽源', '通化', '白山', '松原', '白城', '延边'
            ],
            '黑龙江': [
                '哈尔滨', '齐齐哈尔', '鸡西', '鹤岗', '双鸭山', '大庆', '伊春', '佳木斯', '七台河', '牡丹江', '黑河', '绥化', '大兴安岭'
            ],
            '上海': [
                '上海'
            ],
            '江苏': [
                '南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'
            ],
            '浙江': [
                '杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水',
            ],
            '安徽': [
                '合肥', '芜湖', '蚌埠', '淮南', '马鞍山', '淮北', '铜陵', '安庆', '黄山', '滁州', '阜阳', '宿州', '巢湖', '六安', '亳州', '池州', '宣城',
            ],
            '福建': [
                '福州', '厦门', '莆田', '三明', '泉州', '漳州', '南平', '龙岩', '宁德',
            ],
            '江西': [
                '南昌', '景德镇', '萍乡', '九江', '新余', '鹰潭', '赣州', '吉安', '宜春', '抚州', '上饶',
            ],
            '山东': [
                '济南', '青岛', '淄博', '枣庄', '东营', '烟台', '潍坊', '济宁', '泰安', '威海', '日照', '莱芜', '临沂', '德州', '聊城', '滨州', '菏泽'
            ],
            '河南': [
                '郑州', '开封', '洛阳', '平顶山', '安阳', '鹤壁', '新乡', '焦作', '濮阳', '许昌', '漯河', '三门峡', '南阳', '商丘', '信阳', '周口', '驻马店', '济源'
            ],
            '湖北': [
                '武汉', '黄石', '十堰', '宜昌', '襄樊', '鄂州', '荆门', '孝感', '荆州', '黄冈', '咸宁', '随州', '恩施', '仙桃', '潜江', '天门', '神农架'
            ],
            '湖南': [
                '长沙', '株洲', '湘潭', '衡阳', '邵阳', '岳阳', '常德', '张家界', '益阳', '郴州', '永州', '怀化', '娄底', '湘西',
            ],
            '广东': [
                '广州', '韶关', '深圳', '珠海', '汕头', '佛山', '江门', '湛江', '茂名', '肇庆', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'
            ],
            '广西': [
                '南宁', '柳州', '桂林', '梧州', '北海', '防城港', '钦州', '贵港', '玉林', '百色', '贺州', '河池', '来宾', '崇左',
            ],
            '海南': [
                '海口', '三亚', '三沙', '五指山', '琼海', '儋州', '文昌', '万宁', '东方', '定安', '屯昌', '澄迈', '临高', '白沙', '昌江', '乐东', '陵水', '保亭', '琼中',
            ],
            '重庆': [
                '重庆'
            ],
            '四川': [
                '成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达川', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山',
            ],
            '贵州': [
                '贵阳', '六盘水', '遵义', '安顺', '铜仁', '黔西南', '毕节', '黔东南', '黔南'
            ],
            '云南': [
                '昆明', '曲靖', '玉溪', '保山', '昭通', '丽江', '普洱', '临沧', '楚雄', '红河', '文山', '西双版纳', '大理', '德宏', '怒江', '迪庆',
            ],
            '西藏': [
                '拉萨', '昌都', '山南', '日喀则', '那曲', '阿里', '林芝',
            ],
            '陕西': [
                '西安', '铜川', '宝鸡', '咸阳', '渭南', '延安', '汉中', '榆林', '安康', '商洛',
            ],
            '甘肃': [
                '兰州', '嘉峪关', '金昌', '白银', '天水', '武威', '张掖', '平凉', '酒泉', '庆阳', '定西', '陇南', '临夏', '甘南',
            ],
            '青海': [
                '西宁', '海东', '海北', '黄南', '海南', '果洛', '玉树', '梅西',
            ],
            '宁夏': [
                '银川', '石嘴山', '吴忠', '固原', '中卫',
            ],
            '新疆': [
                '乌鲁木齐', '克拉玛依', '吐鲁番', '哈密', '昌吉', '博尔塔拉', '巴音郭楞', '阿克苏', '克孜勒苏', '喀什', '和田', '伊犁', '塔城', '阿勒泰', '石河子', '阿拉尔', '图木舒克', '五家渠',
            ],
            '香港': ['香港'],
            '澳门': ['澳门'],
            '台湾': ['台湾']
        }
    },

    start() {
        // console.log("hqq.gameGlobal.pay.pay_host: ", hqq.gameGlobal.pay.pay_host);
    },

    init(subtype) {
        this.subtype = 0
        this.kaihuhangSelect = false
        this.kaihushengSelect = false
        this.kaihushiSelect = false
        this.selectIndex = 0
        this.time = 0
        this.ensurefunc = () => {
            this.onClickExit()
        }

        this.subtype = subtype;
        switch (subtype) {
            case 1: // 重置密码
                this.resetpass.active = true
                this.bindyinhangka.active = false
                this.officelogin.active = false
                this.panelInit(1)
                this.ensurefunc = this.resetpassEnsure
                break;
            case 2: // 绑定银行卡
                this.resetpass.active = false
                this.bindyinhangka.active = true
                this.officelogin.active = false
                this.ensurebtn.node.y = -300
                this.exitbtn.y = 300
                this.back.height = 665
                this.ensurefunc = this.bindyinhangkaEnsure
                break;
            case 3: // 注册正式账号
                this.resetpass.active = false
                this.bindyinhangka.active = false
                this.officelogin.active = true
                this.panelInit(2)
                this.ensurefunc = this.officeloginEnsure
                break;
        }
    },

    onClickKaihushengXiala() {
        var results = ['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建',
            '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '内蒙古',
            '广西', '西藏', '宁夏', '新疆', '香港', '澳门', '台湾']
        if (!this.kaihushengSelect) {
            for (var i = 0; i < results.length; i++) {
                for (var i = 0; i < results.length; i++) {
                    var node = cc.instantiate(this.BankSelectItem);
                    this.selectKaihushengContent.addChild(node);
                    node.getChildByName('label').getComponent(cc.Label).string = results[i];
                    var clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node;
                    clickEventHandler.component = "hallPSubbLayer";
                    clickEventHandler.customEventData = results[i];
                    clickEventHandler.handler = "onClickKaihushengItem";
                    let button = node.getComponent(cc.Button);
                    button.clickEvents.push(clickEventHandler);
                }
            }
            this.kaihushengSelect = true;
        } else {
            let templabel = this.bindyinhangka.getChildByName("kaihushi").getChildByName('kaihushilabel')
            templabel.getComponent(cc.Label).string = "选择开户市"
            templabel.color = new cc.Color(187, 187, 187)
            this.selectKaihushengContent.removeAllChildren();
            this.kaihushengSelect = false;
        }
    },
    onClickKaihushengItem(event, custom) {
        let templabel = this.bindyinhangka.getChildByName("kaihusheng").getChildByName('kaihushenglabel')
        templabel.getComponent(cc.Label).string = custom
        templabel.color = new cc.Color(255, 255, 255)
        this.onClickKaihushengXiala()
    },
    onClickKaihushiXiala() {
        let sheng = this.bindyinhangka.getChildByName("kaihusheng").getChildByName('kaihushenglabel').getComponent(cc.Label).string
        if (!sheng || sheng == "选择开户省") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请先选择开户省!")
            return
        }
        var results = this.cities[sheng]
        if (!this.kaihuhangSelect) {
            for (var i = 0; i < results.length; i++) {
                var node = cc.instantiate(this.BankSelectItem);
                this.selectKaihushiContent.addChild(node);
                node.getChildByName('label').getComponent(cc.Label).string = results[i];
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallPSubbLayer";
                clickEventHandler.customEventData = results[i];
                clickEventHandler.handler = "onClickKaihushiItem";
                let button = node.getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
            this.kaihuhangSelect = true;
        } else {
            this.selectKaihushiContent.removeAllChildren();
            this.kaihuhangSelect = false;
        }
    },
    onClickKaihushiItem(event, custom) {
        let templabel = this.bindyinhangka.getChildByName("kaihushi").getChildByName('kaihushilabel')
        templabel.getComponent(cc.Label).string = custom
        templabel.color = new cc.Color(255, 255, 255)
        this.onClickKaihushiXiala()
    },

    onClickKaihuhangXiala() {
        var results = ['中国农业银行', '交通银行', '中国建设银行', '兴业银行', '民生银行', '中信银行', '华夏银行',
            '中国工商银行', '浦发银行', '招商银行', '中国银行', '光大银行', '广发银行', '北京银行', '杭州银行', '宁波银行',
            '平安银行', '中国邮政']
        if (!this.kaihuhangSelect) {
            for (var i = 0; i < results.length; i++) {
                var node = cc.instantiate(this.BankSelectItem);
                this.selectKaihuhangContent.addChild(node);
                node.getChildByName('label').getComponent(cc.Label).string = results[i];
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = this.node;
                clickEventHandler.component = "hallPSubbLayer";
                clickEventHandler.customEventData = results[i];
                clickEventHandler.handler = "onClickKaihuhangItem";
                let button = node.getComponent(cc.Button);
                button.clickEvents.push(clickEventHandler);
            }
            this.kaihuhangSelect = true;
        } else {
            this.selectKaihuhangContent.removeAllChildren();
            this.kaihuhangSelect = false;
        }
    },
    onClickKaihuhangItem(event, custom) {
        let templabel = this.bindyinhangka.getChildByName("yinhangname").getChildByName('yinhanglabel')
        templabel.getComponent(cc.Label).string = custom
        templabel.color = new cc.Color(255, 255, 255)
        this.onClickKaihuhangXiala()
    },
    yinhangkaChange(event) { // 银行卡号输入后忽略空格符
        this.bindyinhangka.getChildByName("kahaoeditbox").getComponent(cc.EditBox).string = event.string.replace(/\s+/g, "")
    },
    // 是否是中文
    isChinese(s) {
        var ret = true;
        for (var i = 0; i < s.length; i++) {//遍历每一个文本字符bai
            ret = ret && (s.charCodeAt(i) >= 10000);//判断文本字符的unicode值
        }
        return ret
    },
    // 绑定银行卡确定
    bindyinhangkaEnsure() {
        this.ensurebtn.interactable = false
        let card_num = this.bindyinhangka.getChildByName("kahaoeditbox").getComponent(cc.EditBox).string
        if (card_num.length == 0) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "银行卡卡号不能为空！")
        }
        if (card_num.length < 15 || card_num.length > 19) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "无效卡号！")
        }
        let card_name = this.bindyinhangka.getChildByName("nameediftox").getComponent(cc.EditBox).string
        if (card_name.length == 0) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "银行卡收款人姓名不能为空！")
        } else if (!this.isChinese(card_name)) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "姓名不能含有特殊字符！")
        }
        let sheng = this.bindyinhangka.getChildByName("kaihusheng").getChildByName('kaihushenglabel').getComponent(cc.Label).string
        if (sheng == '选择开户省' || sheng.length == 0) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "开户省不能为空！")
        }
        let shi = this.bindyinhangka.getChildByName("kaihushi").getChildByName('kaihushilabel').getComponent(cc.Label).string
        if (shi == '选择开户市' || shi.length == 0) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "开户市不能为空！")
        }
        let bank_name = this.bindyinhangka.getChildByName("yinhangname").getChildByName('yinhanglabel').getComponent(cc.Label).string
        if (bank_name == '选择开户银行' || bank_name.length == 0) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "开户行不能为空！")
        }
        let branch_name = this.bindyinhangka.getChildByName("zhihang").getComponent(cc.EditBox).string
        if (branch_name.length == 0) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "开户支行不能为空！")
        } else if (!this.isChinese(branch_name)) {
            this.ensurebtn.interactable = true
            return hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "开户支行不能含有特殊字符！")
        }

        let obj = {};
        obj = {
            card_num: card_num.replace(/\s+/g, ""),
            card_name: card_name,
            bank_name: bank_name,
            branch_name: branch_name,
            bank_province: sheng,
            bank_city: shi,
        };
        let info = JSON.stringify(obj);
        let dataStr = "user_id=" + hqq.gameGlobal.pay.user_id
        dataStr += "&user_name=" + hqq.gameGlobal.pay.user_name
        dataStr += "&action=add&type=3&info=" + info
        dataStr += "&client=" + hqq.gameGlobal.pay.client
        dataStr += "&proxy_user_id=" + hqq.gameGlobal.pay.proxy_user_id
        dataStr += "&proxy_name=" + hqq.gameGlobal.pay.proxy_name
        dataStr += "&package_id=" + hqq.gameGlobal.pay.package_id
        dataStr += "&token=e40f01afbb1b9ae3dd6747ced5bca532"
        dataStr += "&version=1"
        let callback = (response) => {
            this.ensurebtn.interactable = true
            if (response.status == 0) {
                hqq.eventMgr.dispatch(hqq.eventMgr.getPayInfo)
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "操作成功")
                this.onClickExit()
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, response.msg)
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("bindyinhangkaEnsure failcallback", status, forcejump, url, err, readyState)
            this.ensurebtn.interactable = true
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err)
        }
        let url = hqq.gameGlobal.pay.pay_host + "/api/payment_account/saveAccount"
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: url,
            param: dataStr,
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },

    onClickCaptcha() {
        this.panelInit(this.subtype)
    },

    // 注册正式账号初始化
    panelInit(mtype) {
        if (CC_JSB) {
            let fullPath = jsb.fileUtils.getWritablePath() + "yanzhenma.png";
            jsb.fileUtils.isFileExist(fullPath) && jsb.fileUtils.removeFile(fullPath);
            if (this.temptex) {
                cc.assetManager.releaseAsset(this.temptex);
            }
        }

        let imgurl = ''
        if (hqq.app.server.indexOf("http:") == -1 && hqq.app.server.indexOf("https:") == -1) {
            imgurl = "http://" + hqq.app.server + "/Game/Verify/createCaptcha?"
        } else {
            imgurl = hqq.app.server + "/Game/Verify/createCaptcha?"
        }
        imgurl += "id=" + hqq.app.gameuser.id;
        imgurl += "&token=" + hqq.gameGlobal.token;
        let self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("get", imgurl, true);
        if (CC_JSB) {
            xhr.responseType = "arraybuffer";
        } else {
            xhr.responseType = "blob";
        }
        xhr.onload = function () {
            if (this.status == 200) {
                if (CC_JSB) {
                    var fullPath = jsb.fileUtils.getWritablePath() + "yanzhenma.png";
                    if (jsb.fileUtils.isFileExist(fullPath) && jsb.fileUtils.removeFile(fullPath)) {
                        if (jsb.fileUtils.writeDataToFile(new Uint8Array(this.response), fullPath)) {
                            cc.assetManager.loadRemote(fullPath, function (err, tex) {
                                if (err) {
                                    cc.error(err);
                                } else {
                                    self.temptex = tex
                                    let mspriteFrame = new cc.SpriteFrame(tex);
                                    if (mspriteFrame) {
                                        if (mtype == 1) {
                                            self.captchaimg1.spriteFrame = mspriteFrame;
                                        } else {
                                            self.captchaimg2.spriteFrame = mspriteFrame;
                                        }
                                    }
                                }
                            });
                        } else {
                            cc.log('Remote write file failed.');
                        }
                    } else {
                        if (jsb.fileUtils.writeDataToFile(new Uint8Array(this.response), fullPath)) {
                            cc.assetManager.loadRemote(fullPath, function (err, tex) {
                                if (err) {
                                    cc.error(err);
                                } else {
                                    self.temptex = tex
                                    let mspriteFrame = new cc.SpriteFrame(tex);
                                    if (mspriteFrame) {
                                        if (mtype == 1) {
                                            self.captchaimg1.spriteFrame = mspriteFrame;
                                        } else {
                                            self.captchaimg2.spriteFrame = mspriteFrame;
                                        }
                                    }
                                }
                            });
                        } else {
                            cc.log('Remote write file failed.');
                        }
                    }
                } else {
                    var blob = this.response;
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        let base64 = e.target.result;
                        var img = new Image();
                        img.src = base64;
                        img.onload = function () {
                            var texture = new cc.Texture2D();
                            texture.initWithElement(img);
                            var newframe = new cc.SpriteFrame();
                            newframe.setTexture(texture);
                            if (mtype == 1) {
                                self.captchaimg1.spriteFrame = newframe;
                            } else {
                                self.captchaimg2.spriteFrame = newframe;
                            }
                        }
                    };
                    oFileReader.readAsDataURL(blob);
                }
                xhr.abort()
            }
        }
        xhr.ontimeout = () => {
            xhr.abort()
        }
        xhr.onerror = () => {
            xhr.abort()
        }
        xhr.send();
    },
    // 获取手机短信验证码
    onClickGetCaptcha(event, custom) {
        let phonenum
        let yanzhenmanum
        if (custom == 1) {
            phonenum = this.resetpass.getChildByName("phoneeditbox").getComponent(cc.EditBox).string
            yanzhenmanum = this.resetpass.getChildByName("yanzheneditbox").getComponent(cc.EditBox).string
        } else {
            phonenum = this.officelogin.getChildByName("phoneeditbox").getComponent(cc.EditBox).string
            yanzhenmanum = this.officelogin.getChildByName("yanzheneditbox").getComponent(cc.EditBox).string
        }
        if (phonenum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入手机号")
            return
        }
        if (phonenum[0] != "1") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入正确的手机号")
            return
        }
        if (yanzhenmanum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入图形验证码")
            return
        }
        let self = this
        let callback = (data) => {
            if (data.code == 200) {
                let btn
                if (custom == 1) {
                    btn = self.resetpass.getChildByName("getcodebtn").getComponent(cc.Button)
                } else {
                    btn = self.officelogin.getChildByName("getcodebtn").getComponent(cc.Button)
                }
                btn.interactable = false
                let btnlabel = btn.node.getChildByName('btnlabel')
                let la = btnlabel.getComponent(cc.Label)
                la.string = "重发（60）"
                btnlabel.color = new cc.Color(67, 67, 67)
                let lao = btnlabel.getComponent(cc.LabelOutline)
                lao.color = new cc.Color(67, 67, 67)
                let time2 = 0
                let timer = setInterval(() => {
                    time2++
                    let t = 60 - time2
                    la.string = "重发（" + t + "）"
                    if (time2 >= 60) {
                        clearInterval(timer);
                        btn.interactable = true
                        la.string = '获取验证码'
                        btnlabel.color = new cc.Color(67, 0, 0)
                        lao.color = new cc.Color(67, 0, 0)
                    }
                }, 1000)
            } else {
                if (data.code == 203 && data.msg == "图片验证码错误") {
                    hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "输入正确的图形验证码")
                } else {
                    hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "获取失败:" + data.msg)
                }
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("onClickGetCaptcha failcallback", status, forcejump, url, err, readyState)
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err)
        }
        let endurl = hqq.app.getIpPostEndUrl(7);
        let data = {
            id: hqq.gameGlobal.player.id,
            token: hqq.gameGlobal.token,
            phone_number: phonenum,
            captcha: yanzhenmanum,
        }
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: hqq.app.server + endurl,
            param: data,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        })
    },
    // 注册正式账号 确定
    officeloginEnsure() {
        let phonenum = this.officelogin.getChildByName("phoneeditbox").getComponent(cc.EditBox).string
        let yanzhenmanum = this.officelogin.getChildByName("yanzheneditbox").getComponent(cc.EditBox).string
        let capchanum = this.officelogin.getChildByName("capchaeditbox").getComponent(cc.EditBox).string
        let passnum = this.officelogin.getChildByName("passeditbox").getComponent(cc.EditBox).string
        if (phonenum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入手机号")
            return
        }
        if (capchanum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入短信验证码")
            return
        }
        if (passnum == "" || passnum.length < 6) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入有效密码")
            return
        }
        this.ensurebtn.interactable = false
        let callback = (responsedata) => {
            if (responsedata.status != 0) {
                this.ensurebtn.interactable = true
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "手机号绑定失败，请联系客服！");
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "成功获取免费金币");
                hqq.setPlayerinfo({ phone_number: responsedata.msg });
                this.onClickExit();
            }
        }
        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("officeloginEnsure failcallback", status, forcejump, url, err, readyState)
            this.ensurebtn.interactable = true
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "获取免费金币网络连接失败" + status);
        }
        let payUrl = hqq.gameGlobal.pay.pay_host + "/api/activity/bindPhone";
        let dataStr = "id=" + hqq.gameGlobal.pay.user_id;
        if (hqq.gameGlobal.pay.user_name) {
            dataStr = dataStr + "&user_name=" + hqq.gameGlobal.pay.user_name;
        } else {
            dataStr = dataStr + "&user_name=" + hqq.gameGlobal.pay.user_id; //if user_name is null, take the user_id instead, otherwise will get error.
        }
        dataStr = dataStr + "&package_id=" + hqq.gameGlobal.pay.package_id;
        dataStr = dataStr + "&token=e40f01afbb1b9ae3dd6747ced5bca532";
        dataStr = dataStr + "&phone_number=" + phonenum;
        dataStr = dataStr + "&captcha=" + yanzhenmanum;
        dataStr = dataStr + "&code=" + capchanum;
        dataStr = dataStr + "&password=" + passnum;
        dataStr = dataStr + "&center_token=" + hqq.gameGlobal.token;
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: payUrl,
            param: dataStr,
            callback: callback,
            needJsonParse: true,
            failcallback: failcallback,
        })
    },
    // 重置账号密码 确定
    resetpassEnsure() {
        this.ensurebtn.interactable = false
        let phonenum = this.resetpass.getChildByName("phoneeditbox").getComponent(cc.EditBox).string
        let yanzhenmanum = this.resetpass.getChildByName("yanzheneditbox").getComponent(cc.EditBox).string
        let capchanum = this.resetpass.getChildByName("capchaeditbox").getComponent(cc.EditBox).string
        let passnum = this.resetpass.getChildByName("passeditbox").getComponent(cc.EditBox).string
        if (phonenum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入手机号")
            return
        }
        if (yanzhenmanum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入图形验证码")
            return
        }
        if (capchanum == "") {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入短信验证码")
            return
        }
        if (passnum == "" || passnum.length < 6) {
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请输入有效密码")
            return
        }

        let callback = (data) => {
            if (data.code == 200) {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "重置账号密码成功")
                this.onClickExit()
            } else {
                hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "重置失败：" + data.msg)
            }
        }

        let failcallback = (status, forcejump, url, err, readyState) => {
            hqq.logMgr.log("officeloginEnsure failcallback", status, forcejump, url, err, readyState)
            this.ensurebtn.interactable = true
            hqq.eventMgr.dispatch(hqq.eventMgr.showTip, "请求失败：" + status + ",err:" + err)
        }

        let endurl = hqq.app.getIpPostEndUrl(4)
        let data = {
            phone_number: phonenum,
            id: hqq.gameGlobal.player.id,
            code: capchanum,
            password: passnum,
            captcha: yanzhenmanum,
            token: hqq.gameGlobal.token,
        }
        hqq.http.sendXMLHttpRequest({
            method: 'POST',
            urlto: hqq.app.server + endurl,
            param: data,
            callback: callback,
            failcallback: failcallback,
            needJsonParse: true,
        })
    },

    onClickExit() {
        if (CC_JSB) {
            let fullPath = jsb.fileUtils.getWritablePath() + "yanzhenma.png";
            jsb.fileUtils.isFileExist(fullPath) && jsb.fileUtils.removeFile(fullPath);
            if (this.temptex) {
                cc.assetManager.releaseAsset(this.temptex);
            }
        }
        this.node.removeFromParent(true)
    },

    onClickSure() {
        this.ensurefunc()
    },

    // update (dt) {},
});
