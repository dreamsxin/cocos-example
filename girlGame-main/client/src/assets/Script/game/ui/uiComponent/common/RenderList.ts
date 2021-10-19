import { ExecuteAsync } from "../../../../util/ExecuteAsync";
import RenderListItem from "./RenderListItem";

const { ccclass, property } = cc._decorator;

/**
 * @classdesc 配合「List」组件使用的RenderListItem组件
 * @author caizhitao
 * @version 0.1.0
 * @since 2019-07-12
 * @description
 *
 * 用法：
 *
 *      1. 将本组件挂载在节点上即可，和正常ScrollView使用一致
 *
 */

@ccclass
export default class RenderList extends cc.Component {

    private _data: any[] = null;
    private _renders: any[] = null;
    private _itemHeight: number = 0;
    private _itemWidth: number = 0;
    private _selectHandle = null;
    private _selectIndex = -1;
    private lastIndex: number = 0;

    @property(cc.Node)
    node_tips: cc.Node = null;
    //和本节点同步宽高，可不填
    @property(cc.Node)
    content: cc.Node = null;

    //item与itemPrefab互斥
    @property(RenderListItem)
    item: RenderListItem = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    //对应的ScrollView，可不填
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    //最大render数量,为0会按照数据数量创建render。
    @property(cc.Integer)
    bufferZone: number = 0;

    //x轴并列数量
    @property(cc.Integer)
    repeatX: number = 1;

    //类似layout
    @property(cc.Integer)
    spaceX: number = 0;
    @property(cc.Integer)
    spaceY: number = 0;
    @property(cc.Integer)
    paddingTop: number = 0;
    @property(cc.Integer)
    paddingBottom: number = 0;
    @property(cc.Integer)
    paddingLeft: number = 0;
    @property(cc.Integer)
    paddingRight: number = 0;

    /**
     * 单个render在创建完成后是否立即显示
     * true:立即显示,
     * false：所有render创建完成后一起显示
     * */
    @property(cc.Boolean)
    isDelayRefresh: Boolean = false;

    /**
     * 是否同步刷新所有render
     * true:同步创建所有renders
     * false:异步创建所有render
     * */
    @property(cc.Boolean)
    isSynchronizedUpdating: Boolean = false;

    @property(cc.Boolean)
    isReverY: Boolean = false;

    //是否是单排
    @property(cc.Boolean)
    isHorizonList: Boolean = false;

    //在render初始化时render是否播放动画
    @property(cc.Boolean)
    isShowEffect: Boolean = true;

    public set data(datas) {
        this._data = datas;
        if (null != this._data) {
            for (var e = 0; e < this._data.length; e++) {
                if (this._data[e]) {
                    //preIndex记录先前__index值，在destroy时恢复
                    this._data[e].preIndex = this._data[e].__index;
                    this._data[e].__index = e;
                }
            }

            if (this.node_tips)
                this.node_tips.active = false;
            if (0 === this._data.length) {
                if (this.node_tips)
                    this.node_tips.active = true;
                this.node.width = 0;
                this.node.height = 0;

                null != this.content &&
                    this.content != this.node &&
                    (this.content.width = 0) &&
                    (this.content.height = 0);
            }
        }
        else {
            this.node.width = 0;
            this.node.height = 0;
        }
        this.renderNext();
        if (
            this._renders &&
            this._renders.length > 0 &&
            this.isShowEffect
        ) {
            for (e = 0; e < this._renders.length; e++) {
                this._renders[e].showNodeAnimation();
            }
        }


    }

    public get data() {

        return this._data;
    }


    public set selectHandle(handle: object) {
        this._selectHandle = handle;
    }


    public set selectIndex(index: number) {
        this._selectIndex = index;
        if (null != this._renders) {
            if (null != this._renders) {
                for (var e = 0; e < this._renders.length; e++) {
                    this._renders[e].select = this._renders[e].data == this.selectData;
                }
                null != this._selectHandle && this._selectHandle(this.selectData);
            }
        }
    }

    public set selectData(data: any) {
        null != this._data &&
            (this.selectIndex = this._data.indexOf(data));
    }

    public get selectData() {
        return null == this._data ||
            this._selectIndex >= this._data.length ||
            this._selectIndex < 0
            ? null
            : this._data[this._selectIndex];
    }


    onLoad() {
        if (null != this.item || null != this.itemPrefab) {
            if (this.item) {
                this.item.node.active = false;
                this.item.node.parent = null;
            }
        } else cc.error("List not set item!!!!!!!!!!!!!!!!!!!!!!");
    }

    createRenders(e) {
        var o = this.item ? cc.instantiate(this.item.node) : cc.instantiate(this.itemPrefab);
        o.active = true;
        var renderData = o.getComponent(RenderListItem);
        if (renderData) {
            this._itemHeight = 0 == this._itemHeight || null == this._itemHeight ? renderData.node.height : this._itemHeight;
            this._itemWidth = 0 == this._itemWidth || null == this._itemWidth ? renderData.node.width : this._itemWidth;
            this._renders.push(renderData);
            this.node.addChild(o);
            if (this.isHorizonList) {
                renderData.node.x = (this._itemWidth + this.spaceX) * e + this.paddingLeft;
                renderData.node.y = -this.paddingTop;
            } else {
                renderData.node.x = (this._itemWidth + this.spaceX) * (e % this.repeatX) + this.paddingLeft;
                renderData.node.y = -(this._itemHeight + this.spaceY) * Math.floor(e / this.repeatX) - this.paddingTop;
                this.isReverY && (renderData.node.y = -renderData.node.y);
            }
        } else cc.error("List UI class is base ListItem find");
        var l = o.getComponent(cc.Button);
        if (l && l.clickEvents && l.clickEvents.length > 0) {
            l.clickEvents[0].customEventData = this._data[e];
        }
        if (l && l.clickEvents) {
            var r = new cc.Component.EventHandler();
            r.component = "RenderList";
            r.target = this.node;
            r.handler = "selectItem";
            r.customEventData = this._data[e];
            l.clickEvents.push(r);
        }
        renderData.data = this._data.length > e ? this._data[e] : null;
        if (!this.isDelayRefresh) {
            o.opacity = 0;
        }
    }

    startOntime() {
        if (!this.isDelayRefresh) {
            for (let i = 0; this._renders && i < this._renders.length; i++) {
                this._renders[i].node.opacity = 255;
            }
        }
        this.isDelayRefresh = false;
        if (this.scrollView) {
            this.schedule(this.onTimer, 0.05);
        } else {
            this.onTimer();
        }
        //this.schedule(this.onTimer, 0);
    }

    onDestroy() {

        if (this._data) {
            for (var e = 0; e < this._data.length; e++) {
                if (this._data[e]) {
                    this._data[e].__index = this._data[e].preIndex;
                }
            }
        }

        this.unscheduleAllCallbacks();
        this.selectHandle = null;
        this._data = null;
        if (this.item) {
            this.item.node.destroy();
        }
        if (this._renders) {
            this._renders.forEach(node => {
                node.destroy();
            });
        }
        this._renders = null;
    }

    onTimer() {
        if (null != this._data && null != this._renders) {
            if (null != this.scrollView || this.isDelayRefresh) {
                if (this.isDelayRefresh && this._renders.length >= this.data.length && 0 == this.bufferZone) {
                    this.unscheduleAllCallbacks();
                } else {
                    this.updateShow();
                }
            } else {
                this.unscheduleAllCallbacks();
            }
        }

    }

    createBuffer() {
        if (!this.item && !this.itemPrefab) {
            return;
        }

        let maxBuffer = 0 != this.bufferZone ? this.bufferZone : this._data && this._data.length > 0 ? this._data.length : 0;
        let useData = [];
        for (let i = this._renders.length; i < maxBuffer; i++) {
            useData.push(i);
        }

        if (this.isSynchronizedUpdating) {
            for (let i = this._renders.length; i < maxBuffer; i++) {
                this.createRenders(useData[i]);
            }
            this.startOntime();
        }
        else if (this._renders.length < maxBuffer) {
            let executeAsync = new ExecuteAsync();
            executeAsync.setCallBack(this, this.createRenders.bind(this), this.startOntime);
            executeAsync.createAllItems(useData);
        }
    }

    updateShow() {
        var t = 0,
            e = 0;
        if (this.isHorizonList) {
            t = this.scrollView ? -this.scrollView.getScrollOffset().x : 0;
            e = Math.floor(
                (t - this.paddingLeft) / (this._itemWidth + this.spaceX)
            );
        } else {
            t = this.scrollView ? this.scrollView.getScrollOffset().y : 0;
            e = Math.floor(
                (t - this.paddingTop) / (this._itemHeight + this.spaceY)
            );
        }
        e = Math.min(
            e,
            (this._data.length - this.bufferZone) / this.repeatX
        );
        if ((e = Math.max(e, 0)) != this.lastIndex) {
            var o = this._renders.length;
            this.lastIndex = e;
            e *= this.repeatX;
            for (var i = this.getLastIndexs(e), n = 0; n < o; n++) {
                var l =
                    this._data.length > n + e ? this._data[n + e] : null;
                if (null != l) {
                    var r = null != i[l.__index] ? i[l.__index] : this.getNullIndex();
                    if (-1 != r) {
                        var a = this._renders[r];
                        if (null != a) {
                            this._itemHeight != a.node.height &&
                                0 != this._itemHeight &&
                                a.setWidthHeigth(
                                    this._itemWidth,
                                    this._itemHeight
                                );
                            if (this.isHorizonList) {
                                a.node.x =
                                    (this._itemWidth + this.spaceX) *
                                    (n + e) + this.paddingLeft;
                                a.node.y = -this.paddingTop;
                            } else {
                                a.node.x =
                                    (this._itemWidth + this.spaceX) *
                                    ((n + e) % this.repeatX) + this.paddingLeft;
                                a.node.y =
                                    -(this._itemHeight + this.spaceY) *
                                    Math.floor((n + e) / this.repeatX) -
                                    this.paddingTop;
                                this.isReverY && (a.node.y = -a.node.y);
                            }
                            a.node.active = this._data.length > n + e;
                            /*a.node.data = */a.data = l;
                            //替换button里的数据
                            var btnCom = a.node.getComponent(cc.Button);
                            if (btnCom && btnCom.clickEvents && btnCom.clickEvents.length > 0) {
                                for (let event of btnCom.clickEvents) {
                                    event.customEventData = l;
                                }
                            }
                            a.select = n + e == this._selectIndex;
                        }
                    }
                }
            }
        }
    }

    getLastIndexs(t: number) {
        for (var e = {}, o = this._renders.length, i = 0; i < o; i++) {
            var n = this._renders[i].data;

            if (null != n && (n.__index < t || n.__index >= t + o)) {
                this._renders[i].data = null
            } else {
                if (null != n) {
                    e[n.__index] = i;
                }
            }
        }
        return e;
    }

    getNullIndex() {
        for (var t = 0; t < this._renders.length; t++)
            if (null == this._renders[t].data) return t;
        return -1;
    }

    renderNext() {

        if (this.isHorizonList) {
            this.repeatX = 1;
        }
        this.repeatX = this.repeatX > 0 ? this.repeatX : 1;

        null == this._renders && (this._renders = new Array());
        this.lastIndex = -1;
        if (null != this._data && 0 != this._data.length) {
            this.createBuffer();
            for (o = 0; o < this._renders.length; o++) {
                this._renders[o].data = null;
                this._renders[o].node.active = false;
            }
            e = Math.ceil(this._data.length / this.repeatX);
            var t = Math.min(this._data.length, this.repeatX);
            if (this.isHorizonList) {
                this.node.height = this._itemHeight + this.spaceY + this.paddingTop + this.paddingBottom;
                this.node.width = e * (this._itemWidth + this.spaceX) + this.paddingLeft + this.paddingRight;
                null != this.content &&
                    this.content != this.node &&
                    (this.content.width = this.node.width - this.node.x);
            } else {
                this.node.height = (e - 1) * (this._itemHeight + this.spaceY) + this._itemHeight + this.paddingTop + this.paddingBottom;
                this.node.width = (t - 1) * (this._itemWidth + this.spaceX) + this._itemWidth + this.paddingLeft + this.paddingRight;
                null != this.content &&
                    this.content != this.node &&
                    (this.content.height = this.node.height - this.node.y);
            }
            this.updateShow();
        } else
            for (var e = this._renders.length, o = 0; o < e; o++) {
                var i = this._renders[o];
                /*i.node.data = */i.data = null;
            }
    }



    updateItemShow() {
        if (null != this._renders)
            for (var t = 0; t < this._renders.length; t++)
                this._renders[t].data = this._renders[t].data;
    }

    selectItem(touch, data: any) {
        this.selectData = data;
    }

    setWidthHeight(t: number, e: number) {
        this._itemHeight = e;
        this._itemWidth = t;
        if (null != this._renders)
            for (var o = 0; o < this._renders.length; o++)
                this._renders[o].setWidthHeigth(t, e);
    }

    resetScroll() {
        if (null != this.scrollView) {
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToTopLeft();
        }
    }



    onEnable() {


        if (this.scrollView) {
            this.scrollView.node.on("scrolling", this._onScrollingDrawCallOpt, this);
        }

    }

    onDisable() {

        if (this.scrollView) {
            this.scrollView.node.off("scrolling", this._onScrollingDrawCallOpt, this);
        }
    }

    private _onScrollingDrawCallOpt() {
        if (this.scrollView.content.childrenCount == 0) {
            return;
        }

        this.optDc();
    }

    public optDc() {
        RenderList.optDc(this.scrollView);
    }

    /**
     * 优化 ScrollView Content 节点 DC，可以手动调用
     *
     * 具体为
     *
     * 1. 进入ScrollView可视区域是，回调对应 Content 子节点上挂载的 ScollViewPlusItem 组件的 onEnterScorllViewEvents 数组事件
     * 2. 退出ScrollView可视区域是，回调对应 Content 子节点上挂载的 ScollViewPlusItem 组件的 onExitScorllViewEvents 数组事件
     */
    public static optDc(scrollView: cc.ScrollView) {
        // 获取 ScrollView Node 的左下角坐标在世界坐标系中的坐标
        let svLeftBottomPoint: cc.Vec2 = scrollView.node.parent.convertToWorldSpaceAR(
            cc.v2(
                scrollView.node.x - scrollView.node.anchorX * scrollView.node.width,
                scrollView.node.y - scrollView.node.anchorY * scrollView.node.height
            )
        );

        // 求出 ScrollView 可视区域在世界坐标系中的矩形（碰撞盒）
        let svBBoxRect: cc.Rect = cc.rect(svLeftBottomPoint.x, svLeftBottomPoint.y, scrollView.node.width, scrollView.node.height);

        // 遍历 ScrollView Content 内容节点的子节点，对每个子节点的包围盒做和 ScrollView 可视区域包围盒做碰撞判断
        scrollView.content.children.forEach((childNode: cc.Node) => {


            // 如果相交了，那么就显示，否则就隐藏
            let childNodeBBox = childNode.getBoundingBoxToWorld();
            if (childNodeBBox.intersects(svBBoxRect)) {
                childNode.opacity = 255;
            } else {
                childNode.opacity = 0;
            }
        });
    }







}
