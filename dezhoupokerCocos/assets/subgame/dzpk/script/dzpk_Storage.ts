import { msg } from "./proto/proto_dzpk_msg"

class NewClass {
    // 玩家信息
    UserInfo: msg.IPlayerInfo = null;
    // 房间数据
    RoomData: msg.IRoomData = null;
    // 玩家数据
    PlayerData: msg.IPlayerData = null;

    SetUserInfo(data: msg.IPlayerInfo) {
        this.UserInfo = data;
    }
    SetPlayerData(data: msg.IPlayerData) {
        this.PlayerData = data;
    }
    SetRoomData(data: msg.IRoomData) {
        this.RoomData = data;
        for (let i = 0; i < this.RoomData.AllPlayer.length; i++) {
            if (this.RoomData.AllPlayer[i] != null && this.RoomData.AllPlayer[i].playerInfo.Id == this.UserInfo.Id) {
                this.PlayerData = this.RoomData.AllPlayer[i]
            }
        }
    }
    GetPlayerData(chair: number): msg.IPlayerData{
        for (let i = 0; i < this.RoomData.playerData.length; i++) {
            if (this.RoomData.playerData[i] != null && this.RoomData.playerData[i].chair == chair) {
                return this.RoomData.playerData[i]
            }
        }
    }

    // 全局玩家房间ID
    ConfigId: string = "-1";

    // 房间列表限制
    RoomLimit: number[] = [10, 50, 300, 1000];

    // 当前玩家移位
    YiWei: number = 0;

    // 玩家行动Button选择
    SelectActionNum: number = 0;  // 0:未选择,1:弃牌,2:跟牌,3:让牌,4:全压 

    // 玩家站起局数
    StandUpNum: number = 0;
    IsNotMoney: boolean = null;

    // 游戏画面
    GameHuaMian: number = 1;  // 列表1,游戏界面2

    // 清楚数据
    ReMoveData() {
        this.UserInfo = null;
        this.RoomData = null;
        this.PlayerData = null;
    }

    // 随机值
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 公用去除小数点后两位方法
     * 使用方法   将数字转换为string
     * let gold = Storage.PlayerData.chips
     * Dtext.string =  gold.replace(dzpk_Storage.decimals, "$1");
     */
    decimals = /([0-9]+.[0-9]{2})[0-9]*/;

    /**
     * 金币数值若小数点后为0,则不显示小数点 
     * 规则：请以后台所显示的金额小数点后第7位四舍五入到第6位，然后截取小数点后二位
     * @param coins 用户金币
     */
    ShowMoney(coins: number): string {
        let coinsStr = coins.toFixed(6);

        if (coinsStr.indexOf('.') > -1) {
            let coinsArr = coinsStr.split('.');
            let decimalStr = coinsArr[1];
            if (Number(decimalStr) == 0) {
                coinsStr = coinsArr[0];
            }
        }
        if (Number(coinsStr) < 0) {
            coinsStr = '0';
        }else{
            //正则 公式      /([0-9]+.[0-9]{2})[0-9]*/;
            coinsStr = coinsStr.replace(this.decimals, "$1")
        }
        return coinsStr;
        // let coinsStr = coins.toFixed(3).slice(0, -1)
        // return coinsStr;
    }
    
    ShowFixed2(coins: number): string {
        let coinsStr = coins.toFixed(2).slice(0, -1)
        let value = Number(coinsStr).toFixed(3).slice(0, -1)
        return value;
    }

    ShowAddBet(coins: number): string {
        let coinsStr = Number(coins).toFixed(3).slice(0, -1)
        return coinsStr;
    }

    // 德州扑克座位转换
    SeatChange(seat: number) :number {
        seat = seat - this.YiWei
        if (seat < 0) {
            seat = seat + 8 + 1
        }
        if (seat > 8) {
            seat = seat - 8 - 1
        }
        return seat;
    }
    
    // 玩家头像加载
    loadSpriteAtlas(node: any, url: string) {
        if (url == '' || url == null) {
            console.log("资源名不能为空！");
            return;
        }

        let index: number = parseInt(url);
        index %= 10;

        console.log("加载玩家头像Number: ",index)

        let spr: cc.Sprite = node.getComponent(cc.Sprite);
        cc.resources.load("head/im_head", cc.SpriteAtlas, function (err, altas) {
            if (err) {
                console.log("图集资源加载失败！");
                console.log("资源路径！", index);
                return;
            }
            spr.spriteFrame = altas.getSpriteFrame("Avatar"+index);
        });
    }

    GetPlayerHead(head: string) {
        let headIndex: string[] = head.split(".");
        let headString: string = headIndex[0]
        return headString 
    }

    /**
     * 切换图片
     * @param node 图片（node节点）
     * @param url  资源地址 "路径加资源名"
     */
    loadSpriteFrame(node: any, url: string) {
        // console.log("显示头像框资源 loadSpriteFrame");
        if (url == '' || url == null) {
            console.log("资源名不能为空！");
            return;
        }
        let spr: cc.Sprite = node.getComponent(cc.Sprite);
        let dzpkRes = cc.assetManager.getBundle("dzpkRes");
        dzpkRes.load(url, cc.SpriteFrame, function (err, spriteFrame) {
            if (err) {
                console.log("资源加载失败！");
                console.log("资源路径！", url);
                return;
            }
            spr.spriteFrame = spriteFrame;
        });
    }
}



export default new NewClass