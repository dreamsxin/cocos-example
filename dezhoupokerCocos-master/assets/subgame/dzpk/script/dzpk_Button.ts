import { msg } from "./proto/proto_dzpk_msg";
import { events, EventKind } from "./conf/event";
import Storage from "./dzpk_Storage";
import Sound from "./dzpk_Sound";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Node])
    label: cc.Node[] = [];

    // 大盲注金额
    BigBlindMoney: number = 0;
    // 下注num按钮金额
    num1Money: number = 0;
    num2Money: number = 0;
    num3Money: number = 0;
    num4Money: number = 0;
    num5Money: number = 0;

    BetMoney: number = 0; // 用于记录加注动态的筹码

    onLoad() {

    }

    BetButtonClick(eve, num: number) {
        let betButton = cc.find("Canvas/roomScens/dzpk_betButton")
        let check = betButton.getChildByName("dzpk_check").getChildByName("dzpk_yuan2")
        let call = betButton.getChildByName("dzpk_call").getChildByName("dzpk_yuan2")
        let rang = betButton.getChildByName("dzpk_rang").getChildByName("dzpk_yuan2")
        let callAll = betButton.getChildByName("dzpk_callAll").getChildByName("dzpk_yuan2")
        
        console.log("BetButtonClick：",num)
        // 按钮点击
        Sound.PlayAudio(Sound.LoadAudio(13,"0"))
        if (num == 0) {  // check or flod
            if (check.active) {
                check.active = false
                Storage.SelectActionNum = 0;
            }else {
                check.active = true
                Storage.SelectActionNum = 1;
            }
            call.active = false
            rang.active = false
            callAll.active = false
        } else if (num == 1) { // call
            if (call.active) {
                call.active = false
                Storage.SelectActionNum = 0;
            }else {
                call.active = true
                Storage.SelectActionNum = 2;
            }
            check.active = false
            rang.active = false
            callAll.active = false
        } else if (num == 2) { // rangpai
            if (rang.active) {
                rang.active = false
                Storage.SelectActionNum = 0;
            }else {
                rang.active = true
                Storage.SelectActionNum = 3;
            }
            check.active = false
            call.active = false
            callAll.active = false
        } else if (num == 3) { // callAll
            if (callAll.active) {
                callAll.active = false
                Storage.SelectActionNum = 0;
            }else {
                callAll.active = true
                Storage.SelectActionNum = 4;
            }
            check.active = false
            call.active = false
            rang.active = false
        }
    }

    BlindonClick(eve, num: number) {
        // 按钮点击
        Sound.PlayAudio(Sound.LoadAudio(13,"0"))
        if (num == 0) {  // 3xblind
            let money = Storage.RoomData.bigBlind * 3
            money = Number(Storage.ShowAddBet(money))
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: money,
                action: 1,  // 加注
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 1) { // 4xblind
            let money = Storage.RoomData.bigBlind * 4
            money = Number(Storage.ShowAddBet(money))
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 2) { // 1x底注
            let money = Storage.RoomData.potMoney
            money = Number(Storage.ShowAddBet(money))
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 3) { // 3/1底注
            let money = Storage.RoomData.potMoney / 3
            money = Number(Storage.ShowAddBet(money))
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 4) { // 3/2底注
            let money = Storage.RoomData.potMoney / 3
            money = money * 2
            money = Number(Storage.ShowAddBet(money))
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        }
    }

    ActionClick(eve, num: number) {
        // 按钮点击
        Sound.PlayAudio(Sound.LoadAudio(13,"0"))
        if (num == 0) {  // flod
            let dataAction: msg.IPlayerAction_C2S = {
                action: 4, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 1) { // call
            let callMoney = Storage.RoomData.preChips - Storage.PlayerData.lunDownBets
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount:callMoney,
                action: 2, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 2) { // rangpai
            let dataAction: msg.IPlayerAction_C2S = {
                action: 3, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        } else if (num == 3) { // addBet
            console.log("激活加注点击按钮~")
            // 这里要判断加注金额是否为0, 为0则显示加注背景否则发送加注
            let addBetClick = cc.find("Canvas/roomScens/dzpk_addBetClick")
            if (this.BetMoney > 0 && addBetClick.active == true) {
                let money = Number(Storage.ShowAddBet(this.BetMoney))
                if (this.BetMoney >= Storage.PlayerData.chips) {
                    money = Storage.PlayerData.chips
                }
                let dataAction: msg.IPlayerAction_C2S = {
                    betAmount: money,
                    action: 1, 
                }
                events.dispatch(EventKind.C2S_PlayerAction, dataAction);
                this.CloseAddBetAnima()
            }else {
                // 显示下注背景图
                this.ShowAddBetBack()
            }
        } else if (num == 4) { // allIn
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: Storage.PlayerData.chips,
                action: 5, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
        }
    }

    addBetBackClick(eve, num: number) {
        let addBetBack = cc.find("Canvas/roomScens/dzpk_addBetClick/dzpk_addBetBack")
        let addBetAnima = addBetBack.getChildByName("dzpk_addBetAnima").getComponent(cc.Slider)
        let choumadiBack = addBetBack.getChildByName("dzpk_addBetAnima").getChildByName("dzpk_choumadiBack").getComponent(cc.ProgressBar)
        let bgBetMoney = addBetBack.getChildByName("dzpk_bgBetMoney").getChildByName("addMoney")

        let allinAnima = addBetBack.getChildByName("dzpk_allin")
        let choumadi = addBetBack.getChildByName("dzpk_addBetAnima").getChildByName("choumadi")
        // 显示筹码低动画
        // todo 动态获取筹码底的位置，然后来显示筹码动画
        let choumaAnima = addBetBack.getChildByName("dzpk_addBetAnima").getChildByName("dzpk_choumaAnima")
        choumaAnima.position = choumadi.position

        let bigBlind = this.BigBlindMoney 
        let addMoney = Storage.RoomData.preChips + bigBlind - Storage.PlayerData.lunDownBets
        if (num == 0) {  // 点击事件
            this.CloseAddBetAnima()
            if (Storage.RoomData.activeId == Storage.UserInfo.Id) {
                // 显示行动按钮
                let gameNode = cc.find("Canvas").getComponent("dzpk_Game")
                gameNode.ShowActionButton()
            }
        }else if (num == 1) {   // + 加注
            let addBet = this.BetMoney + this.BigBlindMoney 
            if (Storage.PlayerData.chips < addBet) {
                addBetAnima.progress = 1
                choumadiBack.progress = addBetAnima.progress
                this.BetMoney = Storage.PlayerData.chips
                bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(Storage.PlayerData.chips)
                if (Storage.PlayerData.chips > this.BetMoney) {
                    choumaAnima.active = true
                    choumaAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                    allinAnima.active = true
                        allinAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                    setTimeout(() => {
                        choumaAnima.active = false
                    }, 800);
                }
            }else {
                this.BetMoney = this.BetMoney + this.BigBlindMoney 
                let jindu = this.BetMoney / Storage.PlayerData.chips
                addBetAnima.progress = jindu
                choumadiBack.progress = addBetAnima.progress
                bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(this.BetMoney)
                choumaAnima.active = true
                choumaAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                if (this.BetMoney >= Storage.PlayerData.chips) {
                    allinAnima.active = true
                    allinAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                }
                setTimeout(() => {
                    choumaAnima.active = false
                }, 800);
            }
        }else if (num == 2) {  // - 减注
            let minusBet = this.BetMoney - this.BigBlindMoney 
            console.log("BetMoney，BigBlindMoney:",this.BetMoney, this.BigBlindMoney)
            if (Storage.PlayerData.chips < minusBet) { // 判断减注小于最少加注金额时
                addBetAnima.progress = 1
                choumadiBack.progress = addBetAnima.progress
            }else {
                if (minusBet < addMoney) { 
                    let jindu = addMoney / Storage.PlayerData.chips
                    addBetAnima.progress = jindu
                    choumadiBack.progress = addBetAnima.progress
                    this.BetMoney = addMoney
                    if (Storage.PlayerData.chips < this.BetMoney) {
                        bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(Storage.PlayerData.chips)
                    }else{
                        bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(this.BetMoney)
                    }
                }else {
                    this.BetMoney = this.BetMoney - this.BigBlindMoney
                    if (this.BetMoney < addMoney) {
                        this.BetMoney = addMoney
                    }
                    let jindu = this.BetMoney / Storage.PlayerData.chips
                    addBetAnima.progress = jindu
                    choumadiBack.progress = addBetAnima.progress
                    bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(this.BetMoney)
                }
                choumaAnima.active = true
                choumaAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                setTimeout(() => {
                    choumaAnima.active = false
                }, 800);
                allinAnima.active = false
            }
        }else if (num == 3) {  // 滑动筹码
            if (Storage.PlayerData.chips > addMoney) {
                let jindu = addMoney / Storage.PlayerData.chips
                if (addBetAnima.progress < jindu) {
                    addBetAnima.progress = jindu
                    choumadiBack.progress = addBetAnima.progress
                    this.BetMoney = addMoney
                    bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(this.BetMoney)
                    choumaAnima.active = true
                    choumaAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                    allinAnima.active = false
                }else if (addBetAnima.progress == 1) {
                    addBetAnima.progress = 1
                    choumadiBack.progress = addBetAnima.progress
                    this.BetMoney = Storage.PlayerData.chips
                    bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(this.BetMoney)
                    choumaAnima.active = true
                    choumaAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                    allinAnima.active = true
                    allinAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                }else {
                    choumadiBack.progress = addBetAnima.progress
                    this.BetMoney = addBetAnima.progress * Storage.PlayerData.chips
                    bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(this.BetMoney)
                    choumaAnima.active = true
                    choumaAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
                    allinAnima.active = false
                }
                setTimeout(() => {
                    choumaAnima.active = false
                }, 800);
            }else {
                addBetAnima.progress = 1
                choumadiBack.progress = addBetAnima.progress
            }
        }
    }

    addBetNumClick(eve,num: number) {
        if (Storage.RoomData.cfgId == "0") {
            this.num1Money = 1;
            this.num2Money = 2;
            this.num3Money = 4;
            this.num4Money = 10;
            this.num5Money = 20;
        }else if (Storage.RoomData.cfgId == "1") { 
            this.num1Money = 10;
            this.num2Money = 20;
            this.num3Money = 40;
            this.num4Money = 100;
            this.num5Money = 200;
        }else if  (Storage.RoomData.cfgId == "2") { 
            this.num1Money = 50;
            this.num2Money = 100;
            this.num3Money = 200;
            this.num4Money = 500;
            this.num5Money = 1000;
        } else if  (Storage.RoomData.cfgId == "3") {
            this.num1Money = 100;
            this.num2Money = 200;
            this.num3Money = 400;
            this.num4Money = 1000;
            this.num5Money = 2000;
        }
        
        if (num == 0) {  // num1
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: this.num1Money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
            this.CloseAddBetAnima()
        }else if (num == 1) { // num2
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: this.num2Money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
            this.CloseAddBetAnima()
        }else if (num == 2) { // num3
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: this.num3Money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
            this.CloseAddBetAnima()
        }else if (num == 3) { // num4
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: this.num4Money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
            this.CloseAddBetAnima()
        }else if (num == 4) { // num5
            let dataAction: msg.IPlayerAction_C2S = {
                betAmount: this.num5Money,
                action: 1, 
            }
            events.dispatch(EventKind.C2S_PlayerAction, dataAction);
            this.CloseAddBetAnima()
        }
    }

    ShowAddBetBack() {
        // 关闭表情按钮
        let biaoqing = cc.find("Canvas/roomScens/menu/dzpk_biaoqing")
        biaoqing.active = false

        // 关闭其他行动按钮,显示下注界面
        let gameNode = cc.find("Canvas").getComponent("dzpk_Game")
        gameNode.CloseBlindButton()
        gameNode.CloseActionButton()

        if (Storage.RoomData.cfgId == "0") {
            this.BigBlindMoney = 0.2;
        }else if (Storage.RoomData.cfgId == "1"){
            this.BigBlindMoney = 2;
        }else if (Storage.RoomData.cfgId == "2"){
            this.BigBlindMoney = 10;
        }else if (Storage.RoomData.cfgId == "3"){
            this.BigBlindMoney = 50;
        }

        // 显示加注背景图
        let addBetClick = cc.find("Canvas/roomScens/dzpk_addBetClick")
        addBetClick.active = true
        addBetClick.getChildByName("cancelClick").active = true
        addBetClick.getChildByName("dzpk_addBet").active = true
        let addBetBack = addBetClick.getChildByName("dzpk_addBetBack")
        addBetBack.active = true
        // 显示筹码低动画
        let jiantou = addBetBack.getChildByName("dzpk_jiantou")
        jiantou.active = true
        jiantou.getComponent(sp.Skeleton).setAnimation(1, "animation", true)
        
        // 显示筹码滑动条
        let addBetAnima = addBetBack.getChildByName("dzpk_addBetAnima").getComponent(cc.Slider)
        let choumadiBack = addBetBack.getChildByName("dzpk_addBetAnima").getChildByName("dzpk_choumadiBack").getComponent(cc.ProgressBar)
        let bgBetMoney = addBetBack.getChildByName("dzpk_bgBetMoney").getChildByName("addMoney")
        
        let bigBlind = this.BigBlindMoney
        let addMoney = Storage.RoomData.preChips + bigBlind - Storage.PlayerData.lunDownBets
        console.log("preChips,bigBlind,lunDownBets:",Storage.RoomData.preChips,bigBlind,Storage.PlayerData.lunDownBets)
        let jindu = addMoney / Storage.PlayerData.chips
        let money: number = 0
        if (Storage.PlayerData.chips < addMoney) {
            addBetAnima.progress = 1
            choumadiBack.progress = addBetAnima.progress
            money = Storage.PlayerData.chips 
            this.BetMoney = Storage.PlayerData.chips
            let allinAnima = addBetBack.getChildByName("dzpk_allin")
            allinAnima.active = true
            allinAnima.getComponent(sp.Skeleton).setAnimation(1, "animation", false)
        }else {
            addBetAnima.progress = jindu
            choumadiBack.progress = addBetAnima.progress
            money = addMoney 
            this.BetMoney = addMoney
        }
        bgBetMoney.getComponent(cc.Label).string = Storage.ShowAddBet(money)
        
        // 显示加注5个按钮
        this.ShowBetButtonNum(addMoney)
    }

    ShowBetButtonNum(addMoney) {
        let addBetClick = cc.find("Canvas/roomScens/dzpk_addBetClick")
        let addBetNum = addBetClick.getChildByName("dzpk_addBetNum")
        addBetNum.active = true
        let num1 = addBetNum.getChildByName("dzpk_num1")
        let num1Back = addBetNum.getChildByName("dzpk_num1Back")
        let num2 = addBetNum.getChildByName("dzpk_num2")
        let num2Back = addBetNum.getChildByName("dzpk_num2Back")
        let num3 = addBetNum.getChildByName("dzpk_num3")
        let num3Back = addBetNum.getChildByName("dzpk_num3Back")
        let num4 = addBetNum.getChildByName("dzpk_num4")
        let num4Back = addBetNum.getChildByName("dzpk_num4Back")
        let num5 = addBetNum.getChildByName("dzpk_num5")
        let num5Back = addBetNum.getChildByName("dzpk_num5Back")
        num1.active = false
        num1Back.active = false
        num2.active = false
        num2Back.active = false
        num3.active = false
        num3Back.active = false
        num4.active = false
        num4Back.active = false
        num5.active = false
        num5Back.active = false
        if (Storage.RoomData.cfgId == "0") {
            this.BigBlindMoney = 0.2;
            if (Storage.PlayerData.chips > 1) {   // 房间1显示加注按钮
                if (addMoney > 1) {
                    num1Back.active = true
                }else {
                    num1.active = true
                }
                num1.getChildByName("money").getComponent(cc.Label).string = "1.00"
            }else {
                num1Back.active = true
                num1Back.getChildByName("money").getComponent(cc.Label).string = "1.00"
            }
            if (Storage.PlayerData.chips > 2) {
                if (addMoney > 2) {
                    num2Back.active = true
                }else {
                    num2.active = true
                }
                num2.getChildByName("money").getComponent(cc.Label).string = "2.00"
            }else {
                num2Back.active = true
                num2Back.getChildByName("money").getComponent(cc.Label).string = "2.00"
            }
            if (Storage.PlayerData.chips > 4) {
                if (addMoney > 4) {
                    num3Back.active = true
                }else {
                    num3.active = true
                }
                num3.getChildByName("money").getComponent(cc.Label).string = "4.00"
            }else {
                num3Back.active = true
                num3Back.getChildByName("money").getComponent(cc.Label).string = "4.00"
            }
            if (Storage.PlayerData.chips > 10) {
                if (addMoney > 10) {
                    num4Back.active = true
                }else {
                    num4.active = true
                }
                num4.getChildByName("money").getComponent(cc.Label).string = "10.00"
            }else {
                num4Back.active = true
                num4Back.getChildByName("money").getComponent(cc.Label).string = "10.00"
            }
            if (Storage.PlayerData.chips > 20) {
                if (addMoney > 20) {
                    num5Back.active = true
                }else {
                    num5.active = true
                }
                num5.getChildByName("money").getComponent(cc.Label).string = "20.00"
            }else {
                num5Back.active = true
                num5Back.getChildByName("money").getComponent(cc.Label).string = "20.00"
            }
        } else if (Storage.RoomData.cfgId == "1") {   // 房间2显示加注按钮
            this.BigBlindMoney = 2;
            if (Storage.PlayerData.chips > 10) {
                if (addMoney > 10) {
                    num1Back.active = true
                }else {
                    num1.active = true
                }
                num1.getChildByName("money").getComponent(cc.Label).string = "10.00"
            }else {
                num1Back.active = true
                num1Back.getChildByName("money").getComponent(cc.Label).string = "10.00"
            }
            if (Storage.PlayerData.chips > 20) {
                if (addMoney > 20) {
                    num2Back.active = true
                }else {
                    num2.active = true
                }
                num2.getChildByName("money").getComponent(cc.Label).string = "20.00"
            }else {
                num2Back.active = true
                num2Back.getChildByName("money").getComponent(cc.Label).string = "20.00"
            }
            if (Storage.PlayerData.chips > 40) {
                if (addMoney > 40) {
                    num3Back.active = true
                }else {
                    num3.active = true
                }
                num3.getChildByName("money").getComponent(cc.Label).string = "40.00"
            }else {
                num3Back.active = true
                num3Back.getChildByName("money").getComponent(cc.Label).string = "40.00"
            }
            if (Storage.PlayerData.chips > 100) {
                if (addMoney > 100) {
                    num4Back.active = true
                }else {
                    num4.active = true
                }
                num4.getChildByName("money").getComponent(cc.Label).string = "100"
            }else {
                num4Back.active = true
                num4Back.getChildByName("money").getComponent(cc.Label).string = "100"
            }
            if (Storage.PlayerData.chips > 200) {
                if (addMoney > 200) {
                    num5Back.active = true
                }else {
                    num5.active = true
                }
                num5.getChildByName("money").getComponent(cc.Label).string = "200"
            }else {
                num5Back.active = true
                num5Back.getChildByName("money").getComponent(cc.Label).string = "200"
            }
        } else if  (Storage.RoomData.cfgId == "2") {  // 房间3显示加注按钮
            this.BigBlindMoney = 10;
            if (Storage.PlayerData.chips > 50) {
                if (addMoney > 50) {
                    num1Back.active = true
                }else {
                    num1.active = true
                }
                num1.getChildByName("money").getComponent(cc.Label).string = "50.00"
            }else {
                num1Back.active = true
                num1Back.getChildByName("money").getComponent(cc.Label).string = "50.00"
            }
            if (Storage.PlayerData.chips > 100) {
                if (addMoney > 100) {
                    num2Back.active = true
                }else {
                    num2.active = true
                }
                num2.getChildByName("money").getComponent(cc.Label).string = "100"
            }else {
                num2Back.active = true
                num2Back.getChildByName("money").getComponent(cc.Label).string = "100"
            }
            if (Storage.PlayerData.chips > 200) {
                if (addMoney > 200) {
                    num3Back.active = true
                }else {
                    num3.active = true
                }
                num3.getChildByName("money").getComponent(cc.Label).string = "200"
            }else {
                num3Back.active = true
                num3Back.getChildByName("money").getComponent(cc.Label).string = "200"
            }
            if (Storage.PlayerData.chips > 500) {
                if (addMoney > 500) {
                    num4Back.active = true
                }else {
                    num4.active = true
                }
                num4.getChildByName("money").getComponent(cc.Label).string = "500"
            }else {
                num4Back.active = true
                num4Back.getChildByName("money").getComponent(cc.Label).string = "500"
            }
            if (Storage.PlayerData.chips > 1000) {
                if (addMoney > 1000) {
                    num5Back.active = true
                }else {
                    num5.active = true
                }
                num5.getChildByName("money").getComponent(cc.Label).string = "1000"
            }else {
                num5Back.active = true
                num5Back.getChildByName("money").getComponent(cc.Label).string = "1000"
            }
        } else if  (Storage.RoomData.cfgId == "3") {   // 房间4显示加注按钮
            this.BigBlindMoney = 50;
            if (Storage.PlayerData.chips > 100) {
                if (addMoney > 100) {
                    num1Back.active = true
                }else {
                    num1.active = true
                }
                num1.getChildByName("money").getComponent(cc.Label).string = "100"
            }else {
                num1Back.active = true
                num1Back.getChildByName("money").getComponent(cc.Label).string = "100"
            }
            if (Storage.PlayerData.chips > 200) {
                if (addMoney > 200) {
                    num2Back.active = true
                }else {
                    num2.active = true
                }
                num2.getChildByName("money").getComponent(cc.Label).string = "200"
            }else {
                num2Back.active = true
                num2Back.getChildByName("money").getComponent(cc.Label).string = "200"
            }
            if (Storage.PlayerData.chips > 400) {
                if (addMoney > 400) {
                    num3Back.active = true
                }else {
                    num3.active = true
                }
                num3.getChildByName("money").getComponent(cc.Label).string = "400"
            }else {
                num3Back.active = true
                num3Back.getChildByName("money").getComponent(cc.Label).string = "400"
            }
            if (Storage.PlayerData.chips > 1000) {
                if (addMoney > 1000) {
                    num4Back.active = true
                }else {
                    num4.active = true
                }
                num4.getChildByName("money").getComponent(cc.Label).string = "1000"
            }else {
                num4Back.active = true
                num4Back.getChildByName("money").getComponent(cc.Label).string = "1000"
            }
            if (Storage.PlayerData.chips > 2000) {
                if (addMoney > 2000) {
                    num5Back.active = true
                }else {
                    num5.active = true
                }
                num5.getChildByName("money").getComponent(cc.Label).string = "2000"
            }else {
                num5Back.active = true
                num5Back.getChildByName("money").getComponent(cc.Label).string = "2000"
            }
        }
    }

    // 关闭加注画面
    CloseAddBetAnima() {
        // 显示表情按钮
        let biaoqing = cc.find("Canvas/roomScens/menu/dzpk_biaoqing")
        biaoqing.active = true

        this.BetMoney = 0;

        let addBetClick = cc.find("Canvas/roomScens/dzpk_addBetClick")
        addBetClick.getChildByName("dzpk_addBet").active = false
        addBetClick.getChildByName("cancelClick").active = false
        let addBetBack = addBetClick.getChildByName("dzpk_addBetBack")
        addBetBack.active = false

        // 关闭加注背景动画
        let jiantou = addBetBack.getChildByName("dzpk_jiantou")
        jiantou.active = false
        let allinAnima = addBetBack.getChildByName("dzpk_allin")
        allinAnima.active = false
        let choumaAnima = addBetBack.getChildByName("dzpk_addBetAnima").getChildByName("dzpk_choumaAnima")
        choumaAnima.active = false

        let addBetNum = addBetClick.getChildByName("dzpk_addBetNum")
        addBetNum.getChildByName("dzpk_num1").active = false
        addBetNum.getChildByName("dzpk_num1Back").active = false
        addBetNum.getChildByName("dzpk_num2").active = false
        addBetNum.getChildByName("dzpk_num2Back").active = false
        addBetNum.getChildByName("dzpk_num3").active = false
        addBetNum.getChildByName("dzpk_num3Back").active = false
        addBetNum.getChildByName("dzpk_num4").active = false
        addBetNum.getChildByName("dzpk_num4Back").active = false
        addBetNum.getChildByName("dzpk_num5").active = false
        addBetNum.getChildByName("dzpk_num5Back").active = false
    }

    start() {

    }

    // update (dt) {}
}
