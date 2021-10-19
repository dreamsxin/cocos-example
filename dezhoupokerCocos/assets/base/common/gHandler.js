let gHandler = {
    isOtherGame: false, // 是否是接入的第三方
    needShowNotice: false, // 是否需要显示公告界面
    language: "CN", // 语言种类   汉语 CN 英语 EN 越南语 VI 泰语 TH
    isDebug: true, // 是否是子游戏开发调试状态
    gameGlobal: {
        gameNow: "hall", // 当前游戏的名字
        iconPath: "", // 头像地址前缀
        playerKey: "playerKey",
        tokenKey: "tokenKey",
        token: "", // 通信token
        huanjin: "", // dev pre online
        loginHistory: [], // 子游戏最近一周登陆历史sub
        player: { // 玩家信息
            gold: "", // 金币
            nick: "", // 昵称
            sex: 0,// 男 0  女 1
            headurl: "1.png", // 头像
            account_name: 0, // number类型 账号
            account_pass: "", // string类型 密码
            proxy_pid: 0, // 代理id
            uuid: 0,
            id: 0,
            code: 0, // 上级id  邀请码
            phonenum: "", // 手机号码
            alipay: "", //  支付宝账号
            yinhangka: "", //  银行卡
            deviceid: "", // 设备id
        },
        im_host: "",
        proxy: { // 全民代理数据结构
            package_id: null, // number类型
            balance: null, // number类型
            temp_host: "", // string类型
            proxy_host: "", // proxy_host
        },
        pay: { // 充提数据结构
            from_scene: "", // 跳转过来的场景名
            client: "",
            pay_host: "",
            user_id: "",
            user_name: "",
            proxy_user_id: "",
            proxy_name: "",
            package_id: null, // number类型
        },
        noticeList: [], // 公告列表
        slideNoticeList: [], // 滚动公告
        imReceive: 0, // im收到的消息
        payReceive: 0, // 收益消息
        ipList: [], // 本地ip地址列表
        ipapiData: null, // 通过ipapi获得的数据
        regin_ip: "", // 注册ip
        ipCheck: false, // 是否通过ip
        ipinfoData: null, // 登陆ip信息2号方案
        subGameType: 0, // 沙巴体育和真人视讯子游戏类别
    },
    // 子游戏配置列表
    subGameList: {
        // "ermj": {
        //     zhname: "二人麻将", // 中文游戏名
        //     enname: "ermj", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "ERMJHallScene", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f25170",
        //     serverUrl: "/ermj", // 游戏服务器地址
        //     endUrl: "/ermj", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 16,
        //     resPath: "/hall/btnanimation/2rmj",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "21d": {
        //     zhname: "二十一点", // 中文游戏名
        //     enname: "21d", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "21dRoomList", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251722",
        //     serverUrl: "/21d", // 游戏服务器地址
        //     endUrl: "/21d", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 21,
        //     resPath: "/hall/btnanimation/21dian",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "ebg": {
        //     zhname: "新二八杠", // 中文游戏名
        //     enname: "ebg", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "ebg", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251720",
        //     serverUrl: "/erbg", // 游戏服务器地址
        //     endUrl: "/erbg", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 8,
        //     resPath: "/hall/btnanimation/28gang",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "bcbm": {
        //     zhname: "奔驰宝马", // 中文游戏名
        //     enname: "bcbm", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "bcbmloading", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251716",
        //     serverUrl: "/bcbm", // 游戏服务器地址
        //     endUrl: "/bcbm", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 4,
        //     resPath: "/hall/btnanimation/bcbm",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "bjl": {
        //     zhname: "百家乐", // 中文游戏名
        //     enname: "bjl", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "bjl_baccarat_hall", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251721",
        //     serverUrl: "/baijl", // 游戏服务器地址
        //     endUrl: "/baijl", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 10,
        //     resPath: "/hall/btnanimation/bjl",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "brnn": {
        //     zhname: "新百人牛牛", // 中文游戏名
        //     enname: "brnn", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "brnn", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251718",
        //     serverUrl: "/bairennn", // 游戏服务器地址
        //     endUrl: "/bairennn", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 7,
        //     resPath: "/hall/btnanimation/brnn",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "hwby": {
        //     zhname: "海王捕鱼", // 中文游戏名
        //     enname: "hwby", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "hwby", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f2517a6",
        //     serverUrl: "/haiwangby", // 游戏服务器地址
        //     endUrl: "/haiwangby", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 6,
        //     resPath: "/hall/btnanimation/buyu",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "cyqp": {
        //     zhname: "彩源棋牌", // 中文游戏名 
        //     enname: "cyqp", // 英文游戏名 （子游戏文件路径，更新子路径） 
        //     lanchscene: "CaiYuanQP", // 跳转场景名 
        //     game_id: "5b1f3a3cb76a591e7f251726",
        //     serverUrl: "/caiyuanqp", // 游戏服务器地址 
        //     endUrl: "/caiyuanqp", // 游戏服务器地址 
        //     hasAccount: false, // 是否已创建子游戏账号 
        //     remoteData: null, // 服务端发送过来的游戏数据 
        //     hallid: 26,
        //     resPath: "/hall/btnanimation/cyqp",
        //     isDown: false,
        //     gameType: 3, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4 
        //     loginHistory: [], // 子游戏最近一周登陆历史 
        // },
        // "ddz": {
        //     zhname: "斗地主", // 中文游戏名
        //     enname: "ddz", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "ddzroom", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251711",
        //     serverUrl: "/landlord", // 游戏服务器地址
        //     endUrl: "/landlord", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 12,
        //     resPath: "/hall/btnanimation/doudizhu",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        "dzpk": {
            zhname: "德州扑克", // 中文游戏名
            enname: "dzpk", // 英文游戏名 （子游戏文件路径，更新子路径）
            lanchscene: "dzpk_load", // 跳转场景名
            game_id: "5b1f3a3cb76a591e7f25176",
            serverUrl: "/dezhoupoker", // 游戏服务器地址
            endUrl: "/dezhoupoker", // 游戏服务器地址
            hasAccount: false, // 是否已创建子游戏账号
            remoteData: null, // 服务端发送过来的游戏数据
            hallid: 22,
            resPath: "/hall/btnanimation/dzpk",
            isDown: false,
            gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
            loginHistory: [], // 子游戏最近一周登陆历史
        },
        // "hbld": {
        //     zhname: "红包乱斗", // 中文游戏名
        //     enname: "hbld", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "hbldGame", // 跳转场景名
        //     game_id: "5c6a62be7ff587m117d446aa",
        //     serverUrl: "/hongbaold", // 游戏服务器地址
        //     endUrl: "/hongbaold", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 19,
        //     resPath: "/hall/btnanimation/hbld",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "hbsl": {
        //     zhname: "新红包扫雷", // 中文游戏名
        //     enname: "hbsl", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "hbslGame", // 跳转场景名
        //     game_id: "5b1f3a3cb76alkje7f25170",
        //     serverUrl: "/hongbaosl", // 游戏服务器地址
        //     endUrl: "/hongbaosl", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 14,
        //     resPath: "/hall/btnanimation/hbsl",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "hh": {
        //     zhname: "新红黑大战", // 中文游戏名
        //     enname: "hh", // 英文游戏名 （子游戏文件路径，更新子路径）ssss
        //     lanchscene: "hhlobby", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251719",
        //     serverUrl: "/redblackwar", // 游戏服务器地址
        //     endUrl: "/redblackwar", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 5,
        //     resPath: "/hall/btnanimation/honhei",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "cbzb": {
        //     zhname: "城堡争霸", // 中文游戏名 
        //     enname: "cbzb", // 英文游戏名 （子游戏文件路径，更新子路径） 
        //     lanchscene: "cbzb", // 跳转场景名 
        //     game_id: "5b1f3a3cb76a591e7f251729",
        //     serverUrl: "/castcraft", // 游戏服务器地址 
        //     endUrl: "/castcraft", // 游戏服务器地址 
        //     hasAccount: false, // 是否已创建子游戏账号 
        //     remoteData: null, // 服务端发送过来的游戏数据 
        //     hallid: 28,
        //     resPath: "/hall/btnanimation/icon_castleCrush",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4 
        //     loginHistory: [], // 子游戏最近一周登陆历史 
        // },
        // "jbpby": {
        //     zhname: "聚宝盆", // 中文游戏名
        //     enname: "jbpby", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "jbpby", // 跳转场景名
        //     game_id: "5c6a62be56209ac117d446aa",
        //     serverUrl: "/jbpby", // 游戏服务器地址
        //     endUrl: "/jbpby", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 18,
        //     resPath: "/hall/btnanimation/jbp",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "szwg": {
        //     zhname: "狮子王国", // 中文游戏名
        //     enname: "szwg", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "szwg_Hall", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251725",
        //     serverUrl: "/szwg", // 游戏服务器地址
        //     endUrl: "/szwg", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 24,
        //     resPath: "/hall/btnanimation/lionKingdom",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "lhd": {
        //     zhname: "龙虎斗", // 中文游戏名
        //     enname: "lhd", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "lhd", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251717",
        //     serverUrl: "/go_lhd", // 游戏服务器地址
        //     endUrl: "/go_lhd", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 11,
        //     resPath: "/hall/btnanimation/longhudou",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "lp": {
        //     zhname: "轮盘游戏", // 中文游戏名
        //     enname: "lp", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "lp", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251713",
        //     serverUrl: "/lunpan", // 游戏服务器地址
        //     endUrl: "/lunpan", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 9,
        //     resPath: "/hall/btnanimation/luanpan",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "pccp": {
        //     zhname: "派彩", // 中文游戏名
        //     enname: "pccp", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "PaiCai", // 跳转场景名
        //     game_id: "569a62be7ff123m117d446aa",
        //     serverUrl: "/paicai", // 游戏服务器地址
        //     endUrl: "/paicai", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 20,
        //     resPath: "/hall/btnanimation/paicai",
        //     isDown: false,
        //     gameType: 3, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "pdk": {
        //     zhname: "跑得快", // 中文游戏名
        //     enname: "pdk", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "pdkroom", // 跳转场景名
        //     game_id: "5c6a62be7ff09a54amb446aa",
        //     serverUrl: "/paodekuai", // 游戏服务器地址
        //     endUrl: "/paodekuai", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 17,
        //     resPath: "/hall/btnanimation/paodekuai",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "qznn": {
        //     zhname: "抢庄牛牛", // 中文游戏名
        //     enname: "qznn", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "NNGame", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251714",
        //     serverUrl: "/qznn", // 游戏服务器地址
        //     endUrl: "/qznn", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 0,
        //     resPath: "/hall/btnanimation/qznn",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "sbty1": {
        //     zhname: "沙巴体育", // 中文游戏名 
        //     enname: "sbty1", // 英文游戏名 （子游戏文件路径，更新子路径） 
        //     lanchscene: "ShaBaGame", // 跳转场景名 
        //     game_id: "5b1f3a3cb76a591e7f25179",
        //     serverUrl: "/shabaty", // 游戏服务器地址 
        //     endUrl: "/shabaty", // 游戏服务器地址 
        //     hasAccount: false, // 是否已创建子游戏账号 
        //     remoteData: null, // 服务端发送过来的游戏数据 
        //     hallid: 25,
        //     resPath: "/hall/btnanimation/sbty_icon",
        //     isDown: false,
        //     gameType: 3, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4 
        //     loginHistory: [], // 子游戏最近一周登陆历史 
        // },
        // "sbty2": {
        //     zhname: "沙巴体育", // 中文游戏名  电竞
        //     enname: "sbty2", // 英文游戏名 （子游戏文件路径，更新子路径） 
        //     lanchscene: "ShaBaGame", // 跳转场景名 
        //     game_id: "5b1f3a3cb76a591e7f25179",
        //     serverUrl: "/shabaty", // 游戏服务器地址 
        //     endUrl: "/shabaty", // 游戏服务器地址 
        //     hasAccount: false, // 是否已创建子游戏账号 
        //     remoteData: null, // 服务端发送过来的游戏数据 
        //     hallid: 29,
        //     resPath: "/hall/btnanimation/tycp_esports",
        //     isDown: false,
        //     gameType: 3, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4 
        //     loginHistory: [], // 子游戏最近一周登陆历史 
        // },
        // "sgj": {
        //     zhname: "水果机", // 中文游戏名
        //     enname: "sgj", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "FruitGame", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251712",
        //     serverUrl: "/shuigj", // 游戏服务器地址
        //     endUrl: "/shuigj", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 3,
        //     resPath: "/hall/btnanimation/sgj",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "sss": {
        //     zhname: "十三水", // 中文游戏名
        //     enname: "sss", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "SSSLoad", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f25171",
        //     serverUrl: "/shisanshui", // 游戏服务器地址
        //     endUrl: "/shisanshui", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 13,
        //     resPath: "/hall/btnanimation/shisanshui",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "shaibao": {
        //     zhname: "骰宝", // 中文游戏名
        //     enname: "shaibao", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "shaibao_Hall", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251724",
        //     serverUrl: "/shaibao", // 游戏服务器地址
        //     endUrl: "/shaibao", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 23,
        //     resPath: "/hall/btnanimation/sicbo",
        //     isDown: false,
        //     gameType: 1, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "zrsx1": {
        //     zhname: "真人视讯-百家乐", // 中文游戏名
        //     enname: "zrsx1", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "LiveGame", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f25173",
        //     serverUrl: "/zhenrensx", // 游戏服务器地址
        //     endUrl: "/zhenrensx", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 15,
        //     resPath: "/hall/btnanimation/sxbjl",
        //     isDown: false,
        //     gameType: 2, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "ygxb": {
        //     zhname: "云谷寻宝", // 中文游戏名 
        //     enname: "ygxb", // 英文游戏名 （子游戏文件路径，更新子路径） 
        //     lanchscene: "ygxbHall", // 跳转场景名 
        //     game_id: "5b1f3a3cb76a591e7f251728",
        //     serverUrl: "/ygxb", // 游戏服务器地址 
        //     endUrl: "/ygxb", // 游戏服务器地址 
        //     hasAccount: false, // 是否已创建子游戏账号 
        //     remoteData: null, // 服务端发送过来的游戏数据 
        //     hallid: 27,
        //     resPath: "/hall/btnanimation/yg_datingicon",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4 
        //     loginHistory: [], // 子游戏最近一周登陆历史 
        // },
        // "zjh": {
        //     zhname: "扎金花", // 中文游戏名
        //     enname: "zjh", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "ZJHLoad", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251715",
        //     serverUrl: "/zhajh", // 游戏服务器地址
        //     endUrl: "/zhajh", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 1,
        //     resPath: "/hall/btnanimation/zhajinhua",
        //     isDown: false,
        //     gameType: 0, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "zrsx2": {
        //     zhname: "真人视讯-龙虎斗", // 中文游戏名
        //     enname: "zrsx2", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "LiveGame", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f25173",
        //     serverUrl: "/zhenrensx", // 游戏服务器地址
        //     endUrl: "/zhenrensx", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 2,
        //     resPath: "/hall/btnanimation/zrsx",
        //     isDown: false,
        //     gameType: 2, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
        // "caishendao": {
        //     zhname: "财神到", // 中文游戏名
        //     enname: "caishendao", // 英文游戏名 （子游戏文件路径，更新子路径）
        //     lanchscene: "caishendao", // 跳转场景名
        //     game_id: "5b1f3a3cb76a591e7f251730",
        //     serverUrl: "/caishendao", // 游戏服务器地址
        //     endUrl: "/caishendao", // 游戏服务器地址
        //     hasAccount: false, // 是否已创建子游戏账号
        //     remoteData: null, // 服务端发送过来的游戏数据
        //     hallid: 3,
        //     resPath: "/hall/btnanimation/csd_dating",
        //     isDown: false,
        //     gameType: 4, // 游戏类型：棋牌对战：0，刺激投注：1，真人视讯：2，彩票足球：3，街机电玩：4
        //     loginHistory: [], // 子游戏最近一周登陆历史
        // },
    },
    // 大厅配置
    hallConfig: {
        zhname: "大厅", // 中文游戏名
        enname: "hall", // 英文游戏名 （子游戏文件路径，更新子路径）
        lanchscene: "hall", // 跳转场景名
    },
    // 子模块配置列表
    subModel: {
        "pay": {
            zhname: "充值", // 中文名
            enname: "pay", // 英文名 （子游戏文件路径，更新子路径）
            lanchscene: "payRecharge", // 跳转场景名
        },
        "cash": {
            zhname: "提现", // 中文名
            enname: "cash", // 英文名 （子游戏文件路径，更新子路径）
            lanchscene: "payCash", // 跳转场景名
        },
        "im": {
            zhname: "聊天", // 中文名
            enname: "im", // 英文名 （子游戏文件路径，更新子路径）
            lanchscene: "IMappStart", // 跳转场景名
        },
        "proxy": {
            zhname: "全民代理", // 中文名
            enname: "proxy", // 英文名 （子游戏文件路径，更新子路径）
            lanchscene: "proxy-proxy", // 跳转场景名
        },
        "payActivity": {
            zhname: "精彩活动", // 中文名
            enname: "payActivity", // 英文名 （子游戏文件路径，更新子路径）
            lanchscene: "payActivity", // 跳转场景名
        },
    },
    // 老游戏配置列表
    oldGameList: {
        "bjl": {
            zhname: "百家乐",
            enname: "bjl",
            game_id: "5b1f3a3cb76a591e7f2517a5",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
        'brnn': {
            zhname: "百人牛牛",
            enname: "brnn",
            game_id: "5bd00260e847f16fb65a13c1",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
        'hh': {
            zhname: "红黑大战",
            enname: "hh",
            game_id: "5b306af74f435269eea74b94",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
        'ebg': {
            zhname: "二八杠",
            enname: "ebg",
            game_id: "5bd0022be847f16fb65a137d",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
        'lhd': {
            zhname: "龙虎斗",
            enname: "lhd",
            game_id: "5b1f3a98b76a591e7f2517b6",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
        'hbsl': {
            zhname: "红包扫雷",
            enname: "hbsl",
            game_id: "5c5b8c3a7ff09ac117c3a7c2",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
        'ddz': {
            zhname: "斗地主",
            enname: "ddz",
            game_id: "5c6a62be7ff09ac117d446aa",
            remoteData: null,
            hasAccount: false, // 是否已创建子游戏账号
        },
    },
    gameUser: {}, // 中心服返回的玩家信息
}

module.exports = gHandler