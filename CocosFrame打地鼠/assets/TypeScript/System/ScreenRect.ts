// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ScreenRect extends cc.Component {
    @property
    public maxHeight: number = 1200;
    @property
    public minHeight: number = 1000;

    public static Ins:ScreenRect = null;
    public static width:number = 640;
    public static height:number = 1136;
    onLoad() {
        ScreenRect.Ins = this;
        let widget: cc.Widget = this.node.getComponent(cc.Widget);
        let winSize = cc.winSize;
        if (winSize.height > this.maxHeight) {
            widget.top = widget.bottom = (winSize.height - this.maxHeight) / 2;
        }
        if (winSize.height < this.minHeight) {
            this.node.scale = winSize.height / this.minHeight;
            this.node.height = this.minHeight;
        }
        ScreenRect.width = this.node.width;
        ScreenRect.height = this.node.height;
    }
}
