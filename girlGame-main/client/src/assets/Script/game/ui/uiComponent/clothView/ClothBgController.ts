// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ScrollViewPlus from "../common/ScrollViewPlus";
import { NodePool } from "../../../../base/res/NodePool";
import ClothBgCopyItem from "./ClothBgCopyItem";
import { dataManager } from "../../../data/DataManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothBgController extends cc.Component {

    @property(ScrollViewPlus)
    srv_bg: ScrollViewPlus = null;

    @property(cc.Node)
    node_copy_bg_item: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    private bgPool: NodePool = null;
    private bgs = null;
    onLoad() {

        this.bgPool = new NodePool();
        this.bgPool.init(this.node_copy_bg_item);
        this.bgPool.setWaterMark(5);
        this.bgs = new Array()
        var bgDatas = dataManager.getAccessorieBgData();
        this.showAllBgs(bgDatas);
    }

    async showAllBgs(arr) {
        await this.executePreFrame(this._getItemGenerator(arr), 1);
        // 在创建好子节点之后，先手动调用一次DC优化，触发当前在可视区域内的节点的进入逻辑
        // 后续的ScrollView滚动时，内部自动回调
        this.srv_bg.optDc();
    }

    /**
     * 分帧执行 Generator 逻辑
     *
     * @param generator 生成器
     * @param duration 持续时间（ms），每次执行 Generator 的操作时，最长可持续执行时长。假设值为8ms，那么表示1帧（总共16ms）下，分出8ms时间给此逻辑执行
     */
    private executePreFrame(generator: Generator, duration: number) {
        return new Promise((resolve, reject) => {
            let gen = generator;
            // 创建执行函数
            let execute = () => {
                // 执行之前，先记录开始时间
                let startTime = new Date().getTime();

                // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
                for (let iter = gen.next(); ; iter = gen.next()) {
                    // 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
                    if (iter == null || iter.done) {
                        resolve();
                        return;
                    }

                    // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
                    if (new Date().getTime() - startTime > duration) {
                        // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
                        this.scheduleOnce(() => {
                            execute();
                        });
                        return;
                    }
                }
            };

            // 运行执行函数
            execute();
        });
    }

    private *_getItemGenerator(arr) {
        for (var i in arr) {
            yield this._initScrollViewItemPrefab(arr[i]);
        }
    }
    private _initScrollViewItemPrefab(data) {
        let itemNode = this.bgPool.getNode();
        itemNode.parent = this.srv_bg.content;
        itemNode.y = 0;
        itemNode.active = true;
        this.bgs.push(itemNode);
        itemNode.getComponent(ClothBgCopyItem).data = data;
        itemNode.getComponent(ClothBgCopyItem).setCallBack(this.onClickClothBgItem);
    }
    onClickClothBgItem(data) {

    }

    onClickCloseBtn() {

        this.updateBgMenu(false);
    }
    updateBgMenu(st) {
        this.node.active = st;
    }
    onDestroy() {
        for (var i in this.bgs) {
            this.bgs[i].destroy();
        }
        this.bgs.splice(0);
        this.bgPool.destory();
    }

}
