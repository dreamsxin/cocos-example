// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import View = cc.View;
import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { NodePool } from "../../../base/res/NodePool";
import { dataManager } from "../../data/DataManager";
import { resLoader } from "../../../base/res/ResLoader";
import { audioManager } from "../../../base/common/AudioManager";
import { utils } from "../../../util/Utils";
import { EventMgr } from "../../../base/common/EventManager";
import EventID from "../../event/EventID";
import Color = cc.Color;
import SysDef from "../../../util/SysDef";
import UrlLoad from "../uiComponent/common/UrlLoad";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import ChapterRecallTextItem from "../uiComponent/plotView/ChapterRecallTextItem";
import data = cc.data;
import SwitchButton from "../uiComponent/common/SwitchButton";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlotView extends UIView {

    @property(UrlLoad)
    spr_role: UrlLoad = null;

    @property(UrlLoad)
    spine_role: UrlLoad = null;

    @property(cc.Node)
    node_cur_mask: cc.Node = null;


    @property(UrlLoad)
    spr_cur_scene_spine: UrlLoad = null;

    @property(UrlLoad)
    spr_cur_scene_bg: UrlLoad = null;


    @property(UrlLoad)
    spr_last_scene_bg: UrlLoad = null;

    @property(cc.Node)
    node_frame: cc.Node = null;

    @property(cc.Node)
    node_role: cc.Node = null;

    @property(cc.Node)
    node_name: cc.Node = null;


    @property(cc.SpriteFrame)
    sf_self: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sf_other: cc.SpriteFrame = null;
    @property(cc.Node)
    spr_content_bg: cc.Node = null;

    @property(cc.Node)
    spr_voiceover_bg: cc.Node = null;

    @property(MultiLabel)
    lb_name: MultiLabel = null;

    @property(cc.RichText)
    lb_content: cc.RichText = null;

    @property(cc.RichText)
    lb_voiceover: cc.RichText = null;


    @property(cc.RichText)
    lb_content_center: cc.RichText = null;

    @property(MultiLabel)
    lbFast: MultiLabel = null;

    @property(cc.Button)
    btnSkip: cc.Button = null;

    @property(cc.Node)
    nodeRecall: cc.Node = null;

    @property(cc.Node)
    listRecall: cc.Node = null;

    @property(ChapterRecallTextItem)
    chapterRecallTextItem: ChapterRecallTextItem = null;


    @property(cc.Node)
    node_animation: cc.Node = null;

    @property(UrlLoad)
    node_sp: UrlLoad = null;

    @property(UrlLoad)
    node_sk: UrlLoad = null;


    @property(SwitchButton)
    sw_auto: SwitchButton = null;

    @property(SwitchButton)
    sw_fast: SwitchButton = null;


    private actionData = null;
    private actionId = 0;
    private storyId = 0;


    private lastSceneId = 0;
    private lastSpeakerId = 0;

    private lastFrameType = 0;
    private isAuto: boolean = false;
    private isClickAuto: boolean = false;
    private isContenAllShowed: boolean = false;
    private isSpeedUp: boolean = false;
    private showContentSpeed: number = 0.06;

    public sectionData = null;

    private bAfter = false;
    private bInMemory = false;
    private canSkip = false;
    private isPlayEffect = false;
    poolRecall: NodePool;
    // LIFE-CYCLE CALLBACKS:
    init() {
        this.nodeRecall.active = false;

        this.poolRecall = new NodePool();
        this.poolRecall.init(this.chapterRecallTextItem.node);


    }

    onDestroy() {
        this.poolRecall.destory();
    }
    // onLoad () {}
    onOpen(fId: number, sectionData) {


        this.bInMemory = false;
        if (sectionData.bInMemory) {
            this.bInMemory = sectionData.bInMemory;
        }


        if (sectionData.bAfter) {
            this.bAfter = true;
            sectionData = sectionData.data;
            this.actionId = sectionData.after_action_id;
        }
        else {
            sectionData = sectionData.data;
            this.actionId = sectionData.before_action_id;
        }
        this.storyId = sectionData.id;


        this.lbFast.string = dataManager.GetTextById(381, 2);
        cc.director.getScheduler().setTimeScale(1);
        this.initAction();

        this.sectionData = sectionData;
        if (this.bAfter) {
            this.canSkip = !this.sectionData.isFirst || this.bInMemory;
        }
        else {
            this.canSkip = this.sectionData.star > 0 || this.bInMemory;
        }
        this.btnSkip.node.opacity = this.canSkip ? 255 : 125;
    }

    initAction() {
        console.log("actionId:" + this.actionId)
        this.actionData = dataManager.storyProxy.getActionData(this.actionId);
        if (this.actionData) {
            this.updateScene(this.actionData.scene_id);

            if (this.updateShowBeforeContent(this.actionData.show_id)) {
                this.updateSpeaker(this.actionData.speaker_id);
                this.updateFrameByType(this.actionData.frame_type);
                this.updateContent(this.actionData.text_id);
                this.updateShowWithContent(this.actionData.show_id);
            }


            this.updateAudio(this.actionData.audio_ids);
        }

    }

    updateScene(id) {
        if (this.lastSceneId == id || id == null)
            return;
        this.lastSceneId = id;
        let sceneData = dataManager.getSceneData()[id];

        this.spr_cur_scene_spine.node.active = false;

        if (sceneData.res_name) {

            if (sceneData) {
                if (sceneData.type == 1) {

                    this.spr_last_scene_bg.url = this.spr_cur_scene_bg.url;
                    this.spr_last_scene_bg.node.opacity = 0;
                    this.spr_cur_scene_bg.url = SysDef.sceneUrl + sceneData.res_name;

                } else if (sceneData.type == 2) {

                    this.spr_cur_scene_spine.node.active = true;

                    this.spr_cur_scene_spine.animation = "animation";
                    this.spr_cur_scene_spine.url = SysDef.sceneUrl + sceneData.res_name;

                }

            }
        }
    }
    updateSpeaker(id) {
        // this.spr_role.node.scale = 1;

        if (id == null) {
            this.spr_role.url = null;
            this.spine_role.url = null;
        }

        if (this.lastSpeakerId == id)
            return;

        this.spr_role.node.active = false;
        this.spine_role.node.active = false;
        if (id) {
            let speaker = dataManager.getSpeakerData()[id];
            if (speaker) {
                this.lb_name.string = dataManager.GetTextById(speaker.name);
                if (this.actionData.show_id != 12)//不显示人物立绘
                {
                    if (speaker.res_name) {
                        if (speaker.type == 1) {
                            this.spr_role.url = SysDef.characterUrl + speaker.res_name;
                            this.spr_role.node.active = true;
                        } else if (speaker.type == 2) {
                            this.spine_role.animation = 'animation';
                            this.spine_role.url = SysDef.characterSpineUrl + speaker.res_name + "/" + speaker.res_name;
                            this.spine_role.node.active = true;
                        }
                    }

                } else {

                    this.spr_role.url = null;
                    this.spine_role.url = null;
                }

            } else {
                this.spr_role.url = null;
                this.spine_role.url = null;
            }
        }

        this.lastSpeakerId = id;


    }

    updateAudio(ids) {
        for (let id in ids) {
            if (dataManager.getAudioData()[ids[id]]) {
                if (dataManager.getAudioData()[ids[id]].type == 1) {
                    audioManager.PlayPlotMusic(dataManager.getAudioData()[ids[id]].res_name)
                } else if (dataManager.getAudioData()[ids[id]].type == 2) {
                    audioManager.PlayEffect(dataManager.getAudioData()[ids[id]].res_name)
                }
            }

        }
    }
    updateFrameByType(type) {
        this.spr_content_bg.active = false;
        this.spr_voiceover_bg.active = false;
        this.lb_content_center.node.active = false;
        this.node_name.active = false;
        if (type) {
            switch (type) {
                case 1:
                    this.spr_content_bg.active = true;
                    this.node_name.active = true;
                    if (this.actionData.speaker_id == 1) {
                        this.node_name.getComponent(cc.Sprite).spriteFrame = this.sf_self;
                    } else {
                        this.node_name.getComponent(cc.Sprite).spriteFrame = this.sf_other;
                    }
                    break;
                case 2:
                    this.spr_voiceover_bg.active = true;
                    this.node_name.active = false;
                    break;
                case 3:
                    this.lb_content_center.node.active = true;
                    break;
            }
            if (this.lastFrameType != type) {



                let fadeIn = cc.fadeIn(0.1);
                let scale = cc.scaleTo(0.1, 1, 1);
                let sp = cc.spawn(fadeIn, scale);
                if (this.spr_content_bg.active) {
                    this.spr_content_bg.stopAllActions();
                    // this.spr_content_bg.scale = 0.9;
                    this.spr_content_bg.runAction(sp);
                }
                else if (this.spr_voiceover_bg.active) {
                    this.spr_voiceover_bg.stopAllActions();
                    // this.spr_voiceover_bg.scale = 0.9;
                    this.spr_voiceover_bg.runAction(sp);
                }
            }
        } else {
            this.isContenAllShowed = true;
        }

        this.lastFrameType = type;

    }
    updateContent(id) {
        this.lb_content.string = '';
        this.lb_voiceover.string = '';
        this.isContenAllShowed = false;
        this.unschedule(this.showContentCallBack);

        if (this.lb_content_center.node.active) {
            this.lb_content_center.string = dataManager.GetTextById(id);

            this.isContenAllShowed = true;
        } else if (this.spr_content_bg.active) {
            utils.showStringOneByOne(this.lb_content, dataManager.GetTextById(id), this.showContentSpeed, this.showContentCallBack.bind(this));
        }
        else if (this.spr_voiceover_bg.active) {
            utils.showStringOneByOne(this.lb_voiceover, dataManager.GetTextById(id), this.showContentSpeed, this.showContentCallBack.bind(this));
        } else {
            this.scheduleOnce(this.showContentCallBack, 2);
        }

    }
    showContentCallBack() {
        this.isContenAllShowed = true;
        if (this.isAuto) {
            setTimeout(() => { this.nextAction(); }, this.isSpeedUp ? 300 : 500);

        }
    }
    onClickPlotBg() {
        if (this.isPlayEffect)
            return;
        if (!this.isAuto) {
            if (!this.isContenAllShowed) {
                if (this.spr_content_bg.active) {
                    this.lb_content.unscheduleAllCallbacks();
                    this.lb_content.string = dataManager.GetTextById(this.actionData.text_id);
                } else {
                    this.lb_voiceover.unscheduleAllCallbacks();
                    this.lb_voiceover.string = dataManager.GetTextById(this.actionData.text_id);
                }

                this.isContenAllShowed = true;

            } else {

                this.nextAction();
            }
        }
    }

    updateShowBeforeContent(id) {
        let st = false;
        this.node_frame.active = false;
        this.node_role.active = false;
        this.isPlayEffect = true;
        switch (id) {
            case 1:
                this.showSceneMaskFadeIn();
                break;

            case 2:
                this.showSceneMaskFadeOut();
                break;

            case 3:
                this.showSceneExchangByAlpha();
                break;

            case 4:
                this.showSceneBlackMask();
                break;

            case 5:
                this.showSceneWhiteMask();
                break;

            case 8:
                this.showRoleBigPic();
                break;
            case 9:
                this.showRoleNormalPic();
                break;

            case 10:
                this.showSceneWhiteMaskSlow();

                break;

            case 11:
                this.showEffect11();

                break;
            case 13:
                this.showEffect13();

                break;

            default:
                st = true;
                this.isPlayEffect = false;
                this.node_role.active = true;
                this.node_frame.active = true;
                break;


        }
        return st;

    }
    updateShowWithContent(id) {
        switch (id) {
            case 6:
                this.showSceneShake();
                break;
            case 7:
                this.showFrameShake();
                break;

        }

    }
    showSceneMaskFadeIn() {
        this.node_cur_mask.stopAllActions();
        this.node_cur_mask.color = Color.BLACK;
        this.node_cur_mask.opacity = 0;
        let fadein = cc.fadeTo(1, 125);
        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });
        let seq = cc.sequence(fadein, callBack);
        this.node_cur_mask.runAction(seq);
    }
    showSceneMaskFadeOut() {

        this.node_cur_mask.stopAllActions();
        this.node_cur_mask.color = Color.BLACK;
        let fadeout = cc.fadeOut(1);
        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });
        let seq = cc.sequence(fadeout, callBack);
        this.node_cur_mask.runAction(seq);
    }
    showSceneExchangByAlpha() {

        this.node_cur_mask.opacity = 0;


        this.spr_last_scene_bg.node.opacity = 255;
        this.spr_cur_scene_bg.node.opacity = 0;

        this.spr_cur_scene_bg.node.stopAllActions();
        this.spr_last_scene_bg.node.stopAllActions();
        let fadein = cc.fadeIn(1);
        let fadeout = cc.fadeOut(1);
        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });
        let seq = cc.sequence(fadein, callBack);
        this.spr_cur_scene_bg.node.runAction(seq);
        this.spr_last_scene_bg.node.runAction(fadeout);
    }
    showSceneBlackMask() {
        this.node_cur_mask.stopAllActions();
        this.node_cur_mask.color = Color.BLACK;
        this.node_cur_mask.opacity = 0;
        let fadein = cc.fadeIn(1);
        let delay = cc.delayTime(0.5);
        let fadeOut = cc.fadeOut(1);
        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });
        let seq = cc.sequence(fadein, delay, fadeOut, callBack);
        this.node_cur_mask.runAction(seq);
    }
    showSceneWhiteMask() {
        this.node_cur_mask.stopAllActions();
        this.node_cur_mask.color = Color.WHITE;
        this.node_cur_mask.opacity = 0;
        let fadein = cc.fadeIn(1);
        let delay = cc.delayTime(0.5);
        let fadeOut = cc.fadeOut(1);
        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });
        let seq = cc.sequence(fadein, delay, fadeOut, callBack);
        this.node_cur_mask.runAction(seq);
    }
    showSceneWhiteMaskSlow() {
        this.node_cur_mask.stopAllActions();
        this.node_cur_mask.color = Color.WHITE;
        this.node_cur_mask.opacity = 0;
        let fadein = cc.fadeIn(1);
        let delay = cc.delayTime(0.5);
        let fadeOut = cc.fadeOut(1.5);
        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });
        let seq = cc.sequence(fadein, delay, fadeOut, callBack);
        this.node_cur_mask.runAction(seq);
    }
    showEffect11() {
        this.node_animation.active = true;
        this.node_sp.node.active = true;
        this.node_sp.url = SysDef.path + "texture/ui/show/effect_11";
        this.node_sp.node.y = 2300;
        this.node_sp.node.width = 2000;
        this.node_sp.node.height = 3000;
        this.node_sp.node.stopAllActions();
        this.spr_last_scene_bg.node.opacity = 255;
        this.spr_cur_scene_bg.node.opacity = 0;
        var move1 = cc.moveTo(1.5, cc.v2(0, 0));
        let callBack1 = cc.callFunc(() => {
            this.spr_last_scene_bg.node.opacity = 0;
            this.spr_cur_scene_bg.node.opacity = 255;
        });
        var move2 = cc.moveTo(1.5, cc.v2(0, -2300));
        let callBack2 = cc.callFunc(() => {
            this.node_animation.active = false;
            this.node_sp.url = null;
            this.node_sp.node.active = false;
            this.showEffectsCallBack()
        });
        let seq = cc.sequence(move1, callBack1, move2, callBack2);
        this.node_sp.node.runAction(seq);
    }
    showEffect13() {
        this.node_animation.active = true;
        this.node_sk.node.active = true;
        this.node_sk.setAnimation('animation', false);
        this.node_sk.url = SysDef.path + "spines/ui_effect/fx_ui_zhandou/fx_ui_zhandou";
        this.node_sk.getComponent(sp.Skeleton).setCompleteListener(() => {
            this.showEffectsCallBack();
            this.node_animation.active = false;
            this.node_sk.url = null;
            this.node_sk.node.active = false;
        })

    }
    showSceneShake() {

        this.spr_cur_scene_bg.node.stopAllActions();
        let l_rotateBy = cc.moveBy(0.05, cc.v2(20, 10));
        let l_rotateBy1 = cc.moveBy(0.1, cc.v2(-20, -10));
        let l_rotateBy2 = cc.moveBy(0.05, 0, 0);
        let rep = cc.repeat(cc.sequence(l_rotateBy, l_rotateBy1, l_rotateBy2), 1.2);
        // let callBack = cc.callFunc(()=>{this.showEffectsCallBack()});
        // let seq = cc.sequence(rep,callBack)
        this.spr_cur_scene_bg.node.runAction(rep);
    }
    showFrameShake() {

        this.node_frame.stopAllActions();
        let l_rotateBy = cc.moveBy(0.05, cc.v2(20, 10));
        let l_rotateBy1 = cc.moveBy(0.1, cc.v2(-20, -10));
        let l_rotateBy2 = cc.moveBy(0.05, 0, 0);
        let rep = cc.repeat(cc.sequence(l_rotateBy, l_rotateBy1, l_rotateBy2), 1.2);
        // let callBack = cc.callFunc(()=>{this.showEffectsCallBack()});
        // let seq = cc.sequence(rep,callBack)
        this.node_frame.runAction(rep);
    }
    showRoleBigPic() {

        this.node_role.active = true;
        this.updateSpeaker(this.actionData.speaker_id);
        this.spr_role.node.stopAllActions();
        this.spine_role.node.stopAllActions();

        let callBack = cc.callFunc(() => { this.showEffectsCallBack() });

        if (this.spr_role.node.active) {
            let scaleTo = cc.scaleTo(0.8, 1.2, 1.2);
            let move1 = cc.moveTo(0.8, cc.v2(0, -200));
            let seq = cc.sequence(cc.spawn(move1, scaleTo), callBack);
            this.spr_role.node.runAction(seq);
        }
        if (this.spine_role.node.active) {

            let scaleTo = cc.scaleTo(0.5, 2, 2);
            let move1 = cc.moveTo(0.5, cc.v2(50, -1250));
            let seq = cc.sequence(cc.spawn(move1, scaleTo), callBack);
            this.spine_role.node.runAction(seq);
        }

    }
    showRoleNormalPic() {

        this.node_role.active = true;
        this.spr_role.node.scale = 1;
        this.spr_role.node.y = 0;
        this.spine_role.node.scale = 1;
        this.spine_role.node.y = -400;
        this.showEffectsCallBack();
    }
    showEffectsCallBack() {
        this.isPlayEffect = false;
        this.node_frame.active = true;
        this.node_role.active = true;
        if (this.actionData.show_id != 8) {
            this.updateSpeaker(this.actionData.speaker_id);
        }
        this.updateFrameByType(this.actionData.frame_type);
        this.updateContent(this.actionData.text_id);
    }

    onClickSkipBtn() {
        if (this.canSkip) {
            this.skipAction();

        } else {
            utils.showTips(dataManager.GetTextById(410));
        }
    }

    // onClickSpeedBtn() {
    //
    //     // this.isSpeedUp = !this.isSpeedUp;
    //     // if (this.isSpeedUp) {
    //     //     this.showContentSpeed *= 3;
    //     // } else {
    //     //
    //     //     this.showContentSpeed /= 3;
    //     // }
    //
    // }
    onClickAutoBtn() {
        this.isClickAuto = !this.isClickAuto;
        if (this.isSpeedUp) {
            this.lbFast.string = dataManager.GetTextById(381, 2);
            this.showContentSpeed *= 2;
            this.isSpeedUp = !this.isSpeedUp;
            this.sw_fast.onClickHandle();
        }
        if (this.isClickAuto) {

            this.isAuto = true;
        } else
            this.isAuto = false;
        if (this.isContenAllShowed) {

            this.nextAction();
        }

    }


    onClickFastBtn() {

        if (this.isClickAuto) {
            this.isClickAuto = false;
            this.sw_auto.onClickHandle();
        } else {
            if (!this.isAuto) {

                this.isAuto = true;
                if (this.isContenAllShowed) {

                    this.nextAction();
                }
            } else {

                this.isAuto = false;
            }
        }

        this.isSpeedUp = !this.isSpeedUp;
        if (this.isSpeedUp) {
            this.lbFast.string = dataManager.GetTextById(381, 1);
            this.showContentSpeed /= 2;
        } else {
            this.lbFast.string = dataManager.GetTextById(381, 2);
            this.showContentSpeed *= 2;
        }

    }

    onClickReviewBtn() {
        this.nodeRecall.active = true;
        this.chapterRecallTextItem.node.active = false;

        let story = dataManager.storyProxy.getSectionData(this.storyId);

        this.poolRecall.freeAllNode();

        let normalColor = '<color=#FDF0E6>';
        let selfColor = '<color=#F2A0AE>';
        let otherColor = '<color=#94BAE6>';

        let end = '</color> \n';


        let makeStr = ((actionData) => {
            let str = '';
            if (actionData.frame_type == 1) {
                if (actionData.speaker_id === 1) {
                    //自己
                    str += selfColor;
                    str += dataManager.GetTextById(dataManager.getSpeakerData()[actionData.speaker_id].name);
                    str += end;
                }
                else if (actionData.speaker_id) {

                    let speaker = dataManager.getSpeakerData()[actionData.speaker_id];
                    str += otherColor;
                    str += dataManager.GetTextById(speaker.name);
                    str += end;
                }
            }


            if (actionData.text_id) {
                str += normalColor;
                str += dataManager.GetTextById(actionData.text_id);
                str += end;
            }
            return str;
        })

        let createTextNode = ((actionData, self) => {
            if (!actionData) {
                return;
            }
            let node = self.poolRecall.getNode();
            node.getComponent(cc.RichText).string = makeStr(actionData);
            node.parent = self.listRecall;
            node.active = true;
        })

        let actionData = dataManager.storyProxy.getActionData(story.before_action_id);
        createTextNode(actionData, this);
        while (actionData && actionData.next_id != null && actionData.id != this.actionId) {
            actionData = dataManager.storyProxy.getActionData(actionData.next_id);
            createTextNode(actionData, this);
        }
        if (story.after_action_id && story.after_action_id < this.actionId) {
            actionData = dataManager.storyProxy.getActionData(story.after_action_id);
            createTextNode(actionData, this);
            while (actionData && actionData.next_id != null && actionData.id != this.actionId) {
                actionData = dataManager.storyProxy.getActionData(actionData.next_id);
                createTextNode(actionData, this);
            }
        }
    }

    onClickCloseBtn() {
        if (this.nodeRecall.active) {
            this.nodeRecall.active = false;
        } else {
            this.closeSelf();
        }
    }

    onClickBackBtn() {
        if (this.nodeRecall.active) {
            this.nodeRecall.active = false;
        } else {
            this.actionsEnd();
        }
    }

    onClose() {
        cc.director.getScheduler().setTimeScale(1);
        audioManager.stopPlotBGMusic();
    }


    nextAction() {

        let action = dataManager.storyProxy.getActionData(this.actionId);
        if (action) {
            if (action.next_id) {
                this.actionId = action.next_id;
                this.initAction();
            } else {


                //this.checkStep();

                this.actionsEnd();
            }
        }

    }

    skipAction() {
        if (this.bInMemory) {
            this.onClickCloseBtn();
        } else {
            this.actionsEnd();
        }
    }


    playStoryEndAni(bFirst) {


        utils.showNodeEffect(this.node, 1, () => {
            if (bFirst) {
                this.storyFirstEnd()
            } else {
                this.storyReEnd()
            }
        });
    }

    storyReEnd() {
        //因为重新战斗过了，所以这里要加跳转
        uiManager.open(UIID.UIChapter, this.sectionData.id);
        this.onClickCloseBtn();
    }

    storyFirstEnd() {
        this.onClickCloseBtn();
        uiManager.open(UIID.UIChapter);
    }


    actionsEnd() {

        if (this.sectionData.star === 0 && !this.bAfter) {

            if (this.sectionData.task_accessorie) {
                uiManager.open(UIID.UICloth, this.sectionData.id);
                this.onClickCloseBtn();
            } else if (this.sectionData.task_fight) {
                uiManager.open(UIID.UIBattle, this.sectionData);
                this.onClickCloseBtn();
            } else {
                dataManager.storyProxy.sendOverCmd(this.sectionData.id);
                this.playStoryEndAni(true);
            }


        } else if (this.sectionData.star === 0 && this.bAfter) {
            this.onClickCloseBtn();
        }
        else if (this.sectionData.star > 0) {

            if (!this.bAfter) {
                if (this.bInMemory) {
                    this.bAfter = true;
                    //回忆,跳过战斗和配装
                    this.actionId = this.sectionData.after_action_id;
                    if (this.actionId) {
                        this.initAction();
                    }
                    else {
                        this.onClickCloseBtn();
                    }
                }
                else {
                    //重复战斗，配装
                    if (this.sectionData.task_accessorie) {
                        uiManager.open(UIID.UICloth, this.sectionData.id);
                        this.onClickCloseBtn();
                    } else if (this.sectionData.task_fight) {
                        uiManager.open(UIID.UIBattle, this.sectionData);
                        this.onClickCloseBtn();
                    }
                    else {
                        this.playStoryEndAni(false);
                    }
                }
            }
            else {
                this.playStoryEndAni(false);
            }
        }


        // update (dt) {}
    }
}
