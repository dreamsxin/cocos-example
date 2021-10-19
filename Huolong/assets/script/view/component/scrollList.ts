
import { _decorator, Component, Node, EditBox, CCString, CCInteger, ScrollView, Layout } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property, type } = _decorator;

@ccclass('ScrollList')
export class ScrollList extends ScrollView {
    @type(Layout)
    layout: Layout = null

    start() {
        if (!EDITOR) {
        }
    }

    onFocusInEditor() {

    }

    onLostFocusInEditor() {

    }

    public addItem(item: Node): number {
        if (this.layout != null && item != null) {
            this.layout.node.addChild(item)
            return item.getSiblingIndex()
        }
        return -1
    }

    public removeItem(index: number): Node {
        if (this.layout != null && index >= 0 && index < this.layout.node.children.length) {
            let ret = this.layout.node.children[index]
            this.layout.node.removeChild(ret)
            ret.parent = null
            ret.destroy()
            return ret
        }
        return null
    }

    public clearItems(): void {
        if (this.layout != null) {
            while (this.layout.node.children.length > 0) {
                this.removeItem(0)
            }
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

