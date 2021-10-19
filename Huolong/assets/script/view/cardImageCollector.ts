
import { _decorator, Component, Node, SpriteFrame, AudioClip } from 'cc';
import { CardColor } from '../core/enumerator';
import PokerCard from '../core/pokerCard'
const { ccclass, property, type } = _decorator;

@ccclass('CardImageCollector')
export class CardImageCollector extends Component {
    @type(SpriteFrame)
    unknown: SpriteFrame = null
    @type(SpriteFrame)
    blank: SpriteFrame = null
    @type(SpriteFrame)
    joker1: SpriteFrame = null
    @type(SpriteFrame)
    joker2: SpriteFrame = null
    @type([SpriteFrame])
    spades: SpriteFrame[] = []
    @type([SpriteFrame])
    heart: SpriteFrame[] = []
    @type([SpriteFrame])
    cube: SpriteFrame[] = []
    @type([SpriteFrame])
    diamond: SpriteFrame[] = []
    @type([SpriteFrame])
    playerHeadIcons: SpriteFrame[] = []
    @type([AudioClip])
    audios: AudioClip[] = []

    start() {
        // [3]
    }

    // update (deltaTime: number) {
    //     // [4]
    // }


    public getCardImage(id: number): SpriteFrame {
        let color = PokerCard.getColor(id)
        let point = PokerCard.getPoint(id)
        if (id == 0) {
            return this.unknown
        }
        switch (color) {
            case CardColor.joker:
                switch (point) {
                    case 1:
                        return this.joker1
                    case 2:
                        return this.joker2
                }
            case CardColor.spades:
                if (point > 0 && point < 14) {
                    return this.spades[point - 1]
                }
            case CardColor.heart:
                if (point > 0 && point < 14) {
                    return this.heart[point - 1]
                }
            case CardColor.cube:
                if (point > 0 && point < 14) {
                    return this.cube[point - 1]
                }
            case CardColor.diamond:
                if (point > 0 && point < 14) {
                    return this.diamond[point - 1]
                }
        }
        return this.blank
    }

    public getPlayerHeadIcon(id: number): SpriteFrame {
        return this.playerHeadIcons[id]
    }

    public getAudioClip(id: number): AudioClip {
        return this.audios[id]
    }
}

