
/**
 * Zy.
 * 2020-08-28.
 * 节点池管理.
 */

import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PoolManager')
export class PoolManager {
    
    public static handle = new Map<string, Node[]>();

    /** 获取节点. */
    public static getNode(prefab: Prefab, parent: Node) {
        const name = prefab.name;
        let node: Node = null;
        if (this.handle.has(name)) {
            node = this.handle.get(name).pop();
        } else {
            node = instantiate(prefab);
        }
        node.parent = parent;
        return node;
    }

    /** 放入节点. */
    public static putNode(target: Node) {
        const name = target.name;
        if (this.handle.has(name)) {
            this.handle.get(name).push(target);
        } else {
            this.handle.set(name, [target]);
        }
        target.removeFromParent();
    }

}
