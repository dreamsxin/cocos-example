"use strict";
cc._RF.push(module, '1c0fev234pLRYhyZA8zwdJO', 'Game');
// scripts/Game.ts

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
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bullet = null;
        _this.badguy = null;
        _this.scoreLabel = null;
        _this.gun = null;
        // LIFE-CYCLE CALLBACKS:
        _this.posX = 0;
        _this.posY = 0;
        _this.score = 0;
        return _this;
        // update (dt) {}
    }
    NewClass.prototype.addScore = function () {
        this.score += 10;
        this.scoreLabel.string = "SCORE :" + this.score.toString();
    };
    NewClass.prototype.spawn = function (event) {
        var newBullet = cc.instantiate(this.bullet);
        newBullet.setPosition(this.node.getChildByName('soldier1').position.x, this.node.getChildByName('soldier1').position.y);
        this.node.addChild(newBullet);
        var mousePosition = event.getLocation();
        mousePosition = this.node.convertToNodeSpaceAR(mousePosition);
        this.posX = mousePosition.x;
        this.posY = mousePosition.y;
        var actionBy = cc.moveTo(0.2, cc.v2(this.posX, this.posY));
        var destruction = cc.callFunc(function () {
            newBullet.destroy();
        }, this);
        var sequence = cc.sequence(actionBy, destruction);
        newBullet.runAction(sequence);
        cc.audioEngine.playEffect(this.gun, false);
    };
    NewClass.prototype.createBad = function () {
        var newBadGuy = cc.instantiate(this.badguy);
        var positions = [
            cc.v2(-778, 458), cc.v2(778, -458), cc.v2(779, 6), cc.v2(-700, 20),
            cc.v2(778, 700), cc.v2(-778, -758), cc.v2(779, 200), cc.v2(-700, 20), cc.v2(779, -200), cc.v2(-250, 0),
            cc.v2(-250, -150), cc.v2(-250, 100), cc.v2(-250, 500)
        ];
        var badGuyPosition = Math.floor(Math.random() * positions.length);
        newBadGuy.setPosition(positions[badGuyPosition]);
        this.node.addChild(newBadGuy);
    };
    NewClass.prototype.onLoad = function () {
        this.node.on('mousedown', this.spawn, this);
        this.schedule(this.createBad, 1, cc.macro.REPEAT_FOREVER, 3);
    };
    NewClass.prototype.start = function () {
    };
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "bullet", void 0);
    __decorate([
        property(cc.Prefab)
    ], NewClass.prototype, "badguy", void 0);
    __decorate([
        property(cc.Label)
    ], NewClass.prototype, "scoreLabel", void 0);
    __decorate([
        property({
            type: cc.AudioClip
        })
    ], NewClass.prototype, "gun", void 0);
    __decorate([
        property
    ], NewClass.prototype, "posX", void 0);
    NewClass = __decorate([
        ccclass
    ], NewClass);
    return NewClass;
}(cc.Component));
exports.default = NewClass;

cc._RF.pop();