import { dataManager } from "../game/data/DataManager";
import { utils } from "./Utils";

export default class UIUtils {

    private shakeArr = [
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1]
    ];

    getDistance(pointA: cc.Vec2 | cc.Vec3, pointB: cc.Vec2 | cc.Vec3) {
        return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
    }


    /*
    com:cc.Component
    width:幅度
    count:次数
    call：回调
    */
    showShake(com: cc.Component, width: number = 4, count: number = 12, call: Function = null) {

        let self = this;

        if (null != com) {

            if (com['orgx']) {
                com.node.x = com['orgx'];
                com.node.y = com['orgy'];
            } else {
                com['orgx'] = com.node.x;
                com['orgy'] = com.node.y;
            }
            com['numIndex'] = 1;
            com.unscheduleAllCallbacks();
            com.schedule(l, 0.04);
            l();
        }

        function l() {
            let l = com['numIndex']++,
                r = (count - l) / count,
                a = l % 4;
            com.node.x = self.shakeArr[a][0] * r * width + com['orgx'];
            com.node.y = self.shakeArr[a][1] * r * width + com['orgy'];
            if (l >= count) {
                com.node.x = com['orgx'];
                com.node.y = com['orgy'];
                com.unscheduleAllCallbacks();
                call && call();
            }
        }
    };

    showShakeNode(node: cc.Node, width: number = 4, count: number = 12, call: Function = null) {
        if (null != node) {
            let n = node.getComponent(cc.Component);
            n && this.showShake(n, width, count, call);
        }
    };

    //进度条动画
    showPrgChange(prg: cc.ProgressBar, start = 0, end = 1, updateBack = null, callback = null, last = 1, frames = 30) {

        if (null != prg) {
            end = null != end ? end : 1;
            prg.progress = start;
            if (start != end) {
                prg['numIndex'] = 1;
                prg.unscheduleAllCallbacks();
                prg.schedule(call, 0.04);
                call();
            }
        }

        function call() {
            let r = prg['numIndex']++,
                a = start + ((end - start) / frames) * ((r % frames) + 1);
            if (a < 0) {
                a = 0;
            }
            if (a > 1) {
                if (end > 1) {
                    a = a - Math.floor(a);
                } else {
                    a = 1;
                }

            }
            prg.progress = a;
            if (r + 1 >= frames * last) {
                prg.unscheduleAllCallbacks();
                callback && callback();
            }

            updateBack && updateBack();
        }
    };

    //label动画
    /*
    textId:读表id
    argIndex:{0}第几个参数
    bChange:true 数字用万 亿结尾
     */
    showNumChange(label: cc.Label, start: number, end: number, frames = 30, textId: number, argIndex: string | number = null, callback: () => any, bChange = true) {

        if (null != label)
            if (start != end) {
                label['numIndex'] = 1;
                label.unscheduleAllCallbacks();
                label.schedule(call, 0.04);
                call();
            } else {
                label['numIndex'] = frames;
                call();
            }

        function call() {
            let count = label['numIndex']++,
                curNum = start + Math.floor(((end - start) / frames) * count);
            curNum = count >= frames ? end : curNum;
            let curStr = bChange ? utils.formatMoney(curNum) : curNum + "";
            if (textId) {
                if (argIndex) {
                    let u = {};
                    u[argIndex] = curStr;
                    curStr = dataManager.GetTextById(textId, u);
                } else {
                    curStr = dataManager.GetTextById(textId) + " " + curStr;
                }
            }

            label.string = curStr;
            if (count >= frames) {
                label.unscheduleAllCallbacks();
                callback && callback();
            }
        }
    };


    //倒计时
    /**
     * 
     * @param endTime 结束时间 秒
     * @param label label组件
     * @param call 结束回调
     * @param addStrIndex text表里的id
     * @param index addStrIndex对应文本里的{index}
     * @param format 格式
     */
    countDown(endTime, label, call, addStrIndex, index = -1, format) {

        if (null != label && 0 != endTime) {
            label.unscheduleAllCallbacks();
            label.schedule(count, 1);
            count();
        }

        function count() {
            var leftTime = endTime - dataManager.systemProxy.second;
            if (leftTime > 0)
                if (index >= 0 && "" != addStrIndex) {
                    var c = {};
                    c[index] = dataManager.systemProxy.second2hms(leftTime, format);
                    label.string = dataManager.GetTextById(addStrIndex, c);
                } else {
                    label.string = (addStrIndex && "" != addStrIndex ? dataManager.GetTextById(addStrIndex) : "")
                        + dataManager.systemProxy.second2hms(leftTime, format);
                }
            else if (leftTime <= 0) {
                call && call();
                label.unscheduleAllCallbacks();
            }
        }
    };
}
export let uiUtils: UIUtils = new UIUtils();
