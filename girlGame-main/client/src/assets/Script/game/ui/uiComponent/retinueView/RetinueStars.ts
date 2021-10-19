// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export default class RetinueStars extends cc.Component {


    private _star = 0;
    public set star(num: number) {
        this._star = num;
        let children = this.node.children;
        for (let i = 0; i < children.length; i++) {
            children[i].opacity = 0;
        }
        let len = this._star;
        if (this._star > 5) {
            len = this._star - this._star / 5 * 5;
            if (len === 0) {
                len = 5;
            }
        }
        for (let i = 0; i < len; i++) {
            children[i].opacity = 255;
        }
    }

    public get star() {
        return this._star;
    }
}
