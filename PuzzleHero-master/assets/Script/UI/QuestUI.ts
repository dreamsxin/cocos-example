import StaticData from "../StaticData";
import GameData from "../GameData";
import UICrl from "../Lib/UI/UICrl";
import WXApi from "../Lib/WXApi";
import Utility from "../Lib/Utility";
import { RewardBox } from "../Mod/PlayerData";
import OpenBoxCrl from "./OpenBoxCrl";
import UIMgr from "../Lib/UI/UIMgr";
import PlayerDataCrl from "../Mod/PlayerDataCrl";
import GameMenuUI from "./GameMenuUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class QuestUI extends cc.Component {

    @property(cc.Node)
    rewardInfo: cc.Node = null

    @property(cc.Node)
    freeRefresh: cc.Node = null

    @property(cc.Node)
    qNode1: cc.Node = null

    @property(cc.Node)
    qNode2: cc.Node = null

    @property(cc.Node)
    qNode3: cc.Node = null

    //任务数据
    taskData: any = null

    refreshTime: number = 0;
    canRefresh: boolean = false;

    getingBounes: boolean = false

    onLoad() { }

    start() {
        let d: any = StaticData.PlayerInfo;
        this.taskData = d.task;
        this.schedule(this.updateRefreshTime, 1)
    }

    onEnable() {
        //task : {flushTime, task}  
        let d: any = StaticData.PlayerInfo;
        this.taskData = d.task;

        let t = new Date().getTime();
        this.refreshTime = Math.floor((this.taskData.flushTime - t) / 1000);

        console.log('this.refreshTime:', this.refreshTime);
        // if(this.refreshTime > 0){
        //     this.freeRefresh.getChildByName('time').active = true;
        //     this.freeRefresh.getChildByName('canUse').active = false;
        // }else{
        //     this.freeRefresh.getChildByName('time').active = false;
        //     this.freeRefresh.getChildByName('canUse').active = true;
        // }

        this.initData();
    }

    initData() {
        this.initRewordInfo();
        this.initQNode();
    }

    //初始化奖励状态栏
    initRewordInfo() {
        let taskArr: any[] = this.taskData.task;
        let done1 = taskArr[0].get;
        let done2 = taskArr[1].get;
        let done3 = taskArr[2].get;

        this.rewardInfo.getChildByName('S1').getChildByName('isDone').active = done1;
        this.rewardInfo.getChildByName('S2').getChildByName('isDone').active = done2;
        this.rewardInfo.getChildByName('S3').getChildByName('isDone').active = done3;

        let allDone = done1 && done2 && done3;
        this.rewardInfo.getChildByName('Chest').getChildByName('isDone').active = allDone;
        this.rewardInfo.getChildByName('getReward').getComponent(cc.Button).interactable = allDone;
    }

    //更新时间
    updateRefreshTime() {
        if (this.canRefresh) { return }
        let t = new Date().getTime();
        this.refreshTime = Math.floor((this.taskData.flushTime - t) / 1000);

        if (this.refreshTime > 0) {
            this.refreshTime--;
            this.canRefresh = false;
            false;
        } else {
            this.canRefresh = true;
            this.initQNode();
        }
    }

    //初始化任务节点
    initQNode() {
        let taskArr: any[] = this.taskData.task;
        for (var i = 0; i < taskArr.length; i++) {
            let id = taskArr[i].id;
            let count = taskArr[i].count;
            let upCount = taskArr[i].upCount;
            let finish = count >= upCount;
            let get = taskArr[i].get;

            let n: cc.Node = this.node.getChildByName('Q' + (i + 1));
            n.getChildByName('information').getChildByName('sign').getChildByName('isDone').active = true;
            let intro: string = GameData.Share.getTaskById(id).intro;
            n.getChildByName('information').getChildByName('intro').getComponent(cc.Label).string = intro.replace('X', upCount.toString());
            let rBtn = n.getChildByName('information').getChildByName('refresh');
            let fBtn = n.getChildByName('information').getChildByName('free');
            let gBtn = n.getChildByName('information').getChildByName('get');
            if (get) {
                rBtn.active = false;
                fBtn.active = false;
                gBtn.active = false;
                this['qNode' + (i + 1)].getChildByName('information').active = false;
                //n.getChildByName('information').getChildByName('sign').getChildByName('isDone').active = false;
            } else {
                this['qNode' + (i + 1)].getChildByName('information').active = true;
                if (finish) {
                    gBtn.active = true;
                    rBtn.active = false;
                    fBtn.active = false;
                } else {
                    gBtn.active = false;
                    fBtn.active = this.canRefresh;
                    rBtn.active = !this.canRefresh;
                }
            }
            n.getChildByName('information').getChildByName('count').getComponent(cc.Label).string = count;
            n.getChildByName('information').getChildByName('request').getComponent(cc.Label).string = upCount;
            n.getChildByName('information').getChildByName('progressBar').getComponent(cc.ProgressBar).progress = count / upCount;
        }
    }

    //刷新任务
    async refreshTask(event, data) {
        let index = Math.floor(data);

        //播放完成动画
        let ani: cc.Animation = this['qNode' + (index + 1)].getChildByName('information').getComponent(cc.Animation);
        let aniClips: cc.AnimationClip[] = ani.getClips();
        ani.play(aniClips[0].name);

        let curArr: number[] = [this.taskData.task[0].id, this.taskData.task[1].id, this.taskData.task[2].id]
        let taskData: any = GameData.Share.getOneTask(curArr);
        let t = {
            id: taskData.id,
            count: 0,
            upCount: Utility.GetRandom(taskData.min, taskData.max),
            get: false
        };
        this.taskData.task[index] = t;

        if (event == null) {
            let rs = await WXApi.HttpPost('/fangkuaiWx/updateTask', this.taskData)
            if (rs.errcode == 200) {
                this.taskData = rs.task;
            }
        } else {
            this.taskData.flushTime = new Date().getTime() + 24 * 3600 * 1000;
            let rs = await WXApi.HttpPost('/fangkuaiWx/updateTask', this.taskData)
            if (rs.errcode == 200) {
                this.taskData = rs.task;
            }
        }

        this.canRefresh = false;
        this.initQNode();
    }
    //看视频 刷新任务
    refreshTaskAd(event, data) {
        let index = Math.floor(data);
        WXApi.OpenAdVideo(() => {
            this.refreshTask(null, index)
        }, WXApi.getUnitid(0));
    }
    //完成任务
    async finishTask(event, data) {
        let index = Math.floor(data);
        let ani = this['qNode' + (index + 1)].getChildByName('information').getComponent(cc.Animation);
        let aniClips = ani.getClips();
        ani.play(aniClips[1].name);
        this['qNode' + (index + 1)].getChildByName('information').getChildByName('get').active = false;

        this.taskData.task[index].get = true;
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateTask', this.taskData);
        if (rs.errcode == 200) {
            this.taskData = rs.task;
        }
        this.scheduleOnce(() => {
            this.initData();
        }, 1)
    }

    //领取
    async getBounes() {
        if (this.getingBounes) return
        this.getingBounes = true

        let tempTime = this.taskData.flushTime;
        let rs = await WXApi.HttpPost('/fangkuaiWx/updateTask', { task: GameData.Share.getThreeTask() });
        if (rs.errcode == 200) {
            this.taskData = rs.task;
            this.taskData.flushTime = tempTime;
        } else {

            this.getingBounes = false
        }
        this.initRewordInfo();
        this.refreshTask(null, 0);
        this.refreshTask(null, 1);
        this.refreshTask(null, 2);
        //请求服务器
        let data = await WXApi.HttpPost("/fangkuaiWx/buyBox", {
            coin: 0,
            gold: 0,
            boxId: 2,
            source: 3
        })
        if (data.errcode != 200) return;

        let boxData = data.property;
        //打开高级宝箱
        let box = new RewardBox()
        box.coin = boxData.coin
        box.cards = boxData.card
        box.heros = boxData.hero
        box.level = 1;
        box.opentimeInv = Number(boxData.opentime)
        box.nkey = Number(boxData.key)
        let ui = (await UIMgr.Share.showUI('GetUI')) as OpenBoxCrl;
        ui.showBox(box)
        PlayerDataCrl.UpdateHeroInfo(data)
        GameMenuUI.Share.refrashUI();
        this.getingBounes = false
    }

    update(dt) {
        if (this.refreshTime >= 0) {
            var time: number = this.refreshTime;
            var h = Math.floor(time / 3600);
            var m = Math.floor((time - h * 3600) / 60);
            var s = Math.floor(time - h * 3600 - m * 60);
            var hStr = h.toString();
            var mStr = m.toString();
            var sStr = s.toString();
            if (h < 10) {
                hStr = '0' + hStr;
            }
            if (m < 10) {
                mStr = '0' + mStr;
            }
            if (s < 10) {
                sStr = '0' + sStr;
            }
            this.freeRefresh.getChildByName('time').getComponent(cc.Label).string = hStr + ':' + mStr + ':' + sStr;
        }
        this.freeRefresh.getChildByName('time').active = this.refreshTime > 0;
        this.freeRefresh.getChildByName('canUse').active = this.refreshTime <= 0;

    }
}
