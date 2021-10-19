// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { UIView } from "../../../base/ui/UIView";
import MultiLabel from "../../../util/MultiLabel";
import { uiManager } from "../../../base/ui/UIManager";
import { UIID } from "../UIConfig";
import UrlLoad from "../uiComponent/common/UrlLoad";
import SysDef from "../../../util/SysDef";
import { utils } from "../../../util/Utils";
import RenderList from "../uiComponent/common/RenderList";
import { EventMgr } from "../../../base/common/EventManager";
import BuyCardProxy from "../../data/BuyCardProxy";
import { dataManager } from "../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyCardView extends UIView {



    @property(sp.Skeleton)
    spine: sp.Skeleton = null;



    @property(cc.Node)
    nodeTen: cc.Node = null;

    @property(cc.Node)
    nodeAni: cc.Node = null;

    //抽卡
    @property([cc.Node])
    nodeDraws: cc.Node[] = [];
    //拖尾粒子
    @property([cc.Node])
    nodeFlys: cc.Node[] = [];
    //展示
    @property([cc.Node])
    nodeShows: cc.Node[] = [];

    @property(sp.Skeleton)
    spineOrange: sp.Skeleton = null;

    @property(UrlLoad)
    urlBody: UrlLoad = null;

    @property([RenderList])
    cardLists: RenderList[] = [];

    @property([UrlLoad])
    urls: UrlLoad[] = new Array(10);
    level: number;
    index: number;
    heroDatas: any;

    init() {

        EventMgr.addEventListener(BuyCardProxy.infoUpdate, this.serverInfoBack, this);

        this.spine.setCompleteListener(this.startShow.bind(this));


        this.nodeTen.active = true;
        this.spine.node.active = false;
        this.nodeAni.active = false;

        this.nodeDraws.forEach(node => {
            let aniCom = node.getComponent(cc.Animation);
            aniCom.on("finished", this.showCard, this);
        });

        this.nodeShows.forEach(node => {
            let aniCom = node.getComponent(cc.Animation);
            aniCom.on("finished", this.showEnd, this);
        });

        this.spineOrange.setCompleteListener(this.startEffect.bind(this));

        this.index = -1;

        this.serverInfoBack();
    }

    onDestroy() {
        EventMgr.removeEventListener(BuyCardProxy.infoUpdate, this.serverInfoBack, this);
    }

    onClickBuyTen() {

        dataManager.buyCardProxy.sendDrawCmd(10);

    }

    serverInfoBack() {
        this.heroDatas = dataManager.buyCardProxy.data.hero;
        if (this.heroDatas.length != 10) {
            console.error('no 10 hero');
            return;
        }

        //this.changeSpineNode();
        this.showTenCard();
    }

    changeSpineNode() {
        this.nodeTen.active = false;
        this.spine.node.active = true;
        this.nodeAni.active = false;
        this.spine.setAnimation(0, 'animation', false);

        this.level = 2;
        this.index = 0;

        for (let i = 0; i < 10; i++) {
            let data = dataManager.retinueProxy.getDataByID(this.heroDatas[i].id);
            this.urls[i].url = SysDef.getRetinuePaintingUrl(data.hero_pic);
            //this.urls[i].node.opacity = 120;
            this.urls[i].node.color = cc.Color.BLACK;
            this.urls[i].node.scale = 0.31 / 1.5;
            this.urls[i].node.angle = 8.5;
            this.urls[i].node.parent.zIndex = 0;
        }
    }

    startShow() {
        this.nodeDraws.forEach(node => {
            node.active = false;
        });
        this.nodeFlys.forEach(node => {
            node.active = false;
        });
        this.nodeShows.forEach(node => {
            node.active = false;
        });

        this.nodeAni.active = true;

        this.urlBody.node.active = false;

        this.level = utils.getRandomInt(0, 2);
        if (this.level !== 2) {
            this.startEffect();
            this.spineOrange.node.active = false;
        } else {
            this.spineOrange.node.active = true;
            this.spineOrange.setAnimation(0, 'animation', false);
        }
    }


    startEffect() {
        this.nodeDraws[this.level].active = true;
        utils.showNodeEffect(this.nodeDraws[this.level], 0);
        let data = dataManager.retinueProxy.getDataByID(this.heroDatas[this.index].id);
        this.urlBody.url = SysDef.getRetinuePaintingUrl(data.hero_pic);
    }

    //显示抽到的卡
    showCard() {

        let flyTime = 1.0;

        this.urlBody.node.active = true;
        this.urlBody.node.position = cc.v3(0, 0, 0);
        this.urlBody.node.scale = 1;

        this.nodeDraws[this.level].active = false;
        this.nodeFlys[this.level * 2].active = true;
        this.nodeFlys[this.level * 2 + 1].active = true;
        utils.showNodeEffect(this.nodeFlys[this.level], 0);

        let worldPos = this.urls[this.index].node.parent.convertToWorldSpaceAR(this.urls[this.index].node.position);
        let nodePos = this.urlBody.node.parent.convertToNodeSpaceAR(worldPos);

        let action = cc.spawn(cc.moveTo(flyTime, nodePos.x, nodePos.y), cc.scaleTo(flyTime, 0.31, 0.31));
        this.urlBody.node.runAction(cc.sequence(action, cc.callFunc(this.showShow, this)));

        this.nodeFlys[this.level * 2].position = cc.v3(0, 0, 0);
        this.nodeFlys[this.level * 2 + 1].position = cc.v3(0, 0, 0);

        let bezier = [cc.v2(-400, nodePos.y / 2), cc.v2(-400, -nodePos.y / 2), cc.v2(nodePos.x, nodePos.y)];
        let actionFly = cc.bezierTo(flyTime, bezier);
        this.nodeFlys[this.level * 2].runAction(actionFly);

        let bezier2 = [cc.v2(400, nodePos.y / 2), cc.v2(400, -nodePos.y / 2), cc.v2(nodePos.x, nodePos.y)];
        let actionFly2 = cc.bezierTo(flyTime, bezier2);
        this.nodeFlys[this.level * 2 + 1].runAction(actionFly2);

    }

    //卡移动到正确位置后，显示特效
    showShow() {
        this.nodeFlys[this.level * 2].active = false;
        this.nodeFlys[this.level * 2 + 1].active = false;
        this.nodeShows[this.level].active = true;
        this.nodeShows[this.level].position = this.urlBody.node.position;
        utils.showNodeEffect(this.nodeShows[this.level], 0);
    }

    //隐藏移动的卡
    showEnd() {
        this.urls[this.index].node.opacity = 255;
        this.urls[this.index].node.color = cc.Color.WHITE;
        this.urls[this.index].node.parent.zIndex = 1 + this.index;
        this.nodeFlys[this.level * 2].active = false;
        this.nodeFlys[this.level * 2 + 1].active = false;
        this.nodeShows[this.level].active = false;
        this.nodeDraws[this.level].active = false;

        this.index++;

        this.nodeAni.active = false;

        if (this.index >= 10) {

            this.scheduleOnce(this.showTenCard, 1);
        }
        else {
            this.startShow();
        }
    }

    showTenCard() {

        this.nodeTen.active = true;
        this.spine.node.active = false;
        this.nodeAni.active = false;
        this.spineOrange.node.active = false;


        this.initTenCard();

    }

    initTenCard() {
        let self = this;
        let setList = ((index, begin, end) => {
            let lists = [];
            for (let i = begin; i <= end; i++) {
                lists.push(self.heroDatas[i]);
            }
            self.cardLists[index].data = lists;
        })

        setList(0, 0, 2);
        setList(1, 3, 6);
        setList(2, 7, 9);
    }




    onClickOK() {

        this.closeSelf();

    }

    onClickClose() {

        this.closeSelf();
        uiManager.open(UIID.UIMain, 1);

    }

    onClickPreview() {

        uiManager.open(UIID.UIRetinuePreview);

    }


    // update (dt) {}
}
