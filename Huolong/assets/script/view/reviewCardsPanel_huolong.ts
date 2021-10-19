import { Button, Component, Label, Node, UITransform, _decorator } from 'cc'
import { MainScene } from './mainScene';

const { ccclass, property, type } = _decorator;

@ccclass('ReviewCardsPanel_Huolong')
export default class ReviewCardsPanel_Huolong extends Component {
    @type(Label)
    labelTitle: Label = null
    @type(Node)
    layout_lastCards: Node = null
    @type(Node)
    layout_self: Node = null
    @type(Node)
    layout_next: Node = null
    @type(Node)
    layout_across: Node = null
    @type(Node)
    layout_back: Node = null
    @type(Button)
    btnOK: Button = null


    onLoad() {
        this.btnOK.node.on(UITransform.EventType.TOUCH_END, this.onBtnOK.bind(this))
    }

    start() {

    }

    // update (dt) {},

    public startShowLastCards(cards: number[]) {
        this.clearAllCards()
        this.labelTitle.string = "底牌"
        for (let c of cards) {
            this.layout_lastCards.addChild(MainScene.getInstance().createCard(c).node)
        }
    }

    public startShowPreviousCards(self: number[], next: number[], across: number[], back: number[]) {
        this.clearAllCards()
        this.labelTitle.string = "上一手"
        for (let c of self) {
            this.layout_self.addChild(MainScene.getInstance().createCard(c).node)
        }
        for (let c of next) {
            this.layout_next.addChild(MainScene.getInstance().createCard(c).node)
        }
        for (let c of across) {
            this.layout_across.addChild(MainScene.getInstance().createCard(c).node)
        }
        for (let c of back) {
            this.layout_back.addChild(MainScene.getInstance().createCard(c).node)
        }
    }


    private onBtnOK() {
        this.node.removeFromParent()
    }

    private clearAllCards() {
        this.layout_lastCards.removeAllChildren()
        this.layout_self.removeAllChildren()
        this.layout_next.removeAllChildren()
        this.layout_across.removeAllChildren()
        this.layout_back.removeAllChildren()
    }

}
