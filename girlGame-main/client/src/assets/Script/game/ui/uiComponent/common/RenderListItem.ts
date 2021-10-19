import { utils } from "../../../../util/Utils";

const { ccclass, property } = cc._decorator;

/**
 * @classdesc 配合「RenderList」组件使用的RenderListItem组件,也可以单独使用
 * @author caizhitao
 * @version 0.1.0
 * @since 2019-07-12
 * @description
 *
 * 用法：
 *
 *      1. 将本组件挂载在Item节点上
 *
 */

@ccclass
export default class RenderListItem extends cc.Component {


    public _data: any = null;
    public _select: any = null;

    public set data(datas: any) {
        this._data = datas;
        if (null != this._data) {
            this.node.active = true;
            this.showData();
        } else {
            this.node.active = false;
        }

    }

    public get data() {

        return this._data;
    }

    showData() {

    }

    //被选择后的回调,这里显示图片
    public set select(t: Boolean) {

    }

    showNodeAnimation() {
        if (this.node.getComponent(cc.Animation)) {
            utils.showNodeEffect(this.node, 0);
        }
    };

    addBtnEvent(clickEvent: { clickEvents: string | any[]; }) {
        clickEvent &&
            clickEvent.clickEvents &&
            clickEvent.clickEvents.length > 0 &&
            (clickEvent.clickEvents[0].customEventData = this);
    };

    onDestroy() {
        this._data = null;
    }

    setWidthHeigth(width: number, height: number) {

    }
}
