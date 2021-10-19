
/**
 * Zy.
 * 2020-08-20.
 * 常量定义.
 */

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constants')
export class Constants {
    /** 事件名称. */
    public static EventName = {
        /** 接客. */
        GREETING: "GREETING",
        /** 送客. */
        GOODBYD: "GOODBYD",
        /** 走路完成. */
        FININSHED_WALK: "FININSHED_WALK",
        /** 开始刹车. */
        START_BRAKING: "START_BRAKING",
        /** 结束刹车. */
        END_BRAKING: "END_BRAKING",
        /** 显示金币. */
        SHOW_COIN: "SHOW_COIN",
        /** 游戏开始. */
        GAME_START: "GAME_START",
        /** 游戏结束. */
        GAME_OVER: "GAME_OVER",
        /** 到达终点. */
        GAME_END: "GAME_END",
        /** newLevel. */
        NEW_LEVEL: "NEW_LEVEL",
        /** 显示对话. */
        SHOW_TALK: "SHOW_TALK",
        /** 显示引导. */
        SHOW_GUIDE: "SHOW_GUIDE",
    };

    /** 乘客状态. */
    public static CustomerState = {
        NONE: 0,
        /** 接客. */
        GREETING: 1,
        /** 送客. */
        GOODBYD: 2,
    };

    /** 音频资源. */
    public static AudioSource = {
        /** 背景音乐. */
        BACKGROUND: "background",
        /** 按钮点击. */
        CLICK: "click",
        /**. */
        CRASH: "crash",
        /** 金币. */
        GETMONEY: "getMoney",
        /** 关闭车门. */
        INCAR: "inCar",
        /** 新订单. */
        NEWORDER: "newOrder",
        /** 开始. */
        START: "start",
        /** 刹车. */
        STOP: "stop",
        /** . */
        TOOTING1: "tooting1",
        /** . */
        TOOTING2: "tooting2",
        /** 胜利. */
        WIN: "win",
    };

    /** 小车分组. */
    public static CarGroup = {
        NORMAL: 1 << 0,
        MAIN_CAR: 1 << 1,
        OTHER_CAR: 1 << 2,
    };

    /** 乘客对话. */
    public static talkTable = [
        "你好，去高崎机场。\n麻烦快一点，我赶飞机。",
        "师傅，去师大仓山校区，谢谢。",
        "城关鲤中步行街，谢谢。"
    ];

    /** UI页面. */
    public static UIPage = {
        mainUI: "mainUI",
        gameUI: "gameUI",
        resultUI: "resultUI",
    };

    /**
     * 随机一个整数，取值区间[min, max]
     * @param min 最小值
     * @param max 最大值
     */
    public static randomNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}
