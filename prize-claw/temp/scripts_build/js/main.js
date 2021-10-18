"use strict";
cc._RFpush(module, '235d9P0nsBF2Kyx+d+FoM2u', 'main');
// js\main.js

'use strict';

var _game = require('game');

var _game2 = _interopRequireDefault(_game);

var _shop = require('shop');

var _shop2 = _interopRequireDefault(_shop);

var _audio = require('audio');

var _audio2 = _interopRequireDefault(_audio);

var _record = require('record');

var _record2 = _interopRequireDefault(_record);

var _login = require('login');

var _login2 = _interopRequireDefault(_login);

var _api = require('api');

var _api2 = _interopRequireDefault(_api);

var _user = require('user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addScript = function addScript(uri) {
    var script = document.createElement('script');
    document.body.appendChild(script);
    script.src = uri;
    return {
        then: function then(func) {
            func ? script.onload = func : null;
        }
    };
};

addScript('//cdn.yoosh.tv/js/axios.min.js').then(function () {
    axios.defaults.withCredentials = true;
});

if (location.search.includes('alpha')) {
    addScript('//cdn.yoosh.tv/js/eruda.min.js').then(function () {
        return eruda.init();
    });
}

var openCollision = function openCollision() {
    var manager = cc.director.getCollisionManager();
    manager.enabled = true;

    /*
    * 开启 debug 模式
    * 正式环境下关闭
    */
    if (location.port === '7456') {
        manager.enabledDebugDraw = true;
    }
};

cc.Class({
    extends: cc.Component,
    properties: {
        game: {
            default: null,
            type: _game2.default
        },
        shop: {
            default: null,
            type: _shop2.default
        },
        audio: {
            default: null,
            type: _audio2.default
        },
        record: {
            default: null,
            type: _record2.default
        },
        login: {
            default: null,
            type: _login2.default
        }
    },
    onLoad: function onLoad() {
        var _this = this;

        // 开启碰撞检测
        openCollision();

        window._main = this;

        //
        this.gift = this.node.getChildByName('game').getComponent('gift');

        this.api = _api2.default;

        this.spriteFrames = this.node.getComponent('spriteFrame');

        this.game.node.active = false;

        _api2.default.getUserInfo().then(function (res) {
            if (!res.data.ok) {
                var code = _api2.default.getParam('code');
                if (code) {
                    _api2.default.login(code).then(function (res) {
                        if (res.data.ok) {
                            _user2.default.nickname = res.data.r.nickname;
                            _user2.default.balance = res.data.r.balance;
                            _user2.default.phone = res.data.r.phone;
                            _user2.default.avatar = res.data.r.profileImg;
                            _user2.default.starsNum = res.data.r.starsNum;
                            _this.user = _user2.default;

                            _this.game.score.getComponent(cc.Label).string = _user2.default.balance;

                            _this.game.node.active = true;
                            _this.game.updateStars();
                        }
                    });
                } else _api2.default.authorize();
            } else {
                _user2.default.nickname = res.data.r.nickname;
                _user2.default.balance = res.data.r.balance;
                _user2.default.phone = res.data.r.phone;
                _user2.default.avatar = res.data.r.profileImg;
                _user2.default.starsNum = res.data.r.starsNum;

                _this.user = _user2.default;

                _this.game.score.getComponent(cc.Label).string = _user2.default.balance;

                _this.game.node.active = true;
                _this.game.updateStars();
            }
        });
    }
});

cc._RFpop();