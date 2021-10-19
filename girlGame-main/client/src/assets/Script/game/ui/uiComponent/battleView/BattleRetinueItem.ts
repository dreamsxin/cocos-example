// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


import { dataManager } from "../../../data/DataManager";
import UrlLoad from "../common/UrlLoad";
import RenderListItem from "../common/RenderListItem";
import { uiUtils } from "../../../../util/UIUtils";
import SysDef from "../../../../util/SysDef";
import SpriteframeArr from "../common/SpriteframeArr";
import { NodePool } from "../../../../base/res/NodePool";
import MultiLabel from "../../../../util/MultiLabel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BattleRetinueItem extends RenderListItem {


    @property(UrlLoad)
    spine: UrlLoad = null;

    @property(cc.ProgressBar)
    barHP: cc.ProgressBar = null;

    @property(cc.ProgressBar)
    barHPEnemy: cc.ProgressBar = null;

    @property(UrlLoad)
    urlEffectFront: UrlLoad = null;

    @property(UrlLoad)
    urlEffectBack: UrlLoad = null;

    @property(SpriteframeArr)
    spriteframeArr: SpriteframeArr = null;


    @property(MultiLabel)
    lblName: MultiLabel = null;


    @property(cc.Node)
    node_skillName: cc.Node = null;

    @property(MultiLabel)
    lb_skillName: MultiLabel = null;

    // LIFE-CYCLE CALLBACKS:

    //播放攻击动作后的回调
    private _loadHandle = null;
    private _target = null;
    buffPool: NodePool;
    buffMap: Map<Number, cc.Node>;

    onLoad() {
        this.node.scale = 0.9
        let spine = this.spine.node.getComponent(sp.Skeleton);
        spine.setCompleteListener(this.callbackfun.bind(this));

        let effect = this.urlEffectFront.node.getComponent(sp.Skeleton);
        effect.setCompleteListener(this.callbackEffectFrontfun.bind(this));

        let effect2 = this.urlEffectBack.node.getComponent(sp.Skeleton);
        effect2.setCompleteListener(this.callbackEffectBackfun.bind(this));

        this.buffPool = new NodePool();
        this.buffPool.init(this.urlEffectFront.node);

        this.buffMap = new Map();
    }

    showData() {

        let retinueData = null;
        if (this.data.isNpc) {
            retinueData = dataManager.retinueProxy.getEnemyDataByID(this._data.id);
            this.spine.url = SysDef.getRetinueBattleSpineUrl(retinueData.pic);
            this.lblName.node.color = SysDef.getRetinueNameColor(true);
        } else {
            retinueData = dataManager.retinueProxy.getDataByID(this._data.id);
            this.spine.url = SysDef.getRetinueBattleSpineUrl(retinueData.model);

            this.lblName.node.color = SysDef.getRetinueNameColor(false, retinueData.starLevel);
        }


        if (this._data.enemy) {
            this.spine.node.scaleX = -0.9;
            this.urlEffectBack.node.scaleX = -0.9;
            this.urlEffectFront.node.scaleX = -0.9;
        }
        this.barHPEnemy.progress = this.barHP.progress = this._data.HP / this._data.maxHP;

        this.barHPEnemy.node.opacity = this._data.enemy ? 255 : 0;
        this.barHP.node.opacity = this._data.enemy ? 0 : 255;

        let e = this._data.HP,
            o = this._data.maxHP;

        this.spriteframeArr.index = Math.floor(this._data.energy / 20);

        uiUtils.showPrgChange(this.barHP, this.barHP.progress, e / o);

        this.lblName.string = dataManager.GetTextById(retinueData.name_id);
    }

    callbackEffectFrontfun(trackEntry: any, loopCount: boolean) {
        if (!loopCount) {
            this.urlEffectFront.node.opacity = 0;
        }
    }

    callbackEffectBackfun(trackEntry: any, loopCount: boolean) {
        if (!loopCount) {
            this.urlEffectBack.node.opacity = 0;
        }
    }

    setAttackEndCallBack(call: Function, target: any) {
        this._loadHandle = call;
        this._target = target;
    }

    playAni(name: string, loop: boolean = true) {
        let spine = this.spine.node.getComponent(sp.Skeleton);
        if (spine) spine.setAnimation(0, name, loop);
        if (name == "hit") {
            this.spine.node.color = new cc.Color(230, 103, 130);
            this.scheduleOnce(() => {
                this.spine.node.color = cc.Color.WHITE;
            }, 0.1);
        }
    }

    playEffect(effectFront: number, effectBack: number, repeat: boolean) {
        this.urlEffectBack.animation = 'animation';
        this.urlEffectBack.bRepeat = repeat;
        this.urlEffectBack.node.scale = 1;
        this.urlEffectFront.animation = 'animation';
        this.urlEffectFront.bRepeat = repeat;
        this.urlEffectFront.node.scale = 1;

        this.urlEffectBack.node.opacity = 255;
        this.urlEffectFront.node.opacity = 255;

        if (effectBack >= 0) {
            let url = dataManager.getEffectSpineUrl(effectBack);
            if (url) {
                this.urlEffectBack.url = SysDef.getEffectUrl(url);
                this.urlEffectBack.node.opacity = 255;
            } else {
                console.error('effectBack  ' + effectBack + '  null');
            }
        }

        if (effectFront >= 0) {
            let url = dataManager.getEffectSpineUrl(effectFront);
            if (url) {
                this.urlEffectFront.url = SysDef.getEffectUrl(url);
                this.urlEffectFront.node.opacity = 255;
            }
            else {
                console.error('effectFront  ' + effectBack + '  null');
            }
        }



    }

    showBuff(buffs: any) {
        if (!buffs || buffs.length === 0) {
            this.buffMap.forEach(function (key, node) {
                this.buffPool.freeNode(node);
            });
            this.buffMap.clear();
            return;
        }

        //去掉消失的buff
        this.buffMap.forEach(function (key, node) {
            for (let id of buffs) {
                if (key === id) {
                    return;
                }
            }

            this.buffPool.freeNode(node);
            this.buffMap.delete(key);


        });

        //创建新增的buff
        for (let id of buffs) {
            if (this.buffMap[id]) {
                continue;
            }
            let node = this.buffPool.getNode();
            node.parent = this.node;
            node.opacity = 180;
            this.buffMap[id] = node;

            let url = dataManager.getEffectSpineUrlByBuffId(id);
            let urload = node.getComponent('UrlLoad');

            urload.animation = 'animation';
            urload.bRepeat = true;
            urload.url = SysDef.getEffectUrl(url);

            console.warn('addbuff id= ' + id);
        }



    }

    callbackfun(trackEntry: any, loopCount: boolean) {
        if (!loopCount) {
            if (trackEntry.animation.name === 'into') {
                this.playAni('idle', true);
            }
            else if (trackEntry.animation.name === 'attack' || trackEntry.animation.name === 'skill') {
                this.playAni('idle', true);
                if (this._loadHandle) {
                    this._loadHandle.apply(this._target);
                }
            }
            else if (trackEntry.animation.name === 'hit') {
                this.playAni('idle', true);
            }
        }
    }
    showSkillName(name) {
        this.node_skillName.stopAllActions()
        this.lb_skillName.string = name;
        var zoom1 = cc.scaleTo(0.3, 1.1, 1.1);
        var zoom2 = cc.scaleTo(0.2, 0.95, 0.95);
        var zoom3 = cc.scaleTo(0.1, 1, 1);
        var zoom4 = cc.scaleTo(0.4, 1, 1);
        var zoom5 = cc.scaleTo(0.2, 0, 0);
        var seq = cc.sequence(zoom1, zoom2, zoom3, zoom4, zoom5);
        this.node_skillName.runAction(seq);
    }
    onDestroy() {
        this.buffPool.destory();
    }


}
