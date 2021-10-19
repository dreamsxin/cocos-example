// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { NetNode } from "../../base/network/NetNode";
import { uiManager } from "../../base/ui/UIManager";
import { UIID } from "../ui/UIConfig";
import { ItemType } from "./BagProxy";
import { dataManager } from "./DataManager";
import { ResourceType } from "./PlayerProxy";


const { ccclass } = cc._decorator;

@ccclass
export default class SystemProxy {
    private allRewards: any[];


    private _timezoneServer: any;
    private _timezoneClient: number;
    private _timezoneOffset: number;
    private _timeOfMonday: any;
    private _timeServer: any;
    private _timeClient: number;

    private _second;

    ctor() {

        NetNode.subscribe('time.info', this.setServerTime, this);
        NetNode.subscribe('item.reward', this.addReward, this);

        this.allRewards = [];
    }

    clearData() {
        this.allRewards = [];
    }

    addReward(serverData) {
        if (serverData && serverData.length > 0) {
            this.allRewards.push(serverData);
        }
    }

    floatReward() {
        if (this.allRewards.length > 0) {
            uiManager.open(UIID.UIDropItem, [this.allRewards.pop()]);
        }

    }

    init(zone, serverTime) {
        this.setServerTime(serverTime);
        this._timezoneServer = zone;
        this._timezoneClient = -new Date().getTimezoneOffset() / 60;
        this._timezoneOffset = 3600000 * (this._timezoneClient - this._timezoneServer);
        this._timeOfMonday = this.timeAtHMS(Date.UTC(2015, 11, 28) / 1000);
    };

    setServerTime(t) {
        this._timeServer = Math.floor(t.ctime / 1000);
        this._timeClient = Math.floor(cc.sys.now() / 1000);
    };

    public get second() {
        return (
            this._timeServer + Math.floor(cc.sys.now() / 1000) - this._timeClient
        );
    }


    getTodaySecond(t = 0, e = 0, o = 0) {
        return this.timeAtHMS(this.second, t, e, o);
    };

    timeAtHMS(t, e = 0, o = 0, i = 0) {

        var n = t % 86400,
            l = t - n,
            r = Math.floor(n / 3600);
        if (r + this._timezoneServer < 0) {
            l -= 86400;
        } else if (r + this._timezoneServer >= 24) {
            l += 86400;
        }
        return l + 3600 * (e - this._timezoneServer) + 60 * o + i;
    };

    isSameWeek(t, e) {
        return (
            !(t - e >= 604800) &&
            (t - this._timeOfMonday) / 604800 ==
            (e - this._timeOfMonday) / 604800
        );
    };

    hms2second(t) {
        var e = t.split(":"),
            o = e.length,
            i = 0;
        o > 0 && (i += 3600 * parseInt(e[0]));
        o > 1 && (i += 60 * parseInt(e[1]));
        o > 2 && (i += parseInt(e[2]));
        return i;
    };

    second2hms(t, format) {
        if (t > 86400 && null == format) {
            var o = t % 86400;
            o = Math.floor(o / 3600);
            return (
                Math.floor(t / 86400) + dataManager.GetTextById(415) +
                (o > 0 ?
                    o + dataManager.GetTextById(416) :
                    "")
            );
        }
        var i = Math.floor(t / 3600),
            n = Math.floor((t - 3600 * i) / 60),
            l = t % 60,
            r = format || "HH:mm:ss";
        "HH:mm" == r && t < 60 && (r = "ss");
        return (
            (r = (r = (r = r.replace("HH", this.fix2(i))).replace(
                "mm",
                this.fix2(n)
            )).replace("ss", this.fix2(l))) + ("ss" == r ? "s" : "")
        );
    };


    second2hmsSimple(t) {
        if (t > 86400) {
            return Math.floor(t / 86400) + dataManager.GetTextById(415);
        } else if (t > 3600) {
            return Math.floor(t / 3600) + dataManager.GetTextById(416);
        } else if (t > 60) {
            return Math.floor(t / 60) + dataManager.GetTextById(417);
        } else {
            return t + dataManager.GetTextById(418);
        }
    };

    str2Second(t) {
        var e = t.split(" "),
            o = e[0].split("-"),
            i = e[1].split(":");
        return (
            (new Date(
                Math.floor(parseInt(o[0])),
                Math.floor(parseInt(o[1])) - 1,
                Math.floor(parseInt(o[2])),
                Math.floor(parseInt(i[0])),
                Math.floor(parseInt(i[1])),
                Math.floor(parseInt(i[2]))
            ).getTime() +
                this._timezoneOffset) /
            1e3
        );
    };

    format(t, e) {
        var o = new Date();
        o.setTime(1e3 * t - this._timezoneOffset);
        var i = e || "yyyy-MM-dd HH:mm:ss";
        return (i = (i = (i = (i = (i = (i = i.replace(
            "yyyy",
            o.getFullYear() + ""
        )).replace("MM", this.fix2(o.getMonth() + 1))).replace(
            "dd",
            this.fix2(o.getDate())
        )).replace("HH", this.fix2(o.getHours()))).replace(
            "mm",
            this.fix2(o.getMinutes())
        )).replace("ss", this.fix2(o.getSeconds())));
    };

    fix2(t) {
        return t < 10 ? "0" + t : "" + t;
    };

    getCurMonth() {
        var t = new Date();
        t.setTime(1e3 * this.second - this._timezoneOffset);
        var e = this.fix2(t.getMonth() + 1);
        return parseInt(e);
    };

    getCurData() {
        var t = (this.second - this._timeOfMonday) % 604800;
        return Math.floor(t / 86400) + 1;
    };

    getDateDiff(t) {
        var e = this.second - t;
        let upStr = dataManager.GetTextById(419);
        return e < 0 || e < 60 ?
            dataManager.GetTextById(423) :
            e < 3600 ?
                Math.floor(e / 60) + dataManager.GetTextById(418) + upStr :
                e < 86400 ?
                    Math.floor(e / 3600) + dataManager.GetTextById(417) + upStr :
                    e < 2592000 ?
                        Math.floor(e / 86400) + dataManager.GetTextById(416) + upStr :
                        Math.floor(e / 2592e3) + dataManager.GetTextById(421) + upStr;
    };




}
