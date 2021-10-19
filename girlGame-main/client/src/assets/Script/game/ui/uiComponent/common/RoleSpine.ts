// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventMgr } from "../../../../base/common/EventManager";
import { resLoader } from "../../../../base/res/ResLoader";
import SysDef from "../../../../util/SysDef";
import { utils } from "../../../../util/Utils";
import ClotheProxy from "../../../data/ClotheProxy";
import { dataManager } from "../../../data/DataManager";
import RenderListItem from "./RenderListItem";



const { ccclass, property } = cc._decorator;

@ccclass
export default class RoleSpine extends RenderListItem {


    private attachUtil = null;
    private spineNodes = [];
    private curScale = 1;

    @property(cc.Boolean)
    self: boolean = true;
    bodyNodes = [];

    private spineNode = null;
    private index = 0;
    private count = 0;
    onLoad() {

        this.initSpine();

        if (this.self) {
            EventMgr.addEventListener(ClotheProxy.clothesWear, this.initSpine, this);
        }
    }

    onDestroy() {
        this.clearClotheSpines();
        this.clearBodySpines();

        if (this.self) {
            EventMgr.removeEventListener(ClotheProxy.clothesWear, this.initSpine, this);
        }

    }


    initSpine() {
        var self = this;
        this.clearClotheSpines();
        this.node.active = false;
        resLoader.loadRes(SysDef.baseBoneUrl, sp.SkeletonData, (error, res) => {
            if (error != null) {
                return;
            }
            self.spineNode = new cc.Node;
            let curRole = self.spineNode.addComponent(sp.Skeleton);
            curRole.skeletonData = res;

            self.spineNode.parent = self.node;
            // self.spineNode.active = false;
            curRole.setAnimation(0, 'animation', true);

            curRole.node.x = 0;
            curRole.node.y = 0;
            //curRole.node.scale = 0.7;
            self.attachUtil = curRole.attachUtil;
            self.attachUtil.generateAllAttachedNodes();
            self.spineNode.scale = self.curScale;
            let bones = self.attachUtil.generateAttachedNodes("R_clavicalis");
            bones[0].zIndex = utils.getBoneIndex('R_clavicalis2');
            //身体
            self.CreateSpineBySpineId(2101, true);
            //右手
            self.CreateSpineBySpineId(2102,true);
            //头
            self.CreateSpineBySpineId(2201);
            if (self.self) {
                self.data = dataManager.clotheProxy.clothesWear;
            } else {
                if (self.data) {
                    self.showData();
                }
            }


        })


    }

    showData() {
        if (this.data != dataManager.clotheProxy.clothesWear) {
            //手动换了衣服，停止监听更新
            EventMgr.removeEventListener(ClotheProxy.clothesWear, this.initSpine, this);
        }
        this.generateSpinesByData();
    }

    generateSpinesByData() {

        if (!this.attachUtil) {
            return false;
        }

        this.clearClotheSpines();
        this.index = 0;
        for (var index in this.data) {
            if (this.data[index] > 0)
                this.count++;
        }
        for (var index in this.data) {
            this.CreateSpineByClothId(this.data[index]);
        }

        this.unscheduleAllCallbacks();
        return true;
    }

    CreateSpineBySpineId(id, base = false) {
        var spineData = dataManager.getSpineData()[id];
        if (!this.attachUtil) {
            return;
        }
        if (!spineData) {
            console.error('CreateSpineBySpineId no spine +  ' + id);
            return;
        }
        for (var i = 0; i < spineData.spine.length; i++) {
            var url = SysDef.spineUrl + spineData.spine[i];
            var self = this;
            let index = i;
            resLoader.loadRes(url, sp.SkeletonData, (error, res) => {
                if (error != null) {
                    return;
                }
                var _node = new cc.Node;
                _node.scale = self.curScale;
                var sps = _node.addComponent(sp.Skeleton);
                sps.skeletonData = res;
                let bones = self.attachUtil.generateAttachedNodes(spineData.solt[index]);
                if(id==2102){

                    _node.zIndex = bones[0].zIndex = utils.getBoneIndex('r_arm');
                }else {

                    _node.zIndex = bones[0].zIndex = utils.getBoneIndex(spineData.solt[index]);

                }
                bones[0].addChild(_node);
                sps.node.x = 0;
                sps.node.y = 0;

                if (!base) {
                    self.spineNodes.push(_node);
                } else {
                    self.bodyNodes.push(_node);
                }

                self.resetAllAnimation();


            });
        }



    }

    CreateSpineByClothId(id, isBase = false) {
        var clothData = dataManager.getAccessorieData()[id];
        if (!clothData) {
            return;
        }
        var spineData = dataManager.getSpineData()[clothData.spine_id];

        if (!spineData) {
            return;
        }

        for (var i = 0; i < spineData.spine.length; i++) {
            var url = SysDef.spineUrl + spineData.spine[i];
            var self = this;
            let index = i;
            resLoader.loadRes(url, sp.SkeletonData, (error, res) => {
                if (error != null) {
                    return;
                }

                try {
                    var _node = new cc.Node;
                    _node.scale = self.curScale;
                    var sps = _node.addComponent(sp.Skeleton);
                    sps.skeletonData = res;
                    let bones = self.attachUtil.generateAttachedNodes(spineData.solt[index]);
                    _node.zIndex = bones[0].zIndex = utils.getBoneIndex(spineData.solt[index]);
                    bones[0].addChild(_node);
                    sps.node.x = 0;
                    sps.node.y = 0;

                    self.spineNodes.push(_node);
                    self.resetAllAnimation();
                    self.index++;
                    if (self.index >= self.count) {
                        self.node.active = true;
                    }
                } catch (error) {
                    console.error(spineData.spine[0] + '   ' + error);
                }


            });
        }

    }


    resetAllAnimation() {
        for (var i = 0; i < this.spineNodes.length; i++) {
            this.spineNodes[i].getComponent(sp.Skeleton).setAnimation(0, 'animation', true);
        }
        for (var i = 0; i < this.bodyNodes.length; i++) {
            this.bodyNodes[i].getComponent(sp.Skeleton).setAnimation(0, 'animation', true);
        }
        this.spineNode.getComponent(sp.Skeleton).setAnimation(0, 'animation', true);
    }

    clearClotheSpines() {
        for (var k = this.spineNodes.length - 1; k >= 0; k--) {
            if (this.spineNodes[k]) {
                this.spineNodes[k].parent = null;
                this.spineNodes[k].destroy();
            }
        }

        this.spineNodes = [];
    }

    clearBodySpines() {
        for (var k = this.bodyNodes.length - 1; k >= 0; k--) {
            if (this.bodyNodes[k]) {
                this.bodyNodes[k].parent = null;
                this.bodyNodes[k].destroy();
            }
        }

        this.bodyNodes = [];
    }





}
