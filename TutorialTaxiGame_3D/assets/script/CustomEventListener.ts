
/**
 * Zy.
 * 2020-08-20.
 * 自定义事件监听.
 */

import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

/** 事件数据. */
interface IEventData {
    func: Function;
    target: any;
}

/** 事件. */
interface IEvent {
    [eventName: string]: IEventData[];
}

@ccclass('CustomEventListener')
export class CustomEventListener extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    public static handle: IEvent = {};

    /**
     * 事件监听.
     * @param name 事件名称.
     * @param callback 事件回调.
     * @param target 事件目标.
     */
    public static on(name: string, callback: Function, target?: any) {
        if (!this.handle[name]) {
            this.handle[name] = [];
        }
        const data: IEventData = { func: callback, target };
        this.handle[name].push(data);
    }

    /**
     * 事件取消监听.
     * @param name 事件名称.
     * @param callback 事件回调.
     * @param target 事件目标.
     */
    public static off(name: string, callback: Function, target?: any) {
        const list = this.handle[name];
        if (!list || list.length <= 0) { return; }
        for (let i = 0; i < list.length; i++) {
            const event = list[i];
            if (event.func === callback && (!target || event.target === target)) {
                list.splice(i, 1);
                break;
            }
        }
    }

    /**
     * 事件派发.
     * @param name 事件名称.
     */
    public static emit(name: string, ...args: any) {
        const list = this.handle[name];
        if (!list || list.length <= 0) { return; }
        for (let i = 0; i < list.length; i++) {
            const event = list[i];
            event.func.apply(event.target, args);
        }
    }

    start() {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
