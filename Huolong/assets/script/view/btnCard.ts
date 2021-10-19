import { Button, Node, math, Sprite, SpriteFrame, UITransform, _decorator, Component, AudioClip } from 'cc'
import GameMain from '../controller/gameMain';
import PokerCard from '../core/pokerCard'

const { ccclass, property, type } = _decorator;

@ccclass('BtnCard')
export default class BtnCard extends Component {
    @type(Node)
    private imgNode: Node = null
    @type(Sprite)
    private img: Sprite = null
    @type(Button)
    private btn: Button = null
    @type(AudioClip)
    private clickSound: AudioClip = null
    @property({ visible: false })
    private id: number = 0
    @property({ visible: false })
    private enabledClick: boolean = false

    @property({ visible: false })
    private clicked: boolean = false
    @property({ visible: false })
    private callback: Function = null

    public getId() {
        return this.id
    }

    public getPoint() {
        return PokerCard.getPoint(this.id)
    }

    public getGroup() {
        return PokerCard.getGroup(this.id)
    }

    public getColor() {
        return PokerCard.getColor(this.id)
    }

    public getShownData() {
        return new PokerCard(this.getPoint(), this.getColor(), PokerCard.getGroup(this.id))
    }

    public setClickEnabled(enable: boolean) {
        this.enabledClick = enable
    }

    public setImageShow(show: boolean) {
        this.imgNode.active = show
    }

    public setClickCallback(cb: Function) {
        this.callback = cb
    }

    public setCard(id: number, sp: SpriteFrame) {
        this.id = id
        this.img.spriteFrame = sp
        this.btn.normalSprite = sp
        this.btn.pressedSprite = sp
        this.btn.hoverSprite = sp
        this.btn.disabledSprite = sp
    }

    onLoad() {
        this.imgNode.on(UITransform.EventType.TOUCH_START, this.onClick.bind(this))
    }

    start() {
    }

    private onClick() {
        if (this.enabledClick) {
            this.setClicked(!this.clicked)
            if (this.callback) {
                this.callback(this, this.clicked, this.id)
            }
            GameMain.playSound(this.clickSound)
        }
    }

    public setClicked(clicked: boolean) {
        if (this.clicked != clicked) {
            this.clicked = clicked
            this.imgNode.setPosition(math.v3(0, (this.clicked ? 25 : 0), 0))
        }
    }

    public getClicked(): boolean {
        return this.clicked
    }
}
