// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {resLoader} from "./base/res/ResLoader";
import {ResUtil} from "./base/res/ResUtil";
import PlayerObject from "./game/actor/PlayerObject";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Test extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    zindex: number = 0;

    private spineUrl:string = "player/suti/nvzhu_test";
    private spineUrl2:string = "player/toufadaigugedonghua/nvzhu";
    private spineUrl3:string = "player/cloth/nvzhu_test";
    // LIFE-CYCLE CALLBACKS:

    public curRole:sp.Skeleton=null;
    // onLoad () {}

    start () {
        // this.initSpine();
        this.node.zIndex = this.zindex;
    }

    initSpine()
    {
        var self = this;

        resLoader.loadRes(this.spineUrl,sp.SkeletonData,(error,res)=>{
            if(error!=null){
                return;
            }
            var _node = new cc.Node;
            self.curRole = _node.addComponent(sp.Skeleton);
            self.curRole.skeletonData = res;
            self.curRole.node.parent = self.node;
            self.curRole.node.x=0;
            self.curRole.node.y=0;
            self.curRole.node.scale = 0.4;
            self.curRole.setAnimation(0,"animation",true);
            resLoader.loadRes(this.spineUrl2,sp.SkeletonData,(error,res)=>{
                if(error!=null){
                    return;
                }
                var _node = new cc.Node;
                var sps = _node.addComponent(sp.Skeleton);
                sps.skeletonData = res;
                // sps.node.parent = self.node;
                // sps.node.x=0;
                // sps.node.y=0;
                // sps.node.scale = 0.4;

                let attachUtil =    self.curRole.attachUtil;
                attachUtil.generateAllAttachedNodes();
                // attachUtil.generateAllAttachedNodes('bone40');
                let bones =  attachUtil.generateAttachedNodes("bone2");
                //     // bones[0].destroyAllChildren();
                bones[0].addChild(_node);
                sps.node.x=0;
                sps.node.y=0;
                // sps.node.scale = 0.4;

                sps.setAnimation(0,"animation",true);
                // resLoader.loadRes(self.spineUrl2,sp.SkeletonData,(error,res)=>{
                //     if(error!=null){
                //         return;
                //     }
                //
                //     var node = new cc.Node;
                //     var newsp = _node.addComponent(sp.Skeleton);
                //
                //     newsp.skeletonData = res;
                //     newsp.setAnimation(0,"animation",true);
                //     // let attachUtil =    self.curRole.attachUtil;
                //     // attachUtil.generateAllAttachedNodes();
                //     //
                //     // // attachUtil.generateAllAttachedNodes('bone40');
                //     // let bones =  attachUtil.generateAttachedNodes("bone2");
                //     // bones[0].destroyAllChildren();
                //     self.curRole.node.addChild(node);
                //     console.log(node);
                //     console.log(this.curRole);
                //     // bones = attachUtil.getAttachedNodes('left_hand_a');
                //     // let node2 = cc.instantiate(node);
                //     // bones[0].destroyAllChildren();
                //     // bones[0].addChild(node2);
                //     //
                //     // bones = attachUtil.getAttachedNodes('right_hand_a');
                //     // let node3 = cc.instantiate(node);
                //     // bones[0].destroyAllChildren();
                //     // bones[0].addChild(node3);
                //     // var _node = new cc.Node;
                //     // var newsp = _node.addComponent(sp.Skeleton);
                //     // // _node.parent = self.node;
                //     // // _node.x=0;
                //     // // _node.y=0;
                //     // // _node.scale = 0.4;
                //     // _node.parent = self.curRole.findBone('root').node;
                //     // _node.x=0;
                //     // _node.y=0;
                //     // _node.scale = 0.4;
                //     // var sl1 = self.curRole.findSlot("Hair")
                //     // var sl2 = newsp.findSlot("Hair")
                //     // // console.log(sl2);
                //     // sl1.setAttachment(sl2.attachment);
                //
                // })

                // resLoader.loadRes(self.spineUrl3,sp.SkeletonData,(error,res)=>{
                //     if(error!=null){
                //         return;
                //     }
                //
                //     var _node = new cc.Node;
                //     var newsp = _node.addComponent(sp.Skeleton);
                //     // _node.parent = self.node;
                //     // _node.x=0;
                //     // _node.y=0;
                //     // _node.scale = 0.4;
                //     newsp.skeletonData = res;
                //     newsp.setAnimation(0,"animation",true);
                //     var sls = newsp.skeletonData.skeletonJson.slots;
                //     for(var i=0;i<sls.length;i++)
                //     {
                //         console.log(sls[i]);
                //         var sl1 = self.curRole.findSlot(sls[i].name)
                //         var sl2 = newsp.findSlot(sls[i].name)
                //         // console.log(sl2);
                //         sl1.setAttachment(sl2.attachment);
                //     }
                //
                //
                // })
            })
            // let attachUtil =    self.curRole.attachUtil;
            // attachUtil.generateAllAttachedNodes();
            // resLoader.loadRes(self.spineUrl2,sp.SkeletonData,(error,res)=>{
            //     if(error!=null){
            //         return;
            //     }
            //
            //     var node = new cc.Node;
            //     var newsp = _node.addComponent(sp.Skeleton);
            //
            //     newsp.skeletonData = res;
            //     newsp.setAnimation(0,"animation",true);
            //     // let attachUtil =    self.curRole.attachUtil;
            //     // attachUtil.generateAllAttachedNodes();
            //     //
            //     // // attachUtil.generateAllAttachedNodes('bone40');
            //     // let bones =  attachUtil.generateAttachedNodes("bone2");
            //     // bones[0].destroyAllChildren();
            //     self.curRole.node.addChild(node);
            //     console.log(node);
            //     console.log(this.curRole);
            //     // bones = attachUtil.getAttachedNodes('left_hand_a');
            //     // let node2 = cc.instantiate(node);
            //     // bones[0].destroyAllChildren();
            //     // bones[0].addChild(node2);
            //     //
            //     // bones = attachUtil.getAttachedNodes('right_hand_a');
            //     // let node3 = cc.instantiate(node);
            //     // bones[0].destroyAllChildren();
            //     // bones[0].addChild(node3);
            //     // var _node = new cc.Node;
            //     // var newsp = _node.addComponent(sp.Skeleton);
            //     // // _node.parent = self.node;
            //     // // _node.x=0;
            //     // // _node.y=0;
            //     // // _node.scale = 0.4;
            //     // _node.parent = self.curRole.findBone('root').node;
            //     // _node.x=0;
            //     // _node.y=0;
            //     // _node.scale = 0.4;
            //     // var sl1 = self.curRole.findSlot("Hair")
            //     // var sl2 = newsp.findSlot("Hair")
            //     // // console.log(sl2);
            //     // sl1.setAttachment(sl2.attachment);
            //
            // })

            // resLoader.loadRes(self.spineUrl3,sp.SkeletonData,(error,res)=>{
            //     if(error!=null){
            //         return;
            //     }
            //
            //     var _node = new cc.Node;
            //     var newsp = _node.addComponent(sp.Skeleton);
            //     // _node.parent = self.node;
            //     // _node.x=0;
            //     // _node.y=0;
            //     // _node.scale = 0.4;
            //     newsp.skeletonData = res;
            //     newsp.setAnimation(0,"animation",true);
            //     var sls = newsp.skeletonData.skeletonJson.slots;
            //     for(var i=0;i<sls.length;i++)
            //     {
            //         console.log(sls[i]);
            //         var sl1 = self.curRole.findSlot(sls[i].name)
            //         var sl2 = newsp.findSlot(sls[i].name)
            //         // console.log(sl2);
            //         sl1.setAttachment(sl2.attachment);
            //     }
            //
            //
            // })
        })

    }

    // update (dt) {}
}
