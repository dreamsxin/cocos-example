"use strict";
cc._RF.push(module, '749bbO5LMlCCagmHxFsxAj/', 'bad');
// scripts/bad.ts

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NewClass = /** @class */ (function (_super) {
    __extends(NewClass, _super);
    function NewClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // LIFE-CYCLE CALLBACKS:
    NewClass.prototype.onCollisionEnter = function (other, self) {
        if (other.tag == 2) {
            this.node.destroy();
            this.node.parent.getComponent('Game').addScore();
        }
        if (other.tag == 1) {
            cc.director.loadScene("Game");
        }
    };
    NewClass.prototype.moveToPlayer = function () {
        var moveAction = cc.moveTo(3, this.node.parent.getChildByName('soldier1').position.x, this.node.parent.getChildByName('soldier1').position.y);
        return moveAction;
    };
    NewClass.prototype.onLoad = function () {
        this.action = this.moveToPlayer();
        this.node.runAction(this.action);
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        cc.director.preloadScene("Game");
    };
    NewClass.prototype.start = function () {
    };
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();