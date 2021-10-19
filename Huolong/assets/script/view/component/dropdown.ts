
import { _decorator, Component, Node, EditBox, CCString, CCInteger, ScrollView, Prefab, Button, Label, log, error, instantiate, UITransform, EventHandler, Event, CCBoolean } from 'cc';
import { EDITOR } from 'cc/env';
import { ScrollList } from './scrollList';
const { ccclass, property, type } = _decorator;

@ccclass('Dropdown')
export class Dropdown extends Component {
    @type(Button)
    btn: Button

    @property({ type: ScrollList, visible: false })
    _dropdown_list: ScrollList
    @type(ScrollList)
    get dropdown_list() {
        return this._dropdown_list
    }
    set dropdown_list(value: ScrollList) {
        if (value != null && this._item_node != null && this._item_node.node.parent == value.layout.node) {
            error("ItemNode 不能是 DropDownList 的 Layout 的子节点")
        } else {
            this._dropdown_list = value
            this._resolveValue(true)
        }
    }

    @property({ type: Button, visible: false })
    _item_node: Button
    @type(Button)
    get item_node() {
        return this._item_node
    }
    set item_node(value: Button) {
        if (this._dropdown_list != null && value != null && value.node.parent == this._dropdown_list.layout.node) {
            error("ItemNode 不能是 DropDownList 的 Layout 的子节点")
        } else if (this._item_text != null && value != null && this._item_text.node.parent != value.node) {
            error("ItemText 必须是 ItemNode 的子节点")
        } else {
            while (value.clickEvents.length > 0) {
                value.clickEvents.pop()
            }
            let e = new EventHandler()
            e.target = this.node
            e.component = "Dropdown"
            e.handler = "onSelect"
            value.clickEvents.push(e)
            this._item_node = value
            this._resolveValue(true)
        }
    }

    @property({ type: Label, visible: false })
    _item_text: Label
    @type(Label)
    get item_text() {
        return this._item_text
    }
    set item_text(value: Label) {
        if (this._item_node != null && value != null && value.node.parent != this._item_node.node) {
            error("ItemText 必须是 ItemNode 的子节点")
        } else {
            this._item_text = value
            this._resolveValue(true)
        }
    }

    @property({ type: EditBox, visible: false })
    _edit_box: EditBox
    @type(EditBox)
    get edit_box() {
        return this._edit_box
    }
    set edit_box(value: EditBox) {
        this._edit_box = value
        this._resolveValue(false)
    }

    @property({ type: [CCString], visible: false })
    _items: string[] = []
    @type([CCString])
    get items() {
        return this._items
    }
    set items(value: string[]) {
        this._items = value
        this._resolveValue(true)
    }

    @property({ type: CCInteger, visible: false })
    _index: number = 0
    @type(CCInteger)
    get index() {
        return this._index
    }
    set index(value: number) {
        this._index = value
        this._resolveValue(false)
    }

    @type(CCBoolean)
    get dropping() {
        if (this._dropdown_list != null) {
            return this._dropdown_list.node.active
        }
        return false
    }
    set dropping(value: boolean) {
        if (this._dropdown_list != null) {
            this._dropdown_list.node.active = value
        }
    }

    @property({ type: CCString, readonly: true, })
    get string() {
        if (this._index < 0 || !this._items || this._items.length <= this._index) {
            return ""
        } else {
            return this._items[this._index]
        }
    }

    start() {
        this._resolveValue(true)
        if (!EDITOR) {
            if (this._edit_box != null) {
                this._edit_box.enabled = false
            }
            if (this.btn != null) {
                this.btn.node.on(UITransform.EventType.TOUCH_END, this.onClickDrop.bind(this))
            }
        }
        this.dropping = false
    }

    onFocusInEditor() {
        this._resolveValue(false)
    }

    onLostFocusInEditor() {
        this._resolveValue(false)
    }

    onClickDrop() {
        this.dropping = !this.dropping
    }

    onSelect(event: Event) {
        let value = (event.getCurrentTarget() as Node).getSiblingIndex()
        this.index = value
        this.dropping = false
    }

    private _resolveValue(itemChanged: boolean) {
        if (!this._dropdown_list) {
            this._dropdown_list = null
        }
        if (!this._item_node) {
            this._item_node = null
        } else {
            this._item_node.node.active = false
        }
        if (!this._item_text) {
            this._item_text = null
        }
        if (!this._edit_box) {
            this._edit_box = null
        }
        if (!this._items) {
            this._items = []
        } else {
            for (let i in this._items) {
                if (!this._items[i]) {
                    this._items[i] = ""
                }
            }
        }
        if (this._items.length == 0) {
            this._index = -1
        } else if (this._index < 0) {
            this._index = 0
        } else if (this._index >= this._items.length) {
            this._index = 0
        }
        if (this._edit_box != null) {
            this._edit_box.string = this.string
        }
        if (this._dropdown_list != null && this._item_node != null && this._item_text != null && itemChanged) {
            let index = null
            for (let i in this._item_node.node.children) {
                if (this._item_node.node.children[i] == this._item_text.node) {
                    index = i
                }
            }
            this._dropdown_list.clearItems()
            if (!EDITOR) {
                for (let i = 0; i < this._items.length; ++i) {
                    let newItem = instantiate(this._item_node.node)
                    let newText = newItem.children[index].getComponent(Label)
                    newText.string = this._items[i]
                    newItem.active = true
                    this._dropdown_list.addItem(newItem)
                }
            }
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

