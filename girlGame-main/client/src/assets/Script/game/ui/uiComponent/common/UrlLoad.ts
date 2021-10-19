// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { resLoader } from "../../../../base/res/ResLoader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UrlLoad extends cc.Component {

    //onLoad () {}

    private _res: string = null;
    private _url: string = null;
    private _animation: string = 'idle';
    private _bRepeat: boolean = true;
    private _loadHandle = null;
    private _target = null;

    public set animation(animation: string) {
        this._animation = animation;
    }

    public set bRepeat(repeat: boolean) {
        this._bRepeat = repeat;
    }

    public get url() {
        return this._url;
    }

    public set url(url: string) {
        if (this._url === url) {
            // if (this._animation) {
            //     this.playAnimation();
            // }
            //
            // if (this._loadHandle) {
            //     this._loadHandle.apply(this._target);
            // }
            return;
        }
        this._url = url;
        this.onChangeUrl();
    }


    onChangeUrl() {
        let self = this,
            url = this._url;
        if (!url) {
            this.reset();
        }
        else if (null != url && 0 != url.length) {
            this.reset();
            if (this.node && this.node.getComponent(cc.Sprite)) {
                //替换sprite
                resLoader.loadRes(url, cc.SpriteFrame, function (error, res) {
                    if (null == error && null != res) {
                        self._res = self._url = url;
                        if (self.node) {
                            //let material = self.node.getComponent(cc.Sprite).getMaterial(0);
                            self.node.getComponent(cc.Sprite).spriteFrame = res;
                            //self.node.getComponent(cc.Sprite).setMaterial(0, material);

                        }
                        if (self._loadHandle) {
                            self._loadHandle.apply(self._target);
                        }
                    } else cc.error(JSON.stringify(error));
                })
            }
            else if (this.node && this.node.getComponent(sp.Skeleton)) {
                let animation = this._animation;
                let spineCom = this.node.getComponent(sp.Skeleton);
                //替换spine
                resLoader.loadRes(url, sp.SkeletonData, (error, res) => {
                    if (error != null || null == res) {
                        cc.error(JSON.stringify(error));
                        return;
                    }
                    self._res = self._url = url;
                    spineCom.skeletonData = res;
                    if (animation) {
                        //这里直接调用会出现bug，延时一帧调用
                        self.scheduleOnce(self.playAnimation, 0);
                    }


                    if (self._loadHandle) {
                        self._loadHandle.apply(self._target);
                    }
                })
            }
            /*
                        -1 != url.indexOf("prefabs/") ?
                            resLoader.loadRes(url, function (o, i) {
                                if (null == o && null != i) {
                                    self.node && self.node.childrenCount > 0 && self.reset();
                                    self._res = self._url = url;
                                    let n = cc.instantiate(i);
                                    self.content = n;
                                    self.node && self.node.addChild(n);
                                    null != self._loadHandle &&
                                        self._loadHandle.apply(self._target);
                                } else cc.warn(JSON.stringify(o));
                            }) :
                            -1 != url.indexOf("http") &&
                            resLoader.loadRes(url, function (o: any, i: string | cc.Texture2D) {
                                if (null != i) {
                                    self._res = self._url = url;
                                    let n = new cc.SpriteFrame(i);
                                    self.node &&
                                        (self.node.getComponent(
                                            cc.Sprite
                                        ).spriteFrame = n);
                                    null != self._loadHandle &&
                                        self._loadHandle.apply(self._target);
                                } else cc.warn(JSON.stringify(o));
                            });*/
        } else this.reset();
    };

    setAnimation(name, loop) {
        this.animation = name;
        this.bRepeat = loop;
    }

    playAnimation() {
        let animation = this._animation;
        let spineCom = this.node.getComponent(sp.Skeleton);
        if (animation && spineCom) {
            spineCom.setAnimation(0, animation, this._bRepeat);
        }

    }


    setCallBack(call: Function, target: any) {
        this._loadHandle = call;
        this._target = target;
    }

    reset = function () {
        this._url = null;
        if (null == this.node) return;
        var t = this.node.getComponent(cc.Sprite);
        if (null != t && null != t.spriteFrame) {
            t.spriteFrame = null;
        } else {
            t = this.node.getComponent(sp.Skeleton);
            if (null != t && null != t.skeletonData) {
                t.skeletonData = null;
            }
        }

        this.clearRes();
    };

    clearRes() {
        if (this._res) {
            this._res = null;
        }
    };

    onDestroy() {
        this._loadHandle = null;
        this._target = null;
        this.reset();
        this.clearRes();
    };

    // update (dt) {}
}
