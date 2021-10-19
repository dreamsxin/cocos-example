// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import CAction from "../../common/CAction";
import CAudio from "../../common/CAudio";
import PrefabPoolNode from "../../components/PrefabPoolNode";
import GlobalGame from "../../global/GlobalGame";
import HomeUI from "./HomeUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomeSelectLevel extends cc.Component {

    @property(cc.ScrollView)
    list: cc.ScrollView = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //可见区域宽度
        let { width } = cc.view.getVisibleSize();
        let childSize = 110; //子节点宽高
        let childCount = Math.floor((width - 50) / (childSize));
        let sum = 200;

        this.list.content.width = childCount * childSize;
        // this.list.content.height = sum/childCount*childSize;
        // this.list.content.getComponent(cc.Layout).spacingX=spacingXY;
        // this.list.content.getComponent(cc.Layout).spacingY=spacingXY;
        // alert(w)
    }

    start() {
        this.generateLevel();
    }

    // update (dt) {}

    /**生成关卡 */
    generateLevel() {

        //按钮监听
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "HomeSelectLevel";
        clickEventHandler.handler = "onPlayGame"

        //生成关卡选项
        cc.resources.load("/prefab/item/SelectLevelItem", cc.Prefab, (err, asset: cc.Prefab) => {
            if (err) {
                cc.error(err)
            }
            let generator = this.generatorNode(clickEventHandler);
            cc.tween(this.node)
                .call(() => {
                    let { done } = generator.next();
                    if (done) cc.tween().stop();
                })
                .delay(0.01)
                .union()
                .repeatForever()
                .start();

        })

      
    }

    /**
     * 
     * @param clickEventHandler 按钮监听
     */
    private *generatorNode(clickEventHandler: cc.Component.EventHandler) {
        for (let i = 0; i < HomeUI.MAX_LEVEL; i++) {
            // let item = cc.instantiate(asset);
            let item = PrefabPoolNode.getPrefabPool('level').getNode();
            this.list.content.addChild(item)
            item.getChildByName('text').getComponent(cc.Label).string = String(i + 1)
            item.getComponent(cc.Button).clickEvents.push(clickEventHandler);
            yield item;
        }
        return;
    }


    //选择关卡后回调
    onPlayGame(event: cc.Event) {

        CAudio.playKeyTone();

        let node: cc.Node = event.target
        let level = node.getChildByName('text').getComponent(cc.Label).string;
        //设置关卡等级
        GlobalGame.setCurrentLevel(parseInt(level));
        CAction.onScene('game')

    }
}
