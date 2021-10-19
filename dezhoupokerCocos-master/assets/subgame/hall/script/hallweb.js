

cc.Class({
    extends: cc.Component,

    properties: {
        web: cc.WebView, // 网页
    },

    onLoad() {
        cc.log("web界面")
        // this.web.active = true;
        // this.web.url = "https://www.baidu.com"
        // this.web.onEnable()
        let getIconPath = () => {
            let packageName = hqq.app.packgeName;
            let pathName = packageName + "/images/icon";
            return hqq.app.remoteSeverinfo.source_host[0] + "/" + pathName + "/";
        }

        let info = JSON.stringify({
            id: hqq.gameGlobal.player.id, // 用户ID
            game_id: hqq.oldGameList['brnn'].remoteData.game_id, // 游戏ID
            server_url: hqq.oldGameList['brnn'].remoteData.game_host[0], // game_host
            password: hqq.gameGlobal.player.account_pass // 用户密码
        });
        info = hqq.base64.encode(info);

        let url = hqq.app.remoteSeverinfo.temp_host[0] + hqq.oldGameList['brnn'].remoteData.web_down_webgl +
            "?info=" + info +
            "&os=" + hqq.app.os +
            "&iconPath=" + getIconPath() + // 头像资源地址(图片地址)
            "&version=" + hqq.oldGameList['brnn'].remoteData.version +// 游戏版本号
            "&env=" + "dev" + // 环境 online dev pre
            "&time=" + new Date().getTime();// 时间戳
        cc.log(url)
        this.web.url = url;
        this.web.active = true;
        this.web.onRestore();
        this.web.onEnable();

        cc.log(this.web, this.web.node.x, this.web.node.y)
    },

    start() {

    },

    onClickExit() {
        cc.director.loadScene(hqq.hallConfig.lanchscene)
    },

    // update (dt) {},
});
