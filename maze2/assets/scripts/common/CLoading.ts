// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { getNumberToZero } from "../components/Utils";
import CAudio from "./CAudio";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CLoading extends cc.Component {

    /** 进度条 */
    progress: cc.ProgressBar = null;
    /** 进度条速度 */
    progressSpeed: number = 3;
    progressValue: number = 0;

    onLoad() {
        let loadingNode = cc.find('Canvas').getChildByName("LoadingMask");
        loadingNode.active = true;
        cc.find("Canvas/Content").active = false;

        //进度条
        this.progress = loadingNode.getChildByName("ProgressBar").getComponent(cc.ProgressBar);
        this.progress.progress = 0;
        //进度
        let progressLabel = loadingNode.getChildByName("loadingLabel").getComponent(cc.Label);
        //加载
        cc.resources.preloadDir('/', (finish: number, total: number, item: cc.AssetManager.RequestItem) => {
            progressLabel.string = getNumberToZero(finish) + ' / ' + getNumberToZero(total);
            // 加载完成
            if (finish == total) {
                this.onLoadComplete();
            }
            this.progressValue = finish / total;
        }, () => { })


    }
    onLoadComplete() {

        cc.director.preloadScene('game', (c, t, i) => {
        })

        //开始按钮
        let enter = cc.find("Canvas/LoadingMask/enter");

        enter.opacity = 255;

        //开始
        enter.once(cc.Node.EventType.TOUCH_END, () => {
            //显示内容
            cc.find("Canvas/Content").active = true;

            //关闭加载
            let loadingNode = cc.find('Canvas').getChildByName("LoadingMask");
            cc.tween(loadingNode).to(0.2, { scale: 0 }, { easing: "backIn" }).start();

            //初始化音频
            CAudio.init();

        })


    }

    start() {

    }

    update(dt) {

        if (this.progress && this.progress.progress != 1 && this.progress.progress<this.progressValue) {
            this.progress.progress += dt * this.progressSpeed;
        }
    }
}
