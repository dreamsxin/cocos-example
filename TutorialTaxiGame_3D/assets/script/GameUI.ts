
/**
 * Zy.
 * 2020-09-01.
 * 游戏页UI.
 */

import { _decorator, Component, Node, LabelComponent, SpriteComponent, SpriteFrame, loader, AnimationComponent } from 'cc';
import { Constants } from './Constants';
import { CustomEventListener } from './CustomEventListener';
import { RunTimeData } from './RunTimeData';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: LabelComponent, tooltip: "当前等级.", displayOrder: 1})
    currentLevel: LabelComponent = null;

    @property({type: LabelComponent, tooltip: "目标等级.", displayOrder: 2})
    targetLevel: LabelComponent = null;

    @property({type: SpriteComponent, tooltip: "当前进度.", displayOrder: 3})
    currentSprite: SpriteComponent = null;

    @property({type: SpriteComponent, tooltip: "完成进度.", displayOrder: 4})
    targetSprite: SpriteComponent = null;

    @property({type: SpriteFrame, tooltip: "未完成等级纹理.", displayOrder: 5})
    levelUnFinished: SpriteFrame = null;

    @property({type: SpriteFrame, tooltip: "完成等级纹理.", displayOrder: 6})
    levelFinished: SpriteFrame = null;

    @property({type: SpriteFrame, tooltip: "订单未完成纹理.", displayOrder: 7})
    orderUnCompeteSF: SpriteFrame = null;

    @property({type: SpriteFrame, tooltip: "订单进行中纹理.", displayOrder: 8})
    ordingSF: SpriteFrame = null;

    @property({type: SpriteFrame, tooltip: "订单完成纹理.", displayOrder: 9})
    orderCompeteSF: SpriteFrame = null;

    @property({type: [SpriteComponent], tooltip: "进度.", displayOrder: 10})
    progress: SpriteComponent[] = [];

    @property({type: SpriteComponent, tooltip: "头像.", displayOrder: 11})
    avatar: SpriteComponent = null;

    @property({type: LabelComponent, tooltip: "对话内容.", displayOrder: 12})
    content: LabelComponent = null;

    @property({type: Node, tooltip: "对话节点.", displayOrder: 13})
    talkNode: Node = null;

    @property({type: AnimationComponent, tooltip: "引导动画.", displayOrder: 14})
    guideAni: AnimationComponent = null;

    private _runtimeData: RunTimeData = null;

    start () {
        // Your initialization goes here.
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    public show(...args: any[]) {
        this._runtimeData = RunTimeData.instance();
        this.refreshUI();
        this.showGuideEvent(true);

        CustomEventListener.on(Constants.EventName.GREETING, this.onGreetingEvent, this);
        CustomEventListener.on(Constants.EventName.GOODBYD, this.onGoodbyeEvent, this);
        CustomEventListener.on(Constants.EventName.GAME_END, this.onGameEnd, this);
        CustomEventListener.on(Constants.EventName.SHOW_TALK, this.showTalkingEvent, this);
        CustomEventListener.on(Constants.EventName.SHOW_GUIDE, this.showGuideEvent, this);
    }

    public hide() {
        CustomEventListener.off(Constants.EventName.GREETING, this.onGreetingEvent, this);
        CustomEventListener.off(Constants.EventName.GOODBYD, this.onGoodbyeEvent, this);
        CustomEventListener.off(Constants.EventName.GAME_END, this.onGameEnd, this);
        CustomEventListener.off(Constants.EventName.SHOW_TALK, this.showTalkingEvent, this);
        CustomEventListener.off(Constants.EventName.SHOW_GUIDE, this.showGuideEvent, this);
    }

    private onGreetingEvent() {
        const progress = this.progress[this._runtimeData.maxProgress - 1 - this._runtimeData.currentProgress];
        progress.spriteFrame = this.ordingSF;
    }

    private onGoodbyeEvent() {
        const progress = this.progress[this._runtimeData.maxProgress - this._runtimeData.currentProgress];
        progress.spriteFrame = this.orderCompeteSF;
    }

    private onGameEnd() {
        if (this._runtimeData.currentProgress === this._runtimeData.maxProgress) {
            this.targetSprite.spriteFrame = this.levelFinished;
        }
    }

    private showTalkingEvent(customerID?: number) {
        if (customerID >= 0) {
            const content = Constants.talkTable[Constants.randomNumber(0, Constants.talkTable.length - 1)];
            this.content.string = content;
            this.talkNode.active = true;
            loader.loadRes(`head/head${customerID}/spriteFrame`, SpriteFrame, (err, spf: SpriteFrame) => {
                this.scheduleOnce(() => {
                    this.talkNode.active = false;
                }, 3);
                if (err || !spf) { return console.log(`===> load head/head${customerID}/spriteFrame err: ${err}, spf: `, spf); }
                this.avatar.spriteFrame = spf;
            });
        } else {
            this.content.string = "谢谢师傅，再见。";
            this.talkNode.active = true;
            this.scheduleOnce(() => {
                this.avatar.spriteFrame = null;
                this.talkNode.active = false;
            }, 3);
        }
    }

    private showGuideEvent(isShow: boolean) {
        this.guideAni.node.active = isShow;
        if (isShow) {
            this.guideAni.play("showGuide");
        } else {
            this.guideAni.stop();
        }
    }

    private refreshUI() {
        for (let i = 0; i < this.progress.length; ++i) {
            const progress = this.progress[i];
            if (i >= this._runtimeData.maxProgress) {
                progress.node.active = false;
            } else {
                progress.node.active = true;
                progress.spriteFrame = this.orderUnCompeteSF;
            }
        }
        this.currentLevel.string = "1";
        this.targetLevel.string = "2";
        this.currentSprite.spriteFrame = this.levelFinished;
        this.targetSprite.spriteFrame = this.levelUnFinished;
    }
    
}
