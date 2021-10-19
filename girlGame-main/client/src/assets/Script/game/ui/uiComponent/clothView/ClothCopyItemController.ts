// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import ClothCopyItem from "./ClothCopyItem";
import { NodePool } from "../../../../base/res/NodePool";
import ScrollViewPlus from "../common/ScrollViewPlus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ClothCopyItemController extends cc.Component {

    @property(cc.Node)
    node_copy_item: cc.Label = null;

    private nodePool: NodePool = null;
    public nodeList = [];

    private scrollViewPlus: ScrollViewPlus = null;
    private nodeClickFunc = null;
    private firstClick: boolean = true;
    public callBack = null;

    init(clickFunc = null, first = false) {

        this.nodePool = new NodePool();
        this.nodePool.init(this.node_copy_item);
        this.scrollViewPlus = this.node.getComponent(ScrollViewPlus);
        this.nodeClickFunc = clickFunc;
        this.firstClick = first;
    }

    public moveToTargetOffset(offset, timeInSecond, attenuated = true) {
        this.scrollViewPlus.scrollTo(offset, timeInSecond, attenuated);
    }
    async updateAllItems(arr, curArr = null) {
        for (var i = 0; i < this.nodeList.length; i++) {
            this.nodePool.freeNode(this.nodeList[i]);
        }
        this.nodeList.splice(0);
        await this.executePreFrame(this._getItemGenerator(arr, curArr), 1);
        // 在创建好子节点之后，先手动调用一次DC优化，触发当前在可视区域内的节点的进入逻辑
        // 后续的ScrollView滚动时，内部自动回调
        this.scrollViewPlus.optDc();
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

    private *_getItemGenerator(arr, curArr) {
        for (let i = 0; i < arr.length; i++) {
            yield this._initScrollViewItemPrefab(arr[i], arr.length, curArr);
        }
    }
    private _initScrollViewItemPrefab(data, endLength, curArr) {

        let itemNode = this.nodePool.getNode();
        itemNode.parent = this.scrollViewPlus.content;
        itemNode.active = true;
        itemNode.opacity = 255;


        let isChecked = false;
        if (curArr) {
            for (let num of curArr) {
                if (data === num) {
                    //已穿上
                    isChecked = true;
                    break;
                }
            }
        }

        itemNode.getComponent(ClothCopyItem).data = data;
        itemNode.getComponent(ClothCopyItem).setChecked(isChecked);
        itemNode.getComponent(ClothCopyItem).setCallBack(this.nodeClickFunc);



        if (this.firstClick && this.nodeList.length == 0) {
            if (this.nodeClickFunc)
                this.nodeClickFunc(itemNode, data);
        }
        this.nodeList.push(itemNode);
        if (this.nodeList.length == endLength) {
            if (this.callBack)
                this.callBack();
        }
    }
}
