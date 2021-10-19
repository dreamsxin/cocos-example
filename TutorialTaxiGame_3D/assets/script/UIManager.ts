
/**
 * Zy.
 * 2020-09-01.
 * UI管理.
 */

import { _decorator, Component, Node, find, loader, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager {
    
    static _dicPanel = new Map<string, Node>();

    public static showDialog(name: string, callback?: Function, ...args: any[]) {
        const scriptName = name.substr(0, 1).toUpperCase() + name.substr(1);
        let panel: Node, comp, parent = find("Canvas");
        if (this._dicPanel.has(name)) {
            panel = this._dicPanel.get(name);
            panel.parent = parent;
            comp = panel.getComponent(scriptName);
            // if (comp && comp["show"]) {
            //     comp["show"].apply(args);
            // }
            comp && comp["show"] && comp["show"].apply(comp, args);
            callback && callback();
            return;
        }
        loader.loadRes(`ui/${name}`, Prefab, (err, prefab: Prefab) => {
            if (err || !prefab) { return console.log(`===> load ui/${name} err: ${err}, prefab: `, prefab); }
            panel = instantiate(prefab);
            panel.parent = parent;
            comp = panel.getComponent(scriptName);
            // if (comp && comp["show"]) {
            //     comp["show"].apply(args);
            // }
            comp && comp["show"] && comp["show"].apply(comp, args);
            callback && callback();
            this._dicPanel.set(name, panel);
        });
    }

    public static hideDialog(name: string, callback?: Function) {
        if (this._dicPanel.has(name)) {
            const scriptName = name.substr(0, 1).toUpperCase() + name.substr(1);
            const panel = this._dicPanel.get(name);
            panel.parent = null;
            const comp = panel.getComponent(scriptName);
            comp && comp["hide"] && comp["hide"].apply(comp);
            callback && callback();
        }
    }

}
