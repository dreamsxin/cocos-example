// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import {app} from "./App";
import SysDef, {DebugMode} from "./util/SysDef";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    @property({type:cc.Enum(DebugMode)})
    DevMode: DebugMode = DebugMode.Dev;
     onLoad () {
         const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && /iPhone OS 14/.test(window.navigator.userAgent);
         if (isIOS14Device) {
             cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
                 if (this.vertexOffset + vertexCount > 65535) {
                     this.uploadData();
                     this._batcher._flush();
                 }
             };
             cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
                 this.uploadData();
                 this.switchBuffer();
             };
         }
             SysDef.DebugMode = this.DevMode;
         app.onLoad();
    }

     onEnable () {
        app.onEnable();
    }
     start () {
        app.start();
    }

     update (dt)
    {
        app.update(dt);
    }
     onDisable () {
        app.onDisable()
    }
     onDestroy () {
        app.onDestroy()
    }
}
